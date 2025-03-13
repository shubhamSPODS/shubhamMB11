import { View, StatusBar, TextInput, Platform } from 'react-native';
import React, { useState } from 'react';
import Header from '../../common/Header';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  ELEVEN,
  FORTEEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  THIRTEEN,
} from '../../common/AppText';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import PrimaryButton from '../../common/primaryButton';
import { RootState } from '../../libs/rootReducer';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { VERIFY_EMAIL_OTP_SCREEN } from '../../navigation/routes';
import { emailRegex, toastAlert } from '../../helper/utility';
import { sendKycOtp } from '../../actions/profileAction';
import NavigationService from '../../navigation/NavigationService';
import { checkAdhaar, recommendedIcon } from '../../helper/image';
import { NewColor } from '../../theme/color';
import FastImage from 'react-native-fast-image';
import { addharVerifiy, emailVerifiyOtp } from '../../slices/matchSlice';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state?.profile?.isLoading);
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  const [email, setEmail] = useState(
    kycDetails?.email ? kycDetails?.email : '',
  );
  const [otp, setOtp] = useState('');
  const onSubmit = async () => {
    if (!emailRegex(email)) return toastAlert.showToastError('Please enter vaild email');
    const data = {
      email: email,
    };
    dispatch(sendKycOtp(data))

  };
  const sendOtp = () => {
    if (!emailRegex(email)) {
      return toastAlert.showToastError('Please enter your email')
    } else if (!otp) {
      toastAlert.showToastError('Please enter vaild otp')
    } else {
      const data = {
        email: email,
        otp: Number(otp)
      }
      // dispatch(emailVerifiyOtp(data))
    }
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
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <View style={styles.box}>
            <View>
              <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                Enter your email
              </AppText>
              <FastImage source={recommendedIcon} resizeMode='contain' style={styles.recommended} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={'Enter your email'}
                placeholderTextColor={NewColor.linerBlacklight}
                style={styles.inputStyle}
                value={email}
                onChangeText={(value) => setEmail(value)}
                allowFontScaling={false}
              />
              {emailRegex(email) ?
                <FastImage source={checkAdhaar} resizeMode='contain' style={styles.checkIcon} />
                : <></>}
            </View>
            <View style={styles.inputContainerTwo}>
              <TextInput
                allowFontScaling={false}
                placeholder={'Enter OTP'}
                placeholderTextColor={colors.white}
                style={styles.inputStyle}
                value={otp}
                onChangeText={(value) => setOtp(value)}
                maxLength={6}
                keyboardType={'decimal-pad'}
              />
              <PrimaryButton
                type={ELEVEN}
                smallBtn={{ height: 21, borderRadius: 5 }}
                buttonStyle={[styles.buttonStyle, { marginTop: Platform.OS == 'ios' ? -5 : 0 }]}
                title="Send OTP"
                onPress={() => onSubmit()}
              />
            </View>

          </View>
          {/* <AppText
            weight={POPPINS_MEDIUM}
            type={FORTEEN}
            style={[styles.withdraw, {marginLeft: 2}]}>
            Get Verified your Email
          </AppText>
          <View style={styles.box}>
            <InputBox
              placeholder="Enter your email"
              value={email}
              placeholderTextColor={colors.grey}
              labelStyle={styles.label}
              label="Email"
              returnKeyType="next"
              onChange={value => setEmail(value)}
              textInputBox={styles.textInputBox}
            />
            <AppText
              type={TEN}
              color={BLACKOPACITY}
              weight={POPPINS_MEDIUM}
              style={styles.otp}>
              Send One Time Password(OTP) to your mail.
            </AppText>
          </View> */}
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            paddingVertical: 10,
          }}>
          <PrimaryButton onPress={sendOtp} title="GET OTP" />
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default VerifyEmail;
