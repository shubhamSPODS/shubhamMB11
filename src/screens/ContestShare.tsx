import React, { useEffect, useState } from "react";
import { BackHandler, Share, StatusBar, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import { AppText, BLACK, BLACKOPACITY, ELEVEN, POPPINS_BOLD, POPPINS_SEMI_BOLD, THIRTEEN, WHITE } from "../common/AppText";
import CommonImageBackground from "../common/commonImageBackground";
import FastImage from "react-native-fast-image";
import { CLOSE_WHITE_ICON, SHARE } from "../helper/image";
import { colors } from "../theme/color";
import { universalPaddingHorizontal } from "../theme/dimens";
import { LiveTime } from "../common/LiveTime";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import { formatDateTime } from "../helper/utility";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import NavigationService from "../navigation/NavigationService";
import { MY_CONTEST } from "../navigation/routes";

export const createLink = async (id: any, category: any) => {
    try {
        const link = await dynamicLinks().buildShortLink({
            link: `https://mybattle11.page.link/eNh4?match_id=${id}&category=${category}`,
            domainUriPrefix: 'https://mybattle11.page.link',
            android: {
                packageName: 'com.mybattle11'
            },
            navigation: {
                forcedRedirectEnabled: true,
            },
        }, dynamicLinks.ShortLinkType.DEFAULT);
        return link;
    } catch (error) {
    }
};
export const shareLinkTeam = async (
    prize: any,
    enterfess: any,
    Contestsize: any,
    teamA: any,
    id: any,
    category: any,
    onlyDate: any,
    onlyTime: any,
) => {
    const link = await createLink(id, category);
    const message = `I have challenged you to a ₹${prize} private contest for the ${teamA} match! \n \nEnter: ₹${enterfess} \nSport: ${Contestsize} \n1st Prize: ₹${prize}\nDeadline: ${onlyDate} ${onlyTime}\n \nHere are two ways for you to join: ${link}`;
    try {
        Share.share({
            message: message,
        });
    } catch (error) {
    }
};
const ContestShare = () => {
    const MyCreateContestData = useSelector((state: any) => state?.match?.MyCreateContestData);
    const MatchDetails = useSelector((state: any) => state?.match?.MatchDetails);
    const contestData = useSelector((state: any) => state?.match?.contestData);
    const [removeTabs, setRemoveTabs] = useState(false)
    const lastObject = MyCreateContestData.slice(-1)[0];
    const formattedDateTime = formatDateTime(contestData?.StartDateTime);
    let dateArray = formattedDateTime?.split(' ');
    let dateArrayTwo = formattedDateTime.split(' ');
    let dateArrayThree = formattedDateTime.split(' ');
    let onlyTime = dateArrayThree[1] + ' ' + dateArrayTwo[2]
    let onlyDate = dateArray[0];
    const prize =
        (lastObject?.data?.WinningAmount *
            lastObject?.data?.Rankdata[0]?.TotalPercentage) /
        100;
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }, []);

    const handleBackButton = () => {
        NavigationService.navigate(MY_CONTEST)
    };
    return (
        <AppSafeAreaView hidden={false}>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle="dark-content"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <TouchableOpacityView 
                onPress={()=>NavigationService.navigate(MY_CONTEST)}
                style={styles.headerContainer} >
                    <FastImage
                        style={styles.closeIcon}
                        resizeMode="contain"
                        tintColor={colors.black}
                        source={CLOSE_WHITE_ICON}
                    />
                    <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={BLACK}>Contest Share</AppText>
                </TouchableOpacityView>
                <View style={styles.container}>
                    <View style={styles.teamLogo}>
                        <View style={styles.nameUnder}>
                            <FastImage
                                source={{ uri: contestData?.TeamAlogo }}
                                style={styles.teamALogo}
                                resizeMode="contain"
                            />
                            <AppText color={BLACK} weight={POPPINS_BOLD}>
                                {contestData?.TeamsShortNames[0]}
                            </AppText>
                        </View>
                        <View style={styles.timerContainer}>
                            <LiveTime
                                styletext={{ marginTop: 1 }}
                                type={ELEVEN}
                                top={true}
                                details={MatchDetails}
                                setRemoveTabs={setRemoveTabs}
                            />
                        </View>
                        <View style={styles.nameUnder}>
                            <AppText color={BLACK} weight={POPPINS_BOLD}>
                                {contestData?.TeamsShortNames[1]}
                            </AppText>
                            <FastImage
                                source={{ uri: contestData?.TeamBlogo }}
                                style={styles.teamALogo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                    <View style={styles.contestDetails}>
                        <View style={styles.underMin}>
                            <AppText color={BLACK} weight={POPPINS_SEMI_BOLD}>Private Contest</AppText>
                            <AppText color={BLACK} weight={POPPINS_SEMI_BOLD}>Flexible</AppText>
                        </View>
                        <View style={styles.details}>
                            <View style={styles.flex}>
                                <AppText color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}>Max Price Pool</AppText>
                                <AppText color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}>
                                    ₹{lastObject?.data?.WinningAmount}
                                </AppText>
                            </View>
                            <View style={styles.flex}>
                                <AppText color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}>Entry</AppText>
                                <AppText
                                    color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}
                                    style={styles.entry}>
                                    {lastObject?.data?.Contestsize}
                                </AppText>
                            </View>
                            <View>
                                <AppText color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}>Entry</AppText>
                                <AppText
                                    color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}
                                    style={styles.entry}>
                                    ₹{lastObject?.data?.EnteryFee}
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacityView
                    onPress={() =>
                        shareLinkTeam(
                            prize,
                            lastObject?.data?.EnteryFee,
                            lastObject?.data?.Contestsize,
                            MatchDetails?.short_title,
                            lastObject?.match_id,
                            lastObject?.contest_category_id,
                            onlyTime,
                            onlyDate,
                        )
                    }
                    style={styles.buttonConaitner}>
                    <FastImage
                        tintColor={colors.blue}
                        style={styles.shareIcon}
                        resizeMode="contain"
                        source={SHARE}
                    />
                    <AppText
                        weight={POPPINS_SEMI_BOLD}
                        style={styles.moreText}>
                        More Options
                    </AppText>
                </TouchableOpacityView>
            </CommonImageBackground>
        </AppSafeAreaView >
    )
}
export default ContestShare
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "10%",
        paddingHorizontal: universalPaddingHorizontal
    },
    closeIcon: {
        marginRight: 10,
        height: 15, width: 15, marginTop: -2
    },
    container: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3F8BEE30',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    teamLogo: {
        flexDirection: 'row',
        paddingHorizontal: universalPaddingHorizontal,
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    teamALogo: {
        height: 29, width: 36, marginRight: 5
    },
    teamBlogo: {

    },
    nameUnder: {
        flexDirection: "row",
        alignItems: "center",
    },
    timerContainer: {
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff0f5',
        marginLeft: 10,
        marginRight: 10
    },
    contestDetails: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#3E89EC15',
        height: 90,
    },
    underMin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    flex: {
        flex: 1
    },
    entry: {
        marginLeft: 5
    },
    moreText: {
        color: colors.blue, marginTop: 1, marginLeft: 15
    },
    buttonConaitner: {
        paddingVertical: 10,
        borderWidth: 1,
        marginHorizontal: 15,
        borderRadius: 18,
        borderColor: colors.blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareIcon: {
        height: 15, width: 15
    }
})