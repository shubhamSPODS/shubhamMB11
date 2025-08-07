import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { FANTASY_BANNER, LUDO_BANNER, RUMMY_BANNER } from '../../components/ImageAssets'
import { useNavigation } from '@react-navigation/native'
import { FULL_WIDTH } from '../../components/Typography'
import { CRICKET_TAB, LUDO_GAME_MODE } from '../../navigation/routes'
import { NewColor } from '../../theme/color'
import { HomeTopHeader } from '../../common/HomeTopHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_TOKEN_KEY } from '../../libs/constants'

const HomeScreen = ({ navigation, route }) => {
    const token = AsyncStorage.getItem(USER_TOKEN_KEY);
    console.log("token>>>>>>>", token)

    // If this HomeScreen is inside a game tab, navigate back to parent
    useEffect(() => {
        const parent = navigation.getParent();
        if (parent?.getState()?.routeNames?.includes('Cricket') || parent?.getState()?.routeNames?.includes('Ludo')) {
            navigation.getParent()?.goBack();
        }
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: NewColor.linerWhite }}>
            <HomeTopHeader personClick={() => navigation.openDrawer()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.bannerContainer}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    navigation.navigate(CRICKET_TAB)
                }}>
                    <Image style={styles.banner1}
                        source={FANTASY_BANNER}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate(LUDO_GAME_MODE)
                }} activeOpacity={0.9}>
                    <Image style={styles.banner2}
                        source={LUDO_BANNER}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity  
                // onPress={()=>{navigation.navigate('RummyGameMode')}} 
                activeOpacity={0.9}>
                    <Image style={styles.banner3}
                        source={RUMMY_BANNER}
                    />
                </TouchableOpacity> */}
                </View>
                <View style={{ height: 50 }}></View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    bannerContainer: {
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    banner1: {
        width: FULL_WIDTH - 80,
        height: 180,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 12,
        marginBottom: 25,
    },
    banner2: {
        width: FULL_WIDTH - 80,
        height: 180,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 12,
    },
     banner3: {
        width: FULL_WIDTH - 50,
        height: 200,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 10,
        marginStart: 20
    },
})
