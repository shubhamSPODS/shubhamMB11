// import {View, Text} from 'react-native';
// import React from 'react';
// import styles from './styles';
// import {TouchableOpacityView} from '../TouchableOpacityView';
// import FastImage from 'react-native-fast-image';
// import Contest from '../../components/matchCard/contest/Contest';
// import MumbaiIndianImg from '../../../assets/images/MumbaiIndian.png';
// import OpponentTeamImg from '../../../assets/images/sunriseHyd.png';
// import {
//   AppText,
//   EIGHTEEN,
//   FORTEEN,
//   POPPINS,
//   POPPINS_MEDIUM,
//   POPPINS_SEMI_BOLD,
//   SIXTEEN,
//   TWELVE,
//   TWENTY_FOUR,
// } from '../../common/AppText';
// import {AppSafeAreaView} from '../AppSafeAreaView';
// import HomeTopHeader from '../../HomeTopHeader/HomeTopHeader';
// import {contextBgNew, forwardIcon} from '../../helper/image';
// import SingleCard from '../SingleCard/SingleCard';
// import LinearGradient from 'react-native-linear-gradient';

// import PrimaryButton from '../primaryButton';
// import SecondaryButton from '../secondaryButton';
// import ContestCommonCard from '../ContestCommonCard/ContestCommonCard';
// import PracticeCommonCard from '../practiceContestCommonCard/PracticeContestCard';
// import {Top_Slider_FlatList} from '../../navigation/routes';
// import TopSliderFlatList from '../TopSliderFlatList/TopSliderFlatList';
// import CommonHeader from '../../components/matchCard/commonHeader/CommonHeader';
// import NavigationService from '../../navigation/NavigationService';
// import {SELECT_PLAYER,CREATE_CONTEST} from '../../navigation/routes';

// import {ContestCommonCardData} from '../../../src/DummyData';

// import {
//   arrow,
//   VectorLogo,
//   BATTLEINFINITY,
//   bellIcon,
//   walletIcon,
//   BackIcon,
// } from '../../helper/image';
// import {TouchEventType} from 'react-native-gesture-handler/lib/typescript/TouchEventType';

// const SingleIplCard = () => {
//   return (
//     <AppSafeAreaView>
//       <View style={styles.wrapperContainer}>
//         <View style={styles.backgroundImageContainer}>
//           <LinearGradient
//             style={{
//               height: 60,
//               width: '100%',
//               justifyContent: 'center',
//               alignSelf: 'center',
//             }}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}
//             colors={['#3B035B', '#200146']}>
//             <FastImage style={styles.bgImage} resizeMode="cover">
//               <HomeTopHeader
//                 arrow={arrow}
//                 bellIcon={bellIcon}
//                 walletIcon={walletIcon}
//               />
//             </FastImage>
//           </LinearGradient>
//         </View>

//         {/* <View style={styles.swipperContainer}>
//             <SingleCard
//               IPL="IPL"
//               firstTeamImg={MumbaiIndianImg}
//               firstTeamName="Mumbai"
//               shortName="MI"
//               live="LIVE"
//               opponentTeamName="Hyderabad"
//               opponentShortName="SRH"
//               opponentImg={OpponentTeamImg}
//               totalTeam="2"
//               totalContest="3"
//             />
//           </View> */}

//         <View style={styles.gradientButtonContainer}>
//           <TouchableOpacityView style={styles.eachGradientButton}>
//             <AppText style={{textAlign: 'center', color: '#89BEF8'}}>
//               Contest
//             </AppText>
//           </TouchableOpacityView>

//           <View style={styles.myContestTextContainer}>
//             <AppText style={styles.myText}>My Contest(2)</AppText>
//           </View>
//           <View style={styles.myTeamTextContainer}>
//             <AppText style={styles.myText}>My Team(3)</AppText>
//           </View>
//         </View>
//         <View style={{width: '100%', height: 20, bottom: 80}}>
//           <CommonHeader />
//         </View>
//         {/* MEGA CONTEST */}
//         <View style={styles.megaContestFlexContainer}>
//           <AppText style={styles.megaContestText}>Mega Contest</AppText>
//           <View style={styles.contestCommonCradContainer}>
//             <ContestCommonCard contestCommonCardData={true} />
//           </View>
//         </View>

//         {/* PRACTICE CONTEST */}
//         <View style={styles.practiceContestContainer}>
//           <View style={styles.practiceTextFlexContainer}>
//             <AppText style={styles.practiceContestText}>
//               Practice Contest
//             </AppText>
//             <View style={styles.viewAllView}>
//               <AppText style={styles.viewAllText}>View all</AppText>
//               <FastImage
//                 source={forwardIcon}
//                 style={styles.forwardIcon}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           <View style={styles.practiceSliderContainer}>
//             <PracticeCommonCard />
//           </View>
//         </View>
//         {/* BUTTON */}

//         <View style={styles.contestButtonContainer}>
//           <View style={styles.buttonWrapperContainer}>
//             <TouchableOpacityView
//               onPress={() => NavigationService.navigate(CREATE_CONTEST)}
//               style={{
//                 height: 45,
//                 width: 159,
//                 borderRadius: 10,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderColor: '#AD53CC',
//                 borderWidth: 1,
//                 bottom: 25,
//               }}>
//               <AppText
//                 style={{color: '#ffffff'}}
//                 type={FORTEEN}
//                 weight={POPPINS_SEMI_BOLD}>
//                 CREATE CONTEST
//               </AppText>
//             </TouchableOpacityView>
//             {/* <SecondaryButton
//               smallBtn={styles.btnStyle}
//               title="CREATE CONTEST"
//             /> */}
//           </View>
//           <TouchableOpacityView
//             onPress={() => NavigationService.navigate(SELECT_PLAYER)}>
//             <LinearGradient
//               colors={['#5389C4', '#7F3291']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={{
//                 height: 45,
//                 width: 159,
//                 borderRadius: 10,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <AppText
//                 style={{color: '#ffffff'}}
//                 type={FORTEEN}
//                 weight={POPPINS_SEMI_BOLD}>
//                 CREATE TEAM
//               </AppText>
//             </LinearGradient>
//           </TouchableOpacityView>
//           {/* <TouchableOpacityView style={{
//                 height: 45,
//                 width: 159,
//                 borderRadius: 10,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderColor: '#AD53CC',
//                 borderWidth: 1,
//                 bottom: 20,
//               }}   onPress={() =>
//                   NavigationService.navigate(SELECT_PLAYER)
//                 }>

//               <AppText
//                 style={{color: '#ffffff'}}
//                 type={FORTEEN}
//                 weight={POPPINS_SEMI_BOLD}>
//                 CREATE CONTEST
//               </AppText>
//              <PrimaryButton smallBtn={styles.btnStyle} title="CREATE TEAM" />
//           </TouchableOpacityView> */}
//         </View>
//       </View>
//     </AppSafeAreaView>
//   );
// };

// export default SingleIplCard;
import {View, Text} from 'react-native';
import React from 'react';
import styles from './styles';
import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';
import MumbaiIndianImg from '../../../assets/images/MumbaiIndian.png';
import OpponentTeamImg from '../../../assets/images/sunriseHyd.png';

import {AppSafeAreaView} from '../AppSafeAreaView';
import HomeTopHeader from '../../HomeTopHeader/HomeTopHeader';
import {contextBgNew, forwardIcon} from '../../helper/image';
import SingleCard from '../SingleCard/SingleCard';
import LinearGradient from 'react-native-linear-gradient';

import PrimaryButton from '../primaryButton';
import SecondaryButton from '../secondaryButton';
import ContestCommonCard from '../ContestCommonCard/ContestCommonCard';
import PracticeCommonCard from '../practiceContestCommonCard/PracticeContestCard';

import {AppText, WHITE} from '../AppText';

import {ContestCommonCardData} from '../../../src/DummyData';

import {
  personIcon,
  VectorLogo,
  BATTLEINFINITY,
  bellIcon,
  walletIcon,
  BackIcon,
} from '../../helper/image';

const SingleIplCard = () => {
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
              <AppText style={{textAlign: 'center'}}  color={WHITE}>Contest</AppText>
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

export default SingleIplCard;

