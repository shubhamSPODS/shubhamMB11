import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { appOperation } from '../../appOperation';
import { AppText, BLACK, BLACKOPACITY, BROWNYELLOW, ELEVEN, FORTEEN, LATO_SEMI_BOLD, LIGHTBLUE, POPPINS_BOLD, POPPINS_LIGHT, POPPINS_MEDIUM, POPPINS_SEMI_BOLD, SIXTEEN, TEN, TWELVE, WHITE } from '../../common/AppText';
import { toastAlert } from '../../helper/utility';
import styles from './styles';
import { SpinnerSecond } from '../../common/SpinnerSecond';
import FastImage from "@d11/react-native-fast-image";
import { Layer_1 } from '../../helper/image';
import { Screen } from '../../theme/dimens';
import { useIsFocused } from '@react-navigation/native';

const Winnings = ({ id, privateis, notLive, rankData, contestDetails = {} }) => {
  const [prizeList, setPrizeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onRefresh, setOnrefresh] = useState(false);
  
  useEffect(() => {
    
    if (rankData && rankData.length > 0) {
      setLoading(false);
    }
  }, [id, rankData, contestDetails]);

  const getPrizeList = async () => {
    try {
      console.log('Fetching prize list...');
      setOnrefresh(true);
      const res = privateis ? await appOperation.customer.getPrizeListPrivate(id, privateis) : await appOperation.customer.getPrizeList(id);
      console.log('Prize list API response:', res);
      
      if (res && res.code == 200 && Array.isArray(res?.data) && res?.data.length > 0) {
        console.log(`Successfully fetched ${res?.data.length} prize list entries`);
        setPrizeList(res?.data);
      } else if (rankData && rankData.length > 0) {
        console.log('No prize list data found, using existing rank data');
        setPrizeList([]);
      }
    } catch (e) {
      console.error('Error fetching prize list:', e);
    } finally {
      setLoading(false);
      setOnrefresh(false);
    }
  };
  
  const isFocus = useIsFocused()
  
  useEffect(() => {
    if (!rankData || rankData.length === 0) {
      getPrizeList();
    }
  }, [isFocus, rankData]);

  const renderWinnings = ({ item }) => {
    if (!item) {
      console.log('Skipping null or undefined rank item');
      return null;
    }

    const startRank = Number(item?.StartRank || 0);
    const endRank = Number(item?.EndRank || 0);
    const price = Number(item?.Price || 0);

    console.log('Rendering rank item:', { startRank, endRank, price });

    if (price > 0) {
      return (
        <View style={styles.winningContainer}>
          <AppText color={WHITE}>
            #{startRank === endRank ? startRank : `${startRank}-${endRank}`}
          </AppText>
          <AppText color={WHITE}>₹{price.toFixed(2)}</AppText>
        </View>
      );
    }
    
    return (
      <View style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20%"
      }}>
        <AppText weight={POPPINS_BOLD}
          type={FORTEEN}
          color={LIGHTBLUE}>
          Rank {startRank}
        </AppText>
        <AppText
          color={BLACKOPACITY}
          weight={POPPINS_BOLD}
          type={TWELVE}>
          Winner takes all the glory!
        </AppText>
        <FastImage
          source={Layer_1}
          resizeMode='contain'
          style={{
            height: 160,
            width: 200,
            alignSelf: "center"
          }}
        />
      </View>
    );
  };
  
  const dataToDisplay = useMemo(() => {
    if (prizeList?.length > 0) {
      return prizeList;
    } else if (rankData?.length > 0) {
      return rankData;
    } else {
      return [];
    }
  }, [prizeList, rankData]);
  
  console.log("Final data to display in Winnings:", dataToDisplay);
  
  return (
    <>
      <View style={styles.head}>
        <AppText type={TEN}>RANK</AppText>
        <AppText type={TEN}>WINNINGS</AppText>
      </View>
      <View style={{flex:1}}>
        {loading ? (
          <SpinnerSecond loading={true} />
        ) : dataToDisplay && dataToDisplay.length > 0 ? (
          // When we have data to display
          <FlatList
            showsVerticalScrollIndicator={false}
            data={dataToDisplay}
            renderItem={renderWinnings}
            keyExtractor={(item, index) => item?._id || `rank-${index}`}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListFooterComponent={() => (
              <>
                <AppText type={ELEVEN} color={BROWNYELLOW} weight={POPPINS_SEMI_BOLD} style={{ marginBottom: 8, marginHorizontal: 5 }}>
                  Disclaimer :
                </AppText>
          
                <AppText type={ELEVEN} color={WHITE} weight={POPPINS_LIGHT} style={{ bottom: 10, lineHeight: 18, marginHorizontal: 5 }}>
                  In case of a tie or contest does not fill up, the actual prizes may be different.
                  In cases of any dispute regarding the total prize pool amount, our decision shall be final and binding.{`\n\n`}
                  <AppText type={ELEVEN} color={BROWNYELLOW} weight={POPPINS_MEDIUM} style={{lineHeight: 18}}>
                    Note: 
                  </AppText>
                  <AppText type={ELEVEN} color={WHITE} weight={POPPINS_LIGHT} style={{ bottom: 10, lineHeight: 18 }}>
                    As per the government regulations, starting 1st April 2023, a tax of 30% will be levied at the time of withdrawal or at the end of financial year on the net winnings.
                  </AppText>
                </AppText>
              </>
            )}
            refreshControl={
              <RefreshControl refreshing={onRefresh} onRefresh={getPrizeList} />
            }
          />
        ) : (
          <View style={{padding: 16, alignItems: 'center', justifyContent: 'center'}}>
            <AppText color={WHITE} weight={POPPINS_BOLD} style={{marginBottom: 10, textAlign: 'center'}}>
              No prize distribution data available
            </AppText>
            
            <AppText type={ELEVEN} color={BROWNYELLOW} weight={POPPINS_SEMI_BOLD} style={{ marginTop: 40, marginBottom: 8 }}>
              Disclaimer :
            </AppText>
            
            <AppText type={ELEVEN} color={WHITE} weight={POPPINS_LIGHT} style={{ lineHeight: 18, textAlign: 'center' }}>
              In case of a tie or contest does not fill up, the actual prizes may be different.
              In cases of any dispute regarding the total prize pool amount, our decision shall be final and binding.
            </AppText>
          </View>
        )}
      </View>
    </>
  );
};

export default Winnings;
