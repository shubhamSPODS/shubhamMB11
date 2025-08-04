import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Dimensions,
  RefreshControl,
  FlatList,
  StatusBar,
  Platform,
  useWindowDimensions,
  Alert,
  Text,
} from 'react-native';

import FastImage from "@d11/react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACKOPACITY,
  BOLD,
  BROWNYELLOW,
  FIFTEEN,
  FORTEEN,
  GREEN,
  LATO_SEMI_BOLD,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  POPPINS_MEDIUM,
  TEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import LeaderBoardList from '../../components/leaderBoardList/LeaderBoardList';
import Winnings from '../../components/winnings/Winnings';
import { GLORY, SINGLE, WINNER, m } from '../../helper/image';
import NavigationService from '../../navigation/NavigationService';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { SELECT_PLAYER, UPLOAD_AADHAR, VERIFY_ADHAAR_SCREEN } from '../../navigation/routes';
import SelectScoreboard from '../../components/selectScoreboard/SelectScoreboard';
import {
  getAllPlayerList,
  getMyTeam,
  getTab,
  setAllPlayers,
  setIsContestEntry,
  setSelectedMatch,
} from '../../slices/matchSlice';
import CommonHeader from '../../components/matchCard/commonHeader/CommonHeader';
import { BASE_URL, numberWithCommas, toastAlert } from '../../helper/utility';
import Confirmation from '../../common/Confirmation';
import CommonImageBackground from '../../common/commonImageBackground';
import { NewColor, colors } from '../../theme/color';
import { LIGHTBLUE } from '../../common/AppText';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectTeam from '../../components/selectTeam/SelectTeam';
import { Screen, universalPaddingHorizontal } from '../../theme/dimens';
import { ScoreCard } from '../ScoreCard';
import PrimaryButton from '../../common/primaryButton';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { SpinnerSecond } from '../../common/SpinnerSecond';

const FirstRoute = ({ route }) => {
  const details = route?.route?.params?.details?.details;
  console.log('FirstRoute details:', details);
  
  // Add state variables to handle API response and loading
  const [contestDetails, setContestDetails] = useState(null);
  const [rankData, setRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get relevant IDs from the route params
  const matchId = route?.route?.params?.matchDetails?.MatchId;
  let contestCategoryId = details?.contest_category_id;
  const shadowContestId = details?.shadow_contest_id || details?.data?._id || details?.contest_details?.shadow_contest_id;
  
  // If contestCategoryId is not found, try to extract it from the contest data
  // Use the specific contest's contest_category_id from details, not a generic one
  if (!contestCategoryId) {
    contestCategoryId = details?.contest_category_id || details?.data?.contest_category_id;
    console.log('🎯 FirstRoute: Using specific contest contest_category_id:', contestCategoryId);
  }
  
  // Extract winning amount from multiple possible sources
  const winningAmount = Number(
    details?.winning_amount || 
    details?.contest_details?.winning_amount || 
    details?.data?.WinningAmount || 
    0
  );
  
  // Debug logging for ID extraction
  console.log('🎯 FirstRoute ID extraction:', {
    matchId,
    contestCategoryId,
    shadowContestId,
    winningAmount,
    detailsShadowContestId: details?.shadow_contest_id,
    detailsDataId: details?.data?._id,
    detailsContestDetailsShadowId: details?.contest_details?.shadow_contest_id,
    fullDetails: details
  });
  

  
  // Use existing contest details from the route params instead of making API call
  useEffect(() => {
    const processContestDetails = () => {
      try {
        setLoading(true);
        
        // First, check if rank data is already available in the details
        if (details?.Rankdata && Array.isArray(details.Rankdata) && details.Rankdata.length > 0) {
          console.log('Using rank data from details:', details.Rankdata);
          const formattedRankData = details.Rankdata.map(rank => ({
            ...rank,
            Price: Number(rank?.Price || 0),
            StartRank: Number(rank?.StartRank || 0),
            EndRank: Number(rank?.EndRank || 0),
          }));
          setRankData(formattedRankData);
          setContestDetails(details);
        } else if (details?.data && Array.isArray(details.data.Rankdata)) {
          const formattedRankData = details.data.Rankdata.map(rank => ({
            ...rank,
            Price: Number(rank?.Price || 0),
            StartRank: Number(rank?.StartRank || 0),
            EndRank: Number(rank?.EndRank || 0),
          }));
          setRankData(formattedRankData);
          setContestDetails(details.data);
        } else if (details?.contest_details?.winning_amount) {
          const fallbackRankData = [{
            Price: Number(details.contest_details.winning_amount),
            StartRank: 1,
            EndRank: 1,
            PercentageEach: 100,
            TotalPercentage: 100,
            TotalPrice: Number(details.contest_details.winning_amount),
            _id: 'fallback_rank'
          }];
          setRankData(fallbackRankData);
          setContestDetails({
            WinningAmount: Number(details.contest_details.winning_amount),
            Contestsize: details.Contestsize || 0,
            EnteryFee: details.EnteryFee || 0,
            Rankdata: fallbackRankData
          });
        } else {
          console.log('No rank data found in details, setting empty array');
          setRankData([]);
        }
      } catch (error) {
        console.error('Error processing contest details:', error);
        setRankData([]);
      } finally {
        setLoading(false);
      }
    };
    
    processContestDetails();
  }, [details]);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SpinnerSecond size="large" color={NewColor.brownYellow} />
      </View>
    );
  }
  
  console.log('Final rankData to render:', rankData);
  
  return (
    <View style={{flex: 1}}>
      <Winnings
        id={shadowContestId || contestDetails?._id}
        privateis={route?.route?.params?.privateis}
        notLive={route?.route?.params?.notLive}
        rankData={rankData}
        contestDetails={contestDetails}
      />
    </View>
  );
};

const SecondRoute = ({ route }) => {
  // Extract parameters from the route structure
  const routeParams = route?.route?.params || route?.params;
  const matchId = routeParams?.matchDetails?.MatchId || routeParams?.matchDetails?._id;
  let contestCategoryId = routeParams?.details?.details?.contest_category_id || 
                         routeParams?.details?.contest_category_id;
  let shadowContestId = routeParams?.details?.details?.shadow_contest_id || 
                         routeParams?.details?.shadow_contest_id;
  
  // Use the specific contest's contest_category_id from details, not a generic one
  if (!contestCategoryId) {
    contestCategoryId = routeParams?.details?.details?.contest_category_id || 
                       routeParams?.details?.contest_category_id;
    console.log('🎯 SecondRoute: Using specific contest contest_category_id:', contestCategoryId);
  }
  
  console.log('SecondRoute props:', { 
    matchId, 
    contestCategoryId, 
    routeParams,
    isScoreboardContest: routeParams?.details?.details?.contest_type === 'ScoreCard',
    routeStructure: {
      hasRouteRoute: !!route?.route,
      hasRouteParams: !!route?.params,
      routeRouteParams: route?.route?.params,
      routeParams: route?.params,
      detailsStructure: {
        hasDetails: !!routeParams?.details,
        hasDetailsDetails: !!routeParams?.details?.details,
        detailsKeys: routeParams?.details ? Object.keys(routeParams.details) : [],
        detailsDetailsKeys: routeParams?.details?.details ? Object.keys(routeParams.details.details) : []
      }
    }
  });
  
  // Check if this is a scoreboard contest
  const isScoreboardContest = 
    routeParams?.details?.details?.contest_type === 'ScoreCard' ||
    routeParams?.details?.details?.ContestType === 'ScoreCard' ||
    routeParams?.details?.details?.contest_type === 'Scoreboard' ||
    routeParams?.details?.details?.ContestType === 'Scoreboard';
  
  console.log('🎯 SecondRoute: Passing to LeaderBoardList:', {
    matchId,
    contestCategoryId,
    routeParamsDetails: routeParams?.details,
    routeParamsDetailsDetails: routeParams?.details?.details
  });

  return (
    <LeaderBoardList
      matchId={matchId}
      id={contestCategoryId}
      shadowContestId={shadowContestId}
      setForStatus={route?.setForStatus}
      forStatus={route?.forStatus}
      status={route?.status}
      selfCreateContest={routeParams?.selfCreateContest}
      userDataID={routeParams?.userData}
      useScoreboardApi={isScoreboardContest}
    />
  );
};

const ThirdRoute = ({ route }) => {
  // Extract parameters from the route structure
  const routeParams = route?.route?.params || route?.params;
  const matchId = routeParams?.matchDetails?.MatchId || routeParams?.matchDetails?._id;
  let contestCategoryId = routeParams?.details?.details?.contest_category_id || 
                         routeParams?.details?.contest_category_id;
  
  // Use the specific contest's contest_category_id from details, not a generic one
  if (!contestCategoryId) {
    contestCategoryId = routeParams?.details?.details?.contest_category_id || 
                       routeParams?.details?.contest_category_id;
    console.log('🎯 ThirdRoute: Using specific contest contest_category_id:', contestCategoryId);
  }
  
  console.log('ThirdRoute props:', { 
    matchId, 
    contestCategoryId, 
    routeParams,
    isScoreboardContest: routeParams?.details?.details?.contest_type === 'ScoreCard',
    routeStructure: {
      hasRouteRoute: !!route?.route,
      hasRouteParams: !!route?.params,
      routeRouteParams: route?.route?.params,
      routeParams: route?.params,
      detailsStructure: {
        hasDetails: !!routeParams?.details,
        hasDetailsDetails: !!routeParams?.details?.details,
        detailsKeys: routeParams?.details ? Object.keys(routeParams.details) : [],
        detailsDetailsKeys: routeParams?.details?.details ? Object.keys(routeParams.details.details) : []
      }
    }
  });
  
  // Create the proper route structure that ScoreCard expects
  const scoreCardRoute = {
    route: {
      params: {
        matchDetails: {
          MatchId: matchId
        },
        details: {
          contest_category_id: contestCategoryId
        }
      }
    }
  };
  
  return <ScoreCard route={scoreCardRoute} />;
};
const LeaderBoard = () => {
  const route = useRoute();
  const wsRefTwo = useRef(null);
  const dispatch = useDispatch();
  const details = route?.params?.details?.details ?? {};
  
  const contestDetails = {
    winning_amount: Number(
      details?.winning_amount || 
      details?.contest_details?.winning_amount || 
      details?.data?.WinningAmount || 
      0
    ),
    Contestsize: Number(
      details?.Contestsize || 
      details?.contest_details?.Contestsize || 
      details?.data?.Contestsize || 
      0
    ),
    joined: Number(
      details?.joined || 
      details?.contest_details?.joined || 
      0
    ),
    EnteryFee: Number(
      details?.EnteryFee || 
      details?.data?.EnteryFee || 
      0
    ),
    JoinWithMULT: details?.JoinWithMULT || details?.data?.JoinWithMULT || false,
    Winning_percent: Number(details?.Winning_percent || 0),
    Rankdata: details?.Rankdata || details?.data?.Rankdata || [],
    teams: Number(details?.teams || details?.data?.teams || 0),
    contest_type: details?.contest_type || details?.data?.contest_type || '',
    ContestType: details?.ContestType || details?.data?.ContestType || '',
    ...details 
  };
  

  const totalTeamCount = route?.params?.totalTeamCount ?? 0;
  const matchDetails = useSelector(state => state?.match?.contestData) ?? {};
  const myTeam = useSelector(state => state?.match?.myTeams) ?? [];
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  }) ?? {};
  const [activeTab, setActiveTab] = useState(1);
  const [isAdd, setIsAdd] = useState(false);
  const [forStatus, setForStatus] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [ForConnectedTo, setForConnectedTo] = useState(false);
  const [scoreBoard, setScoreBoard] = useState([]);
  const [TeamAScore, setTeamAScore] = useState([]);
  const [TeamBScore, setTeamBScore] = useState([]);
  const [modalRemove, setModalRemove] = useState(false);
  const [random, setRandom] = useState(10);
  const selectTeam = useRef();
  const selectScoreboard = useRef();
  const [saveTeamName, setSaveTeamName] = useState('');
  const { _id = '', SeriesId = '' } = matchDetails ?? {};
  const userData = useSelector(state => {
    return state.profile.userData;
  }) ?? {};

  // Extract parameters with better error handling - prioritize matchNo
  const matchId = matchDetails?.matchNo || 
                 route?.params?.matchDetails?.matchNo ||
                 route?.params?.matchDetails?.MatchId || 
                 route?.params?.matchDetails?._id ||
                 matchDetails?.MatchId ||
                 matchDetails?._id;
                 
  const contestCategoryId = route?.params?.details?.contest_category_id ||
                           route?.params?.details?.details?.contest_category_id ||
                           matchDetails?.contest_category_id;

  let url = `wss://app.mybattle11.com/leader-board?limit=10&skip=0&matchid=${matchId}&contest_category_id=${contestCategoryId}&user_id=${userData?._id || ''}`;
  let urlTwo = `wss://app.mybattle11.com/mainleaderboard?limit=10&skip=0&matchid=${matchId}&contest_category_id=${contestCategoryId}&user_id=${userData?._id || ''}`;
  

  useEffect(() => {
    if (matchId && contestCategoryId && userData?._id) {
      console.log('🎯 LeaderBoard: Setting up WebSocket connection with:', {
        matchId,
        contestCategoryId,
        userId: userData._id,
        url: urlTwo
      });
      
      wsRefTwo.current = new WebSocket(urlTwo);
      wsRefTwo.current.onopen = () => {
        console.log('🎯 LeaderBoard: WebSocket connected successfully');
        console.log('🎯 LeaderBoard: Connection details:', {
          readyState: wsRefTwo.current?.readyState,
          url: wsRefTwo.current?.url,
          protocol: wsRefTwo.current?.protocol
        });
      };
      wsRefTwo.current.onclose = e => {
        console.log('🎯 LeaderBoard: Connection Failed Plz Check Your Network', e);
        console.log('🎯 LeaderBoard: Close event details:', {
          code: e.code,
          reason: e.reason,
          wasClean: e.wasClean
        });
        wsRefTwo.current = new WebSocket(urlTwo);
      };
      wsRefTwo.current.onerror = e => {
        console.log('🎯 LeaderBoard: Something Went Wrong', e);
        console.log('🎯 LeaderBoard: Error event details:', e);
        wsRefTwo.current = new WebSocket(urlTwo);
      };
      return () => {
        if (wsRefTwo.current) {
          wsRefTwo.current.close();
        }
      };
    } else {
      console.log('🎯 LeaderBoard: Missing required parameters for WebSocket:', {
        hasMatchId: !!matchId,
        hasContestCategoryId: !!contestCategoryId,
        hasUserId: !!userData?._id
      });
    }
  }, [matchId, contestCategoryId, userData?._id]);
  const getData = React.useCallback(() => {
    if (isConnected && wsRefTwo.current) {
      wsRefTwo.current.close();
      setIsConnected(false);
    }
    try {
      wsRefTwo.current = new WebSocket(urlTwo);
      wsRefTwo.current.onopen = () => {
        setIsConnected(true);
      };
      if (!wsRefTwo.current) return;
      wsRefTwo.current.onmessage = e => {
        try {
          const parseData = JSON.parse(e?.data);   
          setScoreBoard(parseData?.score || []);
          setTeamAScore(parseData?.score?.[0]?.teama || []);
          setTeamBScore(parseData?.score?.[0]?.teamb || []);
        } catch (err) {
          console.error('Error parsing websocket data:', err);
          console.log('🎯 LeaderBoard: Raw WebSocket data that failed to parse:', e?.data);
        }
      };
    } catch (error) {
      console.error('Error in getData:', error);
    }
  }, [isConnected, urlTwo]);
  const reconnectWebSocket = () => {
    if (wsRefTwo.current && wsRefTwo.current.readyState !== WebSocket.OPEN) {
      wsRefTwo.current = new WebSocket(url);
      wsRefTwo.current.onopen = () => { };
      wsRefTwo.current.onclose = e => {
        reconnectWebSocket();
      };
      wsRefTwo.current.onerror = e => {
        reconnectWebSocket();
      };
      wsRefTwo.current.onmessage = e => {
        const parseData = JSON.parse(e?.data);
        setScoreBoard(parseData?.score);
        setTeamAScore(parseData && parseData?.score[0]?.teama);
        setTeamBScore(parseData && parseData?.score[0]?.teamb);
      };
    }
  };
  useEffect(() => {
    if (!ForConnectedTo) {
      getData();
      setForConnectedTo(true);
    } else {
      const interval = setInterval(() => {
        getData();
      }, 1000);
      return () => clearInterval(interval);
    }
  });


  const currentDate = new Date();
  const inputDate = new Date(matchDetails?.StartDateTime);

  const isPastTime = inputDate < currentDate;
  const onJoinContest = async () => {
    console.log('🔍 LeaderBoard onJoinContest called with:', {
      details,
      totalTeamCount,
      kycVerified: kycDetails?.adhar_verified,
      matchDetails
    });
    
    // Check if match is live and lineup is not out
    if (matchDetails?.Status === 'Live' && matchDetails?.game_state !== 2) {
      console.log('🚫 Blocking contest join - match is Live but lineup is not out');
      toastAlert.showToastError('Cannot join contest while match is live');
      return;
    }
    
    // Check if this is a scoreboard contest
    const isScoreboardContest = details?.ContestType === 'ScoreCard' || 
                                details?.contest_type === 'ScoreCard' ||
                                details?.ContestType === 'Scoreboard' ||
                                details?.contest_type === 'Scoreboard';
                                
    console.log('🎯 Checking if scoreboard contest in LeaderBoard:', {
      detailsContestType: details?.ContestType,
      detailsContestTypeLower: details?.contest_type,
      isScoreboardContest,
      fullDetails: details
    });
    
    if (kycDetails?.adhar_verified == 0) {
      // NavigationService.navigate(VERIFY_ADHAAR_SCREEN);
      NavigationService.navigate(UPLOAD_AADHAR);

      
    } else if (kycDetails?.adhar_verified == 2) {
      toastAlert.showToastError(
        'Your aadhaar verification is pending please wait',
      );
    } else {
      
      // Handle scoreboard contests differently
      if (isScoreboardContest) {
        console.log('🎯 This is a scoreboard contest - opening SelectScoreboard screen directly');
        dispatch(setSelectedMatch(details ? { ...details } : {}));
        
        // For scoreboard contests, always open the SelectScoreboard screen
        // The SelectScoreboard component will handle checking if user has scoreboards
        console.log('✅ Opening SelectScoreboard sheet for scoreboard contest');
        selectScoreboard?.current?.open();
        return;
      }
      
      // Original team-based contest logic
      console.log('🚀 Proceeding with team-based contest logic in LeaderBoard');
      
      if (totalTeamCount === 0) {
        console.log('📍 LeaderBoard Path: totalTeamCount === 0 - navigating to SELECT_PLAYER');
        dispatch(setAllPlayers([]));
        let data = { cid: matchDetails?.SeriesId };
        dispatch(getAllPlayerList(_id, data, false, {}, true));
        NavigationService.navigate(SELECT_PLAYER, {
          matchDetails: matchDetails || {},
          isEditMode: false,
        });
        dispatch(setIsContestEntry(true));
        dispatch(setSelectedMatch(details ? { ...details } : {}));
      } else if (totalTeamCount === 1) {
        if (details?.teamDetails?.length) {
          dispatch(setAllPlayers([]));
          let data = { cid: matchDetails?.SeriesId };
          let isNavigate = true;
          dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
          dispatch(setIsContestEntry(true));
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          NavigationService.navigate(SELECT_PLAYER, {
            matchDetails: matchDetails || {},
            isEditMode: false,
          });
        } else {
          dispatch(getMyTeam(_id));
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          setSaveTeamName(myTeam?.[0]?.name || '');
          setIsAdd(true);
        }
      } else if (totalTeamCount > 1) {
        if (details?.teamDetails?.length == myTeam?.length) {
          dispatch(setAllPlayers([]));
          let data = { cid: matchDetails?.SeriesId };
          let isNavigate = true;
          dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
          dispatch(setIsContestEntry(true));
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          NavigationService.navigate(SELECT_PLAYER, {
            matchDetails: matchDetails || {},
            isEditMode: false,
          });
        } else {
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          selectTeam?.current?.open();
        }
      }
    }
  };
  const sheet = useRef(null);
  const renderTop = () => {
    return (
      <View style={styles.container}>
        <CommonHeader
          allContest={true}
          style={{
            marginBottom: 0,
          }}
          walletIco={true}
          details={route?.params?.matchDetails}
          showPopup={() => sheet.current?.open()}
          activeTab={2}
          setActiveTab={e => setActiveTab(e)}
          completeMatch={
            route?.params?.matchDetails?.Status == 'Completed' ? true : false
          }
          setModalRemove={setModalRemove}
        />
        <>
          {isPastTime ? (
            <View
              style={{
                paddingHorizontal: universalPaddingHorizontal,
                flexDirection: 'row',
                justifyContent: 'space-between',
                // marginTop: -10,
                marginTop: 10,
                alignItems: 'center',
              }}>
              <View style={{ flex: 1 }}>
                <AppText weight={POPPINS_MEDIUM}>
                  {matchDetails?.TeamsShortNames[0]}
                </AppText>
                <AppText weight={POPPINS_MEDIUM}>
                  {TeamAScore && TeamAScore[0]?.scores_full
                    ? TeamAScore[0]?.scores_full
                    : 'Yet to bat'}
                </AppText>
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  flex: 1,
                }}>
                <AppText weight={POPPINS_MEDIUM}>
                  {matchDetails?.TeamsShortNames[1]}
                </AppText>
                <AppText style={{ textAlign: 'right' }} weight={POPPINS_MEDIUM}>
                  {TeamBScore && TeamBScore[0]?.scores_full
                    ? TeamBScore[0]?.scores_full
                    : 'Yet to bat'}
                </AppText>
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.contestDetails, { marginTop: 0 }]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <AppText type={TEN} color={BLACKOPACITY}>
                    PRIZE POOL
                  </AppText>
                  {contestDetails?.JoinWithMULT && (
                    <AppText type={TEN} color={BLACKOPACITY}>
                      Multiple Entries
                    </AppText>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 6,
                  }}>
                  <AppText type={FIFTEEN} weight={LATO_SEMI_BOLD}>
                    ₹{numberWithCommas(contestDetails?.winning_amount || 0)}
                  </AppText>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    style={{
                      width: `${Math.min(route?.params?.progressBarWidth || 0, 100)}%`,
                      height: '100%',
                      borderRadius: 4,
                    }}
                    start={{ x: 0, y: 0 }}
                    colors={['#DBA73E', '#E0C77D']}></LinearGradient>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <AppText color={BLACKOPACITY} type={TEN}>
                    {numberWithCommas(contestDetails?.Contestsize || 0)} spots
                  </AppText>
                  <AppText type={TEN} color={GREEN}>
                    {numberWithCommas(Math.max(0, (contestDetails?.Contestsize || 0) - (contestDetails?.joined || 0)))} spots left
                  </AppText>
                </View>
              </View>
              {isPastTime ? (
                <></>
              ) : contestDetails?.myContestIN ? (
                <></>
              ) : (
                <PrimaryButton
                  buttonStyle={{ paddingHorizontal: 20, marginBottom: 10 }}
                  onPress={onJoinContest}
                  title={'Join '}
                />
              )}
              <View style={styles.bottomContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.commonViewStyle}>
                    <FastImage
                      source={GLORY}
                      tintColor={colors.brownYellow}
                      style={styles.gloryIcon}
                    />
                    <AppText
                      color={BLACKOPACITY}
                      type={TEN}
                      weight={LATO_SEMI_BOLD}
                      style={styles.commonTextStyle}>
                      {contestDetails?.EnteryType !== 'Paid'
                        ? 'Glory awaits!'
                        : `₹${numberWithCommas(contestDetails?.Rankdata?.[0]?.Price || contestDetails?.winning_amount || 0)}`}
                    </AppText>
                  </View>
                  <View style={styles.commonViewStyle}>
                    <FastImage
                      source={WINNER}
                      tintColor={colors.brownYellow}
                      style={styles.gloryIcon}
                    />
                    <AppText
                      color={BLACKOPACITY}
                      type={TEN}
                      style={styles.commonTextStyle}>
                      {contestDetails?.Winning_percent ? contestDetails?.Winning_percent : 0}% Winners
                    </AppText>
                  </View>
                  <View style={styles.commonViewStyle}>
                    <FastImage
                      tintColor={'#DBA63D'}
                      source={contestDetails?.JoinWithMULT ? m : SINGLE}
                      resizeMode="contain"
                      style={styles.gloryIcon}
                    />
                    <AppText
                      color={BLACKOPACITY}
                      type={TEN}
                      style={styles.commonTextStyle}>
                      {contestDetails?.JoinWithMULT
                        ? `Upto ${contestDetails?.teams}`
                        : 'Single'}
                    </AppText>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      </View>
    );
  };

  const length = scoreBoard && scoreBoard[0]?.innings?.length;
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Winnings', route: route },
    {
      key: 'second',
      title: 'Leaderboard',
      route: route,
      forStatus: forStatus,
      setForStatus: setForStatus,
      status: route?.params?.matchDetails?.Status
    },
  ]);

  const [routes1] = React.useState([
    { key: 'first', title: 'Winnings', route: route },
    {
      key: 'second',
      title: 'Leaderboard',
      route: route,
      forStatus: forStatus,
      setForStatus: setForStatus,
      status: route?.params?.matchDetails?.Status

    },
    { key: 'third', title: 'Scorecard', route: route },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  const renderScore = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 3000);
  }, []);
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <View style={{ flex: 1 }}>
          {renderTop()}
          
          {/* Debug the scoreBoard condition */}
          {(() => {
            const shouldShowScorecard = scoreBoard && scoreBoard[0]?.status_note !== '';
            return shouldShowScorecard;
          })() ? (
            <>
              <TabView
                navigationState={{ index, routes: routes1 }}
                renderScene={renderScore}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                  <>
                  <RenderTabBar1
                    {...props}
                    onTabChange={e => {
                      setActiveTab(e);
                    }}
                  />
                  </>
                )}
              />
            
            </>
          ) : (
            <>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                  <RenderTabBar
                    {...props}
                    onTabChange={e => {
                      setActiveTab(e);
                    }}
                  />
                )}
              />
             
            </>
          )}
          {scoreBoard && scoreBoard[0]?.status_note == '' &&
            <View style={{ width: Screen.Width, height: "10%", marginBottom: 20, paddingHorizontal: 12 }}>
              <AppText type={TWELVE} color={BROWNYELLOW} weight={POPPINS_BOLD_ITALIC}>In case of tier for a position or a unfillled contest, the prize money may vary from initially stated amount. Moreover, the indian government mandates 30% TDS deduction on the
                Net winnings at the time of withdrawal from Skill Fantasy, as per the proposed section 194BA of the income tax Act, 1961
              </AppText>
            </View>}

            


        </View>
      </CommonImageBackground>
      <RBSheet
        ref={selectTeam}
        closeOnDragDown={false}
        openDuration={100}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            backgroundColor: NewColor.linerWhite,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}>
        <SelectTeam
          contestDetails={details}
          matchDetails={matchDetails}
          onClose={() => selectTeam?.current?.close()}
          selectTeam={selectTeam}
          teamDetails={details?.teamDetails}
          joinWith={details.teams}
          JoinWithMULT={details?.JoinWithMULT}
        />
      </RBSheet>
      
      <RBSheet
        ref={selectScoreboard}
        closeOnDragDown={false}
        openDuration={100}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            backgroundColor: NewColor.linerWhite,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}>
        <SelectScoreboard
          contestDetails={details}
          matchDetails={matchDetails}
          onClose={() => selectScoreboard?.current?.close()}
          selectScoreboard={selectScoreboard}
        />
      </RBSheet>
      
      <Confirmation
        isModalVisible={isAdd}
        details={details}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        teamLength={false}
        saveTeamName={saveTeamName}
        selectMulty={[]}
        JoinWithMULT={false}
      />
    </AppSafeAreaView>
  );
};

export default LeaderBoard;
export const RenderTabBar = props => {
  const { onTabChange } = props;

  return useMemo(
    () => (
      <TabBar
        {...props}
        onTabPress={e => {
          onTabChange(e?.route?.title);
        }}
        scrollEnabled={false}
        tabStyle={[{ flex: 1 }, props.tabStyle]}
        renderLabel={({ route, focused }) => (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AppText
              type={FORTEEN}
              color={focused ? BROWNYELLOW : WHITE}
              weight={POPPINS_MEDIUM}>
              {route?.title}
            </AppText>
            {focused ? (
              <LinearGradient
                style={{ height: 2, width: 125 }}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                  colors.playerDetailsLinerOne,
                  colors.playerDetailsLinerTwo,
                ]}
              />
            ) : (
              <View style={{ height: 2, width: 125 }} />
            )}
          </View>
        )}
        indicatorStyle={{ backgroundColor: 'transparent' }}
        pressColor={'transparent'}
        style={[{ width: '100%', backgroundColor: 'transparent', elevation: 0 }]}
      />


    ),
    [props], // dependencies
  );
};

export const RenderTabBar1 = props => {
  const { onTabChange } = props;

  return useMemo(
    () => (
      <>
      
      <TabBar
        {...props}
        onTabPress={e => {
          onTabChange(e?.route?.title);
        }}
        scrollEnabled={false}
        tabStyle={[{ flex: 1 }, props.tabStyle]}
        renderLabel={({ route, focused }) => (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AppText
              type={FORTEEN}
              color={focused ? BROWNYELLOW : WHITE}
              weight={POPPINS_MEDIUM}>
              {route?.title}
            </AppText>
            {focused ? (
              <LinearGradient
                style={{ height: 2, width: 125 }}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                  colors.playerDetailsLinerOne,
                  colors.playerDetailsLinerTwo,
                ]}
              />
            ) : (
              <View style={{ height: 2, width: 125 }} />
            )}
          </View>
        )}
        indicatorStyle={{ backgroundColor: 'transparent' }}
        pressColor={'transparent'}
        style={[{ width: '100%', backgroundColor: 'transparent', elevation: 0 }]}
      />

      </>
    ),
    [props], 
  );
};
