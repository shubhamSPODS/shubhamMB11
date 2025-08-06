import { Platform, Share, ToastAndroid, View } from 'react-native';
// import {Toast} from 'native-base';
import { poppinsBold, poppinsMedium } from '../theme/typography';
import { appOperation } from '../appOperation';
import { useDispatch, useSelector } from 'react-redux';
import { all_rounderIcon, batsmanIcon, bowlerIcon, wicket_keeperIcon } from './image';
import { ToastProvider } from 'native-base';
import Toast from 'react-native-toast-message';
import { colors } from '../theme/color';
import { AppText, POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from '../common/AppText';
export const BASE_URL = "https://app.mybattle11.com/"
export const shareToAny = (message) => {
  const shareOptions = {
    message: message,
  };

  Share.share(shareOptions);
};
export const formatAadharNumber = (aadharNumber) => {
  const cleanNumber = aadharNumber.replace(/\D/g, '');
  const formattedNumber = cleanNumber.replace(/(.{4})/g, '$1 ');
  return formattedNumber.trim();
};
export const checkValidAdharCardNumber = (adharNumber) => {
  let regex = new RegExp(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/);
  return regex.test(adharNumber);
};
export const emailRegex = (email) => {
  let regex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  return regex.test(email);
}
export const checkValidPanCardNumber = (panNumber) => {
  let regex = new RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/);
  return regex.test(panNumber);
};
export const checkValidDlNumber = (dlNumber) => {
  let regex = new RegExp(/^[a-zA-Z0-9]{1,20}$/);
  return regex.test(dlNumber);
};
export const checkVoterDlNumber = (voterNumber) => {
  let regex = new RegExp(/^[a-zA-Z]{3}[0-9]{7}$/);
  return regex.test(voterNumber);
};
export const checkUPIDlNumber = (upiNumber) => {
  let regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9._@-]{4,49}$/);
  return regex.test(upiNumber);
};
export const ifsclNumber = (ifscNumber) => {
  const ifscUpperCase = ifscNumber.toUpperCase();
  let regex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
  return regex.test(ifscUpperCase);
};
export const validateEmail = (email) => {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(email);
};

export const validateMobile = (number) => {
  const expression = /^[0-9]*$/;
  return expression.test(number);
};
export function numberWithCommas(x) {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export const fixedToTwo = value => {
  let temp = value?.toFixed(2);
  return temp;
};
export const IMAGE_BASE_URL = BASE_URL;

export const toastAlert = {
  showToastSuccess: (message, duration = 2500) => { },
  showToastError: (message, duration = 2500) => {
    Platform.OS == 'ios' ?
      Toast.show({
        type: 'success',
        text1: 'My Battle 11',
        text2: `${message}`,
        text2Style: { fontSize: 12, fontFamily: poppinsBold },
        text1Style: { fontFamily: poppinsBold },
      }) :
      ToastAndroid.show(message, ToastAndroid.BOTTOM, ToastAndroid.LONG);
  },
};
export const iosToast = (message) => {
  Toast.show({
    type: 'success',
    text1: 'My Battle 11',
    text2: `${message}`
  })
}
export const logError = error => {
};
export const modifyName = name => {
  const nameParts = name?.split(' ');
  if (nameParts?.length >= 3) {
    const modifiedName =
      nameParts[0].charAt(0).toUpperCase() +
      ' ' +
      nameParts[nameParts?.length - 1];
    return modifiedName?.length == 9 ? modifiedName : modifiedName?.length > 9 ? modifiedName?.slice(0, 7) + '..' : modifiedName;
  } else if (nameParts?.length >= 2) {
    const modifiedName =
      nameParts[0].charAt(0).toUpperCase() + ' ' + nameParts[1];
    return modifiedName?.length == 9 ? modifiedName : modifiedName?.length > 9 ? modifiedName?.slice(0, 7) + '..' : modifiedName;
  }
  return name?.length == 9 ? name : name?.length > 9 ? name?.slice(0, 7) + '..' : name;
};
export const modifyNameTwo = name => {
  const nameParts = name?.split(' ');
  if (nameParts?.length >= 3) {
    const modifiedName =
      nameParts[0].charAt(0).toUpperCase() +
      ' ' +
      nameParts[nameParts?.length - 1];
    return modifiedName;
  } else if (nameParts?.length >= 2) {
    const modifiedName =
      nameParts[0].charAt(0).toUpperCase() + ' ' + nameParts[1];
    return modifiedName;
  }
  return name?.length == 9 ? name : name?.length > 9 ? name?.slice(0, 7) + '..' : name;
};

export const formatDate = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const isToday = inputDate.toDateString() === currentDate.toDateString();
  const isYesterday = inputDate.toDateString() === new Date(currentDate - 86400000).toDateString(); // 86400000 milliseconds in a day

  if (isToday) {
    return 'Today ' + inputDate.toLocaleTimeString('en-US', timeOptions);
  } else if (isYesterday) {
    return 'Yesterday ' + inputDate.toLocaleTimeString('en-US', timeOptions);
  } else {
    return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + inputDate.toLocaleTimeString('en-US', timeOptions);
  }
}
export const nameSlice = (name) => {
  let nameTwo = name.split(' ')[0]
  if (nameTwo.length > 8) {
    const truncatedName = nameTwo.slice(0, 6) + "..";
    return truncatedName
  } else {
    return nameTwo
  }
}
export const nameSliceTwo = (name) => {
  let nameTwo = name.split(' ')[0]
  if (nameTwo.length > 5) {
    const truncatedName = nameTwo.slice(0, 5) + "..";
    return truncatedName
  } else {
    return nameTwo
  }
}
export const transformData = (originalData) => {
  return originalData
  
  // && originalData?.map((contest) => {
  //   const { name, winning_amount, more, data } = contest;
  //   const transformedContestData = data
  //     .map((contestData) => ({ ...contestData })) // Copy contestData to avoid modifying the original array
  //     .sort((a, b) => b.winning_amount - a.winning_amount); // Sort by winning_amount in descending order

  //   return {
  //     name,
  //     winning_amount,
  //     more,
  //     data: transformedContestData?.slice(0, 2),
  //   };
  // }).sort((a, b) => b.winning_amount - a.winning_amount);
};

export const playerRollImage = (SUBSID, array) => {
  if (SUBSID === 'SUB-1') {
    if (array[0]?.profile_image) {
      return { uri: array[0]?.profile_image }
    } else if (array[0]?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array[0]?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array[0]?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array[0]?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (SUBSID === 'SUB-2') {
    if (array[0]?.profile_image) {
      return { uri: array[0]?.profile_image }
    } else if (array[0]?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array[0]?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array[0]?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array[0]?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (SUBSID === 'SUB-3') {
    if (array[0]?.profile_image) {
      return { uri: array[0]?.profile_image }
    } else if (array[0]?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array[0]?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array[0]?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array[0]?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (SUBSID === 'SUB-4') {
    if (array[0]?.profile_image) {
      return { uri: array[0]?.profile_image }
    } else if (array[0]?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array[0]?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array[0]?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array[0]?.playing_role === 'all') {
      return all_rounderIcon
    }
  }
}
export const playerRollImageTwo = (array, arrayTwo) => {
  if (array?.numberid == '1' || arrayTwo?.numberid == '1') {
    if (array?.profile_image) {
      return { uri: array?.profile_image }
    } else if (array?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (array?.numberid == '2' || arrayTwo?.numberid == '2') {
    if (array?.profile_image) {
      return { uri: array?.profile_image }
    } else if (array?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (array?.numberid == '3' || arrayTwo?.numberid == '3') {
    if (array?.profile_image) {
      return { uri: array?.profile_image }
    } else if (array?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array?.playing_role === 'all') {
      return all_rounderIcon
    }
  } else if (array?.numberid == '4' || arrayTwo?.numberid == '4') {
    if (array?.profile_image) {
      return { uri: array?.profile_image }
    } else if (array?.playing_role === 'wk') {
      return wicket_keeperIcon
    } else if (array?.playing_role === 'bowl') {
      return bowlerIcon
    } else if (array?.playing_role === 'bat') {
      return batsmanIcon
    } else if (array?.playing_role === 'all') {
      return all_rounderIcon
    }
  }
}
export const playerRollImageThree = (array) => {
  if (array?.profile_image) {
    return { uri: array?.profile_image }
  } else if (array?.playing_role === 'wk') {
    return wicket_keeperIcon
  } else if (array?.playing_role === 'bowl') {
    return bowlerIcon
  } else if (array?.playing_role === 'bat') {
    return batsmanIcon
  } else if (array?.playing_role === 'all') {
    return all_rounderIcon
  } else if (array?.profile_image) {
    return { uri: array?.profile_image }
  } else if (array?.playing_role === 'wk') {
    return wicket_keeperIcon
  } else if (array?.playing_role === 'bowl') {
    return bowlerIcon
  } else if (array?.playing_role === 'bat') {
    return batsmanIcon
  } else if (array?.playing_role === 'all') {
    return all_rounderIcon
  } else if (array?.profile_image) {
    return { uri: array?.profile_image }
  } else if (array?.playing_role === 'wk') {
    return wicket_keeperIcon
  } else if (array?.playing_role === 'bowl') {
    return bowlerIcon
  } else if (array?.playing_role === 'bat') {
    return batsmanIcon
  } else if (array?.playing_role === 'all') {
    return all_rounderIcon
  } else if (array?.profile_image) {
    return { uri: array?.profile_image }
  } else if (array?.playing_role === 'wk') {
    return wicket_keeperIcon
  } else if (array?.playing_role === 'bowl') {
    return bowlerIcon
  } else if (array?.playing_role === 'bat') {
    return batsmanIcon
  } else if (array?.playing_role === 'all') {
    return all_rounderIcon
  }
}
export const formatDateTime = (inputDateTime) => {
  // Convert the input string to a Date object
  const dateTime = new Date(inputDateTime);

  // Format the date
  const formattedDate = dateTime.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  // Format the time
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // Combine the formatted date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  return formattedDateTime;
}
export const customSort = (a, b) => {
  if (a.playing11 === b.playing11) {
    return 0;
  }
  if (a.playing11 == 'true') {
    return -1;
  }
  return 1;
};

export const customSortRating = (a, b) => {
  if (a.fantasy_player_rating === b.fantasy_player_rating) {
    return 0;
  }
  if (a.fantasy_player_rating < b.fantasy_player_rating) {
    return 1; // Sort in descending order (highest rating first)
  }
  return -1;
};
export const filterAndSortPlayersByRole = (allPlayers, role, saveTitle, newAllPlayer) => {
  const filteredPlayers = allPlayers.filter(player => player.playing_role === role);
  let sortedPlayers;

  switch (saveTitle) {
    case 'PLAYERS':
      sortedPlayers = filteredPlayers.sort((a, b) => a.first_name.localeCompare(b.first_name));
      break;
    case 'CREDITS':
      sortedPlayers = filteredPlayers.sort((a, b) => a.fantasy_player_rating - b.fantasy_player_rating);
      break;
    case 'AVG POINTS':
      sortedPlayers = filteredPlayers.sort((a, b) => a.average_point - b.average_point);
      break;
    default:
      sortedPlayers = filteredPlayers.sort(customSortRating).sort(customSort);
  }

  if (newAllPlayer === 'high') {
    sortedPlayers.reverse();
  }

  return sortedPlayers;
};
export const getPlayerStatus = (item) => {
  if (item?.playing11 === undefined) {
    return item?.last_play ? (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            height: 5,
            width: 5,
            borderRadius: 100,
            backgroundColor: colors.brownYellow,
            marginTop: 5,
          }}
        />
        <AppText
          style={{
            color: colors.brownYellow,
            marginLeft: 5,
            fontWeight: 700,
            fontSize: 10
          }}
          weight={POPPINS_MEDIUM}>
          Played last match
        </AppText>
      </View>
    ) : null;
  } else {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            height: 6,
            width: 6,
            borderRadius: 100,
            backgroundColor: item?.playing11 === 'true' ? '#00B81C' : '#FF0000',
            marginTop: 5,
          }}
        />
        <AppText
          style={{
            color: item?.playing11 === 'true' ? '#00B81C' : '#FF0000',
            marginLeft: 5,
            fontWeight: 500,
          }}
          weight={POPPINS_SEMI_BOLD}>
          {item?.playing11 === 'true' ? 'Announced' : 'Unannounced'}
        </AppText>
      </View>
    );
  }
};
export const getPlayerIcon = (item) => {
  switch (item?.playing_role) {
    case 'wk':
      return wicket_keeperIcon;
    case 'bowl':
      return bowlerIcon;
    case 'bat':
      return batsmanIcon;
    case 'all':
      return all_rounderIcon;
    default:
      return null;
  }
};

export const logAadharVerificationStatus = (context, kycDetails) => {
  const adharStatus = kycDetails?.adhar_verified;
  const statusText = adharStatus === 0 ? 'NOT_VERIFIED' : 
                    adharStatus === 1 ? 'VERIFIED' : 
                    adharStatus === 2 ? 'PENDING' : 'UNKNOWN';
  
  console.log(`🔍 [${context}] Aadhar Verification Status:`, {
    adhar_verified: adharStatus,
    status: statusText,
    kycDetails: kycDetails
  });
  
  return {
    status: adharStatus,
    statusText,
    isVerified: adharStatus === 1,
    isPending: adharStatus === 2,
    isNotVerified: adharStatus === 0
  };
};