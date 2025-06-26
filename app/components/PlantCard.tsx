import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../const/Color';

interface PlantCardProps {
    name: string;
    image: string;
    days: number;
    featured?: boolean;
    temperature?: number;
    light?: number;
    soilMoisture?: number;
    humidity?: number;
}

const PlantCard: React.FC<PlantCardProps> = ({
    name,
    image,
    days,
    featured = false,
    temperature,
    humidity,
    soilMoisture,
    light,
}) => {
    if (featured) {
        return (
            <View style={styles.featuredCard}>
                <Image source={{ uri: image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                    <View style={styles.featuredContent}>
                        <Text style={styles.featuredName}>{name} </Text>
                        <Text style={styles.featuredDays}>{days} days ago planted</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                            {typeof temperature === 'number' && (
                                <View style={[styles.detailRow, { width: '50%', paddingRight: 8 }]}>
                                    <View style={styles.detailIconContainer}>
                                        <Text style={styles.detailIcon}>🌡️</Text>
                                    </View>
                                    <Text style={styles.detailText}>Room Temp</Text>
                                    <Text style={styles.detailValue}>{temperature}°C</Text>
                                </View>
                            )}
                            {typeof light === 'number' && (
                                <View style={[styles.detailRow, { width: '50%', paddingLeft: 8 }]}>
                                    <View style={styles.detailIconContainer}>
                                        <Text style={styles.detailIcon}>💡</Text>
                                    </View>
                                    <Text style={styles.detailText}>Room Light</Text>
                                    <Text style={styles.detailValue}>{light}%</Text>
                                </View>
                            )}
                            {typeof humidity === 'number' && (
                                <View style={[styles.detailRow, { width: '50%', marginTop: 8, paddingRight: 8 }]}>
                                    <View style={styles.detailIconContainer}>
                                        <Text style={styles.detailIcon}>💧</Text>
                                    </View>
                                    <Text style={styles.detailText}>Humidity</Text>
                                    <Text style={styles.detailValue}>{humidity}%</Text>
                                </View>
                            )}
                            {typeof soilMoisture === 'number' && (
                                <View style={[styles.detailRow, { width: '50%', marginTop: 8, paddingLeft: 8 }]}>
                                    <View style={styles.detailIconContainer}>
                                        <Text style={styles.detailIcon}>🪴</Text>
                                    </View>
                                    <Text style={styles.detailText}>Soil Moisture</Text>
                                    <Text style={styles.detailValue}>{soilMoisture}%</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.days}>{days} days ago</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 16,
        width: '48%',
    },
    image: {
        width: '100%',
        height: 128,
        resizeMode: 'cover',
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
    },
    days: {
        fontSize: 12,
        color: 'gray',
    },
    featuredCard: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 24,
    },
    featuredImage: {
        width: '100%',
        height: 192,
        resizeMode: 'cover',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: 'rgba(98, 195, 112, 0.15)',
    },
    featuredContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    featuredName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    featuredDays: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    detailIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(98, 195, 112, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    detailIcon: {
        fontSize: 12,
        color: COLORS.primary,
    },
    detailText: {
        fontSize: 14,
    },
    detailValue: {
        marginLeft: 'auto',
        fontWeight: '600',
    },
});

export default PlantCard;
