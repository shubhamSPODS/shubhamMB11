import React, {useEffect, useState, useCallback} from 'react';
import {FlatList, View, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation} from '@react-navigation/native';
import FastImage from "@d11/react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {Screen} from '../../theme/dimens';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import MatchCard from '../../components/matchCard/MatchCard';
import {personIcon, combine, notification} from '../../helper/image';
import {getMyMatches, setSelectedMatch, setLoading, setContestData} from '../../slices/matchSlice';
import styles from './styles';
import {
  AppText,
  BROWNYELLOW,
  EIGHTEEN,
  FIRST,
  FORTEEN,
  LIGHTPINK,
  LIGHTWHITE,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  THIRTEEN,
  TWELVE,
  WHITE,
  BLACKOPACITY,
} from '../../common/AppText';
import {flexOne, universalPaddingHorizontal} from '../../theme/dimens';
import {StatusBar} from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import {NLCColor, colors} from '../../theme/color';
import NavigationService from '../../navigation/NavigationService';
import {
  BOTTOM_TAB_HOMESCREEN,
  BOTTOM_TAB_PROFILE_SCREEN,
  Notification__SCREEN,
  MY_CONTEST,
} from '../../navigation/routes';
import PrimaryButton from '../../common/primaryButton';
import {HomeTopHeader} from '../../common/HomeTopHeader';
import MatchCardContest from '../../components/matchCard/MatchCardContest';

export const RenderTabBar = props => {
  return (
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
};

export const RenderSubTabBar = props => {
  return (
    <TabBar
      {...props}
      contentContainerStyle={{
        backgroundColor: '#111019',
      }}
      renderLabel={({route, focused}) => (
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'space-between',
            padding: 5,
            alignItems: 'center',
          }}>
          <AppText
            type={FORTEEN}
            color={focused ? BROWNYELLOW : WHITE}
            weight={POPPINS_MEDIUM}>
            {route?.title}
          </AppText>
          {focused ? (
            <LinearGradient
              style={{height: 2, width: 95}}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}></LinearGradient>
          ) : (
            <View style={{width: 95, height: 2}}></View>
          )}
        </View>
      )}
      indicatorStyle={{backgroundColor: 'transparent'}}
      scrollEnabled={!props.scrollEnabled ? props.scrollEnabled : true}
      tabStyle={[props.tabStyle]}
      pressColor={'transparent'}
      style={[styles.tabbar, props.style]}
    />
  );
};

export const ListEmptyComponent = ({title, activeTab}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
      }}>
      {activeTab == 'Live' ? (
        <AppText
          style={{textAlign: 'center', marginBottom: 20}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}
          color={WHITE}>
          {title
            ? title
            : `You haven't joined any that are live.\n Join contests for any of the upcoming matches`}
        </AppText>
      ) : activeTab == 'Upcoming' ? (
        <AppText
          style={{textAlign: 'center', marginBottom: 20}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}
          color={WHITE}>
          {title
            ? title
            : `You haven't joined any upcoming contests \n Join contests for any of the upcoming matches`}
        </AppText>
      ) : activeTab == 'Completed' ? (
        <AppText
          style={{textAlign: 'center', marginBottom: 20}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}
          color={WHITE}>
          {title
            ? title
            : `You haven't joined any completed contests \n Join contests for any of the upcoming matches`}
        </AppText>
      ) : (
        <AppText
          style={{textAlign: 'center', marginBottom: 20}}
          type={FORTEEN}
          weight={POPPINS_MEDIUM}
          color={WHITE}>
          {title || `No matches available for ${activeTab}`}
        </AppText>
      )}
      
      <PrimaryButton
        onPress={() => NavigationService.navigate(BOTTOM_TAB_HOMESCREEN)}
        smallBtn={styles.joinButtonMyContest}
        title="VIEW UPCOMING MATCHES"
        type={TWELVE}
      />
    </View>
  );
};

const MyMatches = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const [routes] = useState([
    { key: 'teams', title: 'Teams' },
    { key: 'scoreboard', title: 'Scoreboard' },
  ]);

  const [subRoutes] = useState([
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'live', title: 'Live' },
    { key: 'completed', title: 'Completed' },
  ]);

  const upcomingMatches = useSelector(state => state?.match?.upcomingMatches);
  const myMatchesHome = useSelector(state => state?.match?.myMatchesHome);
  const isLoading = useSelector(state => state?.match?.isLoading);
  const contestList = useSelector(state => state?.match?.contestList);

  console.log('MyMatches component - isLoading state:', isLoading);
  
  // Fetch my matches data when the component mounts with timeout protection
  useEffect(() => {
    console.log('MyMatches component mounted, fetching data...');
    
    // Set a timeout to force loading state to false after 10 seconds
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, forcing loading state to false');
        setLoadingTimeout(true);
        dispatch(setLoading(false));
      }
    }, 10000);
    
    // Fetch data
    dispatch(getMyMatches());
    
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [dispatch]);
  
  // Reset loading timeout when loading state changes
  useEffect(() => {
    if (!isLoading) {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Fetch updated data
    dispatch(getMyMatches());
    
    // Set a timeout to ensure refreshing state is reset
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  }, [dispatch]);

  const getMyJoinedMatches = () => {
    if (!myMatchesHome || !Array.isArray(myMatchesHome)) {
      console.log('No myMatchesHome data or not an array:', myMatchesHome);
      return [];
    }

    return myMatchesHome.filter(match => {
      // Check if the user has joined any contests for this match
      const hasJoinedContests = match.teams && Array.isArray(match.teams) && 
        match.teams.some(contest => contest.joined > 0);

      const isCompletedMatch = match.Status === 'Completed';
      const isLiveMatch = match.Status === 'Live';
      const hasTeamsData = match.teams && match.teams.length > 0;

      // Include this match if the user has joined contests, if it's a live match, or if it's a completed match with team data
      const shouldInclude = hasJoinedContests || isLiveMatch || (isCompletedMatch && hasTeamsData);
      
      // Log Maharashtra Premier League matches for debugging
      if (match.SeriesName?.includes('Maharashtra') || match.Team1vsTeam2?.includes('Eagle') || match.Team1vsTeam2?.includes('Puneri')) {
        console.log('🏏 Maharashtra Premier League Match Found:', {
          id: match._id,
          series: match.SeriesName,
          teams: match.Team1vsTeam2,
          status: match.Status,
          hasTeams: match.teams?.length,
          teamsData: match.teams,
          hasJoinedContests,
          isCompletedMatch,
          isLiveMatch,
          hasTeamsData,
          shouldInclude,
          contestsJoined: match.teams?.filter(contest => contest.joined > 0).length,
          startDateTime: match.StartDateTime
        });
      }
      
      return shouldInclude;
    });
  };

  const getMatchesByStatus = () => {
    const joinedMatches = getMyJoinedMatches();
  
    if (!joinedMatches.length) {
      console.log('No joined matches found');
      return [];
    }

    const currentDate = new Date();
    
    return joinedMatches.filter(match => {
      if (!match) return false;
      
      // Parse match date safely
      const matchDate = match.StartDateTime ? new Date(match.StartDateTime) : new Date();
      const isPastTime = matchDate < currentDate;
      
      let shouldInclude = false;
      let reason = '';
      
      // Filter by match status based on current tab
      if (subIndex === 0) { // Upcoming
        // For upcoming tab, include matches that are not past time and not completed/cancelled
        // But also include matches where user has joined contests, regardless of status
        const hasJoinedContests = match.teams && Array.isArray(match.teams) && 
          match.teams.some(contest => contest.joined > 0);
        
        shouldInclude = (!isPastTime && match.Status !== 'Completed' && match.Status !== 'Cancelled') || hasJoinedContests;
        reason = `Upcoming: (!isPastTime(${!isPastTime}) && Status!==Completed(${match.Status !== 'Completed'}) && Status!==Cancelled(${match.Status !== 'Cancelled'})) || hasJoinedContests(${hasJoinedContests})`;
      } else if (subIndex === 1) { // Live
        shouldInclude = match.Status === 'Live';
        reason = `Live: Status===Live(${match.Status === 'Live'})`;
      } else { // Completed
        shouldInclude = isPastTime || match.Status === 'Completed' || match.Status === 'Cancelled';
        reason = `Completed: isPastTime(${isPastTime}) || Status===Completed(${match.Status === 'Completed'}) || Status===Cancelled(${match.Status === 'Cancelled'})`;
      }
      
      // Log Maharashtra matches for debugging
      if (match.SeriesName?.includes('Maharashtra') || match.Team1vsTeam2?.includes('Eagle') || match.Team1vsTeam2?.includes('Puneri')) {
        console.log('🏏 Maharashtra Match Status Check:', {
          id: match._id,
          teams: match.Team1vsTeam2,
          status: match.Status,
          startDateTime: match.StartDateTime,
          isPastTime,
          currentSubTab: subIndex === 0 ? 'Upcoming' : subIndex === 1 ? 'Live' : 'Completed',
          shouldInclude,
          reason
        });
      }
      
      return shouldInclude;
    });
  };

  const getFilteredMatches = (matchType) => {
    const statusFilteredMatches = getMatchesByStatus();
    
    console.log('🎯 Tab filtering for:', matchType, 'statusFiltered length:', statusFilteredMatches.length);
    
    if (!statusFilteredMatches || statusFilteredMatches.length === 0) {
      console.log('No status filtered matches, returning empty array');
      return [];
    }
    
    // Filter matches based on the selected tab (teams or scoreboard)
    const filtered = statusFilteredMatches.filter(match => {
      if (!match) return false;
      
      let shouldShow = false;
      let reason = '';
      
      if (matchType === 'teams') {
        // Always show matches where the user has joined contests
        const hasJoinedContests = match.teams && Array.isArray(match.teams) && 
          match.teams.some(contest => contest.joined > 0);
          
        const hasTeams = match.teams && match.teams.length > 0;
        const hasContestDetails = match.contest_details && match.contest_details.length > 0;
        const isCompleted = match.Status === 'Completed';
        
        shouldShow = hasJoinedContests || hasTeams || hasContestDetails || isCompleted;
        reason = `Teams: hasJoinedContests(${hasJoinedContests}) || hasTeams(${hasTeams}) || hasContestDetails(${hasContestDetails}) || isCompleted(${isCompleted})`;
      } else {
        // For scoreboard tab
        const hasScorecard = match.scorecard && match.scorecard.length > 0;
        const isLive = match.Status === 'Live';
        const isCompleted = match.Status === 'Completed';
        shouldShow = hasScorecard || isLive || isCompleted;
        reason = `Scoreboard: hasScorecard(${hasScorecard}) || isLive(${isLive}) || isCompleted(${isCompleted})`;
      }
      
      return shouldShow;
    });
    
    // Log Maharashtra matches for debugging
    const maharashtraMatches = filtered.filter(m => 
      m && (m.SeriesName?.includes('Maharashtra') || 
      m.Team1vsTeam2?.includes('Eagle') || 
      m.Team1vsTeam2?.includes('Puneri'))
    );
    if (maharashtraMatches.length > 0) {
      console.log('Maharashtra matches that passed the filter:', 
        maharashtraMatches.map(m => ({
          id: m._id,
          teams: m.Team1vsTeam2,
          status: m.Status
        }))
      );
    }
    
    return filtered;
  };

  const renderItem = ({item, matchType}) => {
    if (!item) return null;
    

    const joinedContests = item.teams?.filter(t => t.joined > 0) || [];
    

    const joinedContest = item.teams?.find(t => t.joined > 0);
    
    const contest_category_id = joinedContest?.contest_category_id || "65ddb68ce2ddb20749839785"; 
    
    const match_contest_category_id = joinedContest?._id || "";
    
    console.log('Contest IDs for navigation:', {
      contest_category_id,
      match_contest_category_id,
      joinedContestId: joinedContest?._id
    });

    return (
      <MatchCard
        details={item}
        matchType={matchType}
        isFromMyMatch={true}
        tab={subIndex === 0 ? 'Upcoming' : subIndex === 1 ? 'Live' : 'Completed'}
        onPressScoreboard={() => {
          
          try {
            dispatch(setSelectedMatch(item));
            dispatch(setContestData({...item, isFromMyMatch: true, tab: subIndex === 0 ? 'Upcoming' : subIndex === 1 ? 'Live' : 'Completed', isHome: false}));
            
            console.log('🎯 Attempting navigation to MY_CONTEST with params:', {
              matchId: item._id,
              matchType: 'scoreboard',
              TeamA: item.TeamA,
              TeamB: item.TeamB,
              isFromMyMatch: true,
              contestId: item.contestId,
              details: {
                contest_category_id: contest_category_id,
                match_contest_category_id: match_contest_category_id
              }
            });
            
            navigation.navigate(MY_CONTEST, {
              matchId: item._id,
              matchType: 'scoreboard',
              TeamA: item.TeamA,
              TeamB: item.TeamB,
              isFromMyMatch: true,
              contestId: item.contestId,
              details: {
                contest_category_id: contest_category_id,
                match_contest_category_id: match_contest_category_id
              }
            });
            
          } catch (error) {
            console.error('🎯 Navigation error:', error);
          }
        }}
      />
    );
  };

  const renderSubScene = (matchType) => SceneMap({
    upcoming: () => {
      const filteredMatches = getFilteredMatches(matchType);
      const matchesWithContests = filteredMatches.map(match => {
        if (!match) return null;
        
        // Count joined contests for this match
        const joinedContests = match.teams?.filter(t => t.joined > 0) || [];
        const totalContests = match.teams?.length || 0;
        
        return {
          ...match,
          teams: match.teams || [],
          contest_details: match.contest_details || contestList?.data?.filter(contest => contest.matchid === match._id) || [],
          countTeam: joinedContests.length, 
          countContest: totalContests, 
        };
      }).filter(Boolean); 
      console.log('Upcoming matches with contest data:', matchesWithContests.map(m => ({
        id: m._id,
        teamsCount: m.teams?.length,
        joinedContests: m.teams?.filter(t => t.joined > 0).length,
        contestDetailsCount: m.contest_details?.length,
        countTeam: m.countTeam,
        countContest: m.countContest,
        highestPrizepool: m.teams?.length > 0 ? Math.max(...m.teams.map(t => Number(t.winning_amount || 0))) : 0
      })));

      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={localStyles.flatlistContainer}
          contentContainerStyle={localStyles.scrollContent}>
          {matchesWithContests?.map((item, idx) => {
            if (!item) return null;
            return (
              <View key={`${matchType}-upcoming-${item._id || idx}`}>
                {renderItem({item, matchType})}
              </View>
            );
          })}
          {matchesWithContests?.length === 0 && (
            <ListEmptyComponent activeTab="Upcoming" />
          )}
        </ScrollView>
      );
    },
    live: () => {
      const filteredMatches = getFilteredMatches(matchType);
      const matchesWithContests = filteredMatches.map(match => {
        if (!match) return null;
        
        const joinedContests = match.teams?.filter(t => t.joined > 0) || [];
        const totalContests = match.teams?.length || 0;
        
        return {
          ...match,
          teams: match.teams || [],
          contest_details: match.contest_details || contestList?.data?.filter(contest => contest.matchid === match._id) || [],
          countTeam: joinedContests.length, 
          countContest: totalContests, 
        };
      }).filter(Boolean); 

      console.log('Live matches with contest data:', matchesWithContests.map(m => ({
        id: m._id,
        teamsCount: m.teams?.length,
        joinedContests: m.teams?.filter(t => t.joined > 0).length,
        contestDetailsCount: m.contest_details?.length,
        countTeam: m.countTeam,
        countContest: m.countContest,
        highestPrizepool: m.teams?.length > 0 ? Math.max(...m.teams.map(t => Number(t.winning_amount || 0))) : 0
      })));

      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={localStyles.flatlistContainer}
          contentContainerStyle={localStyles.scrollContent}>
          {matchesWithContests?.map((item, idx) => {
            if (!item) return null;
            return (
              <View key={`${matchType}-live-${item._id || idx}`}>
                {renderItem({item, matchType})}
              </View>
            );
          })}
          {matchesWithContests?.length === 0 && (
            <ListEmptyComponent activeTab="Live" />
          )}
        </ScrollView>
      );
    },
    completed: () => {
      const filteredMatches = getFilteredMatches(matchType);
      const matchesWithContests = filteredMatches.map(match => {
        if (!match) return null;
        
        const joinedContests = match.teams?.filter(t => t.joined > 0) || [];
        const totalContests = match.teams?.length || 0;
        
        return {
          ...match,
          teams: match.teams || [],
          contest_details: match.contest_details || contestList?.data?.filter(contest => contest.matchid === match._id) || [],
          countTeam: joinedContests.length,
          countContest: totalContests,
        };
      }).filter(Boolean); 

      console.log('Completed matches with contest data:', matchesWithContests.map(m => ({
        id: m._id,
        teamsCount: m.teams?.length,
        joinedContests: m.teams?.filter(t => t.joined > 0).length,
        contestDetailsCount: m.contest_details?.length,
        countTeam: m.countTeam,
        countContest: m.countContest,
        highestPrizepool: m.teams?.length > 0 ? Math.max(...m.teams.map(t => Number(t.winning_amount || 0))) : 0
      })));

      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={localStyles.flatlistContainer}
          contentContainerStyle={localStyles.scrollContent}>
          {matchesWithContests?.map((item, idx) => {
            if (!item) return null;
            return (
              <View key={`${matchType}-completed-${item._id || idx}`}>
                {renderItem({item, matchType})}
              </View>
            );
          })}
          {matchesWithContests?.length === 0 && (
            <ListEmptyComponent activeTab="Completed" />
          )}
        </ScrollView>
      );
    },
  });

  useEffect(() => {
    dispatch(getMyMatches());
  }, []);

  const renderScene = SceneMap({
    teams: () => (
      <TabView
        navigationState={{ index: subIndex, routes: subRoutes }}
        renderScene={renderSubScene('teams')}
        onIndexChange={setSubIndex}
        initialLayout={{ width: Screen.Width }}
        renderTabBar={RenderSubTabBar}
      />
    ),
    scoreboard: () => (
      <TabView
        navigationState={{ index: subIndex, routes: subRoutes }}
        renderScene={renderSubScene('scoreboard')}
        onIndexChange={setSubIndex}
        initialLayout={{ width: Screen.Width }}
        renderTabBar={RenderSubTabBar}
      />
    ),
  });

  return (
    <AppSafeAreaView statusColor={true} hidden={false}>
      <CommonImageBackground common>
        <HomeTopHeader
          walletIcon={true}
          personClick={() => NavigationService.openDrawer()}
        />

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Screen.Width }}
          renderTabBar={RenderTabBar}
          style={localStyles.tabView}
        />
      </CommonImageBackground>
      {isLoading && !loadingTimeout && <SpinnerSecond loading={true} />}
    </AppSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: universalPaddingHorizontal,
    paddingBottom: 20,
  },
  tabView: {
    flex: 1,
  },
});

export default MyMatches;