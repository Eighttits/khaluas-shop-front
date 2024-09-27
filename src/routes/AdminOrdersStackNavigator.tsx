import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddProductsScreen from "../screens/admin/AddProductsScreen";
import OrderManagementScreen from "../screens/admin/OrderManagementScreen";
import OrderDetailsScreen from "../screens/admin/OrderDetailsScreen";

const Stack = createStackNavigator();

const AdminOrdersStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminOrders"
        component={OrderManagementScreen}
        options={{ title: "Ordenes", headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Orden",
          headerShown: false,
         }}
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
    </Stack.Navigator>
  );
};

export default AdminOrdersStackNavigator;
