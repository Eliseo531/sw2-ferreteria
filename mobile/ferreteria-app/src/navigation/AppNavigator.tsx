import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar sesión" }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Ferretería App" }}
      />
    </Stack.Navigator>
  );
}
