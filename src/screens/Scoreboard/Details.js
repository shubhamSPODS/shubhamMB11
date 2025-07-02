import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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

  const renderPrediction = (prediction, index) => (
    <View key={index} style={styles.predictionRow}>
      <AppText weight={POPPINS_MEDIUM} style={styles.overText}>
        Over {prediction.over_number}
      </AppText>
      <AppText weight={POPPINS_MEDIUM} style={styles.runsText}>
        {prediction.runs} runs
      </AppText>
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
            <AppText weight={POPPINS_MEDIUM} color={WHITE}>
              Scoreboard Details
            </AppText>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TWELVE}>Over</AppText>
            <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TWELVE}>Predictions</AppText>
          </View>

          {allPredictions?.map((prediction, index) => renderPrediction(prediction, index))}
        </ScrollView>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: Screen.Width,
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  overText: {
    flex: 1,
    color: colors.white,
  },
  runsText: {
    color: colors.white,
    marginLeft: 10,
  },
});

export default Details; 