import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../const/Color';
import GlassBlur from './GlassBlur';

interface PlantCardProps {
    name: string;
    image: string;
    days: number;
    featured?: boolean;
    temperature?: number[];
    humidity?: number[];
    light?: number[];
    soilMoisture?: number[];
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
                    <GlassBlur style={styles.featuredContent}>
                        <Text style={styles.featuredName}>{name} </Text>
                        <Text style={styles.featuredDays}>Optimal Ranges</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: -8 }}>
                            {temperature && temperature.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', paddingRight: 8 }]}>
                                    <View style={styles.detailHeader}>
                                        <View style={styles.detailIconContainer}>
                                            <Text style={styles.detailIcon}>🌡️</Text>
                                        </View>
                                        <Text style={styles.detailText}>Room Temp</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{temperature[0]}°C - {temperature[1]}°C</Text>
                                </View>
                            )}
                            {light && light.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', paddingLeft: 8 }]}>
                                    <View style={styles.detailHeader}>
                                        <View style={styles.detailIconContainer}>
                                            <Text style={styles.detailIcon}>💡</Text>
                                        </View>
                                        <Text style={styles.detailText}>Room Light</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{light[0]/1000}k - {light[1]/1000}k</Text>
                                </View>
                            )}
                            {humidity && humidity.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', marginTop: 8, paddingRight: 8 }]}>
                                    <View style={styles.detailHeader}>
                                        <View style={styles.detailIconContainer}>
                                            <Text style={styles.detailIcon}>💧</Text>
                                        </View>
                                        <Text style={styles.detailText}>Humidity</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{humidity[0]}% - {humidity[1]}%</Text>
                                </View>
                            )}
                            {soilMoisture && soilMoisture.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', marginTop: 8, paddingLeft: 8 }]}>
                                    <View style={styles.detailHeader}>
                                        <View style={styles.detailIconContainer}>
                                            <Text style={styles.detailIcon}>🪴</Text>
                                        </View>
                                        <Text style={styles.detailText}>Soil Moisture</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{soilMoisture[0]}% - {soilMoisture[1]}%</Text>
                                </View>
                            )}
                        </View>
                    </GlassBlur>
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
        // width: '48%',
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
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 32,
        height: 280,
    },
    featuredImage: {
        width: '100%',
        height: 280,
        resizeMode: 'cover',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    featuredContent: {
        // backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 16,
        padding: 20,
        paddingTop: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    featuredName: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    featuredDays: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    detailColumn: {
        marginTop: 12,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(98, 195, 112, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    detailIcon: {
        fontSize: 14,
        color: COLORS.primary,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.text,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.black,
        marginLeft: 38,
        letterSpacing: 0.3,
    },
});

export default PlantCard;
