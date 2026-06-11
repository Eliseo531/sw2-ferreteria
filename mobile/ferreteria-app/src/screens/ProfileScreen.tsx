import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    router.replace("/");
  };

  const roles = user?.roles?.map((r: any) => r.nombre).join(", ") || "SIN ROL";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>
          {user?.nombre} {user?.apellido}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{roles}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recursos del teléfono usados</Text>
        <Text>📷 Cámara: escaneo y evidencia</Text>
        <Text>📍 GPS: ubicación y rutas</Text>
        <Text>🎙️ Micrófono: consulta por voz</Text>
      </View>

      <Button title="Cerrar sesión" color="#dc2626" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  label: {
    color: "#64748b",
    marginTop: 8,
  },
  value: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
});
