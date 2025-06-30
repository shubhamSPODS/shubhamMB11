import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FANTASY_BANNER, LUDO_BANNER, RUMMY_BANNER } from '../../components/ImageAssets'
import { useFocusEffect } from '@react-navigation/native'
import { FULL_WIDTH } from '../../components/Typography'
import { CRICKET_TAB, LUDO_GAME_MODE } from '../../navigation/routes'
import { NewColor } from '../../theme/color'
import { HomeTopHeader } from '../../common/HomeTopHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_TOKEN_KEY } from '../../libs/constants'

const HomeScreen = ({ navigation }) => {
    const token = AsyncStorage.getItem(USER_TOKEN_KEY);
    console.log("token>>>>>>>", token)
    return (
        <View style={{ flex: 1, backgroundColor: NewColor.linerWhite }}>
            <HomeTopHeader personClick={() => navigation.openDrawer()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', }}>
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
                <TouchableOpacity  onPress={()=>{
                     navigation.navigate('RummyGameMode')
                }} activeOpacity={0.9}>
                    <Image style={styles.banner3}
                        source={RUMMY_BANNER}
                    />
                </TouchableOpacity>
                </View>
                <View style={{ height: 50 }}></View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
   
    banner1: {
        width: FULL_WIDTH - 75,
        height: 165,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 10,
    },
    banner2: {
        width: FULL_WIDTH - 65,
        height: 200,
        alignSelf: "center",
        resizeMode: "contain",
        borderRadius: 10,
        marginStart: 5
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
