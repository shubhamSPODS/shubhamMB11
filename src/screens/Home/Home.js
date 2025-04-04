import React, { useEffect, useState, useRef } from 'react';
import { View, Linking, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import Basketball from './Basketball';
import Football from './Football';
import Cricket from './Cricket';
import Kabbadi from './Kabbadi';
import NavigationService from '../../navigation/NavigationService';
import {
  BOTTOM_TAB_PROFILE_SCREEN,
} from '../../navigation/routes';
import Carousel from 'react-native-snap-carousel';
import { _createwallet, getBannerList, getKycDetails } from '../../actions/profileAction';
import { NewColor } from '../../theme/color';
import { KeyBoardAware } from '../../common/KeyboardAware';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import BannerSlider from '../../common/BannerSilder';
import { BannerLoop } from '../../helper/image';
import { Button } from '../../common/Button';
import Geolocation from '@react-native-community/geolocation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MycreateShareContest, shareTeam } from '../../slices/matchSlice';
import { getVersion } from 'react-native-device-info';
import { USER_TOKEN_KEY } from '../../libs/constants';
import { userLogout } from '../../actions/authActions';
import { Screen } from '../../theme/dimens';
import FastImage from "@d11/react-native-fast-image";
import { BASE_URL } from '../../helper/utility';

const Home = () => {
  const dispatch = useDispatch();
  const carousel = useRef(null);
  const appVersion = useSelector(state => {
    return state.profile.appVersion;
  });
  
  
  const [selectedLabel, setSelectedLabel] = useState('Cricket');
  // const [latitude, setLatitude] = useState('');
  // const [longitute, setLongitute] = useState('');
  const bannerList = useSelector(state => {
    return  state.profile.bannerList;
  })
  const [refershing, setRefreshingTwo] = useState(false);
  const [random, setRandom] = useState(0);
  const [CheckCurrent, setCheckCurrent] = useState(getVersion());
  console.log(CheckCurrent,'checkCu??rrent>>>',appVersion);
  
  const onClick = Cricket => {
    setSelectedLabel(Cricket);
  };
  useEffect(() => {
    dispatch(getBannerList());
    dispatch(getKycDetails());
  }, []);
    const userData = useSelector(state => {
      return state.profile.userData;
    });
   
    
 
  // const requestLocationPermission = async () => {
  //   const isIos = Platform.OS === 'ios';
  //   if (isIos) {
  //     Geolocation.requestAuthorization();
  //     fetchLocation();
  //   } else {
  //     const checkLocationPermission = await PermissionsAndroid.check(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     );
  //     if (checkLocationPermission) {
  //       fetchLocation();
  //     } else {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           fetchLocation();
  //         } else {
  //           Alert.alert(
  //             'This app needs location access',
  //             'Please grant location assess so this app can detect beacons in the background',

  //           );
  //         }
  //       } catch (err) {
  //         console.log(err);

  //       }
  //     }
  //   }
  // };
  // const getLatituteLongitute = (lat, long) => {
  //   setLatitude(lat)
  //   setLongitute(long)
  // }
  // const fetchLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       getLatituteLongitute(
  //         position.coords.latitude,
  //         position.coords.longitude,
  //       );
  //     }
  //   );
  // };
  const handleDynamicLink = link => {

    if (link && link?.url) {
      navigate(link.url);
    }
  };
  const navigate = async url => {
    const customerToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
    const queryString = url.split('?')[1];
    const paramsArray = queryString.split('&');
    const params = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    const teamId = params['teamId'];
    const matchId = params['matchID'];
    const userId = params['userId'];
    const match_id = params['match_id'];
    const category = params['category'];

    if (teamId && userId && matchId && customerToken) {
      let data = {
        newId: teamId,
        second: userId,
        matchid: matchId
      }
      dispatch(shareTeam(data))
    }
    if (match_id && customerToken || category) {
      dispatch(MycreateShareContest(match_id, true, category));
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
  const bannerData = [
    {
      id: '1',
      image: BannerLoop,
    },
    {
      id: '2',
      image: BannerLoop,
    },
    {
      id: '3',
      image: BannerLoop,
    },
  ];
  const onRefresh = () => {
    setRandom(Math.random())
  };


  useEffect(() => {
    // console.log(CheckCurrent,appVersion, "version");
    if(CheckCurrent != appVersion) {
      InstallAPK();
    } 
  }, []);
  const InstallAPK = async () => {
    Alert.alert(
      'Update APK',
      'Please Update the latest verison.',
      [
        // { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => DownloadApk() }
      ]
    );
  };

  const DownloadApk = async () => {
    userLogout();
    const apkDownloadUrl = 'https://admin.mybattle11.com/downloads';
    Linking.openURL(apkDownloadUrl)
      .catch((error) => {
        console.error('Error opening download link:', error);
      });
  }
  return (
    <AppSafeAreaView
      statusColor={true}
      style={{ backgroundColor: NewColor.linerWhite }}
      hidden={false}>
      <HomeTopHeader
        walletIcon={true}
        personClick={() =>
          NavigationService.openDrawer()
        }
      />
      
          {/* <BannerSlider bannerData={bannerList}/> */}
      <KeyBoardAware
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }>
        {selectedLabel == 'Cricket' ? (
          <Cricket random={random} setRefreshingTwo={setRefreshingTwo} />
        ) : selectedLabel == 'Football' ? (
          <Football />
        ) : selectedLabel == 'Basketball' ? (
          <Basketball />
        ) : (
          <Kabbadi jobType="Kabbadi" />
        )}
      </KeyBoardAware>

    </AppSafeAreaView>
  );
};
const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContainer: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginTop: '8%',
  },
  personImage: {
    height: 28,
    width: 28,
  },
  combineIcon: {
    height: 30,
    width: 85,
  },
  notificationIcon: {
    height: 17,
    width: 16,
  },
});

export default Home;
