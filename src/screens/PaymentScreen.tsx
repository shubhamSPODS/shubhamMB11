import React, { useEffect, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { KeyBoardAware } from "../common/KeyboardAware";
import CommonImageBackground from "../common/commonImageBackground";
import Header from "../common/Header";
import { AppText, FORTEEN, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, THIRTEEN, WHITE } from "../common/AppText";
import FastImage from "@d11/react-native-fast-image";
import { CurrentStar, PhonePeSamIcon, googlepay, panCard, paytmIcon, phonepay } from "../helper/image";
import { colors } from "../theme/color";
import { Screen, universalPaddingHorizontal } from "../theme/dimens";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import { useDispatch } from "react-redux";
import { paymentGetwayPhonepeText } from "../slices/matchSlice";
import RBSheet from "react-native-raw-bottom-sheet";
import { WebViewComponent } from "../components/WebView";
import base64 from 'react-native-base64'
import { sha256, sha256Bytes } from 'react-native-sha256';
import phonepeSDK from 'react-native-phonepe-pg'
import { Button } from "../common/Button";
import DeviceInfo from "react-native-device-info";

const PaymentScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const sheet = useRef();
    const amount = '50';
    const [upiApps, setUpiApps] = useState('');
    const [packageSignture, setPackageSignture] = useState('');
    const [isPhonePeInstalled, setIsPhonePeInstalled] = useState(false);
    const [isPaytmInstalled, setIsPaytmInstalled] = useState(false);
    const [isGPayInstalled, setIsGPayInstalled] = useState(false);
    let environmentForSDK = "PRODUCTION";
    let merchantId = "MYBATTLE11UAT_2504151611";
    let appId = packageSignture;
    console.log(appId,'==appid');
    
    let enableLogging = true;
    useEffect(() => {
        const checkApps = async () => {
            const isPhonePe = await phonepeSDK.isPhonePeInstalled();
            const isPaytm = await phonepeSDK.isPaytmAppInstalled();
            const isGPay = await phonepeSDK.isGPayAppInstalled();
            const installed: any = [];
            if (isPhonePe) {
                installed.push("com.phonepe.app", "com.phonepe.simulator"); 
            }
            if (isPaytm) {
                installed.push("net.one97.paytm");
            }
            if (isGPay) {
                installed.push("com.google.android.apps.nbu.paisa.user");
            }
            setIsGPayInstalled(installed)
            setIsPaytmInstalled(installed)
            setIsPhonePeInstalled(installed)
            setUpiApps(installed);
        };

        checkApps();
    }, []);
    useEffect(() => {
        const packageName = DeviceInfo.getBundleId(); // or getPackageName()
        setPackageSignture(packageName);
    }, []);

    const generateTransactionId = (() => {
        const timeStamp = Date.now();
        const random = Math.floor(Math.random() * 1000000)
        const merchantPrefix = '1'
        return `${merchantPrefix}${timeStamp}${random}`
    })
    const submit =(()=>{
        let title = "UPI_INTENT";
        phonepeSDK.init(
            environmentForSDK,
            merchantId,
            appId,
            enableLogging
        ).then(result => {
            console.log(result, '==result>>');
    
            const requestBody = {
                merchantId: merchantId,
                merchantTransactionId: generateTransactionId(),
                merchantUserId: '',
                amount: amount,
                mobileNumber: "9588815676",
                callBackUrl: '',
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
    
    
            }
            dispatch(paymentGetwayPhonepeText(requestBody, title, sheet, appId, appId))

            return
            const salt_key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
            const salt_index = 1;
            const payload = JSON.stringify(requestBody)
            const payloadMain = base64.encode(payload) 
            const string = payloadMain + "/pg/v1/pay" + salt_key
            const checksum = sha256(string) + "###" + salt_index
      console.log(checksum,'==sha');
      
      phonepeSDK.startTransaction(
        payloadMain,
        checksum,
        null,
        null

    ).then((result) => {
                console.log(result, '==result');
    
            }).catch((e => {
                console.log(e, '===transaction failed');
    
            }))
    
        }).catch(e => {
            console.log(e, '===Phone pe error');
    
        })
    })
  

    let data = [
        {
            id: 1,
            packageName: "com.phonepe.simulator",
            icon: PhonePeSamIcon,
            appName: "PhonePe Simulator",
        },
        {
            id: 2,
            packageName: "com.phonepe.app",
            icon: phonepay,
            appName: "PhonePe",
        },
        {
            id: 3,
            packageName: "net.one97.paytm",
            icon: paytmIcon,
            appName: "Paytm",
        },
        {
            id: 4,
            packageName: "com.google.android.apps.nbu.paisa.user",
            icon: googlepay,
            appName: "Google Pay",
        }
    ]
    const PayUpi = (packageName: any) => {
        let title = "UPI_INTENT";
        let targetapp = packageName;

        let sheet = null;
        let data = {
            amount: amount,
            type: 'UPI_INTENT',
            targetapp: packageName
        }
        console.log(data,'==data');
        
        dispatch(paymentGetwayPhonepeText(data, title, sheet, targetapp, appId))
    }
    // const PayCard = () => {
    //     let title = "UPI_INTENT";
    //     let data = {
    //         amount: amount,
    //         type: 'UPI_INTENT'
    //     }
    //     dispatch(paymentGetwayPhonepeText(data, title, sheet))
    // }
    return (
        <AppSafeAreaView hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <KeyBoardAware>
                <CommonImageBackground common>
                    <Header
                        style={{
                            marginTop: '12%',
                        }}
                        commonHeader
                        title="Payment Option"
                    />
                    <View style={[styles.preferredContainer, { marginTop: "10%" }]}>
                        <View style={styles.containerPre}>
                            <FastImage tintColor={colors.white} source={CurrentStar} resizeMode="contain" style={styles.currentStar} />
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                {'  '}PREFERRED PAYMENT
                            </AppText>
                        </View>
 
 {/* <TouchableOpacity style={{width:100,height:100,backgroundColor:'red'
 }} onPress={()=>{
    PayUpi()
 }}></TouchableOpacity> */}
                       
                        {data?.map((item) => {
                            const isAppInstalled =
                                (item.packageName === "com.phonepe.app" && isPhonePeInstalled) ||
                                (item.packageName === "net.one97.paytm" && isPaytmInstalled) ||
                                (item.packageName === "com.google.android.apps.nbu.paisa.user" && isGPayInstalled)

                                console.log(isAppInstalled,'==');
                                
                            if (isAppInstalled) {
                                return (
                                    <View style={styles.upiConatiner} key={item.id}>
                                        <View style={styles.underContainer}>
                                            <FastImage source={item.icon} style={styles.appIcon} />
                                            <AppText weight={POPPINS_MEDIUM}>
                                                UPI{'\n'}
                                                <AppText weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>
                                                    {item.appName}
                                                </AppText>
                                            </AppText>
                                        </View>
                                        <TouchableOpacityView
                                            onPress={() => PayUpi(item.packageName)}
                                            style={styles.payContainer}
                                        >
                                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                                ADD ₹{amount}
                                            </AppText>
                                        </TouchableOpacityView>
                                    </View>
                                );
                            }
                        })}


                    </View>
                    {upiApps && <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <AppText color={WHITE} type={FORTEEN}>Please Install UPI Apps in your Device to add funds</AppText>
                        <AppText color={WHITE} type={FORTEEN}>Ex. Paytm, Phonepe,Gpay.</AppText>
                    </View>}
                    {/* <View style={[styles.preferredContainer, {
                        flexDirection: "row",
                        alignItems: "center", justifyContent: "space-between"
                    }]}>
                        <View style={styles.underContainer}>
                            <FastImage tintColor={colors.white} source={panCard} resizeMode="contain" style={styles.cardIcon} />
                            <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD}>
                                {'  '}Pay With Card
                            </AppText>
                        </View>
                        <TouchableOpacityView onPress={() => PayCard()} style={styles.payContainer}>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                ADD ₹{amount}
                            </AppText>
                        </TouchableOpacityView>
                    </View> */}
                </CommonImageBackground>
            </KeyBoardAware>
            <RBSheet
                ref={sheet}
                closeOnDragDown={true}
                height={201}
                customStyles={{
                    container: {
                        height: Screen.Height
                    },
                    draggableIcon: {
                        backgroundColor: 'transparent',
                        display: 'none',
                    },
                }}>
                <WebViewComponent />
            </RBSheet>
        </AppSafeAreaView>
    )
};
export default PaymentScreen;
const styles = StyleSheet.create({
    preferredContainer: {
        paddingHorizontal: universalPaddingHorizontal,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.gray,
        marginHorizontal: universalPaddingHorizontal,
        borderRadius: 10,
        marginVertical: 10
    },
    currentStar: {
        height: 20,
        width: 20,
        marginBottom: 2
    },
    containerPre: {
        flexDirection: "row",
        alignItems: "center"
    },
    upiConatiner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10
    },
    appIcon: {
        height: 35,
        width: 35,
        borderRadius: 10,
        marginRight: 10
    },
    underContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    payContainer: {
        height: 35,
        borderRadius: 10,
        backgroundColor: colors.borderBackColor,
        width: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    cardIcon: {
        height: 35,
        width: 35
    }
})