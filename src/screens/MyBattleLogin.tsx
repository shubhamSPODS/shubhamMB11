import React, { useEffect, useState } from 'react';
import { ImageBackground, Keyboard, StyleSheet, View } from 'react-native';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import { KeyBoardAware } from '../common/KeyboardAware';
import { AgeIcon, MyBattleIcon, MyBattleScreen } from '../helper/image';
import {
  AppText,
  BROWNYELLOW,
  ELEVEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TWELVE,
} from '../common/AppText';
import InputBox from '../common/InputBox';
import { NewColor, colors } from '../theme/color';
import { fontFamilyPoppins } from '../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { State } from 'react-native-gesture-handler';
import Checkbox from '../common/CheckBox/CheckBox';
import PrimaryButton from '../common/primaryButton';
import { universalPaddingHorizontal } from '../theme/dimens';
import { toastAlert, validateMobile } from '../helper/utility';
import { userSignup } from '../actions/authActions';
import { TouchableOpacityView } from '../common/TouchableOpacityView';
import { StatusBar } from 'native-base';
import NavigationService from '../navigation/NavigationService';
import { HOME_PRIVACY, WEB_URL } from '../navigation/routes';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { SpinnerSecond } from '../common/SpinnerSecond';

const MyBattleLogin = () => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState('');
  const [isSelectedAge, setIsSelectedAge] = useState(false);
  const [isSelectedState, setIsSelectedState] = useState(false);
  const [isSelectedTerms, setIsSelectedTerms] = useState(false);
  const [code, setCode] = useState('');
  const loading = useSelector((state: any) => state.auth.isLoading);

  const [referral, setReferral] = useState(false);
  const handleDynamicLink = (link: any) => {
    if (link && link?.url) {
      navigate(link.url);
    }
  };
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link?.url) {
          navigate(link.url);
        }
      });
  }, []);
  const navigate = async (url: any) => {
    const queryString = url.split('?')[1];
    const paramsArray = queryString.split('&');
    const params = {};
    paramsArray.forEach((param: any) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    const refercode = params['refercode'];
    if (refercode) {
      setCode(refercode)
    }
  }
  const onSubmit = () => {
    Keyboard.dismiss();
  
    if (!number) {
      toastAlert.showToastError('Please enter Mobile Number');
    } else if (!validateMobile(number)) {
      toastAlert.showToastError('Please provide a valid Mobile Number');
    } else if (!isSelectedAge) {
      toastAlert.showToastError('Please confirm that you are 18+ years old.');
    } else if (!isSelectedTerms){
      toastAlert.showToastError('Please accept the Terms of Service and Privacy Policy.');
    }
     else {
      let data = {
        refercode: code,
        mobile_number: number,
        resend: true,
      };
      console.log(data,'===>>data');
      
      dispatch(userSignup(data, true));
    }
  };
  
  return (
    <AppSafeAreaView
      statusColor={true}
      style={{ backgroundColor: NewColor.linerWhite }}
      hidden={false}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <KeyBoardAware style={{ paddingHorizontal: 0 }}>
        <ImageBackground
          source={MyBattleScreen}
          resizeMode="cover"
          style={styles.MyBattleScreen}
          >
          <View style={styles.main} />
          <View>
          
          </View>
          <View
            style={{
              paddingHorizontal: universalPaddingHorizontal,
              marginTop: 50,
            }}>
            <InputBox
              placeholderTextColor={colors.white}
              label={'Login / Register'}
              value={number}
              keyboardType="numeric"
              placeholder={'Enter you number'}
              onChange={(value: any) => {
                setNumber(value);
              }}
              textInputBox={styles.textInputBox}
              labelStyle={styles.label}
              image={true}
              maxLength={10}
            />
            {referral && (
              <InputBox
                placeholderTextColor={colors.white}
                value={code}
                keyboardType="default"
                placeholder={'Enter referral code (Optional)'}
                onChange={(value: any) => {
                  setCode(value);
                }}
                textInputBox={styles.textInputBox}
                labelStyle={styles.label}
                image={true}
                top={true}
              />
            )}
            <TouchableOpacityView
              onPress={() => setReferral(true)}
              style={styles.textview}>
              <AppText
                type={TWELVE}
                weight={POPPINS_SEMI_BOLD}
                color={BROWNYELLOW}
                style={{
                  alignSelf: 'flex-end',
                  textDecorationLine: 'underline',
                }}>
                Have a referral code?
              </AppText>
            </TouchableOpacityView>
         
            <TouchableOpacityView onPress={() => setIsSelectedAge(!isSelectedAge)} style={styles.checkbox}>
            <Checkbox onPress={() => setIsSelectedAge(!isSelectedAge)} value={isSelectedAge} />
            <AppText type={TWELVE} weight={POPPINS_MEDIUM} style={{ marginLeft: 10 }}>
              I confirm that I am 18+ years in age
            </AppText>
          </TouchableOpacityView>

            <View style={styles.ageiconview}>
            <Checkbox onPress={() => setIsSelectedTerms(!isSelectedTerms)} value={isSelectedTerms}  />
              <AppText type={TWELVE} weight={POPPINS_MEDIUM} style={{ marginLeft: 10 }}>
                I have read and agree to MyBattle 11{' '}
                <AppText  type={TWELVE} weight={POPPINS_MEDIUM} onPress={() => {
                  NavigationService.navigate(WEB_URL, { titleNames: 'Terms & Conditions' })
                }} style={{ textDecorationLine: 'underline' }}>
                  Terms of Service
                </AppText>
                <AppText type={TWELVE} weight={POPPINS_MEDIUM}> and </AppText>
                <AppText onPress={() => {
                  NavigationService.navigate(WEB_URL, { titleNames: 'Privacy Policy' })
                }} type={TWELVE} weight={POPPINS_MEDIUM} style={{ textDecorationLine: 'underline' }}>
                  Privacy Policy
                </AppText>
              </AppText>
            </View>
            <View style={{marginTop:15}}>
              <PrimaryButton
                onPress={onSubmit}
                title="Continue"
              />
            </View>
          </View>
        </ImageBackground>
      </KeyBoardAware>
      <SpinnerSecond loading={loading} />
    </AppSafeAreaView>
  );
};

export default MyBattleLogin;

const styles = StyleSheet.create({
  MyBattleScreen: {
    height: '100%',
    width: '100%',
  },
  main: {
    flex: 0.1,
    top: '10%',
  },
  label: {
    marginBottom: 10,
  },
  textInputBox: {
    fontFamily: fontFamilyPoppins,
    fontSize: 12,
    flex: 1,
    color: colors.white,
    fontWeight: '600',
    marginTop: 2
  },
  textview: {
    marginTop: 10,
    paddingHorizontal: 10,
    alignContent: 'flex-end',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
  },

  AgeIcon: {
    height: 19,
    width: 19,
  },
  ageiconview: {
    flexDirection: 'row',
    marginTop: 10,
  },
  referline: {
    height: 1,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    top: 20,
  },
});