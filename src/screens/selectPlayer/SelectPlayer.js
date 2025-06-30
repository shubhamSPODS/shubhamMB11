import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Dimensions,
  VirtualizedList,
} from 'react-native';
import FastImage from "@d11/react-native-fast-image";
import LinearGradient from 'react-native-linear-gradient';
import { AppSafeAreaView } from '../../common/AppSafeAreaView';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  BROWNYELLOW,
  ELEVEN,
  FORTEEN,
  GREEN,
  GRY,
  LIGHTBLUE,
  POPPINS,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  RED,
  SEMI_BOLD,
  TEN,
  TWELVE,
  WHITE,
} from '../../common/AppText';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import PlayerRoleBadge from '../../components/playerRoleBedge/PlayerRoleBedge';
import {
  BAT,
  BOWL,
  GLOVE,
  GREEN_PLUS_ICON,
  LEFT_ARROW,
  MyBattleIcon,
  PANT,
  RED_MINUS,
  StopIcon,
  addsubstitues,
  all_rounder,
  all_rounderIcon,
  backIconMain,
  batsmanIcon,
  bowlerIcon,
  dropDownRed,
  headerIner,
  rightArrow,
  wicket_keeper,
  wicket_keeperIcon,
} from '../../helper/image';
import { modifyName, modifyNameTwo, toastAlert } from '../../helper/utility';
import NavigationService from '../../navigation/NavigationService';
import { PLAYER_PREVIEW, SELECT_CAPTAIN } from '../../navigation/routes';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlayerList, getPlayerDetail } from '../../slices/matchSlice';
import PlayerBedge from '../../components/playerBedge/PlayerBedge';
import { AddIcon, StatusBar } from 'native-base';
import CommonImageBackground from '../../common/commonImageBackground';
import SecondaryButton from '../../common/secondaryButton';
import PrimaryButton from '../../common/primaryButton';
import PlayerDetailModal from '../../common/PlayerDetailModal';
import moment from 'moment';
import { NewColor, colors } from '../../theme/color';
import { LiveTime } from '../../common/LiveTime';
import { SpinnerSecond } from '../../common/SpinnerSecond';
import { MatchLiveModal } from '../../common/MatchLiveModal';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Screen, universalPaddingHorizontal } from '../../theme/dimens';
import UnannouncedPlayer from '../UnannouncedPlayer';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';

export const data = [
  { imageSource: GLOVE },
  { imageSource: BAT },
  { imageSource: BAT },
  { imageSource: BAT },
  { imageSource: BOWL },
  { imageSource: BOWL },
  { imageSource: BOWL },
  { imageSource: BOWL },
  { imageSource: BOWL },
  { imageSource: BOWL },
  { imageSource: BOWL },
];

// Add the memoized Item component at the top level
const Item = memo(({ item, onSelect, isSelected, onDetail }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      style={[
        styles.playerItemContainer,
        { backgroundColor: isSelected ? colors.primary : colors.white },
      ]}>
      <View style={styles.playerInfo}>
        <FastImage
          source={{ uri: item.image }}
          style={styles.playerImage}
          resizeMode="cover"
        />
        <View style={styles.playerDetails}>
          <AppText style={styles.playerName}>{item.name}</AppText>
          <PlayerRoleBadge role={item.playing_role} />
        </View>
      </View>
      <TouchableOpacity onPress={() => onDetail(item.pid, item)}>
        <FastImage source={rightArrow} style={styles.arrowIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

// Memoized PlayerItem component
const PlayerItem = memo(({ item, onSelect, onDetail, isSelected, TeamsShortNames, removedSpacesTeamsTitle }) => {
  if (!item) return null;

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

  const getTeamShortName = () => {
    return item?.title === removedSpacesTeamsTitle[0] ? TeamsShortNames[0] : TeamsShortNames[1];
  };

  const PlayerContent = () => (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacityView
          onPress={() => onDetail(item?.pid, item)}
          style={{ alignItems: 'flex-start' }}
        >
          <FastImage
            source={
              item?.profile_image ? { uri: item?.profile_image } : playerIcon
            }
            style={styles.playerImage}
            resizeMode="contain"
          />
        </TouchableOpacityView>
        
        <View style={styles.playerInfo}>
          <AppText
            weight={POPPINS_MEDIUM}
            numberOfLines={1}
            style={[styles.playerName, isSelected && { color: WHITE }]}
          >
            {modifyNameTwo(item?.first_name)}
          </AppText>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText 
              style={[styles.roleText, isSelected && { color: WHITE }]} 
              weight={POPPINS_MEDIUM}
            >
              {item?.playing_role?.toUpperCase()}
            </AppText>
            <AppText 
              style={[styles.teamText, isSelected && { color: WHITE, opacity: 0.7 }]} 
              weight={POPPINS_MEDIUM}
            >
              {` • ${getTeamShortName()}`}
            </AppText>
          </View>

          {item?.playing11 == undefined ? (
            item?.last_play && (
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: colors.brownYellow }
                  ]}
                />
                <AppText
                  style={[
                    styles.statusText,
                    { color: colors.brownYellow }
                  ]}
                  weight={POPPINS_MEDIUM}
                >
                  Last match
                </AppText>
              </View>
            )
          ) : (
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: item?.playing11 == 'true' ? '#00B81C' : '#FF0000' }
                ]}
              />
              <AppText
                style={[
                  styles.statusText,
                  { color: item?.playing11 == 'true' ? '#00B81C' : '#FF0000' }
                ]}
                weight={SEMI_BOLD}
              >
                {item?.playing11 == 'true' ? 'Playing' : 'Not Playing'}
              </AppText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.creditBtnView}>
        <AppText 
          style={[styles.points, isSelected && { color: WHITE }]} 
          weight={POPPINS_MEDIUM}
        >
          {item?.fantasy_player_rating}
        </AppText>
        <FastImage
          resizeMode="contain"
          source={isSelected ? RED_MINUS : GREEN_PLUS_ICON}
          style={styles.plusIcon}
        />
      </View>
    </>
  );

  return isSelected ? (
    <LinearGradient
      colors={['#343434', '#FF5252']}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 1, y: 0 }}
      style={[styles.selectPlayerContainer, styles.splitViewCard]}
    >
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
        onPress={() => onSelect(item)}
      >
        <PlayerContent />
      </Pressable>
    </LinearGradient>
  ) : (
    <Pressable
      style={[
        styles.selectPlayerContainer,
        styles.splitViewCard,
        {
          backgroundColor: '#343434',
        },
      ]}
      onPress={() => onSelect(item)}
    >
      <PlayerContent />
    </Pressable>
  );
});

const TeamHeader = memo(({ teamName, playerCount }) => (
  <View style={styles.teamHeader}>
    <AppText style={styles.teamHeaderText}>{teamName}</AppText>
    <View style={styles.playerCountBadge}>
      <AppText style={styles.playerCountText}>{playerCount}</AppText>
    </View>
  </View>
));

const SelectPlayer = () => {
  const dispatch = useDispatch();
  const contestData = useSelector(state => state?.match?.contestData);
  const isLoading = useSelector(state => state?.match?.isLoading);
  const { _id, TeamA, TeamB, TeamAlogo, TeamsShortNames, TeamBlogo, SeriesId } = contestData ?? '';
  const allPlayers = useSelector(state => state?.match?.allPlayers);
  const getPlayerTab = useSelector(state => state?.match?.getPlayerTab);
  const route = useRoute();
  const layout = useWindowDimensions();
  
  // Tab state management
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pl', title: 'Squads' },
    { key: 'wk', title: 'WK' },
    { key: 'bat', title: 'BAT' },
    { key: 'ar', title: 'AR' },
    { key: 'bowl', title: 'BOWL' },
  ]);

  // Other state declarations
  const [saveTitle, setSaveTitle] = useState('');
  const [newAllPlayer, setNewAllPlayer] = useState('high');
  const AleartLive = useRef();
  const refsheetUnannounced = useRef();
  const listRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [availableCredits, setAvailableCredits] = useState(100);
  const [player, setPlayer] = useState(
    route?.params?.player ? [...route?.params?.player] : []
  );
  const [playerTwo, setPlayerTwo] = useState(
    route?.params?.playerTwo ? [...route?.params?.playerTwo] : []
  );
  const [activeTab, setActiveTab] = useState('');
  const [removeTabs, setRemoveTabs] = useState(false);
  const [Tabs, setTabs] = useState(['WK', 'BAT', 'AR ', 'BOWL']);
  const [random, setRandom] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlayerDetails, setSelectedPlayersDetails] = useState([]);
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);
  const [playerimg, setplayerimg] = useState(null);
  const [logo, setlogo] = useState(null);
  const [onClose, setOnClose] = useState(false);
  const currentDate = new Date();
  const inputDate = new Date(contestData?.StartDateTime);
  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const [saveTeam, setSaveTeam] = useState({});
  const convertToTeamsTitle2 = arr => {
    const TeamsTitle2 = arr && arr?.map(title => title.trim());
    return TeamsTitle2;
  };
  const removedSpacesTeamsTitle = convertToTeamsTitle2(contestData?.TeamsTitle);

  // Define sorting functions
  const customSort = useCallback((a, b) => {
    if (a.playing11 === b.playing11) return 0;
    if (a.playing11 === 'true') return -1;
    return 1;
  }, []);

  const customSortRating = useCallback((a, b) => {
    if (a.fantasy_player_rating === b.fantasy_player_rating) return 0;
    if (a.fantasy_player_rating < b.fantasy_player_rating) return 1;
    return -1;
  }, []);

  useEffect(() => {
    if (
      route?.params?.isEditMode ||
      route?.params?.isCloneMode ||
      route?.params?.shareTeam
    ) {
      const filteredpid = route?.params?.selectedPlayers.filter(
        item => !item.substitute,
      );
      route?.params?.selectedPlayers?.find(e => {
        return (
          e?.vice_caption == true ? setViceCaptainId(e?.pid) : null,
          e?.caption == true ? setCaptainId(e?.pid) : null
        );
      });
      const pids = filteredpid.map(item => item.pid);
      const usedCredit = route?.params?.selectedPlayers
        .filter(item => !item.substitute)
        .reduce((total, item) => total + item.fantasy_player_rating, 0);
      const filteredData = route?.params?.selectedPlayers.filter(
        item => !item.substitute,
      );
      const mergedData = route?.params?.selectedPlayers.map(item => {
        const matchingItem = allPlayers.find(
          newItem => newItem.pid === item.pid,
        );
        if (matchingItem) {
          return {
            ...item,
            caption_percent: matchingItem.caption_percent,
            vice_caption_percent: matchingItem.vice_caption_percent,
          };
        }
        return item;
      });

      const datanew = mergedData.filter(item => !item.substitute);
      const filteredDataTwo = route?.params?.selectedPlayers.filter(
        item => item.substitute === true,
      );
      const player1 = route?.params?.selectedPlayers.filter(
        item => item.title == removedSpacesTeamsTitle[0],
      );
      const player2 = route?.params?.selectedPlayers.filter(
        item => item.title == removedSpacesTeamsTitle[1],
      );
      setPlayer(player1);
      setPlayerTwo(player2);
      setAvailableCredits(Number(100) - Number(usedCredit));
      setSelectedPlayers(pids);
      setSelectedPlayersDetails(datanew);
    }
  }, []);

  const isFocus = useIsFocused();
  useEffect(() => {
    if (isFocus) {
      setActiveTab('WK');
    }
  }, [isFocus]);

  useEffect(() => {
    if (removeTabs) {
      if (route?.params?.isFromMyMatch == true) {
      } else {
        AleartLive.current.open();
      }
    }
  }, [removeTabs]);

  const filterSelectedPlayer = useMemo(() => {
    return allPlayers?.reduce(
      (preVal, item) => {
        if (
          item?.playing_role === 'wk' &&
          selectedPlayers.includes(item?.pid)
        ) {
          preVal['wk'].push(item);
        }
        if (
          item?.playing_role === 'bowl' &&
          selectedPlayers.includes(item?.pid)
        ) {
          preVal['bowl'].push(item);
        }
        if (
          item?.playing_role === 'bat' &&
          selectedPlayers.includes(item?.pid)
        ) {
          preVal['bat'].push(item);
        }
        if (
          item?.playing_role === 'all' &&
          selectedPlayers.includes(item?.pid)
        ) {
          preVal['all'].push(item);
        }
        return preVal;
      },
      {
        wk: [],
        bat: [],
        all: [],
        bowl: [],
      },
    );
  }, [selectedPlayers, allPlayers]);

  const filterPlayerUnannounced = allPlayers?.filter(e => {
    return selectedPlayers.includes(e?.pid);
  });
  const Unannounced = filterPlayerUnannounced?.filter(e => {
    return e?.playing11 == 'false';
  });
  const UnannouncedTWO = filterPlayerUnannounced?.filter(e => {
    return e?.playing11 == 'false';
  });

  useEffect(() => {
    if (
      route?.params?.isEditMode ||
      route?.params?.isCloneMode ||
      route?.params?.shareTeam
    ) {
      if (!onClose) {
        if (Unannounced?.length) {
          refsheetUnannounced?.current?.open();
        }
      }
    }
  }, [Unannounced]);

  const handlePlayerSelection = useCallback((player) => {
    if (selectedPlayers.includes(player.pid)) {
      // Remove player
      setSelectedPlayers(prev => prev.filter(id => id !== player.pid));
      setSelectedPlayersDetails(prev => prev.filter(p => p.pid !== player.pid));
      setAvailableCredits(prev => prev + player.fantasy_player_rating);
      
      if (player.title === removedSpacesTeamsTitle[0]) {
        setPlayer(prev => prev.filter(p => p.pid !== player.pid));
      } else {
        setPlayerTwo(prev => prev.filter(p => p.pid !== player.pid));
      }
    } else {
      // Check if we can add more players
      if (selectedPlayers.length >= 11) {
        toastAlert('You cannot select more than 11 players');
        return;
      }

      // Check team balance
      const teamACount = player.title === removedSpacesTeamsTitle[0] 
        ? player.length + 1 
        : player.length;
      const teamBCount = player.title === removedSpacesTeamsTitle[1] 
        ? playerTwo.length + 1 
        : playerTwo.length;

      if (teamACount > 7 || teamBCount > 7) {
        toastAlert('You cannot select more than 7 players from one team');
        return;
      }

      // Check credits
      if (availableCredits < player.fantasy_player_rating) {
        toastAlert('Not enough credits available');
        return;
      }

      // Add player
      setSelectedPlayers(prev => [...prev, player.pid]);
      setSelectedPlayersDetails(prev => [...prev, player]);
      setAvailableCredits(prev => prev - player.fantasy_player_rating);
      
      if (player.title === removedSpacesTeamsTitle[0]) {
        setPlayer(prev => [...prev, player]);
      } else {
        setPlayerTwo(prev => [...prev, player]);
      }
    }
  }, [selectedPlayers, player, playerTwo, availableCredits, removedSpacesTeamsTitle]);

  const onContinueClick = () => {
    if (selectedPlayers?.length < 11) {
      return toastAlert.showToastError('Please Select 11 Players');
    }
    NavigationService.navigate(SELECT_CAPTAIN, {
      matchDetails: contestData,
      selectedPlayers: selectedPlayers,
      selctedPlayerDetails: selectedPlayerDetails,
      isEditMode: route?.params?.isEditMode,
      team_id: route?.params?.team_id,
      team_name: route?.params?.team_name,
      captain: route?.params?.captain,
      viceCaptain: route?.params?.viceCaptain,
      isCloneMode: route?.params?.isCloneMode,
      availableCredits: availableCredits,
      player: player,
      playerTwo: playerTwo,
      isFromMyMatch: route?.params?.isFromMyMatch,
      shareTeam: route?.params?.shareTeam,
    });
  };

  const onPreview = () => {
    NavigationService.navigate(PLAYER_PREVIEW, {
      oldData: contestData,
      selectedPlayers: selectedPlayers,
      availableCredits: availableCredits,
      selectedPlayerDetails: selectedPlayerDetails,
      player: player,
      playerTwo: playerTwo,
      myTeam: false,
      captainId: captainId,
      vice_caption: viceCaptainId,
    });
  };

  const onDetail = (id, item) => {
    dispatch(getPlayerDetail(id));
    setSaveTeam(item);
    setplayerimg(item?.playing_role);
    setlogo(item?.logo_url);
    setIsVisible(true);
  };

  const getItem = useCallback((data, index) => data[index], []);
  const getItemCount = useCallback(data => data?.length || 0, []);
  const keyExtractor = useCallback(item => item?.pid?.toString() || Math.random().toString(), []);
  
  const getItemLayout = useCallback((data, index) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  const handleScroll = useCallback((event) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedPlayers.includes(item.pid);
    return (
      <PlayerItem
        item={item}
        onSelect={handlePlayerSelection}
        onDetail={onDetail}
        isSelected={isSelected}
        TeamsShortNames={TeamsShortNames}
        removedSpacesTeamsTitle={removedSpacesTeamsTitle}
      />
    );
  }, [selectedPlayers, handlePlayerSelection, onDetail, TeamsShortNames, removedSpacesTeamsTitle]);

  const getPlayersData = useCallback((routeKey = '') => {
    if (!allPlayers?.length) return [];

    const roleMap = {
      pl: null,
      wk: 'wk',
      bat: 'bat',
      ar: 'all',
      bowl: 'bowl'
    };

    let filteredPlayers = allPlayers;
    const role = roleMap[routeKey];
    
    if (role) {
      filteredPlayers = allPlayers.filter(player => player.playing_role === role);
    }

    // Group players by team
    const teamAPlayers = filteredPlayers.filter(p => p.title === removedSpacesTeamsTitle[0]);
    const teamBPlayers = filteredPlayers.filter(p => p.title === removedSpacesTeamsTitle[1]);

    // Apply sorting based on saveTitle and newAllPlayer
    const sortPlayers = (players) => {
      if (saveTitle === 'PLAYERS') {
        return newAllPlayer === 'high'
          ? [...players].sort((a, b) => b.first_name.localeCompare(a.first_name))
          : [...players].sort((a, b) => a.first_name.localeCompare(b.first_name));
      } else if (saveTitle === 'CREDITS') {
        return newAllPlayer === 'high'
          ? [...players].sort((a, b) => b.fantasy_player_rating - a.fantasy_player_rating)
          : [...players].sort((a, b) => a.fantasy_player_rating - b.fantasy_player_rating);
      } else if (saveTitle === 'AVG POINTS') {
        return newAllPlayer === 'high'
          ? [...players].sort((a, b) => b.average_point - a.average_point)
          : [...players].sort((a, b) => a.average_point - b.average_point);
      }
      return [...players].sort(customSortRating).sort(customSort);
    };

    return {
      teamA: sortPlayers(teamAPlayers),
      teamB: sortPlayers(teamBPlayers)
    };
  }, [allPlayers, saveTitle, newAllPlayer, customSort, customSortRating, removedSpacesTeamsTitle]);

  const errorMsg = type => {
    if (type === 'wk') return 'Please Select at least one Wicket Keeper';
    if (type === 'bat') return 'Please Select at least one Batsman';
    if (type === 'all') return 'Please Select at least one All rounder';
    if (type === 'bowl') return 'Please Select at least one Bowler';
  };

  const addPlayerInTeam = useCallback(
    (items) => {
      const selectLength = selectedPlayers.length;
      const wikLength = filterSelectedPlayer.wk.length;
      const bolLength = filterSelectedPlayer.bowl.length;
      const batLength = filterSelectedPlayer.bat.length;
      const allLength = filterSelectedPlayer.all.length;
      const role = items.playing_role;

      if (items?.fantasy_player_rating > availableCredits) {
        return toastAlert.showToastError('Available Credit is Low');
      }
      if (player?.length === 7 && items?.title === removedSpacesTeamsTitle[0]) {
        return toastAlert.showToastError(`Please select player from ${removedSpacesTeamsTitle[1]} team`);
      }
      if (playerTwo?.length === 7 && items?.title === removedSpacesTeamsTitle[1]) {
        return toastAlert.showToastError(`Please select player from ${removedSpacesTeamsTitle[0]} team`);
      }

      if (selectLength >= 8) {
        const blankData = Object.keys(filterSelectedPlayer).filter(key => !filterSelectedPlayer[key].length);
        let mess = '';
        switch (true) {
          case wikLength === 8 && role === 'wk':
            mess = 'Maximum of 8 Wicket Keeper per team';
            break;
          case bolLength === 8 && role === 'bowl':
            mess = 'Maximum of 8 Bowlers per team';
            break;
          case batLength === 8 && role === 'bat':
            mess = 'Maximum of 8 BatsMan per team';
            break;
          case allLength === 8 && role === 'all':
            mess = 'Maximum of 8 All Rounder per team';
            break;
          case selectLength >= 9 && selectLength < 11 && !blankData.includes(role):
            if (blankData.length === 1) {
              if (selectLength > 9) {
                mess = errorMsg(blankData[0]);
              }
            } else {
              mess = errorMsg(blankData[0]);
            }
            break;
          case selectLength >= 11:
            mess = 'Maximum Player Selected';
            break;
        }
        if (mess) {
          toastAlert.showToastError(mess);
          return;
        }
      }

      setSelectedPlayers(prev => [...prev, items.pid]);
      setSelectedPlayersDetails(prev => [...prev, items]);
      setAvailableCredits(prev => prev - items?.fantasy_player_rating);
      if (items?.title === removedSpacesTeamsTitle[0]) {
        setPlayer(prev => [...prev, items]);
      } else {
        setPlayerTwo(prev => [...prev, items]);
      }
    },
    [selectedPlayers, availableCredits, player, playerTwo, filterSelectedPlayer, removedSpacesTeamsTitle]
  );

  const removePlayerFromTeam = useCallback(
    (item) => {
      setSelectedPlayers(prev => prev.filter(data => data !== item?.pid));
      setSelectedPlayersDetails(prev => prev.filter(player => player?.pid !== item?.pid));
      setPlayer(prev => prev.filter(player => player?.pid !== item?.pid));
      setPlayerTwo(prev => prev.filter(player => player?.pid !== item?.pid));
      setAvailableCredits(prev => prev + item?.fantasy_player_rating);
    },
    [selectedPlayers, selectedPlayerDetails, player, playerTwo, availableCredits]
  );

  const onSubmit = (unannouncesSelect) => {
    const playerNew = unannouncesSelect.filter(i => {
      return i?.title == removedSpacesTeamsTitle[0];
    });
    const playerTwoNew = unannouncesSelect.filter(i => {
      return i?.title == removedSpacesTeamsTitle[1];
    });
    if (unannouncesSelect?.length) {
      let newData = selectedPlayers.filter(
        player =>
          !unannouncesSelect.some(
            unannouncedPlayer => unannouncedPlayer.pid === player,
          ),
      );
      let newDatadetails = selectedPlayerDetails.filter(
        player =>
          !unannouncesSelect.some(
            unannouncedPlayer => unannouncedPlayer.pid === player.pid,
          ),
      );
      const totalFantasyRating = unannouncesSelect.reduce(
        (total, player) => total + player.fantasy_player_rating,
        0,
      );
      let playerLengthOne = player.filter(
        player => !playerNew.some(newPlayer => newPlayer.pid === player.pid),
      );
      let playerLengthTwo = playerTwo.filter(
        player => !playerTwoNew.some(newPlayer => newPlayer.pid === player.pid),
      );
      setSelectedPlayers(newData);
      setSelectedPlayersDetails(newDatadetails);
      setOnClose(true);
      setAvailableCredits(availableCredits + totalFantasyRating);
      setPlayer(playerLengthOne?.length ? playerLengthOne : player);
      setPlayerTwo(playerLengthTwo?.length ? playerLengthTwo : playerTwo);
      refsheetUnannounced?.current?.close();
    } else {
      toastAlert.showToastError('Please select Unannounced player to remove');
    }
  };

  const { width } = useWindowDimensions();
  
  // Create data provider
  const dataProvider = useMemo(() => {
    return new DataProvider((r1, r2) => {
      return r1.pid !== r2.pid;
    });
  }, []);

  // Memoize the data provider with current data
  const memoizedDataProvider = useMemo(() => {
    return dataProvider.cloneWithRows(getPlayersData() || []);
  }, [dataProvider, getPlayersData]);

  // Create layout provider
  const layoutProvider = useMemo(() => {
    return new LayoutProvider(
      () => 0, // Only one view type
      (type, dim) => {
        dim.width = width;
        dim.height = 80; // Adjust this based on your item height
      }
    );
  }, [width]);

  const filterDataOfSorting = useCallback((title) => {
    setNewAllPlayer(prev => {
      if (prev === 'high') return 'low';
      if (prev === 'low') return 'high';
      return 'low';
    });
    setSaveTitle(title);
  }, []);

  const RenderTabBar = useCallback(props => {
    return (
      <>
        <TabBar
          {...props}
          onTabPress={e => {
            setIndex(props.navigationState.routes.findIndex(route => route.key === e.route.key));
          }}
          scrollEnabled={false}
          tabStyle={{ flex: 1 }}
          renderLabel={({ route, focused }) => (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 40,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <AppText
                  type={ELEVEN}
                  color={focused ? BROWNYELLOW : WHITE}
                  weight={POPPINS_MEDIUM}
                  style={{ fontSize: 10, textAlign: 'center' }}
                >
                  {`${route.title} (${
                    route.key === 'wk'
                      ? filterSelectedPlayer?.wk?.length
                      : route.key === 'bat'
                        ? filterSelectedPlayer?.bat?.length
                        : route.key === 'ar'
                          ? filterSelectedPlayer?.all?.length
                          : route.key === 'bowl'
                            ? filterSelectedPlayer?.bowl?.length
                            : 0
                  })`}
                </AppText>
              </View>
              {focused ? (
                <LinearGradient
                  style={{ height: 2, width: 65 }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  colors={[
                    colors.playerDetailsLinerOne,
                    colors.playerDetailsLinerTwo,
                  ]}
                />
              ) : (
                <View style={{ height: 2, width: 65 }} />
              )}
            </View>
          )}
          indicatorStyle={{ backgroundColor: 'transparent' }}
          pressColor={'transparent'}
          style={{ width: '100%', backgroundColor: 'transparent', elevation: 0 }}
        />
      </>
    );
  }, [filterSelectedPlayer]);

  const renderScene = useCallback(({ route }) => {
    if (!allPlayers?.length) return null;
    
    const { teamA, teamB } = getPlayersData(route.key.toLowerCase());
    
    // Special handling for Squads tab
    if (route.key === 'pl') {
      // Calculate the maximum length needed for the lists
      const maxLength = Math.max(teamA.length, teamB.length);
      // Create arrays of equal length by padding with null
      const paddedTeamA = [...teamA, ...Array(maxLength - teamA.length).fill(null)];
      const paddedTeamB = [...teamB, ...Array(maxLength - teamB.length).fill(null)];
      
      // Combine both teams into pairs
      const combinedData = paddedTeamA.map((teamAPlayer, index) => ({
        teamAPlayer,
        teamBPlayer: paddedTeamB[index],
      }));

      return (
        <View style={{ flex: 1, marginTop: 10 }}>
          <FlatList
            ref={listRef}
            data={combinedData}
            renderItem={({ item }) => (
              <View style={{ 
                flexDirection: 'row', 
                flex: 1,
                minHeight: 85,
              }}>
                {/* Team A Player */}
                <View style={{ flex: 1, borderRightWidth: 0.5, borderColor: colors.gray }}>
                  {item.teamAPlayer && (
                    <PlayerItem
                      item={item.teamAPlayer}
                      onSelect={handlePlayerSelection}
                      onDetail={onDetail}
                      isSelected={selectedPlayers.includes(item.teamAPlayer.pid)}
                      TeamsShortNames={TeamsShortNames}
                      removedSpacesTeamsTitle={removedSpacesTeamsTitle}
                    />
                  )}
                </View>
                
                {/* Team B Player */}
                <View style={{ flex: 1 }}>
                  {item.teamBPlayer && (
                    <PlayerItem
                      item={item.teamBPlayer}
                      onSelect={handlePlayerSelection}
                      onDetail={onDetail}
                      isSelected={selectedPlayers.includes(item.teamBPlayer.pid)}
                      TeamsShortNames={TeamsShortNames}
                      removedSpacesTeamsTitle={removedSpacesTeamsTitle}
                    />
                  )}
                </View>
              </View>
            )}
            keyExtractor={(item, index) => `row-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: 85,
              offset: 85 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </View>
      );
    }
    
    // Regular tab view for other tabs
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          ref={listRef}
          data={[...teamA, ...teamB]}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.pid?.toString() || index.toString()}
          onScroll={e => {
            scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
          }}
          getItemLayout={(data, index) => ({
            length: 85,
            offset: 85 * index,
            index,
          })}
          initialScrollIndex={0}
          maxToRenderPerBatch={10}
          windowSize={10}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        />
      </View>
    );
  }, [getPlayersData, renderItem, handlePlayerSelection, onDetail, selectedPlayers, allPlayers]);

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <TouchableOpacityView
          onPress={() => NavigationService.goBack()}
          style={styles.topContainer}
        >
          <FastImage
            resizeMode="contain"
            source={backIconMain}
            style={styles.leftArrow}
          />
          <AppText weight={POPPINS_MEDIUM} type={FORTEEN}>
            Create Team
          </AppText>
        </TouchableOpacityView>
        <ImageBackground
          source={headerIner}
          resizeMode="contain"
          style={styles.header}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
              source={{
                uri:
                  route?.params?.TeamAlogo == undefined
                    ? TeamAlogo
                    : route?.params?.TeamAlogo,
              }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <View>
              <AppText style={{ paddingLeft: 5 }}>
                {TeamsShortNames && TeamsShortNames?.length !== 0
                  ? TeamsShortNames[0]
                  : ''}
              </AppText>
              <AppText weight={POPPINS_MEDIUM} style={{ paddingLeft: 5 }}>
                {player?.length}
              </AppText>
            </View>
          </View>
          <LiveTime
            view={true}
            color={timeDifference >= 1 ? BLACK : BLACK}
            top={true}
            details={contestData}
            setRemoveTabs={setRemoveTabs}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <AppText style={{ paddingRight: 5 }}>
                {' '}
                {TeamsShortNames &&
                  TeamsShortNames.length >= 1 &&
                  TeamsShortNames[1]}
              </AppText>
              <AppText
                weight={POPPINS_MEDIUM}
                style={{
                  paddingRight: 5,
                  alignSelf: 'flex-end',
                }}
              >
                {playerTwo?.length}
              </AppText>
            </View>
            <FastImage
              source={{
                uri:
                  route?.params?.TeamBlogo == undefined
                    ? TeamBlogo
                    : route?.params?.TeamBlogo,
              }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
        <View style={styles.card}>
          <View style={styles.midContainer}>
            <View style={{ justifyContent: 'center' }}>
              <AppText type={TEN}>Selection</AppText>
              <AppText type={TEN} weight={POPPINS_BOLD}>
                {`${selectedPlayers?.length}/11`}
              </AppText>
            </View>
            <AppText
              style={{
                textAlign: 'center',
                marginBottom: 5,
              }}
              type={TEN}
              weight={POPPINS_MEDIUM}
            >
              Max 7 player from a team
            </AppText>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <AppText type={TEN} weight={POPPINS_MEDIUM}>
                Credit
              </AppText>
              <AppText type={TEN} weight={POPPINS_BOLD}>
                {availableCredits}
              </AppText>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 8,
              }}
            >
              {new Array(11).fill('').map((_, index) => {
                return index + 1 > selectedPlayerDetails?.length ? (
                  <PlayerBedge />
                ) : (
                  <PlayerRoleBadge
                    data={selectedPlayerDetails}
                    playerDetails={index + 1}
                  />
                );
              })}
            </View>
            <FastImage
              style={{
                height: 24,
                width: 24,
              }}
              resizeMode="contain"
              tintColor={colors.lightRed}
              source={StopIcon}
            />
          </View>
        </View>

        <View style={styles.playerListingHead}>
          <TouchableOpacity
            onPress={() => filterDataOfSorting('PLAYERS')}
            style={{ flex: 1, alignItems: 'center' }}>
            <AppText style={styles.playerListingHeadTitle}>
              PLAYERS {saveTitle === 'PLAYERS' && (newAllPlayer === 'high' ? '↑' : '↓')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterDataOfSorting('CREDITS')}
            style={{ flex: 1, alignItems: 'center' }}>
            <AppText style={styles.playerListingHeadTitle}>
              CREDITS {saveTitle === 'CREDITS' && (newAllPlayer === 'high' ? '↑' : '↓')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterDataOfSorting('AVG POINTS')}
            style={{ flex: 1, alignItems: 'center' }}>
            <AppText style={styles.playerListingHeadTitle}>
              AVG POINTS {saveTitle === 'AVG POINTS' && (newAllPlayer === 'high' ? '↑' : '↓')}
            </AppText>
          </TouchableOpacity>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={RenderTabBar}
          lazy
          swipeEnabled={true}
          style={{ flex: 1 }}
        />

        <View style={styles.buttonContainer}>
          <SecondaryButton
            onPress={onPreview}
            buttonStyle={[
              styles.buttonStyle,
              {
                borderWidth: 1,
                borderRadius: 10,
                borderColor: colors.brownYellow,
              },
            ]}
            title={'TEAM PREVIEW'}
            titleStyle={{ color: colors.brownYellow }}
          />
          <PrimaryButton
            buttonStyle={styles.buttonStyle}
            onPress={onContinueClick}
            title="CONTINUE"
          />
        </View>
      </CommonImageBackground>
      <PlayerDetailModal
        isVisible={isVisible}
        setIsVisible={() => setIsVisible(false)}
        removePlayerFromTeam={removePlayerFromTeam}
        addPlayerInTeam={addPlayerInTeam}
        selectedPlayers={selectedPlayers}
        playerimg={playerimg}
        logo={logo}
        saveTeam={saveTeam}
      />
      <RBSheet
        ref={refsheetUnannounced}
        closeOnPressBack={false}
        closeOnDragDown={false}
        closeOnPressMask={false}
        height={
          Unannounced?.length == 1
            ? 230
            : Unannounced?.length == 2
              ? 330
              : Unannounced?.length >= 3
                ? 450
                : 450
        }
        customStyles={{
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingHorizontal: universalPaddingHorizontal,
            paddingVertical: 10,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
            display: 'none',
          },
        }}
      >
        <UnannouncedPlayer
          Unannounced={Unannounced}
          onSubmit={onSubmit}
          UnannouncedTWO={UnannouncedTWO}
          setAvailableCredits={setAvailableCredits}
          availableCredits={availableCredits}
          onClose={() => {
            refsheetUnannounced?.current?.close();
            setOnClose(true);
          }}
        />
      </RBSheet>
      <SpinnerSecond loading={isLoading} />
      <MatchLiveModal AleartLive={AleartLive} />
    </AppSafeAreaView>
  );
};

export default React.memo(SelectPlayer);