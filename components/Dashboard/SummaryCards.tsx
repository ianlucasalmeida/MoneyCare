import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ balance, income, expenses }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Avatar.Icon size={40} icon="wallet-outline" style={[styles.icon, { backgroundColor: theme.colors.surface }]} />
                    <View>
                        <Text variant="bodyMedium" style={styles.label}>Saldo do Período</Text>
                        <Text variant="headlineSmall" style={{ color: balance >= 0 ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
                            R$ {balance.toFixed(2)}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
            <View style={styles.row}>
                <Card style={styles.halfCard}>
                    <Card.Content style={styles.cardContent}>
                        <Avatar.Icon size={40} icon="arrow-up-bold-box" color="#4CAF50" style={styles.icon} />
                        <View>
                            <Text variant="bodySmall" style={styles.label}>Entradas</Text>
                            <Text variant="titleMedium" style={styles.value}>R$ {income.toFixed(2)}</Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.halfCard}>
                    <Card.Content style={styles.cardContent}>
                        <Avatar.Icon size={40} icon="arrow-down-bold-box" color="#F44336" style={styles.icon} />
                        <View>
                            <Text variant="bodySmall" style={styles.label}>Saídas</Text>
                            <Text variant="titleMedium" style={styles.value}>R$ {expenses.toFixed(2)}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    card: {
        width: '100%',
    },
    halfCard: {
        width: '48%',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        backgroundColor: 'transparent',
        marginRight: 12,
    },
    label: {
        opacity: 0.7,
        marginBottom: 2,
    },
    value: {
        fontWeight: 'bold',
    },
});