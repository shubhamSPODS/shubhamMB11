import { AppOperation } from './../../index';
import { CUSTOMER_TYPE } from '../../types';

export default appOperation => ({
  log_out: data => appOperation.post(`client_logout`, data, CUSTOMER_TYPE),
  get_profile: () =>
    appOperation.get(`user/profile`, undefined, undefined, CUSTOMER_TYPE),
  get_wallet: () =>
    appOperation.get(`wallet/user-wallet`, undefined, undefined, CUSTOMER_TYPE),
  walletcreate: id =>
    appOperation.post(`wallet/create-wallet?user=${id}`, {}, CUSTOMER_TYPE),
  getKycDetails: () =>
    appOperation.get(`user/kyc-details`, undefined, undefined, CUSTOMER_TYPE),
  sendKycOtp: data =>
    appOperation.post(`user/send-kyp-otp`, data, CUSTOMER_TYPE),
  verifyKycOtp: data =>
    appOperation.post(`user/verify-kyc-otp`, data, CUSTOMER_TYPE),
  updateKyc: data => appOperation.post(`user/update-kyc`, data, CUSTOMER_TYPE),
  uploadImg: data => appOperation.post(`upload`, data, CUSTOMER_TYPE),
  getSeriesData: () =>
    appOperation.post('TeamData/Serieslist', {}, CUSTOMER_TYPE),
  getContestList: data => {
    console.log('🎯 [API] getContestList called with:', {
      matchId: data?.matchid,
      object: data?.object,
      fullData: data
    });
    
    return appOperation.post(
      `match/contests/${data?.matchid}`,
      data?.object,
      CUSTOMER_TYPE,
    ).then(response => {
      console.log('🎯 [API] getContestList response for matchId>>>>:', data?.matchid, response?.data[0]?.data);
      return response;
    }).catch(error => {
      console.error('🎯 getContestList error:', error);
      throw error;
    });
  },
  getContestCategoryDetails: data => {
    console.log('getContestCategoryDetails called with data:', data);
    return appOperation.get(
      `match/contest-category/${data?.category_id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    );
  },
  getContestDetailsWithRankData: (matchId, contestCategoryId) => {
    console.log(`🎯 [API] Fetching contest details for match ${matchId} and contest category ${contestCategoryId}`);
    return appOperation.get(
      `match/contests/${matchId}/${contestCategoryId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ).then(response => {
      console.log('🎯 [API] getContestDetailsWithRankData response:', {
        success: response?.success,
        code: response?.code,
        message: response?.message,
        dataLength: response?.data?.length || 0,
        fullResponse: response
      });
      
      if (response?.data?.length > 0) {
        const contestDetails = response.data.find(
          contest => contest.contest_category_id === contestCategoryId || contest._id === contestCategoryId
        );
        
        if (contestDetails) {
          console.log('🎯 [API] Found contest details:', {
            id: contestDetails._id,
            name: contestDetails.categoryName,
            winningAmount: contestDetails.WinningAmount,
            rankDataCount: contestDetails.Rankdata?.length,
            JoinWithMULT: contestDetails.JoinWithMULT,
            teams: contestDetails.teams,
            contestSize: contestDetails.ContestSize,
            fullContestDetails: contestDetails
          });
          
          if (contestDetails.Rankdata?.length > 0) {
            console.log('🎯 [API] Sample rank data (first 3 entries):', 
              contestDetails.Rankdata.slice(0, 3).map(rank => ({
                startRank: rank.StartRank,
                endRank: rank.EndRank,
                price: rank.Price
              }))
            );
          }
        } else {
          console.log('🎯 [API] Contest not found in response for ID:', contestCategoryId);
        }
      }
      return response;
    }).catch(error => {
      console.error('🎯 [API] Error in getContestDetailsWithRankData:', error);
      throw error;
    });
  },
  editProfile: (data, id) =>
    appOperation.put(`user/update-profile?user=${id}`, data, CUSTOMER_TYPE),
  alltransactions: (type) =>
    appOperation.post(
      `user/transactions/${type}`,
      {},
      CUSTOMER_TYPE,
    ),
  ludoTransactions: () =>
    appOperation.get(
      `transactions`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  getAllContest: (matchId, contestId) =>
    appOperation.get(
      `match/contests/${matchId}/${contestId}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  getIntro: () =>
    appOperation.get('intro', undefined, undefined, CUSTOMER_TYPE),
  getMyTeam: id =>
    appOperation.get(
      `match/my-teams/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  getAllPlayers: (id, data) =>
    appOperation.post(
      `match/all-players/${id}`,
      data,
      CUSTOMER_TYPE,
    ),
  player_detail: id =>
    appOperation.get(
      `match/player-profile/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  match_reminder: data =>
    appOperation.post(`user/save-match-reminders`, data, CUSTOMER_TYPE),
  otherUserProfile: data =>
    appOperation.get(
      `user/getprofile?user_id=${data}`,
      undefined, undefined,
      CUSTOMER_TYPE,
    ),
  upiVerifiy: data =>
    appOperation.post(
      `user/upiverifcation`,
      data,
      CUSTOMER_TYPE,
    ),
  phonePeGetway: data =>
    appOperation.post(
      `phonepe/createOrder`,
      data,
      CUSTOMER_TYPE,
    ),
  phonePeGetwayTest: data =>
    appOperation.post(
      `paymenttest/gateway`,
      data,
      CUSTOMER_TYPE,
    ),

  adharverify: data =>
    appOperation.post(
      `user/verify_adhar`,
      data,
      CUSTOMER_TYPE,
    ),
  share_url: id =>
    appOperation.get(
      `match/share-team/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  getMyJoinedContest: id => {
    return appOperation.get(
      `match/my-contests/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ).then(response => {
      console.log('🎯 getMyJoinedContest API response:', response);
      return response;
    }).catch(error => {
      throw error;
    });
  },
  saveTeam: data => {
    console.log('🎯 saveTeam API called with data:', data);
    return appOperation.post(`match/create-team`, data, CUSTOMER_TYPE).then(response => {
      console.log('🎯 saveTeam API response:', response);
      return response;
    }).catch(error => {
      console.error('🎯 saveTeam API error:', error);
      throw error;
    });
  },
  editTeam: data => {
    console.log('🎯 editTeam API called with data:', data);
    return appOperation.put(`match/update-team`, data, CUSTOMER_TYPE).then(response => {
      console.log('🎯 editTeam API response:', response);
      return response;
    }).catch(error => {
      console.error('🎯 editTeam API error:', error);
      throw error;
    });
  },
  refresh_token: () =>
    appOperation.get(`user/refresh-token`, undefined, undefined, CUSTOMER_TYPE),
  fcm_token: data =>
    appOperation.post(`user/save-firebase-token`, data, CUSTOMER_TYPE),
  getPrizeList: (id) =>
    appOperation.get(
      `match/winner-prizes/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  getPrizeListPrivate: (id, privateis) =>
    appOperation.get(
      `match/winner-prizes/${id}/${privateis}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  joinContest: data =>
    appOperation.post(`match/v2/join-contest`, data, CUSTOMER_TYPE),

  joinScoreboardContest: data =>
    appOperation.post(`match/scoreboard-join`, data, CUSTOMER_TYPE),

  getMyScoreboardContests: matchId =>
    appOperation.get(`match/userScoreCard/${matchId}`, undefined, undefined, CUSTOMER_TYPE),

  getMyMatchesData: status =>
    appOperation.get(
      `match/list?status=${status}&limit=100&skip=0`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  createContest: newData =>
    appOperation.post(
      `match/usercontest/${newData?.matchid1}`,
      newData?.data1,
      CUSTOMER_TYPE,
    ),
  getMyCreateContest: id =>
    appOperation.get(
      `match/myusercontest/${id}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  joinContestUserPri: data =>
    appOperation.post(`match/joinuserContest`, data, CUSTOMER_TYPE),
  share_Team: data =>
    appOperation.get(`match/share-team/${data?.newId}/${data?.second}/${data?.matchid}`, undefined, undefined, CUSTOMER_TYPE),
  getMyShareCreateContest: (id, category) =>
    appOperation.get(
      `match/sharedcontest/${id}?contest_category_id=${category}`,
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),
  share_Team_Data: data =>
    appOperation.get(`match/matchedata/${data?.first}/${data?.second}`, undefined, undefined, CUSTOMER_TYPE),
  addharSendOtp: (data) =>
    appOperation.post(
      `user/addadharotp`, data, CUSTOMER_TYPE),
  updateSelfie: (data) =>
    appOperation.put(
      `user/updateselfie`, data, CUSTOMER_TYPE),
  adhaarOtpVerifiry: (data) =>
    appOperation.post(
      `user/verifyaadhar`, data, CUSTOMER_TYPE),
  emailOtpVerifiry: (data) =>
    appOperation.post(
      `verify_email`, data, CUSTOMER_TYPE),
  panVerifiyKyc: (data) =>
    appOperation.post(
      `user/pan_pro`, data, CUSTOMER_TYPE),
  dlVerifiyKyc: (data) =>
    appOperation.post(
      `user/dlverify`, data, CUSTOMER_TYPE),
  bankVerifiyKyc: (data) =>
    appOperation.post(
      `user/verifybankpenny`, data, CUSTOMER_TYPE),
  ifscVerifiyKyc: (data) =>
    appOperation.post(
      `user/checkifsc`, data, CUSTOMER_TYPE),
  deleteaccount: () =>
    appOperation.get(
      `user/bankdelete`, undefined, undefined, CUSTOMER_TYPE),
  deleteUpi: () =>
    appOperation.get(
      `user/upidelete`, undefined, undefined, CUSTOMER_TYPE),
  payout: (data) =>
    appOperation.post(
      `payment/withdraw`, data, CUSTOMER_TYPE),
    getBannerList: () => appOperation.get(`ViewBanner`, undefined, undefined, CUSTOMER_TYPE),
    getrefferalList: () => appOperation.get(`users/referals`, undefined, undefined, CUSTOMER_TYPE),
    createUserScoreCard: data =>
      appOperation.post(`match/createUserScoreCard`, data, CUSTOMER_TYPE),
    updateUserScoreCard: data =>
      appOperation.put(`match/updateUserScoreCard`, data, CUSTOMER_TYPE),
      getUserScoreCard: matchId =>
    appOperation.get(`match/userScoreCard/${matchId}`, undefined, undefined, CUSTOMER_TYPE),
  checkScoreboardContestJoined: (matchId, contestId) =>
    appOperation.get(`match/check-scoreboard-contest-joined/${matchId}/${contestId}`, undefined, undefined, CUSTOMER_TYPE),
  getScoreboardLeaderboard: data =>
    appOperation.post(`match/scoreboard-leaderboard`, data, CUSTOMER_TYPE),
  checkDuplicateTeams: data => {
    console.log('🎯 [API] checkDuplicateTeams called with:', data);
    console.log('🎯 [API] Making POST request to match/check-duplicate');
    return appOperation.post(`match/check-duplicate`, data, CUSTOMER_TYPE).then(response => {
      console.log('🎯 [API] checkDuplicateTeams response:', response);
      return response;
    }).catch(error => {
      console.error('🎯 [API] checkDuplicateTeams error:', error);
      
      // Handle the case where API returns 404 with "User teams not found"
      // This is actually a valid response indicating no teams are registered
      if (error?.code === 404 && error?.data?.includes('User teams not found')) {
        console.log('🎯 [API] No teams found for this contest - treating as success');
        return {
          success: true,
          data: [],
          message: 'No teams registered for this contest'
        };
      }
      
      throw error;
    });
  },
});
