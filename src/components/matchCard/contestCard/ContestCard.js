import React, { useRef, useState, useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FIFTEEN,
  GREEN,
  LATO_BOLD,
  LATO_HEAVY,
  LATO_SEMI_BOLD,
  POPPINS_BOLD,
  POPPINS_EXTRA_BOLD_ITALIC,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  THIRTEEN,
  WHITE,
} from '../../../common/AppText';
import SelectTeam from '../../selectTeam/SelectTeam';
import SelectScoreboard from '../../selectScoreboard/SelectScoreboard';
import { GLORY, GURANTEE, SINGLE, WINNER, m } from '../../../helper/image';
import NavigationService from '../../../navigation/NavigationService';
import { ADDCASH_VERIFICATION, LEADERBOARD, MY_BALANCE, SELECT_PLAYER, VERIFY_ADHAAR_SCREEN } from '../../../navigation/routes';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPlayerList,
  getMyTeam,
  getTab,
  setAllPlayers,
  setIsContestEntry,
  setSelectedMatch,
} from '../../../slices/matchSlice';
import { numberWithCommas, toastAlert } from '../../../helper/utility';
import Confirmation from '../../../common/Confirmation';
import { NewColor, colors } from '../../../theme/color';
import { appOperation } from '../../../appOperation';

const ContestCard = ({ details, totalTeamCount, matchType }) => {
  if (!details) {
    console.log('Contest details:', details);
    return null;
  }

  const contestDetails = details?.contest_category_details?.find(
    cat => cat?._id === details?.contest_category_id
  ) || details;

  const [saveTeamName, setSaveTeamName] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [rankData, setRankData] = useState([]);
  const [isLoadingRankData, setIsLoadingRankData] = useState(false);

  const dispatch = useDispatch();
  const selectTeam = useRef();
  const selectScoreboard = useRef();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const contestData = useSelector(state => state?.match?.contestData);
  const { _id, SeriesId } = contestData ?? '';
  const { contestCategories } = useSelector(state => state.match);
  
  const contestSize = Number(contestDetails?.ContestSize || contestDetails?.Contestsize || 0);
  const joined = Number(details?.joined || 0);
  const percentage = (joined / (contestSize || 1)) * 100;
  const spotsLeft = Math.max(0, contestSize - joined);
  const winningAmount = Number(details?.winning_amount || contestDetails?.WinningAmount || 0);
  const entryFee = Number(details?.EntryFee || details?.EnteryFee || contestDetails?.EnteryFee || 0);
  const winningPercent = Number(contestDetails?.Winning_percent || 0);
  const firstPrize = Number(contestDetails?.Rankdata?.[0]?.Price || winningAmount || 0);

  // Fetch rank data if not available
  const fetchRankData = async () => {
    if (rankData.length > 0 || isLoadingRankData) return;
    
    const contestCategoryId = details?.contest_category_id;
    const matchId = contestData?._id;
    
    if (!contestCategoryId || !matchId) {
      console.log('Missing contestCategoryId or matchId for rank data fetch');
      return;
    }

    try {
      setIsLoadingRankData(true);
      console.log('Fetching rank data for contest:', { contestCategoryId, matchId });
      
      const response = await appOperation.customer.getContestDetailsWithRankData(matchId, contestCategoryId);
      
      if (response?.success && response?.data?.length > 0) {
        const contestWithRankData = response.data.find(
          contest => contest.contest_category_id === contestCategoryId || contest._id === contestCategoryId
        );
        
        if (contestWithRankData?.Rankdata?.length > 0) {
          const formattedRankData = contestWithRankData.Rankdata.map(rank => ({
            ...rank,
            Price: Number(rank?.Price || 0),
            StartRank: Number(rank?.StartRank || 0),
            EndRank: Number(rank?.EndRank || 0)
          }));
          setRankData(formattedRankData);
          console.log('Successfully fetched rank data:', formattedRankData);
        }
      }
    } catch (error) {
      console.error('Error fetching rank data:', error);
    } finally {
      setIsLoadingRankData(false);
    }
  };

  // Fetch rank data on component mount if not available
  useEffect(() => {
    const existingRankData = 
      details?.data?.Rankdata ||
      details?.Rankdata ||
      contestDetails?.Rankdata ||
      (contestCategories?.find(cat => cat?._id === details?.contest_category_id)?.Rankdata || []);

    if (existingRankData?.length > 0) {
      setRankData(existingRankData);
    } else {
      fetchRankData();
    }
  }, [details, contestCategories]);

  const onClickContest = () => {
    // Determine contest type and extract correct contest_category_id
    const isScoreboardContest = matchType === 'scoreboard' || 
                                details?.ContestType === 'ScoreCard' || 
                                details?.contest_type === 'ScoreCard' ||
                                contestDetails?.ContestType === 'ScoreCard' ||
                                contestDetails?.contest_type === 'ScoreCard';
    
    // Extract contest_category_id from the correct array based on contest type
    // Use the specific contest's contest_category_id, not a generic one
    let correctContestCategoryId = details?.contest_category_id || details?.data?.contest_category_id;
    
    
    console.log('Navigating to LEADERBOARD with:', {
      contestDetails: contestDetails,
      Rankdata: rankData,
      contest_category_id: correctContestCategoryId,
      isScoreboardContest,
      matchType
    });

    console.log('Available contestCategories:', contestCategories?.length);
    
    const contestCategory = contestCategories?.find(
      cat => cat?._id === correctContestCategoryId
    );
    
    // Use the fetched rank data or fallback to existing sources
    const finalRankData = rankData.length > 0 ? rankData : (
      details?.data?.Rankdata ||
      details?.Rankdata ||
      contestDetails?.Rankdata ||
      (contestCategory?.Rankdata || [])
    );

    const safeDetails = {
      ...details,
      contest_category_id: correctContestCategoryId || '',
      inner_data_id: details?.inner_data_id || '',
      winning_amount: winningAmount,
      joined: joined,
      Contestsize: contestSize,
      EnteryFee: entryFee,
      Rankdata: (finalRankData || []).map(rank => ({
        ...rank,
        Price: Number(rank?.Price || 0),
        StartRank: Number(rank?.StartRank || 0),
        EndRank: Number(rank?.EndRank || 0)
      })),
      JoinWithMULT: Boolean(details?.JoinWithMULT || contestDetails?.JoinWithMULT),
      teams: Number(details?.teams || contestDetails?.teams || 0),
      Winning_percent: winningPercent,
      shadow_contest_id: details?.shadow_contest_id || details?._id || '',
      contest_type: isScoreboardContest ? 'ScoreCard' : 'Teams',
      ContestType: isScoreboardContest ? 'ScoreCard' : 'Teams'
    };
    
    console.log('Final Rankdata being passed:', safeDetails.Rankdata?.length);
    
    console.log('Final contest details with Rankdata:', {
      rankData: safeDetails.Rankdata,
      length: safeDetails.Rankdata?.length
    });

    NavigationService.navigate(LEADERBOARD, {
      details: {
        details: safeDetails,
        match_contest_category_id: safeDetails.inner_data_id,
        winningsData: {
          totalWinnings: safeDetails.winning_amount,
          rankWinnings: safeDetails.Rankdata,
          winningPercent: safeDetails.Winning_percent
        }
      },
      firstTeamName: contestData?.TeamA || '',
      secondTeamName: contestData?.TeamB || '',
      progressBarWidth: percentage || 0,
      matchDetails: contestData || {},
      totalTeamCount: totalTeamCount || 0,
    });
  };

  const onJoinContest = async () => {
    console.log('🔍 ContestCard onJoinContest called with:', {
      matchType,
      contestDetails: details,
      totalTeamCount,
      kycVerified: contestData?.kycDetails?.adhar_verified
    });
    
    // Check if match is live and lineup is not out
    if (contestData?.Status === 'Live' && contestData?.game_state !== 2) {
      console.log('🚫 Blocking contest join - match is Live but lineup is not out');
      toastAlert.showToastError('Cannot join contest while match is live');
      return;
    }
    
    if (contestData?.kycDetails?.adhar_verified == 0) {
      NavigationService.navigate(VERIFY_ADHAAR_SCREEN)
    } else 
    if (contestData?.kycDetails?.adhar_verified == 2) {
      toastAlert.showToastError('Your aadhaar verification is pending please wait')
    } else {
      
      // Handle scoreboard contests differently
      const isScoreboardContest = matchType === 'scoreboard' || 
                                  details?.ContestType === 'ScoreCard' || 
                                  details?.contest_type === 'ScoreCard' ||
                                  contestDetails?.ContestType === 'ScoreCard' ||
                                  contestDetails?.contest_type === 'ScoreCard';
                                  
      console.log('🎯 Checking if scoreboard contest:', {
        matchType,
        detailsContestType: details?.ContestType,
        detailsContestTypeLower: details?.contest_type,
        contestDetailsContestType: contestDetails?.ContestType,
        contestDetailsContestTypeLower: contestDetails?.contest_type,
        isScoreboardContest,
        selectScoreboardRef: !!selectScoreboard?.current
      });
      
      if (isScoreboardContest) {
        console.log('🎯 Joining scoreboard contest - opening SelectScoreboard screen directly');
        dispatch(setSelectedMatch(details ? { ...details } : {}));
        
        // For scoreboard contests, always open the SelectScoreboard screen
        // The SelectScoreboard component will handle checking if user has scoreboards
        console.log('✅ Opening SelectScoreboard sheet for scoreboard contest');
        selectScoreboard?.current?.open();
        return;
      }
      
      // Original team-based contest logic
      console.log('🚀 Proceeding with team-based contest logic');
      
      if (totalTeamCount === 0) {
        console.log('📍 Path: totalTeamCount === 0 - navigating to SELECT_PLAYER');
        dispatch(setAllPlayers([]))
        let data = { cid: contestData?.SeriesId };
        dispatch(getAllPlayerList(_id, data, false, {}, true));
        NavigationService.navigate(SELECT_PLAYER, {
          matchDetails: contestData || {},
          isEditMode: false,
        });
        dispatch(setIsContestEntry(true));
        dispatch(setSelectedMatch(details ? { ...details } : {}));

      } else if (totalTeamCount === 1) {
        console.log('📍 Path: totalTeamCount === 1');
        if (details?.teamDetails?.length) {
          console.log('📍 Sub-path: has teamDetails - navigating to SELECT_PLAYER');
          dispatch(setAllPlayers([]))
          let data = { cid: contestData?.SeriesId };
          let isNavigate = true
          dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
          dispatch(setIsContestEntry(true));
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          NavigationService.navigate(SELECT_PLAYER, {
            matchDetails: contestData || {},
            isEditMode: false,
          });
        } else {
          console.log('📍 Sub-path: no teamDetails - showing confirmation');
          setIsAdd(true);
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          setSaveTeamName(myTeam?.[0]?.name || '')
        }
      }
      if (details?.teamDetails?.length == myTeam?.length) {
        console.log('📍 Path: teamDetails.length == myTeam.length - navigating to SELECT_PLAYER');
        dispatch(setAllPlayers([]))
        let data = { cid: contestData?.SeriesId };
        let isNavigate = true
        dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
        dispatch(setIsContestEntry(true));
        dispatch(setSelectedMatch(details ? { ...details } : {}));
        NavigationService.navigate(SELECT_PLAYER, {
          matchDetails: contestData || {},
          isEditMode: false,
        });
      } else {
        console.log('📍 Path: default else - opening selectTeam sheet');
        dispatch(setSelectedMatch(details ? { ...details } : {}));
        selectTeam?.current?.open();
      }
    }
  };

  let checkingMulty = details?.teamDetails?.filter((e) => {
    return e?.contest_category_id == details?.contest_category_id
  }) || [];
  
  let checkingTrue = checkingMulty?.length == details?.teams;
  return (
    <Pressable style={styles.container} onPress={onClickContest}>
      <View style={styles.topContainer}>
        <View style={styles.top}>
          <AppText type={TEN} weight={LATO_BOLD} color={WHITE}>
            PRIZE POOL
          </AppText>
          {details?.JoinWithMULT && (
            <AppText type={TEN} weight={LATO_BOLD} color={WHITE}>
              Multiple Entries
            </AppText>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText type={FIFTEEN} weight={LATO_HEAVY} color={WHITE}>
            ₹{numberWithCommas(winningAmount)}
          </AppText>
          <AppText
            type={TEN}
            color={WHITE}
            weight={LATO_BOLD}
            style={{
              marginLeft: 10,
              flex: 1,
              fontWeight: "500"
            }}>
            {winningPercent.toFixed(2)}% Winners l 1st ₹{numberWithCommas(firstPrize)}
          </AppText>
          <Pressable 
            style={[
              styles.bedge,
              contestSize === joined || details?.remove === true || checkingTrue 
                ? { opacity: 0.5 } 
                : {}
            ]} 
            onPress={contestSize === joined || details?.remove === true || checkingTrue ? null : onJoinContest}
          >
            <AppText
              numberOfLines={1}
              style={{ color: 'white', marginHorizontal: 5, marginTop: 0, fontWeight: "800" }}
              weight={LATO_BOLD}
              type={THIRTEEN}>
              ₹{numberWithCommas(entryFee)}
            </AppText>
          </Pressable>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            style={{ width: `${Math.min(percentage, 100)}%`, height: '100%', borderRadius: 4 }}
            start={{ x: 0, y: 0 }}
            colors={[
              "#DBA73E",
              "#E0C77D",
            ]}></LinearGradient>
        </View>
        <View style={styles.flex}>
          <AppText type={TEN}
            weight={POPPINS_MEDIUM}
            color={WHITE}>
            {`${numberWithCommas(contestSize)} spots`}
          </AppText>
          <AppText type={TEN} weight={LATO_BOLD} color={GREEN}>
            {`${numberWithCommas(spotsLeft)} spots left`}
          </AppText>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.commonViewStyle}>
            <FastImage tintColor={'#DBA63D'} source={GLORY} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={styles.commonTextStyle}>
              {details?.EntryType !== 'Paid' ||
                firstPrize === 0
                ? 'Glory awaits!'
                : `₹${numberWithCommas(firstPrize)}`}
            </AppText>
          </View>
          <View style={styles.commonViewStyle}>
            <FastImage tintColor={'#DBA63D'} source={WINNER} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={styles.commonTextStyle}>
              {winningPercent.toFixed(2)}% Winners
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              tintColor={'#DBA63D'}
              source={details?.JoinWithMULT ? m : SINGLE}
              resizeMode="contain"
              style={styles.gloryIcon}
            />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={[styles.commonTextStyle, {
                marginLeft: 4,
                fontWeight: '800'
              }]}>
              {' '}
              {details?.JoinWithMULT ? `Upto ${details?.teams}` : 'Single'}
            </AppText>
          </View>
        </View>
        {details?.ConfirmedWin && (
          <View style={styles.flex}>
            <FastImage tintColor={'#DBA63D'} source={GURANTEE} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              style={styles.commonTextStyle}>
              Guaranteed
            </AppText>
          </View>
        )}
      </View>
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
          matchDetails={contestData}
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
        onOpen={() => console.log('🎯 SelectScoreboard RBSheet opened')}
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
          matchDetails={contestData}
          onClose={() => selectScoreboard?.current?.close()}
          selectScoreboard={selectScoreboard}
        />
      </RBSheet>
      
      <Confirmation
        isModalVisible={isAdd}
        details={details}
        setIsModalVisible={setIsAdd}
        matchDetails={contestData}
        teamLength={false}
        saveTeamName={saveTeamName}
        selectMulty={[]}
        JoinWithMULT={false}
      />
    </Pressable>
  );
};

export default ContestCard;
