import AsyncStorage from '@react-native-async-storage/async-storage';
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

interface Plant {
    id: number;
    name: string;
    image: string;
    days: number;
    temperature?: number[];
    light?: number[];
    soilMoisture?: number[];
    humidity?: number[];
    sunLight?: number[];
}

const CameraAnalysisScreen: React.FC = () => {
    const navigation = useNavigation();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [plantCondition, setPlantCondition] = useState<string | null>(null);
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlantIndex, setSelectedPlantIndex] = useState<number | null>(1);
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
            // console.log("Error fetching sensor data:", error);
        }
    };

    // Function to determine status based on optimal ranges from selected plant
    const getStatus = (value: number, type: string): { text: string; isWarning: boolean; isDanger: boolean } => {
        // Get optimal ranges from selected plant or default fallback
        let optimalRanges = {
            temperature: { min: 20, max: 30 }, // Fallback
            humidity: { min: 40, max: 70 },    // Fallback
            sunLight: { min: 1000, max: 3000 }, // Fallback
            soilMoisture: { min: 30, max: 70 }  // Fallback
        };

        // If plants are available and a plant is selected, use its optimal ranges
        if (plants && plants.length > 0 && selectedPlantIndex !== null && plants[selectedPlantIndex]) {
            const selectedPlant = plants[selectedPlantIndex] as any;

            optimalRanges = {
                temperature: selectedPlant.temperature && selectedPlant.temperature.length >= 2
                    ? { min: selectedPlant.temperature[0], max: selectedPlant.temperature[1] }
                    : optimalRanges.temperature,

                humidity: selectedPlant.humidity && selectedPlant.humidity.length >= 2
                    ? { min: selectedPlant.humidity[0], max: selectedPlant.humidity[1] }
                    : optimalRanges.humidity,

                sunLight: selectedPlant.sunLight && selectedPlant.sunLight.length >= 2
                    ? { min: selectedPlant.sunLight[0], max: selectedPlant.sunLight[1] }
                    : optimalRanges.sunLight,

                soilMoisture: selectedPlant.soilMoisture && selectedPlant.soilMoisture.length >= 2
                    ? { min: selectedPlant.soilMoisture[0], max: selectedPlant.soilMoisture[1] }
                    : optimalRanges.soilMoisture
            };
        }

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
        // Get optimal ranges from selected plant or default fallback
        let optimalRanges = {
            temperature: { min: 20, max: 30 },
            humidity: { min: 40, max: 70 },
            sunLight: { min: 1000, max: 3000 },
            soilMoisture: { min: 30, max: 70 }
        };

        // If plants are available and a plant is selected, use its optimal ranges
        if (plants && plants.length > 0 && selectedPlantIndex !== null && plants[selectedPlantIndex]) {
            const selectedPlant = plants[selectedPlantIndex] as any;

            optimalRanges = {
                temperature: selectedPlant.temperature && selectedPlant.temperature.length >= 2
                    ? { min: selectedPlant.temperature[0], max: selectedPlant.temperature[1] }
                    : optimalRanges.temperature,

                humidity: selectedPlant.humidity && selectedPlant.humidity.length >= 2
                    ? { min: selectedPlant.humidity[0], max: selectedPlant.humidity[1] }
                    : optimalRanges.humidity,

                sunLight: selectedPlant.sunLight && selectedPlant.sunLight.length >= 2
                    ? { min: selectedPlant.sunLight[0], max: selectedPlant.sunLight[1] }
                    : optimalRanges.sunLight,

                soilMoisture: selectedPlant.soilMoisture && selectedPlant.soilMoisture.length >= 2
                    ? { min: selectedPlant.soilMoisture[0], max: selectedPlant.soilMoisture[1] }
                    : optimalRanges.soilMoisture
            };
        }

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
        // Get optimal ranges from selected plant or default fallback
        let optimalRanges = {
            temperature: { min: 20, max: 30 },
            humidity: { min: 40, max: 70 },
            sunLight: { min: 1000, max: 3000 },
            soilMoisture: { min: 30, max: 70 }
        };

        // If plants are available and a plant is selected, use its optimal ranges
        if (plants && plants.length > 0 && selectedPlantIndex !== null && plants[selectedPlantIndex]) {
            const selectedPlant = plants[selectedPlantIndex] as any;

            optimalRanges = {
                temperature: selectedPlant.temperature && selectedPlant.temperature.length >= 2
                    ? { min: selectedPlant.temperature[0], max: selectedPlant.temperature[1] }
                    : optimalRanges.temperature,

                humidity: selectedPlant.humidity && selectedPlant.humidity.length >= 2
                    ? { min: selectedPlant.humidity[0], max: selectedPlant.humidity[1] }
                    : optimalRanges.humidity,

                sunLight: selectedPlant.sunLight && selectedPlant.sunLight.length >= 2
                    ? { min: selectedPlant.sunLight[0], max: selectedPlant.sunLight[1] }
                    : optimalRanges.sunLight,

                soilMoisture: selectedPlant.soilMoisture && selectedPlant.soilMoisture.length >= 2
                    ? { min: selectedPlant.soilMoisture[0], max: selectedPlant.soilMoisture[1] }
                    : optimalRanges.soilMoisture
            };
        }

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
        // Fetch plants data and load selected plant index from storage
        const loadPlantsAndSelection = async () => {
            try {
                // console.log("Fetching all plants from API...");
                const response = await fetch(`${baseApiUrl}/userplants/all`);
                const data = await response.json();

                if (data?.data?.plants) {
                    setPlants(data.data.plants);

                    // Load selected plant index from storage
                    try {
                        const storedIndex = await AsyncStorage.getItem('selectedPlantIndex');
                        if (storedIndex !== null) {
                            const parsedIndex = JSON.parse(storedIndex);
                            setSelectedPlantIndex(parsedIndex);
                        } else {
                            setSelectedPlantIndex(data.data.plants.length > 0 ? 1 : null);
                        }
                    } catch (storageError) {
                        // console.log("Error loading selected plant index:", storageError);
                        setSelectedPlantIndex(data.data.plants.length > 0 ? 1 : null);
                    }
                }
            } catch (error) {
                // console.log("Error fetching plants:", error);
            }
        };

        // Load resolve mode from storage
        const loadResolveMode = async () => {
            try {
                const storedResolveMode = await AsyncStorage.getItem('resolveMode');
                if (storedResolveMode !== null) {
                    const parsedResolveMode = JSON.parse(storedResolveMode);
                    setResolveMode(parsedResolveMode);
                }
            } catch (error) {
                // console.log("Error loading resolve mode:", error);
            }
        };

        loadPlantsAndSelection();
        loadResolveMode();
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchLatestSensorData();

        // Set up interval to fetch every 1 second
        const interval = setInterval(fetchLatestSensorData, 1000);

        return () => clearInterval(interval);
    }, []);

    // Function to send controller device updates
    const updateControllerDevices = async (tempValue: number, humidityValue: number, soilMoistureValue: number, sunlightValue: number) => {
        try {
            const response = await fetch(`${baseApiUrl}/controldevices/update/69269e322911b6808d150ac0`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    temp: tempValue,
                    humidity: humidityValue,
                    soilmoisture: soilMoistureValue,
                    sunlight: sunlightValue
                })
            });

            const data = await response.json();
            // console.log('Controller devices updated:', data);
        } catch (error) {
            // console.log('Error updating controller devices:', error);
        }
    };

    // Effect to handle controller updates when resolve mode or switches change
    useEffect(() => {
        if (!sensorData) return;

        // Function to get difference value for API (moved inside useEffect to avoid dependency issues)
        const getDifferenceValue = (value: number, type: string): number => {
            // Get optimal ranges from selected plant or default fallback
            let optimalRanges = {
                temperature: { min: 20, max: 30 },
                humidity: { min: 40, max: 70 },
                sunLight: { min: 1000, max: 3000 },
                soilMoisture: { min: 30, max: 70 }
            };

            // If plants are available and a plant is selected, use its optimal ranges
            if (plants && plants.length > 0 && selectedPlantIndex !== null && plants[selectedPlantIndex]) {
                const selectedPlant = plants[selectedPlantIndex] as any;

                optimalRanges = {
                    temperature: selectedPlant.temperature && selectedPlant.temperature.length >= 2
                        ? { min: selectedPlant.temperature[0], max: selectedPlant.temperature[1] }
                        : optimalRanges.temperature,

                    humidity: selectedPlant.humidity && selectedPlant.humidity.length >= 2
                        ? { min: selectedPlant.humidity[0], max: selectedPlant.humidity[1] }
                        : optimalRanges.humidity,

                    sunLight: selectedPlant.sunLight && selectedPlant.sunLight.length >= 2
                        ? { min: selectedPlant.sunLight[0], max: selectedPlant.sunLight[1] }
                        : optimalRanges.sunLight,

                    soilMoisture: selectedPlant.soilMoisture && selectedPlant.soilMoisture.length >= 2
                        ? { min: selectedPlant.soilMoisture[0], max: selectedPlant.soilMoisture[1] }
                        : optimalRanges.soilMoisture
                };
            }

            const range = optimalRanges[type as keyof typeof optimalRanges];
            if (!range) return 0;

            if (value < range.min) {
                return range.min - value; // Positive value for increase needed
            } else if (value > range.max) {
                return -(value - range.max); // Negative value for decrease needed
            } else {
                return 0; // Within optimal range
            }
        };

        if (resolveMode) {
            // Resolve mode ON: send calculated difference values for active controllers
            const tempValue = temperatureController ? getDifferenceValue(sensorData.temperature, 'temperature') : 0;
            const humidityValue = humidityController ? getDifferenceValue(sensorData.humidity, 'humidity') : 0;
            const soilMoistureValue = soilMoistureController ? getDifferenceValue(sensorData.soilMoisture, 'soilMoisture') : 0;
            const sunlightValue = sunlightController ? getDifferenceValue(sensorData.sunLight, 'sunLight') : 0;

            updateControllerDevices(tempValue, humidityValue, soilMoistureValue, sunlightValue);
        } else {
            // Resolve mode OFF: send all values as 0
            updateControllerDevices(0, 0, 0, 0);
        }
    }, [resolveMode, temperatureController, humidityController, soilMoistureController, sunlightController, sensorData, plants, selectedPlantIndex]);

    // Effect to turn off all controllers when resolve mode is disabled
    useEffect(() => {
        if (!resolveMode) {
            // Resolve mode OFF: turn off all controllers
            setTemperatureController(false);
            setHumidityController(false);
            setSoilMoistureController(false);
            setSunlightController(false);
        } else {
            // Resolve mode ON: turn on all controllers
            setTemperatureController(true);
            setHumidityController(true);
            setSoilMoistureController(true);
            setSunlightController(true);
        }
    }, [resolveMode]);

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
                    <View>
                        <Text style={styles.sectionTitle}>Your Controllers</Text>
                    </View>
                    <View style={styles.resolveModeContainer}>
                        <Text style={styles.resolveModeText}>Resolve Mode</Text>
                        <Switch
                            value={resolveMode}
                            onValueChange={async (value) => {
                                setResolveMode(value);
                                // Save resolve mode to AsyncStorage
                                try {
                                    await AsyncStorage.setItem('resolveMode', JSON.stringify(value));
                                } catch (error) {
                                    // console.log('Error saving resolve mode:', error);
                                }
                                // API update will be triggered by useEffect
                            }}
                            trackColor={{ false: '#E5E5E5', true: '#62C370' }}
                            thumbColor={resolveMode ? '#FFFFFF' : '#FFFFFF'}
                        />
                    </View>
                </View>
                {/* {plants && selectedPlantIndex !== null && plants[selectedPlantIndex] && (
                    <Text style={styles.plantName}>{`${plants[selectedPlantIndex].name} Plant`}</Text>
                )} */}
                <View style={styles.statusCardsContainer}>
                    <StatusCard
                        title="Temperature"
                        value={sensorData ? `${sensorData.temperature}°C` : "--°C"}
                        icon={Thermometer}
                        warning={sensorData ? getStatus(sensorData.temperature, 'temperature').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.temperature, 'temperature').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.temperature, 'temperature').text : "Loading"}
                        switchValue={temperatureController}
                        onSwitchToggle={(value) => {
                            setTemperatureController(value);
                            // API update will be triggered by useEffect
                        }}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.temperature, 'temperature') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.temperature, 'temperature') : null}
                        resolveMode={resolveMode}
                    />
                    <StatusCard
                        title="Humidity"
                        value={sensorData ? `${sensorData.humidity}%` : "--%"}
                        icon={Droplet}
                        warning={sensorData ? getStatus(sensorData.humidity, 'humidity').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.humidity, 'humidity').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.humidity, 'humidity').text : "Loading"}
                        switchValue={humidityController}
                        onSwitchToggle={(value) => {
                            setHumidityController(value);
                            // API update will be triggered by useEffect
                        }}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.humidity, 'humidity') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.humidity, 'humidity') : null}
                        resolveMode={resolveMode}
                    />
                    <StatusCard
                        title="Soil Moisture"
                        value={sensorData ? `${sensorData.soilMoisture}%` : "--%"}
                        icon={Flower}
                        warning={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').text : "Loading"}
                        switchValue={soilMoistureController}
                        onSwitchToggle={(value) => {
                            setSoilMoistureController(value);
                            // API update will be triggered by useEffect
                        }}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.soilMoisture, 'soilMoisture') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.soilMoisture, 'soilMoisture') : null}
                        resolveMode={resolveMode}
                    />
                    <StatusCard
                        title="Sunlight"
                        value={sensorData ? `${sensorData.sunLight} lux` : "-- lux"}
                        icon={Sun}
                        warning={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isWarning : false}
                        danger={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isDanger : false}
                        statusText={sensorData ? getStatus(sensorData.sunLight, 'sunLight').text : "Loading"}
                        switchValue={sunlightController}
                        onSwitchToggle={(value) => {
                            setSunlightController(value);
                            // API update will be triggered by useEffect
                        }}
                        differenceText={sensorData ? getDifferenceFromOptimal(sensorData.sunLight, 'sunLight') : null}
                        arrowDirection={sensorData ? getArrowDirection(sensorData.sunLight, 'sunLight') : null}
                        resolveMode={resolveMode}
                    />
                </View>
            </View>
            <View style={{ height: 180 }}></View>
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
        marginBottom: 0,
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
        marginBottom: 0,

    },
    plantName: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginBottom: 4,
        marginLeft: 4,
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
