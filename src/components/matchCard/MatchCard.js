import React, {useEffect, useState, useRef, useCallback, memo} from 'react';
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

const TeamLogo = memo(({ uri, style, resizeMode }) => (
  <FastImage
    source={{ uri }}
    style={style}
    resizeMode={resizeMode}
    priority={FastImage.priority.high}
  />
));

// Memoized team name component
const TeamName = memo(({ name, weight, type, color, style, numberOfLines }) => (
  <AppText
    weight={weight}
    type={type}
    numberOfLines={numberOfLines}
    color={color}
    style={style}>
    {name}
  </AppText>
));

const ActionButton = memo(({ matchType, onPress }) => (
  <PrimaryButton
    buttonStyle={{height: 45, width: '100%'}}
    onPress={onPress}
    title={matchType === 'teams' ? 'VIEW CONTESTS' : 'VIEW SCOREBOARD'}
  />
));

const areEqual = (prevProps, nextProps) => {

  return (
    prevProps.details?._id === nextProps.details?._id &&
    prevProps.details?.Status === nextProps.details?.Status &&
    prevProps.details?.SeriesName === nextProps.details?.SeriesName &&
    prevProps.details?.TeamA === nextProps.details?.TeamA &&
    prevProps.details?.TeamB === nextProps.details?.TeamB &&
    prevProps.details?.TeamAlogo === nextProps.details?.TeamAlogo &&
    prevProps.details?.TeamBlogo === nextProps.details?.TeamBlogo &&
    prevProps.details?.StartDateTime === nextProps.details?.StartDateTime &&
    prevProps.details?.line_up_out === nextProps.details?.line_up_out &&
    prevProps.matchType === nextProps.matchType &&
    prevProps.isFromMyMatch === nextProps.isFromMyMatch &&
    prevProps.isHome === nextProps.isHome &&
    JSON.stringify(prevProps.details?.teams) === JSON.stringify(nextProps.details?.teams) &&
    JSON.stringify(prevProps.details?.contest_details) === JSON.stringify(nextProps.details?.contest_details)
  );
};

const MatchCard = ({
  details,
  isFromMyMatch = false,
  tab = null,
  isHome,
  myMatches,
  completedmatch = true,
  matchType = 'teams',
  onPressScoreboard,
}) => {
  const dispatch = useDispatch();
  const sheet = useRef();
  const isMatchToday = moment().isSame(details?.StartDateTime, 'day');
  const [contestDetails, setContestDetails] = useState(null);
  const [removeTabs, setRemoveTabs] = useState(false);
  
  const dateTime = React.useMemo(() => {
    if (!details?.StartDateTime) return '';
  const dateObj = new Date(details?.StartDateTime);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
    return formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + meridiem;
  }, [details?.StartDateTime]);

  const allContests = React.useMemo(() => {
    // For teams matches, use teams data
    if (matchType === 'teams') {
      return details?.teams || details?.contest_details || [];
    }
    // For scoreboard matches, use scorecard data
    else if (matchType === 'scoreboard') {
      return details?.scorecard || details?.contest_details || [];
    }
    // Default fallback
    return details?.teams || details?.contest_details || [];
  }, [details?.teams, details?.contest_details, details?.scorecard, matchType]);

  useEffect(() => {
    
    if (allContests.length > 0) {
      const contest = allContests.reduce((prev, current) => {
        // Try to get winning amount first, then fallback to entry fee
        const prevAmount = Number(prev?.winning_amount || prev?.WinningAmount || prev?.EntryFee || 0);
        const currentAmount = Number(current?.winning_amount || current?.WinningAmount || current?.EntryFee || 0);
        return currentAmount > prevAmount ? current : prev;
      });
      
      setContestDetails(contest);
    } else {
    }
  }, [allContests]);

  const onNavigateContest = useCallback(() => {
   

    if (details?.Status === 'Completed') {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      NavigationService.navigate(MY_CONTEST, {
        isFromMyMatch: true,
        matchType,
        matchId: details._id,
      });
    } else if (matchType === 'scoreboard') {
      if (onPressScoreboard) {
        return onPressScoreboard();
      }
      
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      // Find the first joined scorecard contest to get the contest category ID
      const joinedScorecard = details?.scorecard?.find(scorecard => scorecard.joined > 0);
      const contestCategoryId = joinedScorecard?.contest_category_id || 
                               details?.scorecard?.[0]?.contest_category_id ||
                               details?.contest_details?.[0]?.contest_category_id ||
                               "65ddb68ce2ddb20749839785"; // Default contest category ID
      
      console.log('🎯 MatchCard: Navigating to scoreboard with details:', {
        matchId: details._id,
        contestCategoryId,
        hasScorecard: !!details?.scorecard,
        scorecardLength: details?.scorecard?.length,
        joinedScorecards: details?.scorecard?.filter(s => s.joined > 0).length
      });
      
      NavigationService.navigate(SCOREBOARD_MATCH, {
        matchDetails: details,
        matchType: 'scoreboard',
        details: {
          contest_category_id: contestCategoryId
        }
      });
    } else if (!allContests || allContests.length === 0) {
      return toastAlert.showToastError('There Are No Contest For This Match');
    } else {
      dispatch(setContestData({...details, isFromMyMatch, tab, isHome}));
      dispatch(getContestList({}, details._id));
      NavigationService.navigate(MY_CONTEST, {
        isFromMyMatch: isFromMyMatch, 
        matchType,
        matchId: details._id,
      });
      dispatch(setSortByFilter([]));
    }
  }, [details, isFromMyMatch, tab, isHome, matchType, dispatch, allContests, onPressScoreboard]);

  const TeamSection = React.useMemo(() => (
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
          <TeamName
            name={details?.TeamA && nameSlice(details?.TeamA)}
                weight={POPPINS_BOLD}
                type={TEN}
                numberOfLines={1}
            color={WHITE}
          />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TeamLogo
              uri={details?.TeamAlogo}
                  style={styles.teamImage}
                  resizeMode="contain"
                />
            <TeamName
              name={details?.TeamsShortNames == null ? '' : details?.TeamsShortNames[0]}
              style={{ marginLeft: 5 }}
                  type={TEN}
                  weight={POPPINS_MEDIUM}
              color={WHITE}
            />
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
        <AppText color={WHITE}>{dateTime}</AppText>
          </View>

          <View
            style={{
              width: '33.33%',
              justifyContent: 'flex-end',
            }}>
            <View style={{width: '100%', alignItems: 'flex-end'}}>
          <TeamName
            name={details?.TeamB && nameSlice(details?.TeamB)}
            type={TEN}
            color={WHITE}
            weight={POPPINS_BOLD}
          />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
          <TeamName
            name={details?.TeamsShortNames == null ? '' : details?.TeamsShortNames[1]}
            style={{ marginRight: 5 }}
                type={TEN}
                weight={POPPINS_MEDIUM}
            color={WHITE}
          />
          <TeamLogo
            uri={details?.TeamBlogo}
                style={styles.teamImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
  ), [details?.line_up_out, details?.TeamA, details?.TeamAlogo, details?.TeamB, details?.TeamBlogo, details?.TeamsShortNames, dateTime]);

  const ContestDetailsSection = React.useMemo(() => {
    
    if (allContests.length === 0) return null;
    
    return (
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
                  {(contestDetails?.contest_type || contestDetails?.categoryName || contestDetails?.ContestType) && (
                    <LinearGradient
                      start={{x: 0, y: 0.5}}
                      end={{x: 0.5, y: 0}}
                      colors={['#3EAA35', '#3EAA3500']}
                      style={styles.contestName}>
                      <AppText
                        color={GREEN}
                        style={{fontSize: 11, marginTop: 1}}
                        weight={POPPINS_MEDIUM}>
                        {contestDetails?.contest_type || contestDetails?.categoryName || contestDetails?.ContestType}
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
                        {contestDetails?.winning_amount || contestDetails?.WinningAmount || contestDetails?.EntryFee || '0'}
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
          <ActionButton matchType={matchType} onPress={onNavigateContest} />
          </View>
        </>
    );
  }, [allContests.length, myMatches, details?.countTeam, details?.countContest, contestDetails, matchType, onNavigateContest]);

  const SeriesHeader = React.useMemo(() => (
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
  ), [details?.SeriesName, details?.line_up_out]);

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={onNavigateContest}>
      <View style={styles.matchImage}>
        {SeriesHeader}
        {TeamSection}
      </View>

      {/* Contest Details Section */}
      {ContestDetailsSection}
    </Pressable>
  );
};

export default memo(MatchCard, areEqual);
