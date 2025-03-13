import {StyleSheet} from 'react-native';
import React from 'react';
import {Battle_Infinity, Primary, Screen} from '../../theme/dimens';
import {SmallPrimary} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: colors => ({
    backgroundColor: colors.black,
    flex: 1,
  }),
  bellWalletContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  image: {
    height: 23,
    width: 23,
  },
  wallet: {
    height: 16,
    width: 16,
    marginLeft: 10,
  },
  headerContainer: {
    marginHorizontal: 20,
  },

  headerPart: {
    // height: '100%',
    height: '50%',
    width: '100%',
    // flex: 1,
  },
  person: {
    height: 28,
    width: 28,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Screen.Height / 20,
  },
  battle: {
    alignSelf: 'center',
    // marginTop: Screen.Height / 14,
    // marginLeft: Screen.Height / 8,
    height: Battle_Infinity.Height,
    width: Battle_Infinity.Width,
  },
});

export default styles;
