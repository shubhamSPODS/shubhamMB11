import React from 'react';
import { Text, Dimensions } from 'react-native';

export const { width: FULL_WIDTH } = Dimensions.get('window');

const Typography = (props) => {
    return (
        <Text style={[{ fontSize: props.size, color: props.color, fontFamily: props.fontFamily }, props.style]}>
            {props.children}
        </Text>
    );
};

export default Typography; 