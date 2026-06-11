import { useMutation, useQuery } from "@apollo/client/react";
import { router } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  DELIVERIES_QUERY,
  UPDATE_DELIVERY_STATUS_MUTATION,
} from "../services/delivery.service";

export function DeliveriesScreen() {
  const [user, setUser] = useState<any>(null);

  const { data, loading, error, refetch } = useQuery<{
    deliveries: any[];
  }>(DELIVERIES_QUERY, {
    fetchPolicy: "network-only",
  });

  const [updateDeliveryStatus, { loading: updating }] = useMutation(
    UPDATE_DELIVERY_STATUS_MUTATION,
  );

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const allDeliveries = data?.deliveries || [];

  const roles: string[] = user?.roles?.map((r: any) => r.nombre) || [];
  const isAdmin = roles.includes("ADMINISTRADOR");

  const deliveries = isAdmin
    ? allDeliveries
    : allDeliveries.filter(
        (delivery: any) => delivery.idRepartidor === user?.idUsuario,
      );

  const changeStatus = async (idEntrega: number, estado: string) => {
    try {
      let latitudEntrega = null;
      let longitudEntrega = null;

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status === "granted") {
        const location = await Location.getCurrentPositionAsync({});

        latitudEntrega = location.coords.latitude;
        longitudEntrega = location.coords.longitude;
      }

      await updateDeliveryStatus({
        variables: {
          input: {
            idEntrega,
            estado,
            latitudEntrega,
            longitudEntrega,
            observacion: `Estado actualizado desde app móvil a ${estado}`,
          },
        },
      });

      Alert.alert("Correcto", "Estado actualizado con ubicación GPS");
      refetch();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo actualizar la entrega");
    }
  };

  const openMapRoute = async (latitud: number, longitud: number) => {
    if (!latitud || !longitud) {
      Alert.alert(
        "Sin ubicación",
        "Esta entrega no tiene coordenadas registradas.",
      );
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se pudo abrir Google Maps.");
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Cargando entregas...</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);

    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se pudieron cargar las entregas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis entregas</Text>
      <Text style={styles.subtitle}>
        {isAdmin
          ? "Vista administrador: todas las entregas"
          : "Entregas asignadas a tu usuario"}
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => String(item.idEntrega)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.deliveryTitle}>Entrega #{item.idEntrega}</Text>

            <Text style={styles.text}>Pedido: {item.idPedido}</Text>
            <Text style={styles.text}>
              Repartidor: {item.idRepartidor || "-"}
            </Text>
            <Text style={styles.text}>
              Dirección: {item.direccionEntrega || "-"}
            </Text>
            <Text style={styles.text}>
              GPS: {item.latitudEntrega || "-"}, {item.longitudEntrega || "-"}
            </Text>

            <Text style={styles.label}>Estado actual</Text>
            <Text style={styles.badge}>{item.estado}</Text>

            <View style={styles.actions}>
              <Button
                title="EN CAMINO"
                disabled={updating}
                onPress={() => changeStatus(item.idEntrega, "EN_CAMINO")}
              />

              <Button
                title="ENTREGADA"
                disabled={updating}
                onPress={() => changeStatus(item.idEntrega, "ENTREGADA")}
              />

              <Button
                title="FALLIDA"
                color="#dc2626"
                disabled={updating}
                onPress={() => changeStatus(item.idEntrega, "FALLIDA")}
              />

              <Button
                title="Ver ruta en Google Maps"
                onPress={() =>
                  openMapRoute(
                    Number(item.latitudEntrega),
                    Number(item.longitudEntrega),
                  )
                }
              />

              <Button
                title="Foto evidencia"
                onPress={() =>
                  router.push({
                    pathname: "/evidence",
                    params: {
                      idEntrega: String(item.idEntrega),
                    },
                  })
                }
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No tienes entregas asignadas.</Text>
          </View>
        }
      />
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
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 18,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  text: {
    color: "#334155",
    marginTop: 4,
  },
  label: {
    marginTop: 12,
    color: "#64748b",
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "bold",
  },
  actions: {
    marginTop: 14,
    gap: 8,
  },
  empty: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  error: {
    color: "#dc2626",
    fontWeight: "bold",
  },
});
