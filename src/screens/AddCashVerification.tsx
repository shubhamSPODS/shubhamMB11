import React, { useState } from "react";
import { Platform, RefreshControl, StatusBar, StyleSheet, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { universalPaddingHorizontal } from "../theme/dimens";
import { AppText, BLACKOPACITY, FORTEEN, GREEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, SIXTEEN, THIRTEEN } from "../common/AppText";
import FastImage from "@d11/react-native-fast-image";
import { adhaarIcon, dlicon, kycLogo, passportIcon, votericon } from "../helper/image";
import { KeyBoardAware } from "../common/KeyboardAware";
import { colors } from "../theme/color";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import PrimaryButton from "../common/primaryButton";
import NavigationService from "../navigation/NavigationService";
import { VERIFY_ADHAAR_SCREEN, VERIFY_BANK_SCREEN, VERIFY_DL, VERIFY_PAN_SCREEN, VERIFY_VOTER_ID } from "../navigation/routes";
import { useDispatch, useSelector } from "react-redux";
import { toastAlert } from "../helper/utility";
import { getKycDetails } from "../actions/profileAction";

const AddCashVerification = () => {
    const dispatch = useDispatch();
    const [select, setSelect] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const kycDetails = useSelector((state: any) => {
        return state.profile.kycDetails;
    });

    const data = [
        {
            id: 1,
            title: 'Aadhar with OTP',
            image: adhaarIcon,
        },
        // {
        //     id: 4,
        //     title: 'Upload Aadhar',
        //     image: adhaarIcon,
        //     panding: kycDetails?.adhar_verified
        // },
        // {
        //     id: 2,
        //     title: 'Pan Card',
        //     image: votericon,
        // },
        // {
        //     id: 3,
        //     title: 'Bank Account',
        //     image: dlicon,
        // },
        // {
        //     id: 4,
        //     title: 'Passport',
        //     image: passportIcon,
        // },
    ]
    const renderItem = (item: any) => {
        return (
            <TouchableOpacityView
                onPress={() => setSelect(item.id)}
                style={styles.renderContainer}>
                <View style={styles.underContainer}>
                    <FastImage source={item.image} resizeMode="contain" style={styles.renderImage} />
                    <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                        {item.title}
                    </AppText>
                </View>
                {item.panding == 2 ? <AppText weight={POPPINS_SEMI_BOLD} color={GREEN}>
                    Pending
                </AppText> :
                    <View style={styles.tickContainer}>
                        {select == item.id ?
                            <View style={styles.tick} /> : <></>}
                    </View>
                }
            </TouchableOpacityView>
        )
    }
    const onSubmit = () => {
        if (select == '1') {
            NavigationService.navigate(VERIFY_ADHAAR_SCREEN)
        } else if (select == '2') {
            NavigationService.navigate(VERIFY_PAN_SCREEN)
        } else if (select == '3') {
            if(kycDetails?.pan_verified === 0) {
                toastAlert.showToastError("Please Verify Pan Card First");
                return;
              }
            return NavigationService.navigate(VERIFY_BANK_SCREEN)
        }
    }
    const onRefresh = () => {
        dispatch(getKycDetails());
        setIsConnected(false)
    }
    return (
        <AppSafeAreaView>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle="dark-content"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <Header
                    commonHeader
                    title="Verification"
                    style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
                />
                <KeyBoardAware
                    refreshControl={
                        <RefreshControl refreshing={isConnected} onRefresh={onRefresh} />
                    } style={styles.bottomContainer}>
                    <FastImage source={kycLogo} resizeMode="contain" style={styles.kycLogoS} />
                    <AppText style={[styles.headerText, { marginTop: '10%' }]} type={SIXTEEN} weight={POPPINS_SEMI_BOLD}>
                        Let’s verify KYC
                    </AppText>
                    <AppText style={styles.headerText} type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={BLACKOPACITY}>
                        {"Please submit the following documents \nfor the verification process"}
                    </AppText>
                    <AppText style={[styles.marginTop, { marginBottom: 10 }]} type={THIRTEEN} weight={POPPINS_SEMI_BOLD}>
                        Please select document to verify
                    </AppText>
                    {data?.map((item) => {
                        return renderItem(item)
                    })}

                </KeyBoardAware>
                <View style={styles.bottomButton}>
                    <PrimaryButton
                        buttonStyle={[styles.buttonStyle, { marginTop: Platform.OS == 'ios' ? -5 : 0 }]}
                        onPress={kycDetails?.adhar_verified == 2 ? toastAlert.showToastError('Your aadhaar verification is pending') : onSubmit}
                        title={kycDetails?.adhar_verified == 2 ? "Pending" : "START KYC"}
                    />
                    <AppText style={styles.headerText} color={BLACKOPACITY} type={THIRTEEN} weight={POPPINS_MEDIUM}>
                        It will take less then a minute
                    </AppText>
                </View>
            </CommonImageBackground>
        </AppSafeAreaView>
    )
}
export default AddCashVerification;
const styles = StyleSheet.create({
    bottomContainer: {
        paddingHorizontal: universalPaddingHorizontal,
    },
    headerText: {
        textAlign: "center"
    },
    kycLogoS: {
        width: 223,
        height: 222,
        alignSelf: 'center',
        marginTop: 20
    },
    marginTop: {
        marginTop: 30
    },
    renderContainer: {
        borderWidth: 1,
        borderColor: "#002E6117",
        paddingHorizontal: 10,
        height: 46,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    renderImage: {
        height: 20,
        width: 20,
        marginRight: 10
    },
    underContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    tickContainer: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.borderBackColor,
        height: 20,
        width: 20,
        alignItems: "center",
        justifyContent: 'center'
    },
    tick: {
        height: 10,
        width: 10,
        backgroundColor: colors.backGroundBlue,
        borderRadius: 50
    },
    buttonStyle: {
        marginHorizontal: 5,
        marginBottom: 5
    },
    bottomButton: {
        paddingHorizontal: universalPaddingHorizontal,
        marginBottom: Platform.OS == 'ios' ? 20 : 0
    }
})