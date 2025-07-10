import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { AppText, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, WHITE } from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import { colors } from '../../theme/color';
import CommonImageBackground from '../../common/commonImageBackground';
import FastImage from "@d11/react-native-fast-image";
import { backIconMain } from '../../helper/image';
import { GET_WITH_TOKEN } from '../../Backend/Backend';
import { toastAlert } from '../../helper/utility';
import { Screen } from '../../theme/dimens';

const ScoreboardCard = ({ item, onPress }) => {
  // Display first 5 overs as preview
  const previewOvers = item.predictions.slice(0, 5);
  const totalRuns = item.predictions.reduce((sum, over) => sum + over.runs, 0);
  
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTopSection}>
        <View style={styles.matchInfoSection}>
          <View style={styles.matchTypeBadge}>
            <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.matchTypeText}>
              {item.match_details?.Type || 'T20'}
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
            Over by Over
          </AppText>
          {item.predictions.length > 5 && (
            <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.moreOversText}>
              +{item.predictions.length - 5} more overs
            </AppText>
          )}
        </View>
        <View style={styles.oversGrid}>
          {previewOvers.map((over, index) => (
            <View key={index} style={styles.overItem}>
              <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.overLabel}>
                Over {over.over_number}
              </AppText>
              <View style={styles.runsBox}>
                <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.runsText}>
                  {over.runs}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const List = () => {
  const [scoreboards, setScoreboards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchScoreboards = async () => {
    try {
      // Comment out actual API call
      // const response = await GET_WITH_TOKEN('match/getUserScoreCards');
      // if (response?.success) {
      //   setScoreboards(response.data);
      // } else {
      //   toastAlert.showToastError(response?.message || 'Failed to fetch scoreboards');
      // }

      // Mock data for testing
      const mockScoreboards = [
        {
          _id: 'mock-1',
          match_details: { Type: 'T20' },
                      predictions: [
              { over_number: 1, runs: 8 },
              { over_number: 2, runs: 12 },
              { over_number: 3, runs: 6 },
              { over_number: 4, runs: 15 },
              { over_number: 5, runs: 9 },
              { over_number: 6, runs: 11 },
              { over_number: 7, runs: 7 },
              { over_number: 8, runs: 14 },
              { over_number: 9, runs: 10 },
              { over_number: 10, runs: 8 },
              { over_number: 11, runs: 13 },
              { over_number: 12, runs: 9 },
              { over_number: 13, runs: 11 },
              { over_number: 14, runs: 7 },
              { over_number: 15, runs: 16 },
              { over_number: 16, runs: 12 },
              { over_number: 17, runs: 15 },
              { over_number: 18, runs: 18 },
              { over_number: 19, runs: 14 },
              { over_number: 20, runs: 19 }
          ],
          createdAt: new Date().toISOString()
        }
      ];

      setScoreboards(mockScoreboards);
    } catch (error) {
      console.error('Error fetching scoreboards:', error);
      // toastAlert.showToastError('Something went wrong while fetching scoreboards');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScoreboards();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchScoreboards();
  };

  const handleScoreboardPress = (scoreboard) => {
    NavigationService.navigate('Scoreboard/Details', {
      scoreboardData: scoreboard,
      allPredictions: scoreboard.predictions
    });
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CommonImageBackground common>
        <FlatList
          data={scoreboards}
          renderItem={({ item }) => (
            <ScoreboardCard
              item={item}
              onPress={() => handleScoreboardPress(item)}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.white}
            />
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                  No scoreboards created yet
                </AppText>
              </View>
            )
          }
        />
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
});

export default List; 