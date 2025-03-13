import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText, BLUE, EIGHT, GREEN, POPPINS_BOLD, POPPINS_SEMI_BOLD, RED, TEN, WHITE } from "./AppText";
import FastImage from "react-native-fast-image";
import { downArrow, subsituteAdd, subsituteAddRed, substituteIcon } from "../helper/image";
import { NewColor, colors } from "../theme/color";
import LinearGradient from "react-native-linear-gradient";
import { modifyName, playerRollImageThree, playerRollImageTwo } from "../helper/utility";
import { TouchableOpacityView } from "./TouchableOpacityView";

const ReplacedPlayer = ({ replacedPlayers, notReplacedSubstitutes, refRBSheetReplaced }: any) => {
    return (
        <View>
            <TouchableOpacityView
                onPress={() => refRBSheetReplaced?.current?.close()}
                style={styles.headerContainer}>
                <View style={styles.underContainer} >
                    <AppText color={WHITE} weight={POPPINS_SEMI_BOLD}>
                        {replacedPlayers?.length ? 'Replaced Player ' : ''}<AppText color={RED} weight={POPPINS_SEMI_BOLD}>{notReplacedSubstitutes?.length && replacedPlayers?.length ? '& ' : ''}</AppText>{notReplacedSubstitutes?.length ? 'Not Replaced Player  ' : ''}
                    </AppText>
                    <FastImage style={styles.subsituteIcon} resizeMode="contain" source={substituteIcon} />
                </View>
                <FastImage source={downArrow} tintColor={colors.white} resizeMode="contain" style={styles.downArrowStyle} />
            </TouchableOpacityView>
            <View style={styles.singleLine} />
            {replacedPlayers?.length ? 
            <View style={styles.miniHeader}>
                <AppText color={GREEN} weight={POPPINS_SEMI_BOLD}>
                    In
                </AppText>
                <AppText color={RED} weight={POPPINS_SEMI_BOLD}>
                    Out
                </AppText>
            </View>
            :<></>}
            {replacedPlayers?.map((item: any) => {
                return (
                    <View style={styles.renderContainer}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.green, colors.rbSheetBack]} style={styles.inContainer}>
                            <View style={styles.underRenderContainer}>
                                <AppText
                                    style={styles.subConaitner}
                                    type={EIGHT}
                                    color={WHITE}
                                    weight={POPPINS_BOLD}>
                                    SUB-{item?.substitute?.numberid}
                                </AppText>
                                <FastImage
                                    source={playerRollImageTwo(item?.substitute)}
                                    style={styles.playerImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.nameRollContainer}>
                                    <AppText type={TEN} color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                        {modifyName(item?.substitute?.first_name)}
                                    </AppText>
                                    <AppText style={styles.rollContainer} color={WHITE} type={TEN} weight={POPPINS_SEMI_BOLD}>
                                        {item?.substitute?.primary_team?.abbr}-{item?.substitute?.playing_role.toUpperCase()}
                                    </AppText>
                                </View>
                            </View>
                            <View style={{
                                alignItems: "flex-end",
                                justifyContent: "center",
                                marginTop: 6
                            }} >
                                <FastImage source={subsituteAdd} resizeMode="contain" style={styles.upIcon} />
                                <AppText type={TEN} color={WHITE} weight={POPPINS_BOLD} >
                                    {item?.substitute?.points} Pts
                                </AppText>
                            </View>
                        </LinearGradient>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.rbSheetBack, colors.lightRed]} style={styles.outContainer}>
                            <View style={{
                                alignItems: "flex-start",
                                justifyContent: "center",
                                marginTop: 6
                            }} >
                                <FastImage source={subsituteAddRed} resizeMode="contain" style={styles.upIcon} />
                                <AppText type={TEN} color={WHITE} weight={POPPINS_BOLD} >
                                    {item?.replaced?.points} Pts
                                </AppText>
                            </View>
                            <View style={styles.underRenderContainer}>
                                <View style={styles.nameRollContainer}>
                                    <AppText type={TEN} color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                        {modifyName(item?.replaced?.first_name)}
                                    </AppText>
                                    <AppText style={styles.rollContainer} color={WHITE} type={TEN} weight={POPPINS_SEMI_BOLD}>
                                        {item?.replaced?.primary_team?.abbr}-{item?.replaced?.playing_role.toUpperCase()}
                                    </AppText>
                                </View>
                                <FastImage
                                    source={playerRollImageThree(item?.replaced)}
                                    style={styles.playerImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </LinearGradient>
                    </View>
                )
            })}
            <AppText style={{ marginTop: 10 }} color={WHITE} weight={POPPINS_BOLD}>
                Unused Subsitute
            </AppText>
            {notReplacedSubstitutes?.map((item: any) => {
                return (
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[NewColor.linerBlacklightEight, colors.rbSheetBack]} style={styles.inContainer}>
                        <View style={styles.underRenderContainer}>
                            <AppText
                                style={styles.subConaitner}
                                type={EIGHT}
                                color={WHITE}
                                weight={POPPINS_BOLD}>
                                SUB-{item?.numberid}
                            </AppText>
                            <FastImage
                                source={playerRollImageTwo(item)}
                                style={styles.playerImage}
                                resizeMode="contain"
                            />
                            <View style={styles.nameRollContainer}>
                                <AppText type={TEN} color={WHITE} weight={POPPINS_SEMI_BOLD}>
                                    {modifyName(item?.first_name)}
                                </AppText>
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <View style={[styles.dotView, { backgroundColor: item?.playing11 == 'false' ? '#FF0000' : '#0BFF15' }]} />
                                    <AppText style={styles.rollContainer} color={WHITE} type={TEN} weight={POPPINS_SEMI_BOLD}>
                                        {item?.primary_team?.abbr}-{item?.playing_role.toUpperCase()}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                )
            })}
        </View>
    )
}
export default ReplacedPlayer
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10
    },
    downArrowStyle: {
        height: 25, width: 25
    },
    subsituteIcon: {
        height: 13,
        width: 13,
    },
    underContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    singleLine: {
        height: 1,
        width: '100%',
        backgroundColor: colors.white
    },
    miniHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "5%"
    },
    renderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inContainer: {
        width: '48%',
        height: 40,
        marginVertical: 2,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        justifyContent: "space-between"
    },
    outContainer: {
        width: '48%',
        height: 40,
        marginVertical: 2,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        justifyContent: "space-between"
    },
    playerImage: {
        height: 48,
        width: 32,
        marginBottom: -7
    },
    subConaitner: {
        position: "absolute",
        top: 0,
        left: 2
    },
    rollContainer: {
        marginTop: -5
    },
    nameRollContainer: {
        marginLeft: 5,
        marginTop: 5
    },
    upIcon: {
        height: 15,
        width: 15
    },
    underRenderContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    dotView: {
        height: 5,
        width: 5,
        marginTop: -7, marginRight: 5,
        borderRadius: 50
    }
})