import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: 'green',
    marginVertical: 10,
  },
  wrapperContainer: {
    height: 40,
    // width: '100%',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 30,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    alignItems: 'center',
  },
  firstButton: {
    width: '50%',
    height: '95%',
    textAlign: 'center',
    backgroundColor: '#172C66',
    borderRadius: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondButton: {
    width: '50%',
    height: '95%',
    backgroundColor: '#5890d5',
    borderRadius: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    height: 40,
    width: '50%',
  },
  rentActive: {
    // backgroundColor: 'green',
  },
});

export default styles;
