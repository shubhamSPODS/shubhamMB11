
import React, { useMemo, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { TouchableOpacityView } from '../../../common/TouchableOpacityView';
import styles from './styles';
import { AppText, BLACK, BLACKOPACITY, FORTEEN, LIGHTBLUE, WHITE } from '../../../common/AppText';
import { colors } from '../../../theme/color';

const CommonTabs = ({ activeTab, setActiveTab, totalCount, completeMatch, details, removeTabs }) => {
  const data = [
    {
      id: 1,
      title: 'Contest',
      showTitle: 'Select Contest',
    },
    {
      id: 2,
      title: `My Contest (${totalCount[0]})`,
      showTitle: 'My Contest',
    },
    {
      id: 3,
      title: `My Team (${totalCount[1]})`,
      showTitle: 'My Team',
    },
  ];
  const dataTwo = [
    {
      id: 2,
      title: `My Contest (${totalCount[0]})`,
      showTitle: 'My Contest',
    },
    {
      id: 3,
      title: `My Team (${totalCount[1]})`,
      showTitle: 'My Team',
    },
    {
      id: 4,
      title: `Player Stats`,
      showTitle: 'Player Stats',
    },
  ];
  return (
    <View style={styles.container}>
      {completeMatch || removeTabs ? (
        <View style={styles.tabContainer}>
          {dataTwo?.map(item => {
            return item.id == activeTab ? (
              <View
                style={{
                  flexDirection: 'column',
                  width: '33%',
                  height: 38,
                  justifyContent: 'space-evenly',
                  padding: 5,
                  alignItems: 'center',
                  backgroundColor: "#F0E6A5",
                  borderTopRightRadius: item.id == 2 || item.id == 3 ? 20 : 0,
                  borderBottomRightRadius: item.id == 2 || item.id == 3 ? 20 : 0,
                  borderColor: colors.black,
                  borderTopLeftRadius: item.id == 4 || item.id == 3 ? 20 : 0,
                  borderBottomLeftRadius: item.id == 4 || item.id == 3 ? 20 : 0,
                }}>
                <AppText type={FORTEEN} color={BLACK}>
                  {item?.title}
                </AppText>
              </View>
            ) : (
              <TouchableOpacityView
                style={[
                  styles.tabs,
                  {
                    width: '33%',
                  },
                ]}
                onPress={() => setActiveTab(item?.id)}>
                <AppText color={BLACKOPACITY} type={FORTEEN}>{item?.title}</AppText>
              </TouchableOpacityView>
            );
          })}
        </View>
      ) : (
        <View style={styles.tabContainer}>
          {data?.map(item => {
            return item.id == activeTab ? (
              <View
                style={{
                  flexDirection: 'column',
                  width: '33%',
                  height: 38,
                  justifyContent: 'space-evenly',
                  padding: 5,
                  alignItems: 'center',
                  backgroundColor: "#F0E6A5",
                  borderTopRightRadius: item.id == 1 || item.id == 2 ? 20 : 0,
                  borderBottomRightRadius: item.id == 1 || item.id == 2 ? 20 : 0,
                  borderRightWidth: item.id == 1 ? 2 : 0,
                  borderBottomRightWidth: item.id == 1 ? 2 : 0,
                  borderColor: colors.black,
                  borderTopLeftRadius: item.id == 3 || item.id == 2 ? 20 : 0,
                  borderBottomLeftRadius: item.id == 3 || item.id == 2 ? 20 : 0,
                  borderLefttWidth: item.id == 3 ? 2 : 0,
                  borderBottomLeftWidth: item.id == 3 ? 2 : 0,
                }}>
                <AppText type={FORTEEN} color={BLACK}>
                  {item?.title}
                </AppText>
              </View>
            ) : (
              <TouchableOpacityView
                style={[
                  styles.tabs,
                  {
                    width: '33%',
                  },
                ]}
                onPress={() => setActiveTab(item?.id)}>
                <AppText color={BLACKOPACITY} type={FORTEEN}>{item?.title}</AppText>
              </TouchableOpacityView>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CommonTabs;
