import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, Image, BackHandler } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import HeaderComponent from '../../../Components/HeaderComponent'
// import AppText, { FULL_WIDTH } from '../../../Components/AppText'
// import { GOLDEN, GREY, WHITE } from '../../../Components/Colors'
// import Icon from '../../../Components/Icon'
// import { DICE, DICE_1, DICE_2, PROFILE2 } from '../../../Components/ImageAsstes'
// import { MEDIUM, SEMI_BOLD } from '../../../Components/AppFonts'
// import CustomButton from '../../../Components/CustomButton'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { colors, NewColor } from '../../theme/color'
import { AppText, SEMI_BOLD } from '../../common/AppText'
import { FULL_WIDTH } from '../../Backend/Backend'
import { DICE, DICE1, DICE2 } from '../../helper/image'
import { AppSafeAreaView } from '../../common/AppSafeAreaView'
import { HomeTopHeader } from '../../common/HomeTopHeader'
import { TouchableOpacityView } from '../../common/TouchableOpacityView'
import PrimaryButton from '../../common/primaryButton'

const LudoGameMode = () => {
    const navigation = useNavigation()
    const [gameMode, setGameMode] = useState([
        {
            id: 0,
            name: 'Classic',
            description: `Its a regular LUDO game where you have to play moves based of the dice rolling numbers. First Player to get all Tokens in house will win the game.`,
            img: DICE,
            gameMode: 'Classic',
        },
        {
            id: 1,
            name: 'Timer',
            description: `This is a quick game where all tokens will be ready to move and you will get points for every steps and extra points to get token in the house. It will be a 7 minutes game and player with higher points will WIN. `,
            img: DICE1,
            gameMode: 'Timer',
        },
        {
            id: 2,
            name: 'Ludo 51',
            description: `In this game each player will get 51 moves. All tokens will be ready to move from starting of the game. Players to score higher points will WIN the game.`,
            img: DICE2,
            gameMode: 'Turbo',
        },
    ])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.getParent()?.goBack();
            return true;
        });

        return () => backHandler.remove();
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            const parent = navigation.getParent();
            const currentRoute = parent?.getCurrentRoute?.();
            if (parent && currentRoute?.name === 'Home') {
                setTimeout(() => {
                    parent.goBack();
                }, 100);
            }
        }, [navigation])
    );

    const fadeAnims = useRef(gameMode?.map(() => new Animated.Value(0))).current
    useEffect(() => {
        const animations = fadeAnims.map((anim, index) => {
            return Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                delay: index * 200,
                useNativeDriver: true,
            })
        })
        Animated.stagger(200, animations).start()
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        opacity: fadeAnims[index],
                        transform: [{
                            translateY: fadeAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0]
                            })
                        }]
                    }
                ]}
            >
                <View style={styles.cardInner}>
                    <View style={{ width: '100%', flexDirection: 'row', }}>
                        <View style={{ flex: 1, }}>
                            <AppText size={15}type={SEMI_BOLD} >{item?.name}</AppText>
                            <AppText size={11} color={colors.gray} type={SEMI_BOLD}>
                                {item?.description}
                            </AppText>
   {/* <TouchableOpacityView style={{width:'100%',backgroundColor:colors.lightGolden,alignSelf:'center'}}>
    <AppText>Play Now</AppText>
   </TouchableOpacityView> */}
        
                            {/* <CustomButton style={{ left: 15 }} title='Play Now' onPress={() => {
                                navigation.navigate('GameTable', { 
                                    gameType: 'Ludo',
                                    gameMode: item?.gameMode 
                                })
                            }} /> */}

                        </View>
                        <TouchableOpacity>
                            <Image source={item?.img} style={{width:35,height:35,resizeMode:'contain'}}  />
                        </TouchableOpacity>
                    </View>
                </View>
                <PrimaryButton
            buttonStyle={styles.button}
            title="Play Now"
            onPress={()=>{
                navigation.navigate('GameTable', { 
                    gameType: 'Ludo',
                    gameMode: item?.gameMode 
                })
            }}
          />
            </Animated.View>
        )
    }

    return (
        <AppSafeAreaView
      statusColor={true}
      style={{ backgroundColor: NewColor.linerWhite }}
      hidden={false}>
         <HomeTopHeader
        showBack={true}
        personClick={() =>
          navigation.getParent()?.goBack()
        }
      />
            <ScrollView>
                <FlatList
                    data={gameMode}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </ScrollView>

            </AppSafeAreaView>
    )
}

export default LudoGameMode

const styles = StyleSheet.create({
    button: {
    marginVertical:10,
    width:'90%',
    alignSelf:"center",
    },
    card: {
        width: FULL_WIDTH - 50,
        alignSelf: 'center',
        elevation: 1,
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: '#3f3f3f',

    },
    cardInner: {
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    joinButton: {
        position: 'absolute',
        bottom: 16,
        backgroundColor: colors.lightGolden,
        width: FULL_WIDTH - 32,
    },
})
