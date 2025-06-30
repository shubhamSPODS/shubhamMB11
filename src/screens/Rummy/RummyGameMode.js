import { StyleSheet, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { AppText, BOLD, EIGHTEEN } from '../../common/AppText'
import PrimaryButton from '../../common/primaryButton'
import { colors } from '../../theme/color'
import { POOL, PRIZE, SECURE } from '../../helper/image'
import { AppSafeAreaView } from '../../common/AppSafeAreaView'
import { universalPaddingHorizontal } from '../../theme/dimens'
import { HomeTopHeader } from '../../common/HomeTopHeader'

const gameData = [
    {
        id: '1',
        title: 'Points',
        description: `Quick & rewarding \n\nHow it works: Each point has a fixed value. Win by declaring first — earn chips based on opponents' total points.`,
        priceRange: '₹2 - ₹10,000',
        players: '2-6 Players',
        icon: PRIZE
    },
    {
        id: '2',
        title: 'Deals',
        description: `Fixed deals, big stakes \n\nHow it works: Play a set number of deals. The player with the most chips at the end wins.`,
        priceRange: '₹50 - ₹1,000',
        players: '2-6 Players',
        icon: POOL
    },
    {
        id: '3',
        title: '101 Pool',
        description: `Fast knockout mode \n\nHow it works: Players are out once they cross 101 points. Last player remaining wins the game.`,
        priceRange: '₹25 - ₹500',
        players: '2-4 Players',
        icon: SECURE
    },
    {
        id: '4',
        title: '201 Pool',
        description: `Longer, strategic play \n\nHow it works: Similar to 101, but elimination is after 201 points. Stay below the limit to win`,
        priceRange: '₹25 - ₹500',
        players: '2-4 Players',
        icon: SECURE
    }
]

const GameModeCard = ({ title, description, priceRange, players, icon }) => {
    const navigation = useNavigation()

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <AppText weight={BOLD} type={EIGHTEEN}>{title}</AppText>
                    <AppText color={colors.gray} style={{ marginTop: 4 }}>
                        {description}
                    </AppText>
                </View>
                <Image source={icon} style={{ right: 15, width: 25, height: 25, resizeMode: 'contain', tintColor: colors.golden }} />
            </View>

            <PrimaryButton
                title="Play Now"
                buttonStyle={{ marginTop: 10 }}
                onPress={() => {
                    navigation.navigate('GameTable', {
                        gameType: 'Rummy',
                        gameMode: title
                    })
                }}
            />
        </View>
    )
}

const RummyGameMode = () => {
    const navigation = useNavigation()
    const renderGameCard = ({ item }) => (
        <GameModeCard
            title={item?.title}
            description={item.description}
            priceRange={item.priceRange}
            players={item.players}
            icon={item.icon}
        />
    )

    return (
        <AppSafeAreaView>
            <HomeTopHeader
                showBack={true}
                personClick={() =>
                    navigation.getParent()?.goBack()
                }
            />
            <ScrollView>
                <FlatList
                    data={gameData}
                    renderItem={renderGameCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                />
            </ScrollView>
        </AppSafeAreaView>
    )
}

export default RummyGameMode

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        backgroundColor: '#3f3f3f',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 8,
    }
})