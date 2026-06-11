import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { client } from "../graphql/apollo";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="home" options={{ title: "Ferretería App" }} />
      </Stack>
    </ApolloProvider>
  );
}
