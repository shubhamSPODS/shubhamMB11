import {createSlice} from '@reduxjs/toolkit';
import {Linking, Platform} from 'react-native';
import {appOperation} from '../appOperation';
import {toastAlert} from '../helper/utility';
import NavigationService from '../navigation/NavigationService';
import {
  CONTESTSHARE,
  KYC_SCREEN,
  MY_BALANCE,
  MY_CONTEST,
  OTHER_USER_PROFILE,
  PRIVATECONTESTLEADER,
  SHARE_TEAM,
} from '../navigation/routes';
import {getKycDetails, getUserProfile} from '../actions/profileAction';
import {userLogout} from '../actions/authActions';
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
  contestCategories: [], 
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
    setContestCategories: (state, action) => {
      state.contestCategories = action.payload;
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
  setContestCategories,
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
        const processedItem = {...dataItem, teamDetails: arrayfilter};
        return processedItem;
      });
      res.data = updatedData;
      console.log('🎯 Final my contests data:', JSON.stringify(res.data, null, 2));
      dispatch(setMyContest(res?.data));
    } else {
      console.error('❌ Failed to fetch my joined contests:', res);
    }
  } catch (e) {
  }
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
    
    // Navigate to My Contests after joining user contest
    if (res?.code === 200 || res?.success === true) {
      NavigationService.navigate(MY_CONTEST);
    }
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

    // Additional validation for multiple teams payload
    if (data?.mutiple && data?.arofobj) {
      console.log('🎯 [JOIN CONTEST] Final payload validation before API call:');
      console.log('🎯 [JOIN CONTEST] Payload structure:', {
        mutiple: data.mutiple,
        arofobjLength: data.arofobj.length,
        arofobjStructure: data.arofobj.map((team, index) => ({
          index,
          hasRequiredFields: {
            cid: !!team.cid,
            match_id: !!team.match_id,
            teams_id: Array.isArray(team.teams_id) && team.teams_id.length > 0,
            contest_category_id: !!team.contest_category_id,
            shadow_contest_id: !!team.shadow_contest_id,
            match_contest_category_id: !!team.match_contest_category_id,
            teamName: !!team.teamName,
            method: !!team.method,
            amount: !!team.amount
          },
          teamData: team
        }))
      });
    }

    dispatch(setLoading(true));
    const res = await appOperation.customer.joinContest(data);
    console.log('Join contest response:', res);

    if (res?.success === true) {
      toastAlert.showToastSuccess(res?.message || 'Contest joined successfully');
      
      // Comprehensive refresh of all related data
      console.log('🔄 Refreshing contest data after successful join');
      
      // Refresh contest list with updated joined counts
      dispatch(getContestList(matchDetails?.object, matchDetails?._id));
      
      // Refresh my joined contests
      dispatch(getMyJoinedContest(matchDetails?._id));
      
      // Refresh my teams
      dispatch(getMyTeam(matchDetails?._id));
      
      // Refresh user profile (wallet balance, etc.)
      dispatch(getUserProfile(false, false));
      
      // Force a small delay to ensure data is updated before navigation
      setTimeout(() => {
        // Navigate to My Contests tab after successful join
        NavigationService.navigate(MY_CONTEST);
        
        // Force another refresh after navigation to ensure UI is updated
        setTimeout(() => {
          dispatch(getContestList(matchDetails?.object, matchDetails?._id));
        }, 1000);
      }, 500);
    } else {
      // Handle specific error message for already joined team
      if (res?.message && res.message.includes('You cannot join contest mulitple times with single team')) {
        toastAlert.showToastError('You have already joined the contest from this team');
      } else {
        toastAlert.showToastError(res?.message || 'Failed to join contest');
      }
    }
  } catch (error) {
    console.error('Join contest error:', error);
    toastAlert.showToastError(error?.message || 'Failed to join contest');
  } finally {
    dispatch(setLoading(false));
  }
};

export const joinScoreboardContest = (scoreboardId, matchDetails, contestDetails) => async dispatch => {
  try {

    console.log('🎯 [JOIN SCOREBOARD CONTEST] Input parameters:', {
      scoreboardId,
      matchDetails: {
        _id: matchDetails?._id,
        matchId: matchDetails?.matchId
      },
      contestDetails: {
        _id: contestDetails?._id,
        contest_category_id: contestDetails?.contest_category_id,
        shadow_contest_id: contestDetails?.shadow_contest_id,
        fullDetails: contestDetails
      }
    });

    if (!scoreboardId) {
      toastAlert.showToastError('Scoreboard ID is required');
      return;
    }

    if (!contestDetails?._id) {
      toastAlert.showToastError('Contest details are required');
      return;
    }

    dispatch(setLoading(true));
    
    // Handle multiple scoreboard IDs (comma-separated)
    const scoreboardIds = scoreboardId.includes(',') ? scoreboardId.split(',') : [scoreboardId];
    
    // Validate scoreboard IDs
    const validScoreboardIds = scoreboardIds.filter(id => id && id.trim() !== '');
    
    if (validScoreboardIds.length === 0) {
      toastAlert.showToastError('No valid scoreboard IDs found');
      return;
    }
    
    // Use shadow_contest_id as the primary ID, fallback to contest_category_id, then _id
    const matchContestCategoryId = contestDetails.shadow_contest_id || contestDetails.contest_category_id || contestDetails._id;
    
    // Get shadow_contest_id from contest details
    const shadowContestId = contestDetails.shadow_contest_id;
    
    const data = {
      predictions_id: validScoreboardIds,
      match_contest_category_id: matchContestCategoryId,
      shadow_contest_id: shadowContestId
    };
    
    console.log('🎯 [JOIN SCOREBOARD CONTEST] API Payload:', {
      scoreboardId,
      scoreboardIds,
      validScoreboardIds,
      data,
      contestDetails: {
        _id: contestDetails._id,
        contest_category_id: contestDetails.contest_category_id,
        shadow_contest_id: contestDetails.shadow_contest_id
      },
      finalPayload: data,
      selectedContestId: matchContestCategoryId,
      shadowContestId: shadowContestId,
      contestIdSource: contestDetails.shadow_contest_id ? 'shadow_contest_id' : 
                       contestDetails.contest_category_id ? 'contest_category_id' : '_id'
    });
    
    const res = await appOperation.customer.joinScoreboardContest(data);

    console.log('🎯 [JOIN SCOREBOARD CONTEST] API Response:', {
      code: res?.code,
      success: res?.success,
      message: res?.message,
      data: res?.data,
      fullResponse: res
    });

    if (res?.success === true) {
      console.log('🎯 [JOIN SCOREBOARD CONTEST] Showing success toast with message:', res?.message);
      
      // Handle different response structures
      const successMessage = res?.message || 
                           res?.fullResponse?.message || 
                           'Scoreboard contest joined successfully';
      
      // Show toast immediately after successful response
      toastAlert.showToastSuccess(successMessage);
      
      // Comprehensive refresh of all related data
      console.log('🔄 Refreshing contest data after successful scoreboard join');
      
      // Refresh contest list with updated joined counts
      dispatch(getContestList(matchDetails?.object, matchDetails?._id));
      
      // Refresh my joined contests
      dispatch(getMyJoinedContest(matchDetails?._id));
      
      // Refresh user profile (wallet balance, etc.)
      dispatch(getUserProfile(false, false));
      
      // Force a small delay to ensure data is updated before navigation
      setTimeout(() => {
        NavigationService.goBack();
        
        // Force another refresh after navigation to ensure UI is updated
        setTimeout(() => {
          dispatch(getContestList(matchDetails?.object, matchDetails?._id));
        }, 1000);
      }, 500);
    } else {
      // Handle specific error message for already joined scoreboard
      if (res?.message && res.message.includes('You cannot join contest mulitple times with single team')) {
        toastAlert.showToastError('You have already joined the contest from this scoreboard');
      } else if (res?.message && res.message.includes('All selected predictions are already joined')) {
        toastAlert.showToastError('All selected scoreboards are already joined to this contest');
      } else {
        toastAlert.showToastError(res?.message || 'Failed to join scoreboard contest');
      }
    }
  } catch (error) {
    console.error('Join scoreboard contest error:', error);
    
    // Handle specific error for already joined predictions
    let errorMessage = '';
    if (error?.data && typeof error.data === 'string') {
      try {
        const parsedData = JSON.parse(error.data);
        errorMessage = parsedData.message || '';
      } catch (parseError) {
        console.log('Failed to parse error.data:', parseError);
      }
    }
    
    if (!errorMessage) {
      errorMessage = error?.message || '';
    }
    
    if (errorMessage.includes('All selected predictions are already joined')) {
      toastAlert.showToastError('All selected scoreboards are already joined to this contest');
    } else {
      toastAlert.showToastError(errorMessage || 'Failed to join scoreboard contest');
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export const getMyScoreboardContests = (matchId) => async dispatch => {
  try {

    if (!matchId) {
      console.error('Match ID is required for fetching scoreboard contests');
      return;
    }

    const res = await appOperation.customer.getMyScoreboardContests(matchId);

    if (res?.code === 200 || res?.success === true) {
      return res?.data || [];
    } else {
      console.error('Failed to fetch my scoreboard contests:', res?.message);
      return [];
    }
  } catch (error) {
    console.error('Get my scoreboard contests error:', error);
    return [];
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
    
    if (res?.code === 200 || res?.success === true) {
      const contestData = res?.data || [];
      
      const newData = contestData.map(category => {
        
        if (!category?.data || !category?.contest_category_details) {
          return { ...category, data: [] };
        }

        console.log('🎯 [CATEGORY PROCESSING] Processing category:', {
          categoryName: category?.categoryName,
          dataLength: category?.data?.length,
          detailsLength: category?.contest_category_details?.length
        });

        const detailsMap = category.contest_category_details.reduce((map, detail) => {
          map[detail._id] = detail;
          return map;
        }, {});

        console.log('🎯 [DETAILS MAP] Created details map:', {
          mapKeys: Object.keys(detailsMap),
          sampleDetail: detailsMap[Object.keys(detailsMap)[0]]
        });

        const transformedData = category.data.map(contestItem => {
          const details = detailsMap[contestItem.contest_category_id];
          
          // Log the mapping process for debugging
          console.log('🎯 [DATA TRANSFORM] Mapping contest item:', {
            contestItemId: contestItem._id,
            contestCategoryId: contestItem.contest_category_id,
            detailsFound: !!details,
            detailsJoinWithMULT: details?.JoinWithMULT,
            detailsTeams: details?.teams,
            originalJoinWithMULT: contestItem?.JoinWithMULT,
            originalTeams: contestItem?.teams
          });
          
          const transformedItem = {
            ...contestItem,
            ...(details || {}),
            _id: contestItem._id,
            match_contest_category_id: contestItem._id, // This is the actual contest instance ID
            JoinWithMULT: details?.JoinWithMULT || contestItem?.JoinWithMULT || false,
            teams: details?.teams || contestItem?.teams || 1
          };
          
          // Log the final transformed item for Rs. 9000 contests
          const winningAmount = Number(transformedItem?.winning_amount || transformedItem?.WinningAmount || 0);
          if (winningAmount === 9000) {
            console.log('🎯 [Rs. 9000 Contest Transform] Final transformed item:', {
              contestId: transformedItem._id,
              contestCategoryId: transformedItem.contest_category_id,
              winningAmount: winningAmount,
              JoinWithMULT: transformedItem.JoinWithMULT,
              teams: transformedItem.teams,
              isMultipleEntry: transformedItem.JoinWithMULT === true || transformedItem.teams > 1,
              fullTransformedItem: transformedItem
            });
          }
          
          return transformedItem;
        });

        return { ...category, data: transformedData };
      });
      
      dispatch(setContestList({ data: newData }));
      dispatch(setContestListTeam(res?.getuserjounedcont || []));
      
      const finalArray = {
        data: newData.reduce((acc, category) => {
          if (category?.data) {
            acc.push(...category.data);
          }
          return acc;
        }, []),
      };
      dispatch(getFilterSortby(finalArray));
    }
    return res; 
  } catch (e) {
    console.error('❌ Error in getContestList:', e);
    throw e;
  } finally {
    dispatch(setLoading(false));
  }
};
export const getMyMatches = status => async dispatch => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 8000)
  );
  
  try {
    dispatch(setLoading(true));
    console.log('Fetching my matches data with status:', status || 'all');
    
    const res = await Promise.race([
      appOperation.customer.getMyMatchesData(status),
      timeoutPromise
    ]);
    
    console.log('My matches API response status code:', res?.code);
    
    if (res?.code === 200) {
      console.log('Successfully fetched my matches, count:', res?.data?.length || 0);
      dispatch(setMyMatchesData(res.data || []));
    } else {
      console.error('Failed to fetch my matches:', res?.message || 'Unknown error');
      dispatch(setMyMatchesData([]));
    }
  } catch (error) {
    console.error('Error in getMyMatches:', error?.message || error);
    dispatch(setMyMatchesData([]));
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

export const deleteAccount = () => async dispatch => {
  dispatch(setLoading(true));
  try {
    const res = await appOperation.customer.deleteaccount();
    if (res?.success) {
      toastAlert.showToastError(res.message);
      dispatch(userLogout());
    } else {
      toastAlert.showToastError(res.message);
    }
  } catch (e) {
    toastAlert.showToastError(e?.message || 'Something went wrong');
  } finally {
    dispatch(setLoading(false));
  }
};