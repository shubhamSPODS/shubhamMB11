import React, { useRef, useState } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FIFTEEN,
  GREEN,
  LATO_BOLD,
  LATO_HEAVY,
  LATO_SEMI_BOLD,
  POPPINS_BOLD,
  POPPINS_EXTRA_BOLD_ITALIC,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  TEN,
  THIRTEEN,
  WHITE,
} from '../../../common/AppText';
import SelectTeam from '../../selectTeam/SelectTeam';
import { GLORY, GURANTEE, SINGLE, WINNER, m } from '../../../helper/image';
import NavigationService from '../../../navigation/NavigationService';
import { ADDCASH_VERIFICATION, LEADERBOARD, MY_BALANCE, SELECT_PLAYER, VERIFY_ADHAAR_SCREEN } from '../../../navigation/routes';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllPlayerList,
  getMyTeam,
  getTab,
  setAllPlayers,
  setIsContestEntry,
  setSelectedMatch,
} from '../../../slices/matchSlice';
import { numberWithCommas, toastAlert } from '../../../helper/utility';
import Confirmation from '../../../common/Confirmation';
import { NewColor, colors } from '../../../theme/color';

const ContestCard = ({ details, totalTeamCount }) => {
  const [saveTeamName, setSaveTeamName] = useState('');
  const dispatch = useDispatch();
  const selectTeam = useRef();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const contestData = useSelector(state => state?.match?.contestData);
  const { _id, SeriesId } = contestData ?? '';
  const percentage = (details?.joined / (details?.Contestsize || 0)) * 100;
  const matchDetails = useSelector(state => state?.match?.contestData);
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const [isAdd, setIsAdd] = useState(false);
  const onClickContest = () => {
    NavigationService.navigate(LEADERBOARD, {
      details: {
        ...details,
        match_contest_category_id: details?.inner_data_id,
      },
      firstTeamName: matchDetails?.TeamA,
      secondTeamName: matchDetails?.TeamB,
      progressBarWidth: percentage,
      matchDetails: matchDetails,
      totalTeamCount: totalTeamCount,
    });
  };
  const onJoinContest = async () => {
    if (kycDetails?.adhar_verified == 0) {
      NavigationService.navigate(VERIFY_ADHAAR_SCREEN)
    } else 
    if (kycDetails?.adhar_verified == 2) {
      toastAlert.showToastError('Your aadhaar verification is pending please wait')
    } else {
      if (totalTeamCount === 0) {
        dispatch(setAllPlayers([]))
        let data = { cid: matchDetails?.SeriesId };
        dispatch(getAllPlayerList(_id, data, false, {}, true));
        NavigationService.navigate(SELECT_PLAYER, {
          matchDetails,
          isEditMode: false,
        });
        dispatch(setIsContestEntry(true));
        dispatch(setSelectedMatch({ ...details }));

      } else if (totalTeamCount === 1) {
        if (details?.teamDetails?.length) {
          dispatch(setAllPlayers([]))
          let data = { cid: matchDetails?.SeriesId };
          let isNavigate = true
          dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
          dispatch(setIsContestEntry(true));
          dispatch(setSelectedMatch({ ...details }));
          NavigationService.navigate(SELECT_PLAYER, {
            matchDetails,
            isEditMode: false,
          });
        } else {
          setIsAdd(true);
          // dispatch(getMyTeam(_id));
          dispatch(setSelectedMatch({ ...details }));
          setSaveTeamName(myTeam[0]?.name)
        }
      } else if (totalTeamCount > 1) {
        if (details?.teamDetails?.length == myTeam?.length) {
          dispatch(setAllPlayers([]))
          let data = { cid: matchDetails?.SeriesId };
          let isNavigate = true
          dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
          dispatch(setIsContestEntry(true));
          dispatch(setSelectedMatch({ ...details }));
          NavigationService.navigate(SELECT_PLAYER, {
            matchDetails,
            isEditMode: false,
          });
        } else {
          dispatch(setSelectedMatch({ ...details }));
          selectTeam?.current?.open();
          // NavigationService.navigate(SELECTTEAM, {
          //   contestDetails: details,
          //   matchDetails: matchDetails,
          //   teamDetails: details?.teamDetails,
          //   JoinWithMULT: details?.JoinWithMULT,
          //   joinWith: details.teams,
          //   selectTeam: selectTeam
          // })
        }
      }
      // }
    }
  };
  let checkingMulty = details?.teamDetails?.filter((e) => {
    return e?.contest_category_id == details?.contest_category_id
  })
  let checkingTrue = checkingMulty?.length == details.teams
  return (
    <Pressable style={styles.container} onPress={onClickContest}>
      <View style={styles.topContainer}>
        <View style={styles.top}>
          <AppText type={TEN} weight={LATO_BOLD} color={WHITE}>
            PRIZE POOL
          </AppText>
          {details?.JoinWithMULT && (
            <AppText type={TEN} weight={LATO_BOLD} color={WHITE}>
              Multiple Entries
            </AppText>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText type={FIFTEEN} weight={LATO_HEAVY} color={WHITE}>
            ₹{numberWithCommas(details?.winning_amount)}
          </AppText>
          <AppText
            type={TEN}
            color={WHITE}
            weight={LATO_BOLD}
            style={{
              marginLeft: 10,
              flex: 1,
              fontWeight: "500"
            }}>
            {details?.Winning_percent ? Number(details?.Winning_percent)?.toFixed(2) :
              0}% Winners l 1st ₹{details?.Rankdata[0]?.Price ?
                details?.Rankdata[0]?.Price : 0}
          </AppText>
          {details?.Contestsize == details?.joined || details?.remove == true || checkingTrue ? <></> :
            <Pressable style={styles.bedge} onPress={onJoinContest}>
              <AppText
                numberOfLines={1}
                style={{ color: 'white', marginHorizontal: 5, marginTop: 0, fontWeight: "800" }}
                weight={LATO_BOLD}
                type={THIRTEEN}>
                ₹{numberWithCommas(details?.EnteryFee)}
              </AppText>
            </Pressable>
          }
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            style={{ width: `${percentage}%`, height: '100%', borderRadius: 4 }}
            start={{ x: 0, y: 0 }}
            colors={[
              "#DBA73E",
              "#E0C77D",
            ]}></LinearGradient>
        </View>
        <View style={styles.flex}>
          <AppText type={TEN}
            weight={POPPINS_MEDIUM}
            color={WHITE}>
            {`${numberWithCommas(details?.Contestsize)} spots`}
          </AppText>
          <AppText type={TEN} weight={LATO_BOLD} color={GREEN}>
            {`${details?.Contestsize - (details?.joined || 0)} spots left`}
          </AppText>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.commonViewStyle}>
            <FastImage tintColor={'#DBA63D'} source={GLORY} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={styles.commonTextStyle}>
              {details?.EnteryType !== 'Paid' ||
                details?.Rankdata[0]?.Price == undefined
                ? 'Glory awaits!'
                : `₹${Math.round(details?.Rankdata[0]?.Price)}`}
            </AppText>
          </View>
          <View style={styles.commonViewStyle}>
            <FastImage tintColor={'#DBA63D'} source={WINNER} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={styles.commonTextStyle}>
              {details?.Winning_percent
                ? Number(details?.Winning_percent)?.toFixed(2)
                : 0}
              %
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              tintColor={'#DBA63D'}
              source={details?.JoinWithMULT ? m : SINGLE}
              resizeMode="contain"
              style={styles.gloryIcon}
              tintColor={colors.lightOrange}
            />
            <AppText
              type={TEN}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              style={[styles.commonTextStyle, {
                marginLeft: 4,
                fontWeight: '800'
              }]}>
              {' '}
              {details?.JoinWithMULT ? `Upto ${details?.teams}` : 'Single'}
            </AppText>
          </View>
        </View>
        {details?.ConfirmedWin && (
          <View style={styles.flex}>
            <FastImage tintColor={'#DBA63D'} source={GURANTEE} style={styles.gloryIcon} />
            <AppText
              type={TEN}
              color={WHITE}
              style={styles.commonTextStyle}>
              Guaranteed
            </AppText>
          </View>
        )}
      </View>
      <RBSheet
        ref={selectTeam}
        closeOnDragDown={false}
        openDuration={100}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            backgroundColor: NewColor.linerWhite,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}>
        <SelectTeam
          contestDetails={details}
          matchDetails={matchDetails}
          onClose={() => selectTeam?.current?.close()}
          selectTeam={selectTeam}
          teamDetails={details?.teamDetails}
          joinWith={details.teams}
          JoinWithMULT={details?.JoinWithMULT}
        />
      </RBSheet>
      <Confirmation
        isModalVisible={isAdd}
        details={details}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        teamLength={false}
        saveTeamName={saveTeamName}
        selectMulty={[]}
        JoinWithMULT={false}
      />
    </Pressable>
  );
};

export default ContestCard;
