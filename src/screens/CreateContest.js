import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../common/InputBox';
import { KeyBoardAware } from '../common/KeyboardAware';
import FastImage from 'react-native-fast-image';
import { universalPaddingHorizontal } from '../theme/dimens';
import {
  AppText,
  BLACK,
  BLACKOPACITY,
  FORTEEN,
  LATO_SEMI_BOLD,
  POPPINS_BOLD,
  POPPINS_MEDIUM,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  TWELVE,
  WHITE,
} from '../common/AppText';
import { AppSafeAreaView } from '../common/AppSafeAreaView';
import CommonHeader from '../components/matchCard/commonHeader/CommonHeader';
import { prizepool } from '../helper/image';
import { StatusBar } from 'native-base';
import CommonImageBackground from '../common/commonImageBackground';
import PrimaryButton from '../common/primaryButton';
import { Common_Tabs, MY_CONTEST, SELECT_PLAYER } from '../navigation/routes';
import NavigationService from '../navigation/NavigationService';
import { NewColor, colors } from '../theme/color';
import { poppinsMedium } from '../theme/typography';
import { toastAlert } from '../helper/utility';
import {
  createContestData,
  getAllPlayerList,
  getMyTeam,
  getSubsituted,
  savekey,
  setAllPlayers,
  setIsContestEntry,
} from '../slices/matchSlice';
import { TouchableOpacityView } from '../common/TouchableOpacityView';
import Confirmation from '../common/Confirmation';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectTeam from '../components/selectTeam/SelectTeam';


const CreateContest = () => {
  const dispatch = useDispatch();
  const sheet = useRef();
  const route = useRoute();
  const details = useSelector(state => state?.match?.contestData);
  const myContest = useSelector(state => state?.match?.myContest);
  const contestList = useSelector(state => state?.match?.contestList);
  const matchDetails = useSelector(state => state?.match?.contestData);
  const myTeam = useSelector(state => state?.match?.myTeams);
  const contestData = useSelector(state => state?.match?.contestData);
  const { _id, SeriesId } = contestData ?? '';
  const selectTeam = useRef();
  const {
    SeriesName,
    TeamA,
    TeamAlogo,
    TeamsShortNames,
    TeamB,
    TeamBlogo,
    Status,
  } = details ?? '';
  const [name, setName] = useState('');
  const [contestSize, setContestSize] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [activeTab, setActiveTab] = useState(2);
  const [selectNumberData, setSelectNumberData] = useState([]);
  const [staticData, setStaticeData] = useState([]);
  const [random, setRandom] = useState(10);
  const [prizeData, setPrizeData] = useState([]);
  const [selectId, setSelectId] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [modalRemove, setModalRemove] = useState(false)
  // const data = [
  //   {
  //     id: 1,
  //     key: 10,
  //   },
  // ];
  let getMinusAmount = ((contestSize * entryAmount) / 100) * 10;
  let getPrizePoll = contestSize * entryAmount;
  let PrizePoll = getPrizePoll - getMinusAmount;
  let ContestSizeHalf = (contestSize / 100) * 50;

  useEffect(() => {
    for (let index = 0; index < ContestSizeHalf; index++) {
      let data = {
        id: 1,
        key: index + 1,
      };
      setSelectNumberData(Object.assign(selectNumberData, { [index]: data }));
    }
  }, [ContestSizeHalf]);
  const onSubmit = () => {
    if (name?.length == 0) {
      toastAlert.showToastError('Please enter your contest name');
    } else if (entryAmount?.length == 0) {
      toastAlert.showToastError('Please enter amount');
    } else if (contestSize?.length == 0) {
      toastAlert.showToastError('Please enter contest size');
    } else {
      if (myTeam?.length == 0) {
        let data = {
          WinningAmount: prizepool,
          categoryName: name,
          AdminCommission: 10,
          Contestsize: contestSize,
          EnteryType: 'paid',
          EnteryFee: entryAmount,
          ContestType: 'Mega',
          Rankdata: prizeData,
        };
        dispatch(createContestData(data));
        dispatch(savekey(entryAmount));
        dispatch(setAllPlayers([]))
        let datanew = { cid: SeriesId };
        dispatch(getAllPlayerList(_id, datanew));
        NavigationService.navigate(SELECT_PLAYER, matchDetails);
        dispatch(getSubsituted([]));
        dispatch(setIsContestEntry(true));
      } else if (myTeam?.length === 1) {
        let data = {
          WinningAmount: PrizePoll,
          categoryName: name,
          AdminCommission: 10,
          Contestsize: contestSize,
          EnteryType: 'paid',
          EnteryFee: entryAmount,
          ContestType: 'Mega',
          Rankdata: prizeData,
        };
        dispatch(createContestData(data));
        dispatch(getMyTeam(_id));
        setSaveTeamName(myTeam[0]?.name)
        setIsAdd(true);
      } else if (myTeam?.length > 1) {
        let data = {
          WinningAmount: PrizePoll,
          categoryName: name,
          AdminCommission: 10,
          Contestsize: contestSize,
          EnteryType: 'paid',
          EnteryFee: entryAmount,
          ContestType: 'Mega',
          Rankdata: prizeData,
        };
        dispatch(createContestData(data));
        selectTeam?.current?.open();
      }
    }
  };
  useEffect(() => {
    if (contestSize?.length) {
      if (contestSize <= 1) {
        toastAlert.showToastError('Min 2');
      } else if (contestSize <= 3) {
        let data = [{ id: 1, pricebreakUp: 1 }];
        setStaticeData(data);
      } else if (contestSize <= 5) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 7) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 9) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 13) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 19) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 29) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 49) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 99) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 9, pricebreakUp: 25 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 199) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 9, pricebreakUp: 25 },
          { id: 10, pricebreakUp: 50 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 499) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 9, pricebreakUp: 25 },
          { id: 10, pricebreakUp: 50 },
          { id: 11, pricebreakUp: 100 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 999) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 8, pricebreakUp: 25 },
          { id: 9, pricebreakUp: 50 },
          { id: 10, pricebreakUp: 100 },
          { id: 11, pricebreakUp: 250 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 1999) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 8, pricebreakUp: 25 },
          { id: 9, pricebreakUp: 50 },
          { id: 10, pricebreakUp: 100 },
          { id: 11, pricebreakUp: 500 },
        ];
        setStaticeData(data);
      } else if (contestSize <= 3999) {
        let data = [
          { id: 1, pricebreakUp: 1 },
          { id: 2, pricebreakUp: 2 },
          { id: 3, pricebreakUp: 3 },
          { id: 4, pricebreakUp: 4 },
          { id: 5, pricebreakUp: 5 },
          { id: 6, pricebreakUp: 7 },
          { id: 7, pricebreakUp: 10 },
          { id: 8, pricebreakUp: 15 },
          { id: 8, pricebreakUp: 25 },
          { id: 9, pricebreakUp: 50 },
          { id: 10, pricebreakUp: 100 },
          { id: 11, pricebreakUp: 500 },
          { id: 12, pricebreakUp: 1000 },
        ];
        setStaticeData(data);
      } else if (contestSize > 4000) {
        toastAlert.showToastError('Max 4,000');
        setStaticeData([]);
      }
    } else {
      setStaticeData([]);
    }
  }, [contestSize]);
  const selectPrize = item => {
    if (setEntryAmount?.length == 0) {
      toastAlert.showToastError('Please enter prize');
    } else if (item.pricebreakUp == 1) {
      let per = (100 / 100) * PrizePoll;
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: per,
          PercentageEach: 100,
          TotalPercentage: 100,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
    } else if (item.pricebreakUp == 2) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(70 / 100) * PrizePoll}`,
          PercentageEach: 70,
          TotalPercentage: 70,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(30 / 100) * PrizePoll}`,
          PercentageEach: 30,
          TotalPercentage: 30,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
    } else if (item.pricebreakUp == 3) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(50 / 100) * PrizePoll}`,
          PercentageEach: 50,
          TotalPercentage: 50,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(30 / 100) * PrizePoll}`,
          PercentageEach: 30,
          TotalPercentage: 30,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(20 / 100) * PrizePoll}`,
          PercentageEach: 20,
          TotalPercentage: 20,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
    } else if (item.pricebreakUp == 4) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(40 / 100) * PrizePoll}`,
          PercentageEach: 40,
          TotalPercentage: 40,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(25 / 100) * PrizePoll}`,
          PercentageEach: 25,
          TotalPercentage: 25,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(20 / 100) * PrizePoll}`,
          PercentageEach: 20,
          TotalPercentage: 20,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(15 / 100) * PrizePoll}`,
          PercentageEach: 15,
          TotalPercentage: 15,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
    } else if (item.pricebreakUp == 5) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(40 / 100) * PrizePoll}`,
          PercentageEach: 40,
          TotalPercentage: 40,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(23 / 100) * PrizePoll}`,
          PercentageEach: 23,
          TotalPercentage: 23,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(15.11 / 100) * PrizePoll}`,
          PercentageEach: 15.11,
          TotalPercentage: 15.11,
        },
        {
          id: 4,
          rank: '4 - 5',
          StartRank: 4,
          EndRank: 5,
          Price: `${(11.11 / 100) * PrizePoll}`,
          PercentageEach: 11.11,
          TotalPercentage: 22.22,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
    } else if (item.pricebreakUp == 7) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(35 / 100) * PrizePoll}`,
          PercentageEach: 35,
          TotalPercentage: 35,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(19 / 100) * PrizePoll}`,
          PercentageEach: 19,
          TotalPercentage: 19,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(12 / 100) * PrizePoll}`,
          PercentageEach: 12,
          TotalPercentage: 12,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(10 / 100) * PrizePoll}`,
          PercentageEach: 10,
          TotalPercentage: 10,
        },
        {
          id: 5,
          rank: '5 - 7',
          StartRank: 5,
          EndRank: 7,
          Price: `${(8 / 100) * PrizePoll}`,
          PercentageEach: 8,
          TotalPercentage: 24,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 10) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(33 / 100) * PrizePoll}`,
          PercentageEach: 33,
          TotalPercentage: 33,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(18 / 100) * PrizePoll}`,
          PercentageEach: 18,
          TotalPercentage: 18,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(11 / 100) * PrizePoll}`,
          PercentageEach: 11,
          TotalPercentage: 11,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(7.5 / 100) * PrizePoll}`,
          PercentageEach: 7.5,
          TotalPercentage: 7.5,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(6 / 100) * PrizePoll}`,
          PercentageEach: 6,
          TotalPercentage: 6,
        },
        {
          id: 6,
          rank: `6 - 10`,
          StartRank: 6,
          EndRank: 10,
          Price: `${(5.5 / 100) * PrizePoll}`,
          PercentageEach: 5.5,
          TotalPercentage: 27.5,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 15) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(25 / 100) * PrizePoll}`,
          PercentageEach: 25,
          TotalPercentage: 25,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(12.5 / 100) * PrizePoll}`,
          PercentageEach: 12.5,
          TotalPercentage: 12.5,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(10 / 100) * PrizePoll}`,
          PercentageEach: 10,
          TotalPercentage: 10,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(7.5 / 100) * PrizePoll}`,
          PercentageEach: 7.5,
          TotalPercentage: 7.5,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(6 / 100) * PrizePoll}`,
          PercentageEach: 6,
          TotalPercentage: 6,
        },
        {
          id: 6,
          rank: `6 - 15`,
          StartRank: 6,
          EndRank: 15,
          Price: `${(4 / 100) * PrizePoll}`,
          PercentageEach: 4,
          TotalPercentage: 40,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 25) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(20 / 100) * PrizePoll}`,
          PercentageEach: 20,
          TotalPercentage: 20,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(12 / 100) * PrizePoll}`,
          PercentageEach: 12,
          TotalPercentage: 12,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(8 / 100) * PrizePoll}`,
          PercentageEach: 8,
          TotalPercentage: 8,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(5 / 100) * PrizePoll}`,
          PercentageEach: 5,
          TotalPercentage: 5,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(5 / 100) * PrizePoll}`,
          PercentageEach: 5,
          TotalPercentage: 5,
        },
        {
          id: 6,
          rank: `6 - 25`,
          StartRank: 6,
          EndRank: 25,
          Price: `${(2.5 / 100) * PrizePoll}`,
          PercentageEach: 2.5,
          TotalPercentage: 50,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 50) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(15 / 100) * PrizePoll}`,
          PercentageEach: 15,
          TotalPercentage: 15,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(10 / 100) * PrizePoll}`,
          PercentageEach: 10,
          TotalPercentage: 10,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(8 / 100) * PrizePoll}`,
          PercentageEach: 8,
          TotalPercentage: 10,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(4 / 100) * PrizePoll}`,
          PercentageEach: 4,
          TotalPercentage: 4,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(3 / 100) * PrizePoll}`,
          PercentageEach: 3,
          TotalPercentage: 3,
        },
        {
          id: 6,
          rank: `6 - 10`,
          StartRank: 6,
          EndRank: 10,
          Price: `${(2 / 100) * PrizePoll}`,
          PercentageEach: 2,
          TotalPercentage: 10,
        },
        {
          id: 7,
          rank: `11 - 25`,
          StartRank: 11,
          EndRank: 25,
          Price: `${(1.5 / 100) * PrizePoll}`,
          PercentageEach: 1.5,
          TotalPercentage: 22.5,
        },
        {
          id: 8,
          rank: `26 - 50`,
          StartRank: 26,
          EndRank: 50,
          Price: `${(1.1 / 100) * PrizePoll}`,
          PercentageEach: 1.1,
          TotalPercentage: 27.5,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 100) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(15 / 100) * PrizePoll}`,
          PercentageEach: 15,
          TotalPercentage: 15,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(10 / 100) * PrizePoll}`,
          PercentageEach: 10,
          TotalPercentage: 10,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(8 / 100) * PrizePoll}`,
          PercentageEach: 8,
          TotalPercentage: 8,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(3.75 / 100) * PrizePoll}`,
          PercentageEach: 3.75,
          TotalPercentage: 3.75,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(3.5 / 100) * PrizePoll}`,
          PercentageEach: 3.5,
          TotalPercentage: 3.5,
        },
        {
          id: 6,
          rank: `6 - 10`,
          StartRank: 6,
          EndRank: 10,
          Price: `${(1.5 / 100) * PrizePoll}`,
          PercentageEach: 1.5,
          TotalPercentage: 7.5,
        },
        {
          id: 7,
          rank: `11 - 15`,
          StartRank: 11,
          EndRank: 15,
          Price: `${(1 / 100) * PrizePoll}`,
          PercentageEach: 1,
          TotalPercentage: 5,
        },
        {
          id: 8,
          rank: `16 - 25`,
          StartRank: 16,
          EndRank: 25,
          Price: `${(0.6 / 100) * PrizePoll}`,
          PercentageEach: 0.6,
          TotalPercentage: 6,
        },
        {
          id: 9,
          rank: `26 - 100`,
          StartRank: 26,
          EndRank: 100,
          Price: `${(0.55 / 100) * PrizePoll}`,
          PercentageEach: 0.55,
          TotalPercentage: 41.25,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 250) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(12 / 100) * PrizePoll}`,
          PercentageEach: 12,
          TotalPercentage: 12,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(7.5 / 100) * PrizePoll}`,
          PercentageEach: 7.5,
          TotalPercentage: 7.5,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(5 / 100) * PrizePoll}`,
          PercentageEach: 5,
          TotalPercentage: 5,
        },
        {
          id: 4,
          rank: 4,
          StartRank: 4,
          EndRank: 4,
          Price: `${(3 / 100) * PrizePoll}`,
          PercentageEach: 3,
          TotalPercentage: 3,
        },
        {
          id: 5,
          rank: 5,
          StartRank: 5,
          EndRank: 5,
          Price: `${(2.25 / 100) * PrizePoll}`,
          PercentageEach: 2.25,
          TotalPercentage: 2.25,
        },
        {
          id: 6,
          rank: `6 - 10`,
          StartRank: 6,
          EndRank: 10,
          Price: `${(2 / 100) * PrizePoll}`,
          PercentageEach: 2,
          TotalPercentage: 10,
        },
        {
          id: 7,
          rank: `11 - 15`,
          StartRank: 11,
          EndRank: 15,
          Price: `${(1 / 100) * PrizePoll}`,
          PercentageEach: 1,
          TotalPercentage: 5,
        },
        {
          id: 8,
          rank: `16 - 25`,
          StartRank: 16,
          EndRank: 25,
          Price: `${(0.5 / 100) * PrizePoll}`,
          PercentageEach: 0.5,
          TotalPercentage: 5,
        },
        {
          id: 9,
          rank: `26 - 50`,
          StartRank: 26,
          EndRank: 50,
          Price: `${(0.25 / 100) * PrizePoll}`,
          PercentageEach: 0.25,
          TotalPercentage: 6.25,
        },
        {
          id: 9,
          rank: `51 - 250`,
          StartRank: 51,
          EndRank: 250,
          Price: `${(0.22 / 100) * PrizePoll}`,
          PercentageEach: 0.22,
          TotalPercentage: 44,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 500) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(10 / 100) * PrizePoll}`,
          PercentageEach: 10,
          TotalPercentage: 10,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(7 / 100) * PrizePoll}`,
          PercentageEach: 7,
          TotalPercentage: 7,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(3.5 / 100) * PrizePoll}`,
          PercentageEach: 3.5,
          TotalPercentage: 3.5,
        },
        {
          id: 4,
          rank: `4 - 5`,
          StartRank: 4,
          EndRank: 5,
          Price: `${(2.5 / 100) * PrizePoll}`,
          PercentageEach: 2.5,
          TotalPercentage: 5,
        },
        {
          id: 5,
          rank: `6 - 10`,
          StartRank: 6,
          EndRank: 10,
          Price: `${(1 / 100) * PrizePoll}`,
          PercentageEach: 1,
          TotalPercentage: 5,
        },
        {
          id: 6,
          rank: `11 - 25`,
          StartRank: 11,
          EndRank: 25,
          Price: `${(0.3 / 100) * PrizePoll}`,
          PercentageEach: 0.3,
          TotalPercentage: 4.5,
        },
        {
          id: 7,
          rank: `26 - 100`,
          StartRank: 26,
          EndRank: 100,
          Price: `${(0.2 / 100) * PrizePoll}`,
          PercentageEach: 0.2,
          TotalPercentage: 15,
        },
        {
          id: 8,
          rank: `101 - 250`,
          StartRank: 101,
          EndRank: 250,
          Price: `${(0.15 / 100) * PrizePoll}`,
          PercentageEach: 0.15,
          TotalPercentage: 22.5,
        },
        {
          id: 9,
          rank: `251 - 500`,
          StartRank: 251,
          EndRank: 500,
          Price: `${(0.11 / 100) * PrizePoll}`,
          PercentageEach: 0.11,
          TotalPercentage: 27.5,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    } else if (item.pricebreakUp == 1000) {
      let data = [
        {
          id: 1,
          rank: 1,
          StartRank: 1,
          EndRank: 1,
          Price: `${(5 / 100) * PrizePoll}`,
          PercentageEach: 5,
          TotalPercentage: 5,
        },
        {
          id: 2,
          rank: 2,
          StartRank: 2,
          EndRank: 2,
          Price: `${(3 / 100) * PrizePoll}`,
          PercentageEach: 3,
          TotalPercentage: 3,
        },
        {
          id: 3,
          rank: 3,
          StartRank: 3,
          EndRank: 3,
          Price: `${(2 / 100) * PrizePoll}`,
          PercentageEach: 2,
          TotalPercentage: 2,
        },
        {
          id: 4,
          rank: `4 - 10`,
          StartRank: 4,
          EndRank: 10,
          Price: `${(1 / 100) * PrizePoll}`,
          PercentageEach: 1,
          TotalPercentage: 6,
        },
        {
          id: 5,
          rank: `11 - 50`,
          StartRank: 11,
          EndRank: 50,
          Price: `${(0.3 / 100) * PrizePoll}`,
          PercentageEach: 0.3,
          TotalPercentage: 12,
        },
        {
          id: 6,
          rank: `51 - 100`,
          StartRank: 51,
          EndRank: 100,
          Price: `${(0.06 / 100) * PrizePoll}`,
          PercentageEach: 0.06,
          TotalPercentage: 10,
        },
        {
          id: 7,
          rank: `101 - 500`,
          StartRank: 101,
          EndRank: 500,
          Price: `${(0.2 / 100) * PrizePoll}`,
          PercentageEach: 0.2,
          TotalPercentage: 32,
        },
        {
          id: 8,
          rank: `501 - 1000`,
          StartRank: 501,
          EndRank: 1000,
          Price: `${(0.08 / 100) * PrizePoll}`,
          PercentageEach: 0.08,
          TotalPercentage: 30,
        },
      ];
      setPrizeData(data);
      setSelectId(item.id);
      setRandom(Math.random());
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacityView
        onPress={() => selectPrize(item)}
        style={styles.circleTopView}>
        <View
          style={[
            styles.circleView,
            {
              marginLeft: index == 0 ? null : 5,
              backgroundColor: selectId == item.id ? NewColor.linerBabyPink : null,
            },
          ]}>
          <AppText
            style={{ marginTop: 2 }}
            type={FORTEEN}
            weight={POPPINS_MEDIUM}
            color={selectId == item.id ? WHITE : BLACK}>
            {item.pricebreakUp}
          </AppText>
        </View>
      </TouchableOpacityView>
    );
  };

  const remderIteamprize = ({ item, index }) => {
    const isLastItem = index === prizeData?.length - 1;
    return (
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            marginVertical: 10,
          }}>
          <AppText weight={POPPINS_MEDIUM} color={BLACK}>#{item.rank}</AppText>
          <AppText weight={LATO_SEMI_BOLD} color={BLACK}>₹{Math.round(item.Price)}</AppText>
        </View>
        <View style={{ height: isLastItem ? null : 1, backgroundColor: NewColor.linerLightBlueFifty }} />
      </View>
    );
  };

  return (
    <AppSafeAreaView hidden={false}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      <CommonImageBackground common>
        <CommonHeader
          activeTab={activeTab}
          setActiveTab={e => setActiveTab(e)}
          allContest={true}
          style={{ marginBottom: 0, height: 60 }}
          setModalRemove={setModalRemove}
        />
        <KeyBoardAware style={styles.mainContainer}>
          <AppText
            weight={POPPINS_SEMI_BOLD}
            type={FORTEEN}
            color={BLACK}
            style={{ marginTop: 10 }}>
            Create Contest
          </AppText>

          <View style={styles.box}>
            <InputBox
              placeholder="Enter your contest name"
              value={name}
              placeholderTextColor={'grey'}
              labelStyle={styles.label}
              label="Contest Name"
              returnKeyType="next"
              onChange={value => setName(value)}
              textInputBox={styles.textInputBox}
            />
            <View style={styles.dateContainer}>
              <InputBox
                placeholder="Enter size"
                value={contestSize}
                placeholderTextColor={'grey'}
                labelStyle={[styles.label, {}]}
                label="Contset Size"
                returnKeyType="next"
                keyboardType={'numeric'}
                onChange={value => setContestSize(value)}
                textInputBox={styles.textInputBox}
                style={{ flex: 1, marginEnd: 10 }}
              />
              <InputBox
                placeholder="Enter entry fess"
                value={entryAmount}
                placeholderTextColor={'grey'}
                labelStyle={[styles.label, {}]}
                label="Entry"
                returnKeyType="done"
                keyboardType={'numeric'}
                onChange={value => setEntryAmount(value)}
                textInputBox={styles.textInputBox}
                style={{ flex: 1, marginStart: 10 }}
              />
            </View>
          </View>
          <View style={styles.prizeContainer}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.prizeView}>
                  <FastImage
                    source={prizepool}
                    resizeMode="contain"
                    tintColor={colors.black}
                    style={{ height: 24, width: 28 }}
                  />
                </View>
                <View style={{ alignSelf: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <AppText type={TWELVE} style={{ marginLeft: 10 }}>
                      Prize Pool
                    </AppText>
                  </View>
                </View>
              </View>

              <AppText
                type={TWELVE}
                weight={POPPINS_MEDIUM}
                style={{
                  alignSelf: 'center',
                  marginRight: 10,
                }}>
                {PrizePoll}
              </AppText>
            </View>
          </View>
          {entryAmount?.length && contestSize?.length ?
            <AppText
              style={{
                marginTop: 10,
              }}
              color={BLACKOPACITY}
              type={FORTEEN}
              weight={POPPINS_MEDIUM}>
              Select the number of winners
            </AppText>
            : <></>}
          <View>
            {entryAmount?.length && contestSize?.length ? (
              <FlatList
                data={staticData?.length ? staticData : []}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <></>
            )}
          </View>
          {prizeData?.length && entryAmount?.length ? (
            <FlatList
              data={prizeData ? prizeData : []}
              renderItem={remderIteamprize}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                index.toString();
              }}
              style={{ paddingVertical: 15 }}
              contentContainerStyle={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: NewColor.linerLightBlueFifty,
              }}
            />
          ) : (
            <></>
          )}
        </KeyBoardAware>
        <View
          style={{
            paddingHorizontal: universalPaddingHorizontal,
            marginBottom: 10,
          }}>
          <PrimaryButton
            onPress={onSubmit}
            // onPress={() => NavigationService.navigate(MY_CONTEST)}
            title="CREATE CONTEST"
          />
        </View>
      </CommonImageBackground>
      <RBSheet
        ref={selectTeam}
        closeOnDragDown={false}
        openDuration={100}
        height={Dimensions.get('window').height}
        customStyles={{
          container: {
            backgroundColor: NewColor.linerWhite,
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
          selectTeam={selectTeam}
          teamDetails={details?.teamDetails}
          joinWith={details.teams}
          JoinWithMULT={details?.JoinWithMULT}
        />
      </RBSheet>
      <Confirmation
        isModalVisible={isAdd}
        details={details}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        contestPrice={entryAmount}
        saveTeamName={saveTeamName}
        selectMulty={[]}
        privateContest={true}
      />
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: universalPaddingHorizontal,
  },
  prizeContainer: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
  },
  prizeView: {
    backgroundColor: NewColor.linerBlackFive,
    height: 45,
    width: 45,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperContainer: {
    flex: 1,
    backgroundColor: 'black',
    padding: 0,
  },
  backgroundImageContainer: {
    height: 160,

    width: '100%',
    backgroundColor: 'transparent',
    padding: 0,
    position: 'relative',
  },
  bgImage: {
    height: '100%',

    width: '100%',
  },
  withdraw: {
    color: '#ffffff',
  },
  wallet: {
    color: '#ffffff',
    marginTop: 15,
  },

  box: {
    borderWidth: 1,
    borderColor: colors.borderLightBlue,
    borderRadius: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  label: {
    marginTop: 0,
    marginBottom: 5,
  },
  textInputBox: {
    fontSize: 14,
    fontFamily: poppinsMedium,
    color: colors.black,
    marginTop: 5,
    flex: 1,
  },
  boxContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
  },
  bottomBoxContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  image: {
    height: 24,
    width: 22,
    alignSelf: 'center',
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
    // marginBottom: 10,
  },
  textInputStyle: {
    height: 40,
    width: 157,
  },
  circleView: {
    height: 30,
    width: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTopView: {
    marginTop: 10,
  },
});
export default CreateContest;
