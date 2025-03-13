import {StyleSheet} from 'react-native';

import {Screen} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  referral: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 10,
  }),
  bottomContainer: {
    marginHorizontal: 20,
  },
  enter: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
  label: {
    marginTop: 40,
  },
  button: {
    marginTop: Screen.Height / 10,
  },
  account: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 4,
    alignSelf: 'center',
  }),
  register: colors => ({
    color: colors.code,
  }),
  confirm: {
    marginTop: 15,
  },
});

export default styles;
