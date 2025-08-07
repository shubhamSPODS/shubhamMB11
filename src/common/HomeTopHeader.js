import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacityView } from './TouchableOpacityView';
import NavigationService from '../navigation/NavigationService';
import {
  MY_BALANCE,
} from '../navigation/routes';
import {
  MyBattleLogo,
  ThreeIcon,
  UserIcon,
  WalletIcon,
  myBattleTextImg,
  back,
} from '../helper/image';
import FastImage from "@d11/react-native-fast-image";
import { useSelector } from 'react-redux';
import { IMAGE_BASE_URL } from '../helper/utility';
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from 'native-base';
import {
  AppText,
  POPPINS_SEMI_BOLD,
  TWELVE,
  WHITE,
} from './AppText';

const HomeTopHeader = ({ personClick, walletIcon, showBack, showProfile = true }) => {
  const [random, setRandom] = useState('')
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const {cash_bonus, winning_amount, totaldeposit } = userData ?? '';
  let totalbalance = winning_amount + cash_bonus + totaldeposit;
  // useEffect(() => {
  //   setRandom(Math.random())
  // }, [total_balance])
  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <View>
        <View
          style={styles.topContainer}>
          {showProfile && (
            <TouchableOpacityView
              style={{ height: 28, width: 28, }}
              onPress={personClick}>
              {showBack ? (
                <FastImage
                  source={back}
                  style={styles.personImage}
                  resizeMode="contain"
                  tintColor={WHITE}
                />
              ) : (
                <>
                  <FastImage
                    resizeMode="contain"
                    source={
                      userData?.logo
                        ? { uri: `${IMAGE_BASE_URL}${userData?.logo}` }
                        : UserIcon
                    }
                    style={styles.personImage}
                  />
                  <View style={styles.userfilter}>
                    <FastImage
                      source={ThreeIcon}
                      resizeMode='contain'
                      style={{ height: 10, width: 10 }} />
                  </View>
                </>
              )}
            </TouchableOpacityView>
          )}
          <FastImage
            source={myBattleTextImg}
            style={styles.combineIcon}
            resizeMode="contain"
          />
         <TouchableOpacityView
            onPress={() => NavigationService.navigate(MY_BALANCE)}>
            <LinearGradient
              colors={['#C1AA9966', '#C1AA9926']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              style={{
                borderRadius: 59,
                flexDirection: 'row',
                marginTop: 2,
                // height: 30,
                width: 100,
                borderWidth: 2,
                borderColor: '#C1AA9966',
                marginLeft: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 28,
                    width: 28,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 50,
                    // right:5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#DBA73E',
                  }}>
                  <FastImage
                    style={{height: 12, width: 14}}
                    resizeMode="contain"
                    source={WalletIcon}
                  />
                </View>
                <View>
                  <AppText
                    style={{marginTop: -1,left:5 }}
                    type={TWELVE}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    ₹ {totalbalance?.toFixed(2)}
                  </AppText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacityView>
          {/* <TouchableOpacityView
          style={styles.notifiView}
          onPress={() => NavigationService.navigate(Notification__SCREEN)}>
          <FastImage
            source={iconbell}
            resizeMode="contain"
            style={styles.notificationIcon}
          />
        </TouchableOpacityView> */}
        </View>
      </View>
    </>
  );
};
export { HomeTopHeader };

const styles = StyleSheet.create({
  topContainer: {
    height: 90,
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    justifyContent: "space-between"
  },
  personImage: {
    height: 28,
    width: 28,
    borderRadius: 100,
  },
  combineIcon: {
    height: 140,
    width: 140,
    marginLeft: 60,

  },
  notificationIcon: {
    height: 28,
    width: 28,
    right: 25
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },
  walletView: {
    borderRadius: 59,
    flexDirection: 'row',
    marginTop: 2,
    height: 30,
    width: 80,
    borderWidth: 2,
    borderColor: '#C1AA9966',
    marginLeft: 30,
  },
  userfilter: {
    position: "absolute", alignSelf: "flex-end", top: 18
  },
  walletbox: {
    height: 28,
    width: 28, backgroundColor: "#FFFFFF",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DBA73E",
    right: 10,
  },
  logoview: {
    //  justifyContent:"space-between"
  },
  belldot: {
    height: 4,
    width: 4,
    backgroundColor: "#EC536A",
    position: "absolute",
    borderRadius: 10,
  },
  notifiView: {
    height: 28,
    with: 28,
    marginTop: 3,
    marginRight: -5,
    backgroundColor: 'black',
    borderWidth: 1
  }
});
