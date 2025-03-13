import {StyleSheet} from 'react-native';
import {NewColor} from '../../../theme/color';

const styles = StyleSheet.create({
  viewAllBtn: {
    height: 23,
    width: 76,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NewColor.linerWhite,
    borderRadius: 16,
    borderWidth:2,
    borderColor:"#3D3D3D"
  },
  rightArrow: {
    height: 10,
    width: 10,
  },
});

export default styles;
