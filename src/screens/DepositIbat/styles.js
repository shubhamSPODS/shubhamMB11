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
  topText: colors => ({
    color: colors.white,
    marginTop: 15,
    marginHorizontal: 10,
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
    // marginHorizontal: 10,
    // marginBottom: 20,
  },
  button: {
    marginTop: Screen.Height / 3,
  },
  scan: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: Screen.Height / 14,
  },
  copy: {
    width: 54,
    height: 48,
    alignSelf: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  code: {
    alignSelf: 'center',
  },
  disclaimer: colors => ({
    color: colors.code,
    marginTop: 10,
  }),
  bottomBox: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  discription: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
});

export default styles;
