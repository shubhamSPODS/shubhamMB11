import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { AppText, POPPINS_SEMI_BOLD } from '../../common/AppText';
import { NewColor } from '../../theme/color';
import TransactionItem from '../../components/TransactionItem';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getLudoTransactions } from '../../actions/profileAction';
import NavigationService from '../../navigation/NavigationService';
import { BOTTOM_NAVIGATION_STACK, BOTTOM_TAB_HOMESCREEN } from '../../navigation/routes';

const TransactionsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const ludoTransactions = useSelector(state => state.profile.ludoTransactions);
    const isLoading = useSelector(state => state.auth.isLoading);

    useEffect(() => {
        dispatch(getLudoTransactions());
    }, [dispatch]);

    return (
        <AppSafeAreaView
            statusColor={true}
            style={styles.container}
            hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <HomeTopHeader
                showBack={true}
                personClick={() => {
                    NavigationService.reset(BOTTOM_NAVIGATION_STACK);
                }}
                title="Transactions"
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={{marginTop: 20}} />
            ) : (
                <FlatList
                    data={ludoTransactions?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    ListEmptyComponent={<AppText style={styles.emptyText}>No transactions found.</AppText>}
                />
            )}
        </AppSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111019',
    },
    list: {
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#FFFFFF',
    },
});

export default TransactionsScreen; 