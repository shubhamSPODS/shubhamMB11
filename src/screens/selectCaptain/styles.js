import { Dimensions, StyleSheet } from 'react-native';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  top: {
    height: 190,
    width: Dimensions.get('window').width,
    backgroundColor: "green"
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 10,
  },
  leftArrow: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  text: {
    color: 'white',
    marginLeft: Dimensions.get('window').width / 2.8,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  matchCard: {
    resizeMode: 'contain',
  },
  card: {
    height: 80,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: "red"
  },
  teamNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 10,
  },
  teamName: {
    color: 'white',
    opacity: 0.9,
  },
  teamLogo: {
    height: 50,
    width: 50,
  },
  midContainer: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorWhite: {
    color: 'white',
  },
  heading: {
    marginTop: 10,
    textAlign: 'center',
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: 10,
  },
  playerHeadingBar: {
    width: Dimensions.get('window').width,
    height: 40,
    backgroundColor: NewColor.linerBlackFive,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  label: {
    color: 'white',
    fontSize: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    marginVertical: 10,
  },
  btn: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  createContest: {
    borderWidth: 1,
    borderColor: colors.borderBackColor,
  },
  playerContainer: {
    height: 60,
    borderBottomColor: NewColor.linerLightBlueTwinty,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#343434",
    marginBottom: 10,
    borderRadius: 10
  },
  playerImage: {
    height: 55,
    width: 53,
    flex: 1,
    marginLeft: -15
  },
  playerName: {
    color: 'white',
  },
  roleBedge: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: colors.brownYellow,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBedge2: {
    height: 30,
    width: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brownYellow
  },
  playerRole: {
    color: 'white',
    fontSize: 10,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  },
  vcContainer: {
    width: 90,
    height: 44,
    marginRight: -10,
    marginBottom: -20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  }
});

export default styles;
