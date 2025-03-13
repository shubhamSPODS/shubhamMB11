import React from 'react';
import {ImageBackground, View} from 'react-native';
import {
  AppText,
  EIGHTEEN,
  POPPINS,
  RUSSO,
  SIXTEEN,
  TWELVE,
} from '../../common/AppText';
import PrimaryButton from '../../common/primaryButton';
import {useSelector} from 'react-redux';

import SecondaryButton from '../../common/secondaryButton';
import {register, logo} from '../../helper/image';
import {RootState} from '../../libs/rootReducer';
import styles from './styles';
import NavigationService from '../../navigation/NavigationService';
import {
  LOGIN_SCREEN,
  REFERRAL_SCREEN,
  REGISTER_SCREEN,
} from '../../navigation/routes';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import FastImage from 'react-native-fast-image';

const Welcome = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  return (
    <AppSafeAreaView style={styles.container} hidden>
      <ImageBackground
        source={register}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.bottomContainer}>
          <FastImage style={styles.logo} resizeMode="contain" source={logo} />
          <AppText type={EIGHTEEN} weight={RUSSO} style={styles.title(colors)}>
            WELCOME TO MyBattle11
          </AppText>
          <AppText
            type={SIXTEEN}
            weight={POPPINS}
            style={styles.register(colors)}>
            Register to start winning
          </AppText>
          <PrimaryButton
            onPress={() => NavigationService.navigate(REGISTER_SCREEN)}
            buttonStyle={styles.button}
            title="REGISTER"
          />

          <SecondaryButton
            title="LOGIN"
            onPress={() => NavigationService.navigate(LOGIN_SCREEN)}
            buttonStyle={styles.button}
          />

          <TouchableOpacityView
            onPress={() => NavigationService.navigate(REFERRAL_SCREEN)}
            style={styles.bottom}>
            <AppText
              type={TWELVE}
              weight={POPPINS}
              style={styles.referral(colors)}>
              Have a referral code?
            </AppText>

            <AppText
              type={SIXTEEN}
              weight={POPPINS}
              style={styles.code(colors)}>
              Enter Code
            </AppText>
          </TouchableOpacityView>
        </View>
      </ImageBackground>
    </AppSafeAreaView>
  );
};

export default Welcome;
