import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Blur = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={['rgba(0,0,0, 0.85)', 'rgba(0,0,0, 0.85) ']}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}></LinearGradient>
  );
};

export default Blur;
