import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
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
import Matchsection, { getDate } from './Matchsection';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { setMyMatchesHome, setUpComingMatches, getContestList } from '../../slices/matchSlice';
import { TabView, TabBar } from 'react-native-tab-view';
import { colors } from '../../theme/color';

const LiveMatches = ({ random, setRefreshingTwo }) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const upcomingMatches = useSelector(state => state.match.upcomingMatches);
  const myMatchesHome = useSelector(state => state.match.myMatchesHome);
  const contestList = useSelector(state => state.match.contestList);
  
  const userData = useSelector(state => state.profile.userData);
  const layout = useWindowDimensions();
  
  const { _id } = userData ?? '';
  const [refershing, setRefreshing] = useState(false);


  useEffect(() => {
    if (_id) {
      fetchData(false); 
    }
  }, [random, _id]);

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
        console.log('WebSocket connection established for Live Matches');
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



  const renderMyMatchesScene = useCallback(({route}) => {
    let filteredMyMatches;
    
    if (route.key === 'teams') {
      filteredMyMatches = myTeamsMatches;
    } else if (route.key === 'scoreboard') {
      filteredMyMatches = myScoreboardMatches;
    } else {
      filteredMyMatches = [];
    }
    
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
      <View style={styles.sceneContainer}>
        <ScrollView
          style={styles.flatlistContainer}
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          nestedScrollEnabled={true}
          scrollEventThrottle={16}>
          {filteredMyMatches?.map((data, index) => {
            const matchType = route.key === 'teams' ? 'teams' : 'scoreboard';
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
  }, [myTeamsMatches, myScoreboardMatches]);

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
      scrollEnabled={false}
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
      <View style={styles.myMatchesWrapper}>
        <View style={styles.one}>
          <AppText type={EIGHTEEN} weight={POPPINS_MEDIUM} color={WHITE}>
            My Matches
          </AppText>
        </View>
        <View style={styles.tabViewContainer}>
          <TabView {...myMatchesTabViewConfig} />
        </View>
      </View>
    );
  }, [myMatchesHome, myMatchesTabViewConfig]);



  return (
    <View style={styles.container}>
      {myMatchesSection}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  myMatchesWrapper: {
    flex: 1,
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
  tabViewContainer: {
    flex: 1,
  },
  sceneContainer: {
    flex: 1,
    width: '100%',
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
  myMatchesTabView: {
    flex: 1,
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
});

export default React.memo(LiveMatches); 