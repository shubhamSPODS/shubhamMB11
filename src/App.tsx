import React, {useEffect, useRef} from 'react';
import {Provider} from 'react-redux';
import store from './libs/configStore';
import Navigator from './navigation/Navigator';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {onAppStart} from './helper/app';
import RootComponent from './RootComponent';
import Toast from 'react-native-toast-message';
import {fcmService} from './Notification/FCMService';
import {localNotificationService} from './Notification/LocalNotificationService';
import { PERMISSIONS, request } from 'react-native-permissions';

// onAppStart();
const App = () => {
  // const toastRef = useRef(null)
  useEffect(() => {
    fcmService.register();
    return () => {
      localNotificationService.unRegister();
    };
  }, []);
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };
  
  
  useEffect(() => {

    onAppStart(store);
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    requestNotificationPermission();
  }, []);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Navigator />
        <Toast/>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
