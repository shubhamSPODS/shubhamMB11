import { updateDeviceToken, userLogout } from './authActions';
import { Dispatch } from 'redux';
import { appOperation } from '../appOperation';
import { logError, toastAlert } from '../helper/utility';
import NavigationService from '../navigation/NavigationService';
import {
  BOTTOM_NAVIGATION_STACK,
  BOTTOM_TAB_PROFILE_SCREEN,
  MY_BALANCE,
  OTP,
} from '../navigation/routes';
import { setLoading } from '../slices/authSlice';
import {
  setActivite,
  setKycDetails,
  setTransactionsContest,
  setTransactionsDeposit,
  setTransactionsWithdrawals,
  setLudoTransactions,
  setUserData,
  setAppVersion,
  setUserWalletData,
  setBannerList,
  setRefferalList
} from '../slices/profileSlice';
import { setCreateWallet } from '../slices/matchSlice';

export const getUserProfile =
  (isNavigate = true, isUpdate = false) =>
    async (dispatch: Dispatch<any>) => {
      try {
        dispatch(setLoading(true));
        const response = await appOperation.customer.get_profile();
        if (response?.success) {
          dispatch(setAppVersion(response?.version));
          isNavigate ? NavigationService.reset(BOTTOM_NAVIGATION_STACK) : null;
          isUpdate ? NavigationService.navigate(BOTTOM_TAB_PROFILE_SCREEN) : null;
          dispatch(setUserData(response?.data));
         
          dispatch(setActivite(response.activity))
          dispatch(updateDeviceToken());
        } else {
          toastAlert.showToastError(response?.message);
        }
      } catch (e) {
        logError(e);
        dispatch(userLogout());
        toastAlert.showToastError(e?.message);
      } finally {
        dispatch(setLoading(false));
      }
    };
export const createWalletAPI = id => async (dispatch: Dispatch<any>) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.walletcreate(id);
    if (response?.status) {
      dispatch(setCreateWallet(response?.data));
    }
  } catch (error) {
    logError(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getUserWallet = () => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.get_wallet();
    if (response?.success) {
      dispatch(setUserWalletData(response?.data));
    }
    dispatch(getUserProfile(false, false));
  } catch (e) {
    logError(e);
    dispatch(setUserWalletData(undefined));
  } finally {
    dispatch(setLoading(false));
  }
};
export const getKycDetails = () => async dispatch => {
  try {
    const res = await appOperation.customer.getKycDetails();
    
    if (res?.code === 200 || res?.success) {
      // Ensure all verification statuses are numbers
      const normalizedData = {
        ...res?.data,
        mobile_verified: Number(res?.data?.mobile_verified || 0),
        email_verified: Number(res?.data?.email_verified || 0),
        selfie_verified: Number(res?.data?.selfie_verified || 0),
        pan_verified: Number(res?.data?.pan_verified || 0),
        bank_verified: Number(res?.data?.bank_verified || 0),
        adhar_verified: Number(res?.data?.adhar_verified || 0),
        upi_verified: Number(res?.data?.upi_verified || 0)
      };
      
      dispatch(setKycDetails(normalizedData));
    } else {
      console.error('Failed to get KYC details:', res?.message);
    }
  } catch (e) {
    console.error('Error getting KYC details:', e);
  }
};

export const getBannerList = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.getBannerList();
    if (response?.success) {
      dispatch(setBannerList(response?.data));
    }
  } catch (e) {
    logError(e);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getRefferalList = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.getrefferalList();
    console.log(response, "response");
    if (response?.success) {
      dispatch(setRefferalList(response?.data));
    }
  } catch (e) {
    logError(e);
  } finally {
    dispatch(setLoading(false));
  }
};

export const sendKycOtp = data => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.sendKycOtp(data);
    dispatch(setLoading(false));
    if (res.code == 200) {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
    dispatch(setLoading(false));
  }
};
export const verifyKycOtp = data => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.verifyKycOtp(data);
    
    dispatch(setLoading(false));
    if (res.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(MY_BALANCE);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
    dispatch(setLoading(false));
  }
};
export const updateKyc = data => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.updateKyc(data);
    dispatch(setLoading(false));

    if (res.success) {
      toastAlert.showToastError(res?.message);
      dispatch(getKycDetails());
      setTimeout(() => {
        NavigationService.navigate(MY_BALANCE);
      }, 1000);
    } else {
      toastAlert.showToastError(res?.message);

    }
  } catch (e) {
    dispatch(setLoading(false));
  }
};
export const getTransactionsDeposit = (type) => async (dispatch: Dispatch<any>) => {
  try {
    dispatch(setLoading(true));
    const response = await appOperation.customer.alltransactions(type);
    if (response?.success) {
      dispatch(setTransactionsDeposit(response?.data));
    }
  } catch (e) {
    logError(e);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getLudoTransactions = () => async (dispatch: Dispatch<any>) => {
  try {
    console.log('🎯 [LUDO TRANSACTIONS] Starting API call to /user/ludo-transactions...');
    dispatch(setLoading(true));
    
    const response = await appOperation.customer.ludoTransactions();
    console.log('🎯 [LUDO TRANSACTIONS] API Response:', {
      success: response?.success,
      message: response?.message,
      dataLength: response?.data?.length || 0,
      fullResponse: response
    });
    
    if (response?.success) {
      console.log('🎯 [LUDO TRANSACTIONS] Dispatching to Redux store:', {
        transactionsCount: response?.data?.length || 0,
        firstTransaction: response?.data?.[0],
        lastTransaction: response?.data?.[response?.data?.length - 1]
      });
      dispatch(setLudoTransactions(response?.data));
    } else {
      console.log('🎯 [LUDO TRANSACTIONS] API call failed:', response?.message);
    }
  } catch (e) {
    console.error('🎯 [LUDO TRANSACTIONS] Error:', e);
    console.error('🎯 [LUDO TRANSACTIONS] Error details:', {
      code: e?.code,
      message: e?.message,
      data: e?.data
    });
    logError(e);
  } finally {
    dispatch(setLoading(false));
    console.log('🎯 [LUDO TRANSACTIONS] API call completed');
  }
};


export const editProfile = (data, id) => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.editProfile(data, id);
    if (res?.code == 200) {
      toastAlert.showToastError(res?.message);
      dispatch(getUserProfile(false, true));
      NavigationService.reset(BOTTOM_NAVIGATION_STACK)
    }
    dispatch(setLoading(false));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
