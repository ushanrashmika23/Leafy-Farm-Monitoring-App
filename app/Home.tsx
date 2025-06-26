import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import StatusCard from '../components/StatusCard';
// import PlantCard from '../components/PlantCard';
// import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, Droplet, Flower, Sun, Thermometer } from 'lucide-react-native';
import PlantCard from './components/PlantCard';
import StatusCard from './components/StatusCard';
import { COLORS } from './const/Color';

type RootStackParamList = {
    CameraAnalysis: undefined;
    // Add other routes if needed
};

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleAddPlant = (): void => {
        console.log('Add new plant');
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Manage Your</Text>
                <Text style={styles.subtitle}>Farm Environment</Text>
                {/* <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Current Status</Text>
                </View> */}
                <PlantCard
                    featured
                    name="Succulent"
                    image="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    days={12}
                    temperature={24}
                    light={76}
                    soilMoisture={42}
                    humidity={65}
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Current Status</Text>
                    </View>
                    <View style={[styles.statusCardsContainer, { flexWrap: 'wrap' }]}>
                        <View style={{ width: '48%', marginBottom: 5 }}>
                            <StatusCard title="Temperature" value="24°C" icon={Thermometer} statusText="Normal" />
                        </View>
                        <View style={{ width: '48%', marginBottom: 5 }}>
                            <StatusCard title="Humidity" value="65%" icon={Droplet} warning statusText="High" />
                        </View>
                        <View style={{ width: '48%' }}>
                            <StatusCard title="Soil Moisture" value="42%" icon={Flower} danger statusText="Low" />
                        </View>
                        <View style={{ width: '48%' }}>
                            <StatusCard title="Sunlight" value="87%" icon={Sun} statusText="Normal" />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.cameraAnalysisButton}
                    onPress={() => navigation.navigate('CameraAnalysis')}
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
                        <PlantCard
                            name="Semp"
                            image="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            days={3}
                        />
                        <PlantCard
                            name="Pink Gerbera"
                            image="https://images.unsplash.com/photo-1596438459194-f275f413d6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            days={7}
                        />
                        <PlantCard
                            name="Pink Gerbera"
                            image="https://images.unsplash.com/photo-1596438459194-f275f413d6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            days={7}
                        />
                        <PlantCard
                            name="Semp"
                            image="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            days={3}
                        />
                        <PlantCard
                            name="Semp"
                            image="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            days={3}
                        />

                    </View>
                </View>
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
