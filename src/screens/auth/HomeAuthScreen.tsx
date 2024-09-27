import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeAuthScreen = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        // Función para obtener la imagen desde la API
        const fetchAuthImage = async () => {
            try {
                const response = await fetch(`${BASE_URL}/resource-images/`);
                const data = await response.json();

                // Encontrar la imagen con name = "auth_image"
                const authImage = data.find(item => item.name === 'auth_image');

                if (authImage) {
                    setImageUri(authImage.image);
                }
            } catch (error) {
                console.error('Error al obtener la imagen:', error);
            }
        };

        fetchAuthImage();
    }, []);

    const handleClose = () => {
        navigation.goBack(); // Volver a la pantalla anterior
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeIconContainer} onPress={handleClose}>
                <Ionicons
                    name="close"
                    size={50}
                    color="white"
                    style={styles.closeIcon}
                />
            </TouchableOpacity>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
                <Text>Cargando imagen...</Text>
            )}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Auth')}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Auth')}>
                    <Text style={styles.buttonText}>Registrarte</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeIconContainer: {
        position: 'absolute',
        top: 45,
        right: 16,
        zIndex: 1,
    },
    closeIcon: {
        textShadowColor: 'rgba(0, 0, 0, 1)', // Color del borde (sombra)
        textShadowOffset: { width: 0, height: 0 }, // Desplazamiento de la sombra
        textShadowRadius: 20, // Radio de la sombra
    },
    image: {
        width: '100%',
        height: height * 0.75, // Reduce la altura de la imagen
    },
    buttonsContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start', // Cambia para alinear botones en la parte superior
        paddingTop: 20, // Espacio superior para los botones
        paddingHorizontal: 20,
    },
    button: {
        marginVertical: 10,
        width: '100%',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 0,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
});

export default HomeAuthScreen;
