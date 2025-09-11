import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, HelperText, IconButton, List, Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';
import { categories } from '../../constants/categories'; // Caminho ajustado
import { Category } from '../../types';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
  type: 'entrada' | 'saida';
  error?: string | null;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect, type, error }) => {
    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const filteredCategories = categories.filter(c => c.type === (type === 'entrada' ? 'income' : 'expense'));

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Categoria *</Text>
                {selectedCategory ? (
                    <Surface style={styles.selectedCategory} elevation={1}>
                        <Avatar.Icon size={40} icon={selectedCategory.icon} />
                        <Text style={styles.categoryName}>{selectedCategory.name}</Text>
                        <IconButton icon="close-circle" onPress={() => onSelect(null)} />
                    </Surface>
                ) : (
                    <Button
                        mode="outlined"
                        onPress={() => setModalVisible(true)}
                        icon="tag-plus-outline"
                        style={error ? { borderColor: theme.colors.error } : {}}
                    >
                        Selecionar Categoria
                    </Button>
                )}
                <HelperText type="error" visible={!!error}>{error}</HelperText>

                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                       <View style={styles.modalHeader}>
                           <Text variant="headlineSmall">Categorias de {type === 'entrada' ? 'Receita' : 'Despesa'}</Text>
                           <IconButton icon="close" onPress={() => setModalVisible(false)} />
                       </View>
                        <ScrollView>
                            {filteredCategories.map(cat => (
                                <List.Item
                                    key={cat.id}
                                    title={cat.name}
                                    left={() => <List.Icon icon={cat.icon} />}
                                    onPress={() => { onSelect(cat); setModalVisible(false); }}
                                />
                            ))}
                        </ScrollView>
                    </Modal>
                </Portal>
            </Card.Content>
        </Card>
    )
}
// Adicione aqui os estilos relevantes do seu arquivo original
const styles = StyleSheet.create({
    card: { marginBottom: 16 },
    sectionTitle: { marginBottom: 16 },
    selectedCategory: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8 },
    categoryName: { flex: 1, marginLeft: 12, fontSize: 16 },
    modalContainer: { backgroundColor: 'white', margin: 20, borderRadius: 16, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' }
});