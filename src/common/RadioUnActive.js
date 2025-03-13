import React from 'react';
import {View, StyleSheet} from 'react-native';
import { colors } from '../theme/color';

const RadioUnActive = () => {
  return <View style={styles.radio}></View>;
};
const styles = StyleSheet.create({
  radio: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 10,
    borderRadius: 50,
  },
});
export default RadioUnActive;
