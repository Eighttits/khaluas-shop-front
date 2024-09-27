import React, { useEffect, useState } from "react";
import BASE_URL from "../../config/config";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  name: string;
  image: string;
  price: string; // price is a string in your data
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Aquí

  useEffect(() => {
    const checkSession = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLogged");
      setIsLogged(isLoggedIn === "true");
    };

    checkSession();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isLogged) {
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await fetch(`${BASE_URL}/cart-items/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
            calculateTotalPrice(data);
          } else {
            console.error("Failed to fetch cart items");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchCartItems();
    }
  }, [isLogged, isFocused]);

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce((acc, item) => {
      const price = parseFloat(item.product.price); // Convert price to number
      return acc + price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleLoginPrompt = () => {
    Alert.alert(
      "Inicio de sesión requerido",
      "Para agregar productos al carrito, debes iniciar sesión.",
      [
        { text: "Iniciar sesión", onPress: () => navigation.navigate("Login") },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const handleOrder = async () => {
    const token = await AsyncStorage.getItem("token");
  
    const orderData = {
      total_price: totalPrice.toFixed(2), 
      status: "Pending", 
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };
  
    try {
      const response = await fetch(`${BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        // Espera a que clearCart termine antes de continuar
        await clearCart();
        Alert.alert("Pedido realizado", "Tu pedido ha sido enviado.");
        // Aquí puedes navegar a otra pantalla si lo deseas
        // navigation.navigate("Lanzamientos");
      } else {
        const errorData = await response.json();
        console.error("Error al realizar el pedido:", errorData);
        Alert.alert("Error", "No se pudo realizar el pedido.");
      }
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      Alert.alert("Error", "Ocurrió un error al intentar realizar el pedido.");
    }
  };
  
  
  const clearCart = async () => {
    const token = await AsyncStorage.getItem("token");
  
    if (cartItems.length === 0) {
      return;
    }
  
    try {
      for (const item of cartItems) {
        const response = await fetch(`${BASE_URL}/cart-items/${item.id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("No se pudo eliminar un producto del carrito.");
        }
      }
  
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
      Alert.alert("Error", "Ocurrió un error al intentar vaciar el carrito.");
    }
  };
  

  const handleRemoveItem = async (itemId: number) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/cart-items/${itemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);
      } else {
        Alert.alert("Error", "No se pudo eliminar el producto del carrito.");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al intentar eliminar el producto."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando carrito...</Text>
      </View>
    );
  }

  if (!isLogged) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Para ver tu carrito, debes iniciar sesión.
        </Text>
        <Button
          title="Iniciar sesión"
          onPress={() =>
            navigation.navigate("AuthHome", { screen: "HomeAuth" })
          }
        />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Tu carrito está vacío. ¡Empieza a comprar!
        </Text>
        <Button
          title="Ir a Inicio"
          onPress={() => navigation.navigate("Lanzamientos")}
        />
      </View>
    );
  }

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          ${parseFloat(item.product.price).toFixed(2)}{" "}
          {/* Convert to number before toFixed */}
        </Text>
        <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
        <Text style={styles.itemTotal}>
          Subtotal: $
          {(parseFloat(item.product.price) * item.quantity).toFixed(2)}{" "}
          {/* Convert to number */}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Precio Total: ${totalPrice.toFixed(2)}
        </Text>
        <Button title="Realizar Pedido" onPress={handleOrder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "green",
  },
  productQuantity: {
    fontSize: 14,
    color: "#555",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ff6961",
    borderRadius: 10,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CartScreen;
