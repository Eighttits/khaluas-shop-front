// Example of navigating to Profile in BottomTabsNavigator
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import CartScreen from "../screens/cart/CartScreen";
import SearchProductsScreen from "../screens/products/SearchProductsScreen";
import ProductsScreen from "../screens/admin/ProductsScreen";
import AuthStackNavigator from "./AuthStackNavigator";
import AdminProductsStackNavigator from "./AdminProductsStackNavigator";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import ProductDetailsScreen from "../screens/products/ProductDetailsScreen";
import HomeStackNavigator from "./HomeStackNavigator";
import AdminOrdersStackNavigator from "./AdminOrdersStackNavigator";

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  const [isLogged, setIsLogged] = React.useState(false);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await AsyncStorage.getItem("isLogged");
      setIsLogged(loggedInStatus === "true");
    };

    checkLoginStatus();
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerRight: () => (
          <Ionicons
            name="person-outline"
            size={24}
            color="black"
            style={{ marginRight: 16 }}
            onPress={() =>
              navigation.navigate("AuthHome", {
                screen: isLogged ? "Profile" : "HomeAuth",
              })
            }
          />
        ),
      })}
    >
      <Tab.Screen
        name="Lanzamientos"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "flame" : "flame-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Tienda"
        component={SearchProductsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Carrito de Compras"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="AuthHome"
        component={AuthStackNavigator}
        options={{
          tabBarButton: () => null, // Oculta el tab para el inicio de sesión
          headerShown: false, // Oculta el header para la pantalla de inicio de sesión
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="ProductsAdmin"
        component={AdminProductsStackNavigator}
        options={{
          tabBarButton: () => null, // Oculta el tab para el inicio de sesión
          headerShown: false, // Oculta el header para la pantalla de inicio de sesión
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="OrderManagement"
        component={AdminOrdersStackNavigator}
        options={{ headerShown: false,
          tabBarButton: () => null, 
         }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
