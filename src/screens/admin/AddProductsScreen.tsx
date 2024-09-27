import React, { useState, useEffect } from 'react';
import BASE_URL from '../../config/config';
import { View, SafeAreaView, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from  
 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';  


const AddProductsScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<number  
 | undefined>(undefined);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  

      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled)  
 {
      // Ensure 'uri' exists in the result
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImage(result.assets[0].uri); 
      } else {
        console.error("Error: No 'uri' found in the image picker result");
        Alert.alert("Error", "Hubo un problema al seleccionar la imagen.");
      }
    } else {
      Alert.alert("No se seleccionó imagen", "Por favor selecciona una imagen.");
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Ensure 'uri' exists in the result
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImage(result.assets[0].uri); 
      } else {
        console.error("Error: No 'uri' found in the camera result");
        Alert.alert("Error", "Hubo un problema al tomar la foto.");
      }
    } else {
      Alert.alert("No se tomó foto", "Por favor toma una foto.");
    }
  };

  const handleAddProduct = async () => {
    let errorMessages: string[] = [];

    if (!name) {
      errorMessages.push("Nombre del producto");
    }
    if (!description) {
      errorMessages.push("Descripción");
    }
    if (!price) {
      errorMessages.push("Precio");
    }
    if (!stock) {
      errorMessages.push("Stock");
    }
    if (!category) {
      errorMessages.push("Categoría");
    }
    if (!image) {
      errorMessages.push("Imagen");
    }

    if (errorMessages.length > 0) {
      Alert.alert("Error", `Por favor completa los siguientes campos: ${errorMessages.join(', ')}.`);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category.toString());

    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename!);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri: image,
      name: filename!,
      type,
    } as any);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Éxito", "Producto añadido correctamente.");
        navigation.goBack();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al añadir el producto.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"  

          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Stock"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una categoría" value={undefined} />
          {categories.map((cat: { id: number; name: string }) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <Text style={styles.imageSelectedText}>Imagen seleccionada</Text>
            </View>
          ) : (
            <Text style={styles.imageText}>Selecciona una imagen</Text>
          )}
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="black" />
              <Text style={styles.buttonText}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="black" />
              <Text style={styles.buttonText}>Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button title="Añadir producto" onPress={handleAddProduct} />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 100,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  imageText: {
    color: '#999',
    marginBottom: 10,
  },
  imageSelectedText: {
    color: 'green',
    fontSize: 16,
    marginBottom: 10,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imageButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 130,
    marginHorizontal: 5,
  },
  buttonText: {
    marginLeft: 5,
  },
});

export default AddProductsScreen;
