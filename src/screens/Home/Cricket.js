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
            console.log('🔍 Complete WebSocket Response:', JSON.stringify(parseData, null, 2));
            
            

            const filteredUpcoming = parseData.upcoming.filter(match => match.contestadded !== false);
            
            parseData.upcoming.forEach(match => {
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
            
            if (contestUpdates.length > 0) {
              contestUpdates.forEach(update => {
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

  useFocusEffect(
    useCallback(() => {
      upcomingMatches.forEach(match => {
        if (match.teams && match.teams.length > 0) {
          dispatch(getContestList(match.teams, match._id));
        }
        if (match.scorecard && match.scorecard.length > 0) {
          dispatch(getContestList(match.scorecard, match._id));
        }
      });
    }, [upcomingMatches, dispatch])
  );

  const onRefresh = useCallback(() => {
    fetchData(true); 
  }, [fetchData]);

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