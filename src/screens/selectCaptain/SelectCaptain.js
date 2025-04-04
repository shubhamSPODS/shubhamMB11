import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {View, ImageBackground, ScrollView} from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {appOperation} from '../../appOperation';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  BROWNYELLOW,
  FIFTEEN,
  FORTEEN,
  GRY,
  LIGHTBLUE,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SEMI_BOLD,
  TEN,
  THIRTEEN,
  WHITE,
} from '../../common/AppText';
import {SpinnerSecond} from '../../common/SpinnerSecond';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {
  DUMMY_USER,
  GROUND,
  LEFT_ARROW,
  LINEAR_GRADIENT,
  PANT,
  Subtract,
  all_rounderIcon,
  backIconMain,
  batsmanIcon,
  bowlerIcon,
  dropDownRed,
  wicket_keeperIcon,
} from '../../helper/image';
import {toastAlert} from '../../helper/utility';
import NavigationService from '../../navigation/NavigationService';
import {
  MY_CONTEST,
  PLAYER_PREVIEW,
  Single_Ipl_Card,
} from '../../navigation/routes';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import Header from '../../common/Header';
import {getMyTeam, setContestData} from '../../slices/matchSlice';
import Confirmation from '../../common/Confirmation';
import {StatusBar} from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import moment from 'moment';
import {NewColor, colors} from '../../theme/color';
import SecondaryButton from '../../common/secondaryButton';
import PrimaryButton from '../../common/primaryButton';
import {LiveTime} from '../../common/LiveTime';
import {universalPaddingHorizontal} from '../../theme/dimens';
import {MatchLiveModal} from '../../common/MatchLiveModal';

const SelectCaptain = () => {
  const route = useRoute();
  const AleartLive = useRef();
  const [captainId, setCaptainId] = useState(route?.params?.captain);
  const [viceCaptainId, setViceCaptainId] = useState(
    route?.params?.viceCaptain,
  );
  const [isLoading, setIsLoading] = useState(false);
  const myTeam = useSelector(state => state?.match?.myTeams);
  const selectedMatch = useSelector(state => state?.match?.selectedMatch);
  const isContestEntry = useSelector(state => state?.match?.isContestEntry);
  const contestData = useSelector(state => state?.match?.contestData);
  const [isAdd, setIsAdd] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedHighLow, setSelectedHighLow] = useState('high');
  const [removeTabs, setRemoveTabs] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [saveTeamName, setSaveTeamName] = useState('');
  const dispatch = useDispatch();
  const currentDate = new Date();
  const inputDate = new Date(contestData?.StartDateTime);
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const convertToTeamsTitle2 = arr => {
    const TeamsTitle2 = arr && arr?.map(title => title.trim());
    return TeamsTitle2;
  };
  const removedSpacesTeamsTitle = convertToTeamsTitle2(
    contestData?.TeamsShortNames,
  );
  useEffect(() => {
    if (route?.params?.isEditMode) {
      route?.params?.selctedPlayerDetails &&
        route?.params?.selctedPlayerDetails?.find(e => {
          return (
            e?.vice_caption == true ? setViceCaptainId(e?.pid) : null,
            e?.caption == true ? setCaptainId(e?.pid) : null
          );
        });
    }
  }, []);
  let players_List = route?.params?.selctedPlayerDetails ?? [];
  let wicket_keepers_list = players_List
    .filter(item => item.playing_role === 'wk')
    .sort((a, b) => {
      if (selectedFilter === 'TYPE') {
        if (selectedHighLow === 'low') {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      }
      return 0;
    });
  let bowlers_list = players_List
    .filter(item => item.playing_role === 'bowl')
    .sort((a, b) => {
      if (selectedFilter === 'TYPE') {
        if (selectedHighLow === 'low') {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      }
      return 0;
    });
  let batsman_list = players_List
    .filter(item => item.playing_role === 'bat')
    .sort((a, b) => {
      if (selectedFilter === 'TYPE') {
        if (selectedHighLow === 'low') {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      }
      return 0;
    });
  let all_rounder_list = players_List
    .filter(item => item.playing_role === 'all')
    .sort((a, b) => {
      if (selectedFilter === 'TYPE') {
        if (selectedHighLow === 'low') {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      }
      return 0;
    });
  const onSelectCaptain = id => {
    if (viceCaptainId == id) {
      setViceCaptainId(null);
    }
    setCaptainId(id);
  };
  const onSelectViceCaptain = id => {
    if (captainId == id) {
      setCaptainId(null);
    }
    setViceCaptainId(id);
  };

  const renderPlayer = item => {
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
    return (
      <View style={styles.playerContainer}>
        <FastImage
          source={item?.profile_image ? {uri: item?.profile_image} : playerIcon}
          resizeMode="contain"
          style={styles.playerImage}
        />
        <View style={{flex: 1, marginLeft: -10}}>
          <AppText numberOfLines={1}>
            {item?.short_name.split(' ')[0].charAt(0).toUpperCase() +
              ' ' +
              item?.short_name.split(' ')[1]}
          </AppText>
          <AppText style={{textTransform: 'uppercase'}} type={TEN}>
            <AppText
              type={TEN}
              color={BLACKOPACITY}
              style={{
                textTransform: 'uppercase',
              }}>
              {item?.teamName} |
            </AppText>{' '}
            {item?.playing_role}
          </AppText>
          {item?.playing11 == undefined ? (
            <></>
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
        <View style={{flex: 1, alignItems: 'center'}}>
          <AppText style={{marginLeft: -32}} type={TEN}>
            {item?.average_point ? item?.average_point?.toFixed(2) : 0}
          </AppText>
        </View>
        <ImageBackground
          source={Subtract}
          resizeMode="stretch"
          style={styles.vcContainer}>
          {item?.pid !== captainId ? (
            <View style={{alignItems: 'center', marginTop: 5}}>
              <TouchableOpacityView
                onPress={() => onSelectCaptain(item?.pid)}
                style={[styles.roleBedge]}>
                <AppText
                  weight={POPPINS_SEMI_BOLD}
                  color={BROWNYELLOW}
                  type={TEN}>
                  {'C'}
                </AppText>
              </TouchableOpacityView>
            </View>
          ) : (
            <TouchableOpacityView
              onPress={() => onSelectCaptain(item?.pid)}
              style={{alignItems: 'center', marginTop: 5}}>
              <View style={[styles.roleBedge2]}>
                <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TEN}>
                  2X
                </AppText>
              </View>
            </TouchableOpacityView>
          )}
          {item?.pid !== viceCaptainId ? (
            <View style={{alignItems: 'center', marginTop: 5}}>
              <TouchableOpacityView
                onPress={() => onSelectViceCaptain(item?.pid)}
                style={[styles.roleBedge]}>
                <AppText
                  weight={POPPINS_SEMI_BOLD}
                  color={BROWNYELLOW}
                  type
                  type={TEN}>
                  VC
                </AppText>
              </TouchableOpacityView>
            </View>
          ) : (
            <TouchableOpacityView
              onPress={() => onSelectViceCaptain(item?.pid)}
              style={{alignItems: 'center', marginTop: 5}}>
              <View style={[styles.roleBedge2]}>
                <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={TEN}>
                  1.5X
                </AppText>
              </View>
            </TouchableOpacityView>
          )}
        </ImageBackground>
      </View>
    );
  };
  const saveTeam = async () => {
    const isCaptainValid = route?.params?.selectedPlayers.find(
      player => player === captainId,
    );
    const isViceCaptainValid = route?.params?.selectedPlayers.find(
      player => player === viceCaptainId,
    );
    if (!captainId || !isCaptainValid) {
      return toastAlert.showToastError('Please Select Captain');
    }
    if (!viceCaptainId ||!isViceCaptainValid) {
      return toastAlert.showToastError('Please Select Vice Captain');
    }
    if (route?.params?.isEditMode) {
      try {
        setIsLoading(true);
        const res = await appOperation.customer.editTeam({
          match_id: route?.params?.matchDetails?._id?.toString(),
          matchid: route?.params?.matchDetails?.MatchId?.toString(),
          name: route?.params?.team_name,
          caption: captainId,
          vice_caption: viceCaptainId,
          pid: route?.params?.selectedPlayers,
          team_id: route?.params?.team_id,
        });
        setIsLoading(false);
        if (res?.code == 200) {
          // await dispatch(getMyTeam(route?.params?.matchDetails?._id));
          toastAlert.showToastError(res?.message);
          if (isContestEntry) {
            setIsAdd(true);
          } else {
            setTimeout(() => {
              dispatch(setContestData(route?.params?.matchDetails));
              NavigationService.navigate(MY_CONTEST);
            }, 1000);
          }
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);

        const res = await appOperation.customer.saveTeam({
          match_id: contestData._id?.toString(),
          matchid: contestData?.MatchId?.toString(),
          name: `T${myTeam?.length + 1}`,
          caption: captainId,
          vice_caption: viceCaptainId,
          pid: route?.params?.selectedPlayers,
        });

        setIsLoading(false);
        if (res?.code == 200) {
          toastAlert.showToastError(res?.message);
          dispatch(getMyTeam(route?.params?.matchDetails?._id));
          if (isContestEntry) {
            setSaveTeamName(`T${myTeam?.length + 1}`);
            setIsAdd(true);
          } else {
            setTimeout(() => {
              dispatch(setContestData(route?.params?.matchDetails));
              NavigationService.navigate(MY_CONTEST);
            }, 1000);
          }
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    }
  };
  const onPreview = () => {
    NavigationService.navigate(PLAYER_PREVIEW, {
      selectedPlayerDetails: route?.params?.selctedPlayerDetails,
      oldData: route?.params?.matchDetails,
      selectedPlayers: route?.params?.selectedPlayers,
      captainId: captainId,
      viceCaptainId: viceCaptainId,
      availableCredits: route?.params?.availableCredits,
      playerTwo: route?.params?.playerTwo,
      player: route?.params?.player,
      isFromMyMatch: route?.params?.isFromMyMatch,
    });
  };
  const filterWithAll = title => {
    if (title == 'AVG') {
      if (selectedHighLow == 'high') {
        const highPricedItems = players_List
          .slice()
          .sort((a, b) => b.average_point - a.average_point);
        setFilterData(highPricedItems);
        setSelectedHighLow('low');
        setSelectedFilter(title);
      } else if (selectedHighLow == 'low') {
        const highPricedItems = players_List
          .slice()
          .sort((a, b) => a.average_point - b.average_point);
        setFilterData(highPricedItems);
        setSelectedHighLow('high');
        setSelectedFilter(title);
      }
    } else if (title == 'TYPE') {
      if (selectedHighLow == 'high') {
        setSelectedHighLow('low');
        setSelectedFilter(title);
        setFilterData([]);
      } else if (selectedHighLow == 'low') {
        setSelectedHighLow('high');
        setSelectedFilter(title);
        setFilterData([]);
      }
    }
  };
  useEffect(() => {
    if (removeTabs) {
      if (route?.params?.isFromMyMatch == true) {
      } else {
        AleartLive.current.open();
      }
    }
  }, [removeTabs]);
  return (
    <AppSafeAreaView>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginTop: '10%',
            alignItems: 'center',
          }}>
          <TouchableOpacityView
            style={{padding: 5}}
            onPress={() => NavigationService.goBack()}>
            <FastImage
              source={backIconMain}
              resizeMode="contain"
              style={{
                height: 28,
                width: 28,
                marginTop: 2,
              }}
            />
          </TouchableOpacityView>
          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: 10,
            }}>
            <AppText
              weight={POPPINS_MEDIUM}
              type={FORTEEN}
              style={{
                textAlign: 'left',
              }}>
              Create Team
            </AppText>
          </View>
        </View>
        <AppText
          weight={POPPINS_SEMI_BOLD}
          type={FORTEEN}
          style={styles.heading}>
          Choose Captain & Vice Captain
        </AppText>
        <AppText
          color={BLACKOPACITY}
          weight={POPPINS}
          style={styles.subHeading}>
          C will get 2x points & VC will get 1.5x points
        </AppText>
        <View style={styles.playerHeadingBar}>
          <AppText
            style={{
              flex: 1,
            }}
            weight={POPPINS}></AppText>

          <AppText
            type={TEN}
            style={{
              flex: 1.5,
              textAlign: 'left',
              marginRight: -7,
            }}
            weight={POPPINS}>
            Type
          </AppText>
          <TouchableOpacityView
            onPress={() => filterWithAll('AVG')}
            style={{
              flex: 2,
              marginRight: 15,
              flexDirection: 'row',
            }}>
            <AppText
              type={TEN}
              style={{textAlign: 'left', marginLeft: 5}}
              weight={POPPINS}>
              AVG
            </AppText>
            {'AVG' == selectedFilter ? (
              <FastImage
                style={{
                  height: 9,
                  width: 8,
                  marginLeft: 5,
                  marginTop: -1,
                  transform: [
                    {rotate: selectedHighLow == 'high' ? '180deg' : '0deg'},
                  ],
                }}
                source={dropDownRed}
                resizeMode="contain"
              />
            ) : (
              <></>
            )}
          </TouchableOpacityView>
        </View>
        {filterData?.length ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingHorizontal: universalPaddingHorizontal,
              marginTop: 10,
            }}>
            {filterData &&
              filterData?.map(item => {
                return renderPlayer(item);
              })}
          </ScrollView>
        ) : (
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: universalPaddingHorizontal,
            }}>
            <AppText
              style={{opacity: 0.4, marginTop: 10}}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              type={FORTEEN}>
              Wicket-Keeper
            </AppText>
            <LinearGradient
              style={{width: '100%', height: 2, marginBottom: 10}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              locations={[0.0, 1.0]}
            />
            {wicket_keepers_list &&
              wicket_keepers_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{opacity: 0.4, marginTop: 15}}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              type={FORTEEN}>
              Batsman
            </AppText>
            <LinearGradient
              style={{width: '100%', height: 2, marginBottom: 10}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              locations={[0.0, 1.0]}
            />
            {batsman_list &&
              batsman_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{opacity: 0.4, marginTop: 15}}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              type={FORTEEN}>
              All Rounders
            </AppText>
            <LinearGradient
              style={{width: '100%', height: 2, marginBottom: 10}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              locations={[0.0, 1.0]}
            />
            {all_rounder_list &&
              all_rounder_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{opacity: 0.4, marginTop: 15}}
              color={WHITE}
              weight={POPPINS_SEMI_BOLD}
              type={FORTEEN}>
              Bowlers
            </AppText>
            <LinearGradient
              style={{width: '100%', height: 2, marginBottom: 10}}
              colors={[
                colors.playerDetailsLinerOne,
                colors.playerDetailsLinerTwo,
              ]}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              locations={[0.0, 1.0]}
            />
            {bowlers_list &&
              bowlers_list?.map(item => {
                return renderPlayer(item);
              })}
          </ScrollView>
        )}
        {/* <View style={{ flex: 1 }}>
          <FlatList
            data={filterData?.length ? filterData : route?.params?.selctedPlayerDetails}
            renderItem={renderPlayer}
            showsVerticalScrollIndicator={false}
          />
        </View> */}
        <View style={styles.btnContainer}>
          <SecondaryButton
            onPress={() => onPreview()}
            buttonStyle={[
              styles.buttonStyle,
              {
                borderWidth: 1,
                borderRadius: 10,
                borderColor: colors.brownYellow,
              },
            ]}
            title={'TEAM PREVIEW'}
            titleStyle={{color: colors.brownYellow}}
          />
          <PrimaryButton
            buttonStyle={styles.buttonStyle}
            onPress={saveTeam}
            title="SAVE"
          />
        </View>
      </CommonImageBackground>
      <Confirmation
        isModalVisible={isAdd}
        details={selectedMatch}
        setIsModalVisible={setIsAdd}
        matchDetails={route?.params?.matchDetails}
        teamLength={false}
        selectMulty={[]}
        JoinWithMULT={false}
        saveTeamName={saveTeamName}
      />
      <SpinnerSecond loading={isLoading} />
      <MatchLiveModal AleartLive={AleartLive} />
    </AppSafeAreaView>
  );
};

export default SelectCaptain;
