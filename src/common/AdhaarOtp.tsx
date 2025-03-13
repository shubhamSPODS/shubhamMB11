import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/color";
import { AppText, POPPINS_SEMI_BOLD, TWENTY } from "./AppText";
import PrimaryButton from "./primaryButton";
import { useDispatch, useSelector } from "react-redux";
import { addharVerifiyOtp } from "../slices/matchSlice";
import { SpinnerSecond } from "./SpinnerSecond";

const AdhaarOtp = ({ name, filterSheet }: any) => {
    const dispatch = useDispatch();
    const [code, setCode] = useState('168058');
    const addharDetails = useSelector((state: any) => state?.match?.addharDetails);
    const loadingKyc = useSelector((state: any) => state?.match?.isLoading);
    const { request_id, task_id } = addharDetails ?? "";
    const onSubmit = () => {
        let data = {
            request_id: request_id,
            otp: code,
            task_id: task_id,
            adhar_no: name
        };
        dispatch(addharVerifiyOtp(data, filterSheet))
    }
    return (
        <View style={styles.container}>
            <View style={styles.inerHeader}>
                <AppText weight={POPPINS_SEMI_BOLD} type={TWENTY}>
                    Enter OTP
                </AppText>
            </View>
            <OTPInputView
                style={{
                    width: '100%',
                    alignSelf: 'center',
                }}
                pinCount={6}
                code={code}
                autoFocusOnLoad={false}
                placeholderCharacter="-"
                editable
                onCodeChanged={value => setCode(value)}
                // onCodeFilled={code => { }}
                placeholderTextColor={colors.black}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
            <PrimaryButton
                buttonStyle={styles.button}
                title="SUBMIT"
                onPress={() => onSubmit()}
            />
            <SpinnerSecond loading={loadingKyc} />
        </View>
    )
}
export default AdhaarOtp;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: 70,
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
    },
    underlineStyleBase: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: colors.borderLightBlue,
        color: colors.black,
        borderWidth: 0,
        marginTop: 20
    },
    underlineStyleHighLighted: {
        borderColor: colors.lightRed,
    },
    inerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    closeIconStyle: {
        height: 15,
        width: 15
    },
    button: {
        marginTop: 20
    }
})