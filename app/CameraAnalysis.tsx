import { useNavigation } from '@react-navigation/native';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Droplet,
    Flower,
    Sun,
    Thermometer
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StatusCard from './components/StatusCard';
import { baseApiUrl } from './utils/Utils';

interface SensorData {
    temperature: number;
    humidity: number;
    sunLight: number;
    soilMoisture: number;
}

const CameraAnalysisScreen: React.FC = () => {
    const navigation = useNavigation();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [plantCondition, setPlantCondition] = useState<string | null>(null);
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [resolveMode, setResolveMode] = useState(false);
    const [temperatureController, setTemperatureController] = useState(true);
    const [humidityController, setHumidityController] = useState(true);
    const [soilMoistureController, setSoilMoistureController] = useState(true);
    const [sunlightController, setSunlightController] = useState(true);

    // Function to fetch latest sensor data
    const fetchLatestSensorData = async () => {
        try {
            const response = await fetch(`${baseApiUrl}/datarecods/latest`);
            const data = await response.json();

            if (data.code === 200 && data.data?.recod) {
                const record = data.data.recod;
                setSensorData({
                    temperature: record.temperature,
                    humidity: record.humidity,
                    sunLight: record.sunLight,
                    soilMoisture: record.soilMoisture
                });
            }
        } catch (error) {
            console.log("Error fetching sensor data:", error);
        }
    };

    // Function to determine status based on optimal ranges
    const getStatus = (value: number, type: string): { text: string; isWarning: boolean; isDanger: boolean } => {
        const optimalRanges = {
            temperature: { min: 20, max: 30 },
            humidity: { min: 40, max: 70 },
            sunLight: { min: 1000, max: 3000 },
            soilMoisture: { min: 30, max: 70 }
        };

        const range = optimalRanges[type as keyof typeof optimalRanges];
        if (!range) return { text: "Normal", isWarning: false, isDanger: false };

        if (value < range.min) {
            return { text: "Low", isWarning: false, isDanger: true };
        } else if (value > range.max) {
            return { text: "High", isWarning: true, isDanger: false };
        } else {
            return { text: "Normal", isWarning: false, isDanger: false };
        }
    };

    // Function to calculate difference from optimal values
    const getDifferenceFromOptimal = (value: number, type: string): string | null => {
        const optimalRanges = {
            temperature: { min: 20, max: 30 },
            humidity: { min: 40, max: 70 },
            sunLight: { min: 1000, max: 3000 },
            soilMoisture: { min: 30, max: 70 }
        };

        const units = {
            temperature: '°C',
            humidity: '%',
            sunLight: ' lux',
            soilMoisture: '%'
        };

        const range = optimalRanges[type as keyof typeof optimalRanges];
        const unit = units[type as keyof typeof units];
        if (!range || !unit) return null;
        
        if (value < range.min) {
            const difference = range.min - value;
            return `Increasing by ${difference.toFixed(1)}${unit}`;
        } else if (value > range.max) {
            const difference = value - range.max;
            return `Decreasing by ${difference.toFixed(1)}${unit}`;
        } else {
            // Value is within optimal range
            return null;
        }
    };

    // Function to get arrow direction for animation
    const getArrowDirection = (value: number, type: string): 'up' | 'down' | null => {
        const optimalRanges = {
            temperature: { min: 20, max: 30 },
            humidity: { min: 40, max: 70 },
            sunLight: { min: 1000, max: 3000 },
            soilMoisture: { min: 30, max: 70 }
        };

        const range = optimalRanges[type as keyof typeof optimalRanges];
        if (!range) return null;
        
        if (value < range.min) {
            return 'up'; // Need to increase
        } else if (value > range.max) {
            return 'down'; // Need to decrease
        } else {
            return null; // Within optimal range
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchLatestSensorData();

        // Set up interval to fetch every 1 second
        const interval = setInterval(fetchLatestSensorData, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setAnalysisComplete(true);
            const conditions = ['healthy', 'needs_water', 'disease'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            setPlantCondition(randomCondition);
        }, 3000);
    };

    const getConditionDetails = () => {
        switch (plantCondition) {
            case 'healthy':
                return {
                    icon: CheckCircle,
                    color: '#62C370',
                    title: 'Healthy Plant',
                    description: 'Your plant is healthy and thriving. Keep up the good work!',
                };
            case 'needs_water':
                return {
                    icon: AlertTriangle,
                    color: '#F59E0B',
                    title: 'Needs Water',
                    description: 'Your plant appears to be dehydrated. Consider watering it soon.',
                };
            case 'disease':
                return {
                    icon: AlertTriangle,
                    color: '#EF4444',
                    title: 'Possible Disease',
                    description: 'We detected signs of a possible disease. Check the leaves for spots or discoloration.',
                };
            default:
                return null;
        }
    };

    const conditionDetails = getConditionDetails();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resolve Environment</Text>
            </View>

            {/* Environment Condition Cards */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Controllors</Text>
                    <View style={styles.resolveModeContainer}>
                        <Text style={styles.resolveModeText}>Resolve Mode</Text>
                        <Switch
                            value={resolveMode}
                            onValueChange={setResolveMode}
                            trackColor={{ false: '#E5E5E5', true: '#62C370' }}
                            thumbColor={resolveMode ? '#FFFFFF' : '#FFFFFF'}
                        />
                    </View>
                </View>
                <View style={styles.statusCardsContainer}>
                    <StatusCard
                        title="Temperature"
                        value={sensorData ? `${sensorData.temperature}°C` : "--°C"}
                        icon={Thermometer}
                        warning={sensorData ? getStatus(sensorData.temperature, 'temperature').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.temperature, 'temperature').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.temperature, 'temperature').text : "Loading"}
                        switchValue={temperatureController}
                        onSwitchToggle={setTemperatureController}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.temperature, 'temperature') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.temperature, 'temperature') : null}
                    />
                    <StatusCard
                        title="Humidity"
                        value={sensorData ? `${sensorData.humidity}%` : "--%"}
                        icon={Droplet}
                        warning={sensorData ? getStatus(sensorData.humidity, 'humidity').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.humidity, 'humidity').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.humidity, 'humidity').text : "Loading"}
                        switchValue={humidityController}
                        onSwitchToggle={setHumidityController}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.humidity, 'humidity') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.humidity, 'humidity') : null}
                    />
                    <StatusCard
                        title="Soil Moisture"
                        value={sensorData ? `${sensorData.soilMoisture}%` : "--%"}
                        icon={Flower}
                        warning={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').text : "Loading"}
                        switchValue={soilMoistureController}
                        onSwitchToggle={setSoilMoistureController}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.soilMoisture, 'soilMoisture') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.soilMoisture, 'soilMoisture') : null}
                    />
                    <StatusCard
                        title="Sunlight"
                        value={sensorData ? `${Math.round(sensorData.sunLight / 10)}k lux` : "-- lux"}
                        icon={Sun}
                        warning={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.sunLight, 'sunLight').text : "Loading"}
                        switchValue={sunlightController}
                        onSwitchToggle={setSunlightController}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.sunLight, 'sunLight') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.sunLight, 'sunLight') : null}
                    />
                </View>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resolveModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resolveModeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },
    statusCardsContainer: {
        flexDirection: 'column',
        gap: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 24,
    },
    cameraFeedPlaceholder: {
        width: '100%',
        height: 256,
        backgroundColor: '#333',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    analysisOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    analyzeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    analyzeButtonEnabled: {
        backgroundColor: '#62C370',
    },
    analyzeButtonDisabled: {
        backgroundColor: 'gray',
    },
    analyzeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    analysisResultContainer: {
        marginTop: 16,
    },
    conditionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    conditionIconContainer: {
        marginRight: 12,
    },
    conditionTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    conditionDescription: {
        fontSize: 14,
        color: '#4B5563',
    },
});

export default CameraAnalysisScreen;
