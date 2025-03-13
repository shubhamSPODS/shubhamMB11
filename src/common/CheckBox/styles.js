import {StyleSheet} from 'react-native';
import {colors} from '../../theme/color';

const styles = StyleSheet.create({
  selectedUIFilter: (type: number, colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    height: 15,
    width: 15,
  }),

  checkboxTick: (type: number, colors) => ({
    width: '75%',
    height: '95%',
    alignSelf: 'center',
    

  }),
  unchecked: colors => ({
    borderRadius: 3,
    height: 15,
    width: 15,
    borderColor: 'rgba(83, 137, 196, 1)',
  }),

  linearGradientWrapper: {
    borderRadius: 4,
    padding: 1,
    // borderColor: colors.,
    backgroundColor:"#DBA63D",
    // borderWidth: 1,
    height:18,
    width:18,
    
  },

});

export default styles;
