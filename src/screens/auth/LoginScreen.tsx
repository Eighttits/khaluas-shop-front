import React, { useState } from 'react';
import BASE_URL from '../../config/config';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'El correo electrónico no está disponible.');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.access); // Almacena el token en AsyncStorage
        await AsyncStorage.setItem('isLogged', JSON.stringify(true)); // Convierte a cadena
        await AsyncStorage.setItem('is_staff', JSON.stringify(data.is_staff)); // Convierte a cadena
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.navigate('Profile');
        console.log('Token:', data.access, 'isLogged:', await AsyncStorage.getItem('isLogged'), 'is_staff:', await AsyncStorage.getItem('is_staff') === 'true'? 'Si' : 'No');

      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Correo electrónico o contraseña inválidos');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Text style={styles.terms}>
        Al registrarte aceptas nuestros Términos y condiciones de Khaluas Shop. Aviso de privacidad y Términos y condiciones.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  terms: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoginScreen;
