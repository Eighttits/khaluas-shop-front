import React, { useState } from 'react';
import BASE_URL from '../../config/config';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SigninScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params; // Obtener el correo de los params

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/create-user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, is_staff: false }),
            });
            if (response.ok) {
                Alert.alert('Success', 'Registered successfully');
                navigation.navigate('Login', { email }); // Redirige al login con el correo
            } else {
                Alert.alert('Error', 'Could not register');
            }
        } catch (error) {
            Alert.alert('Error', 'There was a problem registering');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Regístrate</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button title="Registrarse" onPress={handleSignup} />
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

export default SigninScreen;
