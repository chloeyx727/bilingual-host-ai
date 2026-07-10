"""DeepSeek API 统一调用封装（兼容 OpenAI SDK）"""
import json
import asyncio
from openai import AsyncOpenAI
from ..config import DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL

# 初始化异步客户端
_client = AsyncOpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)


async def call_deepseek(
    system_prompt: str,
    user_message: str = "",
    temperature: float = 0.3,
    max_tokens: int = 2000,
    response_format: str = "json_object",
) -> dict:
    """
    调用 DeepSeek API，返回解析后的 JSON 字典。
    如果 API 返回非 JSON 内容，尝试从文本中提取 JSON。
    """
    # 构建消息
    messages = [{"role": "system", "content": system_prompt}]
    if user_message:
        messages.append({"role": "user", "content": user_message})

    try:
        response = await _client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": response_format} if response_format == "json_object" else None,
        )

        content = response.choices[0].message.content.strip()

        # 尝试直接解析 JSON
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # 尝试从文本中提取 JSON（处理 DeepSeek 偶尔返回额外文本的情况）
            start = content.find("{")
            end = content.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(content[start:end])
            # 无法解析，返回原始文本
            return {"raw_output": content, "parse_error": True}

    except Exception as e:
        return {"error": str(e), "parse_error": True}


async def call_deepseek_with_retry(
    system_prompt: str,
    user_message: str = "",
    max_retries: int = 2,
    **kwargs,
) -> dict:
    """带重试的 DeepSeek API 调用"""
    for attempt in range(max_retries + 1):
        result = await call_deepseek(system_prompt, user_message, **kwargs)
        if "error" not in result:
            return result
        if attempt < max_retries:
            await asyncio.sleep(1 * (attempt + 1))  # 递增等待
    return result


async def run_parallel_calls(tasks: list[dict]) -> list[dict]:
    """
    并行执行多个 DeepSeek API 调用

    Args:
        tasks: [{"system_prompt": ..., "user_message": ..., "label": "..."}, ...]

    Returns:
        按原始顺序返回的结果列表
    """
    async def _run_one(task):
        result = await call_deepseek_with_retry(
            system_prompt=task["system_prompt"],
            user_message=task.get("user_message", ""),
        )
        result["_label"] = task.get("label", "")
        return result

    return await asyncio.gather(*[_run_one(t) for t in tasks])
