import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { router, Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.106:3000';

const ScannerScreen = () => {
    const theme = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth(); // Pega o token para autenticação

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/receipts/scan-qrcode`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Envia o token para proteger a rota
                },
                body: JSON.stringify({ sefaz_url: data }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao processar a nota no servidor.');
            }

            const result = await response.json();

            // Navega de volta para a tela de Adicionar, passando os dados extraídos
            router.replace({
                pathname: "/add",
                params: { scannedData: JSON.stringify(result.data) },
            });

        } catch (error: any) {
            Alert.alert(`Erro`, error.message, [{ text: 'OK', onPress: () => {
                setIsLoading(false);
                setScanned(false);
            }}]);
        }
    };

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, alignItems: 'center', gap: 20 }]}>
                <Text style={{ color: theme.colors.onSurface, textAlign: 'center' }}>
                    Precisamos da sua permissão para usar a câmera.
                </Text>
                <Button onPress={requestPermission} mode="contained">Permitir Câmera</Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                style={StyleSheet.absoluteFillObject}
            />
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Lendo nota fiscal, aguarde...</Text>
                </View>
            )}
            <Link href="/add" asChild style={styles.closeButton}>
                <Button mode="contained" icon="close">Voltar</Button>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: 'white', marginTop: 10, fontSize: 16, fontWeight: 'bold' },
    closeButton: { position: 'absolute', top: 50, left: 20, right: 20 },
});

export default ScannerScreen;