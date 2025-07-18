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
import { modifyName, numberWithCommas } from '../../../helper/utility';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../theme/color';
import { PENCIL, arrow, downArrow } from '../../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import { getAllPlayerList, getTab, setAllPlayers } from '../../../slices/matchSlice';
import { universalPaddingHorizontal } from '../../../theme/dimens';
const MyContestList = ({ item, isScoreboard = false }) => {
  const dispatch = useDispatch();
  const matchDetails = useSelector(state => state?.match?.contestData);
  const myContest = useSelector(state => state?.match?.myContest);
  const myTeams = useSelector(state => state?.match?.myTeams);
  const contestData = useSelector(state => state?.match?.contestData);
  const currentDate = new Date();
  const inputDate = new Date(matchDetails?.StartDateTime);
  const isPastTime = inputDate < currentDate;
  
  // Use Redux matchDetails instead of props for time calculation
  const reduxMatchDetails = useSelector(state => state?.match?.contestData);
  const reduxInputDate = new Date(reduxMatchDetails?.StartDateTime);
  const reduxIsPastTime = reduxInputDate < currentDate;
  
  const [visible, setVisible] = useState(false);
  const [listShow, setListShow] = useState(false)
  const { Status, _id, SeriesId } = contestData ?? '';
  
  
  let myTeamsData = isScoreboard ? 
    item?.scoreboardDetails || [] :
    item?.teamDetails?.map((e) => {
      return myTeams?.filter((i) => i?._id === e?.teamid);
    }).reduce((acc, val) => acc.concat(val), []);
  
  // Helper function to get contest data with fallbacks
  const getContestData = (field) => {
    // Try multiple data sources in order of preference
    const sources = [
      item?.data?.[field],
      item?.contest_details?.[field],
      item?.[field],
      item?.data?.[field.toLowerCase()],
      item?.contest_details?.[field.toLowerCase()],
      item?.[field.toLowerCase()]
    ];
    
    for (const source of sources) {
      if (source !== undefined && source !== null) {
        return source;
      }
    }
    return 0; // Default fallback
  };
  
  const winningAmount = getContestData('WinningAmount') || getContestData('winning_amount');
  const entryFee = getContestData('EnteryFee') || getContestData('EntryFee') || getContestData('entry_fee');
  const contestSize = getContestData('Contestsize') || getContestData('ContestSize') || getContestData('contest_size');
  const joined = getContestData('joined') || item?.contest_details?.joined || 0;
  const rankData = item?.data?.Rankdata || item?.Rankdata || [{ Price: winningAmount }];
  
  const percentage = contestSize > 0 ? (joined / contestSize) * 100 : 0;
  
  console.log('🎯 Extracted contest data:', {
    winningAmount,
    entryFee,
    contestSize,
    joined,
    percentage,
    rankData
  });
  
  // Debug logging for UI display values
  console.log('🎯 UI Display values:', {
    winningAmountDisplay: winningAmount ? numberWithCommas(winningAmount) : 0,
    contestSizeDisplay: numberWithCommas(contestSize),
    entryFeeDisplay: entryFee ? entryFee : 0,
    winningAmountType: typeof winningAmount,
    contestSizeType: typeof contestSize,
    entryFeeType: typeof entryFee
  });
  const onNavigate = () => {

    NavigationService.navigate(LEADERBOARD, {
      details: {
        details: item,
        winning_amount: winningAmount,
        JoinWithMULT: item?.data?.JoinWithMULT || item?.JoinWithMULT,
        EnteryFee: entryFee,
        Contestsize: contestSize,
        joined: joined,
        contest_category_id: item?.contest_category_id,
        shadow_contest_id: item?.contest_details?.shadow_contest_id || item?.shadow_contest_id,
        myContestIN: true,
        Winning_percent: item?.Winning_percent,
        teams: item?.data?.teams,
        contest_type: item?.contest_type,
        ContestType: item?.ContestType,
        _id: item?._id,
        ...item 
      },
      firstTeamName: matchDetails?.TeamA,
      secondTeamName: matchDetails?.TeamB,
      progressBarWidth: percentage,
      matchDetails: {
        ...matchDetails,
        MatchId: matchDetails?.MatchId || matchDetails?._id 
      },
      Rankdata: rankData,
      shadow_contest_id: item?.contest_details?.shadow_contest_id || item?.shadow_contest_id,
      isScoreboard: isScoreboard,
      totalTeamCount: isScoreboard ? item?.scoreboardDetails?.length || 0 : item?.teamDetails?.length || 0
    });
  };
  let teamArray = Array(Number(item?.joined_with ?? 0)).fill(0);

  const onEdit = (item) => {
    let player = [];
    let playerTwo = [];
    item?.players?.map(i => {
      return i?.primary_team?.abbr ==
        contestData?.TeamsShortNames[0]?.split(' ').join('')
        ? player?.push(i)
        : playerTwo?.push(i);
    });
    let newData = [];
    item?.players?.forEach(player => {
      let data = { ...player };
      data['title'] = player?.primary_team?.title;
      newData.push(data);
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
      selectedPlayers: newData,
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
    let newData = [];
    item?.players?.forEach(player => {
      let data = { ...player };
      data['title'] = player?.primary_team?.title;
      newData.push(data);
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
      selectedPlayerDetails: newData,
      player: player,
      playerTwo: playerTwo,
      myTeam: true,
      teamName: item?.name,
      total_points: item?.total_points
    });
  };
  let sortedData = item?.teamDetails && item?.teamDetails.sort((a, b) => a.rank - b.rank); 
  return (
    <TouchableOpacityView
      style={[
        styles.container,
       
      ]}
      onPress={onNavigate}>
      <View onPress={onNavigate} style={styles.topContainer}>
        <View style={[styles.top]}>
          <AppText type={TEN} weight={LATO_BOLD} color={WHITE}>
            PRIZE POOL
          </AppText>
          {item?.JoinWithMULT && (
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
            marginBottom: 10,
          }}>
          <AppText style={{
            marginTop: 2
          }} type={FIFTEEN} weight={LATO_BOLD} color={WHITE}>
            ₹{winningAmount ? numberWithCommas(winningAmount) : 0}
          </AppText>
          <AppText
            color={WHITE}
            weight={LATO_BOLD}
            type={TEN}
            style={{
              marginLeft: 10,
              flex: 1,
              marginTop: 2
            }}>
            {item?.Winning_percent ? Number(item?.Winning_percent)?.toFixed(2) :
              0}% Winners l 1st ₹{rankData[0]?.Price ?
                rankData[0]?.Price : 0}
          </AppText>
          <AppText
            style={{
              marginTop: 2,
            }}
            color={WHITE}
            weight={LATO_BOLD}
            type={THIRTEEN}>
            ₹{entryFee ? entryFee : 0}
          </AppText>
        </View>
        {!reduxIsPastTime && (
          <>
            <View style={styles.progressBar}>
              <LinearGradient
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: colors.borderPick
                }}
                start={{ x: 0, y: 0 }}
                colors={[
                  "#DBA73E",
                  "#E0C77D",
                ]}></LinearGradient>
            </View>
            <View style={styles.flex}>
              <AppText color={BLACKOPACITY} weight={LATO_BOLD} type={TEN}>
                {numberWithCommas(contestSize)} spots
              </AppText>
              <AppText
                style={{ color: '#37CC4C', fontSize: 10 }}
                weight={LATO_BOLD}>
                {contestSize - joined}{' '}
                spots left
              </AppText>
            </View>
          </>
        )}
      </View>
      {isPastTime ?
        <>
          <TouchableOpacityView
            onPress={() => setListShow(!listShow)}
            style={styles.listdownContainer}>
            <AppText>
              Team & Rank
            </AppText>
            <FastImage source={downArrow} resizeMode='contain' tintColor={colors.white}
              style={[styles.downArrowList,
              { transform: [{ rotate: listShow ? "0deg" : "180deg" }] }]} />
          </TouchableOpacityView>
          {listShow ?
            <View
              style={[
                styles.bottomContainer,
                { marginTop: !isPastTime ? 5 : 5 },
              ]}>
              {sortedData?.map((item) => {
                return (
                  <View style={{
                    backgroundColor: '#343434',
                    paddingVertical: 10,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    marginBottom: 5
                  }}>
                    <AppText weight={POPPINS_SEMI_BOLD}>
                      {item?.name}
                    </AppText>
                    <AppText weight={POPPINS_SEMI_BOLD}>
                      {item.totalpoints} Pts
                    </AppText>
                    <AppText weight={POPPINS_SEMI_BOLD}>
                      #{item.rank}
                    </AppText>
                  </View>
                )
              })}
            </View>
            : <></>}
        </>
        :
        <View
          style={[
            styles.bottomContainer,
            { marginTop: matchDetails?.Status === 'Scheduled' ? 5 : 5 },
          ]}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: -10
          }}>
            <AppText color={WHITE} type={TEN} weight={LATO_BOLD}>
              {isScoreboard ? 
                `JOINED WITH ${item?.scoreboardDetails?.length || 0} SCOREBOARD` :
                `JOINED WITH ${item?.teamDetails?.length} TEAM`
              }
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
                source={arrow} tintColor={colors.white} resizeMode='contain' />
            </TouchableOpacityView>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isScoreboard ? 
              item?.scoreboardDetails?.map((scoreboard, index) => {
                return (
                  <View key={index} style={styles.grayContainer}>
                    <AppText style={{ marginTop: 1 }} color={WHITE} type={TEN}>
                      {scoreboard.name}
                    </AppText>
                  </View>
                );
              }) :
              item?.teamDetails?.map((item, index) => {
                return (
                  <View key={index} style={styles.grayContainer}>
                    <AppText style={{ marginTop: 1 }} color={WHITE} type={TEN}>
                      {item.name}
                    </AppText>
                  </View>
                );
              })
            }
          </View>
          {visible ?
            <>
              {isScoreboard ?
                // Scoreboard expanded view
                item?.scoreboardDetails?.map((scoreboard, index) => {
                  return (
                    <TouchableOpacityView
                      key={index}
                      style={{
                        paddingVertical: 10,
                        backgroundColor: '#343434',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        marginTop: 10
                      }}>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between'
                      }} >
                        <View>
                          <AppText
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            {scoreboard.name}
                          </AppText>
                          <AppText
                            type={TEN}
                            color="#999"
                            style={{ marginTop: 2 }}>
                            Points: {scoreboard.scoreboardData?.total_points || 0}
                          </AppText>
                          <AppText
                            type={TEN}
                            color="#999">
                            Accuracy: {scoreboard.scoreboardData?.accuracy_percentage || 0}%
                          </AppText>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <AppText
                            type={TEN}
                            color="#999">
                            Predictions: {scoreboard.scoreboardData?.predictions?.length || 0}
                          </AppText>
                          <AppText
                            type={TEN}
                            color="#999">
                            Rank: #{scoreboard.scoreboardData?.ranks || 'N/A'}
                          </AppText>
                        </View>
                      </View>
                    </TouchableOpacityView>
                  );
                }) :
                // Team expanded view (existing)
                myTeamsData?.map((item) => {
                  const match = item?.name.match(/\d+/);
                  const teamNumber = match ? match[0] : '';
                  const captain = item?.players?.find(item => item.caption);
                  const viceCaptain = item?.players?.find(item => item?.vice_caption);
                  return (
                    <TouchableOpacityView
                      key={item._id}
                      onPress={() => onCardClick(item)}
                      style={{
                        paddingVertical: 10,
                        backgroundColor: '#343434',
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
                          color={WHITE}>
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
                            tintColor={colors.white}
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
                            color={WHITE}>
                            Captain
                          </AppText>
                          <AppText
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
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
                            color={WHITE}>
                            Vice Captain
                          </AppText>
                          <AppText
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            {viceCaptain?.first_name && modifyName(viceCaptain?.first_name)}
                          </AppText>
                        </View>
                      </View>
                    </TouchableOpacityView>
                  )
                })
              }
            </> : <></>}
        </View>
      }
    </TouchableOpacityView>
  );
};
export default MyContestList;
