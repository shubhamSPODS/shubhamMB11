import { Dimensions, StyleSheet } from 'react-native';
import { universalPaddingHorizontal } from '../../../theme/dimens';
import { colors } from '../../../theme/color';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginBottom: 15,
    marginTop: '10%',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  walletView: {
    borderRadius: 59,
    flexDirection: 'row',
    marginTop: 2,
    height: 30,
    width: 80,
    borderWidth: 2,
    borderColor: '#C1AA9966',
    marginLeft: 30
  },
  leftArrow: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    marginRight: 10,
  },
  walletbox: {
    height: 28,
    width: 28, backgroundColor: "#FFFFFF",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DBA73E"
  },
  text: {
    color: 'white',
  },
  flex1: {
    flex: 1,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  rightImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 10,
  },
  bellIcon: {
    height: 28,
    with: 28,
    marginTop: 3,
  },
  walletIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 12,
  },
  live: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  matchImage: {
    resizeMode: 'contain',
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: universalPaddingHorizontal,
  },
  shape: {
    width: 111,
    height: 29,
    position: 'absolute',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  teamImage: {
    height: 37,
    width: 37,
    resizeMode: 'contain',
  },
  filterContainer: {
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#3F3F3F',
    marginTop: 10
  },
  entryTitle: {
    marginRight: 5,
  },
  filterIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  card: {
    height: 85,
    width: '100%',
    overflow: 'hidden',
    bottom: 30,
  },
  teamName: {
    color: 'white',
    fontSize: 10,
  },
  teamShortName: {
    fontSize: 12,
    color: 'white',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 35,
    height: 52,
    marginTop: 10
  }
});

export default styles;
