import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { AppText, ELEVEN, SEMI_BOLD, SIXTEEN, THIRTEEN } from './AppText';
import { RootState } from '../../libs/rootReducer';
import { Primary } from '../theme/dimens';
import { TouchableOpacityView } from './TouchableOpacityView';
import { colors } from '../theme/color';

const Secondary = ({
    buttonStyle,
    title,
    onPress,
    btnStyle,
    smallBtn,
    titleStyle,
    buttonViewStyle,
    ...rest
}) => {
    return (
        <TouchableOpacityView
            {...rest}
            style={buttonStyle}
            activeOpacity={1}
            onPress={onPress}>
            <LinearGradient
                colors={[colors.playerDetailsLinerOne, colors.playerDetailsLinerTwo]}
                locations={[0.0, 1.0]}
                style={[styles.grediant, btnStyle, smallBtn]}>
                <View style={[styles.buttonContainer, buttonViewStyle]}>
                    <AppText
                        type={ELEVEN}
                        weight={SEMI_BOLD}
                        style={[styles.buttonText, titleStyle]}>
                        {title}
                    </AppText>
                </View>
            </LinearGradient>
        </TouchableOpacityView>
    );
};

export default Secondary;

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        justifyContent: 'center',
    },
    grediant: {
        borderRadius: 5,
    },
    buttonContainer: {
        height: Primary.Height,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold"
    },
});