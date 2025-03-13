import { StyleSheet } from 'react-native';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  closeImageContainer: {
    padding: 10
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 30,
    height: 50,
    width: '95%',
    marginTop: 10,
    alignSelf: 'center',
  },
  btn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});

export default styles;
