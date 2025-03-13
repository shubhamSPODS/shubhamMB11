import { StyleSheet, View } from 'react-native';
import React from 'react';
import { AppText, ELEVEN, FOURTEEN, POPPINS, POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from '../AppText';
import { Button } from '../Button';
import { useSelector, useDispatch } from 'react-redux';
import NavigationService from '../../navigation/NavigationService';
import { KYC_SCREEN, WITHDRAW_SCREEN } from '../../navigation/routes';
import { NewColor, colors } from '../../theme/color';
import { getKycDetails, getUserProfile } from '../../actions/profileAction';
const ListingItem = ({ title, info, button, border }) => {
  const dispatch = useDispatch();
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const isUserVerified =
    kycDetails?.pan_verified == 1 && kycDetails?.mobile_verified == 1 && kycDetails?.selfie_verified == 1 && kycDetails?.bank_verified == 1;
  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: !border ? 1 : null,
          borderBottomColor: "#BEBEBE",
          paddingHorizontal: 10,
          paddingVertical: 16,
          // backgroundColor: 'red',
        },
      ]}>
      <View>
        <AppText type={FOURTEEN} weight={POPPINS_MEDIUM}>
          {title}
        </AppText>
        <AppText type={FOURTEEN} weight={POPPINS_SEMI_BOLD}>
          {info}
        </AppText>
      </View>
      <View>
        {button && !isUserVerified && (
          <Button

            onPress={() => { NavigationService.navigate(KYC_SCREEN), dispatch(getKycDetails()), dispatch(getUserProfile(false, false)); }}
            style={{
              width: 140,
              height: 28,
              marginTop: 0,
              bordercolor: "#DBA63D", borderwidth: 1

            }}
            backgroundColor="#DBA63D"
            nogradient


            type={ELEVEN}
            weight={POPPINS}>
            Verify to Withdrawl
          </Button>
        )}
        {button && isUserVerified && (
          <Button
            onPress={() => NavigationService.navigate(WITHDRAW_SCREEN)}
            style={{
              width: 145,
              height: 30,
              marginTop: 0,
            }}
            nogradient
            backgroundColor="white"
            type={ELEVEN}
            weight={POPPINS}>
            Withdraw
          </Button>
        )}
      </View>
    </View>
  );
};

export default ListingItem;

const styles = StyleSheet.create({
  icon_Name: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageContainer: {
    backgroundColor: 'rgba(217, 217, 217, 0.05)',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  color: colors => ({
    color: colors.white,
  }),
});
