import { useMutation } from "@apollo/client/react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import { useRef, useState } from "react";
import { uploadDeliveryEvidence } from "../services/document.service";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { UPDATE_DELIVERY_STATUS_MUTATION } from "../services/delivery.service";

export function EvidenceScreen() {
  const { idEntrega } = useLocalSearchParams();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [updateDeliveryStatus, { loading }] = useMutation(
    UPDATE_DELIVERY_STATUS_MUTATION,
  );

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    setPhotoUri(photo.uri);
  };

  const saveEvidence = async () => {
    if (!photoUri) {
      alert("Primero toma una foto.");
      return;
    }

    try {
      const uploadResult = await uploadDeliveryEvidence(
        photoUri,
        Number(idEntrega),
      );

      const objectKey =
        uploadResult?.metadata?.object_key ||
        uploadResult?.object_key ||
        photoUri;

      await updateDeliveryStatus({
        variables: {
          input: {
            idEntrega: Number(idEntrega),
            estado: "ENTREGADA",
            fotoEvidenciaUrl: objectKey,
            observacion:
              "Entrega finalizada con evidencia subida a S3 desde app móvil",
          },
        },
      });

      alert(`Entrega #${idEntrega} marcada como ENTREGADA`);
      router.back();
    } catch (error) {
      console.error("ERROR SAVE EVIDENCE:", error);
      alert("No se pudo guardar la evidencia");
    }
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
    <View style={styles.container}>
      <Text style={styles.title}>Evidencia de entrega</Text>
      <Text style={styles.subtitle}>Entrega #{idEntrega}</Text>

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
            <Button
              title="Guardar evidencia y entregar"
              onPress={saveEvidence}
            />
          )}

          <View style={{ height: 10 }} />

          <Button
            title="Tomar otra foto"
            color="#64748b"
            onPress={() => setPhotoUri(null)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f1f5f9",
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
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 16,
  },
  camera: {
    height: 440,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  preview: {
    height: 440,
    borderRadius: 16,
    marginBottom: 16,
  },
});
