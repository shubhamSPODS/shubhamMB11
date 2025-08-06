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
  Dimensions,
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
import appOperation from '../../Backend/Backend';
import SelectScoreboard from '../../components/selectScoreboard/SelectScoreboard';


const MyContest = () => {
  const dispatch = useDispatch();
  const sheet = useRef();
  const route = useRoute();
  const filterSheet = useRef();
  const AleartLive = useRef();
  const selectScoreboard = useRef();
  
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
  const {matchType = 'teams', matchId, matchDetails, details: routeDetails} = route.params || {};
  const layout = useWindowDimensions();

  const onRefresh = useCallback(async () => {
    // If we have matchDetails from scoreboard navigation, set it as contest data
    if (matchDetails && matchType === 'scoreboard') {
      dispatch(setContestData(matchDetails));
    }
    
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
  }, [effectiveMatchId, SeriesId, dispatch, matchType, matchDetails]);
  
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
  const matchIdFromMatchDetails = matchDetails?._id;
  const effectiveMatchId = _id || matchIdFromParams || matchIdFromMatchDetails;
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // If we have matchDetails from scoreboard navigation, set it as contest data
        if (matchDetails && matchType === 'scoreboard') {
          dispatch(setContestData(matchDetails));
        }
        
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
    }, [effectiveMatchId, SeriesId, dispatch, matchType, matchDetails]),
  );
  useEffect(() => {
    dispatch(getKycDetails());
  }, []);

  // Auto-refresh contest data when user is redirected to Contest tab after joining
  useEffect(() => {
    if (index === 0) { // Contest tab (FirstRoute)
      console.log('🔄 Contest tab active - refreshing contest data');
      let outputObject = {};
      dispatch(getContestList(outputObject, effectiveMatchId));
    }
  }, [index, effectiveMatchId, dispatch]);

  const renderItem = ({item}) => {
    // Find the actual contest instance from the API response data
    const actualContestInstance = contestList?.data?.find(category => 
      category?.data?.some(contestData => 
        contestData.contest_category_id === item?.contest_category_id &&
        contestData.shadow_contest_id === item?.shadow_contest_id
      )
    )?.data?.find(contestData => 
      contestData.contest_category_id === item?.contest_category_id &&
      contestData.shadow_contest_id === item?.shadow_contest_id
    );

    console.log('🎯 [RENDER ITEM] Found actual contest instance:', {
      found: !!actualContestInstance,
      actualContestId: actualContestInstance?._id,
      itemId: item?._id,
      contestCategoryId: item?.contest_category_id,
      shadowContestId: item?.shadow_contest_id
    });

    return (
      <ContestCard
        details={{
          ...item,
          ...(actualContestInstance && { 
            _id: actualContestInstance._id, // This is the actual contest instance ID
            match_contest_category_id: actualContestInstance._id // This is the actual contest instance ID
          }),
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
    return <MyContestList item={item} matchDetails={route?.params} />;
  };

  const renderContest = ({item}) => {
    console.log('🎯 [RENDER CONTEST] Processing item:', {
      itemId: item?._id,
      itemContestCategoryId: item?.contest_category_id,
      itemJoinWithMULT: item?.JoinWithMULT,
      itemTeams: item?.teams
    });

    // Find the contest category details from the API response
    const contestCategoryDetails = contestList?.data?.find(category => 
      category?.contest_category_details?.some(detail => 
        detail._id === item?.contest_category_id
      )
    )?.contest_category_details?.find(detail => 
      detail._id === item?.contest_category_id
    );

    console.log('🎯 [RENDER CONTEST] Found category details:', {
      found: !!contestCategoryDetails,
      categoryDetails: contestCategoryDetails
    });

    // Find the actual contest instance from the API response data
    const actualContestInstance = contestList?.data?.find(category => 
      category?.data?.some(contestData => 
        contestData.contest_category_id === item?.contest_category_id &&
        contestData.shadow_contest_id === item?.shadow_contest_id
      )
    )?.data?.find(contestData => 
      contestData.contest_category_id === item?.contest_category_id &&
      contestData.shadow_contest_id === item?.shadow_contest_id
    );

    console.log('🎯 [RENDER CONTEST] Found actual contest instance:', {
      found: !!actualContestInstance,
      actualContestId: actualContestInstance?._id,
      itemId: item?._id,
      contestCategoryId: item?.contest_category_id,
      shadowContestId: item?.shadow_contest_id
    });

    // Prefer using the contest object from myContest (if available)
    const joinedContest = myContest?.find(c => c._id === item._id || c.contest_category_id === item.contest_category_id);
    const contestListObj = (contestList?.data || []).find(
      c => c._id === item._id || c.contest_category_id === item.contest_category_id
    ) || item;
    
    // Merge all data sources with priority: actualContestInstance > categoryDetails > contestListObj > joinedContest > item
    const fullContestDetails = { 
      ...item,
      ...contestListObj, 
      ...joinedContest,
      ...contestCategoryDetails, // This should have JoinWithMULT and teams
      ...(actualContestInstance && { 
        _id: actualContestInstance._id, // This is the actual contest instance ID
        match_contest_category_id: actualContestInstance._id // This is the actual contest instance ID
      }),
      // Ensure JoinWithMULT and teams are preserved from category details
      JoinWithMULT: contestCategoryDetails?.JoinWithMULT || item?.JoinWithMULT,
      teams: contestCategoryDetails?.teams || item?.teams
    };

    console.log('🎯 [RENDER CONTEST] Final contest details:', {
      contestId: fullContestDetails?._id,
      contestCategoryId: fullContestDetails?.contest_category_id,
      JoinWithMULT: fullContestDetails?.JoinWithMULT,
      teams: fullContestDetails?.teams,
      isMultipleEntry: fullContestDetails?.JoinWithMULT === true || fullContestDetails?.teams > 1
    });

    return (
      <ContestCard
        details={fullContestDetails}
        totalTeamCount={myTeam?.length}
        matchType={matchType}
        matchDetails={contestData}
        onPress={() => {
          dispatch(setContestData(contestData)); 
          NavigationService.navigate(MY_CONTEST, {
            contestId: item?._id,
            matchId: contestData?._id,
            teamId: item?.teamId,
            matchType: contestData?.Type,
            selectedContest: fullContestDetails, 
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
          ? 'My Contest'
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

    // Create a unique key that changes when contest data is updated
    const contestDataKey = useMemo(() => {
      const contestListData = contestList?.data || [];
      const dataHash = JSON.stringify(contestListData.map(cat => ({
        id: cat._id,
        dataLength: cat.data?.length,
        joinedCount: cat.data?.reduce((sum, contest) => sum + (contest.joined || 0), 0)
      })));
      return `contest-${effectiveMatchId}-${dataHash}`;
    }, [contestList?.data, effectiveMatchId]);

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
          key={contestDataKey}
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
    console.log('🎯 SecondRoute myContest data:', {
      myContestLength: myContest?.length || 0,
      myContestData: myContest,
      isFromMyMatch: route?.params?.isFromMyMatch
    });
    
    // Alternative approach: Get all contests and filter for joined ones
    const allContests = contestData?.teams || [];
    
    // Map correct contest_category_id from API response to each contest
    const mappedContests = allContests.map(contest => {
      // Find the matching contest in the API response to get the correct contest_category_id
      const apiContest = contestList?.data?.find(apiContest => 
        apiContest.data?.some(contestData => 
          contestData._id === contest._id || 
          contestData.shadow_contest_id === contest.shadow_contest_id
        )
      );
      
      const correctContestData = apiContest?.data?.find(contestData => 
        contestData._id === contest._id || 
        contestData.shadow_contest_id === contest.shadow_contest_id
      );
      
      if (correctContestData?.contest_category_id) {
        console.log('🎯 Mapping contest_category_id:', {
          contestId: contest._id,
          oldContestCategoryId: contest.contest_category_id,
          newContestCategoryId: correctContestData.contest_category_id
        });
        
        return {
          ...contest,
          contest_category_id: correctContestData.contest_category_id
        };
      }
      
      return contest;
    });
    
    const joinedContests = mappedContests.filter(contest => contest.joined > 0);
    console.log('🎯 Alternative approach - all contests:', allContests.length, 'joined contests:', joinedContests.length);
    
    if (matchType === 'scoreboard') {
      console.log('📋 My scoreboard contests data:', myScoreboardContests);
      
      const transformScoreboardContests = () => {
        const contestGroups = {};
        myScoreboardContests.forEach((scoreboard, index) => {
          // For scoreboard contests, we should use shadow_contest_id as the key
          const contestId = scoreboard.shadow_contest_id || scoreboard.contest_id;
          if (!contestGroups[contestId]) {
            const matchingContest = contestData?.scorecard?.find(c => 
              c.shadow_contest_id === contestId || 
              c._id === contestId
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
              contest_category_id: matchingContest?.contest_category_id,
              shadow_contest_id: contestId, // Use shadow_contest_id consistently
              scoreboardDetails: [],
              data: {
                WinningAmount: matchingContest?.winning_amount || 100,
                EnteryFee: matchingContest?.EntryFee || 1,
                Contestsize: matchingContest?.ContestSize || 100,
                Rankdata: [{Price: matchingContest?.winning_amount || 100}],
                JoinWithMULT: true,
                teams: [], 
                joined: 0 
              },
              contest_details: {
                joined: 0,
                winning_amount: matchingContest?.winning_amount || 100,
                shadow_contest_id: contestId, // Use shadow_contest_id consistently
                contest_category_id: matchingContest?.contest_category_id
              },
              Winning_percent: 10, 
              JoinWithMULT: true,
              contest_type: 'ScoreCard',
              ContestType: 'ScoreCard',
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

            // Use alternative data source if API returns only one contest
        const contestDataToShow = myContest?.length <= 1 && joinedContests?.length > 0 ? joinedContests : myContest;
        console.log('🎯 Using contest data:', {
          myContestLength: myContest?.length || 0,
          joinedContestsLength: joinedContests?.length || 0,
          finalDataLength: contestDataToShow?.length || 0,
          usingAlternative: myContest?.length <= 1 && joinedContests?.length > 0
        });
        
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
                  data={contestDataToShow}
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
                  keyExtractor={(item, index) => item?._id || index.toString()}
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
                  data={contestDataToShow}
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
                  keyExtractor={(item, index) => item?._id || index.toString()}
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
      // For Teams matches, show only team list (no leaderboard)
      return (
        <View style={{ flex: 1 }}>
          {myTeam?.length > 0 && (
            <AppText 
              style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 15, marginVertical: 10 }}
              weight={POPPINS_SEMI_BOLD}>
              My Teams ({myTeam?.length || 0})
            </AppText>
          )}
          {myTeam?.length === 0 ? (
            <View style={{
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center', 
              paddingVertical: 20,
              minHeight: 200
            }}>
              <View style={{alignItems: 'center'}}>
                <AppText style={{fontSize: 16, textAlign: 'center', marginBottom: 10}} weight={POPPINS_SEMI_BOLD}>
                  No Teams Created yet
                </AppText>
                <AppText style={{fontSize: 14, textAlign: 'center', color: '#888'}} weight={POPPINS_MEDIUM}>
                  Create your First Prediction!
                </AppText>
              </View>
            </View>
          ) : (
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
          )}
        </View>
      );
    } else {
      return React.useMemo(() => (
        <ScoreboardList 
          key={`scoreboard-${_id}`} 
          matchIdProp={_id} 
          contestData={contestData}
        />
      ), [_id, contestData]);
    }
  }, [matchType, myTeam, renderMyTeam, keyExtractor, handleRefresh, isLoading, _id]);

  const renderScene = React.useMemo(() => SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  }), [FirstRoute, SecondRoute, ThirdRoute]);

  const handleCreatePress = async () => {
    // Check if match is live and lineup is not out
    if (contestData?.Status === 'Live' && contestData?.game_state !== 2) {
      console.log('🚫 Blocking team creation - match is Live but lineup is not out');
      toastAlert.showToastError('Cannot create team while match is live');
      return;
    }
    
    if (matchType === 'scoreboard') {
      try {
        // Check if user already has scoreboards for this match
        const response = await appOperation.customer.getUserScoreCard(_id);
        
        if (response?.success && response?.data && response?.data.length > 0) {
          console.log('✅ User has existing scoreboards - opening SelectScoreboard screen');
          // Open the SelectScoreboard RBSheet directly
          selectScoreboard?.current?.open();
        } else {
          console.log('📝 User has no scoreboards - navigating to create scoreboard screen');
          NavigationService.navigate(SCOREBOARD_CREATE, {
            ...contestData,
            isFromMyMatch,
          });
        }
      } catch (error) {
        console.error('Error checking existing scoreboards:', error);
        // If error occurs, navigate to create screen
        NavigationService.navigate(SCOREBOARD_CREATE, {
          ...contestData,
          isFromMyMatch,
        });
      }
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
    
    // Show the button when game_state is 2 (lineup is out) - users can still join even if match is Live
    if (contestData?.game_state === 2) {
      console.log('✅ Create button shown - lineup is out but users can still join (game_state: 2)');
      return true;
    }
    
    // Hide the button for Live matches (only if game_state is not 2)
    if (contestData?.Status === 'Live') {
      console.log('🚫 Create button hidden - match is Live and lineup not available');
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
            <AppText>{matchType === 'scoreboard' ? 'Scoreboard Match' : 'Select Contest'}</AppText>
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
        
        <RBSheet
          ref={selectScoreboard}
          closeOnDragDown={false}
          openDuration={100}
          height={Dimensions.get('window').height}
          customStyles={{
            container: {
              backgroundColor: colors.linerWhite,
            },
            draggableIcon: {
              backgroundColor: 'transparent',
              display: 'none',
            },
          }}>
          <SelectScoreboard
            contestDetails={null} // We'll pass contest details when needed
            matchDetails={contestData}
            onClose={() => selectScoreboard?.current?.close()}
            selectScoreboard={selectScoreboard}
            supportsMultipleEntries={false}
          />
        </RBSheet>
        {(() => {
          const shouldShow = shouldShowCreateButton();
          return shouldShow;
        })() && (
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
