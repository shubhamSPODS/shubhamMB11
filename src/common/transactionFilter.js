import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {AppText} from './AppText';
import FastImage from 'react-native-fast-image';
import {FILTER_ICON, cross} from '../helper/image';
import {TouchableOpacityView} from './TouchableOpacityView';
import { colors } from '../theme/color';
import { NewColor } from '../theme/color';
import { universalPaddingHorizontal } from '../theme/dimens';

const TransactionFilter = ({data, setFilterTab, filterTab}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {data?.map((item, index) => {
          return (
            <TouchableOpacityView
              onPress={() => setFilterTab(item?.id)}
              style={
                filterTab == item?.id
                  ? styles.viewContainer2
                  : styles.viewContainer
              }>
              <AppText
                style={
                  filterTab == item?.id ? styles.textStyle2 : styles.textStyle
                }>
                {item?.title}
              </AppText>
              {filterTab == item?.id ? (
                <TouchableOpacityView
                  onPress={() => setFilterTab(0)}
                  style={styles.crossImageView}>
                  <FastImage
                    style={styles.crossImage}
                    tintColor={'#5389C4'}
                    resizeMode="contain"
                    source={cross}
                  />
                </TouchableOpacityView>
              ) : (
                <></>
              )}
            </TouchableOpacityView>
          );
        })}
      </View>
      <FastImage
        style={styles.filterImage}
        tintColor={colors.black}
        source={FILTER_ICON}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderGry,
    height: 28,
    paddingVertical: 5,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewContainer2: {
    paddingHorizontal: universalPaddingHorizontal,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderBackColor,
    height: 28,
    paddingVertical: 5,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: universalPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textStyle: {
  },
  textStyle2: {
    color: colors.borderBackColor,
    fontSize: 12,
    marginRight: 10,
  },
  filterImage: {
    height: 18,
    width: 18,
  },
  crossImage: {
    height: 7,
    width: 7,
  },
  crossImageView: {
    backgroundColor: NewColor.linerLightBlueTwinty,
    height: 16,
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});
export {TransactionFilter};
