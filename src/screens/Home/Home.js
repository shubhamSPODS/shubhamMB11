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
import { _createwallet, editProfile, getAllBannedStates, getBannerList, getKycDetails } from '../../actions/profileAction';
import { NewColor } from '../../theme/color';
import { KeyBoardAware } from '../../common/KeyboardAware';
import { HomeTopHeader } from '../../common/HomeTopHeader';
import BannerSlider from '../../common/BannerSilder';
import { BannerLoop } from '../../helper/image';
import { Button } from '../../common/Button';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MycreateShareContest, shareTeam } from '../../slices/matchSlice';
import { getVersion } from 'react-native-device-info';
import { USER_TOKEN_KEY } from '../../libs/constants';
import { userLogout } from '../../actions/authActions';
import { Screen } from '../../theme/dimens';
import FastImage from "@d11/react-native-fast-image";
import { BASE_URL } from '../../helper/utility';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';



const Home = () => {
  const dispatch = useDispatch();
   const userProfileData = useSelector(state => {
      return state.profile.userData;
    });
    
  const [selectedLabel, setSelectedLabel] = useState('Cricket');
  // const [latitude, setLatitude] = useState('');
  // const [longitute, setLongitute] = useState('');
  const bannerList = useSelector(state => {
    return  state.profile.bannerList;
  })
  console.log(bannerList,'==lis');
  
  const [refershing, setRefreshingTwo] = useState(false);
  const [random, setRandom] = useState(0);
  const [CheckCurrent, setCheckCurrent] = useState(getVersion());
  const [location,setLocation] = useState(null)
   
  
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse').then(status => {
            if (status === 'granted') {
                getCurrentLocation();
            } else {
                Alert.alert(
                    'Permission Denied',
                    'Location access is needed to find nearby professionals.'
                );
            }
        }).catch(error => {
            console.warn('iOS Geolocation permission error:', error);
        });
    } else {
        const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        try {
            const result = await request(permission);

            if (result === RESULTS.GRANTED) {
                getCurrentLocation();
            } else if (result === RESULTS.BLOCKED) {
                Alert.alert(
                    'Permission Blocked',
                    'Please enable location permission from settings.'
                );
            } else {
                Alert.alert(
                    'Permission Denied',
                    'Location access is needed to find nearby professionals.'
                );
            }
        } catch (error) {
            console.warn('Android permission error:', error);
        }
    }
};


const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
      async position => {
          // console.log('Location:', position);
          const coords = position?.coords;
          if (!!coords) {
            try {
              const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=pk.e22718d53262d006fc9518e14a3c470c&lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
              const data = await response.json();
          setLocation(data);

              // console.log('Reverse Geocoded Address:', data);
              if (!!data?.address?.state) {
                handleSubmit(data?.address);
              }
            } catch (apiError) {
              console.error('API Error:', apiError);
              Alert.alert('Error', 'Failed to fetch address information.');
            }
          }
      },
      error => {
          console.error('Location Error:', error);
          Alert.alert('Error', 'Unable to get location. Make sure location services are enabled.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};
  
const handleSubmit = (coords) => {
  const currentState = coords?.state?.toLowerCase();

  const bannedStates = banStateData?.map(item => item?.stateName?.toLowerCase());
  console.log(bannedStates,'==banned state');
  
  if (bannedStates?.includes(currentState)) {
    Alert.alert(
      'Access Restricted',
      `Sorry, our services are not available in ${coords?.state}. You will be logged out.`,
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(userLogout());
          }
        }
      ],
      { cancelable: false }
    );
    return;
  }

  const data = {
    full_name: userProfileData?.full_name,
    email: '',
    gender: userProfileData?.gender,
    mobile_number: userProfileData?.mobile_number,
    dob: '',
    username: userProfileData?.username,
    firsttime: userProfileData?.firsttime,
    location: coords,
  };

  dispatch(editProfile(data, userProfileData?._id));
};

useEffect(()=>{
  requestLocationPermission()
},[])

  const onClick = Cricket => {
    setSelectedLabel(Cricket);
  };
  useEffect(() => {
    dispatch(getBannerList());
    dispatch(getKycDetails());
    dispatch(getAllBannedStates())
  }, []);
    const userData = useSelector(state => {
      return state.profile.userData;
    });

    const banStateData = useSelector(state => {
      return state?.profile?.bannedList
    });
// console.log(banStateData,'==banstate data');
   
    
 

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
  const onRefresh = () => {
    setRandom(Math.random())
  };

 

  const InstallAPK = async () => {
    Alert.alert(
      'Update APK',
      'Please Update the latest verison.',
      [
        { text: 'Cancel', style: 'cancel',onPress:()=> {
          requestPermission()
        }},
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
