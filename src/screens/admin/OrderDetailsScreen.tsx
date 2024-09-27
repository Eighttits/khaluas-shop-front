import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config/config';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error('No se pudo obtener los detalles de la orden');
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la orden:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Delivered' }),  // Establecer el estado a 'Entregado'
      });

      if (response.ok) {
        navigation.goBack();  // Volver a la pantalla de gestión de órdenes
      } else {
        console.error('No se pudo actualizar el estado de la orden');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de la Orden</Text>
      </View>
      {order && (
        <View style={styles.card}>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>ID de Orden:</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Precio Total:</Text>
            <Text style={styles.value}>${order.total_price}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.status(order.status)}>{order.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={updateOrderStatus}
          >
            <Text style={styles.buttonText}>Marcar como Entregado</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  goBackButton: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    margin: 15,
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  value: {
    fontSize: 18,
    color: '#212529',
    marginBottom: 5,
  },
  status: (status: string) => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: status === 'Pending' ? '#ffc107' : '#28a745',
  }),
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;
