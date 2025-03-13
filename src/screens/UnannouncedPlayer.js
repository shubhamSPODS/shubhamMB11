import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';
import FastImage from "react-native-fast-image";
import { all_rounderIcon, batsmanIcon, bowlerIcon, closeIcon, tick, wicket_keeperIcon } from "../helper/image";
import { colors } from "../theme/color";
import LinearGradient from "react-native-linear-gradient";
import { universalPaddingHorizontal } from "../theme/dimens";
import { modifyName, playerIcon, playerImageUrl } from "../helper/utility";
import { useSelector } from "react-redux";
import { Button } from "./Button";
import { POPPINS_SEMI_BOLD, AppText, BLACK, FORTEEN, SIXTEEN, TEN, TWELVE, WHITE } from "../common/AppText";
import PrimaryButton from "../common/primaryButton";
import { TouchableOpacityView } from "../common/TouchableOpacityView";

const UnannouncedPlayer = ({ Unannounced, onSubmit, UnannouncedTWO, onClose, availableCredits, setAvailableCredits }) => {
    let newData = [...Unannounced]
    const contestData = useSelector(state => state?.match?.contestData);
    const [unannouncesSelect, setUnannouncesSelect] = useState(newData?.length ? newData : [])
    const [random, setRandom] = useState(10)
    const convertToTeamsTitle2 = arr => {
        const TeamsTitle2 = arr && arr?.map(title => title.trim());
        return TeamsTitle2;
    };
    const removedSpacesTeamsTitle = convertToTeamsTitle2(contestData?.TeamsTitle);
    const removePlayerUN = (item) => {
        if (unannouncesSelect?.length) {
            let data = unannouncesSelect?.findIndex(i => i?.pid === item?.pid);
            if (data > -1) {
                unannouncesSelect.splice(data, 1)
                setRandom(Math.random)
            } else {
                unannouncesSelect.push(item);
                setRandom(Math.random)
            }
        } else {
            setUnannouncesSelect([item]);
            setRandom(Math.random)
        }
    }
    const renderItem = ({ item }) => {
        let checkingTeam = unannouncesSelect?.find((items) => {
            return items?.pid == item?.pid
        })
        const playercolor =
            item?.title === removedSpacesTeamsTitle[0]
                ? 'rgba(22, 64, 111, 1)'
                : item?.title === removedSpacesTeamsTitle[1]
                    ? 'rgba(255, 255, 255, 1)'
                    : null;
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
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={
                        item?.logo_url
                            ? {
                                uri: `${playerImageUrl}${item?.logo_url}`,
                            }
                            : playerIcon
                    }
                    style={styles.playerImage}
                    resizeMode="contain">
                    <View style={{
                        flexDirection: 'row',
                        alignItems: "center",
                        marginTop: 38
                    }} >
                        <AppText style={{
                            backgroundColor: playercolor,
                            borderWidth: 1,
                            borderColor: colors.gray,
                            borderBottomLeftRadius: 5,
                            borderTopLeftRadius: 5,
                            marginTop: 2
                        }} color={BLACK}
                            type={TEN} weight={POPPINS_SEMI_BOLD} >
                            {' '}{item.teamName}{' '}
                        </AppText>
                        <AppText
                            style={{
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: colors.gray,
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                marginTop: 2
                            }}
                            type={TEN}
                            color={BLACK} weight={POPPINS_SEMI_BOLD} >
                            {' '}{item.playing_role}{' '}
                        </AppText>

                    </View>
                </ImageBackground>
                <View style={{ flex: 1, marginLeft: 10 }} >
                    <AppText numberOfLines={1} style={styles.playerName}>
                        {modifyName(item?.first_name)}
                    </AppText>
                    <AppText style={{
                        marginTop: 5
                    }} color={BLACK}
                        weight={POPPINS_SEMI_BOLD}
                        type={TWELVE}>
                        <View style={styles.dotVIew} />  |  Credit {item.fantasy_player_rating}  |  Avg pts {item?.average_point ? item?.average_point?.toFixed(2) : 0}
                    </AppText>
                </View>
                <TouchableOpacityView
                    onPress={() => removePlayerUN(item)}
                    style={
                        checkingTeam ?
                            styles.checkbox :
                            styles.checkboxTwo}>
                    <FastImage
                        style={styles.rightIcon}
                        resizeMode="contain"
                        tintColor={'white'}
                        source={tick} />
                </TouchableOpacityView>
            </View >
        )
    }
    return (
        <>
            <View style={styles.topContainer}>
                <TouchableOpacityView onPress={onClose} >
                    <FastImage
                        style={styles.closeIcon}
                        tintColor={colors.black}
                        resizeMode="contain"
                        source={closeIcon} />
                </TouchableOpacityView>
                <AppText
                    style={styles.heading}
                    type={SIXTEEN} weight={POPPINS_SEMI_BOLD} color={BLACK} >
                    {UnannouncedTWO?.length} of your players Unannounced!
                </AppText>
            </View>
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.5, 1]} style={styles.singleLine}
                colors={['#003E9B', '#AD53CC', '#003E9B']} />
            <AppText
                style={styles.textTop}
                weight={POPPINS_SEMI_BOLD} type={FORTEEN} color={WHITE} >
                Unannounced
            </AppText>
            <FlatList
                data={Unannounced}
                renderItem={renderItem}
                keyExtractor={(item, index) => index?.toString()}
                contentContainerStyle={{
                    paddingHorizontal: universalPaddingHorizontal,
                    paddingVertical: 10
                }}
            />
            <PrimaryButton
                buttonStyle={styles.button}
                title={
                    `${unannouncesSelect?.length == 0 ? 'SELECT TO REMOVE UNANNOUNCED' : `REMOVE ${unannouncesSelect?.length} UNANNOUNCED ${unannouncesSelect?.length > 1 ? 'PLAYERS' : "PLAYER"}`}`}
                onPress={() => onSubmit(unannouncesSelect)}
            />
        </>
    )
}
export default UnannouncedPlayer
const styles = StyleSheet.create({
    closeIcon: {
        height: 20,
        width: 20,
        marginLeft: 4
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heading: {
        marginLeft: '10%'
    },
    singleLine: {
        height: 1,
        marginTop: 10
    },
    textTop: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#FF0000',
        width: 150,
        textAlign: 'center',
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: -1
    },
    playerImage: {
        height: 55,
        width: 55
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: colors.gray
    },
    playerName: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: 14,
        fontWeight: "bold"
    },
    dotVIew: {
        height: 5,
        width: 5,
        backgroundColor: '#FF0000',
        borderRadius: 50,
        marginTop: -2
    },
    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 5,
        backgroundColor: colors.green,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxTwo: {
        height: 20,
        width: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray
    },
    rightIcon: {
        height: 15,
        width: 14,

    },
    button: {
        marginTop: 10,
    },
})