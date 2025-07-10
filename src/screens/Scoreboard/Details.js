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
  const {scoreboardData, allPredictions} = route?.params || {};
  const matchType = scoreboardData?.match_details?.Type || 'T20';
  const totalRuns = allPredictions?.reduce((sum, over) => sum + over.runs, 0) || 0;

  const renderOver = (prediction) => (
    <View key={prediction.over_number} style={styles.overContainer}>
      <View style={styles.overHeader}>
        <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} style={styles.overNumber}>
          Over {prediction.over_number}
        </AppText>
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {allPredictions?.map(prediction => renderOver(prediction))}
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
    marginTop: 15,
    marginHorizontal: 15,
    padding: 15,
    backgroundColor: colors.darkBlue,
    borderRadius: 12,
  },
  matchTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
  },
  overContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  overHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overNumber: {
    fontSize: 16,
  },
  runsContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  runs: {
    fontSize: 24,
    marginBottom: 4,
  },
  runsLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default Details; 