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
  getMyTeam,
  getTab,
  setAllContest,
  setAllPlayers,
  setIsContestEntry,
  setLoading,
} from '../../slices/matchSlice';
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
  const layout = useWindowDimensions();
  const {matchType} = route.params || {matchType: 'teams'};
  
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
  useFocusEffect(
    useCallback(() => {
      let outputObject = {};
      dispatch(getContestList(outputObject, _id));
      dispatch(getMyTeam(_id));
      dispatch(getMyJoinedContest(_id));
      dispatch(MycreateContest(_id));
      let data = {cid: SeriesId};
      dispatch(getAllPlayerList(_id, data));
    }, []),
  );
  useEffect(() => {
    dispatch(getKycDetails());
  }, []);

  const renderItem = ({item}) => {
    // console.log('Rendering item:', item);
    return (
      <ContestCard
        details={item}
        totalTeamCount={myTeam?.length}
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
    return <MyContestList item={item} matchDetails={route?.params} />;
  };
  const renderContest = ({item}) => {
    return (
      <>
        <ContestCard details={item} totalTeamCount={myTeam?.length} />
      </>
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
  const EmptyComponentTwo = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText
          style={{
            color: 'white',
            fontSize: 14,
            textAlign: 'center',
          }}>
          You haven't created a team yet!{'\n'}The first step to winning starts
          here.
        </AppText>
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
  const [index, setIndex] = React.useState(0);
  useEffect(() => {
    if (myContest) {
      const initializedRoutes = [
        {
          key: 'first',
          title:
            route?.params?.isFromMyMatch == true
              ? `MyContest (${myContest?.length + MyCreateContestData?.length})`
              : 'Contest',
        },
        {
          key: 'second',
          title:
            route?.params?.isFromMyMatch == true
              ? matchType === 'teams' ? `My Team (${myTeam?.length})` : 'My Scoreboard'
              : 'My Contest',
        },
        {
          key: 'third',
          title:
            route?.params?.isFromMyMatch == true 
              ? 'Player Stats' 
              : matchType === 'teams' 
                ? `My Team (${myTeam?.length})` 
                : 'My Scoreboard',
        },
      ];
      setRoutes(initializedRoutes);
    }
  }, [myContest, myTeam, matchType]);

  const [routes, setRoutes] = React.useState([
    {
      key: 'first',
      title: route?.params?.isFromMyMatch == true ? `MyContest (${0})` : 'Contest',
    },
    {
      key: 'second',
      title: route?.params?.isFromMyMatch == true ? matchType === 'teams' ? `My Team (${0})` : 'My Scoreboard' : 'My Contest',
    },
    {
      key: 'third',
      title: route?.params?.isFromMyMatch == true ? 'Player Stats' : matchType === 'teams' ? `My Team (${0})` : 'My Scoreboard',
    },
  ]);
  const [removeTabs, setRemoveTabs] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const FirstRoute = () => {
    const contestData = contestList?.data?.[0]?.data || [];
    // console.log('Contest Data in FirstRoute:', contestData);
    
    return (
      <>
        {route?.params?.isFromMyMatch == true ? (
          <View style={{flex: 1}}>
            <FlatList
              data={myContest}
              showsVerticalScrollIndicator={false}
              renderItem={renderMyContest}
              ListHeaderComponent={renderMyCreateContest}
              ListEmptyComponent={<EmptyComponent />}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={() => handleRefresh('my contest')}
                />
              }
              style={{
                width: '100%',
                alignSelf: 'center',
                flex: flexOne,
              }}
              contentContainerStyle={{
                flexGrow: flexOne,
              }}
            />
          </View>
        ) : (
          <View style={{width: Screen.Width - 10, alignSelf: 'center', marginTop: 5}}>
            {SortbyFilterData?.length > 0 ? (
              <FlatList
                data={SortbyFilterData}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{marginTop: 10}}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => {
                  return <View style={{height: 80}} />;
                }}
              />
            ) : (
              <>
                {!route?.params?.isFromMyMatch && (
                  <FlatList
                    data={contestData}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => handleRefresh('contest')}
                      />
                    }
                    style={{width: '100%', alignSelf: 'center'}}
                    ListEmptyComponent={() => (
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                        <AppText weight={POPPINS_MEDIUM}>
                          No contests available for this match
                        </AppText>
                      </View>
                    )}
                  />
                )}
              </>
            )}
          </View>
        )}
      </>
    );
  };
  const SecondRoute = () => {
    return (
      <>
        {route?.params?.isFromMyMatch == true ? (
          <View
            style={{
              flex: flexOne,
            }}>
            <FlatList
              data={myTeam}
              renderItem={renderMyTeam}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyComponentTwo />}
              contentContainerStyle={{ paddingBottom: 10 }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => handleRefresh('my team')}
                />
              }
              style={{
                width: '100%',
                flex: flexOne,
                alignSelf: 'center',
              }}
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
  };

  const ThirdRoute = () => {
    return (
      <View style={{ flex: 1 }}>
        {matchType === 'teams' ? (
          <FlatList
            data={myTeam}
            showsVerticalScrollIndicator={false}
            renderItem={renderMyTeam}
            ListEmptyComponent={<EmptyComponentTwo />}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => handleRefresh('my team')}
              />
            }
            style={{
              width: '100%',
              alignSelf: 'center',
              flex: flexOne,
            }}
            contentContainerStyle={{
              flexGrow: flexOne,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          />
        ) : (
          <List />
        )}
      </View>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
      case 'second':
        return <SecondRoute />;
      case 'third':
        return <ThirdRoute />;
      default:
        return null;
    }
  };

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
                  <TouchableOpacityView
                    onPress={() => filterSheet.current.open()}
                    style={styles.filtermainbackground}>
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
        {activeTab !== 2 &&
          !route?.params?.isFromMyMatch &&
          isPastTime != 'false' && (
            <View
              style={[
                styles.buttonContainer,
                {marginVertical: Platform.OS == 'ios' ? 20 : 10},
              ]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10}}>
                <PrimaryButton
                  buttonStyle={[
                    styles.buttonStyle,
                    {marginTop: Platform.OS == 'ios' ? -5 : 0, marginBottom: 13, width: '100%'},
                  ]}
                  onPress={handleCreatePress}
                  title={matchType === 'teams' ? 'CREATE TEAM' : 'CREATE SCOREBOARD'}
                />
              </View>
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
