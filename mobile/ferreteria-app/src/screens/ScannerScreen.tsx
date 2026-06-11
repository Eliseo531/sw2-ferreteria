import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { client } from "../graphql/apollo";
import { classifyProductImage } from "../services/ai.service";
import { PRODUCTS_STOCK_QUERY } from "../services/inventory.service";

export function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState<any>(null);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    setPhotoUri(photo.uri);
    setResult(null);
    setMatchedProduct(null);
  };

  const analyzePhoto = async () => {
    if (!photoUri) return;

    try {
      setLoading(true);

      const response = await classifyProductImage(photoUri);
      setResult(response);

      const productsResult = await client.query({
        query: PRODUCTS_STOCK_QUERY,
        fetchPolicy: "network-only",
      });

      const products = (productsResult.data as any)?.products || [];

      const found = products.find((product: any) =>
        product.nombre.toLowerCase().includes(response.product.toLowerCase()),
      );

      setMatchedProduct(found || null);
    } catch (error: any) {
      console.error("ERROR IA:", error);
      alert(error.message || "No se pudo analizar la imagen");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhotoUri(null);
    setResult(null);
    setMatchedProduct(null);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Verificando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitamos permiso para usar la cámara.</Text>
        <Button title="Permitir cámara" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Escanear producto</Text>

      {!photoUri ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <Button title="Tomar foto" onPress={takePhoto} />
        </>
      ) : (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button title="Analizar con IA" onPress={analyzePhoto} />
          )}

          <Button title="Tomar otra foto" onPress={reset} />
        </>
      )}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Resultado IA</Text>
          <Text>Producto: {result.product}</Text>
          <Text>Categoría: {result.category}</Text>
          <Text>Confianza: {result.confidence}</Text>
        </View>
      )}

      {matchedProduct && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Datos en inventario</Text>
          <Text>ID Producto: {matchedProduct.idProducto}</Text>
          <Text>Nombre: {matchedProduct.nombre}</Text>
          <Text>Stock actual: {matchedProduct.stockActual}</Text>
          <Text>Stock mínimo: {matchedProduct.stockMinimo}</Text>
          <Text>Precio: Bs {matchedProduct.precioVenta}</Text>
          <Text>
            Estado:{" "}
            {matchedProduct.stockActual <= 0
              ? "AGOTADO"
              : matchedProduct.stockActual <= matchedProduct.stockMinimo
                ? "STOCK BAJO"
                : "NORMAL"}
          </Text>
        </View>
      )}

      {result && !matchedProduct && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Inventario</Text>
          <Text>No se encontró este producto en el ERP.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f1f5f9",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  camera: {
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  preview: {
    height: 420,
    borderRadius: 16,
    marginBottom: 16,
  },
  result: {
    marginTop: 18,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});
