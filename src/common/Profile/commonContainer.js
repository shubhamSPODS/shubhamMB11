import {View} from 'react-native';
import React from 'react';
import {NewColor, colors} from '../../theme/color';

const CommonContainer = ({children, style}) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 2,
          // borderWidth: 2,
          borderRadius: 16,
          // borderColor: colors.borderLightBlue,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default CommonContainer;
