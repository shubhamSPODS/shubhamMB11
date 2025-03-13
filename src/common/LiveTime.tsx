import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { colors } from '../theme/color';
import { AppText, BLACK, GREEN, GRY, POPPINS_SEMI_BOLD, RED, WHITE } from './AppText';
import { MatchLiveModal } from './MatchLiveModal';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { background } from '../helper/image';

const LiveTime = ({
  details,
  color,
  top,
  view,
  completeMatch,
  type,
  styletext,
  setRemoveTabs,
  helloo
}: any) => {

  const currentDate = new Date();
  const inputDate = new Date(details?.StartDateTime);
  const isPastTime = inputDate < currentDate;


  const timeDifference = Math.floor(
    (inputDate - currentDate) / (24 * 60 * 60 * 1000),
  );
  const [trueLive, setTrueLive] = useState(false)
  
  const getDate = (timeDetails) => {

    let a = moment();
    let b = moment(timeDetails?.StartDateTime);
    const duration = moment.duration(b.diff(a));
    const diffInHours = Math.floor(duration.asHours());
    const diffInMin = duration.minutes();
    const diffInSec = duration.seconds();
    const currentDate = new Date();
    const inputDate = new Date(timeDetails?.StartDateTime);

    const isPastTime = inputDate < currentDate;

    const day = inputDate.getDate();
    const month = inputDate.toLocaleString('default', { month: 'short' });

    if (isPastTime) {
      setRemoveTabs(true)
      return setTrueLive(true)
    }

    if (diffInHours > 24) {
      let temp = {
        hour: diffInHours,
        time: `${timeDifference === 1
          ? 'Tomorrow'
          : timeDifference > 1
            ? `${day} ${month}`
            : timeDifference === -1
              ? 'Yesterday'
              : `${day} ${month}`
          }`,
        minute: 40,
      };
      return temp;
    } else {
      let temp = {
        hour: diffInHours,
        minute: diffInMin,
        time: `${diffInHours > 0 ? `${diffInHours} H:` : ''} ${diffInMin} M  ${diffInHours > 0 ? '' : `${diffInSec} S`
          }`,
      };
      return temp;
    }
  };

  const [time, setTime] = useState({
    time: '',
    hour: 0,
    minute: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getDate(details));
    }, 1000);
    return () => clearInterval(interval);
  }, [details]);
  return (
    <>
      {view ? (
        <>
          <AppText
            weight={POPPINS_SEMI_BOLD}
            color={
              details?.Status == 'Completed' ? BLACK :
                trueLive == true
                  ? RED
                  : color
                    ? color
                    : RED
            }
            type={type}
            style={[
              {
                marginTop: top ? 2 : 10,
              },
            ]}
          >
            {details?.Status == 'Completed' ? 'Completed' : isPastTime == true ? 'Live' : time?.time}
            {/* {trueLive == true ? 'Live' : completeMatch ? 'Completed' : time?.time} */}
          </AppText>
        </>
      ) : (
        <>
          {time?.hour >= 0 && (
            <AppText
              weight={POPPINS_SEMI_BOLD}
              type={type ? type : null}
              color={
                details?.Status == 'Completed' ? BLACK :
                  trueLive == true
                    ? RED
                    : color
                      ? color
                      : timeDifference >= 1 ? GRY : RED
              }
              style={[
                {
                  marginTop: top ? 0 : 10,
                },
                styletext,
              ]}>
              {details?.Status == 'Completed' ? 'Completed' : isPastTime == true ? 'Live' : time?.time}
            </AppText>
          )}
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({});
export { LiveTime };
