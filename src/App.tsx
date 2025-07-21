import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import store from './libs/configStore';
import Navigator from './navigation/Navigator';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {onAppStart} from './helper/app';
import Toast from 'react-native-toast-message';
import {fcmService} from './Notification/FCMService';
import {localNotificationService} from './Notification/LocalNotificationService';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

// List of permissions to request - Only essential permissions
const permissionsList = [
  // Only SMS permissions for OTP auto-fill
  PERMISSIONS.ANDROID.READ_SMS,
  PERMISSIONS.ANDROID.RECEIVE_SMS,
];

const App = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    fcmService.register();
    return () => {
      localNotificationService.unRegister();
    };
  }, []);

  const requestNotificationPermission = async () => {
    // await request(Platform.OS == 'android'? PERMISSIONS.ANDROID.POST_NOTIFICATIONS : PERMISSIONS.IOS.CAMERA);
  };

  useEffect(() => {
    onAppStart(store);
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    requestNotificationPermission();
    checkAndRequestPermissions();
  }, []);

  // Function to check and request permissions
  const checkAndRequestPermissions = async () => {
    let allGranted = true;

    for (const permission of permissionsList) {
      const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        allGranted = false;
        await requestPermission(permission);
      }
    }

    setPermissionsGranted(allGranted);
  };

  // Request a specific permission
  const requestPermission = async (permission:any) => {
    const result = await request(permission);
    if (result === RESULTS.DENIED) {
      Alert.alert(
        'SMS Permission Required',
        'SMS permission is needed to automatically fill OTP codes for faster verification.',
        [{text: 'OK'}]
      );
    }
  };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigator />
        <Toast />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
