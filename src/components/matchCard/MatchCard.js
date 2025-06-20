import React, {useEffect, useState, useRef} from 'react';
import {View, Pressable} from 'react-native';
import styles from './styles';
import {Newarrow, notified} from '../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import moment from 'moment';
import {
  AppText,
  ELEVEN,
  GREEN,
  LATO_BOLD,
  LATO_SEMI_BOLD,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  TEN,
  WHITE,
} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import {MY_CONTEST} from '../../navigation/routes';
import {nameSlice, toastAlert} from '../../helper/utility';
import {setContestData, setSortByFilter} from '../../slices/matchSlice';
import {useDispatch} from 'react-redux';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import RBSheet from 'react-native-raw-bottom-sheet';
import MatchRemainder from './matchRemainder/MatchRemainder';
import {colors} from '../../theme/color';
import {flexOne} from '../../theme/dimens';
import {LiveTime} from '../../common/LiveTime';
import LinearGradient from 'react-native-linear-gradient';

const MatchCard = ({
  details,
  isFromMyMatch = false,
  tab = null,
  isHome,
  myMatches,
  completedmatch = true,
}) => {
  const dispatch = useDispatch();
  const sheet = useRef();
  let isMatchToday = moment().isSame(details?.StartDateTime, 'day');
  const [contestDetails, setContestDetails] = useState(null);
  const [removeTabs, setRemoveTabs] = useState(false);
  const dateObj = new Date(details?.StartDateTime);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const formattedTime =
    formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + meridiem;
  const currentDate = new Date();
  const inputDate = new Date(details?.StartDateTime);
  const {data} =
    (details?.contest_details && details?.contest_details[0]) ?? '';
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  useEffect(() => {
    const contest = data?.reduce((prev, current) => {
      return Number(prev?.winning_amount) > Number(current?.winning_amount)
        ? prev
        : current;
    });

    setContestDetails(contest);
  }, [data]);
  const onNavigateContest = () => {
    if (details?.Status === 'Completed') {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      NavigationService.navigate(MY_CONTEST, {isFromMyMatch: true});
    } else if (details?.contest_details?.length == 0) {
      return toastAlert.showToastError('There Are No Contest For This Match');
    } else {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      NavigationService.navigate(MY_CONTEST, {isFromMyMatch: false});
      dispatch(setSortByFilter([]));
    }
  };
  // console.log(details, "details");
  return (
    <>
      {details?.contest_details?.data?.length > 0 ? (
        <Pressable
          style={
            contestDetails ? styles.cardContainer : styles.cardContainerTwo
          }
          onPress={onNavigateContest}>
          <View style={styles.matchImage}>
            <View>
              <View style={styles.seriesNametext}>
                <AppText
                  numberOfLines={1}
                  weight={POPPINS_SEMI_BOLD}
                  color={WHITE}
                  style={{bottom: 22}}>
                  {details?.SeriesName}
                </AppText>
              </View>
              {details?.line_up_out && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    marginRight: 10,
                  }}>
                  <View style={styles.greenCircle} />
                  <AppText style={{marginTop: 6}} color={GREEN} type={TEN}>
                    LINEUP OUT
                  </AppText>
                </View>
              )}
            </View>
            <View
              style={[
                styles.teamContainer,
                {marginTop: details?.line_up_out ? 0 : 20},
              ]}>
              <View
                style={{
                  width: '33.33%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View>
                  <AppText
                    weight={POPPINS_BOLD}
                    type={TEN}
                    numberOfLines={1}
                    color={WHITE}>
                    {details?.TeamA && nameSlice(details?.TeamA)}
                  </AppText>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FastImage
                      source={{uri: details?.TeamAlogo}}
                      style={styles.teamImage}
                      resizeMode="contain"
                    />
                    <AppText
                      style={{
                        marginLeft: 5,
                      }}
                      type={TEN}
                      weight={POPPINS_MEDIUM}
                      color={WHITE}>
                      {details?.TeamsShortNames == null
                        ? ''
                        : details?.TeamsShortNames[0]}
                    </AppText>
                  </View>
                </View>
              </View>
              <View style={styles.timeContainer}>
                <View
                  style={{
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    borderWidth: 1,
                    borderColor: colors.lightRed,
                  }}>
                  <LiveTime
                    type={ELEVEN}
                    top={true}
                    details={details}
                    setRemoveTabs={setRemoveTabs}
                  />
                </View>
                <AppText color={WHITE}>{formattedTime}</AppText>
              </View>

              <View
                style={{
                  width: '33.33%',
                  justifyContent: 'flex-end',
                }}>
                <View style={{width: '100%', alignItems: 'flex-end'}}>
                  <AppText type={TEN} color={WHITE} weight={POPPINS_BOLD}>
                    {details?.TeamB && nameSlice(details?.TeamB)}
                  </AppText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <AppText
                    style={{
                      marginRight: 5,
                    }}
                    type={TEN}
                    weight={POPPINS_MEDIUM}
                    color={WHITE}>
                    {details?.TeamsShortNames == null
                      ? ''
                      : details?.TeamsShortNames[1]}
                  </AppText>
                  {
                    // console.log(details,'====111') r
                  }
                  <FastImage
                    source={{uri: details?.TeamBlogo}}
                    style={styles.teamImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>
          {myMatches !== undefined ? (
            <View style={styles.bottom}>
              <View style={styles.teamConunt}>
                <View style={styles.teamConunt}>
                  <AppText weight={POPPINS_MEDIUM}>
                    {details?.countTeam}{' '}
                  </AppText>
                  <AppText weight={POPPINS_MEDIUM}>Team</AppText>
                </View>
                <View
                  style={[
                    styles.teamConunt,
                    {
                      marginLeft: 20,
                    },
                  ]}>
                  <AppText weight={POPPINS_MEDIUM}>
                    {details?.countContest}{' '}
                  </AppText>
                  <AppText weight={POPPINS_MEDIUM}>Contests</AppText>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View
                style={{
                  backgroundColor: '#ffffff09',
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                {contestDetails?.contest_type &&
                contestDetails?.contest_type ? (
                  <LinearGradient
                    start={{x: 0, y: 0.5}}
                    end={{x: 0.5, y: 0}}
                    colors={['#3EAA35', '#3EAA3500']}
                    style={styles.contestName}>
                    <AppText
                      color={GREEN}
                      style={{fontSize: 11, marginTop: 1}}
                      weight={POPPINS_MEDIUM}>
                      {contestDetails?.contest_type}
                    </AppText>
                    <AppText
                      weight={LATO_SEMI_BOLD}
                      type={ELEVEN}
                      color={GREEN}
                      style={[styles.textStyle, {marginLeft: 5}]}>
                      ₹
                    </AppText>
                    <AppText
                      color={GREEN}
                      weight={POPPINS_MEDIUM}
                      style={[styles.textStyle, {marginTop: 1}]}>
                      {contestDetails?.winning_amount}
                    </AppText>
                  </LinearGradient>
                ) : (
                  <View style={{flex: 1}}></View>
                )}

                <View style={styles.lineUpOut}>
                  <FastImage
                    source={Newarrow}
                    resizeMode="contain"
                    style={{
                      height: 43,
                      width: 43,
                    }}
                  />
                </View>
              </View>
            </>
          )}
          <RBSheet
            ref={sheet}
            closeOnDragDown={true}
            height={201}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              draggableIcon: {
                backgroundColor: 'transparent',
                display: 'none',
              },
            }}>
            <MatchRemainder
              data={details}
              onClose={() => sheet?.current?.close()}
            />
          </RBSheet>
        </Pressable>
       ) : (
        <></> 
      )} 
    </>
  );
};

export default MatchCard;
