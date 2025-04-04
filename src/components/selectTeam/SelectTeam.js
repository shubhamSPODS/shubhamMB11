import {
  Dimensions,
  FlatList,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import FastImage from "@d11/react-native-fast-image";

import { CLOSE_WHITE_ICON, greenmark } from '../../helper/image';
import {
  AppText,
  FORTEEN,
  POPPINS_BOLD,
  POPPINS_BOLD_ITALIC,
  POPPINS_SEMI_BOLD,
  SIXTEEN,
  THIRTEEN,
  WHITE,
} from '../../common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import MyTeam from '../matchCard/myTeam/MyTeam';
import LinearGradient from 'react-native-linear-gradient';
import { toastAlert } from '../../helper/utility';
import { getMyJoinedContest, joinContest } from '../../slices/matchSlice';
import Confirmation from '../../common/Confirmation';
import { colors } from '../../theme/color';
import MyTeamSelect from '../matchCard/myTeam/MyTeamSelect';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import { universalPaddingHorizontal } from '../../theme/dimens';
const SelectTeam = ({ onClose, contestDetails, matchDetails, teamDetails, joinWith, JoinWithMULT }) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [selectMulty, setSelectMulty] = useState([])
  const [random, setRandom] = useState(10);
  const [allSelects, setAllSelects] = useState(false);
  const onSelectTeam = item => {
    let checkingTeam = teamDetails?.filter((items) => {
      return items?.team_id == item?._id
    })
    let lengthTeam = teamDetails?.length + selectMulty?.length
    if (checkingTeam?.length) {
      toastAlert.showToastError('You have already joined with this team')
    } else if (JoinWithMULT) {
      if (selectMulty?.length) {
        let array = selectMulty?.findIndex((e) => {
          return e?._id == item?._id
        })
        if (array > -1) {
          selectMulty.splice(array, 1);
          setRandom(Math.random());
        } else {
          if (joinWith == lengthTeam || joinWith == selectMulty?.length) {
            toastAlert.showToastError(`You join only ${joinWith} teams`)
          } else {
            selectMulty.push(item);
            setRandom(Math.random());
          }
        }
      } else {
        setSelectMulty([item])
        setRandom(Math.random());
      }
    } else {
      setSelectedTeam(item);
    }
  };
  const onJoinContest = async () => {
    if (JoinWithMULT) {
      setIsAdd(true);
    } else {
      if (!selectedTeam) {
        return toastAlert.showToastError('Please Select Team Before Join Contest');
      }
      setSaveTeamName(selectedTeam?.name)
      setIsAdd(true);
    }
  };
  const filteredData = myTeam
    .filter(dataItem => {
      const teamIdToCheck = dataItem._id;
      return teamDetails?.some(item => item.team_id === teamIdToCheck);
    })
    .map((filteredItem, index) => ({ ...filteredItem, already: index === 0 }))
  const newData = myTeam?.filter(dataItem => {
    const teamIdToCheck = dataItem._id;
    return !filteredData?.some(item => item._id === teamIdToCheck);
  });
  const result = newData?.concat(filteredData);
  const renderMyTeam = ({ item }) => {
    let newid = selectMulty?.find(value => {
      return value._id == item._id;
    });
    let checkingTeam = teamDetails?.find((items) => {
      return items?.team_id == item?._id
    })
    return (
      <>
        {JoinWithMULT ?
          <MyTeamSelect
            item={item}
            isFromSelect={true}
            onSelectTeam={data => onSelectTeam(data)}
            isTeamSelected={selectedTeam?._id == item?._id}
            checkingTeam={checkingTeam ? true : false}
            selectMulty={newid ? true : false}
            JoinWithMULT={JoinWithMULT}
          /> :
          <MyTeam
            item={item}
            isFromSelect={true}
            onSelectTeam={data => onSelectTeam(data)}
            isTeamSelected={selectedTeam?._id == item?._id}
          />
        }
      </>
    );
  };
  const allSelect = () => {
    const filteredData = [];
    for (const dataItem of myTeam) {
      const teamIdToCheck = dataItem?._id;
      const isTeamIdInDetails = teamDetails?.some(item => item.team_id === teamIdToCheck);
      if (!isTeamIdInDetails) {
        filteredData.push(dataItem);
      }
    }
    if (allSelects == true) {
      setAllSelects(false)
      setSelectMulty([])
      setRandom(Math.random())
    } else {
      setAllSelects(true)
      setSelectMulty(filteredData?.length ? filteredData : myTeam)
      setRandom(Math.random())
    }
  }
  useEffect(() => {
    const filteredData = myTeam?.filter(dataItem => {
      const teamIdToCheck = dataItem?._id;
      return teamDetails?.some(item => item?.team_id === teamIdToCheck);
    });
    let length = myTeam?.length - filteredData?.length
    const lengthTwo = selectMulty?.length
    if (lengthTwo == length) {
      setAllSelects(true)
      setRandom(Math.random())
    } else {
      setAllSelects(false)
      setRandom(Math.random())
    }
  }, [selectMulty?.length])
  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: universalPaddingHorizontal,
        marginTop: 10
      }}>
        <TouchableOpacity style={styles.closeImageContainer} onPress={onClose}>
          <FastImage
            source={CLOSE_WHITE_ICON}
            style={styles.closeIcon}
            tintColor={colors.white}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <AppText
          weight={POPPINS_BOLD}
          type={SIXTEEN}
          style={{ textAlign: 'center', marginLeft: "15%" }}>
          Select Your Team
        </AppText>
        {JoinWithMULT ?
          <TouchableOpacityView
            onPress={allSelect} style={{
              flexDirection: 'row',
              alignItems: "center"
            }}>
            <AppText weight={POPPINS_SEMI_BOLD} color={WHITE} type={SIXTEEN}>
              Select All{'  '}
            </AppText>
            <View
              style={{
                height: 20, width: 20,
                borderWidth: 1,
                borderColor: colors.white,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {allSelects ?
                <FastImage
                  source={greenmark}
                  resizeMode='contain'
                  tintColor={'white'}
                  style={{
                    height: 11,
                    width: 11,
                    marginRight: 1
                  }}
                /> : <></>
              }
            </View>
          </TouchableOpacityView>
          : <></>}
      </View>
      <View
        style={{ marginTop: 20, height: Dimensions.get('window').height - 60 }}>
        <FlatList
          data={result}
          renderItem={renderMyTeam}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120 }}
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={[]} onPress={() => onJoinContest()}>
          <LinearGradient
            style={styles.btn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.0, y: 0 }}
            colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]}>
            <AppText
              type={SIXTEEN}
              style={{
                color: 'white',
              }}
              weight={POPPINS_BOLD_ITALIC}>
              Join Contest
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Confirmation
        isModalVisible={isAdd}
        details={contestDetails}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        onClose={onClose}
        selectedTeam={selectedTeam}
        teamLength={true}
        saveTeamName={saveTeamName}
        selectMulty={selectMulty}
        JoinWithMULT={JoinWithMULT}
      />
    </View>
  );
};

export default SelectTeam;
