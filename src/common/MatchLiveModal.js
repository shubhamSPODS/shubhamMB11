import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  AppText,
  BLACK,
  FIFTEEN,
  FORTEEN,
  Montserrat,
  POPPINS_BOLD,
  POPPINS_SEMI_BOLD,
  SEMI_BOLD,
  SIXTEEN,
  THIRTEEN,
} from './AppText';
import { TouchableOpacityView } from './TouchableOpacityView';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { Alertlogo } from '../helper/image';
import NavigationService from '../navigation/NavigationService';
import { BOTTOM_NAVIGATION_STACK } from '../navigation/routes';

const MatchLiveModal = ({ AleartLive }) => {
  return (
    <RBSheet
      ref={AleartLive}
      closeOnDragDown={false}
      closeOnPressBack={false}
      closeOnPressMask={false}
      openDuration={100}
      height={230}
      customStyles={{
        container: {
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          alignItems: 'center',
        },
        draggableIcon: {
          backgroundColor: 'transparent',
          display: 'none',
        },
      }}>
      <AppText
        style={{ marginTop: 15, fontWeight: 'bold' }}
        color={BLACK}
        weight={POPPINS_BOLD}
        type={FIFTEEN}>
        Deadline Passed!
      </AppText>
      <FastImage
        source={Alertlogo}
        resizeMode="contain"
        style={{ height: 72, width: 72, marginTop: 10 }}
      />
      <AppText
        style={{
          marginTop: 15,
          fontWeight: 'bold',
          opacity: 0.5,
          textAlign: 'center',
        }}
        color={BLACK}
        weight={POPPINS_SEMI_BOLD}
        type={FORTEEN}>
        You can't join contests for this match anymore. Select another match to
        play.
      </AppText>
      <TouchableOpacityView
        onPress={() => {
          AleartLive?.current?.open();
          NavigationService.reset(BOTTOM_NAVIGATION_STACK);
        }}
        style={styles.buttonContainer}>
        <LinearGradient
          style={styles.btn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#5389C4', '#7F3291']}>
          <AppText
            type={THIRTEEN}
            style={{
              color: 'white',
              fontWeight: 'bold',
              marginLeft: 10,
            }}
            weight={Montserrat}>
            VIEW UPCOMING MATCHES
          </AppText>
        </LinearGradient>
      </TouchableOpacityView>
    </RBSheet>
  );
};

export { MatchLiveModal };
const styles = StyleSheet.create({
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 18,
    width: '100%',
  },
});
