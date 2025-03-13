import {StyleSheet} from 'react-native';

import {Logo, Screen, universalPaddingHorizontal} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  title: colors => ({
    color: colors.white,
    alignSelf: 'center',
    marginTop: Screen.Height / 2,
  }),

  logo: {
    alignSelf: 'center',
    marginTop: Screen.Height / 16,
    height: Logo.Height,
    width: Logo.Width,
  },
  register: colors => ({
    color: colors.white,
    alignSelf: 'center',
    marginTop: 10,
  }),
  referral: colors => ({
    color: colors.white,
  }),

  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  button: {
    marginTop: 20,
  },
  bottom: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  code: colors => ({
    color: colors.code,
  }),
});

export default styles;
