import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {AppText, BLACK, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TEN, TWELVE, WHITE} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import {colors} from '../../theme/color';
import CommonImageBackground from '../../common/commonImageBackground';
import FastImage from "@d11/react-native-fast-image";
import {backIconMain} from '../../helper/image';
import {POST_WITH_TOKEN, PUT_WITH_TOKEN} from '../../Backend/Backend';
import {toastAlert} from '../../helper/utility';
import PrimaryButton from '../../common/primaryButton';
import {Screen} from '../../theme/dimens';

const Create = ({route}) => {
  const {predictionId, predictionsData, isEdit} = route?.params || {};
  const contestData = useSelector(state => state?.match?.contestData);
  
  const matchType = contestData?.contestAllInfo?.Type || contestData?.Type || 'T20';

  const getTotalOvers = () => {
    const matchTypeFormat = (matchType || '').split(' ').pop();
    
    switch (matchTypeFormat) {
      case 'T20':
        return 20;
      case 'T10':
        return 10;
      case 'ODI':
        return 50;
      default:
        return 20;
    }
  };

  const totalOvers = getTotalOvers();
  const overs = Array.from({length: totalOvers}, (_, i) => `Over ${i + 1}`);
  const [predictions, setPredictions] = React.useState(Array(totalOvers).fill(''));
  const inputRefs = React.useRef([]);
  const scrollViewRef = React.useRef(null);

  const matchId = contestData?.contestAllInfo?._id || contestData?._id;
  const contestId = contestData?.contestAllInfo?.contest_details?.data?.[0]?.shadow_contest_id || 
                   contestData?.contest_details?.data?.[0]?.shadow_contest_id;
  
  const matchTypeFormat = (matchType || '').split(' ').pop();

  useEffect(() => {
    if (isEdit && predictionsData?.predictions) {
      const initialPredictions = Array(totalOvers).fill('');
      predictionsData.predictions.forEach(prediction => {
        initialPredictions[prediction.over_number - 1] = prediction.runs.toString();
      });
      setPredictions(initialPredictions);
    }
  }, [isEdit, predictionsData, totalOvers]);

  const updatePrediction = (index, value) => {
    const newPredictions = [...predictions];
    newPredictions[index] = value;
    setPredictions(newPredictions);
  };

  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <AppText weight={POPPINS_MEDIUM} style={styles.overText}>{item}</AppText>
      <TextInput
        ref={ref => (inputRefs.current[index] = ref)}
        style={styles.input}
        value={predictions[index]}
        onChangeText={text => {
          if (/^\d*$/.test(text)) {
            updatePrediction(index, text);
          }
        }}
        keyboardType="number-pad"
        maxLength={3}
        placeholder="Enter runs"
        placeholderTextColor={colors.grey}
        returnKeyType={index === totalOvers - 1 ? "done" : "next"}
        onSubmitEditing={() => {
          if (index < totalOvers - 1) {
            inputRefs.current[index + 1]?.focus();
            scrollViewRef.current?.scrollTo({
              y: (index + 1) * 60,
              animated: true,
            });
          } else {
            Keyboard.dismiss();
          }
        }}
        blurOnSubmit={index === totalOvers - 1}
      />
    </View>
  );

  const handleSubmit = async () => {
    try {
      if (!matchId || !contestId) {
        toastAlert.showToastError('Match or contest information is missing');
        return;
      }

      const hasEmptyPredictions = predictions?.some(prediction => prediction === '');
      if (hasEmptyPredictions) {
        toastAlert.showToastError(`Please predict scores for all ${totalOvers} overs`);
        return;
      }

      const predictionsData = predictions?.map((runs, idx) => ({
        over_number: idx + 1,
        runs: runs ? parseInt(runs, 10) : 0,
      }));

      if (isEdit) {
        const updateData = {
          predictions: predictionsData,
          predictions_id: predictionId,
        };

        const response = await PUT_WITH_TOKEN('match/updateUserScoreCard', updateData);
        if (response?.success === true) {
          toastAlert.showToastSuccess(response?.message || 'Scoreboard updated successfully');
          NavigationService.navigate('Scoreboard/Details', {
            scoreboardData: {
              ...response.data,
              _id: predictionId,
            },
            allPredictions: predictionsData,
            isUpdated: true,
          });
        } else {
          toastAlert.showToastError(response?.message || 'Failed to update scoreboard');
        }
      } else {
        const createData = {
          predictions: predictionsData,
          match_id: matchId,
          contest_id: contestId,
        };
        
        const response = await POST_WITH_TOKEN('match/createUserScoreCard', createData);
        if (response?.success === true) {
          toastAlert.showToastSuccess(response?.message);
          NavigationService.navigate('Scoreboard/List');
        } else {
          toastAlert.showToastError(response?.message);
        }
      }
    } catch (error) {
      console.error('Error submitting predictions:', error);
      toastAlert.showToastError(error?.response?.data?.message || 'Something went wrong');
    }
  };

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
              {isEdit ? 'Edit Scoreboard' : 'Create Scoreboard'}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.matchTypeContainer}>
          <View style={styles.matchTypeBadge}>
            <AppText weight={POPPINS_BOLD} color={WHITE}>
              {matchType}
            </AppText>
          </View>
          <AppText weight={POPPINS_MEDIUM} color={WHITE} type={TWELVE}>
            {matchTypeFormat === 'T20'
              ? '20 Over Predictions'
              : matchTypeFormat === 'T10'
              ? '10 Over Predictions'
              : '50 Over Predictions'}
          </AppText>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TWELVE}>Over</AppText>
            <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TWELVE}>Predictions</AppText>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {overs.map((item, index) => renderItem({item, index}))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={handleSubmit}
              title={isEdit ? "Update" : "Create"}
            />
          </View>
        </View>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
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
  matchTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
  },
  matchTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
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
  scrollView: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  row: {
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
  input: {
    width: 100,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    height: 40,
    color: colors.black,
    padding: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingVertical: Platform.OS === 'ios' ? 25 : 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default Create; 