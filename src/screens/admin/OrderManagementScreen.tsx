import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';  
import BASE_URL from '../../config/config';
import { useFocusEffect } from '@react-navigation/native';

interface Order {
  id: number;
  total_price: string;
  status: string;
}

const OrderManagementScreen = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchOrders = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/orders/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const filterOrders = (status: string) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  const navigateToOrderDetails = (orderId: number) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity onPress={() => navigateToOrderDetails(item.id)} style={styles.orderItem}>
      <Text style={styles.orderText}>ID: {item.id}</Text>
      <Text style={styles.orderText}>Precio Total: ${item.total_price}</Text>
      <Text style={styles.orderStatus(item.status)}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Órdenes</Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]} 
          onPress={() => filterOrders('all')}
        >
          <Text style={styles.filterText}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'Pending' && styles.activeFilter]} 
          onPress={() => filterOrders('Pending')}
        >
          <Text style={styles.filterText}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'Delivered' && styles.activeFilter]} 
          onPress={() => filterOrders('Delivered')}
        >
          <Text style={styles.filterText}>Entregados</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
      />
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
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 16,
    color: 'white',
  },
  orderList: {
    padding: 10,
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderStatus: (status: string) => ({
    fontSize: 14,
    fontWeight: 'bold',
    color: status === 'Pending' ? '#ffa500' : '#008000',
  }),
});

export default OrderManagementScreen;
