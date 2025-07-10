import {createSlice} from '@reduxjs/toolkit';
import {Linking, Platform} from 'react-native';
import {appOperation} from '../appOperation';
import {toastAlert} from '../helper/utility';
import NavigationService from '../navigation/NavigationService';
import {
  CONTESTSHARE,
  KYC_SCREEN,
  MY_BALANCE,
  OTHER_USER_PROFILE,
  PRIVATECONTESTLEADER,
  SHARE_TEAM,
} from '../navigation/routes';
import {getKycDetails, getUserProfile} from '../actions/profileAction';
import {customSort} from '../screens/Selectsubstitute.js/SelectSubstitute';
import PhonePePaymentSDK from 'react-native-phonepe-pg';

function expandData(data) {
  return data.map(item => {
    const expandedData = item.data.map(nestedData => ({...nestedData}));
    return {...item, data: expandedData};
  });
}
export const initialState = {
  upcomingMatches: [],
  myTeams: [],
  myContest: [],
  CreateContestData: [],
  myMatchesData: [],
  isLoading: false,
  contestData: undefined,
  contestList: [],
  isContestEntry: false,
  selectedMatch: undefined,
  allPlayers: [],
  playerDetail: undefined,
  shareLink: undefined,
  walletCreateData: undefined,
  getPlayerTab: undefined,
  adharVerifydata: undefined,
  OtherProfileData: undefined,
  SortbyFilterData: [],
  upiVerifiy: undefined,
  contestListTeam: [],
  phonePeGetway_Response: undefined,
  allContestList: [],
  RemaningPlayer: [],
  substitute: [],
  saveTeamShare: [],
  MyCreateContestData: [],
  MatchDetails: undefined,
  dataContest: undefined,
  details: [],
  addharDetails: undefined,
  ifscDetails: undefined,
  saveStatsPlayer: [],
  SavePidstats: undefined,
  saveTeamNameStats: undefined,
  pointsFilterStats: undefined,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setUpComingMatches: (state, {payload}) => {
      state.upcomingMatches = payload;
    },
    setLoading: (state, {payload}) => {
      state.isLoading = payload;
    },
    setMyTeam: (state, {payload}) => {
      state.myTeams = payload;
    },
    setMyContest: (state, {payload}) => {
      state.myContest = payload;
    },
    setMyMatchesData: (state, {payload}) => {
      state.myMatchesData = payload;
    },
    setContestData: (state, {payload}) => {
      state.contestData = payload;
    },
    setMyMatchesHome: (state, {payload}) => {
      state.myMatchesHome = payload;
    },
    setCreateContest: (state, {payload}) => {
      state.CreateContestData = payload;
    },
    setContestList: (state, {payload}) => {
      state.contestList = payload;
    },
    setIsContestEntry: (state, {payload}) => {
      state.isContestEntry = payload;
    },
    setSelectedMatch: (state, {payload}) => {
      state.selectedMatch = payload;
    },
    setAllPlayers: (state, {payload}) => {
      state.allPlayers = payload;
    },
    setPlayerDetail: (state, {payload}) => {
      state.playerDetail = payload;
    },
    setShareLink: (state, {payload}) => {
      state.shareLink = payload;
    },
    setCreateWallet: (state, {payload}) => {
      state.walletCreateData = payload;
    },
    setTab: (state, {payload}) => {
      state.getPlayerTab = payload;
    },
    setAdharVerify: (state, {payload}) => {
      state.adharVerifydata = payload;
    },
    setOtherUserProfile: (state, {payload}) => {
      state.OtherProfileData = payload;
    },
    setUpiVerifiy: (state, {payload}) => {
      state.upiVerifiy = payload;
    },
    setSortByFilter: (state, {payload}) => {
      state.SortbyFilterData = payload;
    },
    setContestListTeam: (state, {payload}) => {
      state.contestListTeam = payload;
    },
    setPhonePeGewat: (state, {payload}) => {
      state.phonePeGetway_Response = payload;
    },
    setAllContest: (state, {payload}) => {
      state.allContestList = payload;
    },
    setRemaningPlayer: (state, {payload}) => {
      state.RemaningPlayer = payload;
    },
    setsubstitute: (state, {payload}) => {
      state.substitute = payload;
    },
    setShareTeam: (state, {payload}) => {
      state.saveTeamShare = payload;
    },
    setMyCreateContest: (state, {payload}) => {
      state.MyCreateContestData = payload;
    },
    setSavematchDetails: (state, {payload}) => {
      state.MatchDetails = payload;
    },
    setdataContest: (state, {payload}) => {
      state.dataContest = payload;
    },
    setMathdetails: (state, {payload}) => {
      state.details = payload;
    },
    setAdharDetails: (state, {payload}) => {
      state.addharDetails = payload;
    },
    setifscDetails: (state, {payload}) => {
      state.ifscDetails = payload;
    },
    setSaveStatsPlayer: (state, {payload}) => {
      state.saveStatsPlayer = payload;
    },
    setSavePidstats: (state, {payload}) => {
      state.SavePidstats = payload;
    },
    setSaveTeamNameStats: (state, {payload}) => {
      state.saveTeamNameStats = payload;
    },
    setPointsFilterStats: (state, {payload}) => {
      state.pointsFilterStats = payload;
    },
  },
});

export const {
  setUpComingMatches,
  setMyTeam,
  setMyContest,
  setMyMatchesData,
  setMyMatchesHome,
  setsavekey,
  setjoinuserContest,
  setContestData,
  setContestList,
  setIsContestEntry,
  setSelectedMatch,
  setAllPlayers,
  setPlayerDetail,
  setShareLink,
  setCreateWallet,
  setsubstitute,
  setLoading,
  setAdharVerify,
  setCreateContest,
  setTab,
  setUpiVerifiy,
  setOtherUserProfile,
  setSortByFilter,
  setContestListTeam,
  setPhonePeGewat,
  setAllContest,
  setRemaningPlayer,
  setShareTeam,
  setMyCreateContest,
  setSavematchDetails,
  setdataContest,
  setMathdetails,
  setAdharDetails,
  setForSheet,
  setifscDetails,
  setSaveStatsPlayer,
  setSavePidstats,
  setPointsFilterStats,
  setSaveTeamNameStats,
} = matchSlice.actions;
export default matchSlice.reducer;

export const getMyTeam = data => async dispatch => {
  try {
    const res = await appOperation.customer.getMyTeam(data);
    if (res.code == 200) {
      dispatch(setMyTeam(res?.data));
    }
  } catch {}
};
export const createContestData = data => async dispatch => {
  try {
    dispatch(setCreateContest(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getMyJoinedContest = data => async dispatch => {
  try {
    const res = await appOperation.customer.getMyJoinedContest(data);
    if (res.code == 200) {
      const updatedData = res.data.map(dataItem => {
        const arrayfilter = res.arr.filter(
          e => e?.contest_category_id === dataItem?.contest_category_id,
        );
        return {...dataItem, teamDetails: arrayfilter};
      });
      res.data = updatedData;
      dispatch(setMyContest(res?.data));
    }
  } catch (e) {}
};
export const setcreateContest =
  (data, matchid, payAmount, _id, _matchid, teamName, contestListId) =>
  async dispatch => {
    let newData = {
      data1: data,
      matchid1: matchid,
    };
    try {
      const res = await appOperation.customer.createContest(newData);
      // dispatch(setjoinuserContest(res))
      if (res?.success) {
        const data = {
          match_id: res?.matchcontestofuser?.match_id,
          matchid: _matchid,
          contest_category_id: res?.matchcontestofuser?.contest_category_id,
          teams_id: [_id],
          match_contest_category_id: res?.matchcontestofuser?._id,
          amount: payAmount,
          method: 'wallet',
          teamName: teamName,
        };
        dispatch(joinuserContest(data));
        dispatch(createContestData([]));
        dispatch(MycreateContest(contestListId));
        NavigationService.navigate(CONTESTSHARE);
      }
    } catch (e) {
    } finally {
      dispatch(setLoading(false));
    }
  };
export const joinuserContest = data => async dispatch => {
  try {
    const res = await appOperation.customer.joinContestUserPri(data);
    dispatch(setjoinuserContest(res));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const MycreateContest = (data, condition) => async dispatch => {
  try {
    const res = await appOperation.customer.getMyCreateContest(data);
    if (res.code == 200) {
      const updatedData = res.data.map(dataItem => {
        const arrayfilter = res.arr.filter(
          e => e?.contest_category_id === dataItem?.contest_category_id,
        );
        return {...dataItem, teamDetails: arrayfilter};
      });
      res.data = updatedData;
      let datanew = {
        first: res.data[0]?.match_id,
        second: res.data[0]?.contest_category_id,
      };
      dispatch(setMyCreateContest(res?.data));
      dispatch(setSavematchDetails(res?.matchesdata));
      dispatch(shareTeamSave(datanew));
      condition ? NavigationService.navigate(PRIVATECONTESTLEADER) : null;
    }
  } catch (e) {}
};
export const joinContest = (data, matchDetails) => async dispatch => {
  try {
    const validateData = data?.mutiple ? data?.arofobj?.[0] : data;
    const requiredFields = {
      cid: validateData?.cid,
      match_id: validateData?.match_id,
      teams_id: validateData?.teams_id,
      contest_category_id: validateData?.contest_category_id,
      shadow_contest_id: validateData?.shadow_contest_id,
      match_contest_category_id: validateData?.match_contest_category_id
    };

    console.log('Join contest validation:', {
      isMultiple: data?.mutiple,
      requiredFields,
      fullData: data
    });

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields for joining contest:', missingFields);
      toastAlert.showToastError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    dispatch(setLoading(true));
    const res = await appOperation.customer.joinContest(data);
    console.log('Join contest response:', res);

    if (res?.code === 200 || res?.success === true) {
      toastAlert.showToastSuccess(res?.message || 'Contest joined successfully');
      dispatch(getMyJoinedContest(matchDetails?._id));
      dispatch(getContestList(matchDetails?.object, matchDetails?._id));
      dispatch(getMyTeam(matchDetails?._id));
      dispatch(getUserProfile(false, false));
    } else {
      toastAlert.showToastError(res?.message || 'Failed to join contest');
    }
  } catch (error) {
    console.error('Join contest error:', error);
    toastAlert.showToastError(error?.message || 'Failed to join contest');
  } finally {
    dispatch(setLoading(false));
  }
};
export const savekey = data => async dispatch => {
  try {
    dispatch(setsavekey(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};

export const getContestList = (outputObject, id) => async dispatch => {
  let data = {
    matchid: id,
    object: outputObject,
  };
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.getContestList(data);
    console.log('Raw contest list response:', res?.data[0]?.data);
    
    if (res?.code === 200 || res?.success === true) {
      const contestData = res?.data || [];
      
      const newData = contestData.map(category => {
        if (!category?.data) {
          console.log('Skipping category with no data:', category);
          return category;
        }

        const transformedData = category.data.map(contestItem => {
          if (!contestItem) {
            console.log('Skipping null contest item');
            return null;
          }

          const categoryDetails = category.contest_category_details?.find(
            detail => detail?._id === contestItem?.contest_category_id
          );

          const mergedData = {
            Contestsize: Number(contestItem?.Contestsize || 0),
            EnteryFee: Number(contestItem?.EnteryFee || 0),
            EnteryType: String(contestItem?.EnteryType || ''),
            JoinWithMULT: Boolean(contestItem?.JoinWithMULT),
            ConfirmedWin: Boolean(contestItem?.ConfirmedWin),
            teams: Number(contestItem?.teams || 0),
            winning_amount: Number(contestItem?.winning_amount || 0),
            joined: Number(contestItem?.joined || 0),
            contest_category_id: String(contestItem?.contest_category_id || ''),
            categoryName: String(contestItem?.categoryName || ''),
            UsableBonusPercantage: Number(contestItem?.UsableBonusPercantage || 0),
            shadow_contest_id: String(contestItem?.shadow_contest_id || contestItem?._id || ''),
            match_contest_category_id: String(contestItem?._id || ''),
            
            ...(categoryDetails ? {
              Contestsize: Number(categoryDetails.Contestsize || contestItem?.Contestsize || 0),
              EnteryFee: Number(categoryDetails.EnteryFee || contestItem?.EnteryFee || 0),
              EnteryType: String(categoryDetails.EnteryType || contestItem?.EnteryType || ''),
              JoinWithMULT: Boolean(categoryDetails.JoinWithMULT || contestItem?.JoinWithMULT),
              ConfirmedWin: Boolean(categoryDetails.ConfirmedWin || contestItem?.ConfirmedWin),
              teams: Number(categoryDetails.teams || contestItem?.teams || 0),
              winning_amount: Number(categoryDetails.winning_amount || contestItem?.winning_amount || 0),
              UsableBonusPercantage: Number(categoryDetails.UsableBonusPercantage || contestItem?.UsableBonusPercantage || 0),
              shadow_contest_id: String(categoryDetails.shadow_contest_id || contestItem?.shadow_contest_id || contestItem?._id || '')
            } : {}),

            Rankdata: Array.isArray(contestItem?.Rankdata) ? contestItem.Rankdata.map(rank => ({
              ...rank,
              Price: Number(rank?.Price || 0),
              StartRank: Number(rank?.StartRank || 0),
              EndRank: Number(rank?.EndRank || 0)
            })) : (Array.isArray(categoryDetails?.Rankdata) ? categoryDetails.Rankdata.map(rank => ({
              ...rank,
              Price: Number(rank?.Price || 0),
              StartRank: Number(rank?.StartRank || 0),
              EndRank: Number(rank?.EndRank || 0)
            })) : [])
          };

          const arrayfilter = res?.getuserjounedcont?.filter(
            e =>
              e?.contest_category_id === contestItem?.contest_category_id &&
              !categoryDetails?.JoinWithMULT,
          ) || [];
          
          const arrayfilterMulti = res?.getuserjounedcont?.filter(
            e => e?.contest_category_id === contestItem?.contest_category_id,
          ) || [];

          return {
            ...mergedData,
            remove: arrayfilter?.length ? true : false,
            teamDetails: arrayfilterMulti,
          };
        }).filter(Boolean); 

        return {
          ...category,
          data: transformedData,
        };
      });
      
      dispatch(setContestList({ data: newData }));
      dispatch(setContestListTeam(res?.getuserjounedcont || []));

      const finalArray = {
        data: newData.reduce((acc, category) => {
          if (category?.data) {
            acc.push(...category.data);
          }
          return acc;
        }, [])
      };

      dispatch(getFilterSortby(finalArray));
    }
  } catch (e) {
    console.error('Error in getContestList:', e);
  } finally {
    dispatch(setLoading(false));
  }
};
export const getMyMatches = status => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.getMyMatchesData(status);
    if (res.code == 200) {
      dispatch(setMyMatchesData(res.data));
    }
    dispatch(setLoading(false));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getAllPlayerList =
  (id, data, subsitute, newData) => async dispatch => {
    try {
      dispatch(setLoading(true));
      const res = await appOperation.customer.getAllPlayers(id, data);

      if (res.code == 200) {
        const players = [];
        res?.data?.forEach(items => {
          items?.players?.forEach(player => {
            let data = {...player};
            data['teamName'] = items?.team?.abbr;
            data['title'] = items?.team?.title;
            const isLastPlay = items?.last_match_played?.some(
              lastPlay => lastPlay?.player_id == player?.pid,
            );
            data['last_play'] = isLastPlay;
            players.push(data);
          });
        });
        if (subsitute) {
          const newplayer = players.filter(
            player =>
              !newData.some(
                existingPlayer => existingPlayer.pid === player.pid,
              ),
          );
          let substitutePlayer = newData?.filter(item => {
            return item?.substitute === true;
          });
          let allPlayer = [...substitutePlayer, ...newplayer];
          const RemaningPlayerNew = allPlayer
            ?.filter(player => player)
            .sort(customSort);
          dispatch(setRemaning(RemaningPlayerNew));
        }
        dispatch(setAllPlayers(players));
      }
    } catch (e) {
    } finally {
      dispatch(setLoading(false));
    }
  };
export const getPlayerDetail = id => async dispatch => {
  try {
    dispatch(setPlayerDetail(undefined));
    dispatch(setLoading(true));
    const res = await appOperation.customer.player_detail(id);

    if (res?.success) {
      dispatch(setPlayerDetail(res.data));
    }
    dispatch(setLoading(false));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const saveFilterStatsPlayer = data => async dispatch => {
  try {
    dispatch(setSaveStatsPlayer(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const saveSavePid = data => async dispatch => {
  try {
    dispatch(setSavePidstats(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const savePointsFilter = data => async dispatch => {
  try {
    dispatch(setPointsFilterStats(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const SaveTeamNameStats = data => async dispatch => {
  try {
    dispatch(setSaveTeamNameStats(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getSubsituted = data => async dispatch => {
  try {
    dispatch(setsubstitute(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getShareUrl = id => async dispatch => {
  try {
    const res = await appOperation.customer.share_url(id);
    if (res?.success) {
      dispatch(setShareLink(res?.data));
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const setMatchRemainder = data => async dispatch => {
  try {
    const res = await appOperation.customer.match_reminder(data);
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getTab = data => async dispatch => {
  try {
    dispatch(setTab(data));
  } catch (e) {}
};
export const getAdharVerify = data => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.adharverify(data);
    if (res?.success) {
      dispatch(setAdharVerify(res.data));
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(MY_BALANCE);
    } else {
      toastAlert.showToastError(res.message);
    }
    dispatch(setLoading(false));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getOtherUserProfile = data => async dispatch => {
  try {
    const res = await appOperation.customer.otherUserProfile(data);
    if (res?.success) {
      dispatch(setOtherUserProfile(res.data));
      NavigationService.navigate(OTHER_USER_PROFILE);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getUpiVerifiy = data => async dispatch => {
  try {
    const res = await appOperation.customer.upiVerifiy(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const getFilterSortby = data => async dispatch => {
  try {
    dispatch(setSortByFilter(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const paymentGetwayPhonepe = (data, title, sheet) => async dispatch => {
  try {
    const res = await appOperation.customer.phonePeGetway(data);
    if (res?.success) {
      if (title == 'PAY_PAGE') {
        dispatch(setPhonePeGewat(res?.data?.data));
        sheet.current.open();
      } else {
        const payIntent = res?.data?.data?.instrumentResponse?.intentUrl;
        Linking.openURL(payIntent)
          .then(supported => {
            if (!supported) {
              console.error('WhatsApp is not installed on your device.');
            }
          })
          .catch(error => {
            console.error('An error occurred while opening WhatsApp:', error);
          });
      }
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const paymentGetwayPhonepeText = (data, title, sheet, appId) => async dispatch => {
  try {
    dispatch(setLoading(true));
    const res = await appOperation.customer.phonePeGetway(data);
    
    if (res?.code ==200) {
      const merchantId = 'MYBATTLE11UAT';
      const targetApp = data?.targetapp;
      const { orderId, token } = res || {};
      if (!orderId || !token) {
        console.error('Missing orderId or token');
        toastAlert.showToastError('Invalid payment details received');
        return;
      }
      const requestBodyAsString = JSON.stringify({
        orderId:  orderId,
        merchantId: merchantId,
        token: token,
        paymentMode: {
          type: "UPI_INTENT"
        },
        amount:data?.amount,
        targetAppPackageName:targetApp,
        transactionId:data?.transactionId
      });

      PhonePePaymentSDK.startTransaction(requestBodyAsString,'reactDemoAppScheme')
        .then(response => {
          console.log(response, '==PhonePe Transaction Response');

          if (response.status === 'SUCCESS') {
            toastAlert.showToastError('Your payment is in processing');
            sheet?.current?.close();
            dispatch(getUserProfile(false, false));
            NavigationService.navigate(MY_BALANCE);
          } else if (response?.status === 'FAILURE') {
            toastAlert.showToastError('Your payment has been cancelled');
            dispatch(getUserProfile(false, false));
          } else {
            toastAlert.showToastError('Unexpected response from PhonePe');
          }
        })
        .catch(error => {
          console.error('Start Transaction Error:', error);
          toastAlert.showToastError('Transaction failed to start');
        });
    } else {
      toastAlert.showToastError(res?.message || 'Payment gateway failed');
    }
  } catch (e) {
    console.error('PhonePe Payment Error:', e);
    toastAlert.showToastError('Something went wrong with the payment');
  } finally {
    dispatch(setLoading(false));
  }
};

export const setRemaning = data => async dispatch => {
  try {
    dispatch(setRemaningPlayer(data));
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const shareTeam = data => async dispatch => {
  try {
    const res = await appOperation.customer.share_Team(data);
    if (res?.success) {
      dispatch(setShareTeam(res?.data));
      let matchesObject = res?.matchesData && res?.matchesData[0];
      dispatch(setContestData(matchesObject));
      let newData = [];
      res?.data[0]?.players?.forEach(player => {
        let data = {...player};
        data['title'] = player?.primary_team?.title;
        newData.push(data);
      });
      NavigationService.navigate(SHARE_TEAM, {
        selectedPlayerDetails: newData,
        useDetails: res?.data && res?.data[1],
      });
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const MycreateShareContest =
  (data, condition, category) => async dispatch => {
    try {
      dispatch(setLoading(true));
      const res = await appOperation.customer.getMyShareCreateContest(
        data,
        category,
      );
      if (res.code == 200) {
        const updatedData = res.data.map(dataItem => {
          const arrayfilter = res.arr.filter(
            e => e?.contest_category_id === dataItem?.contest_category_id,
          );
          return {...dataItem, teamDetails: arrayfilter};
        });
        res.data = updatedData;
        let datanew = {
          first: res.data[0]?.match_id,
          second: res.data[0]?.contest_category_id,
        };
        dispatch(setMyCreateContest(res?.data));
        dispatch(setSavematchDetails(res?.matchesdata));
        dispatch(shareTeamSave(datanew));
        condition ? NavigationService.navigate(PRIVATECONTESTLEADER) : null;
      }
    } catch (e) {
    } finally {
      dispatch(setLoading(false));
    }
  };
export const shareTeamSave = data => async dispatch => {
  try {
    const res = await appOperation.customer.share_Team_Data(data);
    if (res?.success) {
      let matchesObject = res?.data && res?.data[0];
      dispatch(setdataContest(matchesObject));
      const updatedData = res.contestdata.map(dataItem => {
        const arrayfilter = res.arr.filter(
          e =>
            e?.contest_category_id ===
            dataItem?.usercontest_details[0]?.contest_category_id,
        );
        return {...dataItem, teamDetails: arrayfilter};
      });
      res.contestdata = updatedData;
      dispatch(setMathdetails(res?.contestdata[0]));
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};

export const addharVerifiy =
  (data, filterSheet, setIsTimerActive) => async dispatch => {
    dispatch(setLoading(true));
    try {
      const res = await appOperation.customer.addharSendOtp(data);
      if (res?.success) {
        filterSheet?.current?.open();
        dispatch(setAdharDetails(res.data));
        toastAlert.showToastError(res.message);
        setIsTimerActive(true);
      } else {
        toastAlert.showToastError(res.message);
        dispatch(setAdharDetails([]));
      }
    } catch (e) {
    } finally {
      dispatch(setLoading(false));
    }
  };
export const uploadSelfie = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.updateSelfie(data);
    if (res?.success) {
      toastAlert.showToastError(res?.message);
      dispatch(getKycDetails());
      setTimeout(() => {
        NavigationService.navigate(MY_BALANCE);
      }, 1000);
    } else {
      toastAlert.showToastError(res?.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const emailVerifiyOtp = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.emailOtpVerifiry(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const addharVerifiyOtp = (data, filterSheet) => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.adhaarOtpVerifiry(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      filterSheet?.current?.close();
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
      dispatch(setLoading(false));
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const panVerifiy = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    console.log('PAN Verification Request Data:', {
      url: 'user/pan_pro',
      method: 'POST',
      requestBody: data
    });
    const res = await appOperation.customer.panVerifiyKyc(data);
    console.log('PAN Verification API Response:', {
      success: res?.success,
      message: res?.message,
      data: res?.data,
      fullResponse: res
    });
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
      dispatch(setLoading(false));
    }
  } catch (e) {
    console.error('PAN Verification Error:', e);
  } finally {
    dispatch(setLoading(false));
  }
};
export const dlVerifiy = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.dlVerifiyKyc(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const voterIDVerifiy = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.voterIDVerifiyKyc(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const bankVerifiy = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.bankVerifiyKyc(data);
    if (res?.success) {
      toastAlert.showToastError(res?.message);
      dispatch(getKycDetails());
      NavigationService.navigate(KYC_SCREEN);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
    toastAlert.showToastError(e);
  } finally {
    dispatch(setLoading(false));
  }
};
export const ifscVerifiy = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.ifscVerifiyKyc(data);
    if (res?.success) {
      dispatch(setifscDetails(res.data));
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const deleteupi = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.delpayouteteUpi(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getKycDetails());
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};
export const payoutWithdraw = data => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.payout(data);
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(getUserProfile(false, false));
      NavigationService.navigate(MY_BALANCE);
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
  } finally {
    dispatch(setLoading(false));
  }
};