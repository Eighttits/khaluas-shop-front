import React, { useEffect, useState } from "react";
import BASE_URL from '../../config/config';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showDelivered, setShowDelivered] = useState(false);
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.navigate("BottomTabs");
  };

  useEffect(() => {
    const checkStaffStatus = async () => {
      const isStaffStatus = await AsyncStorage.getItem("is_staff");
      setIsStaff(isStaffStatus === "true");
    };

    checkStaffStatus();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${BASE_URL}/api/user/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);

            if (!isStaff) {
              const ordersResponse = await fetch(`${BASE_URL}/orders/`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);
              } else {
                console.error("Failed to fetch orders");
              }
            }
          } else {
            console.error("Failed to fetch user info");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserInfo();
  }, [isStaff]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.setItem("isLogged", "false");
      navigation.navigate("BottomTabs");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate("OrderDetails", { orderId: order.id });
  };

  const renderOrdersSection = (orders, title) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {orders.length > 0 ? (
        orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderItem}
            onPress={() => handleOrderPress(order)}
          >
            <Text>Pedido ID: {order.id}</Text>
            <Text>Fecha: {new Date(order.created_at).toLocaleDateString()}</Text>
            <Text>Estado: {order.status}</Text>
            <Text>Total: ${order.total_price}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No tienes pedidos en esta categoría.</Text>
      )}
    </View>
  );

  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const deliveredOrders = orders.filter((order) => order.status === "Delivered");

  if (!userInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Cargando información del usuario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.closeIconContainer}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close-circle"
                size={40}
                color="black"
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>

          {!isStaff && (
            <>
              {renderOrdersSection(pendingOrders, "Pedidos Pendientes")}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowDelivered(!showDelivered)}
              >
                <Text style={styles.toggleButtonText}>
                  {showDelivered ? "Ocultar Pedidos Entregados" : "Mostrar Pedidos Entregados"}
                </Text>
              </TouchableOpacity>
              {showDelivered && renderOrdersSection(deliveredOrders, "Pedidos Entregados")}
            </>
          )}

          {isStaff && (
            <View style={styles.adminSectionContainer}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gestionar Órdenes</Text>
                <Button title="Ir a Órdenes" onPress={() => navigation.navigate('OrderManagement')} color="#4b7bec" />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gestionar Productos</Text>
                <Button title="Ir a Productos" onPress={() => navigation.navigate('ProductsAdmin')} color="#4b7bec" />
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gestionar Categorías</Text>
                <Button title="Ir a Categorías" onPress={() => navigation.navigate('CategoryManagement')} color="#4b7bec" />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b7bec',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
  section: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  adminSectionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  toggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4b7bec',
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
