import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const SpinnerSecond = ({style, loading}) => {
  return (
    <>
      {loading ? (
        <View style={[styles.spinnerStyle, style]}>
          <ActivityIndicator size={'large'} color={'#FFD700'} />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  spinnerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00000050',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export {SpinnerSecond};
