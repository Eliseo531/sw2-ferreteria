import { useMutation } from "@apollo/client/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { LOGIN_MUTATION } from "../services/auth.service";

export function LoginScreen() {
  const [email, setEmail] = useState("eliseo@test.com");
  const [password, setPassword] = useState("123456");

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const result = await login({
        variables: {
          input: {
            email: email.trim().toLowerCase(),
            password: password.trim(),
          },
        },
      });

      const data: any = result.data;

      const token = data.login.accessToken;
      const user = data.login.user;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      router.replace("/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ferretería ERP</Text>
      <Text style={styles.subtitle}>App móvil</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
});
