import { Dimensions, Platform, StyleSheet } from 'react-native';
import { universalPaddingHorizontal, Screen } from '../../theme/dimens';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { colors } from '../../theme/color';

const styles = StyleSheet.create({
  topheadingContainer: {
    width: '100%',
    height: 140,
    alignItems: "center",
    marginTop: 20
  },
  topUnderContainer: {
    width: '95%',
    height: 95,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    top: 5,
  },
  undernewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  alignCenter: {
    alignItems: 'center'
  },
  subsBackImage: {
    height: 54, width: 68, marginTop: 5, alignItems: "center", justifyContent: "center"
  },
  subsAddImage: {
    height: 42, width: 48, marginTop: 5
  },
  textContainerSUbs: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginTop: -10,
    marginRight: 2,
  },
  subsText1: {
    textAlign: 'center',
    fontSize: 10,
  },
  playerHeadingBar: {
    width: Dimensions.get('window').width,
    height: 40,
    backgroundColor: 'rgba(22, 29, 35, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: 10,
    opacity: 0.5
  },
  renderContatainer: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(22, 64, 111, 1)'
  },
  playerName: {
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  underRenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  profileContainer: {
    flex: 1, alignItems: "center", justifyContent: "center"
  },
  plyaerProfile: {
    height: 50, width: 50,
  },
  playerNameContainer: {
    flex: 1.5, left: 11,
  },
  playerRoll: {
    color: 'rgba(22, 64, 111, 1)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2
  },
  lastPlayConainer: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: colors.rbBackground,
  },
  lastPlayText: {
    marginLeft: 5,
    fontWeight: 700,
    fontSize: 10
  },
  lastPlay: {
    flexDirection: 'row',
    alignItems: "center",
  },
  playingContainer: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: Platform.OS == 'ios' ? 0 : -6
  },
  dotPaying: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: '#00B81C',
  },
  PlayIngText: {
    color: '#00B81C',
    marginLeft: 5,
  },
  unPlayDot: {
    height: 5,
    width: 5,
    borderRadius: 100,
    backgroundColor: '#FF0000',
  },
  unPlayText: {
    color: '#FF0000',
    marginLeft: 5,
  },
  avgContainer: {
    flex: 1, alignItems: 'center'
  },
  selectSubConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '38%',
    right: 10,
  },
  selectImage: {
    height: 28, width: 28
  },
  filterPlayerText: {
    flex: 2, padding: 2, flexDirection: 'row',
    marginLeft: 15
  },
  filterPlayerArrow: {
    height: 8,
    width: 8,
    marginTop: 5,
    marginLeft: 5,
  },
  filerAvgContainer: {
    flex: 1, padding: 2,
    alignItems: 'center',
    flexDirection: "row"
  },
  filterAvgArrow: {
    height: 8,
    width: 8,
    marginTop: 1,
    marginLeft: 2,
  },
  headerDotgreen: {
    height: 6,
    width: 6,
    borderRadius: 100,
    backgroundColor: '#00B81C',
    marginTop: 1,
    marginLeft: 3,
  },
  headerDotRed: {
    height: 6,
    width: 6,
    borderRadius: 100,
    backgroundColor: '#FF0000',
    marginTop: 1,
    marginLeft: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    marginVertical: 5,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default styles;
