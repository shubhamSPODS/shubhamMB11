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
import { setMyMatchesHome, setUpComingMatches } from '../../slices/matchSlice';
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

  // Filter matches based on type (will be updated when API provides separate arrays)
  const getFilteredMatches = () => {
    if (index === 0) {
      // Return team matches when API provides them
      return upcomingMatches;
    } else {
      // Return scoreboard matches when API provides them
      return upcomingMatches;
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
      wsRef.current.onopen = () => {};
      if (!wsRef.current) return;
      wsRef.current.onmessage = e => {
        const parseData = JSON.parse(e?.data);
        let temp = parseData?.upcoming;
        dispatch(setUpComingMatches(temp));
        dispatch(setMyMatchesHome(parseData?.mymatches));
      };
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshingTwo(false);
      setRefreshing(false);
    }
  }, [_id]);

  const renderScene = ({route}) => {
    const filteredMatches = getFilteredMatches();
    return (
      <KeyBoardAware
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
        style={styles.flatlistContainer}>
        {filteredMatches?.map(item => {
          return <MatchCard details={item} matchType={route.key} />;
        })}
      </KeyBoardAware>
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
              {myMatchesHome?.map((data, index) => {
                return (
                  <Matchsection
                    details={data}
                    isFromMyMatch={true}
                    tab={'Upcoming'}
                    isHome={true}
                    index={index}
                  />
                );
              })}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  two: {
    height: 130,
    alignItems: 'center',
    alignSelf: 'flex-start',
    alignContent: 'center',
    marginTop: 10,
  },
  flatlistContainer: {
    width: '100%',
    marginTop: 5,
    paddingHorizontal: universalPaddingHorizontal,
  },
});
export default Cricket;