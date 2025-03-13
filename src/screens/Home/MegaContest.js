import {View, Text,StyleSheet} from 'react-native';
import React from 'react';
// import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';
// import MumbaiIndianImg from '../../../assets/images/MumbaiIndian.png';
// import OpponentTeamImg from '../../../assets/images/sunriseHyd.png';
// import {AppSafeAreaView} from '../AppSafeAreaView';
// import HomeTopHeader from '../../HomeTopHeader/HomeTopHeader';
// import {contextBgNew, forwardIcon} from '../../helper/image';
// import SingleCard from '../../common/SingleCard';
import LinearGradient from 'react-native-linear-gradient';
import ContestCommonCard from '../../common/ContestCommonCard/ContestCommonCard';
// import PrimaryButton from '../primaryButton';
// import SecondaryButton from '../secondaryButton';
// import ContestCommonCard from '../ContestCommonCard/ContestCommonCard';
// import PracticeCommonCard from '../practiceContestCommonCard/PracticeContestCard';

// import {AppText} from '../AppText';

// import {ContestCommonCardData} from '../../DummyData';

import {
  personIcon,
  VectorLogo,
  BATTLEINFINITY,
  bellIcon,
  walletIcon,
  BackIcon,
} from '../../helper/image';

const MegaContest = () => {
  return (
    <AppSafeAreaView>
      <View style={styles.wrapperContainer}>
        <View style={styles.backgroundImageContainer}>
          <FastImage
            source={contextBgNew}
            style={styles.bgImage}
            resizeMode="cover">
            <HomeTopHeader
              personIcon={personIcon}
              BATTLEINFINITY={BATTLEINFINITY}
              bellIcon={bellIcon}
              walletIcon={walletIcon}
            />
          </FastImage>
        </View>
        <View>
          <View style={styles.swipperContainer}>
            <SingleCard
              IPL="IPL"
              firstTeamImg={MumbaiIndianImg}
              firstTeamName="Mumbai"
              shortName="MI"
              live="LIVE"
              opponentTeamName="Hyderabad"
              opponentShortName="SRH"
              opponentImg={OpponentTeamImg}
              totalTeam="2"
              totalContest="3"
            />
          </View>
        </View>
        <LinearGradient
          colors={['#172c66', '#172c66']}
          style={styles.gradientButtonContainer}>
          <TouchableOpacityView style={styles.eachGradientButton}>
            <LinearGradient
              colors={['#00B4C3', '#7B57D0']}
              start={{x: 0.0, y: 1.0}}
              end={{x: 1.0, y: 1.0}}
              style={styles.insideButtonGradientStyle}>
              <AppText style={{textAlign: 'center'}}>Contest</AppText>
            </LinearGradient>
          </TouchableOpacityView>

          <View style={styles.myContestTextContainer}>
            <AppText style={styles.myText}>My Contest(2)</AppText>
          </View>
          <View style={styles.myTeamTextContainer}>
            <AppText style={styles.myText}>My Team(3)</AppText>
          </View>
        </LinearGradient>
        {/* MEGA CONTEST */}
        <View style={styles.megaContestFlexContainer}>
          <AppText style={styles.megaContestText}>Mega Contest</AppText>
          <View style={styles.contestCommonCradContainer}>
            <ContestCommonCard contestCommonCardData={true} />
          </View>
        </View>

        {/* PRACTICE CONTEST */}
        <View style={styles.practiceContestContainer}>
          <View style={styles.practiceTextFlexContainer}>
            <AppText style={styles.practiceContestText}>
              Practice Contest
            </AppText>
            <View style={styles.viewAllView}>
              <AppText style={styles.viewAllText}>View all</AppText>
              <FastImage
                source={forwardIcon}
                style={styles.forwardIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.practiceSliderContainer}>
            <PracticeCommonCard />
          </View>
        </View>
        {/* BUTTON */}

        <View style={styles.contestButtonContainer}>
          <View style={styles.buttonWrapperContainer}>
            <SecondaryButton
              smallBtn={styles.btnStyle}
              title="CREATE CONTEST"
            />
          </View>
          <View style={styles.insideButtonWrapper}>
            <PrimaryButton smallBtn={styles.btnStyle} title="CREATE TEAM" />
          </View>
        </View>
      </View>
    </AppSafeAreaView>
  );
};
const styles = StyleSheet.create({
    wrapperContainer: {
      flex: 1,
      backgroundColor: 'red',
      padding: 0,
    },
    backgroundImageContainer: {
      height: 160,
  
      width: '100%',
      backgroundColor: 'transparent',
      padding: 0,
      position: 'relative',
    },
    bgImage: {
      height: '100%',
  
      width: '100%',
    },
    swipperContainer: {
      height: 130, //checkkkkkkkkkkkkkkkkkkkk
      width: '100%',
      position: 'absolute',
      top: -60,
    },
  
    btnStyle: {
      width: 170,
    },
  
    gradientButtonContainer: {
      marginTop: 80,
      flex: 0.7,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 3,
      paddingVertical: 3,
      borderRadius: 30,
      margin: 10,
      borderColor: '#5588c3',
      borderWidth: 2,
    },
    eachGradientButton: {
      height: '100%',
      width: '32.33%',
      backgroundColor: '#A67CFF',
      marginRight: '1%',
      marginLeft: 0,
      borderRadius: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderWidth: 0,
      borderColor: '#00B4C3',
    },
    insideButtonGradientStyle: {
      height: '100%',
      width: '100%',
  
      borderRadius: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    myContestTextContainer: {
      height: '100%',
      width: '32.33%',
      backgroundColor: '#172c66',
      marginRight: '1%',
      borderRadius: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    myText: {textAlign: 'center'},
    myTeamTextContainer: {
      height: '100%',
      width: '32.33%',
      backgroundColor: '#172c66',
  
      marginRight: '1%',
      padding: 4,
      borderRadius: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    megaContestFlexContainer: {
      flex: 4,
      padding: 10,
    },
    megaContestText: {color: 'white', fontWeight: 'bold', fontSize: 15},
    practiceContestContainer: {
      flex: 4,
      padding: 10,
    },
    practiceContestText: {
      marginTop: 0,
      position: 'absolute',
      top: 0,
      // left: 10,
      marginBottom: 50,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 15,
    },
    practiceSliderContainer: {
      paddingTop: 10,
    },
    contestButtonContainer: {
      marginTop: 5,
  
      paddingVertical: 3,
  
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    buttonWrapperContainer: {
      height: 20,
  
      width: '50%',
      display: 'flex',
      alignSelf: 'flex-end',
    },
    insideButtonWrapper: {
      height: 30,
      marginBottom: 10,
      display: 'flex',
      alignSelf: 'flex-end',
      width: '50%',
    },
    contestCommonCradContainer: {
      paddingBottom: 10,
    },
    practiceTextFlexContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 15,
    },
    viewAllView: {
      height: 30,
      width: 70,
      borderWidth: 0.5,
      borderColor: '#88D1F2',
  
      borderRadius: 25,
      position: 'absolute',
      right: 0,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    viewAllText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'row',
  
      textAlign: 'center',
      justifyContent: 'center',
    },
  
    forwardIcon: {
      height: 10,
      width: 15,
    },
  });
export default MegaContest;
