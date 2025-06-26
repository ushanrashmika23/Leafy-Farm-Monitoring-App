import {
    Check,
    ChevronDown,
    ChevronUp,
    Droplet,
    Flower,
    Sun,
    Thermometer
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from './const/Color';

const screenWidth = Dimensions.get('window').width;

interface Metric {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    unit: string;
}

const StatisticsScreen = () => {
    const [selectedMetric, setSelectedMetric] = useState('temperature');
    const [selectedPlant, setSelectedPlant] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [timePeriod, setTimePeriod] = useState('weekly');

    const plants = [
        { id: 'all', name: 'All Plants' },
        { id: 'succulent', name: 'Succulent' },
        { id: 'semp', name: 'Semp' },
        { id: 'pinkGerbera', name: 'Pink Gerbera' },
    ];

    const metrics: Metric[] = [
        { id: 'temperature', name: 'Temperature', icon: Thermometer, color: COLORS.blue, unit: '°C' },
        { id: 'humidity', name: 'Humidity', icon: Droplet, color: COLORS.warning, unit: '%' },
        { id: 'moisture', name: 'Soil Moisture', icon: Flower, color: COLORS.darkGreen, unit: '%' },
        { id: 'sunlight', name: 'Sunlight', icon: Sun, color: COLORS.orange, unit: '%' },
    ];

    const timePeriods = [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'monthly', name: 'Monthly' },
        { id: 'yearly', name: 'Yearly' },
    ];

    const currentMetric = metrics.find(m => m.id === selectedMetric);
    const currentPlant = plants.find(p => p.id === selectedPlant);

    const chartData = [
        { temperature: 22, humidity: 65, moisture: 40, sunlight: 80 },
        { temperature: 23, humidity: 68, moisture: 45, sunlight: 85 },
        { temperature: 25, humidity: 62, moisture: 42, sunlight: 90 },
        { temperature: 24, humidity: 70, moisture: 38, sunlight: 75 },
        { temperature: 26, humidity: 60, moisture: 35, sunlight: 95 },
        { temperature: 24, humidity: 65, moisture: 40, sunlight: 85 },
        { temperature: 23, humidity: 68, moisture: 45, sunlight: 80 },
    ];

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: chartData.map(d => d[selectedMetric as keyof typeof d] as number),
                color: (opacity = 1) => currentMetric?.color || `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: COLORS.white,
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        decimalPlaces: 0,
        color: (opacity = 1) => currentMetric?.color || `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: currentMetric?.color || COLORS.warning,
        },
    };

    return (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Statistics</Text>

            {/* Plant Dropdown */}
            <TouchableOpacity
                onPress={() => setDropdownOpen(!dropdownOpen)}
                style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>🌿</Text>
                    <View>
                        <Text style={{ fontSize: 14, color: 'gray' }}>Selected Plant</Text>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{currentPlant?.name}</Text>
                    </View>
                </View>
                {dropdownOpen ? <ChevronUp size={20} color="gray" /> : <ChevronDown size={20} color="gray" />}
            </TouchableOpacity>
            {dropdownOpen && (
                <View style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
                    {plants.map(plant => (
                        <TouchableOpacity
                            key={plant.id}
                            onPress={() => {
                                setSelectedPlant(plant.id);
                                setDropdownOpen(false);
                            }}
                            style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                        >
                            {selectedPlant === plant.id && <Check size={16} color={COLORS.primary} style={{ marginRight: 8 }} />}
                            <Text>{plant.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Time Periods */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 18 }}>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>Plant Metrics</Text>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 8, padding: 4 }}>
                    {timePeriods.map(period => (
                        <TouchableOpacity
                            key={period.id}
                            onPress={() => setTimePeriod(period.id)}
                            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: timePeriod === period.id ? COLORS.primary : 'transparent' }}
                        >
                            <Text style={{ fontSize: 12, color: timePeriod === period.id ? 'white' : COLORS.textSecondary }}>{period.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Metrics Pills */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {metrics.map(metric => {
                    const IconComp = metric.icon;
                    const isSelected = selectedMetric === metric.id;
                    return (
                        <TouchableOpacity
                            key={metric.id}
                            onPress={() => setSelectedMetric(metric.id)}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: isSelected ? COLORS.primary : COLORS.white, borderWidth: 1, borderColor: COLORS.border }}
                        >
                            <IconComp size={16} color={isSelected ? COLORS.white : COLORS.text} />
                            <Text style={{ marginLeft: 6, fontSize: 14, color: isSelected ? COLORS.white : COLORS.text }}>{metric.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Chart Section */}
            <View style={{ backgroundColor: COLORS.background, borderRadius: 12, padding: 16, marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'flex-start', alignSelf: 'stretch' }}>
                    {currentMetric && (
                        <View style={{ backgroundColor: currentMetric.color + '20', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                            <currentMetric.icon size={18} color={currentMetric.color} />
                        </View>
                    )}
                    <View>
                        <Text style={{ fontSize: 14, color: 'gray' }}>Current View</Text>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{currentMetric?.name} Chart ({timePeriods.find(t => t.id === timePeriod)?.name})</Text>
                    </View>
                </View>
                <LineChart
                    data={data}
                    width={screenWidth - 32}
                    height={280}
                    chartConfig={chartConfig}
                    bezier
                    style={{ borderRadius: 16, marginLeft: -16, marginRight: -16 }}
                />
            </View>
        </ScrollView>
    );
};

export default StatisticsScreen;
