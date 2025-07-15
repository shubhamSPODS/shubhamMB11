import React, { useState, useEffect } from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const SpinnerSecond = ({style, loading}) => {
  const [showSpinner, setShowSpinner] = useState(loading);
  
  // Add a safety timeout to hide spinner after 15 seconds
  useEffect(() => {
    setShowSpinner(loading);
    
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => {
        console.log('SpinnerSecond safety timeout reached, hiding spinner');
        setShowSpinner(false);
      }, 15000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);
  
  return (
    <>
      {showSpinner ? (
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
