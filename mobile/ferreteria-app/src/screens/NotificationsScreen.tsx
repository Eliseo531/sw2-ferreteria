import { useMutation, useQuery } from "@apollo/client/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ATTEND_ALERT_MUTATION,
  PENDING_ALERTS_QUERY,
} from "../services/notification.service";

import { DELIVERIES_QUERY } from "../services/delivery.service";

export function NotificationsScreen() {
  const [user, setUser] = useState<any>(null);

  const {
    data: alertsData,
    loading: loadingAlerts,
    error: alertsError,
    refetch: refetchAlerts,
  } = useQuery<{
    pendingAlerts: any[];
  }>(PENDING_ALERTS_QUERY, {
    fetchPolicy: "network-only",
  });

  const {
    data: deliveriesData,
    loading: loadingDeliveries,
    error: deliveriesError,
    refetch: refetchDeliveries,
  } = useQuery<{
    deliveries: any[];
  }>(DELIVERIES_QUERY, {
    fetchPolicy: "network-only",
  });

  const [attendAlert, { loading: attending }] = useMutation(
    ATTEND_ALERT_MUTATION,
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

  const roles: string[] = user?.roles?.map((r: any) => r.nombre) || [];

  const isAdmin = roles.includes("ADMINISTRADOR");
  const isAlmacenero = roles.includes("ALMACENERO");
  const isRepartidor = roles.includes("REPARTIDOR");

  const stockAlerts = alertsData?.pendingAlerts || [];

  const allDeliveries = deliveriesData?.deliveries || [];

  const myPendingDeliveries = allDeliveries.filter((delivery: any) => {
    const belongsToUser = isAdmin || delivery.idRepartidor === user?.idUsuario;

    const isPending =
      delivery.estado === "PENDIENTE" ||
      delivery.estado === "EN_CAMINO" ||
      delivery.estado === "FALLIDA";

    return belongsToUser && isPending;
  });

  const notifications: any[] = [];

  if (isAdmin || isAlmacenero) {
    stockAlerts.forEach((alert: any) => {
      notifications.push({
        id: `alert-${alert.idAlerta}`,
        type: "STOCK",
        title: alert.tipoAlerta,
        message: alert.mensaje,
        detail: `Producto: ${alert.idProducto || "-"}`,
        raw: alert,
      });
    });
  }

  if (isAdmin || isRepartidor) {
    myPendingDeliveries.forEach((delivery: any) => {
      notifications.push({
        id: `delivery-${delivery.idEntrega}`,
        type: "ENTREGA",
        title: "Entrega asignada",
        message: `Entrega #${delivery.idEntrega} pendiente`,
        detail: delivery.direccionEntrega || "Sin dirección registrada",
        raw: delivery,
      });
    });
  }

  const markAsAttended = async (idAlerta: number) => {
    try {
      await attendAlert({
        variables: {
          idAlerta,
        },
      });

      Alert.alert("Correcto", "Alerta marcada como atendida");
      refetchAlerts();
    } catch (error) {
      console.error("ERROR ATTEND ALERT:", error);
      Alert.alert("Error", "No se pudo atender la alerta");
    }
  };

  const refresh = () => {
    refetchAlerts();
    refetchDeliveries();
  };

  if (!user || loadingAlerts || loadingDeliveries) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (alertsError || deliveriesError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          No se pudieron cargar las notificaciones
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <Text style={styles.subtitle}>{roles.join(", ") || "SIN ROL"}</Text>

      <Button title="Actualizar" onPress={refresh} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={[
                styles.type,
                item.type === "ENTREGA" && styles.deliveryType,
              ]}
            >
              {item.type}
            </Text>

            <Text style={styles.titleCard}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.detail}>{item.detail}</Text>

            {item.type === "STOCK" && (
              <Button
                title="Marcar como atendida"
                disabled={attending}
                onPress={() => markAsAttended(item.raw.idAlerta)}
              />
            )}

            {item.type === "ENTREGA" && (
              <Button
                title="Ver entrega"
                onPress={() => router.push("/deliveries")}
              />
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No tienes notificaciones pendientes.</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: 14,
  },
  list: {
    paddingBottom: 24,
    marginTop: 14,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  type: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 6,
  },
  deliveryType: {
    color: "#2563eb",
  },
  titleCard: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  message: {
    color: "#0f172a",
    marginBottom: 6,
  },
  detail: {
    color: "#64748b",
    marginBottom: 10,
  },
  empty: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  error: {
    color: "#dc2626",
    fontWeight: "bold",
  },
});
