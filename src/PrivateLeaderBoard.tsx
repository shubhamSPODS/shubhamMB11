import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppSafeAreaView } from "./common/AppSafeAreaView";
import { StatusBar } from "native-base";
import CommonImageBackground from "./common/commonImageBackground";
import FastImage from "@d11/react-native-fast-image";
import { BackIcon, GLORY, GURANTEE, SINGLE, wallet } from "./helper/image";
import { NewColor, colors } from "./theme/color";
import NavigationService from "./navigation/NavigationService";
import { TouchableOpacityView } from "./common/TouchableOpacityView";
import { AppText, BLACK, BLACKOPACITY, ELEVEN, FORTEEN, GREEN, LIGHTBLUE, POPINS_THIN_ITALIC, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, TEN, WHITE } from "./common/AppText";
import { LiveTime } from "./common/LiveTime";
import { MY_BALANCE, SELECT_PLAYER } from "./navigation/routes";
import LinearGradient from "react-native-linear-gradient";
import { BASE_URL, numberWithCommas } from "./helper/utility";
import { universalPaddingHorizontal } from "./theme/dimens";
import Winnings from "./components/winnings/Winnings";
import LeaderBoardList from "./components/leaderBoardList/LeaderBoardList";
import { ScoreCard } from "./screens/ScoreCard";
import { getAllPlayerList, getMyTeam, setAllPlayers, setContestData, setIsContestEntry, setSelectedMatch } from "./slices/matchSlice";
import Confirmation from "./common/Confirmation";
import SelectTeam from "./components/selectTeam/SelectTeam";
import RBSheet from "react-native-raw-bottom-sheet";
export const TABS = [
    { id: 1, title: 'Winnings' },
    { id: 2, title: 'Leaderboard' },
];
export const TABSTWO = [
    { id: 1, title: 'Winnings' },
    { id: 2, title: 'Leaderboard' },
    { id: 3, title: 'Scorecard' },
];
const PrivateLeaderBoard = () => {
    const dispatch = useDispatch()
    const myTeam = useSelector((state: any) => state?.match?.myTeams);
    const details = useSelector((state: any) => state?.match?.details);
    const matchDetails = useSelector((state: any) => state?.match?.dataContest);
    const MatchDetails = useSelector((state: any) => state?.match?.MatchDetails);
    const MyCreateContestData = useSelector((state: any) => state?.match?.MyCreateContestData);
    const userData = useSelector((state: any) => { return state.profile.userData });
    const wsRefTwo = useRef(null);
    const selectTeam = useRef(null);
    const [removeTabs, setRemoveTabs] = useState(false)
    const [activeTab, setActiveTab] = useState(1);
    const [forStatus, setForStatus] = useState([]);
    const [updown, setUpDown] = useState('');
    const [random, setRandom] = useState(10);
    const [TeamAScore, setTeamAScore] = useState([]);
    const [TeamBScore, setTeamBScore] = useState([]);
    const [scoreBoard, setScoreBoard] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [ForConnectedTo, setForConnectedTo] = useState(false);
    const [saveTeamName, setSaveTeamName] = useState('');
    const [isAdd, setIsAdd] = useState(false);
    let url = `ws://app.mybattle11.com/leader-board?limit=10&skip=0&matchid=${matchDetails?.MatchId}&contest_category_id=${MyCreateContestData[0]?.contest_category_id}&user_id=${userData?._id}`;
    let urlTwo = `ws://app.mybattle11.com/leader-board?limit=10&skip=0&matchid=${matchDetails?.MatchId}&contest_category_id=${MyCreateContestData[0]?.contest_category_id}&user_id=${userData?._id}`;
    const { _id } = matchDetails ?? '';
    const percentage = (MyCreateContestData &&
        MyCreateContestData[0]?.joined / (MyCreateContestData &&
            MyCreateContestData[0]?.matceshdata?.Contestsize || 0)) * 100;
    const newKey = MyCreateContestData &&
        MyCreateContestData[0]?.joined ==
        MyCreateContestData &&
        MyCreateContestData[0]?.matceshdata?.Contestsize;
    const checking = MyCreateContestData[0]?.teamDetails?.map((item: any) => {
        let hasMatch = myTeam?.some((value: any) => value?._id === item?.team_id);
        return hasMatch;
    });

    useEffect(() => {
        dispatch(getMyTeam(_id));
    }, [])
    useEffect(() => {
        if (matchDetails?.MatchId && MyCreateContestData[0]?.contest_category_id) {
            wsRefTwo.current = new WebSocket(urlTwo);
            wsRefTwo.current.onopen = () => {
                console.log('connected');
                // wsRef.current.send('1000000');
            };
            wsRefTwo.current.onclose = e => {
                console.log('Connection Failed Plz Check Your Network', e);
                // setLoading(false);
                wsRefTwo.current = new WebSocket(urlTwo);
            };
            wsRefTwo.current.onerror = e => {
                console.log('Something Went Wrong', e);
                // setLoading(false);
                wsRefTwo.current = new WebSocket(urlTwo);
            };
            return () => {
                wsRefTwo.current.close();
            };
        }
    }, [matchDetails?.MatchId]);
    const getData = React.useCallback(() => {
        if (isConnected && wsRefTwo.current) {
            wsRefTwo.current.close();
            setIsConnected(false);
        }
        try {
            wsRefTwo.current = new WebSocket(urlTwo);
            wsRefTwo.current.onopen = () => {
                setIsConnected(true); // Set the connection status to true
            };
            if (!wsRefTwo.current) return;
            wsRefTwo.current.onmessage = (e: any) => {
                const parseData = JSON.parse(e?.data);
                setScoreBoard(parseData?.score);
                setTeamAScore(parseData && parseData?.score[0]?.teama);
                setTeamBScore(parseData && parseData?.score[0]?.teamb);

                // setLoading(false);
            };
        } catch (error) {
            console.log(error);
        } finally {
        }
    }, [isConnected]);
    const reconnectWebSocket = () => {
        if (wsRefTwo.current && wsRefTwo.current.readyState !== WebSocket.OPEN) {
            wsRefTwo.current = new WebSocket(url);
            wsRefTwo.current.onopen = () => { };
            wsRefTwo.current.onclose = (e: any) => {
                reconnectWebSocket(); // Call the function recursively to reconnect
            };
            wsRefTwo.current.onerror = (e: any) => {
                reconnectWebSocket(); // Call the function recursively to reconnect
            };
            wsRefTwo.current.onmessage = (e: any) => {
                const parseData = JSON.parse(e?.data);
                setScoreBoard(parseData?.score);
                setTeamAScore(parseData && parseData?.score[0]?.teama);
                setTeamBScore(parseData && parseData?.score[0]?.teamb);
            };
        }
    };
    const renderTabs = () => {
        return (
            <View style={styles.tabContainer}>
                {TABS?.map((item: any, index: any) => {
                    return index + 1 == activeTab ? (
                        <View
                            style={{
                                flexDirection: 'column',
                                width: '33%',
                                height: 38,
                                justifyContent: 'space-evenly',
                                padding: 5,
                                alignItems: 'center',
                            }}>
                            <AppText weight={POPPINS_MEDIUM} type={FORTEEN} color={LIGHTBLUE}>
                                {item?.title}
                            </AppText>
                            <LinearGradient
                                style={{ height: 2, width: 102 }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#5389C4', '#7F3291']}></LinearGradient>
                        </View>
                    ) : (
                        <TouchableOpacityView
                            style={styles.tabs}
                            onPress={() =>
                                setActiveTab(index + 1)
                            }>
                            <AppText
                                weight={POPPINS_MEDIUM}
                                type={FORTEEN}
                                color={BLACKOPACITY}>
                                {item?.title}
                            </AppText>
                        </TouchableOpacityView>
                    );
                })}
            </View>
        );
    };
    const renderTabsTwo = () => {
        return (
            <View style={styles.tabContainer}>
                {TABSTWO?.map((item, index) => {
                    return index + 1 == activeTab ? (
                        <View
                            style={{
                                flexDirection: 'column',
                                width: '33%',
                                height: 38,
                                justifyContent: 'space-evenly',
                                padding: 5,
                                alignItems: 'center',
                            }}>
                            <AppText weight={POPPINS_MEDIUM} type={FORTEEN} color={LIGHTBLUE}>
                                {item?.title}
                            </AppText>
                            <LinearGradient
                                style={{ height: 2, width: 102 }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#5389C4', '#7F3291']}></LinearGradient>
                        </View>
                    ) : (
                        <TouchableOpacityView
                            style={styles.tabs}
                            onPress={() =>
                                setActiveTab(index + 1)
                            }>
                            <AppText
                                weight={POPPINS_MEDIUM}
                                type={FORTEEN}
                                color={BLACKOPACITY}>
                                {item?.title}
                            </AppText>
                        </TouchableOpacityView>
                    );
                })}
            </View>
        );
    };
    useEffect(() => {
        if (!ForConnectedTo) {
            getData();
            setForConnectedTo(true);
        } else {
            const interval = setInterval(() => {
                getData();
            }, 1000);
            return () => clearInterval(interval);
        }
    });

    const onRefresh = (type: any) => {
        reconnectWebSocket();
        setRandom(Math.random());
    };
    const renderMain = () => {
        return (
            <>
                {activeTab == 1 && <Winnings
                    id={MyCreateContestData?.length && MyCreateContestData[0].contest_category_id}
                    privateis={true}
                />
                }
                {
                    activeTab == 2 &&
                    <LeaderBoardList
                        matchId={MatchDetails && MatchDetails.match_id}
                        id={MyCreateContestData?.length &&
                            MyCreateContestData[0].contest_category_id}
                        setForStatus={setForStatus}
                        forStatus={forStatus}
                        selfCreateContest={true}
                    />
                }
                {
                    activeTab == 3 &&
                    <FlatList
                        data={scoreBoard && scoreBoard[0]?.innings}
                        renderItem={renderItemScore}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ marginTop: 10 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => onRefresh()}
                            />
                        }
                    />
                }
            </>
        )
    }
    const length = scoreBoard && scoreBoard[0]?.innings?.length;
    const renderItemScore = ({ item, index }: any) => {
        return (
            <ScoreCard item={item}
                length={length}
                index={index}
                updown={updown}
                setUpDown={setUpDown} />
        )
    }
    const totalTeamCount = myTeam?.length
    const onJoinContest = async () => {
        if (totalTeamCount === 0) {
            dispatch(setAllPlayers([]))
            let data = { cid: matchDetails?.competition?.cid };
            dispatch(setContestData(matchDetails))
            dispatch(getAllPlayerList(_id, data, false, {}, true));
            NavigationService.navigate(SELECT_PLAYER, {
                matchDetails,
                isEditMode: false,
                privateContest: true
            });
            dispatch(setIsContestEntry(true));
            dispatch(setSelectedMatch({ ...details }));

        } else if (totalTeamCount === 1) {
            if (details?.teamDetails?.length) {
                dispatch(setAllPlayers([]))
                let data = { cid: matchDetails?.SeriesId };
                let isNavigate = true
                dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
                dispatch(setIsContestEntry(true));
                dispatch(setSelectedMatch({ ...details }));
                dispatch(setContestData(matchDetails))
                NavigationService.navigate(SELECT_PLAYER, {
                    matchDetails,
                    isEditMode: false,
                    privateContest: true
                });
            } else {
                dispatch(getMyTeam(_id));
                dispatch(setSelectedMatch({ ...details }));
                setSaveTeamName(myTeam[0]?.name)
                setIsAdd(true);
            }
        } else if (totalTeamCount > 1) {
            if (details?.teamDetails?.length == myTeam?.length) {
                dispatch(setAllPlayers([]))
                let data = { cid: matchDetails?.SeriesId };
                let isNavigate = true
                dispatch(getAllPlayerList(_id, data, false, {}, isNavigate));
                dispatch(setIsContestEntry(true));
                dispatch(setSelectedMatch({ ...details }));
                dispatch(setContestData(matchDetails))
                NavigationService.navigate(SELECT_PLAYER, {
                    matchDetails,
                    isEditMode: false,
                    privateContest: true
                });
            } else {
                selectTeam?.current?.open();
            }
        }
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
                <View style={styles.flex}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerUnderContainer}>
                            <TouchableOpacityView
                                onPress={() => NavigationService.goBack()}
                                style={styles.flex}>
                                <FastImage
                                    style={styles.backICon}
                                    resizeMode="contain"
                                    tintColor={colors.black}
                                    source={BackIcon}
                                />
                            </TouchableOpacityView>
                            <View style={styles.titleConatainer}>
                                <View style={styles.rowAlgin}>
                                    <AppText weight={POPPINS_SEMI_BOLD}
                                        type={FORTEEN}>
                                        {matchDetails?.TeamsShortNames[0]}
                                    </AppText>
                                    <AppText weight={POPINS_THIN_ITALIC}
                                        type={FORTEEN}> VS </AppText>
                                    <AppText weight={POPPINS_SEMI_BOLD}
                                        type={FORTEEN}>
                                        {matchDetails?.TeamsShortNames[1]}
                                    </AppText>
                                </View>
                                <View style={styles.timerContainer}>
                                    <LiveTime
                                        styletext={{ marginTop: 1 }}
                                        type={ELEVEN}
                                        top={true}
                                        details={matchDetails}
                                        setRemoveTabs={setRemoveTabs}
                                    />
                                </View>
                            </View>
                            <TouchableOpacityView
                                onPress={() => NavigationService.navigate(MY_BALANCE)}
                                style={styles.walletBack}>
                                <FastImage
                                    style={styles.walletIcon}
                                    resizeMode="contain"
                                    tintColor={colors.black}
                                    source={wallet}
                                />
                            </TouchableOpacityView>
                        </View>
                    </View>
                    <View style={styles.containerView}>
                        <View style={styles.container}>
                            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD} color={BLACK}>
                                Contest by{' '}
                                {MyCreateContestData && MyCreateContestData[0]?.matceshdata?.createdby}
                            </AppText>
                            <AppText type={TEN} color={BLACKOPACITY} weight={POPPINS_SEMI_BOLD}>
                                PRIZE POOL
                            </AppText>
                            <AppText
                                style={{ marginTop: 5 }}
                                type={FORTEEN}
                                weight={POPPINS_SEMI_BOLD}
                                color={BLACK}>
                                ₹
                                {MyCreateContestData &&
                                    MyCreateContestData[0]?.matceshdata?.WinningAmount}
                            </AppText>
                            <View style={styles.progressBar}>
                                <LinearGradient
                                    style={{
                                        width: `${percentage}%`,
                                        height: '100%',
                                        borderRadius: 4,
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[
                                        colors.borderBackColor,
                                        colors.linerProgress,
                                    ]}></LinearGradient>
                            </View>
                            <View style={styles.flexrowalign}>
                                <AppText type={TEN} weight={POPPINS_SEMI_BOLD} color={BLACKOPACITY}>
                                    {numberWithCommas(
                                        MyCreateContestData &&
                                        MyCreateContestData[0]?.matceshdata?.Contestsize,
                                    )}{' '}
                                    sport
                                </AppText>
                                <AppText
                                    color={GREEN}
                                    weight={POPPINS_SEMI_BOLD}
                                    type={TEN}>
                                    {`${MyCreateContestData &&
                                        MyCreateContestData[0]?.matceshdata?.Contestsize -
                                        ((MyCreateContestData &&
                                            MyCreateContestData[0]?.joined) ||
                                            0)
                                        } spots left`}
                                </AppText>
                            </View>
                            {newKey == true || checking && checking[0] == true ?
                                <View style={styles.unButtonConatiner}>
                                    <AppText color={WHITE} type={FORTEEN} weight={POPPINS_SEMI_BOLD}>
                                        join{' '}
                                        {MyCreateContestData && MyCreateContestData[0]?.matceshdata?.EnteryFee}
                                    </AppText>
                                </View> :
                                <TouchableOpacityView
                                    onPress={onJoinContest}
                                    style={styles.butonConatainer}>
                                    <AppText color={WHITE}
                                        type={FORTEEN}
                                        weight={POPPINS_SEMI_BOLD}>
                                        JOIN{' '}
                                        {MyCreateContestData && MyCreateContestData[0]?.matceshdata?.EnteryFee}
                                    </AppText>
                                </TouchableOpacityView>
                            }
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.commonViewStyle}>
                                    <FastImage source={GLORY} style={styles.gloryIcon} />
                                    <AppText weight={POPPINS_SEMI_BOLD}
                                        color={BLACKOPACITY}
                                        type={TEN} style={styles.commonTextStyle}>
                                        {MyCreateContestData &&
                                            MyCreateContestData[0]?.data?.EnteryType !== 'Paid'
                                            ? 'Glory awaits!'
                                            : `₹${numberWithCommas(
                                                MyCreateContestData &&
                                                MyCreateContestData[0]?.data?.Rankdata[0]?.Price,
                                            )}`}
                                    </AppText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FastImage
                                        source={SINGLE}
                                        resizeMode="contain"
                                        style={styles.gloryIcon}
                                    />
                                    <AppText
                                        weight={POPPINS_SEMI_BOLD}
                                        color={BLACKOPACITY}
                                        type={TEN}
                                        style={styles.commonTextStyle}>{'Single'}</AppText>
                                </View>
                            </View>
                            <View style={styles.flexrowalign}>
                                <FastImage source={GURANTEE} style={styles.gloryIcon} />
                                <AppText weight={POPPINS_SEMI_BOLD}
                                    color={BLACKOPACITY}
                                    type={TEN} style={styles.commonTextStyle}>Guaranteed</AppText>
                            </View>
                        </View>
                    </View>
                    {[] && scoreBoard[0]?.status_note == "" ? renderTabs() : renderTabsTwo()}
                    {renderMain()}
                </View>
            </CommonImageBackground>
            <RBSheet
                ref={selectTeam}
                closeOnDragDown={false}
                openDuration={100}
                height={Dimensions.get('window').height}
                customStyles={{
                    container: {
                        backgroundColor: 'black',
                    },
                    draggableIcon: {
                        backgroundColor: 'transparent',
                        display: 'none',
                    },
                }}>
                <SelectTeam
                    contestDetails={details}
                    matchDetails={matchDetails}
                    onClose={() => selectTeam?.current?.close()}
                    teamDetails={details?.teamDetails}
                    JoinWithMULT={details?.JoinWithMULT}
                    joinWith={details.teams}
                    selectTeam={selectTeam}
                    privateContesttrue={true}
                />
            </RBSheet>
            <Confirmation
                isModalVisible={isAdd}
                details={details}
                setIsModalVisible={setIsAdd}
                matchDetails={matchDetails}
                teamLength={false}
                saveTeamName={saveTeamName}
                selectMulty={[]}
                JoinWithMULT={false}
                privateContest={true}
            />
        </AppSafeAreaView>
    )
}
export default PrivateLeaderBoard;
const styles = StyleSheet.create({
    headerContainer: {
        height: 90, width: '100%'
    },
    headerUnderContainer: {
        paddingHorizontal: 15,
        marginTop: '10%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backICon: {
        height: 15, width: 15
    },
    flex: {
        flex: 1
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
    titleConatainer: {
        alignItems: 'center'
    },
    rowAlgin: {
        flexDirection: 'row', alignItems: 'center'
    },
    walletBack: {
        flex: 1, alignItems: 'flex-end'
    },
    walletIcon: {
        height: 20, width: 20
    },
    containerView: {
        borderWidth: 1,
        borderColor: '#BDD4F4', borderRadius: 10,
        marginHorizontal: universalPaddingHorizontal
    },
    container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    progressBar: {
        height: 3,
        backgroundColor: '#D9D9D9',
        borderRadius: 4,
        marginTop: 5,
        overflow: 'hidden',
    },
    flexrowalign: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    butonConatainer: {
        height: 45,
        backgroundColor: colors.green,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    unButtonConatiner: {
        height: 45,
        backgroundColor: NewColor.linerBlacklight,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    bottomContainer: {
        height: 32,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: NewColor.linerBlackFive,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    commonViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    gloryIcon: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
    },
    commonTextStyle: {
        marginLeft: 6,
    },
    tabContainer: {
        height: 45,
        // top: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        width: '33%',
        height: 38,
        justifyContent: 'center',
        padding: 5,
        alignItems: 'center',
    }
})