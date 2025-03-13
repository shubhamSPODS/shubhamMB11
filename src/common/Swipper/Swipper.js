import {View, Text} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import styles from './styles';
import {TouchableOpacityView} from '../TouchableOpacityView';
import FastImage from 'react-native-fast-image';
import {AppText} from '../AppText';
import SliderBg from '../../../assets/images/sliderBg.png';
import {iplTextContainer} from '../../helper/image';

const Swipper = props => {
  return (
    <>
      <Swiper style={[styles.wrapper, styles.dotsWrapperStyle]} autoplay={true}>
        <TouchableOpacityView style={{flex: 1}}>
          <View style={styles.slide1}>
            <FastImage
              source={SliderBg}
              // resizeMode="contain"
              style={styles.fastImgSlider}>
              <View style={styles.sliderViewContainer}>
                <FastImage
                  resizeMode="contain"
                  style={styles.fastImage}
                  source={iplTextContainer}>
                  <AppText style={styles.iplText}>{props.IPL}</AppText>
                </FastImage>
              </View>
              <View style={styles.sliderMainContainer}>
                <View style={styles.ImgContainer}>
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.firstTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainer}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerFastImg}
                          source={props.firstTeamImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.shortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.IPLTextContainer}>
                    <View style={styles.teamShortName}>
                      <AppText style={styles.live}>{props.live}</AppText>
                    </View>
                  </View>
                  {/* ------------sunrise------------ */}
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.opponentTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainerReverse}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerReverse}
                          source={props.opponentImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.opponentShortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </FastImage>
            <View style={styles.noOfTeamAndContestContainer}>
              <AppText style={styles.bottomPartOfCard}>
                {props.totalTeam} Teams
              </AppText>
              <AppText style={styles.contextText}>
                {props.totalContest} Contests
              </AppText>
            </View>
          </View>
        </TouchableOpacityView>
        <TouchableOpacityView style={{flex: 1}}>
          <View style={styles.slide1}>
            <FastImage
              source={SliderBg}
              // resizeMode="contain"
              style={styles.fastImgSlider}>
              <View style={styles.sliderViewContainer}>
                <FastImage
                  resizeMode="contain"
                  style={styles.fastImage}
                  source={iplTextContainer}>
                  <AppText style={styles.iplText}>{props.IPL}</AppText>
                </FastImage>
              </View>
              <View style={styles.sliderMainContainer}>
                <View style={styles.ImgContainer}>
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.firstTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainer}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerFastImg}
                          source={props.firstTeamImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.shortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.IPLTextContainer}>
                    <View style={styles.teamShortName}>
                      <AppText style={styles.live}>{props.live}</AppText>
                    </View>
                  </View>
                  {/* ------------sunrise------------ */}
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.opponentTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainerReverse}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerReverse}
                          source={props.opponentImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.opponentShortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </FastImage>
            <View style={styles.noOfTeamAndContestContainer}>
              <AppText style={styles.bottomPartOfCard}>
                {props.totalTeam} Teams
              </AppText>
              <AppText style={styles.contextText}>
                {props.totalContest} Contests
              </AppText>
            </View>
          </View>
        </TouchableOpacityView>
        <TouchableOpacityView style={{flex: 1}}>
          <View style={styles.slide1}>
            <FastImage
              source={SliderBg}
              // resizeMode="contain"
              style={styles.fastImgSlider}>
              <View style={styles.sliderViewContainer}>
                <FastImage
                  resizeMode="contain"
                  style={styles.fastImage}
                  source={iplTextContainer}>
                  <AppText style={styles.iplText}>{props.IPL}</AppText>
                </FastImage>
              </View>
              <View style={styles.sliderMainContainer}>
                <View style={styles.ImgContainer}>
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.firstTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainer}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerFastImg}
                          source={props.firstTeamImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.shortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.IPLTextContainer}>
                    <View style={styles.teamShortName}>
                      <AppText style={styles.live}>{props.live}</AppText>
                    </View>
                  </View>
                  {/* ------------sunrise------------ */}
                  <View style={styles.mumbaiIndianContainer}>
                    <View style={styles.textLogoImgContainer}>
                      <AppText style={styles.teamName}>
                        {props.opponentTeamName}
                      </AppText>
                      <View style={styles.LogoWithNameContainerReverse}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.loginWithNameContainerReverse}
                          source={props.opponentImg}></FastImage>
                        <AppText style={styles.teamShortName}>
                          {props.opponentShortName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </FastImage>
            <View style={styles.noOfTeamAndContestContainer}>
              <AppText style={styles.bottomPartOfCard}>
                {props.totalTeam} Teams
              </AppText>
              <AppText style={styles.contextText}>
                {props.totalContest} Contests
              </AppText>
            </View>
          </View>
        </TouchableOpacityView>
      </Swiper>
    </>
  );
};

export default Swipper;
