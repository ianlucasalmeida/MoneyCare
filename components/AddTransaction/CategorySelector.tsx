import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, HelperText, IconButton, List, Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';
import { categories } from '../../constants/categories';
import { Category } from '../../types';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
  type: 'entrada' | 'saida';
  error?: string | null;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect, type, error }) => {
    const theme = useTheme(); // MUDANÇA: Precisamos do tema para as cores
    const [modalVisible, setModalVisible] = useState(false);
    const filteredCategories = categories.filter(c => c.type === (type === 'entrada' ? 'income' : 'expense'));

    const handleSelectCategory = (category: Category) => {
        onSelect(category);
        setModalVisible(false);
    };

    return (
        <View>
            {selectedCategory ? (
                <Surface style={styles.selectedCategory} elevation={1}>
                    <Avatar.Icon size={40} icon={selectedCategory.icon} style={{backgroundColor: 'transparent'}} color={theme.colors.primary} />
                    <Text style={styles.categoryName}>{selectedCategory.name}</Text>
                    <IconButton icon="close-circle" onPress={() => onSelect(null)} />
                </Surface>
            ) : (
                <Button
                    mode="outlined"
                    onPress={() => setModalVisible(true)}
                    icon="tag-plus-outline"
                    style={error ? { borderColor: theme.colors.error, marginBottom: 4 } : { marginBottom: 0 }}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Selecionar Categoria
                </Button>
            )}
            <HelperText type="error" visible={!!error}>{error}</HelperText>

            <Portal>
                {/* MUDANÇA: O estilo do modal agora usa a cor do tema */}
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[styles.modalContainer, {backgroundColor: theme.colors.surface}]}>
                   <View style={styles.modalHeader}>
                       <Text variant="headlineSmall">Categorias de {type === 'entrada' ? 'Receita' : 'Despesa'}</Text>
                       <IconButton icon="close" onPress={() => setModalVisible(false)} />
                   </View>
                    <ScrollView>
                        {filteredCategories.map(cat => (
                            <List.Item
                                key={cat.id}
                                title={cat.name}
                                left={() => <List.Icon icon={cat.icon} color={theme.colors.primary}/>}
                                onPress={() => handleSelectCategory(cat)}
                            />
                        ))}
                    </ScrollView>
                </Modal>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    selectedCategory: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, marginBottom: 4 },
    categoryName: { flex: 1, marginLeft: 12, fontSize: 16 },
    modalContainer: { margin: 20, borderRadius: 16, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }
});