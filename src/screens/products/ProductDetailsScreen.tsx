import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchComments();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}/`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/comments/`);
      const data = await response.json();
      // Filter comments for the current product
      const filteredComments = data.filter(comment => comment.product === productId);
      setComments(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Por favor inicia sesión para agregar productos al carrito.");
        return;
      }

      // Validar la cantidad
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
      }

      // Fetch the current user's cart
      let cart;
      const cartResponse = await fetch(`${BASE_URL}/carts/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (cartResponse.ok) {
        const carts = await cartResponse.json();
        if (carts.length > 0) {
          cart = carts[0]; // Assuming the user has only one cart
        } else {
          // No cart exists, create a new cart
          const newCartResponse = await fetch(`${BASE_URL}/carts/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          if (newCartResponse.ok) {
            cart = await newCartResponse.json();
          } else {
            console.error("Failed to create a new cart");
            alert(
              "Hubo un problema al crear un nuevo carrito. Por favor, intenta de nuevo."
            );
            return;
          }
        }
      } else {
        console.error("Failed to fetch carts:", cartResponse.statusText);
        alert(
          "Hubo un problema al obtener los carritos. Por favor, intenta de nuevo."
        );
        return;
      }

      if (!cart || !cart.id) {
        console.error("No cart found or created");
        alert("No se pudo encontrar o crear un carrito.");
        return;
      }

      // Now add the product to the cart
      const cartItemResponse = await fetch(`${BASE_URL}/add-to-cart/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart.id,
          product: productId,
          quantity: parsedQuantity,
        }),
      });

      if (cartItemResponse.ok) {
        alert("Producto agregado al carrito");
      } else {
        const errorData = await cartItemResponse.json();
        console.error("Failed to add product to cart:", errorData);
        alert(
          "Hubo un problema al agregar el producto al carrito. Por favor, intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Ocurrió un error al intentar agregar el producto al carrito.");
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item.text}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.rating ? "star" : "star-outline"}
            size={20}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.commentDate}>Fecha: {new Date(item.created_at).toLocaleDateString()}</Text>
      {/* Muestra el sentimiento del comentario */}
      <Text style={styles.sentimentText}>
        Sentimiento: {item.sentiment == "positive" ? "Positivo" : "Negativo" }
      </Text>
    </View>
  );

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Cantidad:</Text>
          <TextInput
            value={String(quantity)}
            onChangeText={setQuantity}
            style={styles.quantityInput}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.addToCartText}>Agregar al carrito</Text>
        </TouchableOpacity>
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Comentarios:</Text>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sentimentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000',
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 60,
    textAlign: "center",
    borderRadius: 5,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default ProductDetailsScreen;
