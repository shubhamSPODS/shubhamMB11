import { Dimensions, StyleSheet } from 'react-native';
import { NewColor, colors } from '../../../theme/color';

const styles = StyleSheet.create({
  card: {
    height: 162,
    borderColor: colors.lightgry,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  topContainer: {
    height: 162 - 33,
    width: '101%',
    resizeMode: 'contain',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginLeft: -1
  },
  top: {
    height: 33,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#FFFFFF26",

  },
  icon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 33,
    backgroundColor: colors.white,
  },
  midContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 96,
  },
  playerContainer: {
    flexDirection: 'row',
  },
  captainBedge: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    position:"absolute",
    left:-5
  },
  playerImage: {
    height: 50,
    width: 43,
    resizeMode: 'contain',
  },
  playerName: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  totalTeamsContainer: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgry,
    marginBottom: 8,
  },
});

export default styles;