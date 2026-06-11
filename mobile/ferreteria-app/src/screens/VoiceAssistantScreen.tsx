import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { sendVoiceQuery } from "../services/voice.service";

export function VoiceAssistantScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        alert("Debes permitir el uso del micrófono.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setResult(null);
      setAudioUri(null);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    await recorder.stop();

    if (recorder.uri) {
      setAudioUri(recorder.uri);
    }
  };

  const processAudio = async () => {
    if (!audioUri) return;

    try {
      setLoading(true);

      const response = await sendVoiceQuery(audioUri);

      setResult(response);
    } catch (error: any) {
      console.error("ERROR VOICE:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta por voz</Text>

      <Text style={styles.subtitle}>
        Usa el micrófono para consultar inventario.
      </Text>

      {!recorderState.isRecording ? (
        <Button title="Iniciar grabación" onPress={startRecording} />
      ) : (
        <Button
          title="Detener grabación"
          color="#dc2626"
          onPress={stopRecording}
        />
      )}

      {audioUri && (
        <>
          <View style={{ height: 16 }} />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button title="Enviar consulta" onPress={processAudio} />
          )}
        </>
      )}

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Resultado</Text>

          <Text>Transcripción: {result.transcription}</Text>

          <Text>Intención: {result.intent}</Text>

          <Text>Producto: {result.product}</Text>

          <Text>Respuesta: {result.response}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    color: "#64748b",
  },
  result: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});
