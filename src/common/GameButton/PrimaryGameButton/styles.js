import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cricketContainer: {
    width: '49%',
    backgroundColor: '#662b6c',
    height: '100%',
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ae87b2',
    display: 'flex',
    alignItems: 'center',
  },
  footballContainer: {
    //
    width: '49%',
    backgroundColor: '#071863',
    height: '100%',
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#445ab9',
    display: 'flex',
    alignItems: 'center',
  },
  textAndIconWrapper: {
    // backgroundColor: 'red',
    height: '100%',
    width: '40%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  gamePng: {
    height: 16,
    width: 18,
    marginRight: 10,
  },
  gameButtonText: {
    marginTop: 3,
  },
  footballName: {
    marginTop: 3,
  },
});

export default styles;
