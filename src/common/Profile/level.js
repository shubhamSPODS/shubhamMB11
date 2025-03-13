import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {AppText, POPPINS_BOLD, POPPINS_SEMI_BOLD, SIXTEEN} from '../AppText';
import {LEVEL_IMAGE} from '../../helper/image';
import {NewColor, colors} from '../../theme/color';

const Level = ({data}) => {
  return (
    <View style={{marginTop: 10}}>
      <AppText
        type={SIXTEEN}
        style={{marginBottom: 5}}
        weight={POPPINS_SEMI_BOLD}>
        Level Reached
      </AppText>
      <View
        style={{
          width: '100%',
          height: 112,
          padding: 1,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.borderLightBlue,
        }}>
        <View
          style={{
            height: 108,
            borderRadius: 12,
            padding: 10,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ImageBackground
              style={{
                height: 40,
                width: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={LEVEL_IMAGE}>
              <AppText style={{fontSize: 15}} weight={POPPINS_BOLD}>
                {data?.levels?.current_level}
              </AppText>
            </ImageBackground>
            <AppText
              style={{fontSize: 15, marginLeft: 15}}
              weight={POPPINS_BOLD}>
              {data?.levels?.current_level_name}
            </AppText>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.innerProgressBar}></View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  progressBarContainer: {
    height: 30,
    width: '100%',
    backgroundColor: '#FFCE51',
    borderRadius: 20,
    opacity: 0.2,
    overflow: 'hidden',
  },
  innerProgressBar: {
    width: '10%',
    backgroundColor: '#F3B14E',
    opacity: 1,
    height: '100%',
  },
});
export default Level;
