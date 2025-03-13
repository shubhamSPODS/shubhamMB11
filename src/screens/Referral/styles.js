import {StyleSheet} from 'react-native';

import {Screen, universalPaddingHorizontal} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  referral: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 10,
  }),
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  enter: colors => ({
    color: colors.white,
    marginTop: 10,
  }),
  label: {
    marginTop: 40,
  },
  button: {
    marginTop: 50,
  },
  account: colors => ({
    color: colors.white,
    marginTop: Screen.Height / 3,
    alignSelf: 'center',
  }),
  register: colors => ({
    color: colors.code,
    // marginTop: Screen.Height / 4,
  }),
});

export default styles;
