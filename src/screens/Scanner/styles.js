import {StyleSheet} from 'react-native';

import {Scanner, Screen} from '../../theme/dimens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  scanner: {
    height: Scanner.Height,
    width: Scanner.Width,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Screen.Height / 4,
  },
  arrow: {
    marginTop: Screen.Height / 20,
    height: 18,
    width: 18,
  },
  topContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePlaceholder: {
    height: 18,
    width: 18,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: Screen.Height / 3.5,
  },
});

export default styles;
