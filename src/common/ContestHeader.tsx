import React, { useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import { universalPaddingHorizontal } from "../theme/dimens";
import { TouchableOpacityView } from "./TouchableOpacityView";
import FastImage from "@d11/react-native-fast-image";
import { colors } from "../theme/color";
import { LEFT_ARROW, VS, WalletIcon, backIconMain, headerIner, notified, wallet } from "../helper/image";
import NavigationService from "../navigation/NavigationService";
import { AppText, BLACK, GRY, POPPINS, POPPINS_BOLD, POPPINS_SEMI_BOLD, RED, TEN, TWELVE, WHITE } from "./AppText";
import { LiveTime } from "./LiveTime";
import { useSelector } from "react-redux";
import { MY_BALANCE } from "../navigation/routes";
import LinearGradient from "react-native-linear-gradient";
const ContestHeader = ({
    style,
    stylestwo,
    completeMatch,
    setModalRemove,
    walletIco,
    showPopup
}: any) => {
    const [removeTabs, setRemoveTabs] = useState(false);
    const details = useSelector((state: any) => state?.match?.contestData);
    const userData = useSelector((state: any) => {
        return state.profile.userData;
    });
    const { total_balance, cash_bonus, winning_amount, totaldeposit } = userData ?? '';
    let totalbalance = winning_amount + cash_bonus + totaldeposit
    const currentDate: any = new Date();
    const inputDate: any = new Date(details?.StartDateTime);
    const timeDifference = Math.floor(
        (inputDate - currentDate) / (24 * 60 * 60 * 1000),
    );
    return (
        <View style={[styles.container, style]}>
            <View style={styles.top}>
                <TouchableOpacityView style={styles.backarrow}
                    onPress={() => NavigationService.goBack()}>
                    <FastImage
                        source={backIconMain}
                        resizeMode="contain"
                        style={styles.leftArrow}
                    />
                    <AppText>
                        Select Contest
                    </AppText>
                </TouchableOpacityView>
                <TouchableOpacityView
                    onPress={() => NavigationService.navigate(MY_BALANCE)}>
                    <LinearGradient
                        colors={['#C1AA9966', '#C1AA9926']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.walletView}>
                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                            <View style={styles.walletbox}>
                                <FastImage
                                    style={{ height: 12, width: 14, }}
                                    resizeMode="contain"
                                    source={WalletIcon}
                                />
                            </View>
                            <View>
                                <AppText
                                    style={{ marginTop: -1, marginLeft: 7 }}
                                    type={TWELVE}
                                    weight={POPPINS_SEMI_BOLD}
                                    color={WHITE}>
                                    ₹ {Math.round(totalbalance).toFixed(0)}
                                </AppText>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacityView>
            </View>
            <ImageBackground source={headerIner} resizeMode='contain' style={styles.header}>
                <FastImage
                    source={{ uri: details?.TeamAlogo }}
                    style={styles.teamImage}
                    resizeMode="contain"
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppText
                            color={BLACK}
                            weight={POPPINS_BOLD}>
                            {details?.TeamsShortNames && details?.TeamsShortNames[0]}
                        </AppText>
                        <FastImage source={VS}
                            resizeMode='contain'
                            style={{ height: 27, width: 15, marginRight: 5, marginLeft: 5 }} />
                        <AppText
                            color={BLACK}
                            weight={POPPINS_BOLD}>
                            {details?.TeamsShortNames && details?.TeamsShortNames[1]}
                        </AppText>
                    </View>
                    <LiveTime
                        view={true}
                        top={true}
                        details={details}
                        color={completeMatch ? WHITE : timeDifference >= 1 ? BLACK : BLACK}
                        type={TEN}
                        completeMatch={completeMatch}
                        setRemoveTabs={setRemoveTabs}
                    />
                </View>
                <FastImage
                    source={{ uri: details?.TeamBlogo }}
                    style={styles.teamImage}
                    resizeMode="contain"
                />
            </ImageBackground>
            {/* <View style={[styles.card, stylestwo]}>
                <View style={styles.teamContainer}>

                    <View style={styles.detailsContainer}>
                        <FastImage
                            source={{ uri: details?.TeamAlogo }}
                            style={styles.teamImage}
                            resizeMode="contain"
                        />
                        <View style={styles.one}>
                            <View style={styles.two}>
                                <AppText weight={POPPINS_BOLD}>
                                    {details?.TeamsShortNames && details?.TeamsShortNames[0]}
                                </AppText>
                                <AppText
                                    type={TEN}
                                    style={{ marginHorizontal: 5 }}
                                    weight={POPPINS}>
                                    VS
                                </AppText>
                                <AppText weight={POPPINS_BOLD}>
                                    {details?.TeamsShortNames && details?.TeamsShortNames[1]}
                                </AppText>
                            </View>
                            <View style={styles.timeLive}>
                                <LiveTime
                                    view={true}
                                    top={true}
                                    details={details}
                                    color={completeMatch ? WHITE : timeDifference >= 1 ? GRY : RED}
                                    type={TEN}
                                    completeMatch={completeMatch}
                                    setRemoveTabs={setRemoveTabs}
                                />
                            </View>
                        </View>
                        <FastImage
                            source={{ uri: details?.TeamBlogo }}
                            style={styles.teamImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.rightImageContainer}>
                        {walletIco ? (
                            <></>
                        ) : (
                            <></>
                            // <TouchableOpacityView style={{ padding: 5 }} onPress={showPopup}>
                            //     <FastImage
                            //         tintColor={colors.black}
                            //         source={notified}
                            //         style={styles.bellIcon}
                            //     />
                            // </TouchableOpacityView>
                        )}
                        <TouchableOpacityView
                            style={{ padding: 5 }}
                            onPress={() => NavigationService.navigate(MY_BALANCE)}>
                            <FastImage
                                tintColor={colors.black}
                                source={wallet}
                                style={styles.walletIcon}
                            />
                        </TouchableOpacityView>
                    </View>
                </View>
            </View> */}
        </View>
    )
};
export default ContestHeader;
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        marginBottom: 15,
        marginTop: '10%',
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    card: {
        height: 75,
        width: '100%',
        overflow: 'hidden',
    },
    teamContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: universalPaddingHorizontal,
    },
    leftArrow: {
        height: 28,
        width: 28,
        resizeMode: 'contain',
        marginRight: 10,
    },
    teamImage: {
        height: 37,
        width: 37,
        resizeMode: 'contain',
    },
    backarrow: {
        flexDirection: "row", alignItems: "center"
    },
    detailsContainer: {
        flexDirection: 'row', marginLeft: 20
    },
    one: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    two: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeLive: {
        borderRadius: 4,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: colors.lightRed
    },
    rightImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 10,
        flex: 1.2, justifyContent: 'flex-end'
    },
    bellIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    walletIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 12,
    },
    walletView: {
        borderRadius: 59,
        flexDirection: 'row',
        marginTop: 2,
        height: 30,
        width: 80,
        borderWidth: 2,
        borderColor: '#C1AA9966',
        marginLeft: 30
    },
    walletbox: {
        height: 28,
        width: 28, backgroundColor: "#FFFFFF",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#DBA73E"
    },
})