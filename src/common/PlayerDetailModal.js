import React, { useEffect, useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { SpinnerSecond } from './SpinnerSecond';
import { ImageBackground, StyleSheet, View, FlatList } from 'react-native';
import {
  PANT,
  closeIcon,
  ProfileBackgroundImageTwo,
  wicket_keeperIcon,
  bowlerIcon,
  batsmanIcon,
  all_rounderIcon,
  profileCard,
} from '../helper/image';
import { TouchableOpacityView } from './TouchableOpacityView';
import FastImage from "@d11/react-native-fast-image";
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  EIGHTEEN,
  FORTEEN,
  POPPINS,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  TEN,
  WHITE,
} from './AppText';
import { poppinsBoldItalic } from '../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from './primaryButton';
import { LIGHTPINK } from './AppText';
import { NewColor, colors } from '../theme/color';
import { flexOne } from '../theme/dimens';
import { IMAGE_BASE_URL } from '../helper/utility';
class DataConverter {
  constructor(data) {
    this.data = data;
  }

  convertToCustomFormat() {
    const dataArray = Object.entries(this.data).map(([category, dataObj]) => ({
      id: category, // Include the category ID
      data: dataObj, // Include the data
    }));
    return dataArray;
  }
}
function removeArrayBracket(dataArray) {
  if (Array.isArray(dataArray) && dataArray.length > 0) {
    return dataArray[0];
  }
  return null; // Return null if the input is not an array or is empty
}
const PlayerDetailModal = ({
  isVisible,
  setIsVisible,
  selectedPlayers,
  removePlayerFromTeam,
  addPlayerInTeam,
  onPress,
  playerimg,
  logo,
  saveTeam
}) => {
  const isLoading = useSelector(state => {
    return state.auth.isLoading;
  });
  const playerDetail = useSelector(state => {
    return state.match.playerDetail;
  });
  const [evnetsData, setEventsData] = useState([])
  const [random, setRandom] = useState(0)
  const contestData = useSelector(state => state?.match?.contestData);
  useEffect(() => {
    if (playerimg == 'bowl') {
      const dataConverter = playerDetail?.statics?.bowling && new DataConverter(playerDetail?.statics?.bowling);
      const customFormatData = dataConverter && dataConverter?.convertToCustomFormat();
      const originalString = contestData?.Type
      const lowercaseString = originalString && originalString.toLowerCase();
      const filterEvents = customFormatData?.filter((e) => {
        return e?.id === lowercaseString
      })
      const removedArray = filterEvents && removeArrayBracket(filterEvents);
      setEventsData(removedArray)
      setRandom(Math.random())
    } else {
      const dataConverter = playerDetail?.statics?.batting && new DataConverter(playerDetail?.statics?.batting);
      const customFormatData = dataConverter && dataConverter?.convertToCustomFormat();
      const originalString = contestData?.Type
      const lowercaseString = originalString && originalString.toLowerCase();
      const filterEvents = customFormatData?.filter((e) => {
        return e?.id === lowercaseString
      })
      const removedArray = filterEvents && removeArrayBracket(filterEvents);
      setEventsData(removedArray)
      setRandom(Math.random())
    }
  }, [playerDetail])
  const playerRole = role => {
    if (role === 'wk') return 'WICKET KEEPER';
    if (role === 'bowl') return 'BOWLER';
    if (role === 'bat') return 'BATSMAN';
    if (role === 'all') return 'ALL ROUNDER';
  };

  const getIcon = () => {
    if (playerimg == 'wk') {
      return wicket_keeperIcon;
    } else if (playerimg == 'bowl') {
      return bowlerIcon;
    } else if (playerimg == 'bat') {
      return batsmanIcon;
    } else if (playerimg == 'all') {
      return all_rounderIcon;
    }
  };
  const renderItem = ({ item }) => {
    return (
      <LinearGradient
        colors={[
          colors.playerDetailsLinerOne,
          colors.playerDetailsLinerTwo,
          colors.playerDetailsLinerThree,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.renderContainer}>
        <AppText color={BLACK} type={TEN} style={styles.textDate}>
          {item.date}
        </AppText>
        <View style={styles.singleLine} />
        <View style={styles.aboutPlayerView}>
          <View style={{ flex: 0.5 }}>
            <AppText
              style={{
                opacity: 0.5,
              }}>
              vs.
            </AppText>
            <AppText>{item.team}</AppText>
          </View>
          <View style={styles.titleView}>
            <View>
              <AppText style={styles.titleText}>SEL BY</AppText>
              <AppText>{item.selby}%</AppText>
            </View>
            <View>
              <AppText style={styles.titleText}>POINTS</AppText>
              <AppText>{item.point}</AppText>
            </View>
            <View>
              <AppText style={styles.titleText}>CREDIT</AppText>
              <AppText>{item.credit}</AppText>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={{ margin: 0 }}
      onBackButtonPress={setIsVisible}
      onBackdropPress={setIsVisible}
      animationIn={'bounceInUp'}
      animationOut={'bounceOutDown'}>
      <View style={{
        backgroundColor: NewColor.linerWhite,
        flex: flexOne,
      }}>
        <ImageBackground
          resizeMode={'cover'}
          source={ProfileBackgroundImageTwo}
          style={styles.top}>
          <View style={styles.topContainer}>
            <TouchableOpacityView
              style={styles.closeContainer}
              onPress={setIsVisible}>
              <FastImage
                tintColor={'white'}
                resizeMode="contain"
                source={closeIcon}
                style={styles.leftArrow}
              />
            </TouchableOpacityView>
            <AppText
              style={{
                marginTop: 2,
                marginLeft: 15,
              }}
              color={WHITE}
              type={FORTEEN}>
              Player Info
            </AppText>
          </View>
          <View style={styles.card}>
            <View style={styles.playerIconContainer}>
              <FastImage
                source={playerDetail?.profile?.player?.profile_image
                  ? {
                    uri: playerDetail?.profile?.player?.profile_image,
                  }
                  : getIcon()}
                style={styles.playerIcon}
                resizeMode="cover"
              />
            </View>
            <View style={styles.nameContainer}>
              <AppText color={WHITE} type={SIXTEEN} weight={POPPINS_SEMI_BOLD}>
                {playerDetail?.profile?.player?.short_name}
              </AppText>
              <AppText color={LIGHTPINK}>
                {saveTeam?.teamName} |
                <AppText color={WHITE}>
                  {playerRole(playerDetail?.profile?.player?.playing_role)}
                </AppText>
              </AppText>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }} >
              <AppText color={WHITE}>CREDITS</AppText>
              <AppText color={WHITE} type={SIXTEEN}>
                {playerDetail?.profile?.player?.fantasy_player_rating}
              </AppText>
            </View>
          </View>
          {evnetsData ?
            <View
              style={{
                // height: 178,
                width: '95%',
                borderRadius: 8,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#3F8BEE',
                top: 50

              }}>
              <View
                style={{
                  height: 30,
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                }}>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 14,
                    fontWeight: '500',
                    opacity: 0.5,
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  Events
                </AppText>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 14,
                    fontWeight: '500',
                    opacity: 0.5,
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {evnetsData?.id?.toUpperCase()}
                </AppText>
              </View>
              <View
                style={{
                  height: 35,
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#F1F1F1',
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? 'Wickets' : 'Played'}
                </AppText>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? evnetsData?.data?.wickets ? evnetsData?.data?.wickets : 0 : evnetsData?.data?.matches}
                </AppText>
              </View>
              <View
                style={{
                  height: 35,
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? 'Innings' : 'Runs'}
                </AppText>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? evnetsData?.data?.innings ? evnetsData?.data?.innings : 0 : evnetsData?.data?.runs}
                </AppText>
              </View>
              <View
                style={{
                  height: 35,
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#F1F1F1',
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? 'Econ' : 'Avg'}
                </AppText>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? evnetsData?.data?.econ ? evnetsData?.data?.econ : 0 : evnetsData?.data?.average}
                </AppText>
              </View>
              <View
                style={{
                  height: 35,
                  width: '99%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  alignSelf: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8
                }}>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? 'Best Inning' : 'SR'}

                </AppText>
                <AppText
                  style={{
                    color: 'black',
                    fontsize: 12,
                    fontWeight: '800',
                  }}
                  weight={POPPINS_SEMI_BOLD}>
                  {playerimg == 'bowl' ? evnetsData?.data?.bestinning ? evnetsData?.data?.bestinning : 0 : evnetsData?.data?.strike}
                </AppText>
              </View>
            </View> :
            <AppText style={{ top: '100%', textAlign: 'center' }}
              color={BLACKOPACITY}
              type={SIXTEEN} weight={POPPINS_SEMI_BOLD} >
              No Record Found in {contestData?.Type}
            </AppText>
          }
        </ImageBackground>
      </View>
      <SpinnerSecond loading={isLoading} />
    </ReactNativeModal>
  );
};

export default PlayerDetailModal;
const styles = StyleSheet.create({
  top: {
    height: 200,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
  },
  leftArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  closeContainer: {
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: ' rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  playerIconContainer: {
    height: 98,
    width: 98,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#ffffff20',
  },
  playerIcon: {
    height: 88,
    width: 88,
  },
  nameContainer: {
    alignSelf: 'center',
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
  },
  editButton: {
    alignSelf: 'center',
    marginTop: 10,
    height: 45,
  },
  editButtonTitle: {
    fontSize: 14,
    fontFamily: poppinsBoldItalic,
    // fontStyle: 'italic',
  },
  renderContainer: {
    borderRadius: 16,
  },
  textDate: {
    marginLeft: 15,
    paddingVertical: 10,
  },
  singleLine: {
    height: 0.5,
    backgroundColor: NewColor.linerBlacklight,
  },
  aboutPlayerView: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  titleView: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flex: 1,
  },
  titleText: {
    fontSize: 10,
    opacity: 0.5,
  },
});
