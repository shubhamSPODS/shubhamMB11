import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BLUE,
  FORTEEN,
  POPPINS,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  WHITE,
} from '../common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../libs/rootReducer';
import { Screen, universalPaddingHorizontal } from '../theme/dimens';
import NavigationService from '../navigation/NavigationService';
import { LOGIN } from '../navigation/routes';
import { otpVerification, resetSignUpOtp } from '../actions/authActions';
import { SpinnerSecond } from '../common/SpinnerSecond';
import { toastAlert } from '../helper/utility';
import { TouchableOpacityView } from '../common/TouchableOpacityView';
import { KeyBoardAware } from '../common/KeyboardAware';
import { NewColor, colors } from '../theme/color';
import { getHash, startOtpListener, removeListener } from 'react-native-otp-verify';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
const OTP = ({ route }) => {
  const dispatch = useDispatch();
  const { data: Number, id, permissionSave } = route?.params ?? '';
  const [hashFromMethod, setHashFromMethod] = useState([]);
  const [otpFromMethod, setOtpFromMethod] = useState('');
  const [newOtp, setNewOtp] = useState('')
  const isLoading = useSelector(state => {
    return state.auth.isLoading;
  });
  const [code, setCode] = useState('123456');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const initializeOtpListener = async () => {
      try {
        const hashArray = await getHash();
        setHashFromMethod(hashArray);
        
        await startOtpListener((receivedMessage) => {
          console.log('📱 Received SMS:', receivedMessage);
          setOtpFromMethod(receivedMessage);
          
          const otpMatch = receivedMessage.match(/(\d{6})/);
          if (otpMatch && otpMatch[1]) {
            const extractedOtp = otpMatch[1];
            console.log('🔢 Extracted OTP:', extractedOtp);
            setCode(extractedOtp);
            // Auto-submit OTP after a short delay
            setTimeout(() => {
              const data = {
                mobile_number: Number?.mobile_number,
                otp: extractedOtp,
              };
              dispatch(otpVerification(data));
            }, 500);
          }
        });
        
        setIsListening(true);
      } catch (error) {
        console.error('❌ OTP Listener Error:', error);
        setError(`Error initializing OTP listener: ${error.message}`);
      }
    };

    initializeOtpListener();

    return () => {
      removeListener();
      setIsListening(false);
    };
  }, []);
  const onSubmit = () => {
    if (code.length < 6) {
      toastAlert.showToastError('Please provide a valid OTP');
    } else {
      const data = {
        mobile_number: Number?.mobile_number,
        otp: code,
      };
      dispatch(otpVerification(data));
    }
  };

  const onResend = () => {
    id == 'register';
    dispatch(resetSignUpOtp(id));
  };

  return (
    <>
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
        <KeyBoardAware>
          {/* <ImageBackground
            style={styles.poster}
            source={require('../../assets/images/Splash.png')}>
            <View
              Style={{
                paddingHorizontal: universalPaddingHorizontal,
              }}>
              <View>
                <Image
                  style={styles.logos}
                  source={require('../../assets/images/smalllogo.png')}
                />

                <View
                  style={{
                    width: '95%',
                    height: '57%',
                    alignSelf: 'center',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.borderLightBlue,
                    top: 90,
                    backgroundColor: NewColor.linerWhitefifty,
                  }}>
                  <View style={{ width: '100%', height: '20%' }}>
                    <View
                      style={{
                        height: 50,
                        justifyContent: 'center',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,

                        backgroundColor: NewColor.linerBlackFive,
                      }}>
                      <AppText
                        weight={POPPINS_SEMI_BOLD}
                        type={SIXTEEN}
                        style={{
                          textAlign: 'center',
                        }}>
                        VERIFY WITH OTP{`\n`}
                        {hashFromMethod}
                      </AppText>
                    </View>
                  </View>
                  <View style={{ top: 10 }}>
                    <AppText
                      style={{
                        textAlign: 'center',
                      }}>
                      OTP sent to your mobile no. +91{' '}
                      {JSON.stringify(Number?.mobile_number)?.replace(
                        /(?!^.*)[^a-zA-Z\s](?=.{2})/g,
                        `X`,
                      )}
                    </AppText>
                    <TouchableOpacityView
                      // onPress={onSubmit}
                      onPress={() => NavigationService.navigate(LOGIN)}>
                      <AppText
                        style={{
                          textAlign: 'center',
                          textDecorationLine: 'underline',
                        }}>
                        Change
                      </AppText>
                    </TouchableOpacityView>
                    <View
                      style={{
                        flexDirection: 'column',
                        height: 70,
                        width: '95%',
                        alignSelf: 'center',
                        top: 10,
                      }}>
                      <OTPInputView
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                        }}
                        pinCount={6}
                        code={code}
                        autoFocusOnLoad={false}
                        placeholderCharacter="-"
                        editable
                        onCodeChanged={value => setCode(value)}
                        onCodeFilled={code => {
                          if (code.length == 6) {
                            if (id == 'register') {
                              let _data = {
                                refercode: Number.refercode,
                                mobile_number: Number.mobile_number,
                                otp: code,
                              };
                              dispatch(otpVerification(_data));
                            }
                          }
                        }}
                        placeholderTextColor={colors.black}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted (
                          colors,
                        )}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <AppText
                          type={FORTEEN}
                          weight={POPPINS}
                          style={styles.account(colors)}>
                          Didn’t receive OTP?{' '}
                          <AppText
                            onPress={onResend}
                            type={FORTEEN}
                            weight={POPPINS}
                            color={BLUE}>
                            Resend Code
                          </AppText>
                        </AppText>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacityView
                    onPress={onSubmit}
                    style={{
                      height: 50,
                      width: '95%',
                      alignSelf: 'center',
                      marginTop: 50,

                    }}
                  // onPress={() => NavigationService.navigate('Home')}
                  >
                    <LinearGradient
                      style={{
                        height: 50,
                        borderRadius: 10,
                        width: '95%',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={[colors.linerProgress, colors.borderBlue]}>
                      <AppText
                        weight={POPPINS_SEMI_BOLD}
                        type={SIXTEEN}
                        color={WHITE}
                        style={{
                          textAlign: 'center',
                        }}>
                        CONTINUE
                      </AppText>
                    </LinearGradient>
                  </TouchableOpacityView>
                </View>
              </View>
            </View>
          </ImageBackground> */}
        </KeyBoardAware>
      </AppSafeAreaView>

      <SpinnerSecond loading={isLoading} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  referral: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 10,
  }),
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  enter: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
  label: {
    marginTop: 40,
  },
  button: {
    marginTop: 20,
  },
  account: colors => ({
    //marginTop: Screen.Height / 4,
    alignSelf: 'center',
  }),
  register: colors => ({
    color: colors.code,
  }),
  underlineStyleBase: {
    width: 46,
    height: 40,
    borderRadius: 15,
    backgroundColor: NewColor.linerWhitefifty,
    color: colors.black,
    borderWidth: 0,
  },

  underlineStyleHighLighted: colors => ({
    borderColor: colors.textInput,
  }),
  background: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  poster: {
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: '100%',
  },
  logos: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: 20,
  },
});

export default OTP;
