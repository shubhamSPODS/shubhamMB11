import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  AppText,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  WHITE,
  SIXTEEN,
  THIRTEEN,
  FORTEEN,
} from '../../common/AppText';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import NavigationService from '../../navigation/NavigationService';
import { colors } from '../../theme/color';
import FastImage from "@d11/react-native-fast-image";
import { backIconMain } from '../../helper/image';
import PrimaryButton from '../../common/primaryButton';
import { appOperation } from '../../appOperation';
import { toastAlert } from '../../helper/utility';
import { SpinnerSecond } from '../../common/SpinnerSecond';
import { useSelector } from 'react-redux';
import Confirmation from '../../common/Confirmation';

const SelectScoreboard = ({ 
  contestDetails, 
  matchDetails, 
  onClose, 
  selectScoreboard 
}) => {
  const [scoreboards, setScoreboards] = useState([]);
  const [selectedScoreboard, setSelectedScoreboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const contestData = useSelector(state => state?.match?.contestData);

  useEffect(() => {
    fetchUserScoreboards();
  }, []);

  const fetchUserScoreboards = async () => {
    try {
      setLoading(true);
      const matchId = matchDetails?._id || contestData?._id;
      
      console.log('🔍 Fetching scoreboards for matchId:', matchId);
      
      if (!matchId) {
        toastAlert.showToastError('Match ID not found');
        return;
      }

      // Try both API endpoints to get user scoreboards
      let response;
      try {
        response = await appOperation.customer.getUserScoreCard(matchId);
        console.log('🔍 getUserScoreCard Response:', response);
      } catch (error) {
        console.log('🔍 getUserScoreCard failed, trying getMyScoreboardContests');
        try {
          response = await appOperation.customer.getMyScoreboardContests(matchId);
          console.log('🔍 getMyScoreboardContests Response:', response);
        } catch (secondError) {
          console.log('🔍 Both APIs failed:', secondError);
          response = { success: false, data: [] };
        }
      }
      
      console.log('🔍 SelectScoreboard Final API Response:', {
        success: response?.success,
        data: response?.data,
        dataLength: response?.data?.length,
        fullResponse: response
      });
      
      if (response?.success && response?.data) {
        setScoreboards(response.data);
        
        // If no scoreboards found, redirect to create screen
        if (response.data.length === 0) {
          console.log('🎯 No scoreboards found - redirecting to create screen');
          setTimeout(() => {
            onClose();
            NavigationService.navigate('Scoreboard/Create', {
              ...contestData,
              isFromMyMatch: true,
            });
          }, 100);
        }
      } else {
        console.log('🎯 API failed or no data - redirecting to create screen');
        // Removed toast message to avoid showing "No score card found for this match"
        setScoreboards([]);
        
        // If failed to load, also redirect to create screen
        setTimeout(() => {
          onClose();
          NavigationService.navigate('Scoreboard/Create', {
            ...contestData,
            isFromMyMatch: true,
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching scoreboards:', error);
      // Removed toast message to avoid showing "No score card found for this match"
      setScoreboards([]);
    } finally {
      setLoading(false);
    }
  };

  const renderScoreboardItem = ({ item, index }) => {
    const isSelected = selectedScoreboard?._id === item._id;
    const predictions = item.predictions || [];
    const previewOvers = predictions.slice(0, 5);
    const totalRuns = predictions.reduce((sum, over) => sum + (over.runs || 0), 0);
    
    const matchType = item.match_details?.Type || 
                     item.matchDetails?.Type || 
                     item.Type || 
                     'T20';
    
    return (
      <TouchableOpacity 
        style={[
          styles.scoreboardCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => setSelectedScoreboard(item)}
      >
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

        {/* Overs section */}
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
            {previewOvers.map((over, idx) => (
              <View key={over.over_number || idx} style={styles.overItem}>
                <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.overLabel}>
                  Over {over.over_number || (idx + 1)}
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

  const handleJoinContest = () => {
    if (!selectedScoreboard) {
      toastAlert.showToastError('Please select a scoreboard to join the contest');
      return;
    }

    console.log('🎯 Opening confirmation for scoreboard contest:', {
      scoreboard: selectedScoreboard._id,
      contest: contestDetails._id,
      match: matchDetails._id
    });

    setShowConfirmation(true);
  };

  const handleConfirmationSuccess = () => {
    onClose();
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptyText}>
        No scoreboards found for this match
      </AppText>
      <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.emptySubText}>
        Redirecting to create scoreboard...
      </AppText>
    </View>
  );

  return (
    <AppSafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <FastImage source={backIconMain} style={styles.backIcon} />
          </TouchableOpacity>
          <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.headerTitle}>
            Select Scoreboard
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.infoContainer}>
          <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} style={styles.infoTitle}>
            Choose a Scoreboard to Join Contest
          </AppText>
          <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.infoText}>
            Select one of your created scoreboards to join this contest
          </AppText>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <SpinnerSecond />
          </View>
        ) : (
          <>
            <FlatList
              data={scoreboards}
              renderItem={renderScoreboardItem}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={EmptyComponent}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />

            {scoreboards.length > 0 && (
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  buttonStyle={[
                    styles.joinButton,
                    !selectedScoreboard && styles.disabledButton
                  ]}
                  onPress={handleJoinContest}
                  title="JOIN CONTEST"
                  disabled={!selectedScoreboard}
                />
              </View>
            )}
          </>
        )}

        {/* Confirmation Modal */}
        <Confirmation
          isModalVisible={showConfirmation}
          setIsModalVisible={setShowConfirmation}
          details={contestDetails}
          matchDetails={matchDetails}
          selectedScoreboard={selectedScoreboard}
          onClose={() => setShowConfirmation(false)}
          isScoreboardContest={true}
        />
      </View>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: WHITE,
  },
  headerTitle: {
    fontSize: 18,
  },
  placeholder: {
    width: 38,
  },
  infoContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  scoreboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
  selectedCard: {
    borderColor: colors.blue,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
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
    marginRight: 15,
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
  buttonContainer: {
    padding: 15,
    paddingTop: 10,
  },
  joinButton: {
    paddingVertical: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
});

export default SelectScoreboard; 