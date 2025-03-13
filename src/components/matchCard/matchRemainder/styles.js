import {StyleSheet} from 'react-native';
import {universalPaddingHorizontal} from '../../../theme/dimens';
import { NewColor } from '../../../theme/color';

const styles = StyleSheet.create({
  top: {
    height: 54,
    width: '100%',
    backgroundColor: NewColor.linerBlackFive,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
  remainderLogo: {
    height: 19,
    width: 19,
  },
  closeIcon: {
    height: 12,
    width: 12,
  },
  matchContainer: {
    paddingHorizontal: 10,
    height: 62,
    top: 15,
  },
  radioBtn: {
    height: 20,
    width: 34,
  },
});

export default styles;
