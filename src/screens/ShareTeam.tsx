import React, { useState } from "react";
import { Dimensions, ImageBackground, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { AppSafeAreaView } from "../common/AppSafeAreaView";
import CommonImageBackground from "../common/commonImageBackground";
import { CAPTAIN, LEFT_ARROW, VICE_CAPTAIN, blurBackground, green_ground, wicket_keeperIcon } from "../helper/image";
import { universalPaddingHorizontal } from "../theme/dimens";
import { TouchableOpacityView } from "../common/TouchableOpacityView";
import NavigationService from "../navigation/NavigationService";
import FastImage from "react-native-fast-image";
import { AppText, ELEVEN, FORTEEN, POPPINS_BOLD, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TEN, THIRTEEN, TWELVE, WHITE } from "../common/AppText";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../theme/color";
import { modifyName } from "../helper/utility";
import { getAllPlayerList, getMyTeam, setAllPlayers, setIsContestEntry } from "../slices/matchSlice";
import { SELECT_PLAYER } from "../navigation/routes";
import { LiveTime } from "../common/LiveTime";


const ShareTeam = ({ route }: any) => {
    const dispatch = useDispatch();
    const contestData = useSelector((state: any) => state?.match?.contestData);
    const saveTeamShare = useSelector((state: any) => state?.match?.saveTeamShare);
    let players_List = route?.params?.selectedPlayerDetails ?? [];
    let useDetails = route?.params?.useDetails ?? {};
    const currentDate = new Date();
    const inputDate = new Date(contestData?.StartDateTime);
    const isPastTime = inputDate < currentDate;
    const [removeTabs, setRemoveTabs] = useState(false)
    const convertToTeamsTitle2 = (arr: any) => {
        const TeamsTitle2 = arr && arr?.map((title: any) => title.trim());
        return TeamsTitle2;
    };
    const removedSpacesTeamsTitle = convertToTeamsTitle2(
        contestData?.TeamsShortNames,
    );
    const firstTeamCount = route?.params?.selectedPlayerDetails?.filter(
        (item: any) =>
            item?.primary_team?.abbr === removedSpacesTeamsTitle[0] && removedSpacesTeamsTitle[0] &&
            !item?.substitute,
    )?.length;
    const secondTeamCount = route?.params?.selectedPlayerDetails?.filter(
        (item: any) =>
            item?.primary_team?.abbr === removedSpacesTeamsTitle[1] && removedSpacesTeamsTitle[1] &&
            !item?.substitute,
    )?.length;
    let wicket_keepers_list = players_List?.filter((item: any) => {
        return item?.substitute
            ? item?.playing_role === 'wk' && item?.substitute === false
            : item?.playing_role === 'wk';
    });
    let bowlers_list = players_List?.filter((item: any) => {
        return item?.substitute
            ? item?.playing_role === 'bowl' && item?.substitute === false
            : item?.playing_role === 'bowl';
    });
    let batsman_list = players_List?.filter((item: any) => {
        return item?.substitute
            ? item?.playing_role === 'bat' && item?.substitute === false
            : item?.playing_role === 'bat';
    });
    let all_rounder_list = players_List?.filter((item: any) => {
        return item?.substitute
            ? item?.playing_role === 'all' && item?.substitute === false
            : item?.playing_role === 'all';
    });
    const onCreateTeam = () => {
        dispatch(setAllPlayers([]))
        let data = { cid: contestData?.SeriesId };
        dispatch(setIsContestEntry(false));
        dispatch(getMyTeam(contestData?._id));
        dispatch(getAllPlayerList(contestData?._id, data, false, {}));
        const captain = players_List?.find((item: any) => item?.caption);
        const viceCaptain = players_List?.find((item: any) => item?.vice_caption);
        NavigationService.navigate(SELECT_PLAYER, {
            contestData,
            isEditMode: false,
            selectedPlayers: players_List,
            team_id: saveTeamShare && saveTeamShare[0]?._id,
            team_name: saveTeamShare && saveTeamShare[0]?.name,
            captain: captain?.pid,
            viceCaptain: viceCaptain?.pid,
            cloneTeam: false,
            shareTeam: true
        });
    }
    return (
        <AppSafeAreaView style={{ flex: 1 }}>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle="light-content"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
            <CommonImageBackground common>
                <ImageBackground
                    style={styles.card}
                    resizeMode="cover"
                    source={blurBackground}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacityView
                            style={{ padding: 5, marginLeft: -5 }}
                            onPress={() => NavigationService.goBack()}>
                            <FastImage
                                source={LEFT_ARROW}
                                resizeMode="contain"
                                style={styles.leftArrow}
                            />
                        </TouchableOpacityView>
                        <View style={styles.userContainer}>
                            <View>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }} >
                                    <AppText type={THIRTEEN}
                                        color={WHITE}
                                        weight={POPPINS_SEMI_BOLD}>
                                        {useDetails?.username}
                                    </AppText>
                                    <View style={styles.teamView}>
                                        <AppText type={THIRTEEN}
                                            color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                            {saveTeamShare && saveTeamShare[0]?.name}
                                        </AppText>
                                    </View>
                                </View>
                                {isPastTime == false ?
                                    <LiveTime
                                        styletext={{ marginTop: 1 }}
                                        type={ELEVEN}
                                        top={true}
                                        details={contestData}
                                        setRemoveTabs={setRemoveTabs}
                                    /> :
                                    <AppText
                                        color={WHITE}
                                        weight={POPPINS_SEMI_BOLD}>
                                        {saveTeamShare && saveTeamShare[0]?.total_points} pts
                                    </AppText>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: "center" }} >
                                <View style={styles.titleNameContainer}>
                                    <AppText
                                        color={WHITE}
                                        type={FORTEEN}
                                        weight={POPPINS_SEMI_BOLD}>
                                        {contestData?.TeamsShortNames && contestData?.TeamsShortNames?.length !== 0
                                            ? contestData?.TeamsShortNames[0]
                                            : ''}
                                    </AppText>
                                </View>
                                <AppText color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                    {' '}{firstTeamCount} : {secondTeamCount}{' '}
                                </AppText>
                                <View style={styles.secondTitleNameContainer}>
                                    <AppText
                                        style={{ fontSize: 12, color: 'black', marginTop: 1 }}
                                        type={FORTEEN}
                                        weight={POPPINS_SEMI_BOLD}>
                                        {contestData?.TeamsShortNames &&
                                            contestData?.TeamsShortNames.length >= 1 &&
                                            contestData?.TeamsShortNames[1]}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <ImageBackground resizeMode={"stretch"}
                    style={{
                        flexGrow: 1,
                    }}
                    source={green_ground}>
                    <ScrollView
                        scrollEnabled={true}
                        style={{ flex: 1, }}
                        contentContainerStyle={styles.playerListContainer}>
                        <AppText
                            type={TWELVE}
                            style={[
                                styles.title,
                                { marginTop: route?.params?.myTeam ? '-5%' : -30 },
                            ]}
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            WICKET KEEPER ({wicket_keepers_list?.length})
                        </AppText>
                        <View style={styles.playerContainer}>
                            {wicket_keepers_list?.map((item: any, index: any) => {
                                const playercolor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? '#000000'
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? '#FFFFFF'
                                            : null;
                                const TextColor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? "#FFFFFF"
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? "#000000"
                                            : null;
                                return (
                                    <View
                                        style={[
                                            styles.singlePlayerContainer,
                                            {
                                                marginLeft: index == 0 ? 0 : 20,
                                            },
                                        ]}
                                        key={item?._id}>
                                        <FastImage style={[styles.capVcIcon, { left: index == 0 ? -8 : 2, }]}
                                            resizeMode="contain"
                                            source={
                                                item?.vice_caption == true
                                                    ? VICE_CAPTAIN
                                                    : item?.caption == true
                                                        ? CAPTAIN
                                                        : null
                                            }
                                        />
                                        <FastImage
                                            source={item?.profile_image ? { uri: item?.profile_image } : wicket_keeperIcon}
                                            style={styles.playerImage}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={[styles.textContainer, {
                                                backgroundColor: `${playercolor}`,
                                            }]}>
                                            <AppText
                                                style={[styles.playerName, { color: TextColor }]}
                                                type={TEN}>
                                                {modifyName(item?.first_name)}
                                            </AppText>
                                            {item?.playing11 == undefined ? (
                                                <></>
                                            ) : (
                                                <>
                                                    {item?.playing11 == 'false' ? (
                                                        <View style={styles.redDot}
                                                        />
                                                    ) : (
                                                        <View style={styles.greenDot}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </View>
                                        <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                                            {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                                        </AppText>
                                    </View>
                                );
                            })}

                        </View>
                        <AppText
                            type={TWELVE}
                            style={styles.title2}
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            BATSMAN ({batsman_list?.length})
                        </AppText>
                        <View style={styles.playerContainer}>
                            {batsman_list?.map((item: any, index: any) => {
                                const playercolor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? '#000000'
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? '#FFFFFF'
                                            : null;
                                const TextColor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? "#FFFFFF"
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? "#000000"
                                            : null;
                                return (
                                    <View
                                        style={[
                                            styles.singlePlayerContainer,
                                            {
                                                marginLeft: index == 0 ? 0 : 20,
                                            },
                                        ]}
                                        key={item?._id}>
                                        <FastImage style={[styles.capVcIcon, { left: index == 0 ? -3 : -12, }]}
                                            resizeMode="contain"
                                            source={
                                                item?.vice_caption == true
                                                    ? VICE_CAPTAIN
                                                    : item?.caption == true
                                                        ? CAPTAIN
                                                        : null
                                            }
                                        />
                                        <FastImage
                                            source={item?.profile_image ? { uri: item?.profile_image } : wicket_keeperIcon}
                                            style={styles.playerImage}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={[styles.textContainer, {
                                                backgroundColor: `${playercolor}`,
                                            }]}>
                                            <AppText
                                                style={[styles.playerName, { color: TextColor }]}
                                                type={TEN}>
                                                {modifyName(item?.first_name)}
                                            </AppText>
                                            {item?.playing11 == undefined ? (
                                                <></>
                                            ) : (
                                                <>
                                                    {item?.playing11 == 'false' ? (
                                                        <View style={styles.redDot}
                                                        />
                                                    ) : (
                                                        <View style={styles.greenDot}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </View>
                                        <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                                            {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                                        </AppText>
                                    </View>
                                );
                            })}

                        </View>
                        <AppText
                            type={TWELVE}
                            style={styles.title2}
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            ALL ROUNDERS ({all_rounder_list?.length})
                        </AppText>
                        <View style={styles.playerContainer}>
                            {all_rounder_list?.map((item: any, index: any) => {
                                const playercolor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? '#000000'
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? '#FFFFFF'
                                            : null;
                                const TextColor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? "#FFFFFF"
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? "#000000"
                                            : null;
                                return (
                                    <View
                                        style={[
                                            styles.singlePlayerContainer,
                                            {
                                                marginLeft: index == 0 ? 0 : 20,
                                            },
                                        ]}
                                        key={item?._id}>
                                        <FastImage style={[styles.capVcIcon, { left: 0, }]}
                                            resizeMode="contain"
                                            source={
                                                item?.vice_caption == true
                                                    ? VICE_CAPTAIN
                                                    : item?.caption == true
                                                        ? CAPTAIN
                                                        : null
                                            }
                                        />
                                        <FastImage
                                            source={item?.profile_image ? { uri: item?.profile_image } : wicket_keeperIcon}
                                            style={styles.playerImage}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={[styles.textContainer, {
                                                backgroundColor: `${playercolor}`,
                                            }]}>
                                            <AppText
                                                style={[styles.playerName, { color: TextColor }]}
                                                type={TEN}>
                                                {modifyName(item?.first_name)}
                                            </AppText>
                                            {item?.playing11 == undefined ? (
                                                <></>
                                            ) : (
                                                <>
                                                    {item?.playing11 == 'false' ? (
                                                        <View style={styles.redDot}
                                                        />
                                                    ) : (
                                                        <View style={styles.greenDot}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </View>
                                        <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                                            {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                                        </AppText>
                                    </View>
                                );
                            })}

                        </View>
                        <AppText
                            type={TWELVE}
                            style={styles.title2}
                            weight={POPPINS_SEMI_BOLD}
                            color={WHITE}>
                            BOWLERS ({bowlers_list?.length})
                        </AppText>
                        <View style={styles.playerContainer}>
                            {bowlers_list?.map((item: any, index: any) => {
                                const playercolor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? '#000000'
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? '#FFFFFF'
                                            : null;
                                const TextColor =
                                    `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[0]
                                        ? "#FFFFFF"
                                        : `${item?.teamName ? item?.teamName : item?.primary_team?.abbr}` === removedSpacesTeamsTitle[1]
                                            ? "#000000"
                                            : null;
                                return (
                                    <View
                                        style={[
                                            styles.singlePlayerContainer,
                                            {
                                                marginLeft: index == 0 ? 0 : 20,
                                            },
                                        ]}
                                        key={item?._id}>
                                        <FastImage style={[styles.capVcIcon, { left: 0, }]}
                                            resizeMode="contain"
                                            source={
                                                item?.vice_caption == true
                                                    ? VICE_CAPTAIN
                                                    : item?.caption == true
                                                        ? CAPTAIN
                                                        : null
                                            }
                                        />
                                        <FastImage
                                            source={item?.profile_image ? { uri: item?.profile_image } : wicket_keeperIcon}
                                            style={styles.playerImage}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={[styles.textContainer, {
                                                backgroundColor: `${playercolor}`,
                                            }]}>
                                            <AppText
                                                style={[styles.playerName, { color: TextColor }]}
                                                type={TEN}>
                                                {modifyName(item?.first_name)}
                                            </AppText>
                                            {item?.playing11 == undefined ? (
                                                <></>
                                            ) : (
                                                <>
                                                    {item?.playing11 == 'false' ? (
                                                        <View style={styles.redDot}
                                                        />
                                                    ) : (
                                                        <View style={styles.greenDot}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </View>
                                        <AppText weight={POPPINS_MEDIUM} color={WHITE}>
                                            {item?.playing11 == undefined ? `${item?.fantasy_player_rating} Cr` : item?.points ? `${item?.points} Pts` : item?.points == 0 ? '0 Pts' : `${item?.fantasy_player_rating} Cr`}
                                        </AppText>
                                    </View>
                                );
                            })}

                        </View>
                    </ScrollView>
                    {isPastTime == false ?
                        <TouchableOpacityView
                            onPress={onCreateTeam}
                            style={[
                                styles.btn,
                                styles.createContest,
                                {
                                    width: '70%',
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#323232',
                                    alignSelf: 'center',
                                    marginBottom: 5
                                },
                            ]}>
                            <AppText
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                                weight={POPPINS_SEMI_BOLD}>
                                PICK THIS TEAM
                            </AppText>
                        </TouchableOpacityView>
                        : <></>}
                </ImageBackground>
            </CommonImageBackground>
        </AppSafeAreaView >
    )
}
export default ShareTeam;
const styles = StyleSheet.create({
    secondImage: {
        flex: 1,
    },
    card: {
        height: 90,
        width: Dimensions.get('window').width,
        paddingHorizontal: universalPaddingHorizontal,
        backgroundColor: "#ffffff20",
    },
    leftArrow: {
        height: 16,
        width: 16,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    userContainer: {
        marginLeft: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1
    },
    teamView: {
        height: 25,
        width: 25,
        borderRadius: 5,
        backgroundColor: '#00000030',
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5
    },
    titleNameContainer: {
        paddingHorizontal: 10,
        backgroundColor: colors.black,
        borderRadius: 2,
        alignItems: 'center',
        marginBottom: 2,
    },
    secondTitleNameContainer: {
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 2,
        marginBottom: 2,
    },
    playerListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        textAlign: 'center',
        marginTop: 20,
    },
    playerContainer: {
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        // justifyContent: 'center'\
        justifyContent: 'space-evenly',
        width: '100%',
        paddingHorizontal: 10
    },
    singlePlayerContainer: {
        alignItems: 'center',
        marginTop: 0,
    },
    playerImage: {
        height: 58,
        width: 42,
    },
    playerName: {
        padding: 2,
        paddingHorizontal: 5,
        borderRadius: 2,
    },
    capVcIcon: {
        height: 18,
        width: 18,
        position: 'absolute',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 5,
        borderRadius: 4,
        marginTop: -7
    },
    redDot: {
        height: 5,
        width: 5,
        borderRadius: 100,
        backgroundColor: '#FF0000',
        marginTop: -1
    },
    greenDot: {
        height: 5,
        width: 5,
        borderRadius: 100,
        backgroundColor: '#0BFF15',
        marginTop: -1
    },
    title2: {
        textAlign: 'center',
        marginTop: 10,
    },
    btn: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 1)"
    },
    createContest: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 1)',
    },
})