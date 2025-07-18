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
    onPressScoreboard={() => onPressScoreboard(item)}
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

  const onPressScoreboard = useCallback((item) => {
                  console.log('🎯 Cricket.js onPressScoreboard called with item:', {
                    id: item._id,
                    TeamA: item.TeamA,
                    TeamB: item.TeamB,
                    matchType: 'scoreboard',
                    hasScorecard: !!item.scorecard,
                    scorecard: item.scorecard
                  });
                  
                  dispatch(setSelectedMatch(item));
                  dispatch(setContestData(item));
                  
                  console.log('🎯 Navigating to MY_CONTEST from Cricket.js');
                  NavigationService.navigate(MY_CONTEST, {
                    matchId: item._id,
                    matchType: 'scoreboard',
                    TeamA: item.TeamA,
                    TeamB: item.TeamB,
                    isFromMyMatch: false,
                    contestId: item.contestId,
                  });
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
                NavigationService.navigate(BOTTOM_TAB_CONTEST_SCREEN)
              }
            />
          </View>
          <View style={styles.two}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
            horizontal={true}
            removeClippedSubviews={true}>
              {myMatchesHome?.map((data, index) => (
                <Matchsection
                  key={`my-match-${data._id || index}`}
                  details={data}
                  isFromMyMatch={true}
                  tab={'Upcoming'}
                  isHome={true}
                  index={index}
                />
              ))}
            </ScrollView>
          </View>
        </View>
    );
  }, [myMatchesHome]);

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
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default React.memo(Cricket);