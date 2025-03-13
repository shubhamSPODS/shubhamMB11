import React from 'react';
import {
  Dimensions,
  Platform,
  Animated,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {SpinnerProps} from '../types/common';
import {Applogo} from '../helper/image';

const shimmerConfig = {
  startingX: -200,
  useNativeDriver: true,
  shimmerColor: '#FFF',
  toValue: Dimensions.get('window').width + 100,
};

const Spinner = ({style}: SpinnerProps) => {
  return (
    // <Shimmer>
    //   {/* <View style={{
    //     flex: 1,
    //     backgroundColor: "red",
    //   }} >
    //     <AppText type={EIGHT_ONE}>
    //       diajdasdjkadjasjdasdjaskldjas
    //     </AppText>
    //   </View> */}

    //   {/* <Text>Loading...</Text> */}
    // </Shimmer>
    <Animated.View style={[styles.spinnerStyle, style]}>
      <LottieView
        source={require('../../assets/animation/loading.android.json')}
        autoPlay
        loop
        style={{width: 200, height: 200}}
      />
      <FastImage style={styles.icon} resizeMode="contain" source={Applogo} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  spinnerStyle: {
    position: 'absolute',
    width: Dimensions.get('screen').width,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    width: Platform.OS === 'ios' ? 55 : 55,
    height: Platform.OS === 'ios' ? 55 : 55,
    backgroundColor: '#fff',
    borderRadius: 120,
  },
});

export {Spinner};
