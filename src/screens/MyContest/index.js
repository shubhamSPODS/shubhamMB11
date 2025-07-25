import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  Platform,
  ImageBackground,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import FilterSheet from '../../components/filterSheet/FilterSheet';
import CommonHeader from '../../components/matchCard/commonHeader/CommonHeader';
import MatchRemainder from '../../components/matchCard/matchRemainder/MatchRemainder';
import MyContestList from '../../components/matchCard/myContest/MyContestList';
import MyTeam from '../../components/matchCard/myTeam/MyTeam';
import NavigationService from '../../navigation/NavigationService';
import {
  CREATE_CONTEST,
  MY_BALANCE,
  SELECT_PLAYER,
  MY_CONTEST,
  SCOREBOARD_CREATE,
} from '../../navigation/routes';
import {
  MycreateContest,
  getAllPlayerList,
  getContestList,
  getFilterSortby,
  getMyJoinedContest,
  getMyScoreboardContests,
  getMyTeam,
  getTab,
  setAllContest,
  setAllPlayers,
  setIsContestEntry,
  setLoading,
  setContestCategories,
  setContestData,
} from '../../slices/matchSlice';
import ScoreboardList from '../Scoreboard/List';
import styles from './styles';
import Contest from '../../components/matchCard/contest.js/Contest';
import {Screen, flexOne} from '../../theme/dimens';
import CommonImageBackground from '../../common/commonImageBackground';
import PrimaryButton from '../../common/primaryButton';
import SecondaryButton from '../../common/secondaryButton';
import {
  AppText,
  BLACK,
  BROWNYELLOW,
  ELEVEN,
  FORTEEN,
  POPPINS_BOLD,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import {NewColor, colors} from '../../theme/color';
import ContestCard from '../../components/matchCard/contestCard/ContestCard';
import {getKycDetails} from '../../actions/profileAction';
import {MatchLiveModal} from '../../common/MatchLiveModal';
import {transformData} from '../../helper/utility';
import MyContestListETC from '../../components/matchCard/myContest/MyContestListcETC';
import SlideSwiper from '../../common/Sileswiper';
import Stats from './Stats';
import {
  FILTER_ICON,
  VS,
  WalletIcon,
  backIconMain,
  headerIner,
  rightArrow,
} from '../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import LinearGradient from 'react-native-linear-gradient';
import {LiveTime} from '../../common/LiveTime';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import List from '../Scoreboard/List';

const MyContest = () => {
  const dispatch = useDispatch();
  const sheet = useRef();
  const route = useRoute();
  const filterSheet = useRef();
  const AleartLive = useRef();
  const isLoading = useSelector(state => state.auth.isLoading);
  const contestData = useSelector(state => state?.match?.contestData);
  const contestList = useSelector(state => state?.match?.contestList);
  const myTeam = useSelector(state => state?.match?.myTeams);
  const myContest = useSelector(state => state?.match?.myContest);
  const SortbyFilterData = useSelector(state => state?.match?.SortbyFilterData);
  const transformedData = transformData(contestList?.data);
  const MyCreateContestData = useSelector(
    state => state?.match?.MyCreateContestData,
  );
  const allContestList = useSelector(state => state?.match?.allContestList);
  const currentDate = new Date();
  const inputDate = new Date(contestData?.StartDateTime);
  const isPastTime = inputDate < currentDate;
  const [filterdata, setFilterData] = useState([]);
  const [entry, setEntry] = useState([]);
  const [team, setTeam] = useState([]);
  const [prize, setPrize] = useState([]);
  const [contest, setContest] = useState([]);
  const [modalRemove, setModalRemove] = useState(false);
  const [saveTitle, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [matchActiveTab, setMatchActiveTab] = useState('');
  const [isSheet, setIsSheet] = useState(false);
  const {matchType = 'teams', matchId} = route.params || {};
  const layout = useWindowDimensions();

  const onRefresh = useCallback(async () => {
    let outputObject = {};
    dispatch(getContestList(outputObject, effectiveMatchId));
    dispatch(getMyTeam(effectiveMatchId));
    dispatch(getMyJoinedContest(effectiveMatchId));
    dispatch(MycreateContest(effectiveMatchId));
    let data = {cid: SeriesId};
    dispatch(getAllPlayerList(effectiveMatchId, data));
    
    // Fetch scoreboard contests if matchType is scoreboard
    if (matchType === 'scoreboard' && effectiveMatchId) {
      try {
        const scoreboardContests = await dispatch(getMyScoreboardContests(effectiveMatchId));
        setMyScoreboardContests(scoreboardContests || []);
      } catch (error) {
        console.error('Error fetching scoreboard contests:', error);
      }
    }
  }, [effectiveMatchId, SeriesId, dispatch, matchType]);
  
  const DATA = [
    {
      id: 1,
      title: 'ENTRY',
    },
    {
      id: 2,
      title: 'SPOTS',
    },
    {
      id: 3,
      title: 'PRIZE POOL',
    },
    {
      id: 4,
      title: '%WINNER',
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState();
  const [selectedHighLow, setSelectedHighLow] = useState('high');
  
  useEffect(() => {
    setTitle(
      activeTab == 1
        ? 'Select Contest'
        : activeTab == 2
        ? 'My Contest'
        : activeTab == 3
        ? matchType === 'teams' ? 'My Team' : 'My Scoreboard'
        : 'Select Contest',
    );
  }, [activeTab, matchType]);
  const {_id, isFromMyMatch, match_id, isHome, SeriesId} = contestData ?? '';
  const matchIdFromParams = route.params?.matchId;
  const effectiveMatchId = _id || matchIdFromParams;
  
  console.log('🎯 Match ID Debug:', {
    contestDataId: _id,
    matchIdFromParams,
    effectiveMatchId,
    contestData: contestData,
    routeParams: route.params
  });
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        let outputObject = {};
        dispatch(getContestList(outputObject, effectiveMatchId));
        dispatch(getMyTeam(effectiveMatchId));
        dispatch(getMyJoinedContest(effectiveMatchId));
        dispatch(MycreateContest(effectiveMatchId));
        let data = {cid: SeriesId};
        dispatch(getAllPlayerList(effectiveMatchId, data));
        
        // Fetch scoreboard contests if matchType is scoreboard
        if (matchType === 'scoreboard' && effectiveMatchId) {
          try {
            const scoreboardContests = await dispatch(getMyScoreboardContests(effectiveMatchId));
            setMyScoreboardContests(scoreboardContests || []);
          } catch (error) {
            console.error('Error fetching scoreboard contests:', error);
          }
        }
      };
      
      fetchData();
    }, [effectiveMatchId, SeriesId, dispatch, matchType]),
  );
  useEffect(() => {
    dispatch(getKycDetails());
  }, []);

  const renderItem = ({item}) => {
    return (
      <ContestCard
        details={{
          ...item,
          contest_category_details: item.contest_category_details || []
        }}
        totalTeamCount={myTeam?.length}
        matchType={matchType}
      />
    );
  };

  // Memoize renderMyTeam function
  const renderMyTeam = useCallback(({item}) => {
    return <MyTeam item={item} tab={route?.params?.tab} />;
  }, [route?.params?.tab]);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item) => item._id || item.id || String(item.pid), []);

  // Memoize refresh handler
  const handleRefresh = useCallback((type) => {
    if (type === 'contest') {
      let outputObject = {};
      dispatch(getContestList(outputObject, isHome ? match_id : _id));
    } else if (type === 'my contest') {
      dispatch(getMyJoinedContest(isHome ? match_id : _id));
    } else {
      dispatch(getMyTeam(isHome ? match_id : _id));
    }
  }, [dispatch, isHome, match_id, _id]);

  const renderMyContest = ({item}) => {
    console.log('🎯 renderMyContest called with item:', item);
    return <MyContestList item={item} matchDetails={route?.params} />;
  };

  const renderContest = ({item}) => {
    // Find the full contest details from contestList.data
    const fullContestDetails = (contestList?.data || []).find(
      c => c._id === item._id || c.contest_category_id === item.contest_category_id
    ) || item;
    return (
      <ContestCard
        details={fullContestDetails}
        totalTeamCount={myTeam?.length}
        matchType={matchType}
        matchDetails={contestData}
        onPress={() => {
          dispatch(setContestData(contestData)); // Set full match data
          NavigationService.navigate(MY_CONTEST, {
            contestId: item?._id,
            matchId: contestData?._id,
            teamId: item?.teamId,
            matchType: contestData?.Type,
            selectedContest: item, // Pass selected contest as param
          });
        }}
      />
    );
  };

  const renderMyCreateContest = () => {
    return (
      MyCreateContestData &&
      MyCreateContestData?.map(item => {
        return (
          <MyContestListETC
            item={item}
            teamName={contestData}
            _id={_id}
            myMatches={route?.params?.myMatches}
            matchDetails={route?.params}
          />
        );
      })
    );
  };
  const EmptyComponent = () => {
    return MyCreateContestData?.length || myContest?.length ? (
      <></>
    ) : (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText
          weight={POPPINS_MEDIUM}
          style={{
            textAlign: 'center',
          }}>
          You haven't joined a contest yet!{'\n'}Find a contest to join and
          start winning
        </AppText>
        <PrimaryButton
          onPress={() => setActiveTab(1)}
          smallBtn={styles.joinButtonMyContest}
          title="JOIN A CONTEST"
        />
      </View>
    );
  };

  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const {total_balance, cash_bonus, winning_amount, totaldeposit} = userData ?? '';
  let totalbalance = winning_amount + cash_bonus + totaldeposit;
  const details = useSelector(state => state?.match?.contestData);
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const [index, setIndex] = React.useState(route.params?.initialTabIndex || 0);
  
  // Memoize routes to prevent unnecessary re-renders
  const routes = React.useMemo(() => {
    console.log('🔄 Computing routes with:', { matchType, myTeam: myTeam?.length, isFromMyMatch: route?.params?.isFromMyMatch });
    
    return [
      {
        key: 'first',
        title: 'Contest',
      },
      {
        key: 'second',
        title: route?.params?.isFromMyMatch == true
          ? (matchType === 'teams' ? 'My Team' : 'My Contest')
          : 'My Contest',
      },
      {
        key: 'third',
        title: route?.params?.isFromMyMatch == true && matchType === 'scoreboard'
          ? 'My Scoreboard' 
          : matchType === 'teams' 
            ? `My Team (${myTeam?.length || 0})` 
            : 'My Scoreboard',
      },
    ];
  }, [matchType, myTeam?.length, route?.params?.isFromMyMatch]);

  const [removeTabs, setRemoveTabs] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [myScoreboardContests, setMyScoreboardContests] = useState([]);

  useEffect(() => {
    if (matchId) {
      const fetchContestData = async () => {
        try {
          const response =  dispatch(getContestList({}, matchId));
          
          const categories = response?.payload?.data
            ?.filter(c => c.contest_category_details)
            ?.map(c => c.contest_category_details);
          dispatch(setContestCategories(categories || []));
          
        } catch (error) {
          console.error('Error fetching contest list:', error);
        }
      };
      fetchContestData();
    }
  }, [matchId, dispatch]);

  useEffect(() => {
    let intervalId;
    if (!route?.params?.isFromMyMatch) {
      intervalId = setInterval(() => {
        handleRefresh('my contest');
      }, 30000); 
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [handleRefresh, route?.params?.isFromMyMatch]);

  const FirstRoute = React.useCallback(() => {
    const contestDataForList = useMemo(() => {
      if (matchType === 'teams') {
        return contestData?.teams;
      } else if (matchType === 'scoreboard') {
        return contestData?.scorecard;
      } else {
        return allContestList
          ? allContestList
          : contestList?.data?.[0]?.data
          ? contestList.data[0].data
          : transformedData;
      }
    }, [matchType, contestData, allContestList, contestList, transformedData]);

    return (
      <View style={flexOne}>
        {MyCreateContestData?.length > 0 && (
          <View>
            <AppText
              style={{marginTop: 20, marginLeft: 10}}
              weight={POPPINS_SEMI_BOLD}>
              My Created Contest
            </AppText>
            <FlatList
              data={MyCreateContestData}
              renderItem={renderMyCreateContest}
              keyExtractor={item => item?._id}
            />
          </View>
        )}
        <FlatList
          data={contestDataForList}
          renderItem={renderContest}
          showsVerticalScrollIndicator={false}
          style={{paddingBottom: 50}}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={EmptyComponent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        />
      </View>
    );
  }, [matchType, contestData, allContestList, contestList, transformedData, MyCreateContestData, renderContest, renderMyCreateContest, isLoading, onRefresh]);

  const SecondRoute = React.useCallback(() => {
    console.log('🎯 SecondRoute rendering - matchType:', matchType);
    
    if (matchType === 'scoreboard') {
      console.log('📋 My scoreboard contests data:', myScoreboardContests);
      
      const transformScoreboardContests = () => {
        const contestGroups = {};
        myScoreboardContests.forEach((scoreboard, index) => {
          const contestId = scoreboard.contest_id;
          if (!contestGroups[contestId]) {
            const matchingContest = contestData?.scorecard?.find(c => 
              c.shadow_contest_id === contestId || 
              c._id === contestId ||
              c.contest_category_id === contestId
            );
            console.log('🔍 Looking for contest with ID:', contestId);
            console.log('🔍 Available scorecard contests:', contestData?.scorecard?.map(c => ({
              _id: c._id,
              shadow_contest_id: c.shadow_contest_id,
              contest_category_id: c.contest_category_id
            })));
            console.log('🔍 Found matching contest:', matchingContest);
            
            contestGroups[contestId] = {
              _id: matchingContest?._id || contestId,
              contest_category_id: matchingContest?.contest_category_id || scoreboard.contest_category_id,
              shadow_contest_id: matchingContest?.shadow_contest_id || contestId,
              scoreboardDetails: [],
              data: {
                WinningAmount: matchingContest?.winning_amount || 100,
                EnteryFee: matchingContest?.EntryFee || 1,
                Contestsize: matchingContest?.ContestSize || 100,
                Rankdata: [{Price: matchingContest?.winning_amount || 100}],
                JoinWithMULT: false,
                teams: [], 
                joined: 0 
              },
              contest_details: {
                joined: 0,
                winning_amount: matchingContest?.winning_amount || 100,
                shadow_contest_id: matchingContest?.shadow_contest_id || contestId,
                contest_category_id: matchingContest?.contest_category_id || scoreboard.contest_category_id
              },
              Winning_percent: 10, 
              JoinWithMULT: false,
              contest_type: matchingContest?.contest_type || 'ScoreCard',
              ContestType: matchingContest?.ContestType || 'ScoreCard',
              EntryFee: matchingContest?.EntryFee || 1,
              ContestSize: matchingContest?.ContestSize || 100,
              winning_amount: matchingContest?.winning_amount || 100,
              ...matchingContest
            };
          }
          
          if (scoreboard.joined) {
            contestGroups[contestId].contest_details.joined += 1;
            contestGroups[contestId].scoreboardDetails.push({
              _id: scoreboard._id,
              name: `S${contestGroups[contestId].scoreboardDetails.length + 1}`,
              scoreboardData: scoreboard,
              teamid: scoreboard._id,
              rank: scoreboard.ranks || 0,
              totalpoints: scoreboard.total_points || 0
            });
            
            contestGroups[contestId].data.joined = contestGroups[contestId].contest_details.joined;
          }
        });
        
        return Object.values(contestGroups).filter(contest => contest.contest_details.joined > 0).map(contest => {
          contest.teamDetails = contest.scoreboardDetails;
          return contest;
        });
      };

      const transformedContests = transformScoreboardContests();

      return (
        <View
          style={{
            width: Screen.Width - 10,
            alignSelf: 'center',
            marginTop: 5,
          }}>
          <FlatList
            data={transformedContests}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <MyContestList item={item} matchDetails={route?.params} isScoreboard={true} />}
            ListEmptyComponent={() => {
              return (
                <View style={{ marginTop: 30, alignItems: 'center' }}>
                  <AppText
                    weight={POPPINS_MEDIUM}
                    style={{ textAlign: 'center' }}>
                    You haven't joined any scoreboard contests yet!{'\n'}
                    Join a contest to start predicting scores
                  </AppText>
                  <PrimaryButton
                    onPress={() => setIndex(0)} 
                    smallBtn={styles.joinButtonMyContest}
                    title="JOIN A CONTEST"
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => item._id || index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      );
    }

    return (
      <>
        {route?.params?.isFromMyMatch == true ? (
          <View
            style={{
              width: Screen.Width - 10,
              alignSelf: 'center',
              marginTop: 5,
            }}>
            <FlatList
              data={myContest}
              showsVerticalScrollIndicator={false}
              renderItem={renderMyContest}
              ListHeaderComponent={renderMyCreateContest}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 30}}>
                    <EmptyComponent />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => handleRefresh('my contest')}
                />
              }
            />
          </View>
        ) : (
          <View
            style={{
              width: Screen.Width - 10,
              alignSelf: 'center',
              marginTop: 5,
            }}>
            <FlatList
              data={myContest}
              showsVerticalScrollIndicator={false}
              renderItem={renderMyContest}
              ListHeaderComponent={renderMyCreateContest}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 30}}>
                    <EmptyComponent />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => handleRefresh('my contest')}
                />
              }
            />
          </View>
        )}
      </>
    );
  }, [matchType, myContest, renderMyContest, renderMyCreateContest, route?.params?.isFromMyMatch, handleRefresh, myScoreboardContests, contestData, isLoading, onRefresh]);

  const ThirdRoute = React.useCallback(() => {
    console.log('🎯 ThirdRoute rendering - matchType:', matchType);
    
    if (matchType === 'teams') {
      if (myTeam?.length === 0) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AppText style={{fontSize: 15}} weight={POPPINS_MEDIUM}>
              You haven't created any team for this match
            </AppText>
          </View>
        );
      }
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={myTeam}
            renderItem={renderMyTeam}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyComponent />}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => handleRefresh('my team')}
              />
            }
          />
        </View>
      );
    } else {
      
      return React.useMemo(() => (
        <ScoreboardList key={`scoreboard-${_id}`} matchIdProp={_id} />
      ), [_id]);
    }
  }, [matchType, myTeam, renderMyTeam, keyExtractor, handleRefresh, isLoading]);

  const renderScene = React.useMemo(() => SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  }), [FirstRoute, SecondRoute, ThirdRoute]);

  const handleCreatePress = () => {
    if (matchType === 'scoreboard') {
      NavigationService.navigate(SCOREBOARD_CREATE, {
        ...contestData,
        isFromMyMatch,
      });
    } else {
      dispatch(getTab(''));
      dispatch(setAllPlayers([]));
      let data = {cid: SeriesId};
      dispatch(getAllPlayerList(_id, data));
      NavigationService.navigate(SELECT_PLAYER, contestData, isFromMyMatch);
      dispatch(setIsContestEntry(false));
    }
  };

  const shouldShowCreateButton = () => {
    // Hide the button for Live matches
    if (contestData?.Status === 'Live') {
      return false;
    }
    return true;
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      {/* {isLoader && (
        <View style={{flex: 1}}>
          <ActivityIndicator size={'large'} />
        </View>
      )} */}
      <CommonImageBackground common>
        <View
          style={{
            flexDirection: 'row',
            width: Screen.Width,
            padding: 5,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          <TouchableOpacityView
            onPress={() => NavigationService.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={backIconMain}
              resizeMode="contain"
              style={{
                height: 28,
                width: 28,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
            <AppText>{'Select Contest'}</AppText>
          </TouchableOpacityView>
          <TouchableOpacityView
            onPress={() => NavigationService.navigate(MY_BALANCE)}>
            <LinearGradient
              colors={['#C1AA9966', '#C1AA9926']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              style={{
                borderRadius: 59,
                flexDirection: 'row',
                marginTop: 2,
                // height: 30,
                padding:3,
                width: 100,
                borderWidth: 2,
                borderColor: '#C1AA9966',
                marginLeft: 30,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 50,
                    right:5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#DBA73E',
                  }}>
                  <FastImage
                    style={{height: 12, width: 14}}
                    resizeMode="contain"
                    source={WalletIcon}
                  />
                </View>
                <View>
                  <AppText
                    style={{marginTop: -1,left:5 }}
                    type={TWELVE}
                    weight={POPPINS_SEMI_BOLD}
                    color={WHITE}>
                    ₹ {Math?.round(totalbalance).toFixed(0)}
                  </AppText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacityView>
        </View>
        <ImageBackground
          source={headerIner}
          resizeMode="contain"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 35,
            height: 52,
            marginTop: 10,
          }}>
          <FastImage
            source={{uri: details?.TeamAlogo}}
            style={{height: 37, width: 37, resizeMode: 'contain'}}
            resizeMode="contain"
          />
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppText color={BLACK} weight={POPPINS_BOLD}>
                {details?.TeamsShortNames && details?.TeamsShortNames[0]}
              </AppText>
              <FastImage
                source={VS}
                resizeMode="contain"
                style={{height: 27, width: 15, marginRight: 5, marginLeft: 5}}
              />
              <AppText color={BLACK} weight={POPPINS_BOLD}>
                {details?.TeamsShortNames && details?.TeamsShortNames[1]}
              </AppText>
            </View>
            <LiveTime
              view={true}
              top={true}
              details={details}
              color={timeDifference >= 1 ? BLACK : BLACK}
              type={TEN}
              setRemoveTabs={setRemoveTabs}
            />
          </View>
          <FastImage
            source={{uri: details?.TeamBlogo}}
            style={{
              height: 37,
              width: 37,
              resizeMode: 'contain',
            }}
            resizeMode="contain"
          />
        </ImageBackground>

        <TabView
          key={`tabview-${matchType}-${_id}`}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <>
              <TabBar
                {...props}
                onTabPress={e => {
                  setMatchActiveTab(e?.route?.title);
                }}
                scrollEnabled={true}
                tabStyle={{
                  width: layout.width / 3,
                  backgroundColor: '#3F3F3F',
                  height: 45,
                  marginTop: 10,
                }}
                renderLabel={({route, focused}) => {
                  const tabColors = focused
                    ? [colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]
                    : ['#3F3F3F', '#3F3F3F'];
                  return (
                    <View style={{height: 45, width: layout.width / 3}}>
                      <LinearGradient
                        style={{
                          height: 45,
                          bottom: 1,
                          width: layout.width / 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopRightRadius: route?.key === 'first' ? 42 : null,
                          borderBottomRightRadius: route?.key === 'first' ? 40 : null,
                          borderRadius: route?.key === 'second' || route?.key === 'third' ? 35 : null,
                          borderTopLeftRadius: route?.key === 'fourth' ? 35 : null,
                          borderBottomLeftRadius: route?.key === 'fourth' ? 35 : null,
                        }}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        colors={tabColors}>
                        <AppText
                          type={FORTEEN}
                          color={focused ? 'white' : 'black'}
                          weight={POPPINS_MEDIUM}
                          numberOfLines={1}
                          style={{paddingHorizontal: 5}}>
                          {route?.title}
                        </AppText>
                      </LinearGradient>
                    </View>
                  );
                }}
                indicatorStyle={{backgroundColor: 'transparent'}}
                style={{width: '100%', backgroundColor: 'transparent', elevation: 0}}
              />
              {index === 0 && (
                <View
                  style={{
                    height: 33,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    alignSelf: 'center',
                    paddingHorizontal: 20,
                    backgroundColor: '#3F3F3F',
                    marginTop: 10,
                  }}>
                  <AppText
                    weight={POPPINS_LIGHT}
                    style={{marginRight: 20, opacity: 0.8}}
                    type={ELEVEN}
                    color={WHITE}>
                    Sort By:
                  </AppText>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={DATA}
                    horizontal
                    renderItem={({item}) => (
                      <TouchableOpacityView
                        style={{
                          padding: 5,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          setSelectedFilter(item?.title);
                          allContestList ? filterDataTwo(item) : filterData(item);
                        }}>
                        <AppText type={TEN} weight={POPPINS_MEDIUM} style={{marginRight: 5}}>
                          {item?.title}
                        </AppText>
                        {item?.title === selectedFilter ? (
                          <FastImage
                            style={{
                              height: 10,
                              width: 8,
                              marginRight: 10,
                              transform: [{rotate: selectedHighLow === 'high' ? '270deg' : '90deg'}],
                            }}
                            source={rightArrow}
                            tintColor={colors.green}
                            resizeMode="contain"
                          />
                        ) : null}
                      </TouchableOpacityView>
                    )}
                  />
                  <TouchableOpacityView onPress={() => filterSheet.current.open()} style={styles.filtermainbackground}>
                    <FastImage
                      source={FILTER_ICON}
                      tintColor={colors.white}
                      style={{
                        height: 18,
                        width: 18,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacityView>
                </View>
              )}
            </>
          )}
        />

        <RBSheet
          ref={filterSheet}
          closeOnDragDown={false}
          height={Screen.Height * 0.75}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
              display: 'none',
            },
          }}>
          <FilterSheet
            onClose={() => filterSheet?.current?.close()}
            filterdata={filterdata}
            setFilterData={setFilterData}
            entry={entry}
            setEntry={setEntry}
            team={team}
            setTeam={setTeam}
            prize={prize}
            setPrize={setPrize}
            contest={contest}
            setContest={setContest}
          />
        </RBSheet>
        {shouldShowCreateButton() && (
          <View style={[
            styles.buttonContainer,
                {marginVertical: Platform.OS == 'ios' ? 20 : 10},
          ]}>
            <PrimaryButton
              buttonStyle={[
                styles.buttonStyle,
                    {marginTop: Platform.OS == 'ios' ? -5 : 0, marginBottom: 13, width: '100%'},
              ]}
              onPress={handleCreatePress}
              title={route.params?.matchType === 'scoreboard' ? 'CREATE SCOREBOARD' : 'CREATE TEAM'}
            />
          </View>
        )}
        <SpinnerSecond loading={isLoading} />
      </CommonImageBackground>
      <MatchLiveModal AleartLive={AleartLive} />
    </AppSafeAreaView>
  );
};

export default MyContest;
export const RenderTabBar = props => {
  const {onTabChange, saveTitle, filterSelectedPlayer, filterDataOfSorting, newAllPlayer, onSheet} =
    props;
  const DATA = [
    {
      id: 1,
      title: 'ENTRY',
    },
    {
      id: 2,
      title: 'SPOTS',
    },
    {
      id: 3,
      title: 'PRIZE POOL',
    },
    {
      id: 4,
      title: '%WINNER',
    },
  ];
  const [selectedFilter, setSelectedFilter] = useState();
  const [selectedHighLow, setSelectedHighLow] = useState('high');
  const dispatch = useDispatch();
  const allContestList = useSelector(state => state?.match?.allContestList);

  return (
    <>
      <>
        <TabBar
          {...props}
          onTabPress={e => {
            onTabChange(e?.route?.title);
          }}
          scrollEnabled={true}
          tabStyle={{
            width: Screen.Width / 3,
            backgroundColor: '#3F3F3F',
            height: 45,
            marginTop: 10,
          }}
          renderLabel={({route, focused}) => {
            const tabColors = focused
              ? [colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]
              : ['#3F3F3F', '#3F3F3F'];
            return (
              <View style={{height: 45, width: Screen.Width / 3}}>
                <LinearGradient
                  style={{
                    height: 45,
                    bottom: 1,
                    width: Screen.Width / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: route?.key === 'first' ? 42 : null,
                    borderBottomRightRadius: route?.key === 'first' ? 40 : null,
                    borderRadius: route?.key === 'second' || route?.key === 'third' ? 35 : null,
                    borderTopLeftRadius: route?.key === 'fourth' ? 35 : null,
                    borderBottomLeftRadius: route?.key === 'fourth' ? 35 : null,
                  }}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  colors={tabColors}>
                  <AppText
                    type={FORTEEN}
                    color={focused ? 'white' : 'black'}
                    weight={POPPINS_MEDIUM}
                    numberOfLines={1}
                    style={{paddingHorizontal: 5}}>
                    {route?.title}
                  </AppText>
                </LinearGradient>
              </View>
            );
          }}
          indicatorStyle={{backgroundColor: 'transparent'}}
          style={[{width: '100%', backgroundColor: 'transparent', elevation: 0}]}
        />
      </>

      {props.navigationState.index === 0 && (
        <View
          style={{
            height: 33,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: '100%',
            alignSelf: 'center',
            paddingHorizontal: 20,
            backgroundColor: '#3F3F3F',
            marginTop: 10,
          }}>
          <AppText
            weight={POPPINS_LIGHT}
            style={{marginRight: 20, opacity: 0.8}}
            type={ELEVEN}
            color={WHITE}>
            Sort By:
          </AppText>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={DATA}
            horizontal
            renderItem={({item}) => (
              <TouchableOpacityView
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSelectedFilter(item?.title);
                  allContestList ? filterDataTwo(item) : filterData(item);
                }}>
                <AppText type={TEN} weight={POPPINS_MEDIUM} style={{marginRight: 5}}>
                  {item?.title}
                </AppText>
                {item?.title === selectedFilter ? (
                  <FastImage
                    style={{
                      height: 10,
                      width: 8,
                      marginRight: 10,
                      transform: [{rotate: selectedHighLow === 'high' ? '270deg' : '90deg'}],
                    }}
                    source={rightArrow}
                    tintColor={colors.green}
                    resizeMode="contain"
                  />
                ) : null}
              </TouchableOpacityView>
            )}
          />
          <TouchableOpacityView onPress={onSheet} style={styles.filtermainbackground}>
            <FastImage
              source={FILTER_ICON}
              tintColor={colors.white}
              style={{
                height: 18,
                width: 18,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacityView>
        </View>
      )}
    </>
  );
};
