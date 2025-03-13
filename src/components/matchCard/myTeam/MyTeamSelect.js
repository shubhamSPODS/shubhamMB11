import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  AppText,
  BLACK,
  EIGHT,
  FORTEEN,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
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
  tick,
  wicket_keeperIcon,
} from '../../../helper/image';
import styles from './styles';
import { PLAYER_PREVIEW, SELECT_PLAYER } from '../../../navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectContest from '../selectContest/SelectContest';
import NavigationService from '../../../navigation/NavigationService';
import { getAllPlayerList, getShareUrl, getTab, setAllPlayers } from '../../../slices/matchSlice';
import { colors } from '../../../theme/color';
import { modifyName, shareToAny } from '../../../helper/utility';
import { shareLinkTeam } from './MyTeam';

export const shareTeamMessage = (userName, s1, s2, series, id) => {
  let temp = `Pick my Battle Infinity team with just one tap!\n\n${userName}'s team for ${s1} VS ${s2} | ${series}\n Sport:Cricket\nhttps://www.battleinfinity.io/${id}`;
  return temp;
};

const MyTeamSelect = ({ item, isFromSelect = false, onSelectTeam, JoinWithMULT, isTeamSelected, tab, selectMulty, checkingTeam }) => {
  const dispatch = useDispatch();

  const contestData = useSelector(state => state?.match?.contestData);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const shareLink = useSelector(state => state?.match?.shareLink);
  const { full_name, logo } = userData ?? '';
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
  const removedSpacesTeamsTitle = convertToTeamsTitle2(
    contestData?.TeamsShortNames,
  );
  const selectContestRef = useRef(null);
  const { username } = userData ?? '';
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
    const firstTeam = item?.players?.filter(
      e =>
        e?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join(''),
    );
    const secondTeam = item?.players?.filter(
      e => e?.primary_team?.abbr == contestData?.TeamsShortNames[1],
    );
    setTeamDetails({
      firstTeamName: contestData?.TeamsShortNames[0],
      secondTeamName: contestData?.TeamsShortNames[1],
      firstTeamCount: firstTeam?.length,
      secondTeamCount: secondTeam?.length,
    });
    // const teams = [...new Set(item?.players?.map(data => data?.country))];
    // const firstTeamName = teams[0];
    // const secondTeamName = teams[1];
    // const firstTeamCount = item?.players?.filter(
    //   item => item?.country == firstTeamName,
    // )?.length;
    // const secondTeamCount = item?.players?.filter(
    //   item => item?.country == secondTeamName,
    // )?.length;
    // setTeamDetails({
    //   firstTeamName: firstTeamName,
    //   secondTeamName: secondTeamName,
    //   firstTeamCount: firstTeamCount,
    //   secondTeamCount: secondTeamCount,
    // });
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
        total_points: total_points
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
    NavigationService.navigate(SELECT_PLAYER, {
      contestData,
      isCloneMode: true,
      selectedPlayers: item?.players,
      captain: captain?.pid,
      viceCaptain: viceCaptain?.pid,
      cloneTeam: true,
      player: player,
      playerTwo: playerTwo,
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
    captain?.primary_team?.abbr === removedSpacesTeamsTitle[0]
      ? { backgroundColor: '#000000' }
      : captain?.primary_team?.abbr === removedSpacesTeamsTitle[1]
        ? { backgroundColor: '#FFFFFF' }
        : null;
  const playercolorviceCaptain =
    viceCaptain?.primary_team?.abbr === removedSpacesTeamsTitle[0]
      ? { backgroundColor: '#000000' }
      : viceCaptain?.primary_team?.abbr === removedSpacesTeamsTitle[1]
        ? { backgroundColor: '#FFFFFF' }
        : null;
  const playercolorcaptainText =
    captain?.primary_team?.abbr === removedSpacesTeamsTitle[0]
      ? '#FFFFFF'
      : captain?.primary_team?.abbr === removedSpacesTeamsTitle[1]
        ? '#000000'
        : null;
  const playercolorviceCaptainText =
    viceCaptain?.primary_team?.abbr === removedSpacesTeamsTitle[0]
      ? '#FFFFFF'
      : viceCaptain?.primary_team?.abbr === removedSpacesTeamsTitle[1]
        ? '#000000'
        : null;
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }} >
      <Pressable
        style={[
          styles.card,
          {
            borderColor: colors.brownYellow,
            borderWidth: 1,
            width: !JoinWithMULT || checkingTeam ? '100%' : '85%'
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
              {/* {tab !== 'Completed' && tab !== 'Live' && (
                <TouchableOpacityView onPress={subsituteButton} style={{ padding: 5 }} >
                  <FastImage
                    source={substituteIcon}
                    resizeMode="contain"
                    style={{ height: 16, width: 16 }}
                  />
                </TouchableOpacityView>
              )} */}
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
        <View style={[styles.bottom,{marginTop:-2}]}>
          <AppText type={TEN} color={BLACK} weight={POPPINS}>
            {` WK (${wiketKiper})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS}>
            {`BAT (${batsman})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS}>
            {`AR (${allRounder})`}
          </AppText>
          <AppText type={TEN} color={BLACK} weight={POPPINS}>
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
      {!JoinWithMULT || checkingTeam ? <></> : isFromSelect ?
        <TouchableOpacityView
          onPress={() => onSelectTeam(item)}
          style={{
            height: 20, width: 20,
            borderWidth: 2,
            borderColor: '#4A99FF',
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 15
          }}>
          {selectMulty || checkingTeam ?
            <FastImage
              source={tick}
              resizeMode='contain'
              tintColor={'#4A99FF'}
              style={{
                height: 12,
                width: 11,
              }}
            />
            : <></>}
        </TouchableOpacityView>
        : <></>}
    </View>

  );
};

export default MyTeamSelect;
