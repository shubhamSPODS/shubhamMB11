import { Image, NativeModules, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FANTASY_BANNER, LUDO_BANNER, RUMMY_BANNER } from '../../components/ImageAssets'
import { useFocusEffect } from '@react-navigation/native'
import { FULL_WIDTH } from '../../components/Typography'
import { HOME_SCREEN_MAIN, LUDO_GAME_MODE } from '../../navigation/routes'
import { NewColor } from '../../theme/color'
import { HomeTopHeader } from '../../common/HomeTopHeader'

const {SabPaisaSDK} = NativeModules


const HomeScreen = ({ navigation }) => {

    const handleOnPress = () =>{
        SabPaisaSDK.openSabpaisaSDK(["450","testHellow","sabpaisa","7234323432","sabpaisa@gmail.com",],(error,message,clientTxnId)=>{
          console.log(error,"sdk integrated. Transaction Status: "+message,'clientTxnId',clientTxnId);
        //   console.log(error,"sdk integrated. Transaction Status: "+message,'clientTxnId',clientTxnId);
          //   if (Platform.OS === 'android') {
        //     console.log(error,"sdk integrated. Transaction Status: "+message,'clientTxnId',clientTxnId);
        //     ToastAndroid.show(clientTxnId, ToastAndroid.SHORT);
        //   }
        })
      }
    
    return (
        <View style={{ flex: 1, backgroundColor: NewColor.linerWhite }}>
            <HomeTopHeader personClick={() => navigation.openDrawer()} />
            <ScrollView showsVerticalScrollIndicator={false}>
    
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    // navigation.navigate(HOME_SCREEN_MAIN)
                    handleOnPress()
                }}>
                    <Image style={styles.banner}
                        source={FANTASY_BANNER}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate(LUDO_GAME_MODE)
                }} activeOpacity={0.9}>
                    <Image style={styles.banner}
                        source={LUDO_BANNER}
                    />
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>{
                     navigation.navigate('RummyGameMode')
                }} activeOpacity={0.9}>
                    <Image style={styles.banner}
                        source={RUMMY_BANNER}
                    />
                </TouchableOpacity>
                <View style={{ height: 50 }}></View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    banner: {
        width: FULL_WIDTH - 40,
        height: 200,
        alignSelf: "center",
        resizeMode: "cover",
        borderRadius: 10,
        marginTop: 20
    }
})
