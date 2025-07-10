import {
  Dimensions,
  FlatList,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './styles';
import FastImage from "@d11/react-native-fast-image";
import { AppSafeAreaView } from '../../common/AppSafeAreaView';

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
import PrimaryButton from '../../common/primaryButton';

const SelectTeam = ({ onClose, contestDetails, matchDetails, teamDetails, joinWith, JoinWithMULT }) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [selectMulty, setSelectMulty] = useState([]);

  const { filteredData, newData, result } = useMemo(() => {
    const filtered = myTeam
      .filter(dataItem => {
        const teamIdToCheck = dataItem._id;
        return !teamDetails?.some(item => item.team_id === teamIdToCheck);
      })
      .map((filteredItem, index) => ({ ...filteredItem, already: index === 0 }));

    const newFiltered = myTeam?.filter(dataItem => {
      const teamIdToCheck = dataItem._id;
      return !filtered?.some(item => item._id === teamIdToCheck);
    });

    return {
      filteredData: filtered,
      newData: newFiltered,
      result: newFiltered?.concat(filtered)
    };
  }, [myTeam, teamDetails]);

  const onSelectTeam = useCallback((item) => {
    const checkingTeam = teamDetails?.find(items => items?.team_id === item?._id);
    const lengthTeam = (teamDetails?.length || 0) + selectMulty.length;

    if (checkingTeam) {
      toastAlert.showToastError('You have already joined with this team');
    } else if (JoinWithMULT) {
      setSelectMulty(prev => {
        const existingIndex = prev.findIndex(e => e?._id === item?._id);
        if (existingIndex > -1) {
          const newArray = [...prev];
          newArray.splice(existingIndex, 1);
          return newArray;
        } else {
          if (joinWith === lengthTeam || joinWith === prev.length) {
            toastAlert.showToastError(`You can join only ${joinWith} teams`);
            return prev;
          }
          return [...prev, item];
        }
      });
    } else {
      setSelectedTeam(item);
    }
  }, [teamDetails, selectMulty.length, JoinWithMULT, joinWith]);

  const renderMyTeam = useCallback(({ item }) => {
    const isSelected = selectMulty?.some(value => value._id === item._id);
    const isAlreadyJoined = teamDetails?.some(items => items?.team_id === item?._id);

    return JoinWithMULT ? (
      <MyTeamSelect
        key={item._id}
        item={item}
        isFromSelect={true}
        onSelectTeam={onSelectTeam}
        checkingTeam={isAlreadyJoined}
        selectMulty={isSelected}
        JoinWithMULT={JoinWithMULT}
      />
    ) : (
      <MyTeam
        key={item._id}
        item={item}
        isFromSelect={true}
        onSelectTeam={onSelectTeam}
        isTeamSelected={selectedTeam?._id === item?._id}
      />
    );
  }, [selectMulty, teamDetails, selectedTeam, onSelectTeam, JoinWithMULT]);

  const onJoinContest = useCallback(() => {
    if (JoinWithMULT) {
      if (selectMulty.length === 0) {
        toastAlert.showToastError('Please Select Team Before Join Contest');
        return;
      }
      setIsAdd(true);
    } else {
      if (!selectedTeam) {
        toastAlert.showToastError('Please Select Team Before Join Contest');
        return;
      }
      setSaveTeamName(selectedTeam?.name);
      setIsAdd(true);
    }
  }, [JoinWithMULT, selectMulty.length, selectedTeam]);

  const handleModalClose = useCallback(() => {
    setIsAdd(false);
    onClose?.();
  }, [onClose]);

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText type={SIXTEEN} weight={POPPINS_BOLD_ITALIC}>
            SELECT TEAM
          </AppText>
          <TouchableOpacityView onPress={onClose} style={styles.closeContainer}>
            <FastImage
              source={CLOSE_WHITE_ICON}
              style={styles.closeWhiteIcon}
              resizeMode="contain"
              tintColor={colors.white}
            />
          </TouchableOpacityView>
        </View>

        <AppText 
          type={FORTEEN} 
          weight={POPPINS_SEMI_BOLD} 
          color={WHITE}
          style={{ marginTop: 15, marginBottom: 8 }}
        >
          {`Total Teams - ${myTeam?.length || 0}`}
        </AppText>
        
        <View style={styles.teamCountContainer}>
          <View style={styles.teamCountRow}>
            <View style={styles.teamCountBox}>
              <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
                Total Teams Created
              </AppText>
              <AppText type={SIXTEEN} weight={POPPINS_BOLD} color={WHITE} style={{ marginTop: 5 }}>
                {myTeam?.length || 0}
              </AppText>
            </View>
            
            {JoinWithMULT && (
              <>
                <View style={styles.teamCountDivider} />
                <View style={styles.teamCountBox}>
                  <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
                    Teams You Can Join
                  </AppText>
                  <AppText type={SIXTEEN} weight={POPPINS_BOLD} color={WHITE} style={{ marginTop: 5 }}>
                    {joinWith || 0}
                  </AppText>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          data={result}
          renderItem={renderMyTeam}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          extraData={[selectMulty, selectedTeam]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          buttonStyle={styles.buttonStyle}
          onPress={onJoinContest}
          title="JOIN CONTEST"
        />
      </View>

      <Confirmation
        isModalVisible={isAdd}
        details={contestDetails}
        setIsModalVisible={setIsAdd}
        matchDetails={matchDetails}
        onClose={handleModalClose}
        selectedTeam={selectedTeam}
        teamLength={true}
        saveTeamName={saveTeamName}
        selectMulty={selectMulty}
        JoinWithMULT={JoinWithMULT}
      />
    </AppSafeAreaView>
  );
};

export default SelectTeam;
