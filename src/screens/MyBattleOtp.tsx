import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {AppSafeAreaView} from '../common/AppSafeAreaView';
import {KeyBoardAware} from '../common/KeyboardAware';
import {MyBattleIcon, MyBattleScreen} from '../helper/image';
import {StatusBar} from 'native-base';
import {NewColor, colors} from '../theme/color';  
import {universalPaddingHorizontal} from '../theme/dimens';
import {
  AppText,
  BLACKOPACITY,
  BROWNYELLOW,
  TWELVE,
  FORTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
} from '../common/AppText';
import {useDispatch, useSelector} from 'react-redux';
import {otpVerification, resetSignUpOtp} from '../actions/authActions';
import {toastAlert} from '../helper/utility';
import FastImage from "@d11/react-native-fast-image";
import PrimaryButton from '../common/primaryButton';
import {
  getHash,
  removeListener,
  startOtpListener,
} from 'react-native-otp-verify';
import { SpinnerSecond } from '../common/SpinnerSecond';


const MyBattleOtp = ({route}) => {
  const dispatch = useDispatch();
  const {data: Number, id, permissionSave} = route?.params ?? {};
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const loading = useSelector((state: any) => state.auth.isLoading);

  useEffect(() => {
    getHash()
      .then(hashArray => {
        if (hashArray && hashArray.length > 0) {
          setHash(hashArray[0]);
        }
      })
      .catch(error => {
        setError(`Error getting hash: ${error.message}`);
      });

    startOtpListener(receivedMessage => {
      setMessage(receivedMessage);
      const otpMatch = /(\d{6})/g.exec(receivedMessage);
      if (otpMatch && otpMatch[1]) {
        const extractedOtp = otpMatch[1];
        setOtp(extractedOtp);
        setCode(extractedOtp);
        onSubmit(extractedOtp);
      }
    })
      .then(() => setIsListening(true))
      .catch(error => {
        setError(`Error starting listener: ${error.message}`);
      });

    return () => {
      removeListener();
      setIsListening(false);
    };
  }, []);

  const handleOtpChange = input => {
    if (/^\d*$/.test(input) && input.length <= 6) {
      setOtp(input);
      setCode(input);
    }
  };

  const onSubmit = otpCode => {
    const verificationCode = otpCode || code;
    if (verificationCode.length < 6) {
      toastAlert.showToastError('Please provide a valid OTP');
    } else {
      const data = {
        mobile_number: Number?.mobile_number,
        otp: verificationCode,
        refercode: route?.params?.data?.refercode
      };
 
      dispatch(otpVerification(data));
    }
  };

  const onResend = () => {
    dispatch(resetSignUpOtp(id));
  };

  // console.log(route?.params, "data");

  return (
    <AppSafeAreaView
      statusColor={true}
      style={{backgroundColor: NewColor.linerWhite}}
      hidden={false}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <KeyBoardAware>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={MyBattleScreen}
            resizeMode="cover"
            style={styles.MyBattleScreen}>
            <View style={styles.main}>
              <View style={{paddingHorizontal: universalPaddingHorizontal}}>
                <View>
                  <FastImage
                    source={MyBattleIcon}
                    resizeMode="contain"
                    style={styles.logo}
                  />
                </View>
                <View style={{marginTop: 60}}>
                  <AppText weight={POPPINS_SEMI_BOLD} type={TWELVE}>
                    Verify with OTP
                  </AppText>
                  <AppText
                    type={TWELVE}
                    style={{marginTop: 5}}
                    weight={POPPINS_SEMI_BOLD}
                    color={BLACKOPACITY}>
                    OTP sent to your mobile no. +91{' '}
                    {JSON.stringify(Number?.mobile_number)?.replace(
                      /(?!^.*)[^a-zA-Z\s](?=.{2})/g,
                      `X`,
                    )}
                  </AppText>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter OTP"
                    value={otp}
                    maxLength={6}
                    onChangeText={handleOtpChange}
                    keyboardType="numeric"
                    placeholderTextColor="white"
                  />
                </View>
                {error ? (
                  <AppText type={TWELVE} color="red" style={{marginTop: 10}}>
                    {error}
                  </AppText>
                ) : null}
                <AppText
                  type={TWELVE}
                  color={BLACKOPACITY}
                  weight={POPPINS_MEDIUM}
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: 13,
                    marginRight: 5,
                  }}>
                  Didn’t receive OTP?
                  <AppText
                    onPress={onResend}
                    type={FORTEEN}
                    weight={POPPINS_SEMI_BOLD}
                    color={BROWNYELLOW}>
                    {' '}
                    Resend Code
                  </AppText>
                </AppText>
              </View>
              <PrimaryButton
                onPress={() => onSubmit()}
                title="Verify"
                buttonStyle={styles.button}
              />
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyBoardAware>
      <SpinnerSecond loading={loading}/>
    </AppSafeAreaView>
  );
};

export default MyBattleOtp;

const styles = StyleSheet.create({
  MyBattleScreen: {
    height: '100%',
    width: '100%',
  },
  main: {
    paddingHorizontal: universalPaddingHorizontal,
    flex: 0.1,
    justifyContent: 'center',
  },
  textInput: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 20,
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingLeft: 15,
  },
  button: {
    marginTop: 40,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    top: 20,
  },
  underlineStyleBase: {
    width: 46,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bottomBackgroundColor,
    color: colors.white,
    borderWidth: 0,
  },
  underlineStyleHighLighted: {
    borderColor: '#606060',
  },
});
