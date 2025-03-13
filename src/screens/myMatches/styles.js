import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12%',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  joinButtonMyContest: {
    height: 35,
    paddingHorizontal: 25,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userLogo: {
    height: 28,
    width: 28,
  },
  logo: {
    height: 40,
    width: 120,
  },
  rightImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 17,
    width: 16,
    resizeMode: 'contain',
  },
  walletIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  tabContainer: {
    height: 42,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabs: {
    width: '33.33%',
    height: 38,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderConatainer: {
    flexDirection: 'column',
    width: '33%',
    height: 38,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default styles;
