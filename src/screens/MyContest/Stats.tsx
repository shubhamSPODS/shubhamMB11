import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AppText, BLACK, EIGHT, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TEN, THIRTEEN, WHITE } from "../../common/AppText";
import { universalPaddingHorizontal } from "../../theme/dimens";
import { useDispatch, useSelector } from "react-redux";
import { SaveTeamNameStats, getAllPlayerList, saveFilterStatsPlayer, savePointsFilter, saveSavePid } from "../../slices/matchSlice";
import { TouchableOpacityView } from "../../common/TouchableOpacityView";
import FastImage from "react-native-fast-image";
import { all_rounderIcon, batsmanIcon, bowlerIcon, downArrow, dropDownRed, wicket_keeperIcon } from "../../helper/image";
import { colors } from "../../theme/color";
import { modifyNameTwo } from "../../helper/utility";
import LinearGradient from "react-native-linear-gradient";

const Stats = () => {
    const dispatch = useDispatch();
    const contestData = useSelector((state: any) => state?.match?.contestData);
    const allPlayers = useSelector((state: any) => state?.match?.allPlayers);
    const myTeam = useSelector((state: any) => state?.match?.myTeams);
    const saveTeamNameStats = useSelector((state: any) => state?.match?.saveTeamNameStats);
    const SavePidstats = useSelector((state: any) => state?.match?.SavePidstats);
    const saveStatsPlayer = useSelector((state: any) => state?.match?.saveStatsPlayer);
    const pointsFilterStats = useSelector((state: any) => state?.match?.pointsFilterStats);
    const [dropDown, setDropDown] = useState(false);
    const [random, setRandom] = useState(false);


    useEffect(() => {
        const FilteredPlayer = allPlayers
            .filter((item: any) => item)
            .map((item: any) => {
                const matchedPlayer = myTeam[0]?.players?.find(
                    (teamPlayer: any) => teamPlayer?.pid === item?.pid,
                );

                return {
                    ...item,
                    caption: matchedPlayer?.caption || false,
                    vice_caption: matchedPlayer?.vice_caption || false,
                    Myplayer: Boolean(matchedPlayer),
                };
            });
        const lowPricedItems = FilteredPlayer.slice().sort((a, b) => {
            return b.points - a.points;
        });
        dispatch(saveFilterStatsPlayer(lowPricedItems));
        dispatch(saveSavePid(myTeam[0]?._id));
        dispatch(savePointsFilter('low'));
        dispatch(SaveTeamNameStats(myTeam[0]?.name));
    }, [allPlayers]);
    const renderitem = ({ item }: any) => {
        const playerIcon =
            item?.playing_role === 'wk'
                ? wicket_keeperIcon
                : item?.playing_role === 'bowl'
                    ? bowlerIcon
                    : item?.playing_role === 'bat'
                        ? batsmanIcon
                        : item?.playing_role === 'all'
                            ? all_rounderIcon
                            : null;
        return item?.Myplayer == false ? (
            <View style={styles.container}>
                <FastImage
                    source={item?.profile_image ? { uri: item?.profile_image } : playerIcon}
                    style={styles.playerImage}
                    resizeMode="contain"
                />
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <AppText>
                        {modifyNameTwo(item?.first_name)}
                    </AppText>
                    <AppText numberOfLines={1} weight={POPPINS_MEDIUM} type={TEN}>
                        {item?.teamName}
                    </AppText>
                </View>
                <AppText>
                    {item?.points} Pts
                </AppText>
            </View>
        ) : (
            <LinearGradient
                style={styles.container}
                colors={["#343434", "#3EAA35"]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 0 }}>
                <FastImage
                    source={item?.profile_image ? { uri: item?.profile_image } : playerIcon}
                    style={styles.playerImage}
                    resizeMode="contain"
                />
                {item?.caption && (
                    <View style={styles.captainBedge}>
                        <AppText style={{ marginTop: 2}} type={EIGHT} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                            C
                        </AppText>
                    </View>
                )}
                {item?.vice_caption && (
                    <View style={styles.captainBedge}>
                        <AppText style={{ marginTop: 2}} type={EIGHT} color={BLACK} weight={POPPINS_SEMI_BOLD}>
                            VC
                        </AppText>
                    </View>
                )}
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <AppText>
                        {modifyNameTwo(item?.first_name)}
                    </AppText>
                    <AppText numberOfLines={1} weight={POPPINS_MEDIUM} type={TEN}>
                        {item?.teamName}
                    </AppText>
                </View>
                <AppText>
                    {item?.points} Pts
                </AppText>
            </LinearGradient>
        )
    };
    const renderitemOfTeam = ({ item, index }) => {
        return (
            <TouchableOpacityView
                onPress={() => {
                    filterMyplayer(item?.players),
                        dispatch(saveSavePid(item?._id)),
                        dispatch(SaveTeamNameStats(item?.name));
                }}
                style={[
                    styles.selectTeamConatiner,
                    {
                        marginLeft: myTeam.length + 1 == index ? 0 : 10,
                        marginRight: myTeam.length - 1 == index ? 10 : 0,
                        backgroundColor: SavePidstats == item?._id ? '#F0E6A5' : '#3F3F3F',
                    },
                ]}>
                <AppText
                    style={{ fontSize: 8 }}
                    weight={POPPINS_SEMI_BOLD}
                    color={SavePidstats == item?._id ? BLACK : WHITE}>
                    {item.name}
                </AppText>
                <AppText
                    style={{ fontSize: 8, marginTop: -5 }}
                    weight={POPPINS_SEMI_BOLD}
                    color={SavePidstats == item?._id ? BLACK : WHITE}>
                    {item?.total_points} Pts
                </AppText>
            </TouchableOpacityView>
        );
    };
    const filterMyplayer = (itemPlayers: any) => {
        const FilteredPlayer = allPlayers
            .filter((item: any) => item?.playing11 == 'true')
            .map((item: any) => {
                const matchedPlayer = itemPlayers?.find(
                    (teamPlayer: any) => teamPlayer?.pid === item?.pid,
                );

                return {
                    ...item,
                    caption: matchedPlayer?.caption || false,
                    vice_caption: matchedPlayer?.vice_caption || false,
                    Myplayer: Boolean(matchedPlayer),
                };
            });
        const lowPricedItems = FilteredPlayer.slice().sort((a, b) => {
            return b.points - a.points;
        });
        dispatch(saveFilterStatsPlayer(lowPricedItems));
        dispatch(savePointsFilter('low'));
        setRandom(Math.random());
    };
    const filterHighLowpoints = () => {
        if (pointsFilterStats == 'high') {
            const highPricedItems = saveStatsPlayer.slice().sort((a, b) => {
                return b.points - a.points;
            });
            dispatch(saveFilterStatsPlayer(highPricedItems));
            dispatch(savePointsFilter('low'));
        } else if (pointsFilterStats == 'low') {
            const lowPricedItems = saveStatsPlayer.slice().sort((a, b) => {
                return a.points - b.points;
            });
            dispatch(saveFilterStatsPlayer(lowPricedItems));
            dispatch(savePointsFilter('high'));
        }
    };

    return (
        <>
            {myTeam?.length > 1 ? (
                <>
                    <View style={styles.TopHeaderToFilter}>
                        <AppText color={WHITE} weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>
                            Player state at match level
                        </AppText>
                        <TouchableOpacityView
                            onPress={() => setDropDown(!dropDown)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <AppText color={WHITE} weight={POPPINS_SEMI_BOLD} type={THIRTEEN}>
                                Highlight {saveTeamNameStats}
                            </AppText>
                            <FastImage
                                source={downArrow}
                                tintColor={colors.white}
                                resizeMode="contain"
                                style={{
                                    height: 20,
                                    width: 20,
                                    transform: [{ rotate: dropDown ? '0deg' : '180deg' }],
                                }}
                            />
                        </TouchableOpacityView>
                    </View>
                    {dropDown ? (
                        <View>
                            <FlatList
                                data={myTeam}
                                renderItem={renderitemOfTeam}
                                keyExtractor={(item, index) => {
                                    index.toString();
                                }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ marginTop: 10 }}
                            />
                        </View>
                    ) : (<></>)}
                </>
            ) : (<></>)}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AppText type={TEN}>
                        PLAYERS
                    </AppText>
                    <AppText type={TEN}>
                        {'         '}NAME
                    </AppText>
                </View>
                <TouchableOpacityView onPress={() => filterHighLowpoints()}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        flex: 1,
                    }}>
                    <AppText type={TEN}>
                        POINTS
                    </AppText>
                    <FastImage
                        source={dropDownRed}
                        resizeMode="contain"
                        style={{
                            height: 13,
                            width: 13,
                            marginTop: -2,
                            transform: [
                                { rotate: pointsFilterStats == 'high' ? '180deg' : '0deg' },
                            ],
                        }}
                    />
                </TouchableOpacityView>
            </View>
            <View style={{ flex: 1, marginBottom: 10 }}>
                <FlatList
                    renderItem={renderitem}
                    data={saveStatsPlayer}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index?.toString()}
                    contentContainerStyle={{
                        marginTop: 10, width: '100%',
                        alignSelf: 'center',
                    }}
                />
            </View>
        </>
    )
};
export default Stats;
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: '#3F3F3F',
        paddingHorizontal: universalPaddingHorizontal,
        paddingVertical: 10,
        marginTop: 10
    },
    TopHeaderToFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    selectTeamConatiner: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: "#343434",
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    playerImage: {
        height: 45,
        width: 33,
        marginLeft:10
    },
    captainBedge: {
        height: 18,
        width: 18,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
        position: 'absolute',
        left: 3,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        top: 3,
    },
})