import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Pressable
} from "react-native";
import BASE_URL from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = await AsyncStorage.getItem("token");
      if (orderId && token) {
        console.log("Fetching order details...");
        try {
          const response = await fetch(`${BASE_URL}/orders/${orderId}/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            console.log("Order details fetched successfully.");
            const orderData = await response.json();
            setOrder(orderData);

            const productDetails = {};
            for (const item of orderData.items) {
              const productResponse = await fetch(
                `${BASE_URL}/products/${item.product_id}/`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              if (productResponse.ok) {
                const productData = await productResponse.json();
                productDetails[item.product_id] = productData;
              } else {
                console.error(
                  "Failed to fetch product details for product ID:",
                  item.product_id
                );
              }
            }
            setProducts(productDetails);
          } else {
            console.error(
              "Failed to fetch order details. Status code:",
              response.status
            );
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCommentSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (selectedProduct && comment && rating > 0) {
      try {
        const response = await fetch(`${BASE_URL}/comments/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: selectedProduct,
            text: comment,
            rating: rating,
          }),
        });

        if (response.ok) {
          console.log("Comment added successfully.");
          setComment("");
          setRating(0);
          setSelectedProduct(null);
        } else {
          const errorData = await response.json();
          console.error("Failed to add comment:", errorData);
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      console.error("Please fill in all fields.");
    }
  };

  const renderStarRating = (currentRating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= currentRating ? "star" : "star-outline"}
              size={30}
              color={star <= currentRating ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando detalles del pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Pressable style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007BFF" />
          </Pressable>
          <Text style={styles.title}>Detalles del Pedido</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.infoText}>
              ID del Pedido: <Text style={styles.infoValue}>{order.id}</Text>
            </Text>
            <Text style={styles.infoText}>
              Fecha:{" "}
              <Text style={styles.infoValue}>
                {new Date(order.created_at).toLocaleDateString()}
              </Text>
            </Text>
            <Text style={styles.infoText}>
              Estado: <Text style={styles.status}>{order.status}</Text>
            </Text>
            <Text style={styles.infoText}>
              Total:{" "}
              <Text style={styles.infoValue}>
                {order.total_price
                  ? `$${parseFloat(order.total_price).toFixed(2)}`
                  : "N/A"}
              </Text>
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Productos</Text>
          {order.items.map((item) => {
            const product = products[item.product_id];
            const hasComment = (order.comments || []).some(comment => comment.product === item.product_id);
            return (
              <View key={item.product_id} style={styles.productCard}>
                <Image
                  source={{ uri: product?.image }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product?.name}</Text>
                  <Text style={styles.productQuantity}>
                    Cantidad: {item.quantity}
                  </Text>
                  <Text style={styles.productPrice}>
                    Precio: $
                    {product ? parseFloat(product.price).toFixed(2) : "N/A"}
                  </Text>
                  {!hasComment && selectedProduct === item.product_id && (
                    <View style={styles.commentContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Añadir un comentario..."
                        value={comment}
                        onChangeText={setComment}
                      />
                      <Text style={styles.ratingText}>Calificación:</Text>
                      {renderStarRating(rating)}
                      <Button
                        title="Enviar Comentario"
                        onPress={handleCommentSubmit}
                      />
                    </View>
                  )}
                  {!hasComment && (
                    <Button
                      title="Añadir Comentario"
                      onPress={() => setSelectedProduct(item.product_id)}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  goBackButton: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  orderInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  infoValue: {
    fontWeight: "600",
    color: "#000",
  },
  status: {
    fontWeight: "600",
    color: "#007BFF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
    marginBottom: 10,
  },
  commentContainer: {
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 80,
    textAlignVertical: "top",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default OrderDetailsScreen;
