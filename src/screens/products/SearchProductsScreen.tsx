import React, { useEffect, useState } from "react";
import BASE_URL from '../../config/config';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

const SearchProductsScreen = () => {
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch(`${BASE_URL}/categories/`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));

    // Fetch products
    fetch(`${BASE_URL}/products/`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API provides a way to distinguish trending and recommended products
        setTrendingProducts(data); // Modify based on actual response
      })
      .catch((error) => console.error(error));
    fetch(`${BASE_URL}/products/`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API provides a way to distinguish trending and recommended products
        setRecommendedProducts(data); // Modify based on actual response
      })
      .catch((error) => console.error(error));
  }, []);

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Image
        source={{ uri: item.image }} // Assuming `item.image` is a URL
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image
        source={{ uri: item.image }} // Assuming `item.image` is a URL
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
        />
      </View>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.sectionTitle}>Lo Más Vendido</Text>
      <FlatList
        data={trendingProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.sectionTitle}>Recomendados</Text>
      <FlatList
        data={recommendedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  categoryName: {
    marginTop: 5,
    textAlign: "center",
  },
  productItem: {
    alignItems: "center",
    marginRight: 15,
    width: width * 0.3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontWeight: "bold",
  },
  productPrice: {
    marginTop: 2,
    color: "green",
  },
});

export default SearchProductsScreen;
