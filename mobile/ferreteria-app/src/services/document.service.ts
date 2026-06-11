import * as FileSystem from "expo-file-system/legacy";

const DOCUMENT_API_URL = "http://192.168.0.2:8003/documents";

export async function uploadDeliveryEvidence(
  photoUri: string,
  idEntrega: number,
) {
  const imageBase64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch(`${DOCUMENT_API_URL}/upload-mobile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: `evidencia-entrega-${idEntrega}.jpg`,
      imageBase64: imageBase64,
      documentType: "COMPROBANTE_ENTREGA",
      relatedType: "ENTREGA",
      relatedId: idEntrega,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Error al subir evidencia");
  }

  return JSON.parse(text);
}
