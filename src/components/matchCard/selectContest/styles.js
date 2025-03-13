import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  closeImageContainer: {
    height: 42,
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    zIndex: 100,
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 10,
  },
  btn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default styles;
