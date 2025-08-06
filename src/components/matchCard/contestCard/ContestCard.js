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
import { ADDCASH_VERIFICATION, LEADERBOARD, MY_BALANCE, SELECT_PLAYER, VERIFY_ADHAAR_SCREEN, SCOREBOARD_CREATE } from '../../../navigation/routes';
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

  const ContestCard = ({ details, totalTeamCount, matchType, matchDetails }) => {
  if (!details) {
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
  const contestData = useSelector(state => {
    const data = state?.match?.contestData;
    return data;
  });
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
  // Get JoinWithMULT and teams from the specific contest details
  const JoinWithMultiple = details?.JoinWithMULT || matchDetails?.contest_details?.find(
    contest => contest?.contest_category_id === details?.contest_category_id
  )?.JoinWithMULT || false;
  
  const totalMultipleTeams = details?.teams || matchDetails?.contest_details?.find(
    contest => contest?.contest_category_id === details?.contest_category_id
  )?.teams || 1;

  // Check if this contest supports multiple entries
  const supportsMultipleEntries = details?.ContestSize > 1 || 
                                 details?.Contestsize > 1 ||
                                 details?.JoinWithMULT === true ||
                                 contestDetails?.ContestSize > 1 ||
                                 contestDetails?.Contestsize > 1 ||
                                 contestDetails?.JoinWithMULT === true;

  // Check if this is a scoreboard contest
  const isScoreboardContest = matchType === 'scoreboard' || 
                              details?.ContestType === 'ScoreCard' || 
                              details?.contest_type === 'ScoreCard' ||
                              contestDetails?.ContestType === 'ScoreCard' ||
                              contestDetails?.contest_type === 'ScoreCard';

  // Fetch rank data if not available
  const fetchRankData = async () => {
    if (rankData.length > 0 || isLoadingRankData) return;
    
    const contestCategoryId = details?.contest_category_id;
    const matchId = contestData?._id;
    
    if (!contestCategoryId || !matchId) {
      return;
    }

    try {
      setIsLoadingRankData(true);
      
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
    
    
    const contestCategory = contestCategories?.find(
      cat => cat?._id === correctContestCategoryId
    );

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
      match_contest_category_id: details?._id || details?.match_contest_category_id || '', // This is the actual contest instance ID
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
      JoinWithMULT: JoinWithMultiple,
      teams: totalMultipleTeams,
      Winning_percent: winningPercent,
      shadow_contest_id: details?.shadow_contest_id || details?._id || '',
      contest_type: isScoreboardContest ? 'ScoreCard' : 'Teams',
      ContestType: isScoreboardContest ? 'ScoreCard' : 'Teams'
    };
    
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
    
    // Check if match is live and lineup is not out
    if (contestData?.Status === 'Live' && contestData?.game_state !== 2) {
      toastAlert.showToastError('Cannot join contest while match is live');
      return;
    }
    
    // Use utility function for consistent logging
    const aadharStatus = contestData?.kycDetails?.adhar_verified == 0 ? 'PENDING' : 'VERIFIED';
    
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
                                  
      if (isScoreboardContest) {
        dispatch(setSelectedMatch(details ? { ...details } : {}));
        
        // Check if user has already joined this contest with any scoreboard
        try {
          const matchId = contestData?._id;
          const contestId = details?._id;
          
          if (!matchId) {
            toastAlert.showToastError('Match information not found');
            return;
          }
          
          if (!contestId) {
            toastAlert.showToastError('Contest information not found');
            return;
          }
          
          // Note: checkScoreboardContestJoined API is not working (404 error), so we skip this check
          // and proceed directly to check for existing scoreboards
          
          // If not already joined, check if user has any scorecards for this match
          let response;
          try {
            response = await appOperation.customer.getUserScoreCard(matchId);
          } catch (error) {
            console.error('🎯 [JOIN CONTEST] Error calling getUserScoreCard:', error);
            // Try alternative API
            try {
              response = await appOperation.customer.getMyScoreboardContests(matchId);
            } catch (secondError) {
              console.error('🎯 [JOIN CONTEST] Error calling getMyScoreboardContests:', secondError);
              response = { success: false, data: [] };
            }
          }
          
          const hasScoreboards = response?.success && response?.data && response?.data.length > 0;
          
          if (hasScoreboards) {
            selectScoreboard?.current?.open();
          } else {
            // Navigate to create scorecard screen with contest details
            NavigationService.navigate(SCOREBOARD_CREATE, {
              ...contestData,
              isFromMyMatch: false,
              contestDetails: details,
              isFromJoinFlow: true, // Flag to indicate this is from join flow
            });
          }
        } catch (error) {
          console.error('Error checking scorecards:', error);
          // If error occurs, redirect to create scorecard screen
          NavigationService.navigate(SCOREBOARD_CREATE, {
            ...contestData,
            isFromMyMatch: false,
            contestDetails: details,
            isFromJoinFlow: true,
          });
        }
        return;
      }
      
      // Original team-based contest logic
      
      if (totalTeamCount === 0) {
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
        if (details?.teamDetails?.length) {
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
          setIsAdd(true);
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          setSaveTeamName(myTeam?.[0]?.name || '')
        }
      } else {
        // For multiple teams scenario
        
        // Check if this is a multiple entry contest
        const isMultipleEntryContest = JoinWithMultiple || details?.JoinWithMULT;
        
        if (isMultipleEntryContest) {
          // For multiple entry contests, always show team selection
          dispatch(setSelectedMatch(details ? { ...details } : {}));
          selectTeam?.current?.open();
        } else {
          // For single entry contests, check if user has used all teams
          if (details?.teamDetails?.length == myTeam?.length) {
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
            dispatch(setSelectedMatch(details ? { ...details } : {}));
            selectTeam?.current?.open();
          }
        }
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
          {(details?.JoinWithMULT || JoinWithMultiple) && (
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
              source={(details?.JoinWithMULT || JoinWithMultiple) ? m : SINGLE}
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
              {(details?.JoinWithMULT || JoinWithMultiple) ? `Upto ${totalMultipleTeams}` : 'Single'}
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
          totallMultipleTeams={totalMultipleTeams}
          JoinWithMULT={details?.JoinWithMULT || JoinWithMultiple}
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
          supportsMultipleEntries={supportsMultipleEntries}
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
        JoinWithMULT={JoinWithMultiple}
        isScoreboardContest={isScoreboardContest}
        supportsMultipleEntries={supportsMultipleEntries}
      />
    </Pressable>
  );
};

export default ContestCard;
