import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
// import LoadingScreen from "../screens/LoadingScreen";
import ProductDetailsScreen from "../screens/products/ProductDetailsScreen";

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Lanzamientos"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: "Detalles Producto", headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
