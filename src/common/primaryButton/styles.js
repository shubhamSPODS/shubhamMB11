import {StyleSheet} from 'react-native';
import React from 'react';
import {Primary} from '../../theme/dimens';

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientWrapper: {
    borderRadius: 5,
    padding: 1,
  },
  smallBtn: {
    height: 50,
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText:{
    color:'white',
    fontWeight:"700",
    textTransform:"uppercase"

  },
});

export default styles;
