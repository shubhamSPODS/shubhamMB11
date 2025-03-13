import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 131,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4C5199',
    marginBottom: 10,
  },
  mainContainer: {
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    marginTop: 30,
  },
  topContainer: {
    height: 131 - 33,
    backgroundColor: 'rgba(24, 22, 82, 0.5)',
    padding: 10,
    justifyContent: 'space-evenly',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contestName: {
    color: 'white',
    fontSize: 10,
    opacity: 0.5,
  },
  entryType: {
    color: 'white',
    fontSize: 9,
    opacity: 0.5,
  },
  bedge: {
    height: 25,
    width: 56,
    backgroundColor: '#37CC4C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#D9D9D9',
    borderRadius: 4,

    overflow: 'hidden',
  },
  bottomContainer: {
    height: 32,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gloryIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  commonViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 10,
    opacity: 0.5,
    marginLeft: 6,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
