import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
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

  const roles: string[] = user?.roles?.map((r: any) => r.nombre) || [];

  const hasRole = (allowedRoles: string[]) => {
    return roles.some((role) => allowedRoles.includes(role));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Ferretería App</Text>
        <Text style={styles.subtitle}>Panel móvil operativo</Text>
      </View>

      {user && (
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.nombre?.charAt(0)}</Text>
          </View>

          <View>
            <Text style={styles.userName}>
              {user.nombre} {user.apellido}
            </Text>
            <Text style={styles.userRole}>{roles.join(", ") || "SIN ROL"}</Text>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {hasRole(["ALMACENERO", "ADMINISTRADOR"]) && (
          <>
            <MenuCard
              icon="📦"
              title="Inventario"
              description="Consultar stock de productos"
              onPress={() => router.push("/inventory")}
            />

            <MenuCard
              icon="📷"
              title="Escanear producto"
              description="Reconocer producto con cámara e IA"
              onPress={() => router.push("/scanner")}
            />

            <MenuCard
              icon="🎙️"
              title="Consulta por voz"
              description="Usar micrófono para consultas"
              onPress={() => router.push("/voice")}
            />
          </>
        )}

        {hasRole(["REPARTIDOR", "ADMINISTRADOR"]) && (
          <>
            <MenuCard
              icon="🚚"
              title="Mis entregas"
              description="Ver rutas, GPS y evidencias"
              onPress={() => router.push("/deliveries")}
            />

            <MenuCard
              icon="🔔"
              title="Notificaciones"
              description="Entregas pendientes y avisos"
              onPress={() => router.push("/notifications")}
            />
          </>
        )}

        <MenuCard
          icon="👤"
          title="Perfil"
          description="Ver sesión y cerrar sesión"
          onPress={() => router.push("/profile")}
        />
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

function MenuCard({ icon, title, description, onPress }: any) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    color: "#64748b",
    marginTop: 4,
  },
  userCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  userRole: {
    color: "#64748b",
    marginTop: 2,
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
  },
  cardIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  cardDescription: {
    color: "#64748b",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
