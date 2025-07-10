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
  const [predictions, setPredictions] = React.useState(Array(totalOvers).fill('0'));
  const inputRefs = React.useRef([]);
  const scrollViewRef = React.useRef(null);

  const matchId = contestData?.contestAllInfo?._id || contestData?._id;
  const contestId = contestData?.contestAllInfo?.contest_details?.data?.[0]?.shadow_contest_id || 
                   contestData?.contest_details?.data?.[0]?.shadow_contest_id;
  
  const matchTypeFormat = (matchType || '').split(' ').pop();

  useEffect(() => {
    if (isEdit && predictionsData?.predictions) {
      const initialPredictions = Array(totalOvers).fill('0');
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

  const handleInputFocus = (index) => {
    if (predictions[index] === '0') {
      updatePrediction(index, '');
    }
  };

  const handleInputBlur = (index) => {
    if (predictions[index] === '') {
      updatePrediction(index, '0');
    }
  };

  const renderItem = ({item, index}) => (
    <View key={`over-${index}`} style={styles.rowContainer}>
      <View style={styles.row}>
        <View style={styles.overContainer}>
          <AppText weight={POPPINS_MEDIUM} style={styles.overText}>{item}</AppText>
        </View>
        <TextInput
          ref={ref => (inputRefs.current[index] = ref)}
          style={styles.input}
          value={predictions[index]}
          onChangeText={text => {
            if (/^\d*$/.test(text)) {
              updatePrediction(index, text);
            }
          }}
          onFocus={() => handleInputFocus(index)}
          onBlur={() => handleInputBlur(index)}
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
    </View>
  );

  const handleSubmit = async () => {
    try {
      // Commenting out validation temporarily for testing
      // if (!matchId || !contestId) {
      //   toastAlert.showToastError('Match or contest information is missing');
      //   return;
      // }

      const hasEmptyOrZeroPredictions = predictions?.every(prediction => prediction === '0');
      if (hasEmptyOrZeroPredictions) {
        toastAlert.showToastError(`Please predict scores for at least one over`);
        return;
      }

      const predictionsData = predictions?.map((runs, idx) => ({
        over_number: idx + 1,
        runs: parseInt(runs, 10),
      }));

      // For testing - using mock data instead of API call
      const mockResponse = {
        success: true,
        data: {
          _id: 'mock-id-' + Date.now(),
          match_details: {
            Type: matchType
          },
          predictions: predictionsData,
          createdAt: new Date().toISOString()
        }
      };

      // Comment out actual API calls
      // if (isEdit) {
      //   const updateData = {
      //     predictions: predictionsData,
      //     predictions_id: predictionId,
      //   };

      //   const response = await PUT_WITH_TOKEN('match/updateUserScoreCard', updateData);
      //   if (response?.success === true) {
      //     toastAlert.showToastSuccess(response?.message || 'Scoreboard updated successfully');
      //     NavigationService.navigate('Scoreboard/Details', {
      //       scoreboardData: {
      //         ...response.data,
      //         _id: predictionId,
      //       },
      //       allPredictions: predictionsData,
      //       isUpdated: true,
      //     });
      //   } else {
      //     toastAlert.showToastError(response?.message || 'Failed to update scoreboard');
      //   }
      // } else {
      //   const createData = {
      //     predictions: predictionsData,
      //     match_id: matchId,
      //     contest_id: contestId,
      //   };
        
      //   const response = await POST_WITH_TOKEN('match/createUserScoreCard', createData);
      //   if (response?.success === true) {
      //     toastAlert.showToastSuccess(response?.message);
      //     NavigationService.navigate('Scoreboard/List');
      //   } else {
      //     toastAlert.showToastError(response?.message);
      //   }
      // }

      // For testing - simulate successful creation
      toastAlert.showToastSuccess('Scoreboard created successfully');
      NavigationService.navigate('Scoreboard/List');

    } catch (error) {
      console.error('Error submitting predictions:', error);
      toastAlert.showToastError('Something went wrong');
    }
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <CommonImageBackground common>
        <View style={styles.headerWrapper}>
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
                {isEdit ? 'Edit Scoreboard' : 'Create Scoreboard'}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.matchTypeWrapper}>
            <View style={styles.matchTypeContainer}>
              <View style={styles.matchTypeBadge}>
                <AppText weight={POPPINS_BOLD} color={WHITE} style={styles.matchTypeText}>
                  {matchType}
                </AppText>
              </View>
              <AppText weight={POPPINS_MEDIUM} color={WHITE} type={TWELVE} style={styles.matchTypeDesc}>
                {matchTypeFormat === 'T20'
                  ? '20 Over Predictions'
                  : matchTypeFormat === 'T10'
                  ? '10 Over Predictions'
                  : '50 Over Predictions'}
              </AppText>
            </View>
          </View>
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
  headerWrapper: {
    width: '100%',
    paddingBottom: 10,
    backgroundColor: colors.darkBlue,
  },
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
  matchTypeWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  matchTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  matchTypeText: {
    fontSize: 16,
  },
  matchTypeDesc: {
    opacity: 0.9,
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
  rowContainer: {
    marginHorizontal: 15,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    padding: 12,
    borderRadius: 10,
  },
  overContainer: {
    flex: 1,
  },
  overText: {
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
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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