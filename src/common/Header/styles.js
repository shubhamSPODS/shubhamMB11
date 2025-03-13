import {StyleSheet} from 'react-native';

import {Logo, Screen, universalPaddingHorizontal} from '../../theme/dimens';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: universalPaddingHorizontal,
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    marginTop: Screen.Height / 50,
    paddingHorizontal: universalPaddingHorizontal,
    alignItems:'center',
  },
  logo: {
    alignSelf: 'center',
    marginTop: Screen.Height / 16,
    height: Logo.Height,
    width: Logo.Width,
  },
  title: {
    marginLeft: 15,
    marginTop:2
  },
  arrow: {
    height: 18,
    width: 18,
  },
  arrowIcon: {
    height: 13,
    width: 13,
  },
  arrowview:{
    height:28,
    width:28,
    backgroundColor:"transparent",
    borderWidth:1,
    borderColor:colors.bottomBackgroundColor,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:15
  }
});

export default styles;
