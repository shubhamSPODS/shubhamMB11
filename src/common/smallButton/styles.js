import {StyleSheet} from 'react-native';
import React from 'react';
import {Primary} from '../../theme/dimens';
import {SmallPrimary} from '../../theme/dimens';

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 5,
    height: SmallPrimary.Height,
    width: SmallPrimary.Width,
  },
  buttonText: colors => ({
    textAlign: 'center',
    // margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
  }),
});

export default styles;
