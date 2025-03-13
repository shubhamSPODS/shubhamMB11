import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Primary} from '../../theme/dimens';
import {poppinsBold, poppinsSemiBold} from '../../theme/typography';
import { NewColor, colors } from '../../theme/color';
// import {colors} from '../../theme/color';

const styles = StyleSheet.create({
  textinputstyle: {
    height: Primary.Height,
    borderRadius: 5,
    paddingHorizontal: 15,
    color: colors.black,
    fontSize: 14,
    flex:1
  },
  gradient: {
    height: Primary.Height,
    borderRadius: 5,
  },

  eyeIcon: {
    height: 20,
    width: 20,
  },
  closeView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NewColor.linerLightBlueTwinty,
    height: 14,
    width: 14,
    padding: 5,
  },
  toggleButton: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    height: Primary.Height,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  NameLabel: {
    marginTop: 10,
  },
});

export default styles;
