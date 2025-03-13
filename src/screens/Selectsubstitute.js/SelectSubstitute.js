import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Platform, RefreshControl, ScrollView, StatusBar, View } from "react-native";
import { AppSafeAreaView } from "../../common/AppSafeAreaView";
import CommonImageBackground from "../../common/commonImageBackground";
import CommonHeader from "../../components/matchCard/commonHeader/CommonHeader";
import { AppText, BLACK, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, RBBACKGROUND, SIXTEEN, TEN } from "../../common/AppText";
import FastImage from "react-native-fast-image";
import { addsubstitues, all_rounderIcon, batsmanIcon, bowlerIcon, rightArrow, subfour, subminus, subone, subthree, subtwo, wicket_keeperIcon } from "../../helper/image";
import styles from "./styles";
import { TouchableOpacityView } from "../../common/TouchableOpacityView";
import { NewColor, colors } from "../../theme/color";
import { universalPaddingHorizontal } from "../../theme/dimens";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { modifyName, playerRollImage, toastAlert } from "../../helper/utility";
import { getAllPlayerList, getSubsituted, setContestData, setLoading } from "../../slices/matchSlice";
import SecondaryButton from "../../common/secondaryButton";
import PrimaryButton from "../../common/primaryButton";
import { appOperation } from "../../appOperation";
import NavigationService from "../../navigation/NavigationService";
import { SpinnerSecond } from "../../common/SpinnerSecond";
import { MY_CONTEST, PLAYER_PREVIEW } from "../../navigation/routes";

export const customSortRating = (a, b) => {
  if (a.fantasy_player_rating === b.fantasy_player_rating) {
    return 0;
  }
  if (a.fantasy_player_rating < b.fantasy_player_rating) {
    return 1; // Sort in descending order (highest rating first)
  }
  return -1;
};
export const customSort = (a, b) => {
  if (a.playing11 === b.playing11) {
    return 0;
  }
  if (a.playing11 == 'true') {
    return -1;
  }
  return 1;
};
const SelectSubstitute = ({ route }) => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(2);
  const [modalRemove, setModalRemove] = useState(false)
  const [random, setRandom] = useState(10);
  const [randomid, setranDomId] = useState(10);
  const [arrayOne, setArrayOne] = useState([]);
  const [arrayTwo, setArrayTwo] = useState([]);
  const [arrayThree, setArrayThree] = useState([]);
  const [arrayFour, setArrayFour] = useState([]);
  const [selectedHighLow, setSelectedHighLow] = useState('high');
  const [filterData, setFilterData] = useState([])
  const [saveTitle, setSaveTitle] = useState('');
  const [isLoadingTwo, setIsloadingTwo] = useState(false)
  const RemaningPlayer = useSelector(state => state?.match?.RemaningPlayer);
  const substitute = useSelector(state => state?.match?.substitute);
  const contestData = useSelector(state => state?.match?.contestData);
  const isLoading = useSelector(state => state?.match?.isLoading);
  const convertToTeamsTitle2 = arr => {
    const TeamsTitle2 = arr.map(title => title.trim());
    return TeamsTitle2;
  };
  const removedSpacesTeamsTitle = convertToTeamsTitle2(contestData?.TeamsTitle);
  let wicket_keepers_list = RemaningPlayer?.filter(item => item.playing_role === 'wk')
    .sort(customSortRating).sort(customSort)
  let bowlers_list = RemaningPlayer
    .filter(item => item.playing_role === 'bowl').sort(customSortRating).sort(customSort)
  let batsman_list = RemaningPlayer
    .filter(item => item.playing_role === 'bat').sort(customSortRating).sort(customSort)
  let all_rounder_list = RemaningPlayer
    .filter(item => item.playing_role === 'all').sort(customSortRating).sort(customSort)


  const onSelect = (value, item) => {
    const playerSubstitute = [...substitute];
    let pidSave = playerSubstitute?.findIndex(y => {
      return y?.pid === value?.pid;
    });
    let pidSaveUnique = playerSubstitute?.findIndex(y => {
      return y?.pid === value?.pid && y?.numberid === value?.numberid;
    });
    let pidSaveNonUnique = playerSubstitute?.findIndex(y => {
      return y?.pid === value?.pid && y?.numberid !== value?.numberid;
    });
    let pidSaveNonUniqueId = playerSubstitute?.findIndex(y => {
      return y?.pid !== value?.pid && y?.numberid === value?.numberid;
    });

    if (pidSave !== -1) {
      if (pidSaveUnique !== -1) {
        playerSubstitute.splice(pidSaveUnique, 1);
      } else {
        if (pidSaveNonUniqueId !== -1 && pidSaveNonUnique !== -1) {
          playerSubstitute.splice(pidSaveNonUniqueId, 1);
          playerSubstitute.splice(pidSaveNonUnique, 1);
          playerSubstitute.push(value);
        } else {
          playerSubstitute.splice(pidSaveNonUnique, 1);
          playerSubstitute.push(value);
        }
      }
    } else {
      if (pidSaveNonUniqueId !== -1) {
        playerSubstitute.splice(pidSaveNonUniqueId, 1);
        playerSubstitute.push(value);
      } else {
        playerSubstitute.push(value);
      }
    }
    dispatch(getSubsituted(playerSubstitute));
    setRandom(Math.random());
  };
  const renderPlayer = (item) => {
    const modifiedNames = modifyName(item?.first_name);
    const NewData = [
      {
        pid: item.pid,
        numberid: 1,
        MinusIcon: subminus,
        Type: subone,
        first_name: item?.first_name,
        tier: item.tier,
        playing_role: item?.playing_role,
        profile_image: item?.profile_image,
        title: item?.title,
        playing11: item?.playing11,
      },
      {
        pid: item.pid,
        numberid: 2,
        MinusIcon: subminus,
        Type: subtwo,
        first_name: item?.first_name,
        tier: item.tier,
        playing_role: item?.playing_role,
        profile_image: item?.profile_image,
        title: item?.title,
        playing11: item?.playing11,
      },
      {
        pid: item.pid,
        numberid: 3,
        MinusIcon: subminus,
        Type: subthree,
        first_name: item?.first_name,
        tier: item.tier,
        playing_role: item?.playing_role,
        profile_image: item?.profile_image,
        title: item?.title,
        playing11: item?.playing11,
      },
      {
        pid: item.pid,
        numberid: 4,
        MinusIcon: subminus,
        Type: subfour,
        first_name: item?.first_name,
        tier: item.tier,
        playing_role: item?.playing_role,
        profile_image: item?.profile_image,
        title: item?.title,
        playing11: item?.playing11,
      },
    ];
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
      <View style={styles.renderContatainer}>
        <View
          style={styles.underRenderContainer}>
          <View style={styles.profileContainer}>
            <FastImage
              source={
                item?.profile_image
                  ? { uri: item?.profile_image }
                  : playerIcon
              }
              resizeMode="contain"
              style={styles.plyaerProfile}
            />
            <AppText
              weight={POPPINS_MEDIUM}
              type={TEN}
              color={BLACK}
              style={{
                top: 2,
              }}>
              {item?.teamName}
            </AppText>
          </View>
          <View style={[styles.playerNameContainer,
          { marginTop: item?.last_play ? -8 : 0 }]}>
            <AppText numberOfLines={1} style={[styles.playerName, { marginLeft: -5 }]}>
              {modifiedNames}
            </AppText>
            <AppText
              weight={POPPINS_MEDIUM}
              style={styles.playerRoll}>
              {item?.playing_role?.toUpperCase()}
            </AppText>
            {item?.playing11 == undefined ? (
              <>
                {item?.last_play ?
                  <View style={styles.lastPlay}>
                    <View
                      style={styles.lastPlayConainer}
                    />
                    <AppText
                      color={RBBACKGROUND}
                      style={styles.lastPlayText}
                      weight={POPPINS_MEDIUM}>
                      Played last match
                    </AppText>
                  </View> : <></>
                }
              </>
            ) : (
              <>
                {item?.playing11 == 'true' ? (
                  <View style={styles.playingContainer}>
                    <View style={styles.dotPaying} />
                    <AppText
                      type={TEN}
                      style={styles.PlayIngText}
                      weight={POPPINS_MEDIUM}>
                      Announced
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.playingContainer}>
                    <View style={styles.unPlayDot} />
                    <AppText
                      type={TEN}
                      style={styles.unPlayText}
                      weight={POPPINS_MEDIUM}>
                      Unannounced
                    </AppText>
                  </View>
                )}
              </>
            )}
          </View>
          <View style={styles.avgContainer}>
            <AppText
              type={TEN}
              POPPINS_MEDIUM={POPPINS_MEDIUM}
              color={BLACK}>
              {item?.average_point ? item?.average_point?.toFixed(2) : 0}
            </AppText>
          </View>
          <View style={styles.selectSubConatiner}>
            {NewData?.map(value => {
              let pidSave = substitute?.find(y => {
                return y?.pid === value?.pid && y?.numberid === value?.numberid;
              });
              return (
                <TouchableOpacityView onPress={() => onSelect(value, item)}>
                  <FastImage
                    source={pidSave ? value?.MinusIcon : value?.Type}
                    style={styles.selectImage}
                    resizeMode="contain"
                  />
                </TouchableOpacityView>
              );
            })}
          </View>
        </View>
      </View>
    )
  };
  useEffect(() => {
    let newOne = substitute?.filter(item => {
      return item?.numberid == 1 && item;
    });
    setranDomId(Math.random());
    setArrayOne(newOne);
    setranDomId(Math.random());
    let newTwo = substitute?.filter(item => {
      return item?.numberid == 2 && item;
    });
    setranDomId(Math.random());
    setArrayTwo(newTwo);
    setranDomId(Math.random());
    let newThree = substitute?.filter(item => {
      return item?.numberid == 3 && item;
    });
    setranDomId(Math.random());
    setArrayThree(newThree);
    setranDomId(Math.random());
    let newFour = substitute?.filter(item => {
      return item?.numberid == 4 && item;
    });
    setranDomId(Math.random());
    setArrayFour(newFour);
    setranDomId(Math.random());
  }, [substitute?.length, random]);
  const filterDataOfSorting = title => {
    if (title == 'PLAYERS') {
      if (selectedHighLow === 'low') {
        const highPricedItems = RemaningPlayer
          .slice()
          .sort((a, b) => a.first_name.localeCompare(b.first_name));
        setSelectedHighLow('high');
        setFilterData(highPricedItems);
        // dispatch(setRemaning(highPricedItems))
        setSaveTitle('PLAYERS')
      } else {
        const highPricedItems = RemaningPlayer
          .slice()
          .sort((a, b) => b.first_name.localeCompare(a.first_name));
        setSelectedHighLow('low');
        setFilterData(highPricedItems);
        // dispatch(setRemaning(highPricedItems))
        setSaveTitle('PLAYERS')
      }
    } else if (title == 'AVG. POINTS') {
      if (selectedHighLow == 'high') {
        const highPricedItems = RemaningPlayer
          .slice()
          .sort((a, b) => b.average_point - a.average_point);
        setSelectedHighLow('low');
        setFilterData(highPricedItems);
        // dispatch(setRemaning(highPricedItems))
        setSaveTitle('AVG. POINTS')

      } else if (selectedHighLow == 'low') {
        const highPricedItems = RemaningPlayer
          .slice()
          .sort((a, b) => a.average_point - b.average_point);
        setSelectedHighLow('high');
        setFilterData(highPricedItems);
        // dispatch(setRemaning(highPricedItems))
        setSaveTitle('AVG. POINTS')
      }
    }
  };
  const saveTeam = async one => {
    const pid = substitute.map(player => player?.pid);
    const newPid = pid.filter(
      id => !route?.params?.selectedPlayers.includes(id),
    );
    if (!route?.params?.captainId) {
      return toastAlert.showToastError('Please Select Captain');
    }
    if (!route?.params?.vice_caption) {
      return toastAlert.showToastError('Please Select Vice Captain');
    }
    if (route?.params?.isEditMode) {
      try {
        setIsloadingTwo(true)
        const res = await appOperation.customer.editTeam({
          match_id: route?.params?.matchDetails?._id?.toString(),
          matchid: route?.params?.matchDetails?.MatchId?.toString(),
          name: route?.params?.team_name,
          caption: route?.params?.captainId,
          vice_caption: route?.params?.vice_caption,
          pid: route?.params?.selectedPlayers,
          sid: newPid?.length ? newPid : [],
          team_id: route?.params?.team_id,
          substitute1: arrayOne[0]?.pid,
          substitute2: arrayTwo[0]?.pid,
          substitute3: arrayThree[0]?.pid,
          substitute4: arrayFour[0]?.pid,
          substitute: substitute?.length ? true : false
        });
        dispatch(getSubsituted([]));
        if (res?.code == 200) {
          toastAlert.showToastError(res?.message);
          dispatch(setContestData(route?.params?.matchDetails));
          NavigationService.navigate(MY_CONTEST);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsloadingTwo(false)
      }
    }
  };
  const onPreview = () => {
    NavigationService.navigate(PLAYER_PREVIEW, {
      selectedPlayerDetails: route?.params?.selctedPlayerDetails,
      oldData: route?.params?.matchDetails,
      selectedPlayers: route?.params?.selectedPlayers,
      substitute: true,
      team_name: route?.params?.team_name,
      vice_caption: route?.params?.vice_caption,
      captainId: route?.params?.captainId,
      team_id: route?.params?.team_id,
      player: route?.params?.player,
      playerTwo: route?.params?.playerTwo,
      isEditMode: route?.params?.isEditMode,
      availableCredits: route?.params?.availableCredits,
      selectsubstitute: substitute
    });
  };
  const onRefresh = () => {
    dispatch(
      getAllPlayerList(
        contestData?._id,
        {},
        true,
        route?.params?.selctedPlayerDetails,
      ),
    );
  };
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <CommonHeader
          activeTab={activeTab}
          setActiveTab={e => setActiveTab(e)}
          allContest={true}
          style={{ marginBottom: 0, height: 60 }}
          setModalRemove={setModalRemove}
          walletIco={true}
        />
        <View
          style={styles.topheadingContainer}>
          <AppText weight={POPPINS_SEMI_BOLD}
            type={SIXTEEN}
            color={BLACK}>
            Select up to 4 Substitutes
          </AppText>
          <View style={styles.topUnderContainer}>
            <View style={styles.undernewContainer}>
              <View style={styles.alignCenter}>
                <ImageBackground
                  imageStyle={{ resizeMode: 'contain' }}
                  style={styles.subsBackImage}
                  source={addsubstitues}>
                  {arrayOne?.length ?
                    <FastImage
                      resizeMode="contain"
                      source={playerRollImage('SUB-1', arrayOne)}
                      style={styles.subsAddImage}
                    />
                    : <></>}
                </ImageBackground>

                <View style={[styles.textContainerSUbs, {
                  backgroundColor: arrayOne?.length
                    ? arrayOne[0]?.title === removedSpacesTeamsTitle[0]
                      ? colors.black
                      : colors.white
                    : colors.blue,
                }]}>
                  <AppText
                    numberOfLines={1}
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={[styles.subsText1, {
                      color: arrayOne?.length
                        ? arrayOne[0]?.title === removedSpacesTeamsTitle[0]
                          ? colors.white
                          : colors.black
                        : colors.white,
                    }]}>
                    {arrayOne[0]?.first_name
                      ? modifyName(arrayOne[0]?.first_name)
                      : 'SUB-1'}
                  </AppText>
                  {arrayOne[0]?.first_name ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText
                        numberOfLines={1}
                        type={TEN}
                        weight={POPPINS_MEDIUM}
                        style={{
                          color: arrayOne?.length
                            ? arrayOne[0]?.title === removedSpacesTeamsTitle[0]
                              ? colors.white
                              : colors.black
                            : colors.white,
                          textAlign: 'center',
                        }}>
                        {'SUB-1'}
                      </AppText>
                      {arrayOne[0]?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {arrayOne[0]?.playing11 == 'true' ? (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotgreen} />
                            </View>
                          ) : (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotRed} />
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.undernewContainer}>
              <View style={styles.alignCenter}>
                <ImageBackground
                  imageStyle={{ resizeMode: 'contain' }}
                  style={styles.subsBackImage}
                  source={addsubstitues}>
                  {arrayTwo?.length ?
                    <FastImage
                      resizeMode="contain"
                      source={playerRollImage('SUB-2', arrayTwo)}
                      style={styles.subsAddImage}
                    />
                    : <></>}
                </ImageBackground>
                <View style={[styles.textContainerSUbs, {
                  backgroundColor: arrayTwo?.length
                    ? arrayTwo[0]?.title === removedSpacesTeamsTitle[0]
                      ? colors.black
                      : colors.white
                    : colors.blue,
                }]}>
                  <AppText
                    numberOfLines={1}
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={[styles.subsText1, {
                      color: arrayTwo?.length
                        ? arrayTwo[0]?.title === removedSpacesTeamsTitle[0]
                          ? colors.white
                          : colors.black
                        : colors.white,
                    }]}>
                    {arrayTwo[0]?.first_name
                      ? modifyName(arrayTwo[0]?.first_name)
                      : 'SUB-2'}
                  </AppText>
                  {arrayTwo[0]?.first_name ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText
                        numberOfLines={1}
                        type={TEN}
                        weight={POPPINS_MEDIUM}
                        style={{
                          color: arrayTwo?.length
                            ? arrayTwo[0]?.title === removedSpacesTeamsTitle[0]
                              ? colors.white
                              : colors.black
                            : colors.white,
                          textAlign: 'center',
                        }}>
                        {'SUB-2'}
                      </AppText>
                      {arrayTwo[0]?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {arrayTwo[0]?.playing11 == 'true' ? (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotgreen} />
                            </View>
                          ) : (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotRed} />
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.undernewContainer}>
              <View style={styles.alignCenter}>
                <ImageBackground
                  imageStyle={{ resizeMode: 'contain' }}
                  style={styles.subsBackImage}
                  source={addsubstitues}>
                  {arrayThree?.length ?
                    <FastImage
                      resizeMode="contain"
                      source={playerRollImage('SUB-3', arrayThree)}
                      style={styles.subsAddImage}
                    />
                    : <></>}
                </ImageBackground>
                <View style={[styles.textContainerSUbs, {
                  backgroundColor: arrayThree?.length
                    ? arrayThree[0]?.title === removedSpacesTeamsTitle[0]
                      ? colors.black
                      : colors.white
                    : colors.blue,
                }]}>
                  <AppText
                    numberOfLines={1}
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={[styles.subsText1, {
                      color: arrayThree?.length
                        ? arrayThree[0]?.title === removedSpacesTeamsTitle[0]
                          ? colors.white
                          : colors.black
                        : colors.white,
                    }]}>
                    {arrayThree[0]?.first_name
                      ? modifyName(arrayThree[0]?.first_name)
                      : 'SUB-3'}
                  </AppText>
                  {arrayThree[0]?.first_name ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText
                        numberOfLines={1}
                        weight={POPPINS_MEDIUM}
                        type={TEN}
                        style={{
                          color: arrayThree?.length
                            ? arrayThree[0]?.title === removedSpacesTeamsTitle[0]
                              ? colors.white
                              : colors.black
                            : colors.white,
                          textAlign: 'center',
                        }}>
                        {'SUB-3'}
                      </AppText>
                      {arrayThree[0]?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {arrayThree[0]?.playing11 == 'true' ? (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotgreen} />
                            </View>
                          ) : (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotRed} />
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.undernewContainer}>
              <View style={styles.alignCenter}>
                <ImageBackground
                  imageStyle={{ resizeMode: 'contain' }}
                  style={styles.subsBackImage}
                  source={addsubstitues}>
                  {arrayFour?.length ?
                    <FastImage
                      resizeMode="contain"
                      source={playerRollImage('SUB-4', arrayFour)}
                      style={styles.subsAddImage}
                    />
                    : <></>}
                </ImageBackground>
                <View style={[styles.textContainerSUbs, {
                  backgroundColor: arrayFour?.length
                    ? arrayFour[0]?.title === removedSpacesTeamsTitle[0]
                      ? colors.black
                      : colors.white
                    : colors.blue,
                }]}>
                  <AppText
                    numberOfLines={1}
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    style={[styles.subsText1, {
                      color: arrayFour?.length
                        ? arrayFour[0]?.title === removedSpacesTeamsTitle[0]
                          ? colors.white
                          : colors.black
                        : colors.white,
                    }]}>
                    {arrayFour[0]?.first_name
                      ? modifyName(arrayFour[0]?.first_name)
                      : 'SUB-4'}
                  </AppText>
                  {arrayFour[0]?.first_name ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText
                        numberOfLines={1}
                        type={TEN}
                        weight={POPPINS_MEDIUM}
                        style={{
                          color: arrayFour?.length
                            ? arrayFour[0]?.title === removedSpacesTeamsTitle[0]
                              ? colors.white
                              : colors.black
                            : colors.white,
                          textAlign: 'center',
                        }}>
                        {'SUB-4'}
                      </AppText>
                      {arrayFour[0]?.playing11 == undefined ? (
                        <></>
                      ) : (
                        <>
                          {arrayFour[0]?.playing11 == 'true' ? (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotgreen} />
                            </View>
                          ) : (
                            <View style={{ flexDirection: 'row' }}>
                              <View style={styles.headerDotRed} />
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.playerHeadingBar}>
          <TouchableOpacityView
            onPress={() => filterDataOfSorting('PLAYERS')}
            style={styles.filterPlayerText}>
            <AppText
              style={[
                [
                  styles.label,
                  {
                    textAlign: 'left',
                  },
                ],
              ]}
              weight={POPPINS_MEDIUM}>
              PLAYERS
            </AppText>
            {'PLAYERS' == saveTitle ? (
              <FastImage
                style={[styles.filterPlayerArrow, {

                  transform: [
                    { rotate: selectedHighLow == 'high' ? '270deg' : '90deg' },
                  ],
                }]}
                source={rightArrow}
                tintColor={colors.black}
                resizeMode="contain"
              />
            ) : (
              <></>
            )}
          </TouchableOpacityView>
          <TouchableOpacityView style={styles.filerAvgContainer}
            onPress={() => filterDataOfSorting('AVG. POINTS')} >
            <AppText
              style={[styles.label, { right: 5, }]}
              weight={POPPINS_MEDIUM}>
              AVG. POINTS
            </AppText>
            {'AVG. POINTS' == saveTitle ? (
              <FastImage
                style={[styles.filterAvgArrow, {
                  transform: [
                    { rotate: selectedHighLow == 'high' ? '270deg' : '90deg' },
                  ],
                }]}
                source={rightArrow}
                tintColor={colors.black}
                resizeMode="contain"
              />
            ) : (
              <></>
            )}
          </TouchableOpacityView>
          <AppText
            style={[styles.label, { flex: 1.7, textAlign: 'center' }]}
            weight={POPPINS_MEDIUM}>
            SUBSTITUTES PRIORITY
          </AppText>
        </View>
        {filterData?.length ?
          <ScrollView
            contentContainerStyle={{ marginTop: 10 }}
            style={{
              flex: 1,
              paddingHorizontal: universalPaddingHorizontal,
            }}>
            {
              filterData &&
              filterData?.map(item => {
                return renderPlayer(item);
              })
            }
          </ScrollView>
          :
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => onRefresh()}
              />
            }
            style={{
              flex: 1,
              paddingHorizontal: universalPaddingHorizontal,
            }}>
            <AppText
              style={{ opacity: 0.4, marginTop: 10 }}
              color={BLACK}
              weight={POPPINS_MEDIUM}
              type={FORTEEN}>
              Wicket-Keeper
            </AppText>
            <LinearGradient
              style={{ width: '100%', height: 2, marginBottom: 10 }}
              colors={[colors.white, colors.blue]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.0, 1.0]}
            />
            {wicket_keepers_list &&
              wicket_keepers_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{ opacity: 0.4, marginTop: 10 }}
              color={BLACK}
              weight={POPPINS_MEDIUM}
              type={FORTEEN}>
              Batsman
            </AppText>
            <LinearGradient
              style={{ width: '100%', height: 2, marginBottom: 10 }}
              colors={[colors.white, colors.blue]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.0, 1.0]}
            />
            {batsman_list &&
              batsman_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{ opacity: 0.4, marginTop: 10 }}
              color={BLACK}
              weight={POPPINS_MEDIUM}
              type={FORTEEN}>
              All Rounders
            </AppText>
            <LinearGradient
              style={{ width: '100%', height: 2, marginBottom: 10 }}
              colors={[colors.white, colors.blue]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.0, 1.0]}
            />
            {all_rounder_list &&
              all_rounder_list?.map(item => {
                return renderPlayer(item);
              })}
            <AppText
              style={{ opacity: 0.4, marginTop: 10 }}
              color={BLACK}
              weight={POPPINS_MEDIUM}
              type={FORTEEN}>
              Bowlers
            </AppText>
            <LinearGradient
              style={{ width: '100%', height: 2, marginBottom: 10 }}
              colors={[colors.white, colors.blue]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0.0, 1.0]}
            />
            {bowlers_list &&
              bowlers_list?.map(item => {
                return renderPlayer(item);
              })}
          </ScrollView>
        }
        <View style={styles.buttonContainer}>
          <SecondaryButton
            onPress={onPreview}
            buttonStyle={[styles.buttonStyle, {
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.brownYellow

            }]}
            title={'TEAM PREVIEW'}
            titleStyle={{ color: colors.black, marginTop: -5 }}
            btnStyle={{
              backgroundColor: NewColor.linerWhite,
              borderWidth: 2,
              height: 45,
              borderRadius: 10,
            }}
          />
          <PrimaryButton
            buttonStyle={styles.buttonStyle}
            onPress={saveTeam}
            title="SAVE TEAM"
          />
        </View>
      </CommonImageBackground>
      <SpinnerSecond loading={isLoadingTwo ? true : isLoading || RemaningPlayer?.length ? false : true} />
    </AppSafeAreaView>
  )
}
export default SelectSubstitute