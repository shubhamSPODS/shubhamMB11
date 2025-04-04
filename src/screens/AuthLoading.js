import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile } from '../actions/profileAction';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import { SpinnerSecond } from '../common/SpinnerSecond';
import { USER_TOKEN_KEY } from '../libs/constants';
import NavigationService from '../navigation/NavigationService';
import { AUTHSTACK, LOGIN, OTP } from '../navigation/routes';
import FastImage from "@d11/react-native-fast-image";
import { MyBattleIcon, MyBattleLogo, splash } from '../helper/image';
import { Dimensions } from 'react-native';

const AuthLoading = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      bootstrapAsync();
    }, 3000);
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      if (token) {
        // NavigationService.reset(OTP);
        dispatch(getUserProfile(true, false));
      } else {
        NavigationService.navigate(AUTHSTACK);
      }
    } catch (e) {
    }
  };
  return (
    <AppSafeAreaView>
      <FastImage source={MyBattleIcon} resizeMode="contain" style={{ height:Dimensions.get('screen').height,width:Dimensions.get('screen').width }} />
      {/* <SpinnerSecond loading={true} /> */}
    </AppSafeAreaView>
  );
};

export default AuthLoading;
