"""知识库加载器：从 JSON 文件读取知识条目并初始化 ChromaDB 向量索引"""
import json
import os
from typing import Iterator
from ..config import KNOWLEDGE_SEED_DIR


def load_all_knowledge_entries() -> list[dict]:
    """加载所有知识库种子数据文件"""
    entries = []
    if not os.path.isdir(KNOWLEDGE_SEED_DIR):
        print(f"[WARN] 知识库目录不存在: {KNOWLEDGE_SEED_DIR}")
        return entries

    for filename in sorted(os.listdir(KNOWLEDGE_SEED_DIR)):
        if filename.endswith(".json"):
            filepath = os.path.join(KNOWLEDGE_SEED_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    entries.extend(data)
                else:
                    entries.append(data)
            print(f"[INFO] 加载知识库文件: {filename} ({len(data) if isinstance(data, list) else 1} 条)")

    print(f"[INFO] 知识库总计加载 {len(entries)} 条条目")
    return entries


def entry_to_document(entry: dict) -> tuple[str, str, dict]:
    """
    将知识条目转为 ChromaDB 文档格式
    返回: (doc_id, embedding_text, metadata)
    """
    doc_id = entry["id"]
    embedding_text = entry.get("embedding_text", "")

    # 如果 embedding_text 为空，自动生成
    if not embedding_text:
        content = entry.get("content", {})
        parts = [
            entry.get("title_zh", ""),
            entry.get("title_en", ""),
            content.get("summary_zh", ""),
        ]
        embedding_text = " ".join(filter(None, parts))

    metadata = {
        "title_zh": entry.get("title_zh", ""),
        "title_en": entry.get("title_en", ""),
        "module": entry.get("module", ""),
        "type": entry.get("type", ""),
        "content_json": json.dumps(entry.get("content", {}), ensure_ascii=False),
    }

    return doc_id, embedding_text, metadata


def iter_documents() -> Iterator[tuple[str, str, dict]]:
    """迭代所有知识条目的文档格式"""
    entries = load_all_knowledge_entries()
    for entry in entries:
        yield entry_to_document(entry)
