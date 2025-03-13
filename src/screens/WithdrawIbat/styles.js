import {StyleSheet} from 'react-native';

import {Screen} from '../../theme/dimens';

const styles = StyleSheet.create({
  bottomContainer: {
    marginHorizontal: 20,
  },
  withdraw: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 24,
  }),
  wallet: colors => ({
    color: colors.code,
    marginTop: 15,
  }),

  box: colors => ({
    borderWidth: 2,
    borderColor: colors.dot,
    borderRadius: 16,
    marginTop: 10,
  }),
  textInputBox: {
    height: 45,
    width: 330,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: Screen.Height / 3,
  },
});

export default styles;
