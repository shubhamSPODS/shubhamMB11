import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { AppText, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, WHITE } from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import { colors } from '../../theme/color';
import CommonImageBackground from '../../common/commonImageBackground';
import FastImage from "@d11/react-native-fast-image";
import { backIconMain } from '../../helper/image';
import { appOperation } from '../../appOperation';
import { toastAlert } from '../../helper/utility';
import { Screen } from '../../theme/dimens';
import { SpinnerSecond } from '../../common/SpinnerSecond';

// Global error tracking to persist across component remounts
const globalErrorState = {
  lastErrorTime: 0,
  lastErrorMatchId: null,
  hasShownErrorForMatch: new Set(),
  
  // Clean up old error states (older than 5 minutes)
  cleanup: () => {
    const now = Date.now();
    if (now - globalErrorState.lastErrorTime > 300000) { // 5 minutes
      globalErrorState.hasShownErrorForMatch.clear();
      globalErrorState.lastErrorTime = 0;
      globalErrorState.lastErrorMatchId = null;
      console.log('🧹 Cleaned up global error state');
    }
  }
};

const ScoreboardCard = ({ item, contestData, upcomingMatches, onPress }) => {
  const predictions = item.predictions || item.data?.predictions || [];
  
  if (!predictions || predictions.length === 0) {
    return (
      <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <View style={styles.cardTopSection}>
          <AppText weight={POPPINS_MEDIUM} color={WHITE}>
            Invalid scoreboard data
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
  
  const previewOvers = predictions.slice(0, 5);
  const totalRuns = predictions.reduce((sum, over) => sum + (over.runs || 0), 0);
  
  // Find the match from upcoming matches to get its type
  const currentMatch = upcomingMatches?.find(match => 
    match._id === contestData?._id || 
    match.MatchId === contestData?.MatchId ||
    match.match_id === contestData?.match_id ||
    match._id === item?.match_id ||
    match.MatchId === item?.match_id
  );
  
  // Try to get match type from multiple sources, prioritizing exact match type data
  let matchType = item.match_details?.Type || 
                   item.matchDetails?.Type || 
                   item.Type || 
                   item.match_details?.match_type ||
                   item.matchDetails?.match_type ||
                   item.match_type ||
                   contestData?.Type ||
                   contestData?.match_type ||
                   contestData?.contestAllInfo?.Type ||
                   contestData?.contestAllInfo?.match_type ||
                   currentMatch?.Type ||
                   currentMatch?.match_type;
  
  // If no match type found, try to extract from series name
  if (!matchType) {
    const seriesName = contestData?.SeriesName || currentMatch?.SeriesName || item?.SeriesName;
    if (seriesName) {
      if (seriesName.includes('T10')) matchType = 'T10';
      else if (seriesName.includes('T20')) matchType = 'T20';
      else if (seriesName.includes('T50')) matchType = 'T50';
      else if (seriesName.includes('ODI')) matchType = 'ODI';
      else if (seriesName.includes('Test')) matchType = 'Test';
    }
  }
  
  // Fallback to T20 if still no match type found
  if (!matchType) {
    matchType = 'T20';
  }
  
  console.log('ScoreboardCard item:', {
    id: item._id,
    predictionsLength: predictions.length,
    totalRuns,
    matchType,
    samplePrediction: predictions[0],
    itemMatchDetails: item.match_details,
    itemMatchDetailsType: item.match_details?.Type,
    contestDataType: contestData?.Type,
    contestDataMatchType: contestData?.match_type,
    contestDataContestAllInfo: contestData?.contestAllInfo,
    currentMatch: currentMatch,
    currentMatchType: currentMatch?.Type,
    currentMatchSeriesName: currentMatch?.SeriesName,
    itemMatchId: item?.match_id,
    contestDataId: contestData?._id,
    contestDataMatchId: contestData?.MatchId,
    upcomingMatchesLength: upcomingMatches?.length
  });
  
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTopSection}>
        <View style={styles.matchInfoSection}>
          <View style={styles.matchTypeBadge}>
            <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.matchTypeText}>
              {matchType}
            </AppText>
          </View>
        </View>
        <View style={styles.totalRunsContainer}>
          <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.totalRunsText}>
            {totalRuns}
          </AppText>
          <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.totalRunsLabel}>
            Total Runs
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.oversContainer}>
        <View style={styles.oversHeader}>
          <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} style={styles.oversTitle}>
            Over by Over ({predictions.length} overs)
          </AppText>
          {predictions.length > 5 && (
            <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.moreOversText}>
              +{predictions.length - 5} more
            </AppText>
          )}
        </View>
        <View style={styles.oversGrid}>
          {previewOvers.map((over, index) => (
            <View key={over.over_number || index} style={styles.overItem}>
              <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.overLabel}>
                Over {over.over_number || (index + 1)}
              </AppText>
              <View style={styles.runsBox}>
                <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.runsText}>
                  {over.runs || 0}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const List = ({ matchIdProp, contestData: contestDataProp }) => {
  const route = useRoute();
  const contestData = useSelector(state => state?.match?.contestData);
  const upcomingMatches = useSelector(state => state?.match?.upcomingMatches);
  
  // Use contestData from props if available, otherwise use from Redux
  const effectiveContestData = contestDataProp || contestData;
  
  const [scoreboards, setScoreboards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(false);

  // Extract match ID from multiple sources with priority order
  const matchId = matchIdProp || 
                 route.params?.matchId || 
                 route.params?.matchDetails?.MatchId || 
                 effectiveContestData?._id || 
                 effectiveContestData?.MatchId ||
                 effectiveContestData?.match_id;

  console.log('=== SCOREBOARD LIST DEBUG ===');
  console.log('Props matchIdProp:', matchIdProp);
  console.log('Props contestDataProp:', contestDataProp);
  console.log('Redux contestData:', contestData);
  console.log('Effective contestData:', effectiveContestData);
  console.log('Route params:', JSON.stringify(route.params, null, 2));
  console.log('Extracted matchId:', matchId);
  console.log('Current isFetching state:', isFetchingRef.current);
  console.log('Component mounted:', isMountedRef.current);
  console.log('Global error state:', {
    lastErrorTime: globalErrorState.lastErrorTime,
    lastErrorMatchId: globalErrorState.lastErrorMatchId,
    hasShownErrorForMatch: Array.from(globalErrorState.hasShownErrorForMatch)
  });

  // Set mounted flag on component mount
  useEffect(() => {
    isMountedRef.current = true;
    console.log('🎯 ScoreboardList component mounted');
    
    return () => {
      isMountedRef.current = false;
      console.log('🎯 ScoreboardList component unmounted');
    };
  }, []);

  const showErrorToast = (message) => {
    // Suppress the specific "No score card found for this match" message
    if (message && message.toLowerCase().includes('no score card found for this match')) {
      console.log('🚨 Suppressing toast message:', message);
      return;
    }
    
    // Clean up old error states first
    globalErrorState.cleanup();
    
    const now = Date.now();
    const timeSinceLastError = now - globalErrorState.lastErrorTime;
    const hasShownForThisMatch = globalErrorState.hasShownErrorForMatch.has(matchId);
    
    // Only show error if:
    // 1. It's been more than 3 seconds since the last error, OR
    // 2. This is a different match ID, OR
    // 3. We haven't shown an error for this specific match yet
    if (timeSinceLastError > 3000 || globalErrorState.lastErrorMatchId !== matchId || !hasShownForThisMatch) {
      console.log('🚨 Showing error toast:', message);
      console.log('🚨 Error conditions:', {
        timeSinceLastError,
        lastErrorMatchId: globalErrorState.lastErrorMatchId,
        currentMatchId: matchId,
        hasShownForThisMatch
      });
      
      toastAlert.showToastError(message);
      globalErrorState.lastErrorTime = now;
      globalErrorState.lastErrorMatchId = matchId;
      globalErrorState.hasShownErrorForMatch.add(matchId);
    } else {
      console.log('🚨 Skipping error toast - already shown recently for this match');
    }
  };

  const clearErrorForMatch = () => {
    globalErrorState.hasShownErrorForMatch.delete(matchId);
    console.log('✅ Cleared error state for match:', matchId);
  };

  const fetchScoreboards = async () => {
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      console.log('⚠️ API call already in progress, skipping...');
      return;
    }

    // Check if component is still mounted
    if (!isMountedRef.current) {
      console.log('⚠️ Component not mounted, skipping API call');
      return;
    }

    try {
      isFetchingRef.current = true;
      if (!matchId) {
        showErrorToast('Match information is missing');
        if (isMountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
        return;
      }

      const response = await appOperation.customer.getUserScoreCard(matchId);

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during API call, skipping state update');
        return;
      }

      if (response?.success === true) {
        const scoreBoardData = Array.isArray(response.data) ? response.data : [response.data];
        setScoreboards(scoreBoardData);
        clearErrorForMatch(); 
      } else {
        showErrorToast(response?.message || 'Failed to fetch scoreboards');
        setScoreboards([]);
      }
    } catch (error) {
      
      let errorMessage = 'Something went wrong while fetching scoreboards';
      if (error?.data) {
        try {
          const parsedError = JSON.parse(error.data);
          errorMessage = parsedError?.message || errorMessage;
        } catch (parseError) {
        }
      }

      showErrorToast(errorMessage);
      
      if (isMountedRef.current) {
        setScoreboards([]);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered with matchId:', matchId);
    if (matchId) {
      fetchScoreboards();
    } else {
      console.log('⚠️ No matchId available, skipping fetch');
      setLoading(false);
    }
  }, [matchId]);

  const onRefresh = () => {
    setRefreshing(true);
    clearErrorForMatch(); 
    fetchScoreboards();
  };

  const handleScoreboardPress = (scoreboard) => {
    console.log('🎯 ScoreboardList: Navigating to Details with data:', {
      scoreboardId: scoreboard._id,
      hasPredictions: !!scoreboard.predictions,
      predictionsLength: scoreboard.predictions?.length,
      contestData: effectiveContestData ? {
        _id: effectiveContestData._id,
        MatchId: effectiveContestData.MatchId,
        Type: effectiveContestData.Type,
        match_type: effectiveContestData.match_type,
        SeriesName: effectiveContestData.SeriesName
      } : null,
      upcomingMatchesLength: upcomingMatches?.length
    });
    
    NavigationService.navigate('Scoreboard/Details', {
      scoreboardData: scoreboard,
      allPredictions: scoreboard.predictions,
      contestData: effectiveContestData,
      upcomingMatches: upcomingMatches
    });
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CommonImageBackground common>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <SpinnerSecond loading={true} />
          </View>
        ) : (
          <FlatList
            data={scoreboards}
            renderItem={({ item }) => (
              <ScoreboardCard
                item={item}
                contestData={effectiveContestData}
                upcomingMatches={upcomingMatches}
                onPress={() => handleScoreboardPress(item)}
              />
            )}
            keyExtractor={item => item._id || item.id || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.white}
              />
            }
            ListEmptyComponent={
              !loading && !refreshing && (
                <View style={styles.emptyContainer}>
                  <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptyText}>
                    {matchId ? 'No scoreboards created yet' : 'Match information not available'}
                  </AppText>
                  {matchId && (
                    <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptySubText}>
                      Create your first prediction!
                    </AppText>
                  )}
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchInfoSection: {
    flex: 1,
  },
  matchTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  matchTypeText: {
    fontSize: 20,
  },
  totalRunsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
  },
  totalRunsText: {
    fontSize: 24,
    marginBottom: 2,
  },
  totalRunsLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 15,
  },
  oversContainer: {
    marginTop: 5,
  },
  oversHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  oversTitle: {
    fontSize: 14,
  },
  moreOversText: {
    fontSize: 12,
    opacity: 0.7,
  },
  oversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  overItem: {
    width: '20%',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  overLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  runsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runsText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default List; 