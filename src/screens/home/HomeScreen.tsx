import React, { useEffect, useState } from "react";
import BASE_URL from "../../config/config";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  Pressable,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [banners, setBanners] = useState({ banner1: "", banner2: "" });

  navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.slice(0, 8)); // Limit to 8 products
      setFilteredProducts(data.slice(0, 8));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${BASE_URL}/resource-images/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const banner1 = data.find((item) => item.name === "banner1");
      const banner2 = data.find((item) => item.name === "banner2");
      setBanners({
        banner1: banner1?.image || "",
        banner2: banner2?.image || "",
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBanners();
  }, []);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
  };

  const selectedCategoryName =
    categories.find((cat) => cat.id === selectedCategory)?.name || "Todas";

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <>
      {index === 3 || index === 6 ? (
        <ImageBackground
          source={{ uri: index === 3 ? banners.banner1 : banners.banner2 }}
          style={styles.bannerContainer}
        >
          <Text style={styles.bannerText}>
            ¡Siente más cerca de Khaluas con su ropa!
          </Text>
        </ImageBackground>
      ) : null}
      <Pressable
        onPress={() =>
          navigation.navigate("ProductDetails", { productId: item.id })
        }
      >
        <View style={styles.productContainer}>
          {item.image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>
                  {categories.find((cat) => cat.id === item.category)?.name}
                </Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    </>
  );

  return (
    <View style={styles.container}>
    <StatusBar barStyle="dark-content" />
      <View style={styles.categoriesContainer}>
        {[{ id: null, name: "Todas" }, ...categories].map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategorySelect(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
          >
            <Text style={styles.categoryButtonText}>{category.name}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => (item.id ? item.id.toString() : "0")}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 15,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#333",
  },
  productContainer: {
    marginBottom: 0,
    width: "100%",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  categoryTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 3,
  },
  categoryTagText: {
    color: "#fff",
    fontSize: 12,
  },
  productInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  productName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#fff",
  },
  bannerContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6f61",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#ffcc00", // Bright border to make it pop
  },
  bannerText: {
    fontSize: 20, // Larger text size
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000", // Shadow to make text stand out
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default HomeScreen;
