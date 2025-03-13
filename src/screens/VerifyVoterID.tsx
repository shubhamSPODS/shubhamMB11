import React from "react";
import { StatusBar, StyleSheet, TextInput, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import CommonImageBackground from "../common/commonImageBackground";
import { universalPaddingHorizontal } from "../theme/dimens";
import { KeyBoardAware } from "../common/KeyboardAware";
import Header from "../common/Header";
import { AppText, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from "../common/AppText";
import InputBox from "../common/InputBox";
import { NewColor, colors } from "../theme/color";
import { fontFamilyPoppins, poppinsSemiBold } from "../theme/typography";
import PrimaryButton from "../common/primaryButton";
import { checkVoterDlNumber, toastAlert } from "../helper/utility";
import { useDispatch } from "react-redux";
import { voterIDVerifiy } from "../slices/matchSlice";
import FastImage from "react-native-fast-image";
import { BannerVerify, checkAdhaar, recommendedIcon } from "../helper/image";
import Checkbox from "../common/CheckBox/CheckBox";

const VerifyVoterID = () => {
    const dispatch = useDispatch();
    const [voterIDNumber, setVoterIDNumber] = React.useState('')
    const [isVisable, setIsVisable] = React.useState(true);
    const onSubmit = () => {
        if (!checkVoterDlNumber(voterIDNumber)) {
            toastAlert.showToastError('Please enter vaild Voter ID Number');
        } else {
            let data = {
                voterid: voterIDNumber
            }
            dispatch(voterIDVerifiy(data))
        }
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
                    title="Verify Voter ID"
                    style={{ padding: universalPaddingHorizontal, marginTop: '10%' }}
                />
                <KeyBoardAware style={styles.bottomContainer}>
                    <FastImage source={BannerVerify} resizeMode='stretch' style={styles.topBanner} />
                    <View style={styles.box}>
                        <View>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                            Enter your UTR Number
                            </AppText>
                            <FastImage source={recommendedIcon} resizeMode='contain' style={styles.recommended} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                            allowFontScaling={false}
                                placeholder={'Enter your 16 digit UTR number'}
                                placeholderTextColor={NewColor.linerBlacklight}
                                style={styles.inputStyle}
                                value={voterIDNumber}
                                onChangeText={(value) => setVoterIDNumber(value)}
                                maxLength={16}
                            />
                            {checkVoterDlNumber(voterIDNumber) ?
                                <FastImage source={checkAdhaar} resizeMode='contain' style={styles.checkIcon} />
                                : <></>}
                        </View>
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
        </AppSafeAreaView>
    )
}
export default VerifyVoterID;
const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#002E6112",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
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
    recommended: {
        width: 82,
        height: 19,
        position: "absolute",
        right: -12,
        top: 3
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
    inputStyle: {
        fontSize: 13,
        fontFamily: poppinsSemiBold,
        flex: 1,
        color:colors.black
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