import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { AppText, POPPINS_SEMI_BOLD } from '../../common/AppText';
import { NewColor } from '../../theme/color';
import TransactionItem from '../../components/TransactionItem';
import { back } from '../../helper/image';
import { GET_WITH_TOKEN } from '../../Backend/Backend';

const TransactionsScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const json = await GET_WITH_TOKEN('userGames');
                if (json.success && Array.isArray(json.data)) {
                    const allTransactions = json.data.flatMap(game => game.transactions || []);
                    setTransactions(allTransactions);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredData = transactions.filter(item => {
        if (selectedFilter === 'All') {
            return true;
        }
        if (selectedFilter === 'Deposit') {
            return item.title === 'Deposit';
        }
        return item.title === selectedFilter;
    });

    const renderFilterButton = (title) => {
        const isActive = selectedFilter === title;
        return (
            <TouchableOpacity
                style={[styles.filterButton, isActive && styles.activeFilterButton]}
                onPress={() => setSelectedFilter(title)}
            >
                <AppText weight={POPPINS_SEMI_BOLD} style={[styles.filterButtonText, isActive && styles.activeFilterButtonText]}>
                    {title}
                </AppText>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={back} style={styles.backIcon} />
                </TouchableOpacity>
                <AppText weight={POPPINS_SEMI_BOLD} style={styles.headerTitle}>Transactions</AppText>
                <View style={{width: 25}} />
            </View>

            <View style={styles.filterContainer}>
                {renderFilterButton('All')}
                {renderFilterButton('Deposit')}
                {renderFilterButton('Fee')}
                {renderFilterButton('Prize')}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={{marginTop: 20}} />
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    ListEmptyComponent={<AppText style={styles.emptyText}>No transactions found.</AppText>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#111019', 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1a0f35', 
    },
    backIcon: {
        width: 25,
        height: 25,
        tintColor: '#FFFFFF',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    list: {
        marginTop: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#3F3F3F',
    },
    activeFilterButton: {
        backgroundColor: '#FFFFFF',
    },
    filterButtonText: {
        color: '#FFFFFF',
    },
    activeFilterButtonText: {
        color: '#000000',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#FFFFFF',
    },
});

export default TransactionsScreen; 