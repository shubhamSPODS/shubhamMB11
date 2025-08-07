import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, StatusBar, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { AppText, POPPINS_SEMI_BOLD, POPPINS_MEDIUM, WHITE, BROWNYELLOW } from '../../common/AppText';
import { NewColor, colors } from '../../theme/color';
import TransactionItem from '../../components/TransactionItem';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getLudoTransactions, getFantasyTransactions } from '../../actions/profileAction';
import NavigationService from '../../navigation/NavigationService';
import { BOTTOM_NAVIGATION_STACK, BOTTOM_TAB_HOMESCREEN } from '../../navigation/routes';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const TransactionsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'fantasy', title: 'Fantasy' },
        { key: 'ludo', title: 'Ludo' },
    ]);

    const ludoTransactions = useSelector(state => state.profile.ludoTransactions);
    const fantasyTransactions = useSelector(state => state.profile.fantasyTransactions);
    const isLoading = useSelector(state => state.auth.isLoading);

    useEffect(() => {
        dispatch(getLudoTransactions());
        dispatch(getFantasyTransactions());
    }, [dispatch]);

    const renderTabBar = useCallback(props => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: colors.playerDetailsLinerOne,
                height: 3,
                borderRadius: 3,
            }}
            style={{
                backgroundColor: 'transparent',
                elevation: 0,
                marginHorizontal: 20,
                height: 45,
                marginVertical: 10,
            }}
            renderLabel={({ route, focused }) => (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <AppText
                        type={16}
                        weight={POPPINS_SEMI_BOLD}
                        color={focused ? BROWNYELLOW : WHITE}
                        style={{ fontSize: 16 }}>
                        {route.title}
                    </AppText>
                </View>
            )}
            pressColor="transparent"
            tabStyle={{ borderRadius: 0 }}
        />
    ), []);

    const FantasyTab = useCallback(() => {
        const sortedTransactions = fantasyTransactions?.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];

        return (
            <View style={styles.tabContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={sortedTransactions}
                        renderItem={({ item }) => <TransactionItem item={item} />}
                        keyExtractor={item => item._id || item.id}
                        style={styles.list}
                        ListEmptyComponent={
                            <AppText style={styles.emptyText}>No fantasy transactions found.</AppText>
                        }
                    />
                )}
            </View>
        );
    }, [fantasyTransactions, isLoading]);

    const LudoTab = useCallback(() => {
        const sortedTransactions = ludoTransactions?.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];

        return (
            <View style={styles.tabContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={sortedTransactions}
                        renderItem={({ item }) => <TransactionItem item={item} />}
                        keyExtractor={item => item._id || item.id}
                        style={styles.list}
                        ListEmptyComponent={
                            <AppText style={styles.emptyText}>No ludo transactions found.</AppText>
                        }
                    />
                )}
            </View>
        );
    }, [ludoTransactions, isLoading]);

    const renderScene = useMemo(() => SceneMap({
        fantasy: FantasyTab,
        ludo: LudoTab,
    }), [FantasyTab, LudoTab]);

    const handleIndexChange = useCallback((newIndex) => {
        setIndex(newIndex);
    }, []);

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

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={handleIndexChange}
                initialLayout={{ width: screenWidth }}
                renderTabBar={renderTabBar}
                lazy={true}
                lazyPreloadDistance={1}
                swipeEnabled={true}
            />
        </AppSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111019',
    },
    tabContainer: {
        flex: 1,
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