import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable } from 'react-native';
import styles from './styles';
import { notified } from '../../helper/image';
import FastImage from 'react-native-fast-image';
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
  RED,
  SEMI_BOLD,
  TEN,
} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import { MY_CONTEST } from '../../navigation/routes';
import { nameSlice, toastAlert } from '../../helper/utility';
import { setContestData, setSortByFilter } from '../../slices/matchSlice';
import { useDispatch } from 'react-redux';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import RBSheet from 'react-native-raw-bottom-sheet';
import MatchRemainder from './matchRemainder/MatchRemainder';
import { colors } from '../../theme/color';
import { flexOne } from '../../theme/dimens';
import { LiveTime } from '../../common/LiveTime';
import LinearGradient from 'react-native-linear-gradient';

const MatchCardContest = ({
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
  const [removeTabs, setRemoveTabs] = useState(false)
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
  useEffect(() => {
    const contest = details?.contest_details[0]?.data?.reduce(
      (prev, current) => {
        return prev.winning_amount < current.winning_amount ? prev : current;
      },
    );
    setContestDetails(contest);
  }, []);
  const onNavigateContest = () => {
    if (details?.Status === 'Cancelled') {
      return toastAlert.showToastError('This match has been cancelled');
    } else if (details?.Status === 'Completed') {
      dispatch(setContestData({ ...details, isFromMyMatch, tab, isHome }));
      NavigationService.navigate(MY_CONTEST, { isFromMyMatch: true, tab });
    } else if (details?.contest_details?.length == 0) {
      return toastAlert.showToastError('There Are No Contest For This Match');
    } else {
      dispatch(setContestData({ ...details, isFromMyMatch, tab, isHome }));
      NavigationService.navigate(MY_CONTEST, { isFromMyMatch: tab == 'Live' ? true : false, tab });
      dispatch(setSortByFilter([]))
    }
  };
  return (
    <Pressable
      style={
        contestDetails
          ? styles.cardContainer
          : styles.cardContainerTwo
      }
      onPress={onNavigateContest}>
      <View style={styles.matchImage}>
        <View style={styles.seriesNametext} >
          <AppText
            numberOfLines={1}
            weight={POPPINS_SEMI_BOLD}
            style={{ bottom: 22 }} >{details?.SeriesName}</AppText>

        </View>
        {details?.Status === 'Completed' || details?.Status === 'Cancelled' || details?.Status === 'Live' ? <></> :
          <TouchableOpacityView
            onPress={() => sheet.current?.open()}
            activeOpacity={0.8}>
            <FastImage
              style={styles.notifiedIcon}
              tintColor={colors.borderBackColor}
              resizeMode="contain"
              source={notified}
            />
          </TouchableOpacityView>
        }
        <View style={styles.teamContainer}>
          <View
            style={{ flex: flexOne, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AppText weight={POPPINS_BOLD} type={TEN} numberOfLines={1}>
                {details?.TeamA && nameSlice(details?.TeamA)}
              </AppText>
              <FastImage
                source={{ uri: details?.TeamAlogo }}
                style={styles.teamImage}
                resizeMode="contain"
              />
            </View>
            <AppText
              style={{
                marginLeft: 5,
                marginTop: 20,
              }}
              weight={POPPINS_MEDIUM}>
              {details?.TeamsShortNames[0]}
            </AppText>
          </View>
          <View style={styles.timeContainer}>
            {details?.Status === 'Completed' || details?.Status === 'Cancelled' ? (
              <>
                <View
                  style={[
                    styles.completeView,
                    { marginTop: myMatches ? 15 : 25 },
                  ]}>
                  <View style={styles.dotView} />
                  <AppText
                    style={{ marginTop: 2 }}
                    weight={POPPINS_MEDIUM}
                    type={TEN}
                    color={GREEN}>
                    {details?.Status}
                  </AppText>
                </View>
                <AppText
                  style={{
                    flex: flexOne,
                  }}
                  numberOfLines={1}
                  type={TEN}
                  weight={POPPINS_MEDIUM}>
                  {moment(details?.StartDateTime).format('MMMM Do, h:mm a')}
                </AppText>
              </>
            ) : (
              <>
                <View
                  style={{
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderColor: colors.lightRed,
                    borderWidth: 1,
                    paddingVertical: 2

                  }}>
                  {tab == "Live" ?
                    <AppText type={TEN} color={RED} weight={POPPINS_SEMI_BOLD} >
                      Live
                    </AppText> :
                    <LiveTime
                      type={ELEVEN}
                      top={true}
                      details={details}
                      setRemoveTabs={setRemoveTabs}
                    />
                  }
                </View>
                <AppText
                  type={TEN}
                  weight={POPPINS_MEDIUM}
                  style={[
                    {
                      color: colors.gray,
                      marginTop: 2,
                    },
                  ]}>
                  {formattedTime}
                </AppText>
              </>
            )}
          </View>
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <View
              style={{
                flex: flexOne,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AppText
                style={{
                  marginRight: 5,
                  marginTop: 20,
                }}
                numberOfLines={1}
                weight={POPPINS_MEDIUM}
              >
                {details?.TeamsShortNames[1]}
              </AppText>
              {/* <View style={styles.teamShortNameTextTwo}> */}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <AppText
                  style={{
                    marginRight: 5,
                  }}
                  weight={POPPINS_BOLD}>
                  {details?.TeamB && nameSlice(details?.TeamB)}
                </AppText>
                <FastImage
                  source={{ uri: details?.TeamBlogo }}
                  style={styles.teamImage}
                  resizeMode="contain"
                />
              </View>
              {/* </View> */}
            </View>
          </View>
        </View>
      </View>
      {
        myMatches !== undefined ? (
          <View style={[styles.bottom, { height: 35, }]}>
            <View style={styles.teamConunt}>
              <View style={styles.teamConunt}>
                <AppText weight={POPPINS_MEDIUM}>{details?.countTeam} </AppText>
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
            <View style={styles.bottom}>

              {contestDetails?.contest_type && (
                <LinearGradient
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#5F338B15', '#5F338B05']}
                  style={styles.contestName}>
                  <AppText
                    style={{ color: '#5F338B', fontSize: 11, marginTop: 2 }}
                    weight={POPPINS_MEDIUM}>
                    {contestDetails?.contest_type}
                  </AppText>
                  <AppText
                    weight={LATO_SEMI_BOLD}
                    type={ELEVEN}
                    style={[
                      styles.textStyle,
                      { marginTop: -1, marginLeft: 5 },
                    ]}>
                    ₹
                  </AppText>
                  <AppText weight={POPPINS_MEDIUM} style={styles.textStyle}>
                    {contestDetails?.winning_amount}
                  </AppText>
                </LinearGradient>
              )}
              {details?.line_up_out && (
                <View style={styles.lineUpOut}>
                  <View style={styles.greenCircle} />
                  <AppText style={{ marginTop: 3 }} color={GREEN} type={TEN}>
                    LINEUP OUT
                  </AppText>
                </View>
              )}
            </View>

          </>
        )
      }
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
    </Pressable >
  );
};

export default MatchCardContest;
