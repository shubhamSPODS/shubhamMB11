import { useRoute } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, ImageBackground, ScrollView, StatusBar, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  EIGHTEEN,
  FORTEEN,
  GREEN,
  GRY,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  TEN,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import {
  all_rounderIcon,
  backIconMain,
  batsmanIcon,
  blurBackground,
  bowlerIcon,
  CAPTAIN,
  downArrow,
  green_ground,
  headerIner,
  LEFT_ARROW,
  LINEAR_GRADIENT,
  PANT,
  player_placeholder,
  smallBackgrounBlur,
  subsituteAdd,
  substituteIcon,
  VICE_CAPTAIN,
  wicket_keeperIcon,
} from '../../helper/image';
import { modifyName, toastAlert } from '../../helper/utility';
import NavigationService from '../../navigation/NavigationService';
import { SELECT_CAPTAIN, SELECT_PLAYER } from '../../navigation/routes';
import styles from './styles';
import moment from 'moment';
import { colors } from '../../theme/color';
import { useDispatch, useSelector } from 'react-redux';
import { getTab } from '../../slices/matchSlice';
import { LiveTime } from '../../common/LiveTime';
import RBSheet from 'react-native-raw-bottom-sheet';
import PlayerSubsitute from '../../common/PlayerSubsitute';
import ReplacedPlayer from '../../common/ReplacedPlayer';
const PlayerPreview = () => {
  const refRBSheet = useRef();
  const refRBSheetReplaced = useRef();
  const contestData = useSelector(state => state?.match?.contestData);
  const currentDate = new Date();
  const inputDate = new Date(contestData?.StartDateTime);
  const [sheetHeight, setSheetHeight] = useState(300);
  const [removeTabs, setRemoveTabs] = useState(false)

  const isPastTime = inputDate < currentDate;
  const convertToTeamsTitle2 = arr => {
    const TeamsTitle2 = arr && arr?.map(title => title.trim());
    return TeamsTitle2;
  };
  const removedSpacesTeamsTitle = convertToTeamsTitle2(
    contestData?.TeamsShortNames,
  );
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const dispatch = useDispatch();
  const route = useRoute();
  const { replacedPlayers, notReplacedSubstitutes, selectsubstitute } = route?.params ?? "";

  const { TeamsShortNames } = route?.params?.oldData ?? '';
  let players_List = route?.params?.selectedPlayerDetails ?? [];
  const newReplacedPlayers = replacedPlayers?.map((items) => {
    const updatedItem = players_List?.find((value) => value?.pid === items?.substitute?.pid);

    return {
      replaced: { ...items?.replaced },
      replacedFrom: items?.replacedFrom,
      substitute: updatedItem
        ? { ...items?.substitute, points: updatedItem?.points }
        : { ...items?.substitute }
    };
  });
  const newSelectplayer = players_List?.filter(item =>
    isPastTime ? item : item?.substitute ? item?.substitute === false : item,
  );
  let substitutePlayer = selectsubstitute?.length ? selectsubstitute : players_List?.filter(item => {
    return item?.substitute === true;
  });
  let wicket_keepers_list = players_List?.filter(item => {
    return isPastTime ? item?.playing_role === 'wk' : item?.substitute
      ? item?.playing_role === 'wk' && item?.substitute === false
      : item?.playing_role === 'wk';
  });
  let bowlers_list = players_List?.filter(item => {
    return isPastTime ? item?.playing_role === 'bowl' : item?.substitute
      ? item?.playing_role === 'bowl' && item?.substitute === false
      : item?.playing_role === 'bowl';
  });
  let batsman_list = players_List?.filter(item => {
    return isPastTime ? item?.playing_role === 'bat' : item?.substitute
      ? item?.playing_role === 'bat' && item?.substitute === false
      : item?.playing_role === 'bat';
  });
  let all_rounder_list = players_List?.filter(item => {
    return isPastTime ? item?.playing_role === 'all' : item?.substitute
      ? item?.playing_role === 'all' && item?.substitute === false
      : item?.playing_role === 'all';
  });
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setSheetHeight(contentHeight);
  };

  return (
    <AppSafeAreaView statusColor={'black'}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View
        style={[styles.card, { height: 150, paddingTop: 0 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '10%'
          }}>
          <TouchableOpacityView
            style={{ padding: 5, marginRight: 5 }}
            onPress={() => NavigationService.goBack()}>
            <FastImage
              source={backIconMain}
              resizeMode="contain"
              style={styles.leftArrow}
            />
          </TouchableOpacityView>
          <AppText
            weight={POPPINS_MEDIUM}
            type={FORTEEN}>
            Create Team
          </AppText>
        </View>
        <ImageBackground source={headerIner} resizeMode='contain' style={styles.header}>
          <View style={styles.teamView}>
            <FastImage
              source={{ uri: route?.params?.oldData?.TeamAlogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <View
              style={{
                marginLeft: 5,
              }}>
              <AppText weight={POPPINS_MEDIUM} color={BLACK} >
                {route?.params?.oldData?.TeamsShortNames &&
                  route?.params?.oldData?.TeamsShortNames.length > 0 &&
                  route?.params?.oldData?.TeamsShortNames[0]}
              </AppText>
              <AppText
                weight={POPPINS_MEDIUM}
                color={BLACK}
                type={TWELVE}>
                {route?.params?.player?.length}
              </AppText>
            </View>
          </View>
          <LiveTime
            view={true}
            color={timeDifference >= 1 ? BLACK : BLACK}
            top={true}
            details={contestData}
          setRemoveTabs={setRemoveTabs}
          />
          <View style={styles.teamView}>
            <View
              style={{
                marginRight: 5,
              }}>
              <AppText color={BLACK} weight={POPPINS_MEDIUM}>
                {' '}
                {route?.params?.oldData?.TeamsShortNames &&
                  route?.params?.oldData?.TeamsShortNames.length > 0 &&
                  route?.params?.oldData?.TeamsShortNames[1]}
              </AppText>
              <AppText
                color={BLACK}
                weight={POPPINS_MEDIUM}
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 2,
                }}
                type={TWELVE}>
                {route?.params?.playerTwo?.length}
              </AppText>
            </View>
            <FastImage
              source={{ uri: route?.params?.oldData?.TeamBlogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      </View>
      <ImageBackground resizeMode={"stretch"}
        style={{
          flexGrow: 1,
        }}
        source={green_ground}>
        <ScrollView
          scrollEnabled={true}
          style={{ flex: 1, }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1, // Add this to make sure the content fills the ScrollView
          }}>
          <AppText
            type={TWELVE}
            style={[
              styles.title,
              { marginTop: route?.params?.myTeam ? '-5%' : -30 },
            ]}
            weight={POPPINS_SEMI_BOLD}
            color={WHITE}>
            WICKET KEEPER ({wicket_keepers_list?.length})
          </AppText>
          <View style={styles.playerContainer}>
            {wicket_keepers_list.length > 0 ? (
              wicket_keepers_list?.map((item, index) => {
                let space =
                  index % 2 == 0
                    ? { backgroundColor: '#21B5F6' }
                    : { backgroundColor: '#6A37FF' };
                const playercolor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#000000'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#FFFFFF'
                      : null;
                const TextColor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#FFFFFF'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#000000'
                      : null;
                return (
                  <View
                    style={[
                      styles.singlePlayerContainer,
                      {
                        marginLeft: index == 0 ? 0 : 20,
                      },
                    ]}
                    key={item?._id}>
                    <FastImage
                      style={{
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        left: index == 0 ? -8 : 2,
                      }}
                      resizeMode="contain"
                      source={
                        item?.vice_caption == true
                          ? VICE_CAPTAIN
                          : item?.caption == true
                            ? CAPTAIN
                            : null
                      }
                    />
                    {item?.replaced == true ?
                      <FastImage source={subsituteAdd} resizeMode="contain" style={styles.upIcon} />
                      : <></>}
                    <FastImage
                      source={item?.profile_image ? { uri: item?.profile_image } : wicket_keeperIcon}
                      style={styles.playerImage}
                      resizeMode="contain"
                    />
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        backgroundColor: `${playercolor}`,
                        borderRadius: 4,
                        marginTop: -7
                      }}>
                      <AppText
                        style={[styles.playerName, { color: TextColor }]}
                        type={TEN}>
                        {modifyName(item?.first_name)}
                      </AppText>
                      {item?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {item?.playing11 == 'false' ? (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#FF0000',
                                marginTop: -1
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#0BFF15',
                                marginTop: -1
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                    <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                      {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                    </AppText>
                  </View>
                );
              })
            ) : (
              <TouchableOpacityView
                onPress={() => {
                  dispatch(getTab('WICKET KEEPERS'));
                  NavigationService.goBack();
                }}>
                <FastImage
                  source={player_placeholder}
                  style={styles.playerImage}
                  resizeMode="contain"
                />
              </TouchableOpacityView>
            )}
          </View>
          <AppText
            type={TWELVE}
            style={styles.title2}
            weight={POPPINS_SEMI_BOLD}
            color={WHITE}>
            BATSMAN ({batsman_list?.length})
          </AppText>
          <View style={styles.playerContainer}>
            {batsman_list.length > 0 ? (
              batsman_list?.map((item, index) => {
                let space =
                  index % 2 == 0
                    ? { backgroundColor: '#21B5F6' }
                    : { backgroundColor: '#6A37FF' };
                const playercolor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#000000'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#FFFFFF'
                      : null;
                const TextColor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#FFFFFF'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#000000'
                      : null;
                return (
                  <View
                    style={[
                      styles.singlePlayerContainer,
                      {
                        marginLeft: index == 0 ? 0 : 20,
                      },
                    ]}
                    key={item?._id}>
                    <FastImage
                      style={{
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        left: index == 0 ? -3 : -12,
                      }}
                      resizeMode="contain"
                      source={
                        item?.vice_caption == true
                          ? VICE_CAPTAIN
                          : item?.caption == true
                            ? CAPTAIN
                            : null
                      }
                    />
                    {item?.replaced == true ?
                      <FastImage source={subsituteAdd} resizeMode="contain" style={styles.upIcon} />
                      : <></>}
                    <FastImage
                      source={item?.profile_image ? { uri: item?.profile_image } : batsmanIcon}
                      style={styles.playerImage}
                      resizeMode="contain"
                    />
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        backgroundColor: `${playercolor}`,
                        borderRadius: 4,
                        marginTop: -7
                      }}>
                      <AppText
                        style={[styles.playerName, { color: TextColor }]}
                        type={TEN}>
                        {modifyName(item?.first_name)}
                      </AppText>
                      {item?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {item?.playing11 == 'false' ? (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#FF0000',
                                marginTop: -1
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#00B81C',
                                marginTop: -1
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                    <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                      {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                    </AppText>
                  </View>
                );
              })
            ) : (
              <TouchableOpacityView
                onPress={() => {
                  dispatch(getTab('BATSMEN'));
                  NavigationService.goBack();
                }}>
                <FastImage
                  source={player_placeholder}
                  style={styles.playerImage}
                  resizeMode="contain"
                />
              </TouchableOpacityView>
            )}
          </View>
          <AppText
            type={TWELVE}
            style={styles.title2}
            weight={POPPINS_SEMI_BOLD}
            color={WHITE}>
            ALL ROUNDERS ({all_rounder_list?.length})
          </AppText>
          <View style={[styles.playerContainer, { marginTop: 5 }]}>
            {all_rounder_list.length > 0 ? (
              all_rounder_list?.map((item, index) => {
                let space =
                  index % 2 == 0
                    ? { backgroundColor: '#21B5F6' }
                    : { backgroundColor: '#6A37FF' };
                const playercolor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#000000'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#FFFFFF'
                      : null;
                const TextColor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#FFFFFF'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#000000'
                      : null;
                return (
                  <View
                    style={[
                      styles.singlePlayerContainer,
                      {
                        marginLeft: index == 0 ? 0 : 20,
                      },
                    ]}
                    key={item?._id}>
                    <FastImage
                      style={{
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        left: 0,
                      }}
                      resizeMode="contain"
                      source={
                        item?.vice_caption == true
                          ? VICE_CAPTAIN
                          : item?.caption == true
                            ? CAPTAIN
                            : null
                      }
                    />
                    {item?.replaced == true ?
                      <FastImage source={subsituteAdd} resizeMode="contain" style={styles.upIcon} />
                      : <></>}
                    <FastImage
                      source={item?.profile_image ? { uri: item?.profile_image } : all_rounderIcon}
                      style={styles.playerImage}
                      resizeMode="contain"
                    />
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        backgroundColor: `${playercolor}`,
                        borderRadius: 4,
                        marginTop: -7
                      }}>
                      <AppText
                        style={[styles.playerName, { color: TextColor }]}
                        type={TEN}>
                        {modifyName(item?.first_name)}
                      </AppText>
                      {item?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {item?.playing11 == 'false' ? (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#FF0000',
                                marginTop: -1
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#0BFF15',
                                marginTop: -1
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                    <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                      {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                    </AppText>
                  </View>
                );
              })
            ) : (
              <TouchableOpacityView
                onPress={() => {
                  dispatch(getTab('ALL ROUNDERS'));
                  NavigationService.goBack();
                }}>
                <FastImage
                  source={player_placeholder}
                  style={styles.playerImage}
                  resizeMode="contain"
                />
              </TouchableOpacityView>
            )}
          </View>
          <AppText
            type={TWELVE}
            style={styles.title2}
            weight={POPPINS_SEMI_BOLD}
            color={WHITE}>
            BOWLERS ({bowlers_list?.length})
          </AppText>
          <View style={[styles.playerContainer, { marginTop: 5 }]}>
            {bowlers_list.length > 0 ? (
              bowlers_list?.map((item, index) => {
                let space =
                  index % 2 == 0
                    ? { backgroundColor: '#21B5F6' }
                    : { backgroundColor: '#6A37FF' };
                const playercolor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#000000'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#FFFFFF'
                      : null;
                const TextColor =
                  `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                    ? '#FFFFFF'
                    : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                      ? '#000000'
                      : null;
                return (
                  <View
                    style={[
                      styles.singlePlayerContainer,
                      {
                        marginLeft: index == 0 ? 0 : 20,
                      },
                    ]}
                    key={item?._id}>
                    <FastImage
                      style={{
                        height: 18,
                        width: 18,
                        position: 'absolute',
                        left: 0,
                      }}
                      resizeMode="contain"
                      source={
                        item?.vice_caption == true
                          ? VICE_CAPTAIN
                          : item?.caption == true
                            ? CAPTAIN
                            : null
                      }
                    />
                    {item?.replaced == true ?
                      <FastImage source={subsituteAdd} resizeMode="contain" style={styles.upIcon} />
                      : <></>}
                    <FastImage
                      source={item?.profile_image ? { uri: item?.profile_image } : bowlerIcon}
                      style={styles.playerImage}
                      resizeMode="contain"
                    />
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        backgroundColor: `${playercolor}`,
                        borderRadius: 4,
                        marginTop: -7
                      }}>
                      <AppText
                        style={[styles.playerName, { color: TextColor }]}
                        type={TEN}>
                        {modifyName(item?.first_name)}
                      </AppText>
                      {item?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {item?.playing11 == 'false' ? (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#FF0000',
                                marginTop: -1
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                height: 5,
                                width: 5,
                                borderRadius: 100,
                                backgroundColor: '#0BFF15',
                                marginTop: -1
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                    <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                      {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                    </AppText>
                  </View>
                );
              })
            ) : (
              <TouchableOpacityView
                onPress={() => {
                  dispatch(getTab('BOWLERS'));
                  NavigationService.goBack();
                }}>
                <FastImage
                  source={player_placeholder}
                  style={styles.playerImage}
                  resizeMode="contain"
                />
              </TouchableOpacityView>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
      <ImageBackground
        resizeMode='cover'
        source={smallBackgrounBlur}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}>
        {notReplacedSubstitutes?.length || replacedPlayers?.length || substitutePlayer?.length ?
          <View style={{
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            {notReplacedSubstitutes?.length || replacedPlayers?.length ?
              <View></View>
              : <>
                {substitutePlayer?.map((item) => {
                  return (
                    <View style={{
                      backgroundColor: colors.light,
                      borderRadius: 5,
                    }}>
                      <AppText style={{
                        marginLeft: 5,
                        marginRight: 5
                      }} color={WHITE}>
                        {modifyName(item?.first_name)}
                      </AppText>
                    </View>
                  )
                })}
              </>
            }
            {notReplacedSubstitutes?.length || replacedPlayers?.length ?
              <TouchableOpacityView
                style={{
                  flexDirection: "row", alignItems: "center",
                  alignSelf: "flex-end",
                }}
                onPress={() => refRBSheetReplaced?.current?.open()}>
                <FastImage style={styles.subsituteIcon} resizeMode="contain" source={substituteIcon} />
                <AppText color={WHITE}
                  weight={POPPINS_SEMI_BOLD}>
                  Replaced Substitute
                </AppText>
                <FastImage
                  source={downArrow}
                  resizeMode='contain'
                  style={{ height: 25, width: 25 }}
                  tintColor={colors.white}
                />
              </TouchableOpacityView> :
              <TouchableOpacityView
                onPress={() => refRBSheet?.current?.open()}
                style={{
                  flexDirection: "row", alignItems: "center",
                  alignSelf: "flex-end",
                }}>
                <FastImage
                  source={downArrow}
                  resizeMode='contain'
                  style={{ height: 25, width: 25 }}
                  tintColor={colors.white}
                />
              </TouchableOpacityView>
            }
          </View> : <></>}
        <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 100,
                  backgroundColor: '#000000',
                  marginTop: 1,
                  marginRight: 5,
                  marginTop: -2,
                }}
              />
              <AppText color={WHITE} weight={POPPINS_MEDIUM}>
                {TeamsShortNames && TeamsShortNames?.length !== 0
                  ? TeamsShortNames[0]
                  : ''}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              <View
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 100,
                  backgroundColor: '#FFFFFF',
                  marginTop: 1,
                  marginRight: 5,
                  marginTop: -2,
                }}
              />
              <AppText color={WHITE} weight={POPPINS_MEDIUM}>
                {TeamsShortNames && TeamsShortNames?.length !== 0
                  ? TeamsShortNames[1]
                  : ''}
              </AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 5,
                  width: 5,
                  borderRadius: 100,
                  backgroundColor: '#0BFF15',
                  marginTop: 1,
                  marginRight: 5,
                  marginTop: -2,
                }}
              />
              <AppText color={WHITE} >Announced</AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 15,
              }}>
              <View
                style={{
                  height: 5,
                  width: 5,
                  borderRadius: 100,
                  backgroundColor: '#FF0000',
                  marginTop: 1,
                  marginRight: 5,
                  marginTop: -2,
                }}
              />
              <AppText color={WHITE}>Unannounced</AppText>
            </View>
          </View>
        </View>

      </ImageBackground>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        animationType={'slide'}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000070',
          },
          draggableIcon: {
            backgroundColor: '#00000070',
          },
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            elevation: 5,
            shadowOpacity: 5,
            height: 140,
            paddingHorizontal: 18,
            backgroundColor: '#232528',
          },
        }}>
        <PlayerSubsitute substitutePlayer={substitutePlayer} refRBSheet={refRBSheet} />
      </RBSheet>
      <RBSheet
        ref={refRBSheetReplaced}
        closeOnPressMask={true}
        height={sheetHeight} // Set the height dynamically
        onContentSizeChange={handleContentSizeChange}
        animationType={'slide'}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000070',
          },
          draggableIcon: {
            backgroundColor: '#00000070',
          },
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            elevation: 5,
            shadowOpacity: 5,
            paddingHorizontal: 18,
            backgroundColor: '#232528',
          },
        }}>
        <ReplacedPlayer
          replacedPlayers={newReplacedPlayers}
          notReplacedSubstitutes={notReplacedSubstitutes}
          refRBSheetReplaced={refRBSheetReplaced} />
      </RBSheet>
    </AppSafeAreaView>
  );
};

export default PlayerPreview;
