import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: 'black',
    padding: 0,
  },
  backgroundImageContainer: {
    height: 160,

    width: '100%',
    backgroundColor: 'transparent',
    padding: 0,
    position: 'relative',
  },
  bgImage: {
    height: '100%',
    // height: 50,
    width: '100%',
  },
  swipperContainer: {
    height: 130, //checkkkkkkkkkkkkkkkkkkkk
    width: '100%',
    position: 'absolute',
    // bottom: -20,
    top: -60,

    zIndex: 999,
    // backgroundColor: 'red',
  },
});

export default styles;
