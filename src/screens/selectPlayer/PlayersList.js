import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  BROWNYELLOW,
  ELEVEN,
  FORTEEN,
  GRY,
  LIGHTBLUE,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  RED,
  SEMI_BOLD,
  TEN,
  WHITE,
} from '../../common/AppText';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import PlayerRoleBadge from '../../components/playerRoleBedge/PlayerRoleBedge';
import {
  BAT,
  BOWL,
  GLOVE,
  GREEN_PLUS_ICON,
  LEFT_ARROW,
  PANT,
  RED_MINUS,
  StopIcon,
  all_rounder,
  all_rounderIcon,
  backIconMain,
  batsmanIcon,
  bowlerIcon,
  dropDownRed,
  headerIner,
  rightArrow,
  wicket_keeper,
  wicket_keeperIcon,
} from '../../helper/image';
import {modifyName, modifyNameTwo, toastAlert} from '../../helper/utility';
import NavigationService from '../../navigation/NavigationService';
import {PLAYER_PREVIEW, SELECT_CAPTAIN} from '../../navigation/routes';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {getAllPlayerList, getPlayerDetail} from '../../slices/matchSlice';
import PlayerBedge from '../../components/playerBedge/PlayerBedge';
import {StatusBar} from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import SecondaryButton from '../../common/secondaryButton';
import PrimaryButton from '../../common/primaryButton';
import PlayerDetailModal from '../../common/PlayerDetailModal';
import moment from 'moment';
import {NewColor, colors} from '../../theme/color';
import {LiveTime} from '../../common/LiveTime';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {MatchLiveModal} from '../../common/MatchLiveModal';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Screen, universalPaddingHorizontal} from '../../theme/dimens';
import UnannouncedPlayer from '../UnannouncedPlayer';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

const RenderItem = ({item, selectedPlayers, addPlayerInTeam, onDetail,removePlayerFromTeam}) => {
  const playerIcon =
    item?.playing_role === 'wk'
      ? wicket_keeperIcon
      : item?.playing_role === 'bowl'
      ? bowlerIcon
      : item?.playing_role === 'bat'
      ? batsmanIcon
      : item?.playing_role === 'all'
      ? all_rounderIcon
      : null;
  return selectedPlayers?.includes(item?.pid) ? (
    <LinearGradient
      colors={['#343434', '#FF5252']}
      start={{x: 0, y: 0.1}}
      end={{x: 1, y: 0}}
      style={[styles.selectPlayerContainer]}>
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
        onPress={() => removePlayerFromTeam(item)}>
        <TouchableOpacityView
          onPress={() => onDetail(item?.pid, item)}
          style={{flex: 1, alignItems: 'flex-start'}}>
          <FastImage
            source={
              item?.profile_image ? {uri: item?.profile_image} : playerIcon
            }
            style={styles.playerImage}
            resizeMode="contain"
          />
        </TouchableOpacityView>
        <View style={{flex: 1.5, alignItems: 'flex-start', marginLeft: 15}}>
          <AppText color={WHITE} numberOfLines={1} style={styles.playerName}>
            {modifyNameTwo(item?.first_name)}
          </AppText>
          <AppText type={TEN} numberOfLines={1} weight={POPPINS_MEDIUM}>
            {item?.teamName}
          </AppText>
          {item?.playing11 == undefined ? (
            <>
              {item?.last_play ? (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      borderRadius: 100,
                      backgroundColor: colors.brownYellow,
                      marginTop: 5,
                    }}
                  />
                  <AppText
                    style={{
                      color: colors.brownYellow,
                      marginLeft: 5,
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                    weight={POPPINS_MEDIUM}>
                    Played last match
                  </AppText>
                </View>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {item?.playing11 == 'true' ? (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: 6,
                      width: 6,
                      borderRadius: 100,
                      backgroundColor: '#00B81C',
                      marginTop: 5,
                    }}
                  />
                  <AppText
                    style={{
                      color: '#00B81C',
                      marginLeft: 5,
                      fontWeight: 500,
                    }}
                    weight={SEMI_BOLD}>
                    Announced
                  </AppText>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: 6,
                      width: 6,
                      borderRadius: 100,
                      backgroundColor: '#FF0000',
                      marginTop: 5,
                    }}
                  />
                  <AppText
                    style={{
                      color: '#FF0000',
                      marginLeft: 5,
                      fontWeight: 500,
                    }}
                    weight={SEMI_BOLD}>
                    Unannounced
                  </AppText>
                </View>
              )}
            </>
          )}
        </View>
        <View style={{flex: 1, alignItems: 'center', marginEnd: 0}}>
          <AppText weight={POPPINS_MEDIUM} style={styles.points}>
            {item?.average_point ? item?.average_point?.toFixed(2) : 0}
          </AppText>
        </View>
        <View style={styles.creditBtnView}>
          <AppText style={{marginLeft: 15}} weight={POPPINS_MEDIUM}>
            {item?.fantasy_player_rating}
          </AppText>

          <FastImage
            resizeMode="contain"
            source={RED_MINUS}
            style={styles.plusIcon}
          />
        </View>
      </Pressable>
    </LinearGradient>
  ) : (
    <Pressable
      style={[
        styles.selectPlayerContainer,
        {
          backgroundColor: '#343434',
          borderBottomWidth: selectedPlayers?.length == 11 ? 0 : 0.2,
        },
      ]}
      onPress={() =>
        selectedPlayers?.length == 11 ? null : addPlayerInTeam(item)
      }>
      <TouchableOpacityView
        onPress={() => onDetail(item?.pid, item)}
        style={{flex: 1, alignItems: 'flex-start'}}>
        <FastImage
          source={item?.profile_image ? {uri: item?.profile_image} : playerIcon}
          style={styles.playerImage}
          resizeMode="contain"
        />
      </TouchableOpacityView>
      <View style={{flex: 1.5, alignItems: 'flex-start', marginLeft: 15}}>
        <AppText
          weight={POPPINS_MEDIUM}
          numberOfLines={1}
          style={styles.playerName}>
          {modifyNameTwo(item?.first_name)}
        </AppText>
        <AppText numberOfLines={1} weight={POPPINS_MEDIUM} type={TEN}>
          {item?.teamName}
          {/* <Text style={{color: '#21B5F6'}}>DC</Text> Sel By 91.84%**/}
        </AppText>
        {item?.playing11 == undefined ? (
          <>
            {item?.last_play ? (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 100,
                    backgroundColor: colors.brownYellow,
                    marginTop: 5,
                  }}
                />
                <AppText
                  style={{
                    color: colors.brownYellow,
                    marginLeft: 5,
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                  weight={POPPINS_MEDIUM}>
                  Played last match
                </AppText>
              </View>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {item?.playing11 == 'true' ? (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 6,
                    width: 6,
                    borderRadius: 100,
                    backgroundColor: '#00B81C',
                    marginTop: 5,
                  }}
                />
                <AppText
                  style={{
                    color: '#00B81C',
                    marginLeft: 5,
                    fontWeight: 500,
                  }}
                  weight={SEMI_BOLD}>
                  Announced
                </AppText>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 6,
                    width: 6,
                    borderRadius: 100,
                    backgroundColor: '#FF0000',
                    marginTop: 5,
                  }}
                />
                <AppText
                  style={{
                    color: '#FF0000',
                    marginLeft: 5,
                    fontWeight: 500,
                  }}
                  weight={SEMI_BOLD}>
                  Unannounced
                </AppText>
              </View>
            )}
          </>
        )}
      </View>
      <View style={{flex: 1, alignItems: 'center', marginEnd: 0}}>
        <AppText style={[styles.points, {marginLeft: -5}]}>
          {item?.average_point ? item?.average_point?.toFixed(2) : 0}
        </AppText>
      </View>
      <View style={styles.creditBtnView}>
        <AppText style={{marginLeft: 15}} weight={POPPINS_MEDIUM}>
          {item?.fantasy_player_rating}
        </AppText>

        <FastImage
          resizeMode="contain"
          source={GREEN_PLUS_ICON}
          style={styles.plusIcon}
        />
      </View>
    </Pressable>
  );
};

const PlayersList = ({
  route,
  index,
  activeTab,
  saveTitle,
  selectedPlayers,
  addPlayerInTeam,
  onDetail,
  removePlayerFromTeam

}) => {

  const allPlayers = useSelector(state => state?.match?.allPlayers);
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    setPlayers(getPlayersData());
  }, []);
  const getPlayersData = () => {
    if (route?.params?.isEditMode || route?.params?.isCloneMode) {
      const customSort = (a, b) => {
        if (a.playing11 === b.playing11) {
          return 0;
        }
        if (a.playing11 == 'true') {
          return -1;
        }
        return 1;
      };
      const customSortRating = (a, b) => {
        if (a.fantasy_player_rating === b.fantasy_player_rating) {
          return 0;
        }
        if (a.fantasy_player_rating < b.fantasy_player_rating) {
          return 1;
        }
        return -1;
      };
      if (index === 1 || activeTab === 'BAT') {
        const updatedDatanew = allPlayers?.map(player => {
          const pid = player.pid;
          const matchingData = route?.params?.selectedPlayers?.find(
            item => item.pid === pid,
          );

          if (matchingData) {
            return {...player, substitute: matchingData.substitute};
          }

          return player;
        });
        return updatedDatanew
          .filter(player => player.playing_role == 'bat')
          .sort(customSortRating)
          .sort(customSort);
      } else if (index === 3 || activeTab === 'BOWL') {
        const updatedDatanew = allPlayers?.map(player => {
          const pid = player.pid;
          const matchingData = route?.params?.selectedPlayers?.find(
            item => item.pid === pid,
          );

          if (matchingData) {
            return {...player, substitute: matchingData.substitute};
          }

          return player;
        });
        return updatedDatanew
          .filter(player => player.playing_role == 'bowl')
          .sort(customSortRating)
          .sort(customSort);
      } else if (index === 0 || activeTab === 'WK') {
        const updatedDatanew = allPlayers?.map(player => {
          const pid = player.pid;
          const matchingData = route?.params?.selectedPlayers?.find(
            item => item.pid === pid,
          );

          if (matchingData) {
            return {...player, substitute: matchingData.substitute};
          }

          return player;
        });
        return updatedDatanew
          .filter(player => player.playing_role == 'wk')
          .sort(customSortRating)
          .sort(customSort);
      } else if (index === 2 || activeTab === 'AR') {
        const updatedDatanew = allPlayers?.map(player => {
          const pid = player.pid;
          const matchingData = route?.params?.selectedPlayers?.find(
            item => item.pid === pid,
          );

          if (matchingData) {
            return {...player, substitute: matchingData.substitute};
          }

          return player;
        });
        return updatedDatanew
          .filter(player => player.playing_role == 'all')
          .sort(customSortRating)
          .sort(customSort);
      }
    } else {
      const customSort = (a, b) => {
        if (a.playing11 === b.playing11) {
          return 0;
        }
        if (a.playing11 == 'true') {
          return -1;
        }
        return 1;
      };
      const customSortRating = (a, b) => {
        if (a.fantasy_player_rating === b.fantasy_player_rating) {
          return 0;
        }
        if (a.fantasy_player_rating < b.fantasy_player_rating) {
          return 1; // Sort in descending order (highest rating first)
        }
        return -1;
      };
      if (index === 1 || activeTab === 'BAT') {
        if (
          allPlayers.some(
            player =>
              player.playing_role === 'bat' && player.playing11 !== undefined,
          )
        ) {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'bat')
              .sort(customSortRating)
              .sort(customSort);
          }
        } else {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bat')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'bat')
              .sort(customSortRating)
              .sort(customSort);
          }
        }
      } else if (index === 3 || activeTab === 'BOWL') {
        if (
          allPlayers.some(
            player =>
              player.playing_role === 'bowl' && player.playing11 !== undefined,
          )
        ) {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'bowl')
              .sort(customSortRating)
              .sort(customSort);
            8;
          }
        } else {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'bowl')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'bowl')
              .sort(customSortRating)
              .sort(customSort);
          }
        }
      } else if (index == 0 || activeTab == 'wk') {
        if (
          allPlayers.some(
            player =>
              player.playing_role === 'wk' && player.playing11 !== undefined,
          )
        ) {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'wk')
              .sort(customSortRating)
              .sort(customSort);
          }
        } else {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'wk')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'wk')
              .sort(customSortRating)
              .sort(customSort);
          }
        }
      } else if (index == 2 || activeTab === 'AR') {
        if (
          allPlayers.some(
            player =>
              player.playing_role === 'all' && player.playing11 !== undefined,
          )
        ) {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'all')
              .sort(customSortRating)
              .sort(customSort);
          }
        } else {
          if (saveTitle == 'PLAYERS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => b.first_name.localeCompare(a.first_name));
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => a.first_name.localeCompare(b.first_name));
            }
          } else if (saveTitle == 'CREDITS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort(
                  (a, b) => b.fantasy_player_rating - a.fantasy_player_rating,
                );
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort(
                  (a, b) => a.fantasy_player_rating - b.fantasy_player_rating,
                );
            }
          } else if (saveTitle == 'AVG POINTS') {
            if (newAllPlayer == 'high') {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => b.average_point - a.average_point);
            } else {
              return allPlayers
                .filter(player => player.playing_role === 'all')
                .sort((a, b) => a.average_point - b.average_point);
            }
          } else {
            return allPlayers
              .filter(player => player.playing_role === 'all')
              .sort(customSortRating)
              .sort(customSort);
          }
        }
      }
    }
  };

  return (
    <View
      style={{width: Screen.Width - 25, marginTop: 10, alignSelf: 'center'}}>
      <FlatList
        data={getPlayersData()}
        renderItem={({item}) => (
          <RenderItem
            item={item}
            index
            selectedPlayers={selectedPlayers}
            addPlayerInTeam={addPlayerInTeam}
            removePlayerFromTeam={removePlayerFromTeam}
            onDetail={onDetail}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export {PlayersList};
