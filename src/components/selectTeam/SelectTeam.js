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
import { getMyJoinedContest, joinContest, checkDuplicateTeams } from '../../slices/matchSlice';
import Confirmation from '../../common/Confirmation';
import { colors } from '../../theme/color';
import MyTeamSelect from '../matchCard/myTeam/MyTeamSelect';
import { TouchableOpacityView } from '../../common/TouchableOpacityView';
import { universalPaddingHorizontal } from '../../theme/dimens';
import PrimaryButton from '../../common/primaryButton';
import NavigationService from '../../navigation/NavigationService';

const SelectTeam = ({ onClose, contestDetails, matchDetails, teamDetails, totallMultipleTeams, JoinWithMULT }) => {
  const dispatch = useDispatch();
  const myTeam = useSelector(state => state?.match?.myTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [saveTeamName, setSaveTeamName] = useState('');
  const [selectMulty, setSelectMulty] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  // Fetch registered teams when component mounts
  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      if (!matchDetails?._id || !contestDetails?.shadow_contest_id) {
        console.log('🎯 [SELECT TEAM] Missing data for fetching registered teams');
        return;
      }

      setIsLoadingTeams(true);
      try {
        console.log('🎯 [SELECT TEAM] Fetching registered teams...');
        const result = await dispatch(checkDuplicateTeams(matchDetails._id, contestDetails.shadow_contest_id));
        
        if (result?.success) {
          const teams = result.data || [];
          console.log('🎯 [SELECT TEAM] Registered teams found:', teams);
          console.log('🎯 [SELECT TEAM] Registered teams structure:', teams.map(team => ({
            id: team._id,
            team_id: team.team_id,
            team_id_type: typeof team.team_id,
            is_array: Array.isArray(team.team_id),
            team_id_id: team.team_id?._id,
            team_name: team.teamName
          })));
          setRegisteredTeams(teams);
        } else {
          console.log('🎯 [SELECT TEAM] No registered teams found or error:', result);
          setRegisteredTeams([]);
        }
      } catch (error) {
        console.error('🎯 [SELECT TEAM] Error fetching registered teams:', error);
        setRegisteredTeams([]);
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchRegisteredTeams();
  }, [matchDetails, contestDetails, dispatch]);

  const { filteredData, newData, result } = useMemo(() => {
    console.log('🎯 [SELECT TEAM] Validation data:', {
      myTeamCount: myTeam?.length || 0,
      teamDetailsCount: teamDetails?.length || 0,
      contestDetails: contestDetails?._id,
      contestCategoryId: contestDetails?.contest_category_id,
      JoinWithMULT: JoinWithMULT,
      totallMultipleTeams: totallMultipleTeams,
      teamDetails: teamDetails,
      isLoadingTeams,
      registeredTeamsCount: registeredTeams?.length || 0
    });

    // Don't render teams until we've checked for registered teams
    if (isLoadingTeams || !matchDetails?._id || !contestDetails?.shadow_contest_id) {
      console.log('🎯 [SELECT TEAM] Still loading registered teams or missing data, showing empty list', {
        isLoadingTeams,
        hasMatchId: !!matchDetails?._id,
        hasShadowContestId: !!contestDetails?.shadow_contest_id
      });
      return {
        filteredData: [],
        newData: [],
        result: []
      };
    }

    // For multiple entry contests, we need to check if teams are already used in this specific contest
    const filtered = myTeam
      .filter(dataItem => {
        const teamIdToCheck = dataItem._id;
        
        // Check if team is already registered for this contest via API
        const isAlreadyRegistered = registeredTeams?.some(registeredTeam => {
          // team_id can be an object with _id property or an array of objects
          let teamIds = [];
          
          if (registeredTeam.team_id) {
            if (Array.isArray(registeredTeam.team_id)) {
              // If it's an array, extract _id from each object
              teamIds = registeredTeam.team_id.map(team => team._id || team);
            } else if (typeof registeredTeam.team_id === 'object') {
              // If it's a single object, extract _id
              teamIds = [registeredTeam.team_id._id || registeredTeam.team_id];
            } else {
              // If it's a string, use as is
              teamIds = [registeredTeam.team_id];
            }
          }
          
          const isRegistered = teamIds?.some(id => id === teamIdToCheck);
          
          console.log('🎯 [SELECT TEAM] Checking team registration:', {
            teamIdToCheck,
            teamName: dataItem?.name,
            teamIds,
            isRegistered
          });
          
          if (isRegistered) {
            console.log('🎯 [SELECT TEAM] Team already registered:', {
              teamId: teamIdToCheck,
              teamName: dataItem?.name,
              registeredTeam: registeredTeam,
              teamIds: teamIds
            });
          }
          
          return isRegistered;
        });
        
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
            isAlreadyRegistered,
            isAlreadyUsedInContest,
            contestCategoryId,
            teamsUsedInThisContest: teamsUsedInThisContest.length,
            teamUsageCount,
            maxTeamsAllowed,
            isTeamMaxedOut,
            registeredTeamsCount: registeredTeams?.length || 0
          });
        }
        
        const shouldFilterOut = isAlreadyRegistered || isAlreadyUsedInContest || isTeamMaxedOut;
        
        if (shouldFilterOut) {
          console.log('🎯 [SELECT TEAM] Filtering out team:', {
            teamId: teamIdToCheck,
            teamName: dataItem?.name,
            reason: isAlreadyRegistered ? 'Already registered via API' : 
                    isAlreadyUsedInContest ? 'Already used in contest' : 'Team maxed out'
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
      result: filtered || []
    };
  }, [myTeam, teamDetails, JoinWithMULT, contestDetails, totallMultipleTeams, registeredTeams, isLoadingTeams]);

  // Add useEffect to handle redirect when all teams are filtered out
  useEffect(() => {
    if (!isLoadingTeams && result && result.length === 0 && myTeam && myTeam.length > 0) {
      console.log('🎯 [SELECT TEAM] All teams are already joined - redirecting to create team');
      toastAlert.showToastError('All your teams are already joined in this contest');
      
      // Small delay to show the toast before redirecting
      setTimeout(() => {
        onClose();
        NavigationService.navigate('CreateTeam', {
          matchDetails,
          contestDetails,
          isFromMyMatch: true,
        });
      }, 1500);
    }
  }, [isLoadingTeams, result, myTeam, onClose, matchDetails, contestDetails]);

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
    console.log('🎯 [SELECT TEAM] Rendering team:', {
      teamId: item._id,
      teamName: item.name,
      isSelected: selectMulty?.some(value => value._id === item._id),
      isAlreadyJoined: teamDetails?.some(items => items?.team_id === item?._id)
    });
    
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
    console.log('🎯 [SELECT TEAM] 🎯 BUTTON PRESSED! 🎯');
    console.log('🎯 [SELECT TEAM] onJoinContest called with:', {
      JoinWithMULT,
      selectMultyLength: selectMulty.length,
      selectedTeam: selectedTeam?.name,
      contestDetails: contestDetails?._id,
      matchDetails: matchDetails?._id
    });

    if (JoinWithMULT) {
      if (selectMulty.length === 0) {
        toastAlert.showToastError('Please Select Team Before Join Contest');
        return;
      }
      
      console.log('🎯 [SELECT TEAM] Proceeding to confirmation for multiple teams');
      setIsAdd(true);
    } else {
      if (!selectedTeam) {
        toastAlert.showToastError('Please Select Team Before Join Contest');
        return;
      }
      
      console.log('🎯 [SELECT TEAM] Proceeding to confirmation for single team');
      setSaveTeamName(selectedTeam?.name);
      setIsAdd(true);
    }
  }, [JoinWithMULT, selectMulty.length, selectedTeam, contestDetails, matchDetails]);

  const handleModalClose = useCallback(() => {
    setIsAdd(false);
    onClose?.();
  }, [onClose]);

  const EmptyComponent = () => {
    // Check if we have teams but they're all filtered out
    const hasTeamsButFiltered = myTeam && myTeam.length > 0 && result && result.length === 0;
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE} style={{ textAlign: 'center', marginBottom: 10 }}>
          {hasTeamsButFiltered 
            ? 'All teams are already joined in this contest'
            : 'No teams found for this match'
          }
        </AppText>
        <AppText type={TWELVE} weight={POPPINS_MEDIUM} color={WHITE} style={{ textAlign: 'center', marginBottom: 20 }}>
          {hasTeamsButFiltered 
            ? 'You have already joined this contest with all your teams'
            : 'Redirecting to create team...'
          }
        </AppText>
        
        {hasTeamsButFiltered && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.blue,
              paddingVertical: 12,
              paddingHorizontal: 25,
              borderRadius: 10,
            }}
            onPress={() => {
              onClose();
              NavigationService.navigate('CreateTeam', {
                matchDetails,
                contestDetails,
                isFromMyMatch: true,
              });
            }}
          >
            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
              Create New Team
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  };


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
        {console.log('🎯 [SELECT TEAM] Rendering top container - no team count text')}
      </View>

      <View style={styles.bottomContainer}>
        {isLoadingTeams ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppText type={FORTEEN} weight={POPPINS_SEMI_BOLD} color={WHITE}>
              Loading teams...
            </AppText>
          </View>
        ) : (
          <>
            {console.log('🎯 [SELECT TEAM] Rendering FlatList with result:', {
              resultLength: result?.length || 0,
              resultTeams: result?.map(team => ({ id: team._id, name: team.name }))
            })}
            <FlatList
              data={result}
              renderItem={renderMyTeam}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              extraData={[selectMulty, selectedTeam, registeredTeams]}
              ListEmptyComponent={EmptyComponent}
              contentContainerStyle={result?.length === 0 ? { flex: 1 } : undefined}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            console.log('🎯 [SELECT TEAM] Button pressed, calling onJoinContest...');
            onJoinContest();
          }}
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
