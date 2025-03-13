import {
  Keyboard,
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  AppText,
  BLACK,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  TEN,
  TWELVE,
  WHITE,
} from '../common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../libs/rootReducer';
import Checkbox from '../common/CheckBox/CheckBox';
import { toastAlert, validateMobile, validateEmail } from '../helper/utility';
import { SpinnerSecond } from '../common/SpinnerSecond';
import { userSignup } from '../actions/authActions';
import { KeyBoardAware } from '../common/KeyboardAware';
import { Screen, universalPaddingHorizontal } from '../theme/dimens';
import FastImage from 'react-native-fast-image';
import { StatusBar } from 'native-base';
import { NewColor, colors } from '../theme/color';
import { poppinsSemiBold } from '../theme/typography';
import {
  GoogleSignin,
  GoogleSigninButton,
  NativeModuleError,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Spinner } from '../common/Spinner';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import NavigationService from '../navigation/NavigationService';
import { HOME_PRIVACY, WEB_URL } from '../navigation/routes';
import { TouchableOpacityView } from '../common/TouchableOpacityView';

const Login = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile, setmobile] = useState('');
  const [code, setCode] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [permissionSave, setPermissionSave] = useState(false)
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  // async function requestReadSmsPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_SMS,
  //       {
  //         title: 'Read SMS Permission',
  //         message: 'This app needs access to your SMS messages.',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       setPermissionSave(true)
  //       // You can now proceed to read SMS messages.
  //     } else {
  //       setPermissionSave(false)
  //       // Handle denial of permission
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //   }
  // }
  const onSubmit = () => {
    // const validateMobile = mobile?.validateMobile(mobile);
    Keyboard.dismiss();
    if (!mobile) {
      toastAlert.showToastError('Please enter Mobile Number');
    } else if (!validateMobile(mobile)) {
      toastAlert.showToastError('Please provide a valid Mobile Number');
    } else if (!isSelected) {
      toastAlert.showToastError('Please check this box before proceed');
    } else {
      let data = {
        refercode: code,
        mobile_number: mobile,
        resend: true,
      };

      dispatch(userSignup(data));
    }
  };
  // useEffect(() => {
  //   // handleSignIn();
  //   requestReadSmsPermission()
  //   // GoogleSignin.configure();
  // }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await signOut();

      // _authWithSocial({
      //   email: userInfo.user.email,
      //   provider: 'google',
      //   firstName: userInfo.user.givenName,
      //   lastName: userInfo.user.familyName,
      //   id: userInfo.user.id,
      //   deviceName: `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`,
      //   deviceId: `${DeviceInfo.getUniqueId()}`,
      //   ipAddress: deviceIp
      // });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
    }
  };
  // const configureGoogleSignIn = async () => {
  //   GoogleSignin.configure({
  //     webClientId: '513223757939-6pgfkdk7n7il42e2tpbhlotc7p471pma.apps.googleusercontent.com',
  //     offlineAccess: false,
  //   });
  // };

  // const handleSignIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     setUserInfo(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //     } else {
  //     }
  //   }
  // };





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
        {/* <ImageBackground
          style={styles.poster}
          source={require('../../assets/images/Splash.png')}>
          <FastImage
            style={styles.logos}
            resizeMode="contain"
            source={require('../../assets/images/smalllogo.png')}
          />
          <View
            style={{
              paddingHorizontal: universalPaddingHorizontal,
              marginTop: '45%',
              marginHorizontal: 10
              // width: Screen.Width - 20,
            }}>
            <View
              style={{
                borderRadius: 20,
                borderColor: colors.borderLightBlue,
                borderWidth: 1,
                paddingBottom: 20,
                backgroundColor: NewColor.linerWhitefifty,
              }}>
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
                  LOGIN/REGISTER
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  borderColor: colors.borderLightBlue,
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 15,
                  backgroundColor: NewColor.linerWhitefifty,
                  width: '95%',
                  margin: 8,
                  paddingHorizontal: 5,
                }}>
                <FastImage
                  resizeMode="contain"
                  tintColor={colors.imageColor}
                  source={require('../../assets/images/phone1.png')}
                  style={{
                    padding: 10,
                    margin: 5,
                    height: 3,
                    width: 3,
                    alignItems: 'center',
                  }}
                />

                <TextInput
                  style={{
                    fontSize: 14,
                    color: colors.black,
                    flex: 1,
                    fontFamily: poppinsSemiBold,
                    marginLeft: 10,
                    marginBottom: -5,
                    opacity: 0.5,
                  }}
                  allowFontScaling={false}
                  placeholder="Enter Mobile Number"
                  underlineColorAndroid="transparent"
                  placeholderTextColor={colors.black}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={value => {
                    setmobile(value);
                  }}
                />
                <TouchableOpacity onPress={() => setmobile('')}>
                  <FastImage
                    resizeMode="contain"
                    tintColor={colors.imageColor}
                    source={require('../../assets/images/cross1.png')}
                    style={{
                      padding: 10,
                      margin: 5,
                      height: 20,
                      width: 20,
                      alignItems: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ marginHorizontal: 10 }}
                onPress={() => {
                  setText(true);
                  setVisible(false);
                }}>
                {visible && (
                  <AppText
                    weight={POPPINS_MEDIUM}
                    style={{
                      textDecorationLine: 'underline',
                      textAlign: 'right',
                    }}>
                    Have a referral code?
                  </AppText>
                )}
                {text && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: colors.borderLightBlue,
                      backgroundColor: NewColor.linerWhitefifty,
                      borderWidth: 1,
                      height: 40,
                      borderRadius: 15,
                      width: '101%',
                      right: 2,
                      top: 5,
                    }}>
                    <TextInput
                      style={{
                        fontSize: 14,
                        color: colors.black,
                        flex: 1,
                        fontFamily: poppinsSemiBold,
                        opacity: 0.5,
                        marginBottom: -3,
                        marginLeft: 10,
                      }}
                      allowFontScaling={false}
                      placeholder="Enter Invite Code(Optional)"
                      underlineColorAndroid="transparent"
                      placeholderTextColor={colors.black}
                      keyboardType="phone-pad"
                      fontWeight="200"
                      value={code}
                      onChangeText={value => {
                        setCode(value);
                      }}
                    />
                    <TouchableOpacity onPress={() => setCode('')}>
                      <FastImage
                        resizeMode="contain"
                        source={require('../../assets/images/cross1.png')}
                        tintColor={colors.imageColor}
                        style={{
                          padding: 10,
                          margin: 5,
                          height: 20,
                          width: 20,
                          alignItems: 'center',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                  paddingHorizontal: 10,
                }}>
                <Checkbox
                  onPress={() => setIsSelected(!isSelected)}
                  value={isSelected}
                />

                <AppText
                  onPress={() => setIsSelected(!isSelected)}
                  type={TWELVE}
                  style={{ marginStart: 10, flex: 1 }}>
                  I confirm that I am 18+ years in age.
                </AppText>
              </View>
              <TouchableOpacity onPress={() => onSubmit()}>
                <LinearGradient
                  style={{
                    backgroundColor: 'green',
                    height: 45,
                    borderRadius: 10,
                    width: '95%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    top: 20,
                  }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  colors={[colors.borderBlue, colors.linerProgress]}>
                  <AppText
                    color={WHITE}
                    weight={POPPINS_SEMI_BOLD}
                    type={SIXTEEN}
                    style={{
                      textAlign: 'center',
                      marginTop: 2,
                    }}>
                    CONTINUE
                  </AppText>
                </LinearGradient>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginTop: 30,
                }}>
                <Image
                  source={require('../../assets/images/18.png')}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'stretch',
                    alignItems: 'center',
                  }}
                />
                <TouchableOpacityView
                style={{backgroundColor:"red"}}
                onPress={()=>NavigationService.navigate(HOME_PRIVACY, { titleNames: 'Privacy Policy' })}>
                  <AppText
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    color={BLACK}
                    numberOfLines={2}
                    style={{
                      left: 5,
                      marginTop: 5
                    }}>
                    I have read and agree to My Battle 11 Terms of {`\n`}Service
                    and Privacy Policy
                  </AppText>
                </TouchableOpacityView>
              </View>
            </View>
          </View>
        </ImageBackground> */}
      </AppSafeAreaView>
      {/* <Spinner loading={isLoading} /> */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
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
    marginTop: 50,
  },
  button: {
    marginTop: 50,
  },
  account: colors => ({
    color: colors.white,
    alignSelf: 'center',
    marginTop: Screen.Height / 7,
  }),
  register: colors => ({
    color: colors.code,
  }),
  forgot: colors => ({
    color: colors.white,
    alignSelf: 'flex-end',
    marginTop: 15,
  }),
  password: {
    marginTop: 15,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  poster: {
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    alignSelf: 'center',
    height: '100%',
  },
  logos: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: '20%',
  },
});
export default Login;
