from datetime import datetime, timezone

AI_LOGS = []

def save_ai_log(action: str, input_data: dict, result: dict):
    log = {
        "action": action,
        "input_data": input_data,
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    AI_LOGS.append(log)

    return log


def list_ai_logs():
    return AI_LOGS