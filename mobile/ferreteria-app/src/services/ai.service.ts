import * as FileSystem from "expo-file-system/legacy";

const AI_API_URL = "http://192.168.0.2:8002/ai";

export async function classifyProductImage(uri: string) {
  const imageBase64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch(`${AI_API_URL}/classify-product-mobile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: "martillo.jpg",
      image_base64: imageBase64,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Error al clasificar imagen");
  }

  return JSON.parse(text);
}
