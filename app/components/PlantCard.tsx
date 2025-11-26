import { Droplet, Flower, Sun, Thermometer } from 'lucide-react-native';
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
                                    <View style={styles.detailRow}>
                                        <View style={[styles.detailIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                                            <Thermometer size={16} color="#3B82F6" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailText}>Temperature</Text>
                                            <Text style={styles.detailValue}>{temperature[0]}°C - {temperature[1]}°C</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {light && light.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', paddingLeft: 8 }]}>
                                    <View style={styles.detailRow}>
                                        <View style={[styles.detailIconContainer, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                                            <Sun size={16} color="#F97316" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailText}>Sunlight</Text>
                                            <Text style={styles.detailValue}>{light[0]/1000}k - {light[1]/1000}k</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {humidity && humidity.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', marginTop: 8, paddingRight: 8 }]}>
                                    <View style={styles.detailRow}>
                                        <View style={[styles.detailIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                                            <Droplet size={16} color="#F59E0B" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailText}>Humidity</Text>
                                            <Text style={styles.detailValue}>{humidity[0]}% - {humidity[1]}%</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {soilMoisture && soilMoisture.length > 0 && (
                                <View style={[styles.detailColumn, { width: '50%', marginTop: 8, paddingLeft: 8 }]}>
                                    <View style={styles.detailRow}>
                                        <View style={[styles.detailIconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                                            <Flower size={16} color="#22C55E" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailText}>Soil Moisture</Text>
                                            <Text style={styles.detailValue}>{soilMoisture[0]}% - {soilMoisture[1]}%</Text>
                                        </View>
                                    </View>
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
        alignItems: 'flex-start',
    },
    detailColumn: {
        marginTop: 12,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    detailText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text,
        opacity: 0.75,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.black,
        letterSpacing: 0.3,
    },
});

export default PlantCard;
