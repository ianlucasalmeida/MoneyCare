import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, useTheme, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'; // MUDANÇA CRÍTICA AQUI
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.106:3000';

const ScannerScreen = () => {
    const theme = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const isFocused = useIsFocused(); // Esta linha agora funcionará

    useEffect(() => {
      if (isFocused) {
        setScanned(false);
      }
    }, [isFocused]);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        // ... (o resto do seu código permanece o mesmo)
        if (scanned) return;
        setScanned(true);
        setIsLoading(true);

        try {
            if (!token) throw new Error("Sessão expirada. Faça o login novamente.");
            
            const response = await fetch(`${API_URL}/receipts/scan-qrcode`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ sefaz_url: data }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Erro no servidor.');

            router.replace({
                pathname: "/add",
                params: { scannedData: JSON.stringify(result.data) },
            });

        } catch (error: any) {
            Alert.alert(`Erro ao Escanear`, error.message, [{ text: 'Tentar Novamente', onPress: () => setScanned(false) }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!permission) {
        return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
    }

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
            {isFocused && (
                <CameraView
                    onBarcodeScanned={handleBarCodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
            
            <Portal>
                <Modal visible={isLoading}>
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Lendo nota fiscal, aguarde...</Text>
                    </View>
                </Modal>
            </Portal>

            <Button mode="contained" icon="close" onPress={() => router.back()} style={styles.closeButton}>
                Cancelar
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', backgroundColor: 'black' },
    loadingOverlay: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: 'white', marginTop: 16, fontSize: 18, fontWeight: 'bold' },
    closeButton: { position: 'absolute', bottom: 50, left: 20, right: 20 },
});

export default ScannerScreen;