import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Keyboard, StyleSheet, View } from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';
import Checkbox from '../common/CheckBox/CheckBox';
import PrimaryButton from '../common/primaryButton';
import { universalPaddingHorizontal } from '../theme/dimens';
import { toastAlert, validateMobile } from '../helper/utility';
import { userSignup } from '../actions/authActions';
import { TouchableOpacityView } from '../common/TouchableOpacityView';
import { StatusBar } from 'native-base';

import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform, PermissionsAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NavigationService from '../navigation/NavigationService';
import { HOME_PRIVACY, WEB_URL, BANNED_STATE_SCREEN } from '../navigation/routes';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { SpinnerSecond } from '../common/SpinnerSecond';
import { BASE_URL } from '../helper/utility';

const MyBattleLogin = () => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState('');
  const [isSelectedAge, setIsSelectedAge] = useState(false);
  const [isSelectedState, setIsSelectedState] = useState(false);
  const [isSelectedTerms, setIsSelectedTerms] = useState(false);
  const [code, setCode] = useState('');
  const loading = useSelector((state: any) => state.auth.isLoading);
  // Geolocation + Reverse Geocoding (LocationIQ)
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const geocodeDoneRef = useRef<boolean>(false);
  const bannedNavigatedRef = useRef<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const requestLocationPermissionAndFetch = async () => {
    try {
      setLocationLoading(true);
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });
      if (permission) {
        await request(permission);
      }
      if (Platform.OS === 'ios') {
        // Explicitly request authorization for iOS and set config
        try {
          // @ts-ignore
          Geolocation.setRNConfiguration?.({ authorizationLevel: 'whenInUse', skipPermissionRequests: false });
        } catch {}
        try {
          // @ts-ignore
          await Geolocation.requestAuthorization?.('whenInUse');
        } catch (e) {
          console.log('iOS requestAuthorization error:', (e as any)?.message || e);
        }
      }
      // Try multiple strategies to avoid timeout
      const attemptGetPosition = (opts: GeolocationOptions) =>
        new Promise<GeolocationResponse>((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, opts);
        });

      // Ensure Android runtime permissions for both fine and coarse
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
        } catch {}
      }

      // Use official callback-style API from react-native-geolocation-service
      const getCurrentPositionCb = (opts: any) => new Promise<GeolocationResponse>((resolve, reject) => {
        try {
          Geolocation.getCurrentPosition(
            (pos) => resolve(pos as any),
            (err) => reject(err),
            opts,
          );
        } catch (e) {
          reject(e);
        }
      });

      try {
        // iOS: quick low-accuracy first; Android: high-accuracy first with provider dialog
        const primaryOpts = Platform.select({
          ios: { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 },
          android: { enableHighAccuracy: true, timeout: 6000, maximumAge: 0, forceRequestLocation: true, showLocationDialog: true, forceLocationManager: true },
        });
        const pos = await getCurrentPositionCb(primaryOpts);
        const { latitude, longitude } = (pos as any).coords;
        setUserCoords({ latitude, longitude });
        reverseGeocode(latitude, longitude);
        return;
      } catch (e1: any) {
        console.log('Primary getCurrentPosition failed:', e1?.message || e1);
      }

      try {
        // Fallback: flip accuracy
        const fallbackOpts = Platform.select({
          ios: { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 },
          android: { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000, forceRequestLocation: true, showLocationDialog: true, forceLocationManager: true },
        });
        const pos2 = await getCurrentPositionCb(fallbackOpts);
        const { latitude, longitude } = (pos2 as any).coords;
        setUserCoords({ latitude, longitude });
        reverseGeocode(latitude, longitude);
        return;
      } catch (e2: any) {
        console.log('Fallback getCurrentPosition failed:', e2?.message || e2);
      }

      // If still no location, stop loader
      setLocationLoading(false);
    } catch (e: any) {
      console.log('Location permission/fetch error (Login):', e?.message || e);
      setLocationLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    if (geocodeDoneRef.current) {
      return;
    }
    geocodeDoneRef.current = true;
    try {
      const key = 'pk.e22718d53262d006fc9518e14a3c470c';
      const url = `https://us1.locationiq.com/v1/reverse?key=${encodeURIComponent(key)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();
      clearTimeout(timeoutId);
      console.log('Reverse geocoding full JSON (Login):', JSON.stringify(json));
      if (json?.display_name) {
        setUserAddress(json.display_name as string);
        console.log('Reverse geocoded address (Login):', json.display_name);
        // Check banned states after geocode
        const stateNameRaw = (json?.address?.state || json?.state || '').toString();
        const normalizedState = stateNameRaw.trim().toLowerCase();
        console.log('Detected state (normalized):', normalizedState);
        if (normalizedState) {
          try {
            const banRes = await fetch(`${BASE_URL}States/BanState`);
            const banJson = await banRes.json();
            console.log('BanState JSON:', JSON.stringify(banJson));
            const bannedStates: string[] = Array.isArray(banJson?.data)
              ? banJson.data
                  .filter((s: any) => s?.isBanned === true)
                  .map((s: any) => (s?.stateName || s?.state || '').toString().trim().toLowerCase())
              : [];
            console.log('Banned states (normalized):', bannedStates);
            const isBanned = bannedStates.includes(normalizedState);
            console.log('Is current state banned?', isBanned);
            if (isBanned && !bannedNavigatedRef.current) {
              bannedNavigatedRef.current = true;
              NavigationService.navigate(BANNED_STATE_SCREEN, { stateName: stateNameRaw });
            }
          } catch (err: any) {
            console.log('BanState check failed:', err?.message || err);
          }
        }
      } else {
        console.log('Reverse geocoding response (Login):', json);
      }
    } catch (e: any) {
      console.log('Reverse geocoding failed (Login):', e?.message || e);
      // Allow one more attempt in this focus session if fetch aborted
      geocodeDoneRef.current = false;
    } finally {
      setLocationLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('[Login] Screen focused → fetching location');
      geocodeDoneRef.current = false;
      requestLocationPermissionAndFetch();
      return () => {};
    }, [])
  );

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
  
    if (locationLoading || !geocodeDoneRef.current) {
      toastAlert.showToastError('Fetching your location. Please wait...');
      return;
    }

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
            <Image
              source={MyBattleIcon}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
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
      <SpinnerSecond loading={locationLoading} />
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