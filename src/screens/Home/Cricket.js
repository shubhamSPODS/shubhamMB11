import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
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

const search = element => getDate(element).hour < 0;
const Cricket = ({ random, setRefreshingTwo }) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const upcomingMatches = useSelector(state => state.match.upcomingMatches);
  const myMatchesHome = useSelector(state => state.match.myMatchesHome);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  
  const { _id } = userData ?? '';
  const [isMoadlVisible, setIsModalVisible] = useState(false);
  const [intro, setIntro] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [refershing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [ForConnectedTo, setForConnectedTo] = useState(false);
  // const URL = `${BASE_URL}upcoming-matches?limit=20&skip=0&userid=${_id}`;
  useEffect(() => {
    if (_id && _id) {
      onRefresh(_id)
    } else {
      console.log('Hellooo')
    }
  }, [random])
  useEffect(() => {
    const interval = setInterval(() => {
      const itemIndex = upcomingMatches.findIndex(search);
      let tempArray = [...upcomingMatches];
      if (itemIndex !== -1 && upcomingMatches?.length !== 0) {``
        tempArray?.splice(itemIndex, 1);
        dispatch(setUpComingMatches(tempArray));
      }
    }, 1000);
    return () => clearInterval(interval);
  });
  useEffect(() => {
    if (upcomingMatches?.length !== 0) {
      dispatch(setUpComingMatches(upcomingMatches));
    }
  }, [upcomingMatches]);
  const onRefresh = React.useCallback((_id) => {
    const URL = `ws://app.mybattle11.com/upcoming-matches?limit=20&skip=0&userid=${_id}`;
    setRefreshing(true);
    setRefreshingTwo(true);
    // Disconnect the WebSocket if it's already connected
    if (isConnected && wsRef.current) {
      wsRef.current.close();
      setIsConnected(false);
    }
    try {
      wsRef.current = new WebSocket(URL);
      wsRef.current.onopen = () => {

        setIsConnected(true); // Set the connection status to true
      };
      if (!wsRef.current) return;
      wsRef.current.onmessage = e => {
        const parseData = JSON.parse(e?.data);
        let temp = parseData?.upcoming;
        console.log(temp,'==temp');
        console.log(temp,'==parseData');

        
        // console.log(temp?.length, "setUpComingMatches");
        dispatch(setUpComingMatches(temp));
        dispatch(setMyMatchesHome(parseData?.mymatches));
      };
      // Rest of your WebSocket setup and event handling
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshingTwo(false);
      setRefreshing(false);
    }
  }, [isConnected]);
  const getData = React.useCallback((_id) => {
    const URL = `ws://app.mybattle11.com/upcoming-matches?limit=20&skip=0&userid=${_id}`;
    if (isConnected && wsRef.current) {
      wsRef.current.close();
      setIsConnected(false);
    }
    try {
      wsRef.current = new WebSocket(URL);
      wsRef.current.onopen = () => {
        setIsConnected(true);
      };
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
      setRefreshing(false);
    }
  }, [isConnected]);
  useEffect(() => {
    if (_id && _id) {
      if (!ForConnectedTo) {
        getData(_id);
        setForConnectedTo(true);
      } else {
        const interval = setInterval(() => {
          getData(_id);
        }, 1000);
        return () => clearInterval(interval);
      }
    } else {
      console.log(_id, 'ID Nahi hai')
    }
  }, [_id, userData]);

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
      <KeyBoardAware
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
        style={styles.flatlistContainer}>
        {upcomingMatches?.map(item => {
          return <MatchCard details={item} />;
        })}
      </KeyBoardAware>
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
