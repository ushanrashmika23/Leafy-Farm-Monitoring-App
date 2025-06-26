import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../const/Color';

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    warning?: boolean;
    danger?: boolean;
    statusText?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
    title,
    value,
    icon: Icon,
    warning = false,
    danger = false,
    statusText,
}) => {
    const getBgStyle = () => {
        if (danger) return styles.dangerBg;
        if (warning) return styles.warningBg;
        return styles.defaultBg;
    };

    const getIconColor = () => {
        if (danger) return COLORS.danger;//'#EF4444'; // red
        if (warning) return COLORS.warning;//'#F59E0B'; // yellow
        return COLORS.primary;//'#62C370'; // green
    };

    const getBadgeStyle = () => {
        if (danger) return styles.dangerBadge;
        if (warning) return styles.warningBadge;
        return styles.defaultBadge;
    };

    return (
        <View style={[styles.card, getBgStyle()]}>
            <View style={styles.contentContainer}>
                <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
                    <Icon size={18} color={getIconColor()} />
                </View>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.value}>{value}</Text>
                    {statusText && (
                        <Text style={[styles.statusBadge, getBadgeStyle()]}>
                            {statusText}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        width: '100%', // Make card take full available width
    },
    defaultBg: {
        backgroundColor: 'white',
        borderColor: '#E5E7EB',
    },
    warningBg: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FEF3C7',
    },
    dangerBg: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly', // Added for space between icon and other content
        gap: 12,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 9999,
    },
    title: {
        fontSize: 14,
        color: '#6B7280',
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
    },
    statusBadge: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    defaultBadge: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
    },
    warningBadge: {
        backgroundColor: '#FEF3C7',
        color: '#D97706',
    },
    dangerBadge: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
    },
});

export default StatusCard;
