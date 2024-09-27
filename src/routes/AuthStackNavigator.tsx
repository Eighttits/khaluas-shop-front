import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeAuthScreen from "../screens/auth/HomeAuthScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SigninScreen from "../screens/auth/SigninScreen";
import AuthScreen from "../screens/auth/AuthScreen";
import ProfileScreen from "../screens/auth/ProfileScreen";
import BottomTabsNavigator from "./BottomTabsNavigator";
// import HomeStackNavigator from "./HomeStackNavigator";
// import LoadingScreen from "../screens/LoadingScreen";
import OrderDetailsScreen from "../screens/auth/OrderDetailsScreen";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeAuth"
        component={HomeAuthScreen}
        options={{ title: "HomeAuth", headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile", headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar Sesión", headerShown: false }}
      />
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ title: "Signin", headerShown: false }}
      />

      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Auth", headerShown: false }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabsNavigator}
        options={{ title: "BottomTabs", headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Detalles de Pedido", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
