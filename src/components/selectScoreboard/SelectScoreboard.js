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
  selectScoreboard,
  supportsMultipleEntries = false
}) => {
  const [scoreboards, setScoreboards] = useState([]);
  const [selectedScoreboard, setSelectedScoreboard] = useState(null);
  const [selectedScoreboards, setSelectedScoreboards] = useState([]); // For multiple selection
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const contestData = useSelector(state => state?.match?.contestData);
  
  // Check if this contest supports multiple entries (use prop or fallback to contest details)
  const finalSupportsMultipleEntries = supportsMultipleEntries || 
                                      contestDetails?.ContestSize > 1 || 
                                      contestDetails?.Contestsize > 1 ||
                                      contestDetails?.JoinWithMULT === true;

  useEffect(() => {
    fetchUserScoreboards();
  }, []);

  const fetchUserScoreboards = async () => {
    try {
      setLoading(true);
      const matchId = matchDetails?._id || contestData?._id;
      
      
      if (!matchId) {
        toastAlert.showToastError('Match ID not found');
        return;
      }

      // Try both API endpoints to get user scoreboards
      let response;
      try {
        response = await appOperation.customer.getUserScoreCard(matchId);
      } catch (error) {
        try {
          response = await appOperation.customer.getMyScoreboardContests(matchId);
        } catch (secondError) {
          response = { success: false, data: [] };
        }
      }

      
      if (response?.success && response?.data) {
        setScoreboards(response.data);
        
        // Debug: Log the structure of the first scoreboard to understand available fields
        if (response.data.length > 0) {
          console.log('🎯 [DEBUG] First scoreboard structure:', {
            _id: response.data[0]._id,
            prediction_id: response.data[0].prediction_id,
            predictions_id: response.data[0].predictions_id,
            id: response.data[0].id,
            scoreboard_id: response.data[0].scoreboard_id,
            fullObject: response.data[0]
          });
        }
        
        // If no scoreboards found, redirect to create screen
        if (response.data.length === 0) {
          setTimeout(() => {
            onClose();
            NavigationService.navigate('Scoreboard/Create', {
              ...contestData,
              isFromMyMatch: true,
            });
          }, 100);
        } else {
          console.log('🎯 Scoreboards loaded successfully:', response.data.length);
          
          // If there's only one scoreboard, automatically select it and proceed to confirmation
          if (response.data.length === 1) {
            console.log('🎯 Only one scoreboard found - auto-selecting it and proceeding to confirmation');
            setSelectedScoreboard(response.data[0]);
            
            // Small delay to ensure state is set, then proceed to confirmation
            setTimeout(() => {
              setShowConfirmation(true);
            }, 100);
          }
        }
      } else {
        console.log('🎯 API failed or no data - redirecting to create screen');
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

  // Function to get the correct ID field for the scoreboard
  const getScoreboardId = (scoreboard) => {
    // Try different possible ID fields in order of preference
    return scoreboard.prediction_id || 
           scoreboard.predictions_id || 
           scoreboard.scoreboard_id || 
           scoreboard.id || 
           scoreboard._id;
  };

  const handleScoreboardSelection = (scoreboard) => {
    if (finalSupportsMultipleEntries) {
      // Multiple selection mode
      const isSelected = selectedScoreboards.some(sb => getScoreboardId(sb) === getScoreboardId(scoreboard));
      if (isSelected) {
        setSelectedScoreboards(selectedScoreboards.filter(sb => getScoreboardId(sb) !== getScoreboardId(scoreboard)));
      } else {
        setSelectedScoreboards([...selectedScoreboards, scoreboard]);
      }
    } else {
      // Single selection mode
      setSelectedScoreboard(scoreboard);
    }
  };

  const isScoreboardSelected = (scoreboard) => {
    if (finalSupportsMultipleEntries) {
      return selectedScoreboards.some(sb => getScoreboardId(sb) === getScoreboardId(scoreboard));
    } else {
      return getScoreboardId(selectedScoreboard) === getScoreboardId(scoreboard);
    }
  };

  const renderScoreboardItem = ({ item, index }) => {
    const isSelected = isScoreboardSelected(item);
    const predictions = item.predictions || [];
    const previewOvers = predictions.slice(0, 5);
    const totalRuns = predictions.reduce((sum, over) => sum + (over.runs || 0), 0);
    
    const matchType = item.match_details?.Type || 
                     item.matchDetails?.Type || 
                     item.Type || 
                     'T20';
    
    return (
      <View style={styles.scoreboardItemContainer}>
        {finalSupportsMultipleEntries && (
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleScoreboardSelection(item)}
          >
            <View style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected
            ]}>
              {isSelected && (
                <View style={styles.checkmark} />
              )}
            </View>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.scoreboardCard,
            isSelected && styles.selectedCard
          ]}
          onPress={() => handleScoreboardSelection(item)}
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
      </View>
    );
  };

  const handleJoinContest = () => {
    if (finalSupportsMultipleEntries) {
      if (selectedScoreboards.length === 0) {
        toastAlert.showToastError('Please select at least one scoreboard to join the contest');
        return;
      }
    } else {
      if (!selectedScoreboard) {
        toastAlert.showToastError('Please select a scoreboard to join the contest');
        return;
      }
    }

    console.log('🎯 Opening confirmation for scoreboard contest:', {
      scoreboards: finalSupportsMultipleEntries ? selectedScoreboards.map(sb => sb._id) : [selectedScoreboard._id],
      contest: contestDetails._id,
      match: matchDetails._id,
      supportsMultipleEntries: finalSupportsMultipleEntries
    });

    setShowConfirmation(true);
  };

  const handleConfirmationSuccess = () => {
    onClose();
  };

  const getSelectedCount = () => {
    if (finalSupportsMultipleEntries) {
      return selectedScoreboards.length;
    } else {
      return selectedScoreboard ? 1 : 0;
    }
  };

  const getButtonText = () => {
    const count = getSelectedCount();
    if (finalSupportsMultipleEntries) {
      return count > 0 ? `JOIN CONTEST (${count} SELECTED)` : 'JOIN CONTEST';
    } else {
      return 'JOIN CONTEST';
    }
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
            Select Scoreboard{finalSupportsMultipleEntries ? 's' : ''}
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.infoContainer}>
          <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} style={styles.infoTitle}>
            Choose Scoreboard{finalSupportsMultipleEntries ? 's' : ''} to Join Contest
          </AppText>
          <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.infoText}>
            {finalSupportsMultipleEntries 
              ? 'Select one or more scoreboards to join this contest with multiple entries'
              : 'Select one of your created scoreboards to join this contest'
            }
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
                    getSelectedCount() === 0 && styles.disabledButton
                  ]}
                  onPress={handleJoinContest}
                  title={getButtonText()}
                  disabled={getSelectedCount() === 0}
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
          selectedScoreboard={finalSupportsMultipleEntries ? selectedScoreboards : selectedScoreboard}
          onClose={() => setShowConfirmation(false)}
          isScoreboardContest={true}
          supportsMultipleEntries={finalSupportsMultipleEntries}
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
  scoreboardItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  scoreboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
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
    flex: 1,
  },
  selectedCard: {
    borderColor: colors.blue,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 15,
    padding: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: WHITE,
    borderRadius: 2,
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