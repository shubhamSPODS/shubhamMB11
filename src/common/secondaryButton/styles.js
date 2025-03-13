import {StyleSheet} from 'react-native';
import React from 'react';
import {Primary} from '../../theme/dimens';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    justifyContent: 'center',
  },
  grediant: {
    borderRadius: 20,
    // padding: 2,
    // borderColor:'#D89E3C',
    backgroundColor:NewColor.linerBlackFive,
    // borderWidth:1,
  },
  buttonContainer: {
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: colors.white,
  },
  touchableopacityview: colors => ({
    backgroundColor: colors.purple,
    height: 50,
    //width: 310,
    borderRadius: 5,
  }),
  textstyle: colors => ({
    textAlign: 'center',
    color: colors.white,
    // fontSize: 18,
    marginVertical: 10,
  }),
});

export default styles;
