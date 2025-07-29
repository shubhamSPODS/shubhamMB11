import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppText,
  EIGHTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  WHITE,
} from '../../common/AppText';
import MatchCard from '../../components/matchCard/MatchCard';
import ViewAll from '../../components/matchCard/viewAll/ViewAll';
import Matchsection, { getDate } from './Matchsection';
import { BOTTOM_TAB_CONTEST_SCREEN, MY_CONTEST } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { setMyMatchesHome, setUpComingMatches, getContestList, setSelectedMatch, setContestData } from '../../slices/matchSlice';
import { KeyBoardAware } from '../../common/KeyboardAware';
import { BASE_URL } from '../../helper/utility';
import { TabView, TabBar } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/color';

const search = element => getDate(element).hour < 0;

const MemoizedMatchCard = React.memo(({ item, route, onPressScoreboard }) => (
  <MatchCard 
    key={`${route.key}-${item._id}`}
    details={item} 
    matchType={route.key}
    isFromMyMatch={false}
    isHome={true}
    onPressScoreboard={() => onPressScoreboard(item, route.key)}
  />
));

const TabContent = React.memo(({ 
  route, 
  matchesWithContests, 
  refershing, 
  onRefresh, 
  onPressScoreboard 
}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
      }
      style={styles.flatlistContainer}
      contentContainerStyle={styles.scrollContent}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
    >
      {matchesWithContests?.length > 0 ? (
        matchesWithContests.map((item) => (
          <MemoizedMatchCard 
            key={`${route.key}-${item._id}`}
            item={item}
            route={route}
            onPressScoreboard={onPressScoreboard}
          />
        ))
      ) : (
        <View style={styles.noMatchesContainer}>
          <AppText type={EIGHTEEN} weight={POPPINS_MEDIUM} color={WHITE}>
            No matches available
          </AppText>
        </View>
      )}
    </ScrollView>
  );
});

const Cricket = ({ random, setRefreshingTwo }) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const upcomingMatches = useSelector(state => state.match.upcomingMatches);
  const myMatchesHome = useSelector(state => state.match.myMatchesHome);
  const contestList = useSelector(state => state.match.contestList);
  
  const userData = useSelector(state => state.profile.userData);
  const layout = useWindowDimensions();
  
  const { _id } = userData ?? '';
  const [refershing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'teams', title: 'Teams'},
    {key: 'scoreboard', title: 'Scoreboard'},
  ]);

  const teamsMatches = useMemo(() => {
      return upcomingMatches.filter(match => match.teams && match.teams.length > 0);
  }, [upcomingMatches]);
  
  const scoreboardMatches = useMemo(() => {
      return upcomingMatches.filter(match => match.scorecard && match.scorecard.length > 0);
  }, [upcomingMatches]);

  const getFilteredMatches = useCallback(() => {
    return index === 0 ? teamsMatches : scoreboardMatches;
  }, [index, teamsMatches, scoreboardMatches]);

  useEffect(() => {
    if (_id) {
      fetchData(false); 
    }
  }, [random, _id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const itemIndex = upcomingMatches.findIndex(search);
      if (itemIndex !== -1 && upcomingMatches?.length !== 0) {
        const tempArray = [...upcomingMatches];
        tempArray?.splice(itemIndex, 1);
        dispatch(setUpComingMatches(tempArray));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingMatches, dispatch]);

  const fetchData = useCallback((showLoader = true) => {
    const URL = `wss://app.mybattle11.com/upcoming-matches?limit=20&skip=0&userid=${_id}`;
    
    if (showLoader) {
    setRefreshing(true);
    setRefreshingTwo(true);
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    
    try {
      wsRef.current = new WebSocket(URL);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      wsRef.current.onmessage = e => {
        try {
        const parseData = JSON.parse(e?.data);
          
          if (parseData?.upcoming) {
            // Log complete WebSocket response for debugging
            console.log('🔍 Complete WebSocket Response:', JSON.stringify(parseData, null, 2));
            
            // Log each match's contestadded status and game state
            parseData.upcoming.forEach((match, index) => {
              console.log(`📊 Match ${index + 1}:`, {
                id: match._id,
                name: match.Team1vsTeam2,
                contestadded: match.contestadded,
                game_state: match.game_state,
                game_state_str: match.game_state_str,
                hasTeams: !!match.teams,
                teamsLength: match.teams?.length,
                hasScorecard: !!match.scorecard,
                scorecardLength: match.scorecard?.length
              });
            });
            
            // Filter out matches where contestadded is false
            const filteredUpcoming = parseData.upcoming.filter(match => match.contestadded !== false);
            
            // Handle game state changes for live matches
            parseData.upcoming.forEach(match => {
              const isRainDelay = match.game_state === 4 || match.game_state === 11;
              const isPlayOngoing = match.game_state === 3;
              const isLiveMatch = match.Status === 'Live' || match.Status === 'live';
              
              console.log(`🎮 Game State for ${match.Team1vsTeam2}:`, {
                game_state: match.game_state,
                game_state_str: match.game_state_str,
                isRainDelay,
                isPlayOngoing,
                isLiveMatch,
                Status: match.Status
              });
              
              // If it's a live match with rain delay, restart contest joining
              if (isLiveMatch && isRainDelay) {
                console.log(`🌧️ Rain delay detected for live match: ${match.Team1vsTeam2}`);
                // Restart contest joining for this match
                if (match.teams && match.teams.length > 0) {
                  const contests = match.teams.map(contest => ({
                    ...contest,
                    matchId: match._id,
                    matchName: match.Team1vsTeam2
                  }));
                  dispatch(getContestList(contests, match._id));
                }
                if (match.scorecard && match.scorecard.length > 0) {
                  const scoreboardContests = match.scorecard.map(contest => ({
                    ...contest,
                    matchId: match._id,
                    matchName: match.Team1vsTeam2
                  }));
                  dispatch(getContestList(scoreboardContests, match._id));
                }
              }
              
              // If play is ongoing, log the status
              if (isLiveMatch && isPlayOngoing) {
                console.log(`▶️ Play ongoing for live match: ${match.Team1vsTeam2}`);
              }
            });
            
            console.log('WebSocket upcoming matches:', {
              total: parseData.upcoming.length,
              filtered: filteredUpcoming.length,
              removed: parseData.upcoming.length - filteredUpcoming.length,
              sampleMatch: parseData.upcoming[0]
            });
            
            dispatch(setUpComingMatches(filteredUpcoming));
            
            const contestUpdates = [];
            filteredUpcoming.forEach(match => {
              // Fetch contests for matches with teams data
              if (match.teams && match.teams.length > 0) {
                const contests = match.teams.map(contest => ({
                  ...contest,
                  matchId: match._id,
                  matchName: match.Team1vsTeam2
                }));
                contestUpdates.push({ contests, matchId: match._id });
              }
              
              // Also fetch contests for matches with scorecard data
              if (match.scorecard && match.scorecard.length > 0) {
                const scoreboardContests = match.scorecard.map(contest => ({
                  ...contest,
                  matchId: match._id,
                  matchName: match.Team1vsTeam2
                }));
                contestUpdates.push({ contests: scoreboardContests, matchId: match._id });
              }
            });
            
            if (contestUpdates.length > 0) {
              contestUpdates.forEach(update => {
                // Only call getContestList if we have actual contest data
                if (update.contests.length > 0) {
                  dispatch(getContestList(update.contests, update.matchId));
                }
              });
            }
          }
          
          if (parseData?.mymatches) {
            dispatch(setMyMatchesHome(parseData.mymatches));
        }
        } catch (error) {
          console.log('Error parsing WebSocket data:', error);
        } finally {
        setRefreshing(false);
        setRefreshingTwo(false);
        }
      };
      
      wsRef.current.onerror = e => {
        console.log('WebSocket error:', e);
        setRefreshing(false);
        setRefreshingTwo(false);
      };
      
      wsRef.current.onclose = e => {
        setRefreshing(false);
        setRefreshingTwo(false);
      };
    } catch (error) {
      console.log('error', error);
      setRefreshing(false);
      setRefreshingTwo(false);
    }
  }, [_id, dispatch, setRefreshingTwo]);

  const onRefresh = useCallback(() => {
    fetchData(true); 
  }, [fetchData]);

  const onPressScoreboard = useCallback((item, currentTab) => {
   
    dispatch(setSelectedMatch(item));
    dispatch(setContestData(item));
                  
    const navigationParams = {
      matchId: item._id, // This is the correct matchId for scoreboard matches
      matchType: currentTab,
      TeamA: item.TeamA,
      TeamB: item.TeamB,
      isFromMyMatch: false,
      contestId: item.contestId,
    };
  
                  
    console.log('🎯 Navigating to MY_CONTEST from Cricket.js');
    NavigationService.navigate(MY_CONTEST, navigationParams);
  }, [dispatch]);

  const currentMatchesWithContests = useMemo(() => {
    const filteredMatches = getFilteredMatches();
    
    return filteredMatches.map(match => {
      // Get all contests for this match from the Redux store
      const allContestsForMatch = contestList?.data || [];
      
    
      
      // Flatten the contest data structure and filter by match ID
      const flattenedContests = allContestsForMatch.reduce((acc, category) => {
        if (category?.data && Array.isArray(category.data)) {
          // Add matchId to each contest for proper filtering
          const contestsWithMatchId = category.data.map(contest => ({
            ...contest,
            matchid: match._id // Ensure matchid is set for filtering
          }));
          acc.push(...contestsWithMatchId);
        }
        return acc;
      }, []);
      
      // Also check if contests are stored in a different structure
      const alternativeContests = allContestsForMatch.reduce((acc, category) => {
        if (category && typeof category === 'object' && !Array.isArray(category)) {
          // Check if this category has contest data directly
          if (category.contest_category_id || category.winning_amount || category.WinningAmount) {
            acc.push({
              ...category,
              matchid: match._id
            });
          }
        }
        return acc;
      }, []);
      
      // Combine both flattened and alternative contests
      const allAvailableContests = [...flattenedContests, ...alternativeContests];
      
     
      // Filter contests for this specific match
      const matchContests = allAvailableContests.filter(contest => 
        contest.matchid === match._id || 
        contest.matchId === match._id ||
        contest.match_id === match._id
      );
      
      // Find the highest paid contest from Redux store
      let highestPaidContest = null;
      if (matchContests.length > 0) {
        highestPaidContest = matchContests.reduce((prev, current) => {
          const prevAmount = Number(prev?.winning_amount || prev?.WinningAmount || 0);
          const currentAmount = Number(current?.winning_amount || current?.WinningAmount || 0);
          return currentAmount > prevAmount ? current : prev;
        });
      }
      
      // Fallback to original teams/scorecard data based on current tab
      if (!highestPaidContest) {
        if (index === 0 && match.teams && match.teams.length > 0) {
          // For Teams tab, use teams data
          highestPaidContest = match.teams.reduce((prev, current) => {
            const prevEntryFee = Number(prev?.EntryFee || 0);
            const currentEntryFee = Number(current?.EntryFee || 0);
            return currentEntryFee > prevEntryFee ? current : prev;
          });
         
        } else if (index === 1 && match.scorecard && match.scorecard.length > 0) {
          // For Scoreboard tab, use scorecard data
          highestPaidContest = match.scorecard.reduce((prev, current) => {
            const prevEntryFee = Number(prev?.EntryFee || 0);
            const currentEntryFee = Number(current?.EntryFee || 0);
            return currentEntryFee > prevEntryFee ? current : prev;
          });
         
        }
      }
      
      
      
      return {
        ...match,
        contest_details: highestPaidContest ? [highestPaidContest] : [],
        teams: match.teams || [], // Keep original teams data for fallback
        scorecard: match.scorecard || [], // Keep original scorecard data for fallback
      };
    });
  }, [getFilteredMatches, contestList?.data, index]);

  const renderScene = useCallback(({route}) => {
    return (
      <TabContent
        route={route}
        matchesWithContests={currentMatchesWithContests}
        refershing={refershing}
        onRefresh={onRefresh}
        onPressScoreboard={onPressScoreboard}
      />
    );
  }, [currentMatchesWithContests, refershing, onRefresh, onPressScoreboard]);

  const renderTabBar = useCallback(props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.playerDetailsLinerOne,
        height: 3,
        borderRadius: 3,
      }}
      style={{
        backgroundColor: 'transparent',
        elevation: 0,
        marginHorizontal: universalPaddingHorizontal,
        height: 45,
        marginVertical: 10,
      }}
      renderLabel={({route, focused}) => (
          <View style={{width: '100%', alignItems: 'center'}}>
            <AppText
              type={EIGHTEEN}
              weight={POPPINS_SEMI_BOLD}
              color={WHITE}
              style={{fontSize: 16}}>
              {route.title}
            </AppText>
          </View>
      )}
      pressColor="transparent"
      tabStyle={{borderRadius: 0}}
    />
  ), []);



  const handleIndexChange = useCallback((newIndex) => {
    setIndex(newIndex);
  }, []);

  const tabViewConfig = useMemo(() => ({
    navigationState: { index, routes },
    renderScene,
    onIndexChange: handleIndexChange,
    initialLayout: { width: layout.width },
    renderTabBar,
    lazy: true,
    lazyPreloadDistance: 1,
    swipeEnabled: true,
    style: styles.tabView
  }), [index, routes, renderScene, handleIndexChange, layout.width, renderTabBar]);

  return (
    <View style={styles.container}>
      <AppText
        style={{
          marginTop: 20,
          marginHorizontal: universalPaddingHorizontal,
        }}
        type={EIGHTEEN}
        weight={POPPINS_SEMI_BOLD} color={WHITE}>
        Upcoming Matches
      </AppText>
      
      <TabView {...tabViewConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flatlistContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: universalPaddingHorizontal,
    paddingBottom: 20,
  },
  tabView: {
    flex: 1,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default React.memo(Cricket);