import React, { useEffect } from 'react';
import { ImageBackground, Linking, Share, StyleSheet, View } from 'react-native';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import {
  MyBattleReferBackground,
  ReferEarn,
  ReferIcon,
  ThreeIcon,
  UserIcon,
  chain,
  film,
  medal,
  refer_earn,
  wallet_icon,
  whatsapp,
  BackIcon
} from '../../helper/image';
import { ArrowBackIcon, Button, StatusBar } from 'native-base';
import FastImage from 'react-native-fast-image';
import { NewColor, colors } from '../../theme/color';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FIFTEEN,
  GRY,
  LIGHTWHITE,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  TWENTY_FOUR,
  WHITE,
} from '../../common/AppText';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { IMAGE_BASE_URL, shareToAny } from '../../helper/utility';
import { SolidButton } from '../../common/SolidButton';
import PrimaryButton from '../../common/primaryButton';
import NavigationService from '../../navigation/NavigationService';
import { MY_BALANCE } from '../../navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_TOKEN_KEY } from '../../libs/constants';
import { getRefferalList } from '../../actions/profileAction';

export const createLinkRefer = async (refercode: any) => {
  try {
    const link = await dynamicLinks().buildShortLink({
      link: `https://mybattle11.page.link/eNh4?refercode=${refercode}`,
      domainUriPrefix: 'https://mybattle11.page.link',
      android: {
        packageName: 'com.mybattle11'
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    }, dynamicLinks.ShortLinkType.DEFAULT);
    return link;
  } catch (error) {
  }
};
export const shareLinkTeam = async (refercode: any) => {
  const link = await createLinkRefer(refercode);
  const message = `Join me on MyBattle11 and Enjoy Winning in every Contest.\n
   Also, Get Rs.100 joining Bonus and Rs. 100 by using my referral code.\n 
    Click the Link below and download the application now.
    \n https://mybattle11.com/ \n
     Don't Forget to use my Invite Code ${refercode} \n
      Enjoy Winning. MyBattle11`;
  try {
    Share.share({
      message: message,
    });
  } catch (error) {
  }
};
const MyBattleReferEarn = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => {
    return state.profile.userData;
  });

  const refferalList = useSelector((state) => {
    return state.profile.refferalList;
  });

  useEffect(() => {
    dispatch(getRefferalList())
  }, []);
  

  const data = [
    {
      id: 1,
      image: chain,
      title: 'Invite your friends',
      about:
        'Share the link with you Friends over whatsapp or any other social platform.',
    },
    {
      id: 2,
      image: film,
      title: 'Get INR 100 when Signup',
      about: 'When your friend sign up on the app, you will receive 100.',
    },
    // {
    //   id: 3,
    //   image: medal,
    //   title: 'Get INR 50 when they add money',
    //   about:
    //     'When your friend will add money in the wallet, you will receive 50.',
    // },
  ];

  const openWhatsApp = () => {
    const whatsappURL =
      `whatsapp://send?text=${userData?.refercode}`;
    Linking.openURL(whatsappURL)
      .then(supported => {
        if (!supported) {
          console.error('WhatsApp is not installed on your device.');
        }
      })
      .catch(error => {
        console.error('An error occurred while opening WhatsApp:', error);
      });
  };

    console.log(refferalList, "refferalList")
  return (
    <AppSafeAreaView>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <ImageBackground
        source={MyBattleReferBackground}
        resizeMode="contain"
        style={styles.MyBattleReferBackground}>
        <View style={[styles.main, { marginTop: 10 }]}>
        <TouchableOpacityView
            style={{ height: 22, width: 22, position:'absolute',bottom:-8,left:-50}}
            onPress={()=> NavigationService.goBack()}>
            <FastImage
              resizeMode="contain"
              source={BackIcon}
              style={styles.personImage}
            />
            {/* <View style={styles.userfilter}>
              <FastImage
                source={ThreeIcon}
                resizeMode='contain'
                style={{ height: 10, width: 10 }} />
            </View> */}
          </TouchableOpacityView>
           
          <FastImage
            source={ReferEarn}
            resizeMode="contain"
            style={styles.ReferEarn}
          />
        </View>
        <View
          style={[
            styles.main,
            {
              marginTop: 50,
            },
          ]}>
          <FastImage
            source={ReferIcon}
            resizeMode="contain"
            style={styles.ReferIcon}
          />
        </View>
        <View style={styles.refrebox}>
          <LinearGradient
            colors={['#D89E3C', '#EAD288']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.refreboxtwo}>
            <AppText
              type={TWENTY_FOUR}
              weight={POPPINS_SEMI_BOLD}
              color={BLACK}>
              ₹{refferalList?.length * 100}
            </AppText>
            <AppText
              style={{ marginTop: -10 }}
              weight={POPPINS_SEMI_BOLD}
              color={BLACK}>
              collected
            </AppText>
          </LinearGradient>
          <View style={{ flexDirection: 'row', marginLeft: 15,width:'65%' }}>
            <AppText
              type={FIFTEEN}
              weight={POPPINS_MEDIUM}
              color={BLACKOPACITY}>
              Invite accepted -<AppText color={WHITE} weight={POPPINS_SEMI_BOLD}>{refferalList?.length}</AppText> {`\n`}Refer Code - <AppText color={WHITE} weight={POPPINS_SEMI_BOLD}>{userData?.refercode}</AppText>
            </AppText>
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          height: 14,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: '19%',
        }}>
        <LinearGradient
          style={{
            width: 128,
            height: 1,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            colors.linerLineBlue,
            colors.linerLinePick,
          ]}></LinearGradient>
        <AppText weight={POPPINS_MEDIUM}>How it works! </AppText>
        <LinearGradient
          style={{
            width: 128,
            height: 1,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            colors.linerLineBlue,
            colors.linerLinePick,
          ]}></LinearGradient>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            height: 240,
          }}>
          {data?.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 39,
                    height: 39,
                    backgroundColor: colors.bottomBackgroundColor,
                    borderRadius: 20,
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}>
                  <FastImage
                    resizeMode="contain"
                    style={{ width: 21, height: 21 }}
                    source={item?.image}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 15,
                    flex: 1,
                  }}>
                  <AppText type={POPPINS_MEDIUM}>{item?.title}</AppText>
                  <AppText numberOfLines={2} type={TEN} color={GRY}>
                    {item?.about}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: universalPaddingHorizontal,
          paddingVertical: 10,
        }}>
        <PrimaryButton
          onPress={() => shareLinkTeam(userData?.refercode)}
          buttonStyle={{
            marginHorizontal: universalPaddingHorizontal,
          }}
          titleStyle={{ color: 'black' }}
          title="Invite"
        />
        {/* <SolidButton
            onPress={openWhatsApp}
            size={TEN}
            color={WHITE}
            style={[
              styles.mediaBtn,
              { backgroundColor: colors.bottomBackgroundColor },
            ]}
            nogradient={true}
            ImageStyle={styles.commonBtn}
            Icon={whatsapp}></SolidButton> */}
      </View>
    </AppSafeAreaView>
  );
};

export default MyBattleReferEarn;

const styles = StyleSheet.create({
  MyBattleReferBackground: {
    height: 315,
  },
  main: {
    alignSelf: 'center',
  },
  ReferEarn: {
    height: 51,
    width: 280,
    top: 30,
  },
  ReferIcon: {
    height: 180,
    width: 233,
  },
  refrebox: {
    flexDirection: 'row',
    height: 80,
    position: 'absolute',
    bottom: '-13%',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.bottomBackgroundColor,
    width: "90%",
    alignSelf: "center"
  },
  refreboxtwo: {
    height: 62,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexDirection: 'column',
  },
  buttoncontainer: {
    marginHorizontal: universalPaddingHorizontal,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaBtn: {
    flexDirection: 'row',
    width: '15%',
    height: 48,
    position: 'absolute',
    bottom: '19%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-end',
    right: 14,
  },
  commonBtn: {
    width: 29,
    height: 29,
    marginRight: 2,
    resizeMode: 'contain',
  },
  personImage: {
    height: 20,
    width: 28,
    borderRadius: 100,
  },
  userfilter: {
    position: "absolute", alignSelf: "flex-end", top: 18
  },
});


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { AppSafeAreaView } from '../../common/AppSafeAreaView'
// import { AppText, TWENTY } from '../../common/AppText'

// const MyBattleReferEarn = () => {
//   return (
//     <AppSafeAreaView>


//      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

//       <AppText type={TWENTY}>Coming Soon</AppText>
//      </View>

//     </AppSafeAreaView>
//   )
// }

// export default MyBattleReferEarn

// const styles = StyleSheet.create({})