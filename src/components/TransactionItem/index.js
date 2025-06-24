import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from '../../common/AppText';
import { NewColor } from '../../theme/color';
import FastImage from '@d11/react-native-fast-image';
import { prize, fee, pending, failed } from '../../helper/image';

const ICONS = {
    prize,
    fee,
    deposit_request_pending: pending,
    deposit_request_failed: failed,
};

const STATUS_COLORS = {
    Approved: '#15CE31',
    Pending: '#D89E3C',
    Failed: '#FF4F4F'
};

const TransactionItem = ({ item }) => {
    const icon = ICONS[item.type] || fee;
    const statusColor = STATUS_COLORS[item.status] || '#000000';

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                    <FastImage source={icon} style={styles.icon} resizeMode="contain" />
                </View>
                <View>
                    <AppText style={{color: '#000'}} weight={POPPINS_SEMI_BOLD}>{item.title}</AppText>
                    <AppText style={{color: '#828282'}}>{item.date}</AppText>
                </View>
            </View>
            <View style={styles.rightContainer}>
                 <AppText style={{color: '#000'}} weight={POPPINS_SEMI_BOLD}>{item.amount}</AppText>
                <AppText style={{ color: statusColor }}>{item.status}</AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginVertical: 5,
        marginHorizontal: 20,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        width: 20,
        height: 20,
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
});

export default TransactionItem; 