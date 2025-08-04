import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FIFTEEN,
  LATO_BOLD,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TEN,
  THIRTEEN,
  WHITE,
} from '../../../common/AppText';
import { TouchableOpacityView } from '../../../common/TouchableOpacityView';
import NavigationService from '../../../navigation/NavigationService';
import { LEADERBOARD, PLAYER_PREVIEW, SELECT_PLAYER } from '../../../navigation/routes';
import styles from './styles';
import { formatDateTime, modifyName, numberWithCommas } from '../../../helper/utility';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../theme/color';
import { PENCIL, arrow } from '../../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import { getAllPlayerList, getTab, setAllPlayers } from '../../../slices/matchSlice';
import { universalPaddingHorizontal } from '../../../theme/dimens';
import { shareLinkTeam } from '../../../screens/ContestShare';
const MyContestListETC = ({ item }) => {
  const dispatch = useDispatch();
  const matchDetails = useSelector(state => state?.match?.contestData);
  const myContest = useSelector(state => state?.match?.myContest);
  const myTeams = useSelector(state => state?.match?.myTeams);
  const contestData = useSelector(state => state?.match?.contestData);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const [visible, setVisible] = useState(false)
  const { Status, _id, SeriesId } = contestData ?? '';
  let myTeamsData = item?.teamDetails?.map((e) => {
    return myTeams?.filter((i) => i?._id === e?.teamid);
  }).reduce((acc, val) => acc.concat(val), []);
  const percentage = (item?.user_contest_details?.joined / (item?.data?.Contestsize || 0)) * 100;
  const onNavigate = () => {
    NavigationService.navigate(LEADERBOARD, {
      details: {
        winning_amount: item?.data?.WinningAmount,
        JoinWithMULT: item?.data?.JoinWithMULT,
        EnteryFee: item?.data?.EnteryFee,
        Contestsize: item?.data?.Contestsize,
        joined: item?.contest_details?.joined,
        contest_category_id: item?.contest_category_id,
      },
      firstTeamName: matchDetails?.TeamA,
      secondTeamName: matchDetails?.TeamB,
      progressBarWidth: percentage,
      matchDetails: matchDetails,
      item: item,
      selfCreateContest: true,
      privateis:true,
      notLive:true
    });
  };
  let teamArray = Array(Number(item?.joined_with ?? 0)).fill(0);
  useEffect(() => {
  }, [item])
  const onEdit = (item) => {
    let player = [];
    let playerTwo = [];
    item?.players?.map(i => {
      return i?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join('')
        ? player?.push(i)
        : playerTwo?.push(i);
    });
    const captain = item?.players?.find(item => item.caption);
    const viceCaptain = item?.players?.find(item => item?.vice_caption);
    dispatch(getTab(''));
    dispatch(setAllPlayers([]))
    let data = { cid: SeriesId };
    dispatch(getAllPlayerList(_id, data));
    NavigationService.navigate(SELECT_PLAYER, {
      contestData,
      isEditMode: true,
      selectedPlayers: item?.players,
      team_id: item?._id,
      team_name: item?.name,
      captain: captain?.pid,
      viceCaptain: viceCaptain?.pid,
      cloneTeam: true,
      player: player,
      playerTwo: playerTwo,
    });
  }
  const onCardClick = (item) => {
    let selectedPlayers = item?.players?.map(k => {
      return k?.pid;
    });

    let usedCredit = 0;
    item?.players.forEach(
      player => (usedCredit = usedCredit + player?.fantasy_player_rating),
    );
    let availableCredits = Number(100) - Number(usedCredit);
    let player = [];
    let playerTwo = [];
    item?.players?.map(i => {
      return i?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join('')
        ? player?.push(i)
        : playerTwo?.push(i);
    });
    NavigationService.navigate(PLAYER_PREVIEW, {
      oldData: contestData,
      selectedPlayers: selectedPlayers,
      availableCredits: availableCredits,
      selectedPlayerDetails: item?.players,
      player: player,
      playerTwo: playerTwo,
      myTeam: true,
      teamName: item?.name,
      total_points: item?.total_points
    });
  }
  const formattedDateTime = formatDateTime(matchDetails?.StartDateTime);
  let dateArray = formattedDateTime?.split(' ');
  let dateArrayTwo = formattedDateTime.split(' ');
  let dateArrayThree = formattedDateTime.split(' ');
  let onlyTime = dateArrayThree[1] + ' ' + dateArrayTwo[2]
  let onlyDate = dateArray[0];
  const prize =
    (item?.data?.WinningAmount * item?.data?.Rankdata[0]?.TotalPercentage) /
    100;
  return (
    <TouchableOpacityView
      style={[
        styles.container,
        {
          // height: matchDetails?.Status === 'Scheduled' ? 116 : 98,
        },
      ]}
      onPress={onNavigate}>
      <View onPress={onNavigate} style={styles.topContainer}>
        <View style={[styles.top]}>
          <AppText type={TEN} weight={LATO_BOLD} color={BLACKOPACITY}>
            PRIZE POOL
          </AppText>
          {item?.JoinWithMULT && (
            <AppText type={TEN} weight={LATO_BOLD} color={BLACKOPACITY}>
              Multiple Entries
            </AppText>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <AppText style={{
            marginTop: 2
          }} type={FIFTEEN} weight={LATO_BOLD}>
            ₹{numberWithCommas(item?.data?.WinningAmount)}
          </AppText>
          <AppText
            color={BLACKOPACITY}
            weight={LATO_BOLD}
            type={TEN}
            style={{
              marginLeft: 10,
              flex: 1,
              marginTop: 2
            }}>
            {item?.Winning_percent ? Number(item?.Winning_percent)?.toFixed(2) :
              0}% Winners l 1st ₹{item?.data?.Rankdata[0]?.Price ?
                parseInt(item?.data?.Rankdata[0]?.Price)?.toFixed(2) : 0}
          </AppText>
          <AppText
            style={{
              marginTop: 2,
            }}
            color={BLACK}
            weight={LATO_BOLD}
            type={THIRTEEN}>
            ₹{item?.data?.EnteryFee}
          </AppText>
        </View>
        {matchDetails?.Status === 'Scheduled' && (
          <>
            <View style={styles.progressBar}>
              <LinearGradient
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  borderRadius: 4,
                }}
                start={{ x: 0, y: 0 }}
                colors={[
                  colors.borderBackColor,
                  colors.linerProgress,
                ]}></LinearGradient>
            </View>
            <View style={styles.flex}>
              <AppText color={BLACKOPACITY} weight={LATO_BOLD} type={TEN}>
                {numberWithCommas(item?.data?.Contestsize)} spots
              </AppText>
              <AppText
                style={{ color: '#37CC4C', fontSize: 10 }}
                weight={LATO_BOLD}>
                {Math.max(0, item?.data?.Contestsize - (item?.user_contest_details?.joined || 0))} left
              </AppText>
            </View>
          </>
        )}
      </View>
      <View
        style={[
          styles.bottomContainer,
          { marginTop: matchDetails?.Status === 'Scheduled' ? 5 : 5 },
        ]}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <AppText
            style={{ opacity: 0.5, color: 'black' }}
            type={TEN}
            weight={POPPINS_SEMI_BOLD}>
            Created by {item?.data?.createdby}
          </AppText>
          {item?.data?.contestcreater_id == userData?._id ?
            <TouchableOpacityView
              onPress={() =>
                shareLinkTeam(
                  prize,
                  item?.data?.EnteryFee,
                  item?.data?.Contestsize,
                  matchDetails?.short_title,
                  item?.match_id,
                  item.contest_category_id,
                  onlyTime,
                  onlyDate,
                )
              }
              style={{
                paddingHorizontal: 10,
                height: 22,
                alignItems: 'center',
                backgroundColor: '#0C4BA0',
                justifyContent: 'center',
                borderRadius: 4,
                flexDirection: "row"
              }}>
              <AppText color={WHITE} style={{ marginTop: 2, fontSize: 10 }}>SHARE</AppText>
            </TouchableOpacityView>
            : <></>}
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <AppText color={BLACKOPACITY} type={TEN} weight={LATO_BOLD}>
            JOINED WITH {item?.teamDetails?.length} TEAM
          </AppText>
          <TouchableOpacityView
            onPress={() => setVisible(!visible)}
            style={{
              padding: 5
            }} >
            <FastImage
              style={{
                height: 15,
                width: 15,
                transform: [{ rotate: visible ? '90deg' : '270deg' }]
              }}
              source={arrow} tintColor={colors.black} resizeMode='contain' />
          </TouchableOpacityView>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item?.teamDetails?.map((item, index) => {
            return (
              <View style={styles.grayContainer}>
                <AppText style={{ marginTop: 1 }} color={WHITE} type={TEN}>
                  {item.name}
                </AppText>
              </View>
            );
          })}
        </View>
        {visible ?
          <>
            {myTeamsData?.map((item) => {
              const match = item?.name.match(/\d+/);
              const teamNumber = match ? match[0] : '';
              const captain = item?.players?.find(item => item.caption);
              const viceCaptain = item?.players?.find(item => item?.vice_caption);
              return (
                <TouchableOpacityView
                  onPress={() => onCardClick(item)}
                  style={{
                    paddingVertical: 10,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    marginTop: 10
                  }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'
                  }} >
                    <AppText
                      weight={POPPINS_SEMI_BOLD}
                      color={BLACK}>
                      Team {teamNumber}
                    </AppText>
                    <TouchableOpacityView
                      style={{ padding: 5 }}
                      onPress={() => onEdit(item)}>
                      <FastImage
                        resizeMode='contain'
                        style={{
                          height: 14,
                          width: 14
                        }}
                        tintColor={'black'}
                        source={PENCIL} />
                    </TouchableOpacityView>
                  </View>
                  <View style={{
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }} >
                    <View style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} >
                      <AppText
                        style={{ opacity: 0.5 }}
                        weight={POPPINS_MEDIUM}
                        color={BLACK}>
                        Captain
                      </AppText>
                      <AppText
                        weight={POPPINS_SEMI_BOLD}
                        color={BLACK}>
                        {captain?.first_name && modifyName(captain?.first_name)}
                      </AppText>
                    </View>
                    <View style={{
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} >
                      <AppText
                        style={{ opacity: 0.5 }}
                        weight={POPPINS_MEDIUM}
                        color={BLACK}>
                        Vice Captain
                      </AppText>
                      <AppText
                        weight={POPPINS_SEMI_BOLD}
                        color={BLACK}>
                        {viceCaptain?.first_name && modifyName(viceCaptain?.first_name)}
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacityView>
              )
            })}
          </> : <></>}
      </View>
    </TouchableOpacityView>
  );
};
export default MyContestListETC;
