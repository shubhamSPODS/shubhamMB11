import React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {AppSafeAreaView} from '../../common/AppSafeAreaView';
import {
  AppText,
  ELEVEN,
  FIFTEEN,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  THIRTEEN,
  TWELVE,
} from '../../common/AppText';
import CommonHeader from '../../components/matchCard/commonHeader/CommonHeader';
import {GLORY, GURANTEE, SINGLE, WINNER} from '../../helper/image';
import styles from './styles';
const PractiseScreen = () => {
  return (
    <AppSafeAreaView statusColor={'black'}>
      <View style={{flex: 1, backgroundColor: 'black'}}>
        {/* <CommonHeader /> */}
        <View style={styles.mainContainer}>
          <AppText
            type={SIXTEEN}
            style={{color: 'white'}}
            weight={POPPINS_BOLD}>
            Practice contest
          </AppText>

          <AppText
            type={ELEVEN}
            style={{color: 'white', opacity: 0.6, marginBottom: 15}}
            weight={POPPINS}>
            3 Contest available
          </AppText>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText
                  style={{color: 'white'}}
                  type={FIFTEEN}
                  weight={POPPINS_BOLD}>
                  Practice Contest
                </AppText>

                <View style={styles.bedge}>
                  <AppText
                    style={{color: 'white'}}
                    weight={POPPINS_MEDIUM}
                    type={THIRTEEN}>
                    Join
                  </AppText>
                </View>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  style={{width: '60%', height: '100%', borderRadius: 4}}
                  start={{x: 0, y: 0}}
                  colors={['#00B4C3', '#7B57D0']}></LinearGradient>
              </View>
              <View style={styles.flex}>
                <Text style={{color: 'white', opacity: 0.5, fontSize: 10}}>
                  2 spots
                </Text>
                <AppText
                  style={{color: '#37CC4C', fontSize: 10}}
                  type={POPPINS_MEDIUM}>
                  1 spots left
                </AppText>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.commonViewStyle}>
                  <FastImage source={GLORY} style={styles.gloryIcon} />
                  <Text style={styles.commonTextStyle}>Glory awaits!</Text>
                </View>
                {/* <View style={styles.commonViewStyle}>
                  <FastImage source={WINNER} style={styles.gloryIcon} />
                  <Text style={styles.commonTextStyle}>50%</Text>
            </View>**/}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FastImage source={SINGLE} style={styles.gloryIcon} />
                  <Text style={styles.commonTextStyle}>Single</Text>
                </View>
              </View>
              <View style={styles.flex}>
                <FastImage source={GURANTEE} style={styles.gloryIcon} />
                <Text style={styles.commonTextStyle}>Guranteed</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AppSafeAreaView>
  );
};

export default PractiseScreen;
