"""知识检索引擎：优先使用 ChromaDB 向量检索，不可用时回退到关键词匹配"""
import json
from .loader import load_all_knowledge_entries

# ============================================================
# 回退方案：基于关键词的简单检索（无需 ChromaDB）
# ============================================================
_knowledge_cache: list[dict] = []


def _get_cached_entries() -> list[dict]:
    """获取缓存的知识条目"""
    global _knowledge_cache
    if not _knowledge_cache:
        _knowledge_cache = load_all_knowledge_entries()
    return _knowledge_cache


def _keyword_retrieve(query: str, n_results: int = 5) -> list[dict]:
    """关键词匹配检索（ChromaDB 不可用时的回退方案）"""
    entries = _get_cached_entries()
    if not entries:
        return []

    keywords = set(query.lower().split())

    scored = []
    for entry in entries:
        score = 0
        text = (
            entry.get("embedding_text", "") + " " +
            entry.get("title_zh", "") + " " +
            entry.get("title_en", "") + " " +
            json.dumps(entry.get("content", {}), ensure_ascii=False)
        ).lower()

        for kw in keywords:
            if kw in text:
                score += 1

        # 标签精确匹配加分
        if entry.get("module", "") in query or entry.get("type", "") in query:
            score += 2

        if score > 0:
            scored.append((score, entry))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = []
    for score, entry in scored[:n_results]:
        content = entry.get("content", {})
        results.append({
            "id": entry.get("id", ""),
            "title_zh": entry.get("title_zh", ""),
            "title_en": entry.get("title_en", ""),
            "module": entry.get("module", ""),
            "type": entry.get("type", ""),
            "content": content,
            "relevance_score": min(1.0, score / max(len(keywords), 1)),
        })

    return results


# ============================================================
# ChromaDB 向量检索（可选）
# ============================================================
_use_chromadb = False

try:
    import chromadb
    from chromadb.utils import embedding_functions
    _use_chromadb = True
    print("[INFO] ChromaDB 已加载，将使用向量检索")
except ImportError:
    print("[INFO] ChromaDB 未安装，将使用关键词检索（功能正常，精度略低）")


def _chromadb_collection():
    """获取或创建 ChromaDB collection"""
    from ..config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME

    ef = embedding_functions.DefaultEmbeddingFunction()
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    collection = client.get_or_create_collection(
        name=CHROMA_COLLECTION_NAME,
        embedding_function=ef,
        metadata={"description": "巴蜀文化双语知识库"},
    )
    return collection


def index_knowledge_base(force_reindex: bool = False):
    """索引所有知识条目到 ChromaDB（需要 ChromaDB 已安装）"""
    if not _use_chromadb:
        print("[INFO] ChromaDB 不可用，知识库已通过关键词检索可用，跳过索引")
        return len(_get_cached_entries())

    collection = _chromadb_collection()

    if collection.count() > 0 and not force_reindex:
        print(f"[INFO] ChromaDB 已有 {collection.count()} 条记录，跳过索引")
        return collection.count()

    if force_reindex and collection.count() > 0:
        all_ids = collection.get()["ids"]
        if all_ids:
            collection.delete(ids=all_ids)

    from .loader import iter_documents
    docs = list(iter_documents())
    if not docs:
        print("[WARN] 无知识条目可索引")
        return 0

    ids = [d[0] for d in docs]
    texts = [d[1] for d in docs]
    metadatas = [d[2] for d in docs]

    collection.add(ids=ids, documents=texts, metadatas=metadatas)
    print(f"[INFO] ChromaDB 索引完成，共 {len(ids)} 条记录")
    return len(ids)


def retrieve_knowledge(query: str, n_results: int = 5) -> list[dict]:
    """检索知识：优先 ChromaDB，回退关键词匹配"""
    if _use_chromadb:
        try:
            collection = _chromadb_collection()
            if collection.count() == 0:
                index_knowledge_base()

            if collection.count() > 0:
                results = collection.query(
                    query_texts=[query],
                    n_results=min(n_results, collection.count()),
                )
                entries = []
                if results["ids"] and results["ids"][0]:
                    for i, doc_id in enumerate(results["ids"][0]):
                        metadata = results["metadatas"][0][i] if results["metadatas"] else {}
                        distance = results["distances"][0][i] if results["distances"] else 0

                        content = {}
                        if "content_json" in metadata:
                            try:
                                content = json.loads(metadata["content_json"])
                            except (json.JSONDecodeError, TypeError):
                                pass

                        entries.append({
                            "id": doc_id,
                            "title_zh": metadata.get("title_zh", ""),
                            "title_en": metadata.get("title_en", ""),
                            "module": metadata.get("module", ""),
                            "type": metadata.get("type", ""),
                            "content": content,
                            "relevance_score": max(0, 1 - distance),
                        })
                return entries
        except Exception as e:
            print(f"[WARN] ChromaDB 检索失败: {e}，回退到关键词检索")

    return _keyword_retrieve(query, n_results)


def retrieve_for_question(question_tags: list[str], n_results: int = 5) -> list[dict]:
    """根据题目标签检索知识点：先按ID精准匹配，再按关键词补充"""
    if not question_tags:
        return retrieve_knowledge("巴蜀文化 四川 历史 自然遗产 非物质文化遗产", n_results)

    results = []

    # Step 1: 按 ID 精准匹配
    all_entries = _get_cached_entries()
    id_map = {e["id"]: e for e in all_entries}

    for tag in question_tags:
        tag_clean = tag.strip().strip('"').strip("'")
        if tag_clean in id_map:
            entry = id_map[tag_clean]
            results.append({
                "id": entry["id"],
                "title_zh": entry.get("title_zh", ""),
                "title_en": entry.get("title_en", ""),
                "module": entry.get("module", ""),
                "type": entry.get("type", ""),
                "content": entry.get("content", {}),
                "relevance_score": 1.0,  # 精准匹配满分
            })

    # Step 2: 如果精准匹配不够，用标签对应条目的标题做关键词补充检索
    if len(results) < n_results:
        # 提取匹配条目的标题关键词
        extra_keywords = []
        for r in results:
            extra_keywords.append(r["title_zh"])
        keyword_query = " ".join(question_tags + extra_keywords)
        keyword_results = retrieve_knowledge(keyword_query, n_results)

        # 去重合并
        existing_ids = {r["id"] for r in results}
        for kr in keyword_results:
            if kr["id"] not in existing_ids:
                results.append(kr)
                existing_ids.add(kr["id"])
                if len(results) >= n_results:
                    break

    return results[:n_results] if results else retrieve_knowledge(
        "巴蜀文化 四川 历史 自然遗产 非物质文化遗产", n_results
    )
