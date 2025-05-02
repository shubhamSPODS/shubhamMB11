import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  userData: undefined,
  ibatBalance: undefined,
  userWalletData: undefined,
  kycDetails: null,
  depositTransactions: [],
  contestTransactions: [],
  withdrawalsTransactions: [],
  walletCreateData: undefined,
  SaveActivite: undefined,
  appVersion: undefined,
  bannerList: [],
  refferalList: [],
  bannedList:[]
};
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.userData = payload;
    },
    setIbatBalance: (state, { payload }) => {
      state.ibatBalance = payload;
    },
    setUserWalletData: (state, { payload }) => {
      state.userWalletData = payload;
    },
    setKycDetails: (state, { payload }) => {
      state.kycDetails = payload;
    },
    setTransactionsDeposit: (state, { payload }) => {
      state.depositTransactions = payload;
    },
    setTransactionsContest: (state, { payload }) => {
      state.contestTransactions = payload;
    },
    setTransactionsWithdrawals: (state, { payload }) => {
      state.withdrawalsTransactions = payload;
    },
    setWalletCreate: (state, { payload }) => {
      state.walletCreateData = payload;
    },
    setActivite: (state, { payload }) => {
      state.SaveActivite = payload;
    },
    setAppVersion: (state, { payload }) => {
      state.appVersion = payload;
    },
    setBannerList: (state, { payload }) => {
      state.bannerList = payload;
    },
    setBannedStateList: (state, { payload }) => {
      state.bannedList = payload;
    },
    setRefferalList: (state, { payload }) => {
      state.refferalList = payload;
    },
  },
});

export const {
  setUserData,
  setUserWalletData,
  setTransactionsDeposit,
  setTransactionsContest,
  setTransactionsWithdrawals,
  setKycDetails,
  setActivite,
  setWalletCreate,
  setAppVersion,
  setBannerList,
  setRefferalList,
  setBannedStateList
} = profileSlice.actions;

export default profileSlice.reducer;
