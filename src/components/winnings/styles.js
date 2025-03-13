import {StyleSheet} from 'react-native';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  head: {
    height: 33,
    backgroundColor: NewColor.linerBlackFive,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  winningContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
});

export default styles;
