import {View, Text} from 'react-native';
import React from 'react';
import './styles';

import styles from './styles';
import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';

import {
  Mumbai,
  Hyderabad,
  RCB,
  Lucknow,
  Delhi,
  Gujrat,
  RajRoyals,
  SliderBg,
  SliderBg1,
  SliderBg2,
  SliderBg3,
  SliderBg4,
  iplTextContainer
} from '../../helper/image';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
// import MumbaiIndianImg from '../../../assets/images/MumbaiIndian.png';
// import OpponentTeamImg from '../../../assets/images/sunriseHyd.png';
const bottomFlatData = [
  {
    id: 1,
    IPL: 'Indian Premium League',
    firstTeamImg: Mumbai,
    firstTeamName: 'Mumbai',
    shortName: 'MI',
    live: 'LIVE',
    opponentTeamName: 'Hyderabad',
    opponentShortName: 'SRH',
    opponentImg: Hyderabad,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg,
  },
  {
    id: 2,
    IPL: 'Indian Premium League',
    firstTeamImg: RCB,
    firstTeamName: 'BANGALORE',
    shortName: 'RCB',
    live: 'LIVE',
    opponentTeamName: 'LUCKNOW',
    opponentShortName: 'LSG',
    opponentImg: Lucknow,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg1,
  },
  {
    id: 3,
    IPL: 'Indian Premium League',
    firstTeamImg: Delhi,
    firstTeamName: 'CHENNI',
    shortName: 'CSK',
    live: 'LIVE',
    opponentTeamName: 'RAJ Royals',
    opponentShortName: 'RR',
    opponentImg: RajRoyals,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg2,
  },
  {
    id: 4,
    IPL: 'Indian Premium League',
    firstTeamImg: Delhi,
    firstTeamName: 'DELHI',
    shortName: 'DC',
    live: 'LIVE',
    opponentTeamName: 'GUJARAT',
    opponentShortName: 'GT',
    opponentImg: Gujrat,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg3,
  },
  {
    id: 5,
    IPL: 'IPL',
    firstTeamImg: RCB,
    firstTeamName: 'Mumbai',
    shortName: 'MI',
    live: 'LIVE',
    opponentTeamName: 'Hyderabad',
    opponentShortName: 'SRH',
    opponentImg: Lucknow,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg4,
  },
  {
    id: 6,
    IPL: 'Indian Premium League',
    firstTeamImg: Delhi,
    firstTeamName: 'Mumbai',
    shortName: 'MI',
    live: 'LIVE',
    opponentTeamName: 'Hyderabad',
    opponentShortName: 'SRH',
    opponentImg: Gujrat,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg1,
  },
  {
    id: 7,
    IPL: 'Indian Premium League',
    firstTeamImg: RCB,
    firstTeamName: 'Mumbai',
    shortName: 'MI',
    live: 'LIVE',
    opponentTeamName: 'Hyderabad',
    opponentShortName: 'SRH',
    opponentImg: Lucknow,
    totalTeam: '2',
    totalContest: '3',
    image: SliderBg2,
  },
];

const FlatSlider = () => {
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });

  return (
    <View style={styles.flatListMainContainer}>
      <View style={styles.flatListWrapper}>
        {bottomFlatData?.map(each => (
          <View style={styles.slide1} key={each?.id}>
            <TouchableOpacityView style={styles.touchabaleOpacityView}>
              <View
                style={styles.fastImages}>
                <View style={styles.fastImgView}>
                  <View style={styles.fastImgStyle}>
                  <Text style={{fontSize:12,fontWeight:"400",color:"#FFFFFF"}}>{each.IPL}</Text>
                  <LinearGradient
                style={{
                  height:1,
                  width:"100%",
                  alignSelf:"center",
                  top:5
                }}
                start={{x: 1, y: 0}}
                end={{x: 0, y:1}}
                colors={['#4F7ABA','#E18FFF']}>
                  </LinearGradient>
                  </View>
                
                </View>
                <View>
                  <View style={styles.ImgContainer}>
                    <View style={styles.mumbaiIndianContainer}>
                      <View style={styles.textLogoImgContainer}>
                        <Text style={styles.teamName}>
                          {each.firstTeamName}
                        </Text>
                        <View style={styles.LogoWithNameContainer}>
                          <FastImage
                            resizeMode="contain"
                            style={styles.LogoWithNameContainerFastImg}
                            source={each?.firstTeamImg}></FastImage>

                          <Text style={styles.teamShortName}>
                            {each?.shortName}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.IPLTextContainer}>
                      <View style={styles.teamShortName}>
                        {/* <View style={styles.IPlDivContainer}></View> */}
                        {/* <View style={styles.teamShortName}>
                          <Text style={styles.live}>{each.live}</Text>
                        </View> */}
                      </View>
                      {/* ------------sunrise------------ */}
                      <View style={styles.mumbaiIndianContainer}>
                        <View style={styles.textLogoImgContainer}>
                          <Text style={styles.teamName}>
                            {each?.opponentTeamName}
                          </Text>
                          <FastImage
                            style={styles.LogoWithNameContainerReverse}>
                            <FastImage
                              resizeMode="contain"
                              style={styles.opponentFastImg}
                              source={each?.opponentImg}></FastImage>
                            <Text style={styles.teamShortName}>
                              {each?.opponentShortName}
                            </Text>
                          </FastImage>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacityView>
            <View style={styles.noOfTeamAndContestContainer}>
              <Text style={{ color:"white"}}>2 Teams</Text>
              <Text style={styles.contextText}>3 Contests</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FlatSlider;
