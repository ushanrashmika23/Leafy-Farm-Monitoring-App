import type { LucideIcon } from 'lucide-react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS } from '../const/Color';

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    warning?: boolean;
    danger?: boolean;
    statusText?: string;
    switchValue?: boolean;
    onSwitchToggle?: (value: boolean) => void;
    differenceText?: string | null;
    arrowDirection?: 'up' | 'down' | null;
}

const StatusCard: React.FC<StatusCardProps> = ({
    title,
    value,
    icon: Icon,
    warning = false,
    danger = false,
    statusText,
    switchValue = false,
    onSwitchToggle,
    differenceText,
    arrowDirection,
}) => {
    const chevron1Anim = useRef(new Animated.Value(0)).current;
    const chevron2Anim = useRef(new Animated.Value(0)).current;
    const chevron3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (arrowDirection) {
            const createChevronAnimation = (animValue: Animated.Value, delay: number) => {
                return Animated.loop(
                    Animated.sequence([
                        Animated.delay(delay),
                        Animated.timing(animValue, {
                            toValue: 1,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                        Animated.delay(1200 - delay),
                        Animated.timing(animValue, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ])
                );
            };

            const anim1 = createChevronAnimation(chevron1Anim, 0);
            const anim2 = createChevronAnimation(chevron2Anim, 200);
            const anim3 = createChevronAnimation(chevron3Anim, 400);

            anim1.start();
            anim2.start();
            anim3.start();

            return () => {
                anim1.stop();
                anim2.stop();
                anim3.stop();
            };
        } else {
            chevron1Anim.setValue(0);
            chevron2Anim.setValue(0);
            chevron3Anim.setValue(0);
        }
    }, [arrowDirection, chevron1Anim, chevron2Anim, chevron3Anim]);

    const getChevronTransform = (animValue: Animated.Value, index: number) => {
        const baseDelay = index * 200; // 0ms, 200ms, 400ms
        
        return {
            opacity: animValue,
            transform: [
                {
                    scale: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                    }),
                },
                {
                    translateY: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: arrowDirection === 'up' ? [10, -2] : [-10, 2], // Move up for increase, down for decrease
                    }),
                },
            ],
        };
    };

    const getBgStyle = () => {
        // Return muted background if switch is off
        if (onSwitchToggle && !switchValue) {
            return styles.mutedBg;
        }
        
        if (danger) return styles.dangerBg;
        if (warning) return styles.warningBg;
        return styles.defaultBg;
    };

    const getIconColor = () => {
        // Return muted color if switch is off
        if (onSwitchToggle && !switchValue) {
            return '#9CA3AF'; // Gray color for muted state
        }
        
        if (danger) return COLORS.danger;//'#EF4444'; // red
        if (warning) return COLORS.warning;//'#F59E0B'; // yellow
        return COLORS.primary;//'#62C370'; // green
    };

    const getBadgeStyle = () => {
        // Return muted badge if switch is off
        if (onSwitchToggle && !switchValue) {
            return styles.mutedBadge;
        }
        
        if (danger) return styles.dangerBadge;
        if (warning) return styles.warningBadge;
        return styles.defaultBadge;
    };

    return (
        <View style={[styles.card, getBgStyle()]}>
            <View style={styles.contentContainer}>
                <View style={styles.leftSection}>
                    <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
                        <Icon size={18} color={getIconColor()} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, onSwitchToggle && !switchValue && styles.mutedText]}>{title}</Text>
                        <Text style={[styles.value, onSwitchToggle && !switchValue && styles.mutedText]}>{value}</Text>
                        {statusText && (
                            <Text style={[styles.statusBadge, getBadgeStyle()]}>
                                {statusText}
                            </Text>
                        )}
                        {differenceText && (
                            <Text style={[styles.differenceText, onSwitchToggle && !switchValue && styles.mutedText]}>
                                {differenceText}
                            </Text>
                        )}
                    </View>
                </View>
                {onSwitchToggle && (
                    <View style={styles.rightSection}>
                        {arrowDirection && (
                            <View style={styles.chevronContainer}>
                                {arrowDirection === 'up' ? (
                                    // For increase: show upward movement
                                    <>
                                        <Animated.View style={[styles.chevronItem, { top: 20 }, getChevronTransform(chevron1Anim, 0)]}>
                                            <ChevronUp size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                        <Animated.View style={[styles.chevronItem, { top: 12 }, getChevronTransform(chevron2Anim, 1)]}>
                                            <ChevronUp size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                        <Animated.View style={[styles.chevronItem, { top: 4 }, getChevronTransform(chevron3Anim, 2)]}>
                                            <ChevronUp size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                    </>
                                ) : (
                                    // For decrease: show downward movement
                                    <>
                                        <Animated.View style={[styles.chevronItem, { top: 4 }, getChevronTransform(chevron1Anim, 0)]}>
                                            <ChevronDown size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                        <Animated.View style={[styles.chevronItem, { top: 12 }, getChevronTransform(chevron2Anim, 1)]}>
                                            <ChevronDown size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                        <Animated.View style={[styles.chevronItem, { top: 20 }, getChevronTransform(chevron3Anim, 2)]}>
                                            <ChevronDown size={18} color={getIconColor()} strokeWidth={3} />
                                        </Animated.View>
                                    </>
                                )}
                            </View>
                        )}
                        <Switch
                            value={switchValue}
                            onValueChange={onSwitchToggle}
                            trackColor={{ false: '#E5E5E5', true: getIconColor() }}
                            thumbColor={switchValue ? '#FFFFFF' : '#FFFFFF'}
                        />
                    </View>
                )}
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
    mutedBg: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        opacity: 0.6,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    rightSection: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    chevronContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 40,
        width: 24,
        position: 'relative',
    },
    chevronItem: {
        position: 'absolute',
    },
    textContainer: {
        flex: 1,
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
    mutedBadge: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
    },
    mutedText: {
        color: '#9CA3AF',
    },
    differenceText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#6B7280',
        marginTop: 2,
    },
});

export default StatusCard;
