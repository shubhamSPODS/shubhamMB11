import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect } from 'react';
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
import { BOTTOM_TAB_CONTEST_SCREEN } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { universalPaddingHorizontal } from '../../theme/dimens';
import { setMyMatchesHome, setUpComingMatches, getContestList, setSelectedMatch } from '../../slices/matchSlice';
import { KeyBoardAware } from '../../common/KeyboardAware';
import { BASE_URL } from '../../helper/utility';
import { TabView, TabBar } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/color';

const search = element => getDate(element).hour < 0;
const Cricket = ({ random, setRefreshingTwo }) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const upcomingMatches = useSelector(state => state.match.upcomingMatches);
  const myMatchesHome = useSelector(state => state.match.myMatchesHome);
  const contestList = useSelector(state => state.match.contestList);
  
  useEffect(() => {
    console.log('=== My Matches ===', myMatchesHome);
    console.log('=== Upcoming Matches ===', upcomingMatches);
    
    const maharashtraMatches = upcomingMatches?.filter(match => 
      match.SeriesName?.includes('Maharashtra') || 
      match.Team1vsTeam2?.includes('Eagle') || 
      match.Team1vsTeam2?.includes('Puneri')
    );
    if (maharashtraMatches?.length > 0) {
      console.log( maharashtraMatches.map(m => ({
        id: m._id,
        series: m.SeriesName,
        teams: m.Team1vsTeam2,
        status: m.Status,
        hasTeams: m.teams?.length,
        hasScorecard: m.scorecard?.length,
        contestsWithJoined: m.teams?.filter(t => t.joined > 0).length,
        startDateTime: m.StartDateTime
      })));
    }
    
    const teamsMatches = upcomingMatches.filter(match => match.teams && match.teams.length > 0);
    const scoreboardMatches = upcomingMatches.filter(match => match.scorecard && match.scorecard.length > 0);
    console.log('=== Teams Tab Matches ===', teamsMatches.length);
    console.log('=== Scoreboard Tab Matches ===', scoreboardMatches.length);
  }, [myMatchesHome, upcomingMatches]);

  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const layout = useWindowDimensions();
  
  const { _id } = userData ?? '';
  const [isMoadlVisible, setIsModalVisible] = useState(false);
  const [intro, setIntro] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [refershing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'teams', title: 'Teams'},
    {key: 'scoreboard', title: 'Scoreboard'},
  ]);

  const getFilteredMatches = () => {
    if (index === 0) {
      return upcomingMatches.filter(match => match.teams && match.teams.length > 0);
    } else {
      return upcomingMatches.filter(match => match.scorecard && match.scorecard.length > 0);
    }
  };

  useEffect(() => {
    if (_id) {
      onRefresh();
    }
  }, [random, _id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const itemIndex = upcomingMatches.findIndex(search);
      let tempArray = [...upcomingMatches];
      if (itemIndex !== -1 && upcomingMatches?.length !== 0) {
        tempArray?.splice(itemIndex, 1);
        dispatch(setUpComingMatches(tempArray));
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const onRefresh = React.useCallback(() => {
    const URL = `wss://app.mybattle11.com/upcoming-matches?limit=20&skip=0&userid=${_id}`;
    setRefreshing(true);
    setRefreshingTwo(true);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    try {
      wsRef.current = new WebSocket(URL);
      wsRef.current.onopen = () => {
        console.log('WebSocket connection established to:', URL);
      };
      wsRef.current.onmessage = e => {
        console.log('Full WebSocket response:', JSON.parse(e.data));
        const parseData = JSON.parse(e?.data);
        let temp = parseData?.upcoming;
        
        if (temp && temp.length > 0) {
          temp.forEach(match => {
            console.log('Match contests:', {
              matchId: match._id,
              contests: match.teams,
              entryFees: match.teams?.map(t => t.EntryFee),
              contestSizes: match.teams?.map(t => t.ContestSize)
            });
          });
        }
        
        dispatch(setUpComingMatches(temp));
        dispatch(setMyMatchesHome(parseData?.mymatches));
        
        if (temp && temp.length > 0) {
          temp.forEach(match => {
            if (match.teams && match.teams.length > 0) {
              const contests = match.teams.map(contest => ({
                ...contest,
                matchId: match._id,
                matchName: match.Team1vsTeam2
              }));
              dispatch(getContestList(contests, match._id));
            }
          });
        }
        setRefreshing(false);
        setRefreshingTwo(false);
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
  }, [_id]);

  const renderScene = ({route}) => {
    const filteredMatches = getFilteredMatches();
    console.log(`Rendering ${route.key} tab with ${filteredMatches?.length} matches`);
    
    const matchesWithContests = filteredMatches.map(match => ({
      ...match,
      contest_details: contestList?.data?.filter(contest => contest.matchid === match._id) || [],
    }));

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
        style={styles.flatlistContainer}
        contentContainerStyle={styles.scrollContent}>
        {matchesWithContests?.map((item, idx) => {
          return (
            <MatchCard 
              key={`${route.key}-${item._id || idx}`}
              details={item} 
              matchType={route.key}
              isFromMyMatch={false}
              isHome={true}
              onPressScoreboard={() => {
                const onPressScoreboard = item => {
                  dispatch(setSelectedMatch(item));
                  NavigationService.navigate('MY_CONTEST', {
                    matchId: item._id,
                    matchType: 'scoreboard',
                    TeamA: item.TeamA,
                    TeamB: item.TeamB,
                    isFromMyMatch: false,
                    contestId: item.contestId,
                  });
                };
                onPressScoreboard(item);
              }}
            />
          );
        })}
        {matchesWithContests?.length === 0 && (
          <View style={styles.noMatchesContainer}>
            <AppText type={EIGHTEEN} weight={POPPINS_MEDIUM} color={WHITE}>
              No matches available
            </AppText>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderTabBar = props => (
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
      renderLabel={({route, focused}) => {
        return (
          <View style={{width: '100%', alignItems: 'center'}}>
            <AppText
              type={EIGHTEEN}
              weight={POPPINS_SEMI_BOLD}
              color={WHITE}
              style={{fontSize: 16}}>
              {route.title}
            </AppText>
          </View>
        );
      }}
      pressColor="transparent"
      tabStyle={{borderRadius: 0}}
    />
  );

  return (
    <View style={styles.container}>
      {myMatchesHome?.length !== 0 && (
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
              horizontal={true}>
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
      )}
      <AppText
        style={{
          marginTop: myMatchesHome?.length !== 0 ? 5 : 20,
          marginHorizontal: universalPaddingHorizontal,
        }}
        type={EIGHTEEN}
        weight={POPPINS_SEMI_BOLD} color={WHITE}>
        Upcoming Matches
      </AppText>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
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

export default Cricket;