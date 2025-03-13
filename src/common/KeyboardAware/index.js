import React from 'react';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {KeyBoardAwareProps} from '../../types/common';

const KeyBoardAware = ({children, style, scrollEnabled,refreshControl, ...props}:any) => {
  return (
    <KeyboardAwareScrollView
      {...props}
      keyboardShouldPersistTaps="handled"
      style={[
        {
          flex: 1,
        },
        style,
      ]}
      contentContainerStyle={{flexGrow: 1}}
      scrollEnabled={scrollEnabled}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}>
      {children}
    </KeyboardAwareScrollView>
  );
};
export {KeyBoardAware};
