import moment from 'moment';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { colors } from '../theme/color';
import { AppText, BLACK, GREEN, GRY, POPPINS_SEMI_BOLD, RED, WHITE } from './AppText';
import { MatchLiveModal } from './MatchLiveModal';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { background } from '../helper/image';

interface TimeState {
  time: string;
  hour: number;
  minute: number;
}

interface LiveTimeProps {
  details: {
    StartDateTime: string;
    Status: string;
  };
  color?: string;
  top?: boolean;
  view?: boolean;
  completeMatch?: boolean;
  type?: any;
  styletext?: any;
  setRemoveTabs: (value: boolean) => void;
  helloo?: boolean;
}

const LiveTime: React.FC<LiveTimeProps> = ({
  details,
  color,
  top,
  view,
  completeMatch,
  type,
  styletext,
  setRemoveTabs,
  helloo
}) => {
  const [trueLive, setTrueLive] = useState(false);
  const [time, setTime] = useState<TimeState>({
    time: '',
    hour: 0,
    minute: 0,
  });

  // Memoize date objects to prevent unnecessary recalculations
  const currentDate = useMemo(() => new Date(), []);
  const inputDate = useMemo(() => new Date(details?.StartDateTime || Date.now()), [details?.StartDateTime]);
  const isPastTime = useMemo(() => inputDate < currentDate, [inputDate, currentDate]);
  const timeDifference = useMemo(
    () => Math.floor((inputDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)),
    [inputDate, currentDate]
  );

  // Memoize the date formatting for matches more than 24 hours away
  const formattedFutureDate = useMemo(() => {
    if (timeDifference > 1) {
      const day = inputDate.getDate();
      const month = inputDate.toLocaleString('default', { month: 'short' });
      return `${day} ${month}`;
    }
    return timeDifference === 1 ? 'Tomorrow' : '';
  }, [timeDifference, inputDate]);

  const getDate = useCallback((timeDetails: { StartDateTime: string }) => {
    if (isPastTime) {
      setRemoveTabs(true);
      setTrueLive(true);
      return {
        hour: 0,
        minute: 0,
        time: 'Live'
      };
    }

    const a = moment();
    const b = moment(timeDetails?.StartDateTime);
    const duration = moment.duration(b.diff(a));
    const diffInHours = Math.floor(duration.asHours());
    const diffInMin = duration.minutes();
    const diffInSec = duration.seconds();

    if (diffInHours > 24) {
      return {
        hour: diffInHours,
        time: formattedFutureDate,
        minute: diffInMin,
      };
    }

    return {
      hour: diffInHours,
      minute: diffInMin,
      time: `${diffInHours > 0 ? `${diffInHours} H:` : ''} ${diffInMin} M  ${diffInHours > 0 ? '' : `${diffInSec} S`}`,
    };
  }, [isPastTime, formattedFutureDate, setRemoveTabs]);

  useEffect(() => {
    // Initial calculation
    setTime(getDate(details));

    // Set update interval based on how far the match is
    const interval = setInterval(() => {
      setTime(getDate(details));
    }, timeDifference > 1 ? 60000 : 1000); // Update every minute if match is more than 24h away, every second if closer

    return () => clearInterval(interval);
  }, [details, getDate, timeDifference]);

  const textColor = useMemo(() => {
    if (details?.Status === 'Completed') return BLACK;
    if (trueLive) return RED;
    if (color) return color;
    return timeDifference >= 1 ? GRY : RED;
  }, [details?.Status, trueLive, color, timeDifference]);

  const displayText = useMemo(() => {
    if (details?.Status === 'Completed') return 'Completed';
    if (isPastTime) return 'Live';
    return time?.time;
  }, [details?.Status, isPastTime, time?.time]);

  return (
    <>
      {view ? (
        <>
          <AppText
            weight={POPPINS_SEMI_BOLD}
            color={textColor}
            type={type}
            style={[
              {
                marginTop: top ? 2 : 10,
              },
            ]}
          >
            {displayText}
          </AppText>
        </>
      ) : (
        <>
          {time?.hour >= 0 && (
            <AppText
              weight={POPPINS_SEMI_BOLD}
              type={type ? type : null}
              color={textColor}
              style={[
                {
                  marginTop: top ? 0 : 10,
                },
                styletext,
              ]}>
              {displayText}
            </AppText>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({});
export { LiveTime };
