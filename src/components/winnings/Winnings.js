import React, { useEffect, useState } from 'react';
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
const Winnings = ({ id, privateis, notLive, rankData }) => {
  const data = [{}, {}, {}];
  const [prizeList, setPrizeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onRefresh, setOnrefresh] = useState(false);

  const getPrizeList = async () => {
    try {
      setOnrefresh(true);
      const res = privateis ? await appOperation.customer.getPrizeListPrivate(id, privateis) : await appOperation.customer.getPrizeList(id);
      if (res.code == 200) {
        setPrizeList(res?.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
      setOnrefresh(false);
    }
  };
  const isFocus = useIsFocused()
  // useEffect(() => {
  //   getPrizeList();
  // }, [isFocus]);
  const renderWinnings = ({ item }) => {
    return (
      <>
        {item?.EndRank !== null ?
          <View style={styles.winningContainer}>
            <AppText color={WHITE}>
              #{item.StartRank == item?.EndRank ? item.StartRank : `${item?.StartRank}-${item?.EndRank}`}
            </AppText>
            <AppText color={WHITE}>{parseInt(item?.Price)?.toFixed(2)}</AppText>
          </View >
          : <View style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20%"
          }} >
            <AppText weight={POPPINS_BOLD}
              type={FORTEEN}
              color={LIGHTBLUE}>
              Rank 1
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

        }
        
         
      </>
    );
  };
  return (
    <>
      <View style={styles.head}>
        <AppText type={TEN}>RANK</AppText>
        <AppText type={TEN}>WINNINGS</AppText>
      </View>
      <View style={{flex:1}}>
        {/* {loading ? (
          <SpinnerSecond loading />
        ) : ( */}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={prizeList?.length > 1 ? prizeList : rankData}
            renderItem={renderWinnings}
            ListFooterComponent={()=>(
              <>
          <AppText type={ELEVEN} color={BROWNYELLOW} weight={POPPINS_SEMI_BOLD} style={{ marginBottom: 8, marginHorizontal: 5 }}>Disclaimer :</AppText>
        
        <AppText type={ELEVEN} color={WHITE} weight={POPPINS_LIGHT} style={{ bottom: 10,lineHeight:18,  marginHorizontal: 5  }}>In case of a tie or contest does not fill up, the actual prizes may be different.
          In cases of any dispute regarding the total prize pool amount, our decision shall be final and binding.{`\n\n`}
          <AppText type={ELEVEN} color={BROWNYELLOW} weight={POPPINS_MEDIUM} style={{lineHeight:18}}>Note: </AppText>
          <AppText type={ELEVEN} color={WHITE} weight={POPPINS_LIGHT} style={{ bottom: 10,lineHeight:18 }}> As per the government regulations, starting 1st April 2023, a tax of 30% will be levied at the time of withdrawal or at the end of financial year on the net winnings.</AppText></AppText>
    
              </>
            )}
            contentContainerStyle={{  flex: privateis && !notLive ? 1 : 0, height:Screen.Height  }}
            // refreshControl={
            //   <RefreshControl refreshing={onRefresh} onRefresh={getPrizeList} />
            // }
          />


        {/* )} */}
      </View>
    </>
  );
};

export default Winnings;
