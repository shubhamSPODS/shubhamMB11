/* eslint-disable react/self-closing-comp */
import React from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  EIGHTEEN,
  FORTEEN,
  LATO_SEMI_BOLD,
  LIGHTBLUE,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  SEMI_BOLD,
  SIXTEEN,
  WHITE,
} from './AppText';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from "@d11/react-native-fast-image";
import { CLOSE_WHITE_ICON } from '../helper/image';
import { poppinsBoldItalic } from '../theme/typography';
import {
  getContestList,
  getMyJoinedContest,
  getMyTeam,
  joinContest,
  setContestData,
  setcreateContest,
} from '../slices/matchSlice';
import NavigationService from '../navigation/NavigationService';
import {
  ADD_MONEY_SCREEN,
  MY_BALANCE,
  MY_CONTEST,
  PAYMENT_OPTIONS_SCREEN,
} from '../navigation/routes';
import { fixedToTwo, toastAlert } from '../helper/utility';
import SecondaryButton from './secondaryButton';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import { TouchableOpacityView } from './TouchableOpacityView';
import LinearGradient from 'react-native-linear-gradient';
import { NewColor, colors } from '../theme/color';
import { getUserProfile } from '../actions/profileAction';

const Confirmation = ({
  isModalVisible,
  setIsModalVisible,
  details,
  matchDetails,
  selectedTeam,
  teamLength,
  teamName,
  saveTeamName,
  selectMulty,
  JoinWithMULT,
  privateContest,
  onClose,
}) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const CreateContestData = useSelector(
    state => state?.match?.CreateContestData,
  );
  const FilterId = myTeam?.find(value => {
    return value?.name === saveTeamName;
  });
  const selectedMatch = useSelector(state => state?.match?.selectedMatch);
  const contestData = useSelector(state => state?.match?.contestData);
  
  // Get entry fee and bonus percentage from the appropriate source
  const entryFee = CreateContestData?.EnteryFee || details?.EntryFee || selectedMatch?.EnteryFee || 0;
  const usableBonusPercentage = details?.UsableBonusPercantage || selectedMatch?.UsableBonusPercantage || 0;
  const contest_category_id = details?.contest_category_id || selectedMatch?.contest_category_id;
  const inner_data_id = details?.inner_data_id || selectedMatch?.inner_data_id;
  
  const { _id: matchDetails_id } = matchDetails ?? '';
  const { match_id, matchid, _id } = myTeam[0] ?? '';
  const { cash_bonus, totaldeposit } = userData ?? '';
  const winningAmount = userData?.winning_amount || 0;
  
  // Calculate total balance
  const depositBalance = totaldeposit || 0;
  const totalBalance = depositBalance + winningAmount + cash_bonus;
  
  // Calculate number of teams
  const numberOfTeams = selectMulty?.length || 1;
  
  // Calculate single team entry fee
  const singleEntryFee = Number(entryFee);
  
  // Calculate total entry fee for all teams
  const totalEntryFee = singleEntryFee * numberOfTeams;
  
  // Calculate maximum usable bonus per team
  const maxBonusPerTeam = (singleEntryFee * Number(usableBonusPercentage)) / 100;
  
  // Calculate actual usable bonus per team (limited by available cash bonus)
  const actualBonusPerTeam = Math.min(maxBonusPerTeam, cash_bonus || 0);
  
  // Calculate total usable bonus for all teams (limited by available cash bonus)
  const totalUsableBonus = Math.min(actualBonusPerTeam * numberOfTeams, cash_bonus || 0);
  
  // Calculate amount to pay
  const payAmount = Math.max(0, totalEntryFee - totalUsableBonus);
  
  const { _id: contestListId, } = contestData ?? '';

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsModalVisible(false);
  };

  const onSubmit = () => {
    if (CreateContestData?.EnteryFee) {
      dispatch(
        setcreateContest(CreateContestData, match_id, payAmount, _id, matchid, FilterId?.name, contestListId),
      );
      handleClose();
    }
    else if (payAmount <= (depositBalance + winningAmount)) {
      if (JoinWithMULT) {
        if (!selectMulty?.length) {
          toastAlert.showToastError('Please select teams to join the contest');
          return;
        }

        // Extract contest IDs from details or selectedMatch
        const shadow_contest_id = details?.shadow_contest_id || details?._id || '';
        // Use _id as match_contest_category_id directly as shown in the API response
        const match_contest_category_id = details?._id || '';

        // Log full details object for debugging
        console.log('Full details object:', JSON.stringify(details, null, 2));
        
        console.log('Contest details for join (multiple teams):', {
          contest_category_id,
          details_id: details?._id,
          details_shadow_id: details?.shadow_contest_id,
          details_match_contest_id: details?.match_contest_category_id,
          details_inner_id: details?.inner_data_id,
          shadow_contest_id,
          match_contest_category_id
        });

        if (!shadow_contest_id) {
          console.error('Missing shadow_contest_id:', { shadow_contest_id, details });
          toastAlert.showToastError('Missing contest ID');
          return;
        }

        if (!match_contest_category_id) {
          console.error('Missing match_contest_category_id:', { match_contest_category_id, details });
          toastAlert.showToastError('Missing contest ID');
          return;
        }

        const arofobj = selectMulty.map((team, index) => {
          const teamId = team?._id;
          const teamMatchId = team?.match_id || matchDetails?._id;
          const teamMatchIdAlt = team?.matchid || matchDetails?.matchid;
          const cid = matchDetails?.SeriesId || '';

          if (!teamId || !teamMatchId || !cid) {
            console.error('Invalid team data:', { team, matchDetails });
            return null;
          }

          return {
            cid,
            match_id: teamMatchId,
            matchid: teamMatchIdAlt,
            teams_id: [teamId],
            contest_category_id: contest_category_id,
            shadow_contest_id,
            match_contest_category_id,
            teamName: `T${index + 1}`, 
            method: 'wallet',
            amount: singleEntryFee
          };
        }).filter(Boolean);

        if (arofobj.length === 0) {
          toastAlert.showToastError('Invalid team data');
          return;
        }

        const joinData = {
          mutiple: true,
          arofobj
        };

        console.log('Joining contest with multiple teams:', joinData);
        dispatch(joinContest(joinData, matchDetails));
        handleClose();
      } else {
        if (!match_id || !_id || !matchDetails?.SeriesId) {
          console.error('Invalid single team data:', { match_id, _id, seriesId: matchDetails?.SeriesId });
          toastAlert.showToastError('Invalid team data');
          return;
        }

        // Extract contest IDs from details or selectedMatch
        const shadow_contest_id = details?.shadow_contest_id || details?._id || '';
        // Use _id as match_contest_category_id directly as shown in the API response
        const match_contest_category_id = details?._id || '';

        // Log full details object for debugging
        console.log('Full details object:', JSON.stringify(details, null, 2));
        
        console.log('Contest details for join (single team):', {
          contest_category_id,
          details_id: details?._id,
          details_shadow_id: details?.shadow_contest_id,
          details_match_contest_id: details?.match_contest_category_id,
          details_inner_id: details?.inner_data_id,
          shadow_contest_id,
          match_contest_category_id
        });

        if (!shadow_contest_id) {
          console.error('Missing shadow_contest_id:', { shadow_contest_id, details });
          toastAlert.showToastError('Missing contest ID');
          return;
        }

        if (!match_contest_category_id) {
          console.error('Missing match_contest_category_id:', { match_contest_category_id, details });
          toastAlert.showToastError('Missing contest ID');
          return;
        }

        const joinData = {
          cid: matchDetails?.SeriesId,
          match_id: match_id || matchDetails?._id,
          matchid: matchid || matchDetails?.matchid,
          teams_id: [_id],
          contest_category_id: contest_category_id,
          shadow_contest_id,
          match_contest_category_id,
          teamName: 'T1', 
          method: 'wallet',
          amount: singleEntryFee
        };

        console.log('Joining contest with single team:', joinData);
        dispatch(joinContest(joinData, matchDetails));
        handleClose();
      }
    } else {
      NavigationService.navigate(ADD_MONEY_SCREEN);
      handleClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTopSection}>
            <AppText type={SIXTEEN} weight={POPPINS_BOLD_ITALIC}>
              CONFIRMATION
            </AppText>
            <Pressable
              style={{
                position: 'absolute',
                right: 0,
                height: 42,
                width: 42,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleClose}>
              <FastImage
                source={CLOSE_WHITE_ICON}
                style={styles.closeWhiteIcon}
                resizeMode="contain"
                tintColor={colors.white}
              />
            </Pressable>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderLightBlue,
              paddingBottom: 10,
            }}>
            <View style={styles.center}>
              <AppText type={SIXTEEN} weight={SEMI_BOLD}>
                Contest Fee
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText color={WHITE} weight={LATO_SEMI_BOLD} type={SIXTEEN}>
                  ₹
                  <AppText
                    type={SIXTEEN}
                    color={WHITE}
                    weight={SEMI_BOLD}>
                    {numberOfTeams > 1 ? `${singleEntryFee} x ${numberOfTeams}` : singleEntryFee}
                  </AppText>
                </AppText>
              </View>
            </View>
            <View style={[styles.center, { marginTop: 5 }]}>
              <AppText type={FORTEEN} weight={SEMI_BOLD}>
                Usable Balance{'\n'}(Unutilized + Winning + Bonus)
              </AppText>
              <AppText type={FORTEEN} weight={LATO_SEMI_BOLD} >
                ₹{`${fixedToTwo(totalBalance)}`}
              </AppText>
            </View>
            <View style={[styles.center, { marginTop: 5 }]}>
              <AppText type={FORTEEN} weight={SEMI_BOLD}>
                Usable Cash Bonus
              </AppText>
              <AppText type={FORTEEN} color={WHITE} style={{ opacity: 0.5 }} weight={SEMI_BOLD}>
                -₹{fixedToTwo(totalUsableBonus)}
              </AppText>
            </View>
          </View>
          <View style={[styles.center, { marginTop: 10, paddingHorizontal: 10 }]}>
            <AppText
              type={FORTEEN}
              style={{ color: '#4DFF7F' }}
              weight={SEMI_BOLD}>
              To Pay
            </AppText>
            <AppText
              style={{ color: '#4DFF7F' }}
              type={FORTEEN}
              weight={LATO_SEMI_BOLD}>
              ₹{fixedToTwo(payAmount)}
            </AppText>
          </View>
          <View style={styles.detailsStyle}>
            <AppText weight={SEMI_BOLD}>
              By Joining this contest, you accept My Battle 11's T&C and
              confirm that you are not a resident of Assam, Odisha, Nagaland,
              Andhra Pradesh, Sikkim, Telangana.
            </AppText>
          </View>
          <TouchableOpacityView
            onPress={onSubmit}
            style={[
              styles.btn,
              {
                width: '90%',
                alignSelf: 'center',
              },
            ]}>
            <LinearGradient
              style={[
                styles.btn,
                {
                  width: '100%',
                },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]}>
              <AppText
                type={EIGHTEEN}
                style={{
                  color: 'white',
                }}
                weight={POPPINS_BOLD}>
                {payAmount <= totalBalance ? 'Join contest' : 'Add cash'}
              </AppText>
            </LinearGradient>
          </TouchableOpacityView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NewColor.linerBlacklight,
  },
  modalContainer: {
    width: Dimensions.get('window').width - 20,
    backgroundColor: NewColor.linerWhite,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  modalTopSection: {
    height: 54,
    backgroundColor: NewColor.linerBlackFive,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  closeWhiteIcon: {
    height: 12,
    width: 12,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsStyle: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    marginHorizontal: 20,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 16,
    marginVertical: 10,
    backgroundColor: NewColor.linerBlackFive,
  },
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default Confirmation;