import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddProductsScreen from "../screens/admin/AddProductsScreen";
import ProductsScreen from "../screens/admin/ProductsScreen";
// import LoadingScreen from "../screens/LoadingScreen";
import ViewProductScreen from "../screens/admin/ViewProductScreen";
import EditProductScreen from "../screens/admin/EditProductScreen";

const Stack = createStackNavigator();

const AdminProductsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminProducts"
        component={ProductsScreen}
        options={{ title: "Productos", headerShown: false }}
      />
      <Stack.Screen
        name="AddProducts"
        component={AddProductsScreen}
        options={{ title: "Agregar Producto" }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabsNavigator}
        options={{
          title: "BottomTabs",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ViewProduct"
        component={ViewProductScreen}
        options={{
          title: "Ver Producto",
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
            title: "Editar Producto",
        }}
        />
    </Stack.Navigator>
  );
};

export default AdminProductsStackNavigator;
