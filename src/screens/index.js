import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  StatusBar,
  Linking
} from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { shareToAny } from '../helper/utility';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  ELEVEN,
  FIFTEEN,
  LATO_HEAVY,
  LATO_SEMI_BOLD,
  LIGHTGOLDEN,
  POPPINS_BOLD,
  POPPINS_EXTRA_BOLD_ITALIC,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TEN,
  THIRTEEN,
  TWELVE,
  TWENTY,
  TWENTY_FIVE,
  TWENTY_FOUR,
  WHITE,
} from '../common/AppText';
import Header from '../common/Header';
import {
  referbackground,
  Refer1,
  Refer2,
  Refer3,
  Refer4,
  whatsapp,
  chain,
  film,
  medal,
  WalletBox,
  iconbell,
  rightArrow,
} from '../helper/image';
import { Button } from '../common/Button';
import { SolidButton } from '../common/SolidButton';
import { KeyBoardAware } from '../common/KeyboardAware';
import { NewColor, colors } from '../theme/color';
import { universalPaddingHorizontal } from '../theme/dimens';
import FastImage from "@d11/react-native-fast-image";
import { TouchableOpacityView } from '../common/TouchableOpacityView';
import NavigationService from '../navigation/NavigationService';
import MyBattleLogin from './MyBattleLogin';
import { ADD_MONEY_SCREEN, MYBATTLELOGIN, MYBATTLEOTP, MYBATTLEREFEREARN, MY_BALANCE, Notification__SCREEN, TRANSACTION_SCREEN, KYC_SCREEN } from '../navigation/routes';
import { useSelector } from 'react-redux';

const ReferAndEarn = () => {
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  let totalbalance = userData?.winning_amount + userData?.cash_bonus + userData?.totaldeposit;

  const data = [
    {
      id: 1,
      title: 'Total Balance',
      balance: '₹500',
      FastImage: WalletBox,
      titletwo: 'Deposits',
      deposit: '₹50',
      titlethree: 'Winnings',
      titlefour: 'Cashback',
      titlefive: 'Cash balance',
    },
  ];

  // const openWhatsApp = () => {
  //   const whatsappURL = 'whatsapp://send?text=ANNSKJJKsJKASJKAJSDJKASJKDASJKDJASJASK';
  //   Linking.openURL(whatsappURL)
  //     .then((supported) => {
  //       if (!supported) {
  //         console.error('WhatsApp is not installed on your device.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('An error occurred while opening WhatsApp:', error);
  //     });
  // }

  return (
    <>
      <AppSafeAreaView statusColor={'transparent'} hidden={false}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent={true}
          networkActivityIndicatorVisible={true}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <View style={styles.mainview}>
            <AppText type={FIFTEEN} weight={POPPINS_SEMI_BOLD} color={LIGHTGOLDEN}>
              MY BALANCE
            </AppText>
            <TouchableOpacityView onPress={() => NavigationService.navigate(Notification__SCREEN)} style={styles.iconbellview}>
              <View >
                <FastImage
                  source={iconbell}
                  resizeMode="contain"
                  style={styles.iconbell}
                />
              </View>
            </TouchableOpacityView>
          </View>
          <View>
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={['#DBA63D99', '#F0E6A54D']}
              style={styles.mainbox}>
              {data?.map(item => {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                      }}>
                      <View style={{ marginTop: 10 }}>
                        <AppText type={THIRTEEN} weight={POPPINS_MEDIUM}>
                          {item.title}
                        </AppText>
                        <AppText type={TWENTY_FIVE} weight={POPPINS_SEMI_BOLD}>
                          {Number(totalbalance)?.toFixed(2)}
                        </AppText>
                      </View>

                      <FastImage
                        source={item?.FastImage}
                        resizeMode="contain"
                        style={{ height: 87, width: 78, right: 30 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 1,
                        marginTop: -15,
                      }}>
                      <LinearGradient
                        colors={[
                          '#DBA73E',
                          // '#D89D3A',
                          // '#F4F3B8',
                          '#F7ED9A',
                          '#D5B767',
                          // '#D0AB5B',
                          // '#E0C77D',
                        ]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.box}>
                        <AppText
                          type={TWELVE}
                          weight={POPPINS_LIGHT}
                          color={BLACK}>
                          {item.titletwo}
                        </AppText>
                        <AppText
                          style={{ marginTop: 3 }}
                          type={FIFTEEN}
                          weight={SEMI_BOLD}
                          color={BLACK}>
                          ₹{userData.totaldeposit?.toFixed(2)}
                        </AppText>
                        <TouchableOpacityView style={styles.depositbutton} onPress={() => NavigationService.navigate(ADD_MONEY_SCREEN)}>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AppText type={ELEVEN} weight={POPPINS_LIGHT}>
                              Deposit
                            </AppText>
                            <FastImage
                              source={rightArrow}
                              resizeMode="contain"
                              style={{ height: 10, width: 10, marginLeft: 10 }}
                            />
                          </View>
                        </TouchableOpacityView>
                      </LinearGradient>
                      <View style={styles.boxtwo}>
                        <AppText
                          type={TWELVE}
                          weight={POPPINS_LIGHT}
                          color={WHITE}>
                          {item.titlethree}
                        </AppText>
                        <AppText
                          style={{ marginTop: 3 }}
                          type={FIFTEEN}
                          weight={SEMI_BOLD}
                          color={WHITE}>
                          ₹{Number(userData?.winning_amount)?.toFixed(2)}
                        </AppText>
                        <TouchableOpacityView
                          style={[
                            styles.depositbutton,
                            {
                              backgroundColor: '#3EAA35',
                            },
                          ]} onPress={() => NavigationService.navigate(MY_BALANCE)}>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <AppText type={ELEVEN} weight={POPPINS_LIGHT}>
                              Withdraw
                            </AppText>
                            <FastImage
                              source={rightArrow}
                              resizeMode="contain"
                              style={{ height: 10, width: 10, marginLeft: 10 }}
                            />
                          </View>
                        </TouchableOpacityView>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={[
                          styles.box,
                          {
                            backgroundColor: colors.bottomBackgroundColor,
                            marginTop: 1,
                          },
                        ]}>
                        <AppText
                          type={TWELVE}
                          weight={POPPINS_LIGHT}
                          color={WHITE}
                          style={{ marginTop: 6 }}>
                          {item.titlefour}
                        </AppText>
                        <AppText
                          style={{ marginTop: 10 }}
                          type={FIFTEEN}
                          weight={SEMI_BOLD}
                          color={WHITE}>
                          ₹0
                        </AppText>
                      </View>
                      <View
                        style={[
                          styles.boxtwo,
                          {
                            bottom: 9,
                          },
                        ]}>
                        <AppText
                          type={TWELVE}
                          weight={POPPINS_LIGHT}
                          color={WHITE}
                          style={{ marginTop: 6 }}>
                          {'Cash Bonus'}
                        </AppText>
                        <AppText
                          style={{ marginTop: 10 }}
                          type={FIFTEEN}
                          weight={SEMI_BOLD}
                          color={WHITE}>
                          ₹{userData?.cash_bonus?.toFixed(2)}
                        </AppText>
                      </View>
                    </View>
                  </>
                );
              })}
            </LinearGradient>
            <View style={{ paddingHorizontal: 17 }}>
              <TouchableOpacityView style={styles.histroymainbox} onPress={() => NavigationService.navigate(TRANSACTION_SCREEN)}>
                <AppText type={THIRTEEN} weight={POPPINS_MEDIUM}>
                  Transaction History
                </AppText>
                <FastImage
                  source={rightArrow}
                  resizeMode="contain"
                  style={{ height: 15, width: 20 }}
                />
              </TouchableOpacityView>
            </View>
            <View style={{ paddingHorizontal: 17 }}>
              <TouchableOpacityView style={styles.histroymainbox} onPress={() => NavigationService.navigate(KYC_SCREEN)}>
                <AppText type={THIRTEEN} weight={POPPINS_MEDIUM}>
                  KYC Status
                </AppText>
                <FastImage
                  source={rightArrow}
                  resizeMode="contain"
                  style={{ height: 15, width: 20 }}
                />
              </TouchableOpacityView>
            </View>
          </View>
          {/* <TouchableOpacityView style={{
            height: 40,
            with: "100%", backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
            onPress={() => NavigationService.navigate(MYBATTLELOGIN)}
          >
            <AppText>
              login
            </AppText>
          </TouchableOpacityView>
          <TouchableOpacityView style={{
            height: 40,
            with: "100%", backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
            onPress={() => NavigationService.navigate(MYBATTLEOTP)}
          >
            <AppText>
              otp
            </AppText>
          </TouchableOpacityView>
          <TouchableOpacityView style={{
            height: 40,
            with: "100%", backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }} onPress={() => NavigationService.navigate(MYBATTLEREFEREARN)}>
            <AppText>
              refer and earn
            </AppText>
          </TouchableOpacityView> */}
        </KeyBoardAware>
      </AppSafeAreaView>
    </>
  );
}
export default ReferAndEarn;

const styles = StyleSheet.create({
  mainview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: universalPaddingHorizontal,
    marginTop: "10%"
  },
  iconbell: {
    height: 28,
    width: 28,
    right: -1,
    position: "absolute",
  },
  iconbellview: {
    height: 5,
    width: 5,
    // backgroundColor: colors.brownish,
    borderRadius: 10,
    alignContent: "flex-end",

    // alignSelf:"flex-end",
    marginBottom: 15,
    // right:10
    // justifyContent:"flex-end"


  },
  mainbox: {
    paddingHorizontal: 20,
    marginHorizontal: universalPaddingHorizontal,
    paddingVertical: 10,
    marginTop: 25,
    borderWidth: 1,
    // borderColor: colors.lightPinkish,
    borderRadius: 35,
  },
  box: {
    height: 96,
    width: '48%',
    // backgroundColor: colors.black,
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  boxBottom: {
    height: 96,
    width: '48%',
    // backgroundColor: colors.black,
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderTopLeftRadius: 30,
    // borderBottomLeftRadius: 30,
  },
  depositbutton: {
    height: 23,
    backgroundColor: colors.buttoncolor,
    borderRadius: 20,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  boxtwo: {
    height: 96,
    width: '48%',
    backgroundColor: colors.bottomBackgroundColor,
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  histroymainbox: {
    height: 50,
    width: '100%',
    backgroundColor: colors.bottomBackgroundColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30,
    paddingHorizontal: universalPaddingHorizontal,
    borderRadius: 10,
  },
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  }
});
