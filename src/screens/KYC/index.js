import { View, Text, StatusBar, Image, FlatList, Modal, Platform, StyleSheet, Dimensions, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../common/Header';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import { KeyBoardAware } from '../../common/KeyboardAware';
import CommonImageBackground from '../../common/commonImageBackground';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  EIGHT,
  ELEVEN,
  FORTEEN,
  POPPINS_LIGHT,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  RED,
  SEMI_BOLD,
  SIXTEEN,
  TEN,
  THIRTEEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import { useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { RootState } from '../../libs/rootReducer';
import { scan, copy, downArrow, done, kycLogo, panIcon, bankIcon, upiIcon, checkAdhaar, panIconUpload, greenmark, adhaarIcon, passportIcon, votericon, dlicon, callIcon } from '../../helper/image';
import FastImage from "@d11/react-native-fast-image";
import { phone, email, bank, panCard } from '../../helper/image';
import { universalPaddingHorizontal } from '../../theme/dimens';
import SecondaryButton from '../../common/secondaryButton';
import NavigationService from '../../navigation/NavigationService';
import {
  MY_BALANCE,
  UPLOAD_SELFIE,
  VERIFY_ADHAAR_SCREEN,
  VERIFY_BANK_SCREEN,
  VERIFY_DL,
  VERIFY_EMAIL_SCREEN,
  VERIFY_PAN_SCREEN,
  VERIFY_UPI,
  VERIFY_VOTER_ID,
  WITHDRAW_SCREEN,
} from '../../navigation/routes';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import PrimaryButton from '../../common/primaryButton';
import { toastAlert } from '../../helper/utility';
import { NewColor, colors } from '../../theme/color';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Secondary from '../../common/Secondary';
import { fontFamilyPoppins } from '../../theme/typography';

const KYC = () => {
  const [visible, setIsVisible] = useState('');
  const [topTrue, setTopTrue] = useState(false);
  const [bottomTrue, setBottomTrue] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [select, setSelect] = useState('')
  const colors = useSelector((state: RootState) => {
    return state.theme.colors;
  });
  const kycDetails = useSelector(state => {
    return state.profile.kycDetails;
  });
  const userData = useSelector(state => {
    return state.profile.userData;
  });

  console.log(kycDetails, "kycDetails")
  const data = [
    {
      id: 1,
      title: 'Bank Account',
      image: bankIcon,
    },
    {
      id: 2,
      title: 'UPI',
      image: upiIcon,
    },
  ]
  const DATA = [
    {
      id: '0',
      source: callIcon,
      heading: 'Mobile Number',
      subHeading: `+91 ${userData?.mobile_number}`,
      type: 'Verified',
    },
    // {
    //   id: '1',
    //   source: passportIcon,
    //   heading: 'Email Address',
    //   subHeading: 'To get latest information',
    //   type: 'notVerified',
    // },
    {
      id: '2',
      source: adhaarIcon,
      heading: 'Aadhaar card',
      subHeading: 'For safety ans security of all transactions.',
      type: 'notVerified',
    },
    {
      id: '3',
      source: dlicon,
      heading: 'PAN Card',
      subHeading: 'For safety ans security of all transactions.',
      type: 'notVerified',
    },
    {
      id: '4',
      source: bankIcon,
      heading: 'Bank Account',
      subHeading: 'For withdrawals to your bank account.',
      type: 'notVerified',
    },
    {
      id: '5',
      source: votericon,
      heading: 'Upload Selfie',
      subHeading: 'For withdrawals to your bank account.',
      type: 'notVerified',
    },
  ];

  const isVerified = id => {
    if (id == 0) {
      return kycDetails?.mobile_verified == 1;
    } else if (id == 1) {
      return kycDetails?.email_verified == 1;
    } else if (id == 5) {
      return kycDetails?.selfie_verified == 1;
    } else if (id == 3) {
      return kycDetails?.pan_verified == 1;
    } else if (id == 4) {
      return kycDetails?.bank_verified == 1;
    } else if (id == 2) {
      return kycDetails?.adhar_verified == 1;
    }
  };

  const checkInProgress = id => {
    if (id == 1) {
      return kycDetails?.email_verified == 2;
    } else if (id == 5) {
      return kycDetails?.selfie_verified == 2;
    } else if (id == 3) {
      return kycDetails?.pan_verified == 2;
    } else if (id == 4) {
      return kycDetails?.bank_verified == 2;
    } else if (id == 2) {
      return kycDetails?.adhar_verified == 2;
    }
  };
  // const newCheck = (kycDetails?.pan_verified == 1 && kycDetails?.email_verified == 1) && (kycDetails?.upi_verified == 1 || kycDetails?.bank_verified == 1)

  // useEffect(() => {
  //   if (newCheck) {
  //     setIsModalVisible(true)
  //   }
  // }, [kycDetails])

  const onSubmit = () => {
    if (select == 1) {
      NavigationService.navigate(VERIFY_BANK_SCREEN)
    } else {
      NavigationService.navigate(VERIFY_UPI)
    }
  }
  // console.log(kycDetails, 'kycDetails');
  const onPressAction = item => {
    if (item.id == '1') return NavigationService.navigate(VERIFY_EMAIL_SCREEN);
    if (item.id == '2') return NavigationService.navigate(VERIFY_ADHAAR_SCREEN);
    if (item.id == '3') return NavigationService.navigate(VERIFY_PAN_SCREEN);
    if (item.id == '4') {
      if(kycDetails?.pan_verified === 0) {
        toastAlert.showToastError("Please Verify Pan Card First");
        return;
      }
      return NavigationService.navigate(VERIFY_BANK_SCREEN)
    };
    if (item.id == '5') return NavigationService.navigate(UPLOAD_SELFIE);

  };
  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={styles.box}>
        <View style={[styles.topContainer]}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.phoneContainer}>
              <FastImage
                source={item.source}
                resizeMode="contain"
                style={styles.phone}
                tintColor={"#8296AC"}
              />
            </View>
            <View style={[styles.mobileContainer, { flex: 1 }]}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{ width: '60%' }}>
                  <AppText
                    type={TWELVE}
                    style={[styles.mobile, { marginTop: 5 }]}>
                    {item.heading}
                  </AppText>
                  <AppText
                    type={TEN}
                    numberOfLines={1}
                    style={[styles.mobile, { flex: 1 }]}>
                    {item.subHeading}
                  </AppText>
                </View>

                {isVerified(item?.id) || item.id == 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignSelf: 'center',
                      // marginLeft: 15,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      borderRadius: 5,
                      right: 11,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 184, 28, 1)',
                    }}>
                    <AppText
                      weight={SEMI_BOLD}
                      style={{
                        color: 'rgba(0, 184, 28, 1)',
                        fontSize: 11,
                        fontWeight: '500',
                        alignContent: 'center',
                        right: 2,
                      }}>
                      Verified
                    </AppText>
                    <FastImage
                      source={greenmark}
                      resizeMode="contain"
                      style={{ height: 6, width: 9, alignSelf: 'center' }}
                    />
                  </View>
                ) : checkInProgress(item?.id) ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignSelf: 'center',
                      // marginLeft: 15,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      borderRadius: 5,
                      right: 11,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 184, 28, 1)',
                    }}>
                    <AppText
                      weight={SEMI_BOLD}
                      style={{
                        color: 'rgba(0, 184, 28, 1)',
                        fontSize: 10,
                        fontWeight: '500',
                        alignContent: 'center',
                      }}
                      /* style={styles.verified} */>
                      In Process
                    </AppText>
                  </View>
                ) : (
                  <Secondary
                    title="Verify"
                    onPress={() => onPressAction(item)}
                    buttonStyle={styles.editButton}
                    titleStyle={styles.editButtonTitle}
                    buttonViewStyle={{ height: 30 }}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <Header
          commonHeader
          title="Verification"
          style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
        />
        <KeyBoardAware style={styles.bottomContainer}>
          <AppText style={[styles.headerText]} type={SIXTEEN} weight={POPPINS_SEMI_BOLD}>
            Let’s verify KYC
          </AppText>
          {DATA.map((item, index) => {
            return renderItem({ item });
          })}
        </KeyBoardAware>
      </CommonImageBackground>
    </AppSafeAreaView>
  );
};

export default KYC;
const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  headerText: {
    marginTop: 10
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mobile: {
    color: 'white',
    marginLeft: 10,
  },
  phoneContainer: {
    backgroundColor: colors.background,
    height: 45,
    width: 45,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContainer: {
    justifyContent: 'center',
  },
  box: {
    borderWidth: 1,
    borderColor: 'rgba(63, 139, 238, 0.3)',
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.4)"
  },
  editButton: { width: 70, alignSelf: 'center', marginHorizontal: 10 },
  editButtonTitle: {
    fontSize: 12,
    fontFamily: fontFamilyPoppins,
  },
  phone: {
    height: 20,
    width: 20,
  },
  verified: {
    color: colors.green,
    alignSelf: 'center',
    marginLeft: 15,
    right: 5,
  },
});
