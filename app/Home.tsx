import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import StatusCard from '../components/StatusCard';
// import PlantCard from '../components/PlantCard';
// import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import { Camera, Droplet, Flower, Sun, Thermometer } from 'lucide-react-native';
import PlantCard from './components/PlantCard';
import StatusCard from './components/StatusCard';
import { COLORS } from './const/Color';
import { baseApiUrl } from './utils/Utils';

type RootStackParamList = {
    CameraAnalysis: undefined;
    // Add other routes if needed
};
interface Plant {
    id: number;
    name: string;
    image: string;
    days: number;
    temperature?: number[];
    light?: number[];
    soilMoisture?: number[];
    humidity?: number[];
}

interface SensorData {
    temperature: number;
    humidity: number;
    sunLight: number;
    soilMoisture: number;
}

const HomeScreen: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlantIndex, setSelectedPlantIndex] = useState<number | null>(0);
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const scrollViewRef = React.useRef<ScrollView>(null);
    const handleAddPlant = (): void => {
        console.log('Add new plant');
    };

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

    // Function to determine status based on optimal ranges from selected plant
    const getStatus = (value: number, type: string): { text: string; isWarning: boolean; isDanger: boolean } => {
        // Get optimal ranges from 0th plant as default, fallback to hardcoded if no plants available
        let optimalRanges = {
            temperature: { min: 20, max: 30 }, // Hardcoded fallback
            humidity: { min: 40, max: 70 },    // Hardcoded fallback
            sunLight: { min: 1000, max: 3000 }, // Hardcoded fallback
            soilMoisture: { min: 30, max: 70 }  // Hardcoded fallback
        };

        // Set default ranges from 0th plant if plants are available
        if (plants && plants.length > 0) {
            const defaultPlant = plants[0] as any;
            
            optimalRanges = {
                temperature: defaultPlant.temperature && defaultPlant.temperature.length >= 2 
                    ? { min: defaultPlant.temperature[0], max: defaultPlant.temperature[1] }
                    : { min: 20, max: 30 },
                
                humidity: defaultPlant.humidity && defaultPlant.humidity.length >= 2 
                    ? { min: defaultPlant.humidity[0], max: defaultPlant.humidity[1] }
                    : { min: 40, max: 70 },
                
                sunLight: defaultPlant.sunLight && defaultPlant.sunLight.length >= 2 
                    ? { min: defaultPlant.sunLight[0], max: defaultPlant.sunLight[1] }
                    : { min: 1000, max: 3000 },
                
                soilMoisture: defaultPlant.soilMoisture && defaultPlant.soilMoisture.length >= 2 
                    ? { min: defaultPlant.soilMoisture[0], max: defaultPlant.soilMoisture[1] }
                    : { min: 30, max: 70 }
            };
        }

        // If a specific plant is selected, override with its optimal ranges
        if (plants && selectedPlantIndex !== null && plants[selectedPlantIndex]) {
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

    useEffect(() => {
        console.log("Fetching all plants from API...");
        fetch(`${baseApiUrl}/userplants/all`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched plants:", data);
                if (data?.data?.plants) {
                    setPlants(data.data.plants);
                    setSelectedPlantIndex(data.data.plants.length > 0 ? 0 : null);
                    setSelectedPlantIndex(1);
                }
            })
            .catch(error => {
                console.log("Error fetching plants:", error);
            });
    }, []);

    // Fetch sensor data every 1 second
    useEffect(() => {
        // Initial fetch
        fetchLatestSensorData();
        
        // Set up interval to fetch every 1 second
        const interval = setInterval(fetchLatestSensorData, 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ScrollView style={styles.container} ref={scrollViewRef}>
                <Text style={styles.title}>Manage Your</Text>
                <Text style={styles.subtitle}>Farm Environment</Text>
                {/* <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Current Status</Text>
                </View> */}

                {/* Dynamic Plants from API */}

                <PlantCard
                    key={1}
                    featured
                    name={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].name : ""}
                    image={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].image : ""}
                    // name={"Ferns"}
                    // image={"https://tse1.mm.bing.net/th/id/OIP.9D0_JX8jqaieuptRqFtnsgHaDe?r=0&cb=thfc1ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}
                    days={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].days : 0}
                    temperature={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].temperature : []}
                    light={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? (plants[selectedPlantIndex] as any).sunLight : []}
                    soilMoisture={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].soilMoisture : []}
                    humidity={plants && selectedPlantIndex !== null && plants[selectedPlantIndex] ? plants[selectedPlantIndex].humidity : []}
                />


                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Current Status</Text>
                    </View>
                    <View style={[styles.statusCardsContainer, { flexWrap: 'wrap' }]}>
                        <View style={{ width: '48%', marginBottom: 5 }}>
                            <StatusCard 
                                title="Temperature" 
                                value={sensorData ? `${sensorData.temperature}°C` : "--°C"} 
                                icon={Thermometer} 
                                warning={sensorData ? getStatus(sensorData.temperature, 'temperature').isWarning : false}
                                danger={sensorData ? getStatus(sensorData.temperature, 'temperature').isDanger : false}
                                statusText={sensorData ? getStatus(sensorData.temperature, 'temperature').text : "Loading"} 
                            />
                        </View>
                        <View style={{ width: '48%', marginBottom: 5 }}>
                            <StatusCard 
                                title="Humidity" 
                                value={sensorData ? `${sensorData.humidity}%` : "--%"} 
                                icon={Droplet} 
                                warning={sensorData ? getStatus(sensorData.humidity, 'humidity').isWarning : false}
                                danger={sensorData ? getStatus(sensorData.humidity, 'humidity').isDanger : false}
                                statusText={sensorData ? getStatus(sensorData.humidity, 'humidity').text : "Loading"} 
                            />
                        </View>
                        <View style={{ width: '48%' }}>
                            <StatusCard 
                                title="Soil Moisture" 
                                value={sensorData ? `${sensorData.soilMoisture}%` : "--%"} 
                                icon={Flower} 
                                warning={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isWarning : false}
                                danger={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').isDanger : false}
                                statusText={sensorData ? getStatus(sensorData.soilMoisture, 'soilMoisture').text : "Loading"} 
                            />
                        </View>
                        <View style={{ width: '48%' }}>
                            <StatusCard 
                                title="Sunlight" 
                                value={sensorData ? `${Math.round(sensorData.sunLight / 10)}k lux` : "-- lux"} 
                                icon={Sun} 
                                warning={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isWarning : false}
                                danger={sensorData ? getStatus(sensorData.sunLight, 'sunLight').isDanger : false}
                                statusText={sensorData ? getStatus(sensorData.sunLight, 'sunLight').text : "Loading"} 
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.cameraAnalysisButton}
                    onPress={() => router.push('/CameraAnalysis' as any)}
                >
                    <Camera color="white" size={24} />
                    <Text style={styles.cameraAnalysisButtonText}>Live Camera Analysis</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <View style={styles.plantTypeButtons}>
                        <TouchableOpacity style={styles.activePlantTypeButton}>
                            <Text style={styles.activePlantTypeButtonText}>All Plants</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.inactivePlantTypeButton}>
                            <Text style={styles.inactivePlantTypeButtonText}>Harvested</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.plantCardsContainer}>
                        {
                            plants.map((plant: any, idx: number) => (
                                <TouchableOpacity
                                    key={plant._id}
                                    onPress={() => {
                                        setSelectedPlantIndex(idx);
                                        // Scroll to top of ScrollView
                                        scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
                                    }}
                                    style={{ width: '48%' }}
                                >
                                    <PlantCard
                                        name={plant.name}
                                        image={plant.image}
                                        days={plant.days}
                                        temperature={plant.temperature}
                                        light={plant.sunLight}
                                        soilMoisture={plant.soilMoisture}
                                        humidity={plant.humidity}
                                    />
                                </TouchableOpacity>
                            ))
                        }

                    </View>
                </View>
                <View style={{ height: 100 }}></View>
            </ScrollView>
            {/* <FloatingActionButton onClick={handleAddPlant} /> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },
    statusCardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    cameraAnalysisButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 24,
    },
    cameraAnalysisButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    plantTypeButtons: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 18,
    },
    activePlantTypeButton: {
        borderBottomWidth: 2,
        borderColor: COLORS.primary,
        paddingBottom: 4,
    },
    activePlantTypeButtonText: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    inactivePlantTypeButton: {
        paddingBottom: 4,
    },
    inactivePlantTypeButtonText: {
        color: 'gray',
        fontWeight: '500',
    },
    plantCardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 32,
    },
});

export default HomeScreen;

