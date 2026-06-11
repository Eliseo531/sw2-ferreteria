import { useQuery } from "@apollo/client/react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PRODUCTS_STOCK_QUERY } from "../services/inventory.service";

export function InventoryScreen() {
  const { data, loading, error } = useQuery(PRODUCTS_STOCK_QUERY, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Cargando inventario...</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);

    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se pudo cargar el inventario</Text>
      </View>
    );
  }

  const products = (data as any)?.products || [];

  const getStockStatus = (product: any) => {
    if (product.stockActual <= 0) return "AGOTADO";
    if (product.stockActual <= product.stockMinimo) return "STOCK BAJO";
    return "NORMAL";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario</Text>
      <Text style={styles.subtitle}>Stock actual de productos</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.idProducto)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.nombre}</Text>
            <Text style={styles.code}>Código: {item.codigoBarras || "-"}</Text>

            <View style={styles.row}>
              <Text>Stock actual:</Text>
              <Text style={styles.value}>{item.stockActual}</Text>
            </View>

            <View style={styles.row}>
              <Text>Stock mínimo:</Text>
              <Text style={styles.value}>{item.stockMinimo}</Text>
            </View>

            <View style={styles.row}>
              <Text>Precio:</Text>
              <Text style={styles.value}>Bs {item.precioVenta}</Text>
            </View>

            <Text
              style={[
                styles.badge,
                getStockStatus(item) === "NORMAL" && styles.ok,
                getStockStatus(item) === "STOCK BAJO" && styles.warning,
                getStockStatus(item) === "AGOTADO" && styles.danger,
              ]}
            >
              {getStockStatus(item)}
            </Text>
          </View>
        )}
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
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  code: {
    color: "#64748b",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  value: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "bold",
  },
  ok: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  warning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  danger: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  error: {
    color: "#dc2626",
    fontWeight: "bold",
  },
});
