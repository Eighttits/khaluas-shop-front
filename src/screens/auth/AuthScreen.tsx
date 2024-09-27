import React, { useState } from 'react';
import BASE_URL from '../../config/config';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleEmailSubmit = async () => {
        try {
            const response = await fetch(`${BASE_URL}/check-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (data.isRegistered) {
                // Redirige a la pantalla de inicio de sesión con el correo
                navigation.navigate('Login', { email });
            } else {
                // Redirige a la pantalla de registro con el correo
                navigation.navigate('Signin', { email });
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al verificar el correo electrónico.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vamos a ver si estás registrado</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Verificar" onPress={handleEmailSubmit} />
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

export default AuthScreen;
