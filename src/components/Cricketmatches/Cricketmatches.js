
import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text, Pressable, Alert,StyleSheet,Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LINEAR_GRADIENT, SHAPE, MI, SRH, LIVE} from '../../helper/image';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {
  AppText,
  EIGHT,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  TEN,
} from '../../common/AppText';
import NavigationService from '../../navigation/NavigationService';
import {Single_Ipl_Card} from '../../navigation/routes';
import {Toast} from 'native-base';
import {toastAlert} from '../../helper/utility';

const Cricketmatches = ({details, isFromMyMatch = false, tab = null}) => {
  let isMatchToday = moment().isSame(details?.StartDateTime, 'day');
  const [contestDetails, setContestDetails] = useState(null);
  const getDate = () => {
    let a = moment();
    let b = moment(details?.StartDateTime);
    const duration = moment.duration(b.diff(a));
    const diffInHours = Math.floor(duration.asHours());
    const diffInDays = Math.floor(duration.asDays());
    const diffInMin = duration.minutes();
    if (diffInHours > 24) {
      return `${diffInDays}d`;
    } else {
      return `${diffInHours}h ${diffInMin}m`;
    }
  };

  useEffect(() => {
    const contest = details?.contest_details[0]?.data?.reduce(
      (prev, current) => {
        // Changed the > to a <
        return prev.winning_amount < current.winning_amount ? prev : current;
      },
    );

    setContestDetails(contest);
  }, []);
  const onNavigateContest = () => {
    if (details?.contest_details?.length == 0) {
      return toastAlert.showToastError('There Are No Contest For This Match');
    }
    NavigationService.navigate(Single_Ipl_Card, {...details, isFromMyMatch, tab});
  };

  return (
    <Pressable style={styles.cardContainer} onPress={onNavigateContest}>
      {/* <View  style={styles.matchImage}>
        {/*<FastImage source={SHAPE} style={styles.shape} />**/}
        {/* <Text
          style={{
            position: 'absolute',
           paddingHorizontal:15,
            color: 'white',
            fontSize: 12,
            top: 5,
          }}>
          {details?.SeriesName}
        </Text>
        <LinearGradient
                style={{
                  height:1,
                  width:"95%",
                  alignSelf:"center",
                  top:30
                }}
                start={{x: 1, y: 0}}
                end={{x: 0, y:1}}
                colors={['#4F7ABA','#E18FFF']}>
                  </LinearGradient>
        <View style={styles.teamContainer}>
          <View style={{alignItems: 'center'}}>
            <Text numberOfLines={2} style={styles.teamName}>
              {details?.TeamA}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FastImage
                source={{uri: details?.TeamAlogo}}
                style={styles.teamImage}
                resizeMode="contain"
              />
              <AppText
                style={[
                  styles.teamShortName,
                  {
                    marginLeft: 5,
                  },
                ]}
                weight={POPPINS_BOLD}>
                {details?.TeamsShortNames[0]}
              </AppText>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.live}>{getDate()}</Text>
            {isMatchToday && <Text style={styles.today}>Today</Text>}
          </View>

          <View style={{alignItems: 'center'}}>
            <Text style={styles.teamName}>{details?.TeamB}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppText
                style={[
                  styles.teamShortName,
                  {
                    marginRight: 5,
                  },
                ]}
                weight={POPPINS_BOLD}>
                {details?.TeamsShortNames[1]}
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
      <View style={styles.bottom}>
        {contestDetails?.contest_type && (
          <View style={styles.contestName}>
            <AppText
              style={{color: 'rgba(21, 206, 49, 1)', fontSize: 9}}
              weight={POPPINS_MEDIUM}>
              {contestDetails?.contest_type}
            </AppText>
          </View>
        )}
        <Text
          style={[
            styles.textStyle,
            {
              flex: 1,
              paddingLeft: 5,
              fontWeight: '700',
            },
          ]}>
          {contestDetails?.winning_amount}
        </Text>
        {details?.contest_details[0]?.lineup_out && (
          <View style={styles.lineUpOut}>
            <View style={styles.greenCircle}></View>
            <Text style={styles.lineUpOutText}>LINEUP OUT</Text>
          </View>
        )}
      </View> */} 
        
        <LinearGradient
                style={{
                  height: 140,
                  padding: 10,
                  justifyContent: 'center',
                  borderRadius: 16,
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: 190,
                }}
                start={{x: 0.8, y: 0}}
                end={{x: 0, y: 0}}
                colors={[
                  'rgba(0, 138, 117, 1)',
                  'rgba(6, 24, 40, 1)',
                  'rgba(7, 22, 39, 1)',
                  '  rgba(3, 70, 148, 1)',
                ]}>
        
                <View style={{width: '100%'}}>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 1)',
                      fontSize: 10,
                      fontWeight: '700',
                      textAlign: 'center',
                      fontFamily: 'POPPINS',
                    }}>
                   {details?.SeriesName}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      top: 10,
                    }}>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: 10,
                        fontWeight: '500',
                        textAlign: 'center',
                        fontFamily: 'POPPINS',
                      }}>
                      {details?.TeamA}
                    </Text>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize:10,
                        fontWeight: '500',
                        textAlign: 'center',
                        fontFamily: 'POPPINS',
                      }}>
                   {details?.TeamB}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      top: 15,
                    }}>
                        
                    <Image
                      style={{
                        width: 53,
                        height: 48,
                        resizeMode: 'contain',
                      }}
                      source={{uri: details?.TeamAlogo}}
                    />
                     
                    <Text
                      style={{
                        color: 'rgba(21, 206, 49, 1)',
                        fontWeight: '500',
                        fontSize: 10,
                      }}>
                      Live
                    </Text>
                    <Image
                      style={{
                        width: 53,
                        height: 48,
                        resizeMode: 'contain',
                      }}
                      source={{uri: details?.TeamBlogo}}
                    />
                  </View>
                  <View
                    style={{
                      height: 22,
                      justifyContent: 'space-around',
                      backgroundColor: '#1F2A2C',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 190,
                      top: 30,
                      right: 10,
                      borderBottomRightRadius: 16,
                      borderBottomLeftRadius: 16,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 9,
                        fontWeight: '500',
                        fontFamily: 'POPPINS',
                        right: 10,
                      }}>
                      2 Team
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 9,
                        fontWeight: '500',
                        fontFamily: 'POPPINS',
                        left: 15,
                      }}>
                      3 Contests
                    </Text>
                  </View>
                </View>
        
              </LinearGradient>
           
    </Pressable>
  );
};

  
export default Cricketmatches;

