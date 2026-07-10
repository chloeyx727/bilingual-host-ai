"""讯飞 ISE (Intelligent Speech Evaluation) WebSocket 流式语音评测 API 封装"""
import hashlib
import hmac
import base64
import json
import time
import asyncio
from urllib.parse import urlencode
from ..config import (
    IFLYTEK_APP_ID,
    IFLYTEK_API_KEY,
    IFLYTEK_API_SECRET,
)

ISE_HOST = "ise-api.xfyun.cn"
ISE_PATH = "/v2/open-ise"
ISE_URL = f"wss://{ISE_HOST}{ISE_PATH}"


def _build_auth_url() -> str:
    """构建 WebSocket 鉴权 URL"""
    # RFC 1123 date
    import locale
    import datetime

    # Save locale and set to C for RFC 1123 format
    saved = locale.getlocale(locale.LC_TIME)
    try:
        locale.setlocale(locale.LC_TIME, 'C')
    except:
        pass
    date = datetime.datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    try:
        locale.setlocale(locale.LC_TIME, saved)
    except:
        pass

    # 签名原始字符串
    signature_origin = f"host: {ISE_HOST}\ndate: {date}\nGET {ISE_PATH} HTTP/1.1"

    # HMAC-SHA256 签名
    signature = base64.b64encode(
        hmac.new(
            IFLYTEK_API_SECRET.encode(),
            signature_origin.encode(),
            hashlib.sha256,
        ).digest()
    ).decode()

    # 组装 authorization
    authorization_origin = (
        f'api_key="{IFLYTEK_API_KEY}", '
        f'algorithm="hmac-sha256", '
        f'headers="host date request-line", '
        f'signature="{signature}"'
    )
    authorization = base64.b64encode(authorization_origin.encode()).decode()

    # 组装 URL
    params = urlencode({
        "authorization": authorization,
        "date": date,
        "host": ISE_HOST,
    })

    return f"{ISE_URL}?{params}"


async def evaluate_speech_ws(
    audio_bytes: bytes,
    text_ref: str = "",
    language: str = "en",
    category: str = "read_sentence",
) -> dict:
    """
    通过 WebSocket 流式调用讯飞语音评测 API

    Args:
        audio_bytes: 原始音频数据 (16kHz, 16bit, mono PCM 或 WAV)
        text_ref: 参考文本（跟读模式需要）
        language: "en" | "cn"
        category: "read_sentence" | "read_word" | "free_speech"

    Returns:
        {total_score, accuracy_score, fluency_score, integrity_score, words, error}
    """
    if not IFLYTEK_APP_ID or IFLYTEK_APP_ID == "your-iflytek-appid":
        return {"error": "讯飞API未配置", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    url = _build_auth_url()

    # 业务参数
    business = {
        "ent": "en-comp" if language == "en" else "cn-comp",
        "aue": "raw",
        "auf": "audio/L16;rate=16000",
        "category": category,
        "rst": "plain",
        "ise_unite": "1",
        "extra_ability": json.dumps({"multi_dimension": 1}),
        "sub": "ise",
    }

    if text_ref and category != "free_speech":
        # 参考文本需要 base64 编码
        business["text"] = base64.b64encode(text_ref.encode("utf-8")).decode()
        business["tte"] = "utf-8"

    # 公共参数
    common = {"app_id": IFLYTEK_APP_ID}

    try:
        import websockets
    except ImportError:
        return {"error": "缺少websockets库，请运行: pip install websockets", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    final_result = None

    try:
        async with websockets.connect(url, ping_interval=5) as ws:
            # Step 1: 发送开始帧
            start_frame = {
                "common": common,
                "business": business,
                "data": {
                    "status": 0,
                    "format": "audio/L16;rate=16000",
                    "encoding": "raw",
                },
            }
            await ws.send(json.dumps(start_frame))

            # Step 2: 分片发送音频（每片5KB）
            chunk_size = 5120  # 5KB per chunk
            total_len = len(audio_bytes)
            offset = 0

            while offset < total_len:
                end = min(offset + chunk_size, total_len)
                chunk = audio_bytes[offset:end]
                status = 2 if end >= total_len else 1

                frame = {
                    "business": {
                        "ent": business["ent"],
                        "aue": "raw",
                        "auf": "audio/L16;rate=16000",
                    },
                    "data": {
                        "status": status,
                        "format": "audio/L16;rate=16000",
                        "encoding": "raw",
                        "audio": base64.b64encode(chunk).decode(),
                    },
                }
                await ws.send(json.dumps(frame))
                offset = end
                await asyncio.sleep(0.01)  # 微停顿，避免发送过快

            # Step 3: 接收结果
            async for message in ws:
                try:
                    result = json.loads(message)
                    code = result.get("code", -1)

                    if code != 0:
                        return {
                            "error": f"讯飞错误: code={code}, msg={result.get('message', result.get('desc', ''))}",
                            "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": [],
                        }

                    # 检查是否是最终结果帧
                    data = result.get("data", {})
                    if data.get("status") == 2:
                        final_result = result
                        break
                except json.JSONDecodeError:
                    continue

    except asyncio.TimeoutError:
        return {"error": "讯飞WebSocket连接超时", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}
    except Exception as e:
        return {"error": f"WebSocket错误: {str(e)}", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    if not final_result:
        return {"error": "未收到讯飞评测结果", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    # Step 4: 解析最终结果
    return _parse_ise_result(final_result, language, category)


def _parse_ise_result(result: dict, language: str, category: str) -> dict:
    """解析讯飞 ISE 返回的评测结果"""
    data = result.get("data", {})
    result_str = data.get("result", "")

    if not result_str:
        return {"error": "讯飞返回空结果", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    try:
        result_json = json.loads(base64.b64decode(result_str).decode())
    except Exception:
        try:
            result_json = json.loads(result_str)
        except Exception:
            return {"error": "解析讯飞结果失败", "total_score": 0, "accuracy_score": 0, "fluency_score": 0, "integrity_score": 0, "words": []}

    # 提取评分
    read_sentence = result_json.get("read_sentence", result_json)
    rec_paper = read_sentence.get("rec_paper", {})

    total = float(rec_paper.get("total_score", 0))
    accuracy = float(rec_paper.get("accuracy_score", 0))
    fluency = float(rec_paper.get("fluency_score", 0))
    integrity = float(rec_paper.get("integrity_score", 0))

    # 提取逐词详情
    words_out = []
    frames = read_sentence.get("frames", [])
    for frame in frames:
        for w in frame.get("words", []):
            words_out.append({
                "word": w.get("word", ""),
                "score": float(w.get("total_score", 0)),
                "pronunciation": w.get("is_correct", True),
            })

    return {
        "total_score": round(total, 1),
        "accuracy_score": round(accuracy, 1),
        "fluency_score": round(fluency, 1),
        "integrity_score": round(integrity, 1),
        "words": words_out[:20],
        "error": None,
        "language": language,
        "category": category,
    }


async def evaluate_bilingual(
    audio_cn_bytes: bytes = b"",
    audio_en_bytes: bytes = b"",
    text_cn: str = "",
    text_en: str = "",
) -> dict:
    """双语语音评测"""
    results = {}

    if audio_cn_bytes:
        cat = "read_sentence" if text_cn else "free_speech"
        results["chinese"] = await evaluate_speech_ws(audio_cn_bytes, text_cn or "", "cn", cat)
    else:
        results["chinese"] = None

    if audio_en_bytes:
        cat = "read_sentence" if text_en else "free_speech"
        results["english"] = await evaluate_speech_ws(audio_en_bytes, text_en or "", "en", cat)
    else:
        results["english"] = None

    scores = []
    if results.get("chinese") and not results["chinese"].get("error"):
        scores.append(results["chinese"]["total_score"])
    if results.get("english") and not results["english"].get("error"):
        scores.append(results["english"]["total_score"])

    combined = round(sum(scores) / len(scores), 1) if scores else 0

    return {
        "chinese": results["chinese"],
        "english": results["english"],
        "combined_score": combined,
    }
