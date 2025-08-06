import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import { appOperation } from '../../appOperation';

import {
  AppText,
  BLACK,
  BLACKOPACITY,
  EIGHT,
  EIGHTEEN,
  FIFTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TEN,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import {DUMMY_USER, PANT, UserIcon, persons} from '../../helper/image';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {colors} from '../../theme/color';
import {BASE_URL, IMAGE_BASE_URL, toastAlert} from '../../helper/utility';
import {getAllPlayerList, getOtherUserProfile} from '../../slices/matchSlice';
import {PLAYER_PREVIEW, PLAYER_PREVIEW_TWO} from '../../navigation/routes';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import NavigationService from '../../navigation/NavigationService';
import {Screen, flexOne} from '../../theme/dimens';
import { ActivityIndicator } from 'react-native-paper';

/**
 * @typedef {Object} LeaderBoardListProps
 * @property {string} matchId
 * @property {string} id
 * @property {string} [match_contest_category_id]
 * @property {any} forStatus
 * @property {Function} setForStatus
 * @property {boolean} selfCreateContest
 * @property {boolean} [useScoreboardApi]
 */

/**
 * @param {LeaderBoardListProps} props
 */
const LeaderBoardList = ({
  matchId,
  id,
  shadowContestId,
  match_contest_category_id = undefined,
  forStatus,
  setForStatus,
  selfCreateContest,
  useScoreboardApi = false,
}) => {
  console.log('[LEADERBOARD LIST DEBUG] Component initialized with:', {
    matchId,
    id,
    shadowContestId,
    match_contest_category_id,
    forStatus,
    selfCreateContest,
    useScoreboardApi,
  });

  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const contestData = useSelector(state => state?.match?.contestData);
  const [leaderBoards, setLeaderBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onRefresh, setOnrefresh] = useState(false);
  const [myDataleader, setMyDataleader] = useState([]);
  const [ForConnectedTo, setForConnectedTo] = useState(false);
  const [status, setStatus] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [withOutMatchStart, setWithOutMatchStart] = useState([]);
  const [limit, setLimit] = useState(50);
  const [skip, setSkip] = useState(0);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [wsConnectAttempted, setWsConnectAttempted] = useState(false);

  // Prioritize the specific contest's contest_category_id passed as 'id' prop
  const contestCategoryId = id || 
    (contestData && contestData.contest_category_id) || 
    null; 

  
  const validMatchContestCategoryId = match_contest_category_id ||
    (contestData && contestData.match_contest_category_id) ||
    contestCategoryId;

  // Use matchNo from contestData if available, otherwise fallback to other match IDs
  const validMatchId = contestData?.matchNo || matchId || contestData?._id;

  const url = contestCategoryId && validMatchId && userData?._id ? 
    `wss://app.mybattle11.com/leader-board?limit=${limit}&skip=${skip}&matchid=${validMatchId}&contest_category_id=${contestCategoryId}&user_id=${userData?._id}` : null;
  


  console.log(`🔗 WebSocket Leaderboard URL: ${url}`)

  const createFallbackData = () => {
    console.log('Creating fallback data since WebSocket data is empty');
    
    if (contestData?.joined > 0) {
      const fallbackPlayer = {
        _id: userData?._id || 'current-user',
        username: userData?.username || userData?.full_name || 'You',
        full_name: userData?.full_name || userData?.username || 'You',
        team_details: {
          name: 'Team 1',
          user_id: userData?._id,
          total_points: 0
        },
        rank: 1
      };
      
      console.log('Using fallback data for leaderboard:', fallbackPlayer);
      
      setLeaderBoards([fallbackPlayer]);
      setMyDataleader([fallbackPlayer]);
      
      setStatus('false');
      if (setForStatus) setForStatus('false');
    }
    
    setLoading(false);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('Timeout occurred after 3 seconds - showing fallback data');
        setTimeoutOccurred(true);
        createFallbackData();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (useScoreboardApi) return; // Bypass WebSocket logic if using REST API
    
    console.log('🔄 REST API useEffect triggered:', {
      hasId: !!id,
      hasMatchId: !!validMatchId,
      id,
      matchId: validMatchId,
      useScoreboardApi
    });
    
    if (validMatchId && contestCategoryId && !wsConnectAttempted) {
      setWsConnectAttempted(true);
      
      if (!url) {
        console.log('⚠️ Missing matchId or contestCategoryId - creating fallback data directly');
        createFallbackData();
        return;
      }
      try {
        console.log('🔌 Attempting to connect to WebSocket with URL:', url);
        wsRef.current = new WebSocket(url);
        wsRef.current.onopen = () => {
          console.log('✅ WebSocket connection opened successfully');
          setIsConnected(true);
        };
        wsRef.current.onmessage = e => {
          try {
            console.log('📩 WebSocket data received:', e?.data);
            const parseData = JSON.parse(e?.data);
            if (parseData?.data && Array.isArray(parseData?.data) && parseData.data.length > 0) {
              if (parseData?.live !== 'true') {
                const playersWithDefaultRank = parseData.data.map(player => ({
                  ...player,
                  rank: 1
                }));
                setLeaderBoards(playersWithDefaultRank);
              } else {
                setLeaderBoards(parseData.data);
              }
              setStatus(parseData?.live);
              if (setForStatus) setForStatus(parseData?.live);
            } else {
              console.log('⚠️ Empty or invalid data received from WebSocket');
              createFallbackData();
            }
          } catch (error) {
            console.log('❌ Error processing WebSocket message:', error);
            createFallbackData();
          } finally {
            setLoading(false);
          }
        };
        wsRef.current.onclose = e => {
          console.log('🔌 WebSocket connection closed with code:', e.code);
          setIsConnected(false);
          if (!timeoutOccurred && leaderBoards.length === 0) {
            createFallbackData();
          }
          setLoading(false);
        };
        wsRef.current.onerror = e => {
          console.log('❌ WebSocket error occurred');
          if (!timeoutOccurred && leaderBoards.length === 0) {
            createFallbackData();
          }
          setLoading(false);
        };
        return () => {
          if (wsRef.current) {
            wsRef.current.close();
          }
        };
      } catch (error) {
        createFallbackData();
        setLoading(false);
      }
    } else {
      if (!validMatchId || !contestCategoryId) {
        console.log('⚠️ Missing matchId or contestCategoryId - creating fallback data directly');
        createFallbackData();
      }
    }
  }, [useScoreboardApi, validMatchId, contestCategoryId]);

  // REST API fetch for Scoreboard Live match leaderboard
  useEffect(() => {
    console.log('[LEADERBOARD LIST DEBUG] REST API useEffect triggered:', {
      useScoreboardApi,
      matchId,
      id,
      hasMatchId: !!matchId,
      hasId: !!id,
    });

    if (useScoreboardApi && matchId && id) {
      console.log('[SCOREBOARD API] Starting API call with:', {
        matchId,
        contest_category_id: id
      });

      setLoading(true);
      const fetchLeaderboard = async () => {
        try {
          // Prepare request data
          const requestData = {
            matchid: matchId,
            contest_category_id: shadowContestId 
          };

          console.log('🎯 [SCOREBOARD LEADERBOARD API] Request:', {
            url: 'match/scoreboard-leaderboard',
            method: 'POST',
            data: requestData,
            matchId: matchId,
            contest_category_id: id,
            useScoreboardApi: useScoreboardApi
          });

          // For scoreboard API, we pass the shadow_contest_id as contest_category_id
          const response = await appOperation.customer.getScoreboardLeaderboard(requestData);

          console.log('🎯 [SCOREBOARD LEADERBOARD API] Response:', {
            success: response?.success,
            message: response?.message,
            dataLength: response?.data?.length || 0,
            data: response?.data,
            fullResponse: response
          });
          
          // Additional detailed logging for debugging
          console.log('🎯 [SCOREBOARD LEADERBOARD API] Detailed Response Analysis:', {
            responseType: typeof response,
            hasSuccess: 'success' in response,
            hasMessage: 'message' in response,
            hasData: 'data' in response,
            dataType: typeof response?.data,
            isDataArray: Array.isArray(response?.data),
            dataLength: response?.data?.length || 0,
            firstItem: response?.data?.[0],
            lastItem: response?.data?.[response?.data?.length - 1],
            responseKeys: Object.keys(response || {}),
            dataKeys: response?.data?.[0] ? Object.keys(response.data[0]) : []
          });

          if (response?.success) {
            console.log('🎯 [SCOREBOARD LEADERBOARD API] Setting leaderboard data:', {
              dataLength: response.data?.length || 0,
              firstItem: response.data?.[0],
              lastItem: response.data?.[response.data?.length - 1]
            });
            setLeaderBoards(response.data);
          } else {
            console.log('🎯 [SCOREBOARD LEADERBOARD API] API returned error:', {
              message: response?.message,
              success: response?.success,
              fullResponse: response
            });
            
            // Additional error logging
            console.log('🎯 [SCOREBOARD LEADERBOARD API] Error Analysis:', {
              errorType: typeof response,
              hasMessage: 'message' in response,
              hasSuccess: 'success' in response,
              messageValue: response?.message,
              successValue: response?.success,
              responseKeys: Object.keys(response || {}),
              fullErrorResponse: JSON.stringify(response, null, 2)
            });
          }
        } catch (error) {
          console.log('🎯 [SCOREBOARD LEADERBOARD API] Fetch error:', {
            error: error,
            message: error?.message,
            stack: error?.stack
          });
          
          // Additional catch error logging
          console.log('🎯 [SCOREBOARD LEADERBOARD API] Catch Error Analysis:', {
            errorType: typeof error,
            errorName: error?.name,
            errorMessage: error?.message,
            hasData: 'data' in error,
            errorData: error?.data,
            hasCode: 'code' in error,
            errorCode: error?.code,
            errorKeys: Object.keys(error || {}),
            fullErrorObject: JSON.stringify(error, null, 2)
          });
        } finally {
          setLoading(false);
        }
      };
      fetchLeaderboard();
    }
  }, [useScoreboardApi, matchId, id, shadowContestId]);

  useEffect(() => {
    let Mydata = leaderBoards?.map(item => {
      if (
        (item?.email && userData?.email && item.email === userData.email) ||
        (item?._id && userData?._id && item._id === userData._id) ||
        (item?.username && userData?.username && item.username === userData.username) ||
        (item?.full_name && userData?.full_name && item.full_name === userData.full_name) ||
        (item?.mobile_number && userData?.mobile_number && item.mobile_number === userData.mobile_number)
      ) {
        return item;
      }
      return {};
    });
    const filteredData = Mydata.filter(item => Object.keys(item).length !== 0);
    
    if (filteredData.length === 0 && contestData?.joined > 0) {
      const fallbackUserData = {
        _id: userData?._id || 'current-user',
        username: userData?.username || userData?.full_name || 'You',
        full_name: userData?.full_name || userData?.username || 'You',
        team_details: {
          name: 'Team 1',
          user_id: userData?._id,
          total_points: 0
        },
        rank: 1
      };
      filteredData.push(fallbackUserData);
    }
    
    setMyDataleader(filteredData);
  }, [leaderBoards, contestData?.joined]);
  
  const filteredArray = leaderBoards.filter(item => !Array.isArray(item));

  useEffect(() => {
    try {
      const filteredData = filteredArray.filter(item => {
        return !(
          (item?.email && userData?.email && item.email === userData.email) ||
          (item?._id && userData?._id && item._id === userData._id) ||
          (item?.username && userData?.username && item.username === userData.username) ||
          (item?.full_name && userData?.full_name && item.full_name === userData.full_name) ||
          (item?.mobile_number && userData?.mobile_number && item.mobile_number === userData.mobile_number)
        );
      });
      setWithOutMatchStart(filteredData);
    } catch (e) {
      console.log('Error filtering leaderboard data:', e);
      setWithOutMatchStart([]);
    }
  }, [leaderBoards, userData]);
  
  const playerPreview = (teamPlayer, full_name, teamname, total_points) => {
    toastAlert.showToastError(
      'Team details will be available once the match starts'
    );
  };

  const renderLeaderBoard = ({item, index}) => {
    if (!item) return null;
    
    // Safely get user and team names
    const username = item?.username || item?.full_name || 'Unknown User';
    const teamName = item?.team_details?.name || 'Team 1';
    
    // Handle prediction names for scoreboard contests
    let displayName = username;
    if (item?.predictionNames && Array.isArray(item.predictionNames) && item.predictionNames.length > 0) {
      // For scoreboard contests, show username + prediction names
      const predictionNames = item.predictionNames.join(', ');
      displayName = `${username} (${predictionNames})`;
    } else {
      // For regular team contests, show username + team name
      displayName = `${username} (${teamName})`;
    }
    
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => playerPreview(item?.team_details, username, teamName, 0)}
        style={[
          styles.leaderBoardContainer,
          {
            backgroundColor: index % 2 === 0 ? '#343434' : null,
            borderBottomWidth: 1,
            borderBottomColor: colors.lightgry,
          },
        ]}>
        <View style={styles.underView}>
          <TouchableOpacity>
            <FastImage
              style={styles.userImg}
              resizeMode="contain"
              source={UserIcon}
            />
          </TouchableOpacity>
          <View style={{flex: 1.4, marginLeft: 6}}>
            <AppText>
              {displayName}
            </AppText>
            {(
              (item?.email && userData?.email && item.email === userData.email) ||
              (item?._id && userData?._id && item._id === userData._id) ||
              (item?.username && userData?.username && item.username === userData.username) ||
              (item?.full_name && userData?.full_name && item.full_name === userData.full_name) ||
              (item?.mobile_number && userData?.mobile_number && item.mobile_number === userData.mobile_number)
            ) && (
              <AppText
                type={TEN}
                weight={POPPINS_MEDIUM}
                style={{color: '#00B81C'}}>
                Your team
              </AppText>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
              {item?.team_details?.total_points || item?.totalPoints || 0}
            </AppText>
            <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
              # {item?.rank || 1}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const mydataleaderboard = () => {
    return (
      myDataleader &&
      myDataleader.length > 0 &&
      myDataleader.map((item, index) => {
        if (!item) return null;
        
        // Get user and team names safely
        const username = item?.username || item?.full_name || 'You';
        const teamName = item?.team_details?.name || 'Team 1';
        
        // Handle prediction names for scoreboard contests
        let displayName = username;
        if (item?.predictionNames && Array.isArray(item.predictionNames) && item.predictionNames.length > 0) {
          // For scoreboard contests, show username + prediction names
          const predictionNames = item.predictionNames.join(', ');
          displayName = `${username} (${predictionNames})`;
        } else {
          // For regular team contests, show username + team name
          displayName = `${username} (${teamName})`;
        }
        
        return (
          <TouchableOpacity
            key={`my-team-${index}`}
            activeOpacity={1}
            style={[
              styles.leaderBoardContainer,
              {
                backgroundColor: '#343434',
                borderBottomWidth: 1,
                borderBottomColor: colors.lightgry,
              },
            ]}
            onPress={() => playerPreview(null, username, teamName, 0)}>
            <View style={styles.underView}>
              <TouchableOpacity>
                <FastImage
                  style={styles.userImg}
                  resizeMode="contain"
                  source={UserIcon}
                />
              </TouchableOpacity>
              <View style={{flex: 1.4, marginLeft: 6}}>
                <AppText>
                  {displayName}
                </AppText>
                <AppText
                  type={TEN}
                  weight={POPPINS_MEDIUM}
                  style={{color: '#00B81C'}}>
                  Your team
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
                  {item?.team_details?.total_points || item?.totalPoints || 0}
                </AppText>
                <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
                  # {item?.rank || 1}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        );
      })
    );
  };

  return (
    <>
      <View style={styles.head}>
        <AppText
          weight={SEMI_BOLD}
          type={TEN}
          style={{
            color: 'white',
            flex: 2,
          }}>
          {`Team Name`}
        </AppText>
        <AppText style={{flex: 1}} color={WHITE} type={TEN}>
          Points
        </AppText>
        <AppText color={WHITE} type={TEN}>
          Rank
        </AppText>
      </View>
      {loading ? (
        <SpinnerSecond loading />
      ) : (
        <>
          {filteredArray?.length > 0 ? (
            <FlatList
              data={withOutMatchStart || filteredArray}
              renderItem={renderLeaderBoard}
              keyExtractor={(item, index) => index?.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={mydataleaderboard}
            />
          ) : contestData?.joined > 0 ? (
            <View style={{padding: 20}}>
              <AppText
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                }}
                color={WHITE}
                weight={POPPINS_MEDIUM}>
                You have joined this contest.
                {'\n'}
                Waiting for other players to join.
              </AppText>
              
              {/* Show user's team details */}
              {myDataleader && myDataleader.length > 0 ? (
                myDataleader.map((item, index) => renderLeaderBoard({item, index}))
              ) : (
                <FlatList
                  data={[{
                    _id: userData?._id || 'current-user',
                    username: userData?.username || userData?.full_name || 'You',
                    team_details: { name: 'Team 1', total_points: 0 },
                    rank: 1
                  }]}
                  renderItem={renderLeaderBoard}
                  keyExtractor={(item) => item._id || 'user-team'}
                />
              )}
            </View>
          ) : (
            <AppText
              style={{
                textAlign: 'center',
                marginTop: '20%',
              }}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}>
              No other team has joined this contest
            </AppText>
          )}
        </>
      )}
    </>
  );
};

export default LeaderBoardList;
