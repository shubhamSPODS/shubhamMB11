import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AppSafeAreaView } from '../common/AppSafeAreaView'
import { colors, NewColor } from '../theme/color'
import Header from '../common/Header'
import { universalPaddingHorizontal } from '../theme/dimens'
import { AppText, SEMI_BOLD } from '../common/AppText'
import { MEDIUM } from '../components/AppFonts'
import { FULL_WIDTH, GET_WITH_TOKEN } from '../Backend/Backend'
import { PROFILE } from '../navigation/routes'
import { DICE, POOL, PROFILE_2, SECURE, UserIcon } from './image'
import { BASE_URL, toastAlert } from './utility'
import io from 'socket.io-client';
import { launchUnityWithDataCallback } from 'react-native-unity-launcher';
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from '../common/primaryButton'
import Loader from '../components/Loader'
import { USER_TOKEN_KEY } from '../libs/constants'

const GameJoinTable = ({ route, navigation }) => {
    const userData = useSelector(state => {
        return state.profile.userData;
      });
    //   console.log(userData,'==userdqata');
      
        
    const [matchId, setMatchId] = useState('');
    const walletBalance = Number(userData?.winning_amount || 0) + Number(userData?.cash_bonus || 0) + Number(userData?.totaldeposit || 0);
    const socket = useRef(null);
    const [countdown, setCountdown] = useState(4);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isJoining, setIsJoining] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [userToken, setUserToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const routeData = route?.params?.playerDetails;
    const gameRoute = route?.params?.gameType;
    const isRummy = gameRoute === 'Rummy';
    const gameIcon = isRummy ? POOL : DICE;
    const [isWaitingForUnity, setIsWaitingForUnity] = useState(false);
      const balanceAfterJoin = walletBalance - routeData?.bet;
 const getUserToken =async()=>{
    try {
        const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
        setUserToken(token)
          
    } catch (error) {
        
    }
 }
 useEffect(()=>{
    getUserToken()
 },[])
   
    const setupSocketConnection = () => {
        let url = `${BASE_URL}server/matchmaking`;
        let path = '/socket.io';
        let transports = ['websocket'];
        setIsLoading(true);

        socket.current = io(url, {
            path: path,
            transports: transports,
            query: {
                playerId: userData?._id,
                contestId: routeData?._id,
            },
            forceNew: true,
        });

        socket.current.on('connect', () => {
            console.log('✅ Socket connected=');
            setIsSocketConnected(true);
            setIsLoading(true);
            setTimeout(() => {
                if (socket.current?.connected) {
                    socket.current.emit('get_players', {
                        playerId: userData?._id,
                        contestId: routeData?._id,
                        timestamp: Date.now()
                    });
                }
            }, 15000);
        });

        socket.current.on('info', (playerData) => {
            if (playerData?.matchId) {
                setPlayers(prev => [...prev, playerData]);
                setIsLoading(false);
            }
        });

        socket.current.on('match_found', (matchData) => {
            setIsJoining(true);
            setIsLoading(true);

            if (matchData?.matchId) {
                setMatchId(matchData?.matchId);
            } else {
                setIsJoining(false);
                setIsLoading(false);
            }
        });

        socket.current.on('error', (error) => {
            if (error.message === 'Connection timeout reached') {
                toastAlert.showToastError('No match found.');
                setIsLoading(false);
                setIsJoining(false);
            }
        });
    };
    const handleJoinTable = () => {
        if (walletBalance === 0) {
            toastAlert.showToastError('Match not found.');
            return;
        }

        if (!socket.current?.connected) {
            setupSocketConnection();
        }

        if (socket.current?.connected) {
            setIsLoading(true);
            setIsJoining(true);

            socket.current.emit('get_players', {
                playerId: userData?._id,
                contestId: routeData?._id,
                timestamp: Date.now()
            });
        } else {
            setIsLoading(false);
        }
    };
    const onMatchIdFound = async () => {
        try {
            const matchFoundRes = await GET_WITH_TOKEN(`game/${matchId}`);
            if (matchFoundRes?.success === true) {
                const otherPlayerIds = matchFoundRes?.data?.players?.filter(
                    playerId => playerId !== userData?._id
                );
                const playerProfiles = await Promise.all(
                    otherPlayerIds.map(async (playerId) => {
                        try {
                            const profileRes = await GET_WITH_TOKEN(`user/getprofile?user_id=${playerId}`);
                            if (profileRes?.success) {
                                return {
                                    name: profileRes?.data?.username || 'Player',
                                    _id: profileRes?.data?.id,
                                    avatar: !profileRes?.data?.logo ? USER_IMG : `${BASE_URL}${profileRes?.data?.logo}`,
                                    joinedAt: 'Just now'
                                };
                            }
                            return null;
                        } catch (error) {
                            console.log(`Error fetching profile for ${playerId}:`, error);
                            return null;
                        }
                    })
                );
                const validPlayers = playerProfiles?.filter(player => player !== null);
                setPlayers(validPlayers);
                if (!!validPlayers) {
                    setIsLoading(false);
                    setIsWaitingForUnity(true);
                    setTimeout(() => {
                        launchUnityWithDataCallback(
                            `${BASE_URL}`,
                            `${BASE_URL}`,
                            userToken,
                            gameRoute=='Rummy' ?'rummy':'ludo',
                            matchId,
                            null,
                            () => {
                                console.log('Returned from Unity');
                                navigation.goBack();
                            }
                        );
                    }, 4000);
                }
            }
        } catch (error) {
            console.log(error, '==error');
            setIsLoading(false);
            setIsWaitingForUnity(false);
        }
    };

    useEffect(() => {
      

        if (!!matchId) {
            onMatchIdFound();
        }
    }, [matchId]);
     useEffect(() => {
        if (isWaitingForUnity) {
            setIsCountdownActive(true);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsCountdownActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(timer);
                setIsCountdownActive(false);
            };
        } else {
            setCountdown(4);
            setIsCountdownActive(false);
        }
    }, [isWaitingForUnity]);

    useEffect(() => {
        return () => {
            if (socket.current) {
                console.log('🧹 Cleaning up socket connection...');
                socket.current.disconnect();
                console.log('🔌 Socket disconnected on unmount');
                setIsSocketConnected(false);
                setIsLoading(false);
            }
        };
    }, []);
    
       const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
console.log(userToken,'==userToken');

    return (
        <AppSafeAreaView
        statusColor={true}
        style={{ backgroundColor: NewColor.linerWhite }}
        hidden={false}>
 <Loader visible={isLoading} textAppear={true} />

         <Header
          commonHeader
          title="Join Table"
          style={{padding: universalPaddingHorizontal, }}
        />
          <View style={styles.card}>
                <View style={styles.tableHeader}>
                    <AppText size={16} weight={SEMI_BOLD}>{routeData?.gameMode}</AppText>
                    <Image source={gameIcon} style={{width:30,height:30,tintColor:colors.golden,resizeMode:"contain"}}  />
                </View>

                <View style={styles.tableInfo}>
                    <View style={styles.infoColumn}>
                        <AppText color={colors.gray} size={14} type={MEDIUM}>Entry Fee</AppText>
                        <AppText size={16} type={SEMI_BOLD}>{`₹${routeData?.bet}`}</AppText>
                    </View>
                    <View style={styles.infoColumn}>
                        <AppText color={colors.gray} size={14} type={MEDIUM}>Prize Pool</AppText>
                        <AppText size={16} type={SEMI_BOLD}>{`₹${routeData?.totalBet}`}</AppText>
                    </View>
                    <View style={styles.infoColumn}>
                        <AppText color={colors.gray} size={14} type={MEDIUM}>Players</AppText>
                        <AppText size={16} type={SEMI_BOLD}>
                            {routeData?.gameType?.replace('Player', '')}
                        </AppText>
                    </View>
                </View>
            </View>


            <View style={styles.card}>
                <AppText size={16} type={SEMI_BOLD} style={{ marginBottom: 10 }}>Current Players</AppText>
                <View style={[styles.playerItem, isWaitingForUnity && styles.playerItemHighlight]}>
                    <Image
                        source={!userData?.logo ? UserIcon : { uri: `${BASE_URL}${userData?.logo}` }}
                        style={styles.playerAvatar}
                    />
                    <View>
                        <AppText size={14} type={SEMI_BOLD}>{userData?.username || 'You'}</AppText>
                        <AppText size={12} color={colors.gray} type={MEDIUM}>Joined Just now</AppText>
                    </View>
                </View>
                {players?.map((item, index) => (
                    <View key={index} style={[styles.playerItem, isWaitingForUnity && styles.playerItemHighlight]}>
                        <Image source={item?.avatar} style={styles.playerAvatar} />
                        <View>
                            <AppText size={14} type={SEMI_BOLD}>{item?.name}</AppText>
                            <AppText size={12} color={colors.gray} type={MEDIUM}>Joined {item?.joinedAt}</AppText>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <View style={styles.balanceRow}>
                    <AppText size={14} type={MEDIUM}>Wallet Balance</AppText>
                    <AppText size={14} type={SEMI_BOLD} color="#22C55E">
                        {`₹${walletBalance}`}
                    </AppText>
                </View>
                <View style={styles.balanceRow}>
                    <AppText size={14} type={MEDIUM}>Entry Fee</AppText>
                    <AppText size={14} type={SEMI_BOLD} color="#EF4444">-{`₹${routeData?.bet}`}</AppText>
                </View>
                <View style={[styles.balanceRow, styles.totalRow]}>
                    <AppText size={14} type={MEDIUM}>Balance after join</AppText>
                    <AppText size={14} type={SEMI_BOLD} color="#22C55E">{`₹${balanceAfterJoin}`}</AppText>
                </View>
            </View>



            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <Image source={SECURE} style={{width:20,height:20,tintColor:colors.golden,resizeMode:'contain'}}/>
                    <AppText size={12} color={colors.gray} style={{ marginLeft: 5 }}>Safe & Secure</AppText>
                </View>
                <View style={styles.footerInfo}>
                    <Image source={PROFILE_2}  style={{width:20,height:20,resizeMode:'contain'}} />
                    <AppText size={12}  color={colors.gray} style={{ marginLeft: 5 }}>24/7 Support</AppText>
                </View>
            </View>

             <PrimaryButton
                          title={isWaitingForUnity ? formatTime(countdown) : (isJoining ? "Waiting for Match..." : "Join Table Now")}
            buttonStyle={{marginTop:10,width:'90%',alignSelf:"center"}}
            onPress={handleJoinTable}
             disabled={isJoining || isWaitingForUnity || isCountdownActive}
             
            />
        </AppSafeAreaView>
    )
}

export default GameJoinTable

const styles = StyleSheet.create({
    card: {
        width: FULL_WIDTH - 32,
        alignSelf: 'center',
        backgroundColor: '#3f3f3f',
        elevation: 2,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tableInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoColumn: {
        alignItems: 'center',
    },
    playerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    playerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    playerItemHighlight: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 80,
        width: '100%',
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    joinButton: {
        position: 'absolute',
        bottom: 16,
        width: FULL_WIDTH - 32,
    },
    playerItemHighlight: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
})