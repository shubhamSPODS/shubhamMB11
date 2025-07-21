import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
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
  requestHint,
} from 'react-native-otp-verify';

import { SpinnerSecond } from '../common/SpinnerSecond';


const MyBattleOtp = ({route}: any) => {
  const dispatch = useDispatch();
  const {data: Number, id, permissionSave} = route?.params ?? {};
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const loading = useSelector((state: any) => state.auth.isLoading);

  // Request SMS permissions
  const requestSmsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_SMS
        );
        
        if (hasPermission) {
          console.log('✅ SMS permission already granted');
          setPermissionGranted(true);
          return true;
        }

        // Check if SMS permission is available (Android 10+ restrictions)
        const availablePermissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        ]);
        
        console.log('📱 Available permissions:', availablePermissions);
        
        // Check if SMS permissions are available in the system
        const smsPermissionAvailable = Object.keys(availablePermissions).includes('android.permission.READ_SMS');
        
        if (!smsPermissionAvailable) {
          console.log('❌ SMS permissions not available on this device');
          setError('SMS permissions not available on this device. Using SMS Retriever API only.');
          return false;
        }

        const readSmsGranted = availablePermissions[PermissionsAndroid.PERMISSIONS.READ_SMS];
        const receiveSmsGranted = availablePermissions[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS];
        
        if (readSmsGranted === PermissionsAndroid.RESULTS.GRANTED && 
            receiveSmsGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ SMS permissions granted');
          setPermissionGranted(true);
          return true;
        } else {
          console.log('❌ SMS permissions denied or not available');
          setError('SMS permissions not available. Using SMS Retriever API only.');
          return false;
        }
      } catch (err) {
        console.error('❌ Error checking SMS permissions:', err);
        setError('SMS permissions not available. Using SMS Retriever API only.');
        return false;
      }
    }
    return true; // For iOS, permission is handled differently
  };

  const startTraditionalSmsListener = async () => {
    try {
      setIsListening(true);
      setError(''); // Clear any previous errors
    } catch (error: any) {
      setError(`Error initializing traditional SMS listener: ${error.message}`);
    }
  };

  const initializeOtpListener = async () => {
    try {
      const hashArray = await getHash();
      if (hashArray && hashArray.length > 0) {
        setHash(hashArray[0]);
        
        // Set up timeout for SMS Retriever (typically 5 minutes)
        const retrieverTimeout = setTimeout(() => {
          setIsListening(false);
          removeListener();
          setError('SMS Retriever timed out. Please enter OTP manually.');
        }, 300000); // 5 minutes timeout
        
        // Also set up a shorter timeout to check if we're receiving messages
        const messageCheckTimeout = setTimeout(() => {
          if (!message) {
            clearTimeout(retrieverTimeout);
            removeListener();
            setIsListening(false);
            
            // Try traditional SMS method since we have permissions
            requestSmsPermission().then(hasPermission => {
              if (hasPermission) {
                startTraditionalSmsListener();
              } else {
                setError('SMS Retriever not receiving messages. Please enter OTP manually.');
              }
            });
          }
        }, 30000); // 30 seconds timeout
          
                  await startOtpListener((receivedMessage: string) => {
            setMessage(receivedMessage);
            
            // Clear timeouts since we received a message
            clearTimeout(retrieverTimeout);
            clearTimeout(messageCheckTimeout);
            
            // Handle timeout error
            if (receivedMessage.includes('Timeout Error') || receivedMessage.includes('timeout')) {
              setError('SMS Retriever timed out. Please enter OTP manually or try again.');
              setIsListening(false);
              
              // Try to restart the listener after a short delay
              setTimeout(() => {
                setError('');
                initializeOtpListener();
              }, 2000);
              return;
            }
            
            // OTP extraction regex patterns
            const patterns = [
              /(\d{6})/, // Standard 6-digit OTP
              /OTP[:\s]*(\d{6})/i, // OTP: 123456
              /verification[:\s]*(\d{6})/i, // verification: 123456
              /code[:\s]*(\d{6})/i, // code: 123456
              /password[:\s]*(\d{6})/i, // password: 123456
              /is[:\s]*(\d{6})/i, // is 123456 (for "is 533875")
              /application[:\s]*is[:\s]*(\d{6})/i, // application is 533875
              /(\d{4,6})/, // 4-6 digit codes
            ];
            
            let extractedOtp = null;
            for (const pattern of patterns) {
              const match = receivedMessage.match(pattern);
              if (match && match[1]) {
                extractedOtp = match[1];
                break;
              }
            }
            
            if (extractedOtp) {
              setOtp(extractedOtp);
              setCode(extractedOtp);
              // Auto-submit OTP after a short delay
              setTimeout(() => {
                onSubmit(extractedOtp);
              }, 500);
            } else {
              setError('Received SMS but no OTP pattern found. Please enter manually.');
            }
          });
          
          setIsListening(true);
          setError(''); // Clear any previous errors
          return; // Success with SMS Retriever
              } else {
          setError('SMS Retriever not available. Please enter OTP manually.');
          return;
        }
      } catch (error: any) {
        setError(`Error initializing OTP listener: ${error.message}`);
      }
    };

  useEffect(() => {
    initializeOtpListener();

    return () => {
      removeListener();
      setIsListening(false);
    };
  }, []);

  const handleOtpChange = (input: string) => {
    try {
      // Only allow digits and limit to 6 characters
      if (/^\d*$/.test(input) && input.length <= 6) {
        setOtp(input);
        setCode(input);
      }
    } catch (error) {
      console.error('Error handling OTP input:', error);
      // Fallback to safe input
      const safeInput = input.replace(/[^0-9]/g, '').substring(0, 6);
      setOtp(safeInput);
      setCode(safeInput);
    }
  };

  const onSubmit = (otpCode?: string) => {
    try {
      const verificationCode = otpCode || code;
      if (verificationCode.length < 6) {
        toastAlert.showToastError('Please provide a valid OTP');
        return;
      }
      
      // Validate mobile number exists
      if (!Number?.mobile_number) {
        toastAlert.showToastError('Mobile number not found. Please try again.');
        return;
      }
      
      const data = {
        mobile_number: Number.mobile_number,
        otp: verificationCode,
        refercode: route?.params?.data?.refercode || ''
      };
 
      dispatch(otpVerification(data));
    } catch (error) {
      console.error('Error submitting OTP:', error);
      toastAlert.showToastError('Something went wrong. Please try again.');
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
                    autoFocus={!isListening}
                  />
                  {!isListening && (
                    <AppText type={TWELVE} color="gray" style={{marginTop: 5, textAlign: 'center'}}>
                      💡 Tip: Enter the 6-digit OTP from your SMS
                    </AppText>
                  )}
                </View>
                {error ? (
                  <View style={{marginTop: 10}}>
                    <AppText type={TWELVE} color="red">
                      {error}
                    </AppText>
                                    {error.includes('SMS permission') && (
                  <AppText 
                    type={TWELVE} 
                    color="blue" 
                    style={{marginTop: 5, textDecorationLine: 'underline'}}
                    onPress={() => {
                      setError('');
                      initializeOtpListener();
                    }}
                  >
                    🔄 Retry Auto-fill Setup
                  </AppText>
                )}
                {error.includes('Auto-fill OTP not available') && (
                  <View style={{marginTop: 10}}>
                    <AppText 
                      type={TWELVE} 
                      color="blue" 
                      style={{textDecorationLine: 'underline'}}
                      onPress={() => {
                        setError('');
                        initializeOtpListener();
                      }}
                    >
                      🔄 Retry Auto-fill Setup
                    </AppText>
                    <AppText 
                      type={TWELVE} 
                      color="green" 
                      style={{marginTop: 5, textDecorationLine: 'underline'}}
                      onPress={() => {
                        // Test with a sample OTP
                        const testOtp = '123456';
                        setOtp(testOtp);
                        setCode(testOtp);
                        console.log('🧪 Testing with sample OTP:', testOtp);
                      }}
                    >
                      🧪 Test with Sample OTP (123456)
                    </AppText>
                    <AppText 
                      type={TWELVE} 
                      color="orange" 
                      style={{marginTop: 5, textDecorationLine: 'underline'}}
                      onPress={() => {
                        // Test with your actual SMS format
                        const testSms = "Your One time password (OTP) to register on my battle 11 fantasy application is 533875. Team Spods technologies pvt.ltd. MSvJMJ3Bldj";
                        console.log('🧪 Testing with actual SMS format:', testSms);
                        
                        const patterns = [
                          /(\d{6})/, // Standard 6-digit OTP
                          /OTP[:\s]*(\d{6})/i, // OTP: 123456
                          /verification[:\s]*(\d{6})/i, // verification: 123456
                          /code[:\s]*(\d{6})/i, // code: 123456
                          /password[:\s]*(\d{6})/i, // password: 123456
                          /is[:\s]*(\d{6})/i, // is 123456 (for "is 533875")
                          /application[:\s]*is[:\s]*(\d{6})/i, // application is 533875
                          /(\d{4,6})/, // 4-6 digit codes
                        ];
                        
                        let extractedOtp = null;
                        for (const pattern of patterns) {
                          const match = testSms.match(pattern);
                          if (match && match[1]) {
                            extractedOtp = match[1];
                            console.log('✅ Pattern matched:', pattern, 'OTP:', extractedOtp);
                            break;
                          }
                        }
                        
                        if (extractedOtp) {
                          setOtp(extractedOtp);
                          setCode(extractedOtp);
                          console.log('🧪 Test successful - OTP extracted:', extractedOtp);
                        } else {
                          console.log('❌ Test failed - No OTP extracted from test SMS');
                        }
                      }}
                                         >
                       🧪 Test with Your SMS Format
                     </AppText>
                  </View>
                )}
                {error.includes('SMS Retriever timed out') && (
                  <View style={{marginTop: 10}}>
                    <AppText 
                      type={TWELVE} 
                      color="orange" 
                      style={{textDecorationLine: 'underline'}}
                      onPress={() => {
                        setError('');
                        initializeOtpListener();
                      }}
                    >
                      🔄 Retry SMS Retriever
                    </AppText>
                    <AppText 
                      type={TWELVE} 
                      color="purple" 
                      style={{marginTop: 5, textDecorationLine: 'underline'}}
                      onPress={() => {
                        setError('');
                        requestSmsPermission().then(hasPermission => {
                          if (hasPermission) {
                            startTraditionalSmsListener();
                          }
                        });
                      }}
                    >
                      📱 Try Traditional SMS Method
                    </AppText>
                  </View>
                )}
                {error.includes('SMS Retriever not receiving messages') && (
                  <View style={{marginTop: 10}}>
                    <AppText 
                      type={TWELVE} 
                      color="blue" 
                      style={{textDecorationLine: 'underline'}}
                      onPress={() => {
                        setError('');
                        initializeOtpListener();
                      }}
                    >
                      🔄 Retry SMS Retriever
                    </AppText>
                    <AppText 
                      type={TWELVE} 
                      color="green" 
                      style={{marginTop: 5, textDecorationLine: 'underline'}}
                      onPress={() => {
                        setError('');
                        requestSmsPermission().then(hasPermission => {
                          if (hasPermission) {
                            startTraditionalSmsListener();
                          }
                        });
                      }}
                    >
                      📱 Switch to Traditional SMS
                    </AppText>

                  </View>
                )}

                  </View>
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
      <SpinnerSecond loading={loading} style={{}}/>
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
