const AI_API_URL = "http://192.168.0.2:8002/ai";

export async function sendVoiceQuery(audioUri: string) {
  const response = await fetch(`${AI_API_URL}/voice-query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: "voice-query.m4a",
      audio_base64: "demo_audio_grabado_desde_microfono",
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Error al procesar audio");
  }

  return JSON.parse(text);
}
