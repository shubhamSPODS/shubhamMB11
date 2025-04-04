import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { StatusBar } from "native-base";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { Primary, universalPaddingHorizontal } from "../theme/dimens";
import { KeyBoardAware } from "../common/KeyboardAware";
import { AppText, BLACK, BLACKOPACITY, ELEVEN, FORTEEN, GRY, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, THIRTEEN } from "../common/AppText";
import InputBox from "../common/InputBox";
import { NewColor, colors } from "../theme/color";
import { fontFamilyPoppins, poppinsSemiBold } from "../theme/typography";
import PrimaryButton from "../common/primaryButton";
import { useDispatch, useSelector } from "react-redux";
import { checkValidDlNumber, toastAlert } from "../helper/utility";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from "moment";
import { dlVerifiy } from "../slices/matchSlice";
import { SpinnerSecond } from "../common/SpinnerSecond";
import { BannerVerify, calanderIcon, checkAdhaar, recommendedIcon } from "../helper/image";
import FastImage from "@d11/react-native-fast-image";

import Checkbox from "../common/CheckBox/CheckBox";

const VerifyDL = () => {
    const dispatch = useDispatch();
    const [dlNumber, setDlNumber] = React.useState('');
    const [dob, setDob] = React.useState('');
    const [isVisable, setIsVisable] = React.useState(true);
    const [isDatePickerVisible, setIsDatePickerVisible] = React.useState(false);
    const loadingKyc = useSelector((state: any) => state?.match?.isLoading);

    const onSubmit = () => {
        if (!dob) {
            toastAlert.showToastError('Please select your DOB')
        } else if (!checkValidDlNumber(dlNumber)) {
            toastAlert.showToastError('Please enter vaild Dl number')
        } else {
            const data = {
                dlnumber: "RJ14C20220021220",
                dob: dob
            }
            dispatch(dlVerifiy(data))
        }
    }
    const handleConfirm = (date: any) => {
        setDob(moment(date).format('DD-MM-YYYY'));
        setIsDatePickerVisible(false);
    };
    const hideDatePicker = () => {
        setIsDatePickerVisible(false);
      };
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
                    title="Verify DL Number"
                    style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
                />
                <KeyBoardAware style={styles.bottomContainer}>
                    <FastImage source={BannerVerify} resizeMode='stretch' style={styles.topBanner} />
                    <View style={styles.box}>
                        <View>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                            Enter your Driving Licence Number
                            </AppText>
                            <FastImage source={recommendedIcon} resizeMode='contain' style={styles.recommended} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                            allowFontScaling={false}
                                placeholder={'Enter your 16 digit DL number'}
                                placeholderTextColor={NewColor.linerBlacklight}
                                style={styles.inputStyle}
                                value={dlNumber}
                                onChangeText={(value) => setDlNumber(value)}
                                maxLength={16}
                            />
                            {checkValidDlNumber(dlNumber) ?
                                <FastImage source={checkAdhaar} resizeMode='contain' style={styles.checkIcon} />
                                : <></>}
                        </View>
                        <TouchableOpacityView
                            onPress={() => setIsDatePickerVisible(true)}
                            style={styles.inputContainer}>
                            <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={dob ? BLACK : BLACKOPACITY}>
                                {dob ? dob : 'Date of birth'}
                            </AppText>
                            <FastImage source={calanderIcon} resizeMode='contain' style={styles.checkIcon} />
                        </TouchableOpacityView>
                    </View>
                    <View style={styles.commonFlow}>
                        <Checkbox value={isVisable} />
                        <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
                            {` User must be 18 years of age or above to play\n pay-to-play contest on MyBattle11`}
                        </AppText>
                    </View>
                    <View style={styles.commonFlow}>
                        <Checkbox value={isVisable} />
                        <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
                            {`Users must not be residing in restricted states. To know\n more, read Terms & conditions.`}
                        </AppText>
                    </View>
                    <View style={styles.commonFlow}>
                        <Checkbox value={isVisable} />
                        <AppText style={styles.commonText} weight={POPPINS_MEDIUM}>
                            I{`hereby confirm that my attached documents are \ncredible and binding`}
                        </AppText>
                    </View>
                </KeyBoardAware>
                <View
                    style={{
                        paddingHorizontal: universalPaddingHorizontal,
                        marginBottom: 10,
                    }}>
                    <PrimaryButton
                        buttonStyle={styles.button}
                        title="SUBMIT"
                        onPress={onSubmit}
                    />
                </View>
            </CommonImageBackground>
            <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={moment().subtract(18, 'years').toDate()}
          />
            <SpinnerSecond loading={loadingKyc} />
        </AppSafeAreaView>
    )
}
export default VerifyDL;
const styles = StyleSheet.create({
    bottomContainer: {
        paddingHorizontal: universalPaddingHorizontal,
    },
    withdraw: {
        marginTop: 10,
    },
    box: {
        borderWidth: 1,
        borderColor: "#002E610F",
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 20
    },
    label: {
        fontSize: 12,
        color: 'rgba(61, 137, 236, 1)',
        marginTop: 0,
        marginBottom: 5,
    },
    textInputBox: {
        fontFamily: fontFamilyPoppins,
        fontSize: 12,
        color:colors.black
    },
    button: {
        marginTop: 30,
        marginBottom: 10
    },
    topBanner: {
        height: 90,
        width: "100%",
        marginTop: 20
    },
    recommended: {
        width: 82,
        height: 19,
        position: "absolute",
        right: -12,
        top: 3
    },
    inputContainer: {
        marginTop: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#002E6112",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputStyle: {
        fontSize: 13,
        fontFamily: poppinsSemiBold,
        flex: 1
    },
    checkIcon: {
        height: 20,
        width: 20
    },
    commonFlow: {
        flexDirection: "row",
        alignItems: "center",
    },
    commonText: {
        marginTop: 8,
        marginLeft: 10
    }
})