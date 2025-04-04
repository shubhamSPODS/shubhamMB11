import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import FastImage from "@d11/react-native-fast-image";

import {
  AppText,
  BLACK,
  BLACKOPACITY,
  EIGHT,
  EIGHTEEN,
  FIFTEEN,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TEN,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import {DUMMY_USER, PANT, UserIcon, persons} from '../../helper/image';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {colors} from '../../theme/color';
import {BASE_URL, IMAGE_BASE_URL, toastAlert} from '../../helper/utility';
import {getAllPlayerList, getOtherUserProfile} from '../../slices/matchSlice';
import {PLAYER_PREVIEW, PLAYER_PREVIEW_TWO} from '../../navigation/routes';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import NavigationService from '../../navigation/NavigationService';
import {Screen, flexOne} from '../../theme/dimens';
import { ActivityIndicator } from 'react-native-paper';

const LeaderBoardList = ({
  matchId,
  id,
  forStatus,
  setForStatus,
  selfCreateContest,
}) => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const userData = useSelector(state => {
    return state.profile.userData;
  });
  const contestData = useSelector(state => state?.match?.contestData);
  const [leaderBoards, setLeaderBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myDataleader, setMyDataleader] = useState([]);
  const [ForConnectedTo, setForConnectedTo] = useState(false);
  const [status, setStatus] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [withOutMatchStart, setWithOutMatchStart] = useState([]);
  const [limit, setLimit] = useState(50);
  const [skip, setSkip] = useState(0);
  let url = `ws://app.mybattle11.com/leader-board?limit=${limit}&skip=${skip}&matchid=${matchId}&contest_category_id=${id}&user_id=${userData?._id}`;
  let urlTwo = `ws://app.mybattle11.com/mainleaderboard?limit=10&skip=0&contest_category_id=${id}&matchid=${matchId}&user_id=${userData?._id}`;
  useEffect(() => {
    if (matchId && id) {
      wsRef.current = new WebSocket(url);
      wsRef.current.onopen = () => {};
      wsRef.current.onclose = e => {
        setLoading(false);
        wsRef.current = new WebSocket(selfCreateContest ? urlTwo : url);
      };
      wsRef.current.onerror = e => {
        setLoading(false);
        wsRef.current = new WebSocket(selfCreateContest ? urlTwo : url);
      };
      return () => {
        wsRef.current.close();
      };
    }
  }, [matchId, id]);
  
const handleListStakingHistory = type => {
  setLimit(prevLimit => prevLimit + 50);
  setSkip(prevSkip => prevSkip + 1); 

};
const handleListStakingHistoryTop = type => {
  setLimit(prevLimit => prevLimit - 50);
  setSkip(prevSkip => prevSkip - 1); 

};
useEffect(() => {
}, [skip, limit]); 

const getData = React.useCallback(() => {
  if (isConnected && wsRef.current) {
    wsRef.current.close();
    setIsConnected(false);
  }
  try {
    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => {
      setIsConnected(true); 
    };
    3;
    if (!wsRef.current) return;

    wsRef.current.onmessage = e => {
      const parseData = JSON.parse(e?.data);

      const liveStatus = JSON.parse(e?.data);
      setForStatus(liveStatus?.live);
      setStatus(liveStatus?.live);
      setLeaderBoards(parseData?.data||[]);
      setLoading(false);
    };
  } catch (error) {
  } finally {
  }
}, [isConnected]);
  useEffect(() => {
    if (!ForConnectedTo) {
      getData();
      setForConnectedTo(true);
    } else {
      const interval = setInterval(() => {
        getData();
      }, 1000);
      return () => clearInterval(interval);
    }
  });
  useEffect(() => {
    let Mydata = leaderBoards?.map(item => {
      return item?.email === userData?.email &&
        item?.full_name === userData?.full_name &&
        item?.mobile_number === userData?.mobile_number
        ? item
        : {};
    });
    
    const filteredData = Mydata.filter(item => Object.keys(item).length !== 0);
    setMyDataleader(filteredData);
  }, [leaderBoards]);
  const filteredArray = leaderBoards.filter(item => !Array.isArray(item));

  useEffect(() => {
    const filteredData = filteredArray.filter(item => {
      return !(
        item.email === userData.email &&
        item.full_name === userData.full_name &&
        item.mobile_number === userData.mobile_number
      );
    });
    setWithOutMatchStart(filteredData);
  }, [leaderBoards]);
  const playerPreview = (teamPlayer, full_name, teamname, total_points) => {
    if (status == 'true') {
      if (teamPlayer?.user_id == userData?._id) {
        let selectedPlayers = teamPlayer?.players?.map(k => {
          return k?.pid;
        });
        const teamsName = [
          ...new Set(
            teamPlayer?.players?.map(data => data?.primary_team?.title),
          ),
        ];
        let newData = [];
        teamPlayer?.players?.forEach(player => {
          let data = {...player};
          data['title'] = player?.primary_team?.title;
          newData.push(data);
        });
        const firstTitleName = teamsName[0];
        const secondTitleName = teamsName[1];
        const firstTeamCount = teamPlayer.players?.filter(
          item =>
            item?.primary_team?.title === firstTitleName && !item?.substitute,
        )?.length;
        const secondTeamCount = teamPlayer.players?.filter(
          item =>
            item?.primary_team?.title === secondTitleName && !item?.substitute,
        )?.length;
        const captain = teamPlayer?.players?.find(item => item.caption);
        const viceCaptain = teamPlayer?.players?.find(
          item => item?.vice_caption,
        );
        let data = {};
        dispatch(getAllPlayerList(contestData?._id, data, false, {}));
        NavigationService.navigate(PLAYER_PREVIEW_TWO, {
          oldData: contestData,
          selectedPlayers: selectedPlayers,
          selectedPlayerDetails: newData,
          player: secondTeamCount,
          playerTwo: firstTeamCount,
          team_name: teamPlayer?.name,
          captainId: captain?.pid,
          vice_caption: viceCaptain?.pid,
          team_id: teamPlayer?._id,
          total_points: total_points,
          teamName: teamname,
          full_name: full_name,
          replacedPlayers: teamPlayer?.replacedPlayers,
          notReplacedSubstitutes: teamPlayer?.notReplacedSubstitutes,
        });
      } else {
        toastAlert.showToastError(
          'Please wait till the match starts to view other teams',
        );
      }
    } else {
      let selectedPlayers = teamPlayer?.players?.map(k => {
        return k?.pid;
      });
      const teamsName = [
        ...new Set(teamPlayer?.players?.map(data => data?.primary_team?.title)),
      ];
      let newData = [];
      teamPlayer?.players?.forEach(player => {
        let data = {...player};
        data['title'] = player?.primary_team?.title;
        newData.push(data);
      });
      const firstTitleName = teamsName[0];
      const secondTitleName = teamsName[1];
      const firstTeamCount = teamPlayer.players?.filter(
        item =>
          item?.primary_team?.title === firstTitleName && !item?.substitute,
      )?.length;
      const secondTeamCount = teamPlayer.players?.filter(
        item =>
          item?.primary_team?.title === secondTitleName && !item?.substitute,
      )?.length;
      const captain = teamPlayer?.players?.find(item => item.caption);
      const viceCaptain = teamPlayer?.players?.find(item => item?.vice_caption);
      let data = {};
      dispatch(getAllPlayerList(teamPlayer?._id, data, false, {}));
      NavigationService.navigate(PLAYER_PREVIEW_TWO, {
        oldData: contestData,
        selectedPlayers: selectedPlayers,
        selectedPlayerDetails: newData,
        player: secondTeamCount,
        playerTwo: firstTeamCount,
        team_name: teamPlayer?.name,
        captainId: captain?.pid,
        vice_caption: viceCaptain?.pid,
        team_id: teamPlayer?._id,
        total_points: total_points,
        teamName: teamname,
        full_name: full_name,
        replacedPlayers: teamPlayer?.replacedPlayers,
        notReplacedSubstitutes: teamPlayer?.notReplacedSubstitutes,
        teamPlayer: teamPlayer,
      });
    }
  };
  const onProfile = id => {
    // const data = {
    //   user_id: id,
    // };`
    // dispatch(getOtherUserProfile(id));
  };
  const renderLeaderBoard = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          playerPreview(
            item?.team_details,
            `${
              item?.full_name || item?.username
                ? `${
                    item?.full_name
                      ? item?.full_name
                      : item?.username
                      ? item?.username
                      : null
                  }`
                : item?.created_by?.full_name
                ? item?.created_by?.full_name
                : item?.created_by?.username
                ? item?.created_by?.username
                : null
            }`,
            `${item?.team_details?.name ? item?.team_details?.name : ''}`,
            item?.team_details?.total_points,
          );
        }}
        style={[
          styles.leaderBoardContainer,
          {
            backgroundColor: filteredArray?.length == 1 ? '#343434' : null,
            borderBottomWidth: 1,
            borderBottomColor: colors.lightgry,
          },
        ]}>
        <View style={styles.underView}>
          <TouchableOpacity
            onPress={() => onProfile(item?.team_details?.user_id)}>
            <FastImage
              style={styles.userImg}
              resizeMode="contain"
              source={
                item?.logo
                  ? {
                      uri: `${IMAGE_BASE_URL + item?.logo}`,
                    }
                  : item?.created_by?.logo
                  ? {
                      uri: `${IMAGE_BASE_URL + item?.created_by?.logo}`,
                    }
                  : UserIcon
              }
            />
          </TouchableOpacity>
          <View style={{flex: 1.4, marginLeft: 6}}>
            <AppText>
              {/* {' '}
              {`${
                item?.full_name || item?.username
                  ? `${
                      item?.full_name
                        ? item?.full_name
                        : item?.username
                        ? item?.username
                        : null
                    }`
                  : item?.created_by?.full_name
                  ? item?.created_by?.full_name
                  : item?.created_by?.username
                  ? item?.created_by?.username
                  : null
              } (${item?.team_details?.name ? item?.team_details?.name : ''})`} */}
              {item?.username || item?.full_name}{' '}
              {`(${item?.team_details?.name ? item?.team_details?.name : ''})`}
            </AppText>
            {contestData?.Status == 'Completed' ? (
              <>
                {item?.winningZone || item?.winnings ? (
                  <AppText
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={{color: '#00B81C'}}>
                    {item?.winnings
                      ? `Won ₹ ${item?.winnings}`
                      : item?.winningZone}
                  </AppText>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {item?.winningZone !== undefined ? (
                  <AppText
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={{color: '#00B81C'}}>
                    In Winning Zone
                  </AppText>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            {item?.team_details?.total_points ? (
            <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
              {item?.team_details?.total_points}
            </AppText>
          ) : (
            <></>
          )}
         {item?.rank ? (
            <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
              # {item?.rank}
            </AppText>
          ) : (
            <></>
          )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const mydataleaderboard = () => {
    return (
      myDataleader &&
      myDataleader?.map(item => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.leaderBoardContainer,
              {
                backgroundColor: '#343434',
                borderBottomWidth: 1,
                borderBottomColor: colors.lightgry,
              },
            ]}
            onPress={() => {
              playerPreview(
                item?.team_details,
                `${
                  item?.full_name || item?.username
                    ? `${
                        item?.full_name
                          ? item?.full_name
                          : item?.username
                          ? item?.username
                          : null
                      }`
                    : item?.created_by?.full_name
                    ? item?.created_by?.full_name
                    : item?.created_by?.username
                    ? item?.created_by?.username
                    : null
                }`,
                `${item?.team_details?.name ? item?.team_details?.name : ''}`,
                item?.team_details?.total_points,
              );
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                playerPreview(
                  item?.team_details,
                  `${
                    item?.full_name || item?.username
                      ? `${
                          item?.full_name
                            ? item?.full_name
                            : item?.username
                            ? item?.username
                            : null
                        }`
                      : item?.created_by?.full_name
                      ? item?.created_by?.full_name
                      : item?.created_by?.username
                      ? item?.created_by?.username
                      : null
                  }`,
                  `${item?.team_details?.name ? item?.team_details?.name : ''}`,
                  item?.team_details?.total_points,
                );
              }}
              style={styles.underView}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onProfile(item?.team_details?.user_id)}>
                <FastImage
                  style={styles.userImg}
                  resizeMode="contain"
                  source={
                    item?.logo
                      ? {
                          uri: `${IMAGE_BASE_URL + item?.logo}`,
                        }
                      : item?.created_by?.logo
                      ? {
                          uri: `${IMAGE_BASE_URL + item?.created_by?.logo}`,
                        }
                      : UserIcon
                  }
                  // source={PANT}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  playerPreview(
                    item?.team_details,
                    `${
                      item?.full_name || item?.username
                        ? `${
                            item?.full_name
                              ? item?.full_name
                              : item?.username
                              ? item?.username
                              : null
                          }`
                        : item?.created_by?.full_name
                        ? item?.created_by?.full_name
                        : item?.created_by?.username
                        ? item?.created_by?.username
                        : null
                    }`,
                    `${
                      item?.team_details?.name ? item?.team_details?.name : ''
                    }`,
                    item?.team_details?.total_points,
                  );
                }}
                style={{flex: 1.4, marginLeft: 6}}>
                <AppText>
                  {/* {' '}
                  {`${
                    item?.full_name || item?.username
                      ? `${
                          item?.full_name
                            ? item?.full_name
                            : item?.username
                            ? item?.username
                            : null
                        }`
                      : item?.created_by?.full_name
                      ? item?.created_by?.full_name
                      : item?.created_by?.username
                      ? item?.created_by?.username
                      : null
                  } (${
                    item?.team_details?.name ? item?.team_details?.name : ''
                  })`} */}
                  {item?.username || item?.full_name}
                  {` (${
                    item?.team_details?.name ? item?.team_details?.name : ''
                  })`}
                </AppText>
                {contestData?.Status == 'Completed' ? (
                  <>
                    {item?.winningZone || item?.winnings ? (
                      <AppText
                        type={TEN}
                        weight={POPPINS_MEDIUM}
                        style={{color: '#00B81C'}}>
                        {item?.winnings
                          ? `You Won ₹ ${item?.winnings}`
                          : item?.winningZone}
                      </AppText>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    {item?.winningZone !== undefined ? (
                      <AppText
                        type={TEN}
                        weight={POPPINS_MEDIUM}
                        style={{color: '#00B81C'}}>
                        In Winning Zone
                      </AppText>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  playerPreview(
                    item?.team_details,
                    `${
                      item?.full_name || item?.username
                        ? `${
                            item?.full_name
                              ? item?.full_name
                              : item?.username
                              ? item?.username
                              : null
                          }`
                        : item?.created_by?.full_name
                        ? item?.created_by?.full_name
                        : item?.created_by?.username
                        ? item?.created_by?.username
                        : null
                    }`,
                    `${
                      item?.team_details?.name ? item?.team_details?.name : ''
                    }`,
                    item?.team_details?.total_points,
                  );
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                {item?.team_details?.total_points ? (
                  <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
                    {item?.team_details?.total_points}
                  </AppText>
                ) : (
                  <></>
                )}
                {item?.rank ? (
                  <AppText weight={SEMI_BOLD} type={TWELVE} color={WHITE}>
                    # {item?.rank}
                  </AppText>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })
    );
  };
  return (
    <>
      <View style={styles.head}>
        <AppText
          weight={SEMI_BOLD}
          type={TEN}
          style={{
            color: 'white',
            flex: 2,
          }}>
          {`Team Name`}
          {/* {`ALL TEAMS (${leaderBoards?.length})`} */}
        </AppText>
        {filteredArray[0]?.team_details?.total_points ||
        filteredArray[0]?.team_details?.total_points ? (
          <>
            <AppText style={{flex: 1}} color={WHITE} type={TEN}>
              Points
            </AppText>
            <AppText color={WHITE} type={TEN}>
              Rank
            </AppText>
          </>
        ) : (
          <></>
        )}
      </View>
      {loading ? (
        <SpinnerSecond loading />
      ) : (
        <>
          {filteredArray?.length ? (
            <FlatList
              data={withOutMatchStart || filteredArray}
              renderItem={renderLeaderBoard}
              keyExtractor={(item, index) => index?.toString()}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews
              maxToRenderPerBatch={20}
              initialNumToRender={15}
              onStartReached={handleListStakingHistoryTop}
              onEndReached={handleListStakingHistory}
              scrollEnabled={true}
              ListHeaderComponent={
                mydataleaderboard
              }
            />
          ) : (
            <AppText
              style={{
                textAlign: 'center',
                marginTop: '20%',
              }}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}>
              No other team has joined this contest
            </AppText>
          )}
        </>
      )}

      {/* <View
        style={{
          width: Screen.Width,
          paddingVertical: 10,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          backgroundColor: colors.black,
        }}>
        <TouchableOpacity
          disabled={limit === 10}
          onPress={() => {
            handleListStakingHistory('Previous');
          }}
          style={{
            width: '45%',
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: skip === 0 ? colors.borderGry : colors.borderBackColor,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <AppText style={{color: colors.white}} type={THIRTEEN}>
            Previous
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleListStakingHistory('Next');
          }}
          style={{
            width: '45%',
            borderWidth: 1,
            borderColor: colors.borderBackColor,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText type={THIRTEEN}>Next</AppText>
        </TouchableOpacity>
      </View> */}
    </>
  );
};

export default LeaderBoardList;
