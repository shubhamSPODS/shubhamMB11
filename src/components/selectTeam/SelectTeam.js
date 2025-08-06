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

const SelectTeam = ({ onClose, contestDetails, matchDetails, teamDetails, totallMultipleTeams, JoinWithMULT }) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [selectMulty, setSelectMulty] = useState([]);

  const { filteredData, newData, result } = useMemo(() => {
    console.log('🎯 [SELECT TEAM] Validation data:', {
      myTeamCount: myTeam?.length || 0,
      teamDetailsCount: teamDetails?.length || 0,
      contestDetails: contestDetails?._id,
      contestCategoryId: contestDetails?.contest_category_id,
      JoinWithMULT: JoinWithMULT,
      totallMultipleTeams: totallMultipleTeams,
      teamDetails: teamDetails
    });

    // For multiple entry contests, we need to check if teams are already used in this specific contest
    const filtered = myTeam
      .filter(dataItem => {
        const teamIdToCheck = dataItem._id;
        
        // Check if team is already used in this contest (for both single and multiple entry)
        const isAlreadyUsedInContest = teamDetails?.some(item => item.team_id === teamIdToCheck);
        
        // For multiple entry contests, also check if the team has reached the maximum allowed entries
        let isTeamMaxedOut = false;
        if (JoinWithMULT && contestDetails) {
          const contestCategoryId = contestDetails?.contest_category_id;
          const teamsUsedInThisContest = teamDetails?.filter(item => 
            item.contest_category_id === contestCategoryId
          ) || [];
          
          // Check if this team has already been used the maximum number of times for this contest
          const teamUsageCount = teamsUsedInThisContest.filter(item => 
            item.team_id === teamIdToCheck
          ).length;
          
          const maxTeamsAllowed = contestDetails?.teams || totallMultipleTeams || 1;
          isTeamMaxedOut = teamUsageCount >= maxTeamsAllowed;
          
          console.log('🎯 [SELECT TEAM] Team validation:', {
            teamId: teamIdToCheck,
            teamName: dataItem?.name,
            isAlreadyUsedInContest,
            contestCategoryId,
            teamsUsedInThisContest: teamsUsedInThisContest.length,
            teamUsageCount,
            maxTeamsAllowed,
            isTeamMaxedOut
          });
        }
        
        const shouldFilterOut = isAlreadyUsedInContest || isTeamMaxedOut;
        
        if (shouldFilterOut) {
          console.log('🎯 [SELECT TEAM] Filtering out team:', {
            teamId: teamIdToCheck,
            teamName: dataItem?.name,
            reason: isAlreadyUsedInContest ? 'Already used in contest' : 'Team maxed out'
          });
        }
        
        return !shouldFilterOut;
      })
      .map((filteredItem, index) => ({ ...filteredItem, already: index === 0 }));

    console.log('🎯 [SELECT TEAM] Filtered teams:', {
      originalCount: myTeam?.length || 0,
      filteredCount: filtered?.length || 0,
      availableTeams: filtered?.map(team => ({ id: team._id, name: team.name }))
    });

    const newFiltered = myTeam?.filter(dataItem => {
      const teamIdToCheck = dataItem._id;
      return !filtered?.some(item => item._id === teamIdToCheck);
    });

    return {
      filteredData: filtered,
      newData: newFiltered,
      result: newFiltered?.concat(filtered)
    };
  }, [myTeam, teamDetails, JoinWithMULT, contestDetails, totallMultipleTeams]);

  const onSelectTeam = useCallback((item) => {
    console.log('🎯 [SELECT TEAM] Team selection attempt:', {
      teamId: item?._id,
      teamName: item?.name,
      contestId: contestDetails?._id,
      contestCategoryId: contestDetails?.contest_category_id
    });

    const checkingTeam = teamDetails?.find(items => items?.team_id === item?._id);
    const lengthTeam = (teamDetails?.length || 0) + selectMulty.length;

    if (checkingTeam) {
      console.log('🎯 [SELECT TEAM] Blocked - Team already used:', {
        teamId: item?._id,
        teamName: item?.name,
        existingTeamDetails: checkingTeam
      });
      toastAlert.showToastError('You have already joined with this team');
    } else if (JoinWithMULT) {
      // For multiple entry contests, check if this team has already been used the maximum number of times
      if (contestDetails) {
        const contestCategoryId = contestDetails?.contest_category_id;
        const teamsUsedInThisContest = teamDetails?.filter(item => 
          item.contest_category_id === contestCategoryId
        ) || [];
        
        const teamUsageCount = teamsUsedInThisContest.filter(item => 
          item.team_id === item?._id
        ).length;
        
        const maxTeamsAllowed = contestDetails?.teams || totallMultipleTeams || 1;
        
        if (teamUsageCount >= maxTeamsAllowed) {
          console.log('🎯 [SELECT TEAM] Blocked - Team maxed out:', {
            teamId: item?._id,
            teamName: item?.name,
            teamUsageCount,
            maxTeamsAllowed
          });
          toastAlert.showToastError(`You have already used this team the maximum number of times (${maxTeamsAllowed})`);
          return;
        }
      }
      
      setSelectMulty(prev => {
        const existingIndex = prev.findIndex(e => e?._id === item?._id);
        if (existingIndex > -1) {
          const newArray = [...prev];
          newArray.splice(existingIndex, 1);
          return newArray;
        } else {
          if (totallMultipleTeams === lengthTeam || totallMultipleTeams === prev.length) {
            toastAlert.showToastError(`You can join only ${totallMultipleTeams} teams`);
            return prev;
          }
          return [...prev, item];
        }
      });
    } else {
      setSelectedTeam(item);
    }
  }, [teamDetails, selectMulty.length, JoinWithMULT, totallMultipleTeams, contestDetails]);

  const renderMyTeam = useCallback(({ item }) => {
    const isSelected = selectMulty?.some(value => value._id === item._id);
    const isAlreadyJoined = teamDetails?.some(items => items?.team_id === item?._id);
    
    // For multiple entry contests, also check if team has reached maximum usage
    let isTeamMaxedOut = false;
    if (JoinWithMULT && contestDetails) {
      const contestCategoryId = contestDetails?.contest_category_id;
      const teamsUsedInThisContest = teamDetails?.filter(item => 
        item.contest_category_id === contestCategoryId
      ) || [];
      
      const teamUsageCount = teamsUsedInThisContest.filter(teamItem => 
        teamItem.team_id === item?._id
      ).length;
      
      const maxTeamsAllowed = contestDetails?.teams || totallMultipleTeams || 1;
      isTeamMaxedOut = teamUsageCount >= maxTeamsAllowed;
    }

    // Log team status for debugging
    if (isAlreadyJoined || isTeamMaxedOut) {
      console.log('🎯 [SELECT TEAM] Team status:', {
        teamId: item?._id,
        teamName: item?.name,
        isAlreadyJoined,
        isTeamMaxedOut,
        teamUsageCount: JoinWithMULT ? teamUsageCount : 'N/A',
        maxTeamsAllowed: JoinWithMULT ? maxTeamsAllowed : 'N/A'
      });
    }

    return JoinWithMULT ? (
      <MyTeamSelect
        key={item._id}
        item={item}
        isFromSelect={true}
        onSelectTeam={onSelectTeam}
        checkingTeam={isAlreadyJoined || isTeamMaxedOut}
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
  }, [selectMulty, teamDetails, selectedTeam, onSelectTeam, JoinWithMULT, contestDetails, totallMultipleTeams]);

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
            
            {/* {JoinWithMULT && (
              <>
                <View style={styles.teamCountDivider} />
                <View style={styles.teamCountBox}>
                  <AppText type={THIRTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
                    Teams You Can Join
                  </AppText>
                  <AppText type={SIXTEEN} weight={POPPINS_BOLD} color={WHITE} style={{ marginTop: 5 }}>
                    {totallMultipleTeams}
                  </AppText>
                </View>
              </>
            )} */}
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
