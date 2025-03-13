import {universalPaddingHorizontal} from '../../theme/dimens';
import {StyleSheet} from 'react-native';
import {fontFamilyPoppins} from '../../theme/typography';
import { NewColor, colors } from '../../theme/color';

const styles = StyleSheet.create({
  backgroundColorContainer: {
    width: '100%',
    marginTop:'-20%',
  },
  ImageBackground: {
    height: 234,
    paddingHorizontal: 20,
  },
  color: colors => ({
    color: colors.white,
  }),
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    
  },
  topView: {
    paddingHorizontal: universalPaddingHorizontal,
    width: '95%',
    alignSelf: 'center',
  },
  secondView: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',

  },
  profileImageView: {
    width: 85,
    height: 85,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 60,
    borderColor:colors.brownYellow,
    borderWidth:1,
    alignItems:"center",justifyContent:"center"
    
    
    // padding: 1,
  },
  profileImage: {
    width: 83,
    height: 83,
    borderRadius: 45,
    margin: 1,
  },
  informationView: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  editButton: {width: 60},
  editButtonTitle: {
    fontSize: 12,
    fontFamily: fontFamilyPoppins,
    color:colors.white,
    marginTop:2
  },
  balanceCard: {
    paddingVertical: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    backgroundColor:colors.bottomBackgroundColor
  },
  balanceCardFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginHorizontal: 25,
  },
  balanceCardSecond: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  secondContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
});

export default styles;
