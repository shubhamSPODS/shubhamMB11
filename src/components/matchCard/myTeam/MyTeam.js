import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, Share, StyleSheet, View } from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import {
  AppText,
  BLACK,
  EIGHT,
  ELEVEN,
  FORTEEN,
  GREEN,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SEMI_BOLD,
  TEN,
  TWELVE,
  WHITE,
} from '../../../common/AppText';
import { TouchableOpacityView } from '../../../common/TouchableOpacityView';
import {
  CAPTAIN,
  COPY,
  GRASS,
  PANT,
  PENCIL,
  SHARE,
  VICE_CAPTAIN,
  all_rounderIcon,
  batsmanIcon,
  bowlerIcon,
  substituteIcon,
  wicket_keeperIcon,
} from '../../../helper/image';
import styles from './styles';
import { PLAYER_PREVIEW, SELECT_PLAYER, SELECT_SUBSTITUTE } from '../../../navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectContest from '../selectContest/SelectContest';
import NavigationService from '../../../navigation/NavigationService';
import { getAllPlayerList, getShareUrl, getSubsituted, getTab, setAllPlayers, setIsContestEntry } from '../../../slices/matchSlice';
import { colors } from '../../../theme/color';
import { formatDateTime, modifyName, shareToAny } from '../../../helper/utility';
import LinearGradient from 'react-native-linear-gradient';
import { universalPaddingHorizontal } from '../../../theme/dimens';
import dynamicLinks from '@react-native-firebase/dynamic-links';
export const shareTeamMessage = (userName, s1, s2, series, id) => {
  let temp = `Pick my Battle Infinity team with just one tap!\n\n${userName}'s team for ${s1} VS ${s2} | ${series}\n Sport:Cricket\nhttps://www.battleinfinity.io/${id}`;
  return temp;
};

export const createLink = async (teamid, userId, matchId) => {
  try {
    const link = await dynamicLinks().buildShortLink({
      link: `https://mybattle11.page.link/eNh4?teamId=${teamid}&userId=${userId}&matchID=${matchId}`,
      domainUriPrefix: 'https://mybattle11.page.link',
      android: {
        packageName: 'com.myapp.mybattle11'
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    }, dynamicLinks.ShortLinkType.DEFAULT);
    return link;
  } catch (error) {
  }
};
export const shareLinkTeam = async (userName, s1, s2, series, id, time, date, teamid, userId, matchId) => {
  const link = await createLink(teamid, userId, matchId);
  const message = `Pick my My Battle 11 team with just one tap!\n\n${userName}'s team for ${s1} VS ${s2} | ${series}\nDate: ${date}\nTime: ${time}\n\n ${link}`;
  try {
    Share.share({
      message: message,
    });
  } catch (error) {
  }
};
const MyTeam = ({ item, isFromSelect = false, onSelectTeam, isTeamSelected, tab }) => {
  const dispatch = useDispatch();

  const contestData = useSelector(state => state?.match?.contestData);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const shareLink = useSelector(state => state?.match?.shareLink);
  const { Status, _id, SeriesId } = contestData ?? '';
  const [wiketKiper, setWiketKiper] = useState(0);
  const [batsman, setBatsman] = useState(0);
  const [allRounder, setAllRounder] = useState(0);
  const [bowler, setBowler] = useState(0);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [availableCredits, setAvailableCredits] = useState(100);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const convertToTeamsTitle2 = arr => {
    const TeamsTitle2 = arr && arr?.map(title => title.trim());
    return TeamsTitle2;
  };
  const removedSpacesTeamsTitle = convertToTeamsTitle2(contestData?.TeamsTitle);
  const formattedDateTime = formatDateTime(contestData?.StartDateTime);
  let dateArray = formattedDateTime?.split(' ');
  let dateArrayTwo = formattedDateTime.split(' ');
  let dateArrayThree = formattedDateTime.split(' ');
  let onlyTime = dateArrayThree[1] + ' ' + dateArrayTwo[2]
  let onlyDate = dateArray[0];
  const selectContestRef = useRef(null);
  const { username } = userData ?? '';
  const currentDate = new Date();
  const inputDate = new Date(contestData?.StartDateTime);

  const isPastTime = inputDate < currentDate;
  let newData = [];
  item?.players?.forEach(player => {
    let data = { ...player };
    data['title'] = player?.primary_team?.title;
    newData.push(data);
  });
  useEffect(() => {
    const batsman = item?.players?.filter(
      player => player.playing_role == 'bat',
    );
    const bowler = item?.players?.filter(
      player => player.playing_role == 'bowl',
    );
    const wicketKiper = item?.players?.filter(
      player => player.playing_role == 'wk',
    );
    const allRounder = item?.players?.filter(
      player => player.playing_role == 'all',
    );

    const captain = item?.players?.find(item => item.caption);
    const viceCaptain = item?.players?.find(item => item?.vice_caption);
    setCaptain(captain);
    setViceCaptain(viceCaptain);
    setBatsman(batsman.length);
    setBowler(bowler.length);
    setWiketKiper(wicketKiper?.length);
    setAllRounder(allRounder?.length);
  }, [item?.players]);
  useEffect(() => {
    const firstTeamCount = item?.players?.filter(
      item =>
        item?.primary_team?.title === removedSpacesTeamsTitle[0] &&
        !item?.substitute,
    );
    const secondTeamCount = item?.players?.filter(
      item =>
        item?.primary_team?.title === removedSpacesTeamsTitle[1] &&
        !item?.substitute,
    );
    setTeamDetails({
      firstTeamName: contestData?.TeamsShortNames[0],
      secondTeamName: contestData?.TeamsShortNames[1],
      firstTeamCount: firstTeamCount,
      secondTeamCount: secondTeamCount,
    });
  }, []);
  useEffect(() => {
    dispatch(getShareUrl(item?._id));
  }, []);
  const onCardClick = (total_points) => {
    if (isFromSelect) {
      return onSelectTeam(item);
    } else {
      let selectedPlayers = item?.players?.map(k => {
        return k?.pid;
      });

      const usedCredit = item?.players
        .filter(item => !item.substitute) // Filter only objects with "substitute" as false
        .reduce((total, item) => total + item.fantasy_player_rating, 0);
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
        player: teamDetails?.firstTeamCount,
        playerTwo: teamDetails?.secondTeamCount,
        myTeam: true,
        teamName: item?.name,
        total_points: total_points,
        replacedPlayers: item?.replacedPlayers,
        notReplacedSubstitutes: item?.notReplacedSubstitutes
      });
    }
  };
  const onEdit = () => {
    let player = [];
    let playerTwo = [];
    item?.players?.map(i => {
      return i?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join('')
        ? player?.push(i)
        : playerTwo?.push(i);
    });
    dispatch(getTab(''));
    dispatch(setAllPlayers([]))
    let data = { cid: SeriesId };
    dispatch(getAllPlayerList(_id, data));
    dispatch(setIsContestEntry(false));
    NavigationService.navigate(SELECT_PLAYER, {
      contestData,
      isEditMode: true,
      selectedPlayers: newData,
      team_id: item?._id,
      team_name: item?.name,
      captain: captain?.pid,
      viceCaptain: viceCaptain?.pid,
      cloneTeam: true,
      player: teamDetails?.firstTeamCount,
      playerTwo: teamDetails?.secondTeamCount,
    });
  };
  const onCloneTeam = () => {
    let player = [];
    let playerTwo = [];
    item?.players?.map(i => {
      return i?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join('')
        ? player?.push(i)
        : playerTwo?.push(i);
    });
    dispatch(getTab(''));
    dispatch(setAllPlayers([]))
    let data = { cid: SeriesId };
    dispatch(getAllPlayerList(_id, data));
    dispatch(setIsContestEntry(false));
    NavigationService.navigate(SELECT_PLAYER, {
      contestData,
      isCloneMode: true,
      selectedPlayers: newData,
      captain: captain?.pid,
      viceCaptain: viceCaptain?.pid,
      cloneTeam: true,
      player: teamDetails?.firstTeamCount,
      playerTwo: teamDetails?.secondTeamCount,
    });
  };
  const subsituteButton = () => {
    dispatch(setAllPlayers([]))
    let data = { cid: contestData?.SeriesId };
    dispatch(getAllPlayerList(contestData?._id, data, true, newData));
    let substitutePlayer = newData?.filter(item => {
      return item?.substitute === true;
    });
    let selectedPlayers = item?.players?.map(k => {
      return k?.pid;
    });
    const usedCredit = item?.players
      .filter(item => !item.substitute) // Filter only objects with "substitute" as false
      .reduce((total, item) => total + item.fantasy_player_rating, 0);
    let availableCredits = Number(100) - Number(usedCredit);
    const pidtwo = substitutePlayer.map(player => player?.pid);
    const pid = selectedPlayers.filter(item => !pidtwo.includes(item));
    dispatch(getSubsituted(substitutePlayer));
    NavigationService.navigate(SELECT_SUBSTITUTE, {
      matchDetails: contestData,
      selctedPlayerDetails: newData,
      selectedPlayers: pid,
      isEditMode: true,
      team_name: item?.name,
      vice_caption: viceCaptain?.pid,
      captainId: captain?.pid,
      team_id: item?._id,
      onlyOne: true,
      substitutePlayer: substitutePlayer,
      player: teamDetails?.firstTeamCount,
      playerTwo: teamDetails?.secondTeamCount,
      availableCredits: availableCredits
    });
  };




  const playerIconViceCaptain =
    viceCaptain?.playing_role === 'wk'
      ? wicket_keeperIcon
      : viceCaptain?.playing_role === 'bowl'
        ? bowlerIcon
        : viceCaptain?.playing_role === 'bat'
          ? batsmanIcon
          : viceCaptain?.playing_role === 'all'
            ? all_rounderIcon
            : null;
  const playerIconCaptain =
    captain?.playing_role === 'wk'
      ? wicket_keeperIcon
      : captain?.playing_role === 'bowl'
        ? bowlerIcon
        : captain?.playing_role === 'bat'
          ? batsmanIcon
          : captain?.playing_role === 'all'
            ? all_rounderIcon
            : null;
  const playercolorcaptain =
    captain?.primary_team?.title === removedSpacesTeamsTitle[0]
      ? { backgroundColor: colors.black }
      : captain?.primary_team?.title === removedSpacesTeamsTitle[1]
        ? { backgroundColor: colors.white }
        : null;
  const playercolorviceCaptain =
    viceCaptain?.primary_team?.title === removedSpacesTeamsTitle[0]
      ? { backgroundColor: colors.black }
      : viceCaptain?.primary_team?.title === removedSpacesTeamsTitle[1]
        ? { backgroundColor: colors.white }
        : null;
  const playercolorcaptainText =
    captain?.primary_team?.title === removedSpacesTeamsTitle[0]
      ? colors.white
      : captain?.primary_team?.title === removedSpacesTeamsTitle[1]
        ? colors.black
        : null;
  const playercolorviceCaptainText =
    viceCaptain?.primary_team?.title === removedSpacesTeamsTitle[0]
      ? colors.white
      : viceCaptain?.primary_team?.title === removedSpacesTeamsTitle[1]
        ? colors.black
        : null;
  const unannouncedPlayer = item?.players?.filter((value) => {
    return value?.playing11 == "false" && value?.substitute === false
  })
  const unannouncedPlayerPlus = item?.players?.filter((value) => {
    return value?.playing11 == "false" && value?.substitute === true
  })
  let substitutePlayer = newData?.filter(item => {
    return item?.substitute === true;
  });
  return (
    <>
      {isPastTime ?
        <></> :
        <>
          {unannouncedPlayer?.length || unannouncedPlayerPlus?.length ?
            <View>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0 }}
                colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo,]}
                style={[formateStyle.subsituteContainer]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -7 }} >
                  <AppText
                    color={WHITE}
                    type={ELEVEN} weight={POPPINS_SEMI_BOLD} style={{ marginLeft: 5, marginTop: 1 }} >
                    {unannouncedPlayer?.length ? `(${unannouncedPlayer?.length}) Unannounced ` : ''}{unannouncedPlayerPlus?.length ? `(${unannouncedPlayerPlus?.length}) Substitute Unannounced` : ''}
                  </AppText>
                </View>
              </LinearGradient>
            </View>
            :
            <></>
          }
        </>}
      <Pressable
        style={[
          styles.card,
          isFromSelect &&
          isTeamSelected && {
            borderColor: colors.borderBlue,
            borderWidth: 3,
          },
        ]}
        onPress={() => onCardClick(item?.total_points)}>
        <ImageBackground style={styles.topContainer} source={GRASS}>
          <View style={styles.top}>
            <AppText color={WHITE} type={TWELVE} weight={POPPINS_SEMI_BOLD}>
              {username} {`(${item?.name})`} {item.total_points ? <AppText type={TWELVE}
                weight={POPPINS_BOLD}
                color={GREEN}> Total Points {item.total_points}</AppText> : <></>}
            </AppText>

            <View style={{ flexDirection: 'row' }}>
           
              {tab !== 'Completed' && tab !== 'Live' && (
                <TouchableOpacityView style={{ padding: 5 }} onPress={onEdit}>
                  <FastImage source={PENCIL} style={styles.icon} />
                </TouchableOpacityView>
              )}
              {tab !== 'Completed' && tab !== 'Live' && (
                <TouchableOpacityView style={{ padding: 5 }} onPress={onCloneTeam}>
                  <FastImage source={COPY} style={styles.icon} />
                </TouchableOpacityView>
              )}
              <TouchableOpacityView
                style={{
                  padding: 5,
                }}
                onPress={() =>
                  shareLinkTeam(
                    username,
                    teamDetails?.firstTeamName,
                    teamDetails?.secondTeamName,
                    contestData?.SeriesName,
                    shareLink,
                    onlyTime,
                    onlyDate,
                    item?._id,
                    item?.user_id,
                    item?.matchid
                  )}>
                <FastImage source={SHARE} style={styles.icon} />
              </TouchableOpacityView>
            </View>
          </View>
          <View style={styles.midContainer}>
            <View style={{ justifyContent: 'center', }}>
              <AppText type={FORTEEN} color={WHITE} weight={POPPINS_BOLD}>
                {teamDetails?.firstTeamCount?.length}
              </AppText>
              <AppText color={WHITE} weight={POPPINS_MEDIUM}>
                {teamDetails?.firstTeamName}
              </AppText>
            </View>
            <View style={styles.playerContainer}>
              <FastImage source={CAPTAIN} style={styles.captainBedge} />
              <View style={{ alignItems: 'center' }}>
                <FastImage
                  source={captain?.profile_image ? { uri: captain?.profile_image } : playerIconCaptain}
                  style={styles.playerImage}
                />
                <View style={[styles.playerName, playercolorcaptain]}>
                  <AppText
                    style={{ textAlign: 'center', color: playercolorcaptainText }}
                    type={EIGHT}
                    // numberOfLines={1}
                    weight={POPPINS_SEMI_BOLD}>
                    {captain?.first_name && modifyName(captain?.first_name)}
                  </AppText>
                </View>
              </View>
            </View>
            <View style={styles.playerContainer}>
              <FastImage source={VICE_CAPTAIN} style={[styles.captainBedge, { left: viceCaptain?.profile_image ? -5 : -15 }]} />
              <View style={{ alignItems: 'center' }}>
                <FastImage
                  source={viceCaptain?.profile_image ? { uri: viceCaptain?.profile_image } : playerIconViceCaptain}
                  style={styles.playerImage}
                />
                <View style={[styles.playerName, playercolorviceCaptain]}>
                  <AppText
                    style={{ textAlign: 'center', color: playercolorviceCaptainText }}
                    type={EIGHT}
                    weight={POPPINS_SEMI_BOLD}>
                    {viceCaptain?.first_name && modifyName(viceCaptain?.first_name)}
                  </AppText>
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              <AppText
                type={FORTEEN}
                color={WHITE}
                style={{ fontSize: 15 }}
                weight={POPPINS_BOLD}>
                {teamDetails?.secondTeamCount?.length}
              </AppText>
              <AppText color={WHITE} weight={POPPINS_MEDIUM}>
                {teamDetails?.secondTeamName}
              </AppText>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.bottom}>
          <AppText type={TEN} color={BLACK} weight={POPPINS_SEMI_BOLD}>
            {` WK (${wiketKiper})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS_SEMI_BOLD}>
            {`BAT (${batsman})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS_SEMI_BOLD}>
            {`AR (${allRounder})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS_SEMI_BOLD}>
            {`BOWL(${bowler})`}
          </AppText>
        </View>
        <RBSheet
          ref={selectContestRef}
          closeOnDragDown={false}
          openDuration={100}
          height={Dimensions.get('window').height}
          customStyles={{
            container: {
              backgroundColor: 'black',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
              display: 'none',
            },
          }}>
          <SelectContest
            contestDetails={contestData}
            // matchDetails={matchDetails}
            onClose={() => selectContestRef?.current?.close()}
          />
        </RBSheet>
      </Pressable>
    </>

  );
};

export default MyTeam;
const formateStyle = StyleSheet.create({
  subsituteContainer: {
    backgroundColor: '#4A99FF',
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 35,
    marginBottom: -13,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingHorizontal: universalPaddingHorizontal,
    justifyContent: "space-between"
  }
})