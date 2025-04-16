import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'redux';
import {appOperation} from '../appOperation';
import {logError, toastAlert} from '../helper/utility';
import {FCM_TOKEN_KEY, USER_TOKEN_KEY} from '../libs/constants';
import NavigationService from '../navigation/NavigationService';
import {
  AUTHSTACK,
  BOTTOM_NAVIGATION_STACK,
  HOME,
  MYBATTLEOTP,
  OTP,
} from '../navigation/routes';
import {setLoading} from '../slices/authSlice';
import {setUserData, setWalletCreate} from '../slices/profileSlice';
import {getUserProfile} from './profileAction';
import { Alert, Platform } from 'react-native';
//done
export const userLogin = data => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.guest.login(data);
    if (response?.success) {
      appOperation.setCustomerToken(response?.data?.accessToken);
      dispatch(getUserProfile(false, false));
      await AsyncStorage.setItem(USER_TOKEN_KEY, response?.data?.accessToken);
      dispatch(setUserData(response?.data));
      // dispatch(updateDeviceToken());
      // NavigationService.navigate(BOTTOM_NAVIGATION_STACK);
    } else {
      toastAlert.showToastError(response?.message);
    }
  } catch (e) {
    logError(e);
    toastAlert.showToastError(e?.message);
  } finally {
    dispatch(setLoading(false));
  }
};
//done
export const userSignup = (data, permissionSave) => async dispatch => {
  try {
    const response = await appOperation.guest.register(data);
    
    dispatch(setLoading(true));
    if (response?.success) {
      NavigationService.navigate(MYBATTLEOTP, {
        data: data,
        id: 'register',
        permissionSave: permissionSave,
      });
    } else {
      toastAlert.showToastError(response?.message);
    }
  } catch (e) {
    console.log(JSON.stringify(e), '==er');
  } finally {
    dispatch(setLoading(false));
  }
};
//done
export const otpVerification =
  (data, isAlert = false) =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await appOperation.guest.otp_verification(data);
 console.log(response,'==respomse>>>');
 
      if (response?.success) {
        appOperation.setCustomerToken(response?.data?.accessToken);
        
        await AsyncStorage.setItem(USER_TOKEN_KEY, response?.data?.accessToken);
        dispatch(updateDeviceToken());
        await dispatch(getUserProfile(true, false));
        dispatch(setUserData(response?.data?._id));
        // NavigationService.navigate(BOTTOM_NAVIGATION_STACK);
      } else {
        toastAlert.showToastError(response?.message);
      }
      // if (response?.success) {
      //   isAlert
      //     ? toastAlert.showToastError(response?.message)
      //     : NavigationService.navigate('Home' ,{data: data, id: 'register'})
      // } else {
      //   toastAlert.showToastError(response?.message);
      // }
    } catch (e) {
      logError(e);
      toastAlert.showToastError(e?.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

//done
// export const forgotPassword =
//   (data: any, isAlert = false) =>
//   async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(setLoading(true));
//       const response: any = await appOperation.guest.forgot_password(data);
//       if (response?.success) {
//         isAlert
//           ? toastAlert.showToastError(response?.message)
//           : NavigationService.navigate(OTP, {data: data, id:'register'});
//       } else {
//         toastAlert.showToastError(response?.message);
//       }
//     } catch (e: any) {
//       logError(e);
//       toastAlert.showToastError(e?.message);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//done
// export const resetPassword = (data: any) => async (dispatch: Dispatch<any>) => {
//   try {
//     dispatch(setLoading(true));
//     const response: any = await appOperation.guest.reset_password(data);
//     if (response?.success) {
//       toastAlert.showToastError(response?.message);
//       NavigationService.reset(AUTHSTACK);
//     } else {
//       toastAlert.showToastError(response?.message);
//     }
//   } catch (e: any) {
//     logError(e);
//     toastAlert.showToastError(e?.message);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

export const resetSignUpOtp = id => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.guest.resend_otp(id);

    if (response?.success) {
      toastAlert.showToastError(response?.message);
    } else {
      toastAlert.showToastError(response?.message);
    }
  } catch (e) {
    logError(e);
    toastAlert.showToastError(e?.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const refreshToken = () => async () => {
  try {
    const response = await appOperation.customer.refresh_token();
    if (response?.success) {
      appOperation.setCustomerToken(response?.data?.accessToken);
      await AsyncStorage.setItem(USER_TOKEN_KEY, response?.data?.accessToken);
    }
  } catch (e) {
    logError(e);
    // toastAlert.showToastError(e?.message);
  }
};
export const updateDeviceToken = () => async dispatch => {
  let fcmToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
  console.log(fcmToken, "Fcm_Token");
  let data = {
    fcm_device: Platform.OS,
    fcm_token: fcmToken,
    fcm_update: true,
  };
  try {
    const response = await appOperation.customer.fcm_token(data);
    // console.log(response, "updateDeviceToken");
  } catch (e) {
    logError(e);
  }
};

//done
export const userLogout = () => async () => {
  appOperation.setCustomerToken('');
  await AsyncStorage.removeItem(USER_TOKEN_KEY);
  NavigationService.reset(AUTHSTACK);
};
