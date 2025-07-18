import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {AppText, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TWELVE, WHITE} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import {colors} from '../../theme/color';
import CommonImageBackground from '../../common/commonImageBackground';
import FastImage from "@d11/react-native-fast-image";
import {backIconMain} from '../../helper/image';
import {Screen} from '../../theme/dimens';

const Details = ({route}) => {
  console.log('Details screen received:', {
    scoreboardData: route.params?.scoreboardData,
    allPredictions: route.params?.allPredictions,
    details: route.params?.details
  });

  console.log('Received winningsData:', {
    rankWinnings: route.params?.details?.winningsData?.rankWinnings,
    length: route.params?.details?.winningsData?.rankWinnings?.length
  });

  const {scoreboardData, allPredictions, details} = route?.params || {};
  const matchType = scoreboardData?.match_details?.Type || 'T20';
  const totalRuns = allPredictions?.reduce((sum, over) => sum + over.runs, 0) || 0;
  

  const renderOver = (prediction, index) => (
    <View key={prediction.over_number} style={[
      styles.overContainer,
      index % 2 === 0 ? styles.evenOver : styles.oddOver
    ]}>
      <View style={styles.overContent}>
        <View style={styles.overNumberContainer}>
          <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.overNumber}>
            Over {prediction.over_number}
          </AppText>
        </View>
        <View style={styles.runsContainer}>
          <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.runs}>
            {prediction.runs}
          </AppText>
          <AppText weight={POPPINS_MEDIUM} color={WHITE} style={styles.runsLabel}>
            Runs
          </AppText>
        </View>
      </View>
    </View>
  );


  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CommonImageBackground common>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => NavigationService.goBack()}
            style={styles.backButton}>
            <FastImage
              source={backIconMain}
              style={styles.backIcon}
              resizeMode="contain"
            />
            <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.headerTitle}>
              Scoreboard Details
            </AppText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.matchInfoContainer}>
            <View style={styles.matchTypeBadge}>
              <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.matchTypeText}>
                {matchType}
              </AppText>
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

          {allPredictions?.map((prediction, index) => renderOver(prediction, index))}
        </ScrollView>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: Screen.Width,
    padding: 15,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 40 : 30,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  matchInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12
  },
  matchTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  matchTypeText: {
    fontSize: 16,
    letterSpacing: 1,
  },
  totalRunsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    padding: 15,
    borderRadius: 15,
    minWidth: 90,
    borderWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  totalRunsText: {
    fontSize: 28,
    marginBottom: 4,
    color: '#2ecc71',
  },
  totalRunsLabel: {
    fontSize: 12,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 30,
  },
  overContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  evenOver: {
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  oddOver: {
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
  },
  overContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overNumberContainer: {
    flex: 1,
  },
  overNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  runsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    minWidth: 60,
  },
  runs: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  runsLabel: {
    fontSize: 10,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  winningsContainer: {
    backgroundColor: colors.darkBlue,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  winningsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  winningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerCell: {
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tableCell: {
    fontSize: 14,
  },
});

export default Details;