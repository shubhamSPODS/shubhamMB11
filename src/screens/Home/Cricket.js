import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import moment from 'moment';

const search = element => getDate(element).hour < 0;

// Helper function to sort matches by StartDateTime IST
const sortMatchesByStartDate = (matches) => {
  return matches.sort((a, b) => {
    const dateA = new Date(a?.StartDateTime);
    const dateB = new Date(b?.StartDateTime);
    return dateA - dateB; // Ascending order - earlier dates first
  });
};

// Debounce function to prevent rapid state updates
const debounce = (func, wait) => {
  let timeout;
  const debouncedFunc = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  // Add cancel method for cleanup
  debouncedFunc.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debouncedFunc;
};

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
  
  // Add state to track WebSocket connection status
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const teamsMatches = useMemo(() => {
      const filteredMatches = upcomingMatches.filter(match => match.teams && match.teams.length > 0);
      return sortMatchesByStartDate(filteredMatches);
  }, [upcomingMatches]);
  
  const scoreboardMatches = useMemo(() => {
      const filteredMatches = upcomingMatches.filter(match => match.scorecard && match.scorecard.length > 0);
      return sortMatchesByStartDate(filteredMatches);
  }, [upcomingMatches]);

  const getFilteredMatches = useCallback(() => {
    return index === 0 ? teamsMatches : scoreboardMatches;
  }, [index, teamsMatches, scoreboardMatches]);

  // Debounced function to update matches
  const debouncedSetUpComingMatches = useMemo(
    () => debounce((matches) => {
      dispatch(setUpComingMatches(matches));
    }, 300),
    [dispatch]
  );

  // Debounced function to update contest list
  const debouncedGetContestList = useMemo(
    () => debounce((contests, matchId) => {
      dispatch(getContestList(contests, matchId));
    }, 200),
    [dispatch]
  );

  useEffect(() => {
    if (_id && !isInitialized) {
      setIsInitialized(true);
      fetchData(false); 
    }
  }, [random, _id, isInitialized]);

  useEffect(() => {
    const interval = setInterval(() => {
      const itemIndex = upcomingMatches.findIndex(search);
      if (itemIndex !== -1 && upcomingMatches?.length !== 0) {
        const tempArray = [...upcomingMatches];
        tempArray?.splice(itemIndex, 1);
        debouncedSetUpComingMatches(tempArray);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingMatches, debouncedSetUpComingMatches]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsWebSocketConnected(false);
    };
  }, []);

  // Add cleanup for debounced functions
  useEffect(() => {
    return () => {
      // Clear any pending debounced calls
      if (debouncedSetUpComingMatches.cancel) {
        debouncedSetUpComingMatches.cancel();
      }
      if (debouncedGetContestList.cancel) {
        debouncedGetContestList.cancel();
      }
    };
  }, [debouncedSetUpComingMatches, debouncedGetContestList]);

  const fetchData = useCallback((showLoader = true) => {
    const URL = `wss://app.mybattle11.com/upcoming-matches?limit=20&skip=0&userid=${_id}`;
    
    if (showLoader) {
      setRefreshing(true);
      setRefreshingTwo(true);
    }
    
    // Properly close existing WebSocket connection
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    
    // Add delay to ensure previous connection is fully closed
    setTimeout(() => {
      try {
        wsRef.current = new WebSocket(URL);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connection established');
          setIsWebSocketConnected(true);
        };
        
        wsRef.current.onmessage = e => {
          try {
            const parseData = JSON.parse(e?.data);
              
            if (parseData?.upcoming) {
              console.log('🔍 Complete WebSocket Response:', JSON.stringify(parseData, null, 2));
              
              const filteredUpcoming = parseData.upcoming.filter(match => match.contestadded !== false);
              
              // Validate that we have valid match data before updating state
              if (!Array.isArray(filteredUpcoming) || filteredUpcoming.length === 0) {
                console.warn('⚠️ Received empty or invalid upcoming matches data');
                return;
              }
              
              // Additional validation: ensure matches have required fields
              const validMatches = filteredUpcoming.filter(match => 
                match && 
                match._id && 
                match.Team1vsTeam2 && 
                match.StartDateTime
              );
              
              if (validMatches.length === 0) {
                console.warn('⚠️ No valid matches found in filtered data');
                return;
              }
              
              console.log('✅ Valid matches found:', validMatches.length);
              
              // Process live matches for contest updates
              validMatches.forEach(match => {
                const isRainDelay = match.game_state === 4 || match.game_state === 11;
                const isPlayOngoing = match.game_state === 3;
                const isLiveMatch = match.Status === 'Live' || match.Status === 'live';
                
                if (isLiveMatch && isRainDelay) {
                  console.log(`🌧️ Rain delay detected for live match: ${match.Team1vsTeam2}`);
                  if (match.teams && match.teams.length > 0) {
                    const contests = match.teams.map(contest => ({
                      ...contest,
                      matchId: match._id,
                      matchName: match.Team1vsTeam2
                    }));
                    debouncedGetContestList(contests, match._id);
                  }
                  if (match.scorecard && match.scorecard.length > 0) {
                    const scoreboardContests = match.scorecard.map(contest => ({
                      ...contest,
                      matchId: match._id,
                      matchName: match.Team1vsTeam2
                    }));
                    debouncedGetContestList(scoreboardContests, match._id);
                  }
                }
                
                if (isLiveMatch && isPlayOngoing) {
                  console.log(`▶️ Play ongoing for live match: ${match.Team1vsTeam2}`);
                }
              });
              
              console.log('WebSocket upcoming matches:', {
                total: parseData.upcoming.length,
                filtered: filteredUpcoming.length,
                valid: validMatches.length,
                removed: parseData.upcoming.length - filteredUpcoming.length,
                sampleMatch: validMatches[0]
              });
              
              // Use debounced update to prevent rapid state changes
              debouncedSetUpComingMatches(validMatches);
              
              // Batch contest updates to prevent multiple rapid dispatches
              const contestUpdates = [];
              validMatches.forEach(match => {
                if (match.teams && match.teams.length > 0) {
                  const contests = match.teams.map(contest => ({
                    ...contest,
                    matchId: match._id,
                    matchName: match.Team1vsTeam2
                  }));
                  contestUpdates.push({ contests, matchId: match._id });
                }
                
                if (match.scorecard && match.scorecard.length > 0) {
                  const scoreboardContests = match.scorecard.map(contest => ({
                    ...contest,
                    matchId: match._id,
                    matchName: match.Team1vsTeam2
                  }));
                  contestUpdates.push({ contests: scoreboardContests, matchId: match._id });
                }
              });
              
              // Process contest updates in batches
              if (contestUpdates.length > 0) {
                // Use a single timeout to batch all contest updates
                setTimeout(() => {
                  contestUpdates.forEach(update => {
                    if (update.contests.length > 0) {
                      debouncedGetContestList(update.contests, update.matchId);
                    }
                  });
                }, 100);
              }
            }
            
            if (parseData?.mymatches) {
              dispatch(setMyMatchesHome(parseData.mymatches));
            }
          } catch (error) {
            console.log('Error parsing WebSocket data:', error);
            // Don't update state on parsing errors to prevent data loss
          } finally {
            setRefreshing(false);
            setRefreshingTwo(false);
          }
        };
        
        wsRef.current.onerror = e => {
          console.log('WebSocket error:', e);
          setIsWebSocketConnected(false);
          setRefreshing(false);
          setRefreshingTwo(false);
        };
        
        wsRef.current.onclose = e => {
          console.log('WebSocket closed:', e);
          setIsWebSocketConnected(false);
          setRefreshing(false);
          setRefreshingTwo(false);
        };
      } catch (error) {
        console.log('error', error);
        setIsWebSocketConnected(false);
        setRefreshing(false);
        setRefreshingTwo(false);
      }
    }, 100); // 100ms delay to ensure previous connection is closed
  }, [_id, dispatch, setRefreshingTwo, debouncedSetUpComingMatches, debouncedGetContestList]);

  // Remove the problematic useFocusEffect that was causing multiple contest list updates
  // This was causing race conditions when WebSocket reconnects

  const onRefresh = useCallback(() => {
    // Only refresh if WebSocket is not already connected
    if (!isWebSocketConnected) {
      fetchData(true);
    } else {
      // If already connected, just reset loading state
      setRefreshing(false);
      setRefreshingTwo(false);
    }
  }, [fetchData, isWebSocketConnected]);

  const onPressScoreboard = useCallback((item, currentTab) => {
   
    dispatch(setSelectedMatch(item));
    dispatch(setContestData(item));
                  
    const navigationParams = {
      matchId: item._id, 
      matchType: currentTab,
      TeamA: item.TeamA,
      TeamB: item.TeamB,
      isFromMyMatch: false,
      contestId: item.contestId,
    };
  
    NavigationService.navigate(MY_CONTEST, navigationParams);
  }, [dispatch]);

  const currentMatchesWithContests = useMemo(() => {
    const filteredMatches = getFilteredMatches();
    
    return filteredMatches.map(match => {
      const allContestsForMatch = contestList?.data || [];
      
    
      
      const flattenedContests = allContestsForMatch.reduce((acc, category) => {
        if (category?.data && Array.isArray(category.data)) {
          const contestsWithMatchId = category.data.map(contest => ({
            ...contest,
            matchid: match._id 
          }));
          acc.push(...contestsWithMatchId);
        }
        return acc;
      }, []);
      
      const alternativeContests = allContestsForMatch.reduce((acc, category) => {
        if (category && typeof category === 'object' && !Array.isArray(category)) {
          if (category.contest_category_id || category.winning_amount || category.WinningAmount) {
            acc.push({
              ...category,
              matchid: match._id
            });
          }
        }
        return acc;
      }, []);
      
      const allAvailableContests = [...flattenedContests, ...alternativeContests];
      
     
      const matchContests = allAvailableContests.filter(contest => 
        contest.matchid === match._id || 
        contest.matchId === match._id ||
        contest.match_id === match._id
      );
      
      let highestPaidContest = null;
      if (matchContests.length > 0) {
        highestPaidContest = matchContests.reduce((prev, current) => {
          const prevAmount = Number(prev?.winning_amount || prev?.WinningAmount || 0);
          const currentAmount = Number(current?.winning_amount || current?.WinningAmount || 0);
          return currentAmount > prevAmount ? current : prev;
        });
      }
      
      if (!highestPaidContest) {
        if (index === 0 && match.teams && match.teams.length > 0) {
          highestPaidContest = match.teams.reduce((prev, current) => {
            const prevEntryFee = Number(prev?.EntryFee || 0);
            const currentEntryFee = Number(current?.EntryFee || 0);
            return currentEntryFee > prevEntryFee ? current : prev;
          });
         
        } else if (index === 1 && match.scorecard && match.scorecard.length > 0) {
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
        teams: match.teams || [],
        scorecard: match.scorecard || [],
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