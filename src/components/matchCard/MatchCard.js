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
import {MY_CONTEST, SCOREBOARD_CREATE, SCOREBOARD_MATCH} from '../../navigation/routes';
import {nameSlice, toastAlert} from '../../helper/utility';
import {setContestData, setSortByFilter, getContestList} from '../../slices/matchSlice';
import {useDispatch} from 'react-redux';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import RBSheet from 'react-native-raw-bottom-sheet';
import MatchRemainder from './matchRemainder/MatchRemainder';
import {colors} from '../../theme/color';
import {flexOne} from '../../theme/dimens';
import {LiveTime} from '../../common/LiveTime';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../common/primaryButton';

const MatchCard = ({
  details,
  isFromMyMatch = false,
  tab = null,
  isHome,
  myMatches,
  completedmatch = true,
  matchType = 'teams',
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
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );

  // Get contests from either teams array or contest_details
  const allContests = details?.teams || details?.contest_details || [];
  console.log('Available contests:', allContests);

  useEffect(() => {
    if (allContests.length > 0) {
      const contest = allContests.reduce((prev, current) => {
        return Number(prev?.winning_amount) > Number(current?.winning_amount)
          ? prev
          : current;
      });
      setContestDetails(contest);
    }
  }, [allContests]);

  const onNavigateContest = () => {
    if (details?.Status === 'Completed') {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      NavigationService.navigate(MY_CONTEST, {
        isFromMyMatch: true,
        matchType,
        matchId: details._id,
      });
    } else if (matchType === 'scoreboard') {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      NavigationService.navigate(SCOREBOARD_MATCH, {
        isFromMyMatch: false,
        matchType,
      });
    } else if (!allContests || allContests.length === 0) {
      return toastAlert.showToastError('There Are No Contest For This Match');
    } else {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      dispatch(getContestList({}, details._id));
      NavigationService.navigate(MY_CONTEST, {
        isFromMyMatch: false,
        matchType,
        matchId: details._id,
      });
      dispatch(setSortByFilter([]));
    }
  };

  return (
    <Pressable
      style={styles.cardContainer}
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
              <FastImage
                source={{uri: details?.TeamBlogo}}
                style={styles.teamImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Contest Details Section */}
      {allContests.length > 0 && (
        <>
          <View style={styles.bottom}>
            {myMatches !== undefined ? (
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
            ) : (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                  {contestDetails?.contest_type && (
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
          </View>
          <View style={{
            backgroundColor: '#ffffff09',
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}>
            <PrimaryButton
              buttonStyle={{height: 45, width: '100%'}}
              onPress={onNavigateContest}
              title={matchType === 'teams' ? 'VIEW CONTESTS' : 'VIEW SCOREBOARD'}
            />
          </View>
        </>
      )}
    </Pressable>
  );
};

export default MatchCard;
