import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from '../../common/AppText';
import { NewColor, colors } from '../../theme/color';
import FastImage from '@d11/react-native-fast-image';
import { prize, fee, pending, failed, greenArrow, redArrow } from '../../helper/image';

const ICONS = {
    prize,
    fee,
    deposit_request_pending: pending,
    deposit_request_failed: failed,
};

const STATUS_COLORS = {
    Approved: colors.green,
    Pending: colors.lightOrange,
    Failed: colors.lightRed
};

const TransactionItem = ({ item }) => {
    // Determine if this is a winning or deduction transaction based on transaction_type
    const isWinning = item.transaction_type === 'prize';
    const isDeduction = item.transaction_type === 'fee';
    
    // Set amount color based on transaction type
    const amountColor = isWinning ? colors.green : isDeduction ? colors.lightRed : '#FFFFFF';
    
    // Set background color for the amount container
    const amountBackgroundColor = isWinning ? colors.lightGreen : isDeduction ? colors.lighteshRef : 'transparent';
    
    // Choose the appropriate arrow icon based on transaction type
    const arrowIcon = isWinning ? greenArrow : isDeduction ? redArrow : fee;

    // Format date and time from createdAt
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            
            // Show date and time in format: "Aug 07, 10:49 AM"
            const options = { 
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return dateString;
        }
    };

    // Get transaction title and amount from API data
    const getTransactionTitle = () => {
        if (item.transaction_type === 'prize') return 'Prize Won';
        if (item.transaction_type === 'fee') return 'Fee Deducted';
        return item.description || 'Transaction';
    };

    const getTransactionAmount = () => {
        const amount = item.amount || 0;
        const sign = isWinning ? '+' : isDeduction ? '-' : '';
        return `${sign}₹${amount}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={[styles.iconContainer, { backgroundColor: amountBackgroundColor }]}>
                    <FastImage source={arrowIcon} style={styles.icon} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                    <AppText style={styles.title} weight={POPPINS_SEMI_BOLD}>
                        {getTransactionTitle()}
                    </AppText>
                    <AppText style={styles.date}>
                        {formatDateTime(item.createdAt)}
                    </AppText>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <AppText style={[styles.amount, { color: amountColor }]} weight={POPPINS_SEMI_BOLD}>
                    {getTransactionAmount()}
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: NewColor.linerBlackFive,
        borderRadius: 12,
        marginVertical: 6,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: NewColor.linerBlacklightEight,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        width: 22,
        height: 22,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: colors.white,
        fontSize: 14,
        marginBottom: 4,
    },
    date: {
        color: NewColor.linerBlacklight,
        fontSize: 12,
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TransactionItem; 