import { Dimensions, StyleSheet } from 'react-native';
import { NewColor } from '../../theme/color';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: 'auto',
    // padding:5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  top: {
    height: 46,
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftArrow: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  icon: {
    height: 23,
    width: 23,
    marginRight: 10,
  },
  rightIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    height: 16,
    width: 16,
  },
  detailBox: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 'auto',
  },
  matchDetails: {
    height: 46,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contestDetails: {
    padding: 10,
    marginTop: '-10%',
    width: '95%',
    alignSelf: 'center',
  },
  teamName: {
    color: 'white',
    fontSize: 11,
    paddingLeft: 10,
  },
  vsText: {
    color: 'white',
    opacity: 0.6,
    fontSize: 10,
  },
  bedge: {
    height: 45,
    width: '90%',
    backgroundColor: '#37CC4C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.lightgry,
    borderRadius: 4,

    overflow: 'hidden',
  },
  bottomContainer: {
    height: 33,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NewColor.linerBlackFive,
    borderRadius: 4,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  commonViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  gloryIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  commonTextStyle: {
    marginLeft: 6,
  },
  tabContainer: {
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#0C4E9B',
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 2,
    flexDirection: 'row',
  },
  tabButton: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  tabTitle: {
    color: 'white',
    fontSize: 12,
  },
  head: {
    height: 33,
    backgroundColor: '#161D23',
    paddingHorizontal: 10,
  },
  container2: {
    height: 45,
    // top: 30,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    width: '33%',
    height: 38,
    justifyContent: 'center',
    padding: 5,
    alignItems: 'center',
  },
  tab: {
    fontSize: 14,
    color: 'white',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  }
});

export default styles;
