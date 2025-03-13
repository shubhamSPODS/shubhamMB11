import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {StatusBar} from 'native-base';
import {useSelector} from 'react-redux';
import {
  AppText,
  BLACK,
  LIGHTBLUE,
  LIGHTPINK,
  POPPINS_MEDIUM,
  THIRTEEN,
  WHITE,
} from '../../common/AppText';
import {NewColor, colors} from '../../theme/color';
import {universalPaddingHorizontal} from '../../theme/dimens';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Winnings from '../../components/winnings/Winnings';
import LeaderBoardList from '../../components/leaderBoardList/LeaderBoardList';
import CommonImageBackground from '../../common/commonImageBackground';
import {TouchableOpacityView} from '../../common/TouchableOpacityView';
import {arrow} from '../../helper/image';
import NavigationService from '../../navigation/NavigationService';

const ContestLeaderbord = () => {
  const contestData = useSelector((state: any) => state?.match?.contestData);
  const [activeTab, setActiveTab] = useState('1');
  const data = [
    {
      id: '1',
      title: 'Winnings',
    },
    {
      id: '2',
      title: 'Leaderboard',
    },
  ];
  const renderMain = () => {
    return activeTab == '1' ? (
      <Winnings id={'641c45c16d915edef212b556'} />
    ) : (
      <LeaderBoardList
        matchId={contestData?.MatchId}
        id={'641c45c16d915edef212b556'}
      />
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
        <View style={styles.headerContainer}>
          <TouchableOpacityView onPress={() => NavigationService.goBack()}>
            <FastImage
              style={styles.arrowIcon}
              resizeMode="contain"
              source={arrow}
              tintColor={colors.black}
            />
          </TouchableOpacityView>
          <View style={styles.teamNameView}>
            <FastImage
              style={[styles.teamAIcon, {marginRight: 5}]}
              resizeMode="contain"
              source={{uri: contestData?.TeamAlogo}}
            />
            <AppText>
              {`${contestData?.TeamsShortNames[0]} vs ${contestData.TeamsShortNames[1]}`}
            </AppText>
            <FastImage
              style={[styles.teamAIcon, {marginLeft: 5}]}
              resizeMode="contain"
              source={{uri: contestData?.TeamBlogo}}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginTop: 20,
          }}>
          <View style={styles.scoreContainer}>
            <View
              style={{
                flex: 1,
              }}>
              <AppText weight={POPPINS_MEDIUM}>
                {contestData?.TeamsShortNames[0]}
              </AppText>
              <AppText weight={POPPINS_MEDIUM}>
                {contestData?.teamAScore}
              </AppText>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={
                  contestData?.Status == 'Live'
                    ? styles.statusView2
                    : styles.statusView
                }>
                {contestData?.Status == 'Live' ? (
                  <></>
                ) : (
                  <FastImage
                    style={styles.rightGreenIcon}
                    source={require('../../../assets/images/rightWhiteIcon.png')}
                    resizeMode="contain"
                  />
                )}
                <AppText 
                color={WHITE}
                numberOfLines={1} weight={POPPINS_MEDIUM}>
                  {contestData?.Status}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <AppText weight={POPPINS_MEDIUM}>
                {contestData?.TeamsShortNames[1]}
              </AppText>
              <AppText weight={POPPINS_MEDIUM}>
                {contestData?.teamBScore}
              </AppText>
            </View>
          </View>
          <AppText weight={POPPINS_MEDIUM} style={styles.winStatus}>
            {contestData?.MatchStatus}
          </AppText>
          <View style={styles.singleLine} />
        </View>
        <View style={{paddingHorizontal: universalPaddingHorizontal}}>
          <View style={styles.container}>
            {data?.map(item => {
              return item.id == activeTab ? (
                <View style={styles.tabs}>
                  <AppText
                    type={THIRTEEN}
                    weight={POPPINS_MEDIUM}
                    color={LIGHTBLUE}>
                    {item.title}
                  </AppText>
                  <LinearGradient
                    style={{height: 2, width: 102}}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[colors.borderBackColor, colors.borderPick]}
                  />
                </View>
              ) : (
                <TouchableOpacityView
                  style={styles.tabs}
                  onPress={() => setActiveTab(item.id)}>
                  <AppText type={THIRTEEN} weight={POPPINS_MEDIUM}>
                    {item?.title}
                  </AppText>
                </TouchableOpacityView>
              );
            })}
          </View>
        </View>
        {renderMain()}
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};
const styles = StyleSheet.create({
  singleLine: {
    height: 1,
    backgroundColor: NewColor.linerLightBlueTwinty,
    marginVertical: 10,
  },
  arrowIcon: {
    height: 20,
    width: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  statusView: {
    height: 31,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    borderRadius: 5,
    flexDirection: 'row',
  },
  statusView2: {
    height: 31,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.red,
    borderRadius: 5,
    flexDirection: 'row',
  },
  rightGreenIcon: {
    height: 13,
    width: 13,
    marginRight: 5,
    marginBottom: 2,
  },
  container: {
    height: 42,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabs: {
    flexDirection: 'column',
    width: '50%',
    height: 38,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    fontSize: 14,
    color: 'white',
  },
  winStatus: {
    textAlign: 'center',
    marginTop: '4%',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: '13%',
    paddingHorizontal: universalPaddingHorizontal,
    alignItems: 'center',
  },
  teamNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  teamAIcon: {
    height: 50,
    width: 50,
  },
});
export default ContestLeaderbord;
