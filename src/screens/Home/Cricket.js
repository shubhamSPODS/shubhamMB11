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
            dispatch(setUpComingMatches(parseData.upcoming));
            
            const contestUpdates = [];
            parseData.upcoming.forEach(match => {
            if (match.teams && match.teams.length > 0) {
              const contests = match.teams.map(contest => ({
                ...contest,
                matchId: match._id,
                matchName: match.Team1vsTeam2
              }));
                contestUpdates.push({ contests, matchId: match._id });
              }
            });
            
            if (contestUpdates.length > 0) {
              contestUpdates.forEach(update => {
                dispatch(getContestList(update.contests, update.matchId));
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
    console.log('[CRICKET.JS DEBUG] onPressScoreboard called with:', {
      item: {
        id: item._id,
        TeamA: item.TeamA,
        TeamB: item.TeamB,
        Status: item.Status,
        Type: item.Type,
        hasScorecard: !!item.scorecard,
        scorecardLength: item.scorecard?.length,
        scorecard: item.scorecard,
        hasTeams: !!item.teams,
        teamsLength: item.teams?.length,
        teams: item.teams,
      },
      currentTab,
      matchType: currentTab,
    });
                  
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
                  
    console.log('[CRICKET.JS DEBUG] Navigating to MY_CONTEST with params:', navigationParams);
    console.log('[CRICKET.JS DEBUG] Contest data being set:', item);
    console.log('[CRICKET.JS DEBUG] Using matchId (_id):', item._id);
                  
    console.log('🎯 Navigating to MY_CONTEST from Cricket.js');
    NavigationService.navigate(MY_CONTEST, navigationParams);
  }, [dispatch]);

  const currentMatchesWithContests = useMemo(() => {
    const filteredMatches = getFilteredMatches();
    return filteredMatches.map(match => ({
      ...match,
      contest_details: contestList?.data?.filter(contest => contest.matchid === match._id) || [],
    }));
  }, [getFilteredMatches, contestList?.data]);

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

  // Filter My Matches by Teams and Scoreboard
  const myTeamsMatches = useMemo(() => {
    return myMatchesHome?.filter(match => 
      match.teams && match.teams.length > 0 && 
      match.teams.some(team => team.joined > 0)
    ) || [];
  }, [myMatchesHome]);
  
  const myScoreboardMatches = useMemo(() => {
    return myMatchesHome?.filter(match => 
      match.scorecard && match.scorecard.length > 0 && 
      match.scorecard.some(scorecard => scorecard.joined > 0)
    ) || [];
  }, [myMatchesHome]);

  const [myMatchesIndex, setMyMatchesIndex] = useState(0);
  const [myMatchesRoutes] = useState([
    {key: 'teams', title: 'Teams'},
    {key: 'scoreboard', title: 'Scoreboard'},
  ]);

  const getMyMatchesFiltered = useCallback(() => {
    return myMatchesIndex === 0 ? myTeamsMatches : myScoreboardMatches;
  }, [myMatchesIndex, myTeamsMatches, myScoreboardMatches]);

  const renderMyMatchesScene = useCallback(({route}) => {
    const filteredMyMatches = getMyMatchesFiltered();
    
    console.log('[CRICKET.JS DEBUG] renderMyMatchesScene for route:', route.title, {
      filteredMyMatchesLength: filteredMyMatches.length,
      filteredMyMatches: filteredMyMatches.map(match => ({
        id: match._id,
        TeamA: match.TeamA,
        TeamB: match.TeamB,
        Status: match.Status,
        hasScorecard: !!match.scorecard,
        scorecardLength: match.scorecard?.length,
        hasTeams: !!match.teams,
        teamsLength: match.teams?.length,
      })),
    });
    
    if (filteredMyMatches.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <AppText type={EIGHTEEN} weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptyText}>
            No {route.title} matches found
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.two}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          removeClippedSubviews={true}>
          {console.log(`Rendering My ${route.title} Matches:`, filteredMyMatches)}
          {filteredMyMatches?.map((data, index) => {
            // Determine the matchType for navigation
            const matchType = route.key === 'teams' ? 'teams' : 'scoreboard';
            console.log('[CRICKET.JS DEBUG] Rendering MyMatch item:', {
              index,
              matchId: data._id,
              matchType,
              routeKey: route.key,
              data: {
                TeamA: data.TeamA,
                TeamB: data.TeamB,
                Status: data.Status,
                hasScorecard: !!data.scorecard,
                scorecardLength: data.scorecard?.length,
                hasTeams: !!data.teams,
                teamsLength: data.teams?.length,
              },
            });
            return (
              <Matchsection
                key={`my-${route.key}-match-${data._id || index}`}
                details={data}
                isFromMyMatch={true}
                matchType={matchType}
                initialTabIndex={0}
                isHome={true}
                index={index}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }, [getMyMatchesFiltered]);

  const renderMyMatchesTabBar = useCallback(props => (
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

  const handleMyMatchesIndexChange = useCallback((newIndex) => {
    setMyMatchesIndex(newIndex);
  }, []);

  const myMatchesTabViewConfig = useMemo(() => ({
    navigationState: { index: myMatchesIndex, routes: myMatchesRoutes },
    renderScene: renderMyMatchesScene,
    onIndexChange: handleMyMatchesIndexChange,
    initialLayout: { width: layout.width },
    renderTabBar: renderMyMatchesTabBar,
    lazy: true,
    lazyPreloadDistance: 1,
    swipeEnabled: true,
    style: styles.myMatchesTabView
  }), [myMatchesIndex, myMatchesRoutes, renderMyMatchesScene, handleMyMatchesIndexChange, layout.width, renderMyMatchesTabBar]);

  const myMatchesSection = useMemo(() => {
    if (myMatchesHome?.length === 0) return null;

    return (
      <View>
        <View style={styles.one}>
          <AppText type={EIGHTEEN} weight={POPPINS_MEDIUM} color={WHITE}>
            My Matches
          </AppText>
          <ViewAll
            onPress={() =>
              NavigationService.navigate(BOTTOM_TAB_CONTEST_SCREEN, {
                screen: MY_CONTEST,
                params: { isFromMyMatch: true },
              })
            }
          />
        </View>
        <TabView {...myMatchesTabViewConfig} />
      </View>
    );
  }, [myMatchesHome, myMatchesTabViewConfig]);

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
      {myMatchesSection}
      
      <AppText
        style={{
          marginTop: myMatchesHome?.length !== 0 ? 5 : 20,
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
  one: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: universalPaddingHorizontal,
  },
  two: {
    height: 130,
    alignItems: 'center',
    alignSelf: 'flex-start',
    alignContent: 'center',
    marginTop: 10,
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
  myMatchesTabView: {
    height: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: universalPaddingHorizontal,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default React.memo(Cricket);