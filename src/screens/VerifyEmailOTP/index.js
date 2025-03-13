import {View, StatusBar} from 'react-native';
import React, {useState, useRoute} from 'react';
import Header from '../../common/Header';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {KeyBoardAware} from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACKOPACITY,
  ELEVEN,
  FORTEEN,
  LIGHTBLUE,
  POPPINS_SEMI_BOLD,
  THIRTEEN,
  TWELVE,
} from '../../common/AppText';

import {useDispatch, useSelector} from 'react-redux';
import PrimaryButton from '../../common/primaryButton';
import styles from './styles';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {RootState} from '../../libs/rootReducer';
import {universalPaddingHorizontal} from '../../theme/dimens';
import {KYC_SCREEN} from '../../navigation/routes';
import {sendKycOtp, verifyKycOtp} from '../../actions/profileAction';
import NavigationService from '../../navigation/NavigationService';
import {colors} from '../../theme/color';

const VerifyEmailOTP = ({route}) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state?.profile?.isLoading);

  const [code, setCode] = useState('');
  const verifyOtp = () => {
    const data = {
      value: route?.params?.email,
      otp: code,
    };
    dispatch(verifyKycOtp(data));
  };
  const resendOtp = () => {
    const data = {
      value: route?.params?.email,
    };
    dispatch(sendKycOtp(data));
  };
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          commonHeader
          title="Verify Email Address"
          style={{padding: universalPaddingHorizontal, marginTop: '10%'}}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <AppText type={FORTEEN} style={[styles.withdraw, {marginLeft: 2}]}>
            OTP sent to {route?.params?.email}
          </AppText>
          <View style={styles.box}>
            <View style={styles.boxContainer}>
              <AppText type={TWELVE} style={styles.otp}>
                Enter the OTP
              </AppText>

              <OTPInputView
                style={{
                  width: '100%',
                  height: 60,
                  borderRadius: 8,
                }}
                pinCount={6}
                code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={code => {
                  setCode(code);
                }}
                autoFocusOnLoad={false}
                placeholderTextColor={colors.black}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
              />
            </View>
          </View>
          <TouchableOpacityView onPress={() => resendOtp()}>
            <AppText
              color={BLACKOPACITY}
              weight={POPPINS_SEMI_BOLD}
              type={TWELVE}
              style={styles.account}>
              Didn’t receive the OTP?{' '}
              <AppText
                type={TWELVE}
                weight={POPPINS_SEMI_BOLD}
                color={LIGHTBLUE}>
                Resend OTP
              </AppText>
            </AppText>
          </TouchableOpacityView>
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            paddingVertical: 10,
          }}>
          <PrimaryButton title="SUBMIT" onPress={verifyOtp} />
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default VerifyEmailOTP;
