import {
    Droplet,
    Flower,
    Sun,
    Thermometer
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from './const/Color';
import { baseApiUrl } from './utils/Utils';

const screenWidth = Dimensions.get('window').width;

interface Metric {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    unit: string;
}

interface DataRecord {
    _id: string;
    temperature: number;
    humidity: number;
    sunLight: number;
    soilMoisture: number;
    Date: string;
    Time: string;
    __v: number;
}

interface ProcessedData {
    label: string;
    temperature: number;
    humidity: number;
    sunlight: number;
    moisture: number;
}

const StatisticsScreen = () => {
    const [selectedMetric, setSelectedMetric] = useState('temperature');
    const [selectedPlant, setSelectedPlant] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [timePeriod, setTimePeriod] = useState('weekly');
    const [chartData, setChartData] = useState<ProcessedData[]>([]);
    const [loading, setLoading] = useState(false);

    // Process raw data based on time period - FRESH IMPLEMENTATION
    const processDataByTimePeriod = (records: DataRecord[], period: string): ProcessedData[] => {
        if (!records || records.length === 0) {
            console.log("No records to process");
            return [];
        }

        console.log(`Processing ${records.length} records for ${period} view`);

        // Helper function to parse mm/dd/yyyy date strings
        const parseDate = (dateString: string): Date => {
            // Handle mm/dd/yyyy format (e.g., "9/10/2025")
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0]) - 1; // Month is 0-indexed in Date constructor
                const day = parseInt(parts[1]);
                const year = parseInt(parts[2]);
                return new Date(year, month, day);
            }
            // Fallback to default Date parsing
            return new Date(dateString);
        };

        // Sort records by date first
        const sortedRecords = records.sort((a, b) => {
            const dateA = parseDate(a.Date).getTime();
            const dateB = parseDate(b.Date).getTime();
            return dateA - dateB;
        });

        const groupedData: { [key: string]: DataRecord[] } = {};

        sortedRecords.forEach((record, index) => {
            const recordDate = parseDate(record.Date);
            console.log(`Processing record ${index + 1}: Date=${record.Date}, Parsed=${recordDate.toDateString()}`);

            let groupKey = '';

            // Check if date is valid
            if (isNaN(recordDate.getTime())) {
                console.error(`Invalid date found: ${record.Date}`);
                return; // Skip this record
            }

            switch (period) {
                case 'daily':
                    // Format: "Sep 10"
                    groupKey = recordDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                    break;

                case 'weekly':
                    // Format: "Week 2 Sep" (week of the month)
                    const weekOfMonth = Math.ceil(recordDate.getDate() / 7);
                    const monthName = recordDate.toLocaleDateString('en-US', { month: 'short' });
                    groupKey = `Week ${weekOfMonth} ${monthName}`;
                    break;

                case 'monthly':
                    // Format: "Sep 2025"
                    groupKey = recordDate.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    });
                    break;

                case 'yearly':
                    // Format: "2025"
                    groupKey = recordDate.getFullYear().toString();
                    break;

                default:
                    groupKey = recordDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
            }

            console.log(`Group key for record: ${groupKey}`);

            if (!groupedData[groupKey]) {
                groupedData[groupKey] = [];
            }
            groupedData[groupKey].push(record);
        });

        console.log("Grouped data:", Object.keys(groupedData).map(key => ({
            key,
            count: groupedData[key].length
        })));

        // Convert grouped data to processed format
        const result: ProcessedData[] = [];

        Object.entries(groupedData).forEach(([label, recordsInGroup]) => {
            console.log(`Processing group: ${label} with ${recordsInGroup.length} records`);

            // Calculate averages
            const totalTemp = recordsInGroup.reduce((sum, r) => sum + (r.temperature || 0), 0);
            const totalHumidity = recordsInGroup.reduce((sum, r) => sum + (r.humidity || 0), 0);
            const totalSunlight = recordsInGroup.reduce((sum, r) => sum + (r.sunLight || 0), 0);
            const totalMoisture = recordsInGroup.reduce((sum, r) => sum + (r.soilMoisture || 0), 0);

            const avgTemp = totalTemp / recordsInGroup.length;
            const avgHumidity = totalHumidity / recordsInGroup.length;
            const avgSunlight = totalSunlight / recordsInGroup.length;
            const avgMoisture = totalMoisture / recordsInGroup.length;

            const processedPoint: ProcessedData = {
                label,
                temperature: Math.round(isNaN(avgTemp) ? 0 : avgTemp),
                humidity: Math.round(isNaN(avgHumidity) ? 0 : avgHumidity),
                sunlight: Math.round(isNaN(avgSunlight) ? 0 : Math.min(avgSunlight / 10, 100)), // Scale down sunlight
                moisture: Math.round(isNaN(avgMoisture) ? 0 : avgMoisture),
            };

            console.log(`Processed point:`, processedPoint);
            result.push(processedPoint);
        });

        // Sort result by the first date in each group for chronological order
        const sortedResult = result.sort((a, b) => {
            const groupA = groupedData[a.label];
            const groupB = groupedData[b.label];
            const dateA = parseDate(groupA[0].Date).getTime();
            const dateB = parseDate(groupB[0].Date).getTime();
            return dateA - dateB;
        });

        // Limit to the last 15 data points for better chart readability
        const limitedResult = sortedResult.slice(-15);

        console.log(`Final result: ${limitedResult.length} data points (limited from ${sortedResult.length})`);
        return limitedResult;
    };

    // Fetch data from API - FRESH IMPLEMENTATION
    const fetchChartData = useCallback(async () => {
        setLoading(true);
        console.log(`=== Fetching chart data for ${timePeriod} period ===`);

        try {
            const response = await fetch(`${baseApiUrl}/datarecods/all`);
            const apiData = await response.json();

            console.log("API Response:", apiData);

            if (apiData.code === 200 && apiData.data?.recods) {
                const rawRecords = apiData.data.recods;
                console.log(`Found ${rawRecords.length} raw records`);

                // Log first few records for debugging
                rawRecords.slice(0, 3).forEach((record: DataRecord, index: number) => {
                    console.log(`Sample record ${index + 1}:`, {
                        date: record.Date,
                        temp: record.temperature,
                        humidity: record.humidity,
                        sunLight: record.sunLight,
                        moisture: record.soilMoisture
                    });
                });

                const processedData = processDataByTimePeriod(rawRecords, timePeriod);
                console.log(`Setting ${processedData.length} processed data points to chart`);
                setChartData(processedData);
            } else {
                console.log("API response invalid or no records found");
                setChartData([]);
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
            // Fallback to dummy data for testing
            const dummyData = [
                { label: 'Sep 8', temperature: 22, humidity: 65, moisture: 40, sunlight: 80 },
                { label: 'Sep 9', temperature: 23, humidity: 68, moisture: 45, sunlight: 85 },
                { label: 'Sep 10', temperature: 25, humidity: 62, moisture: 42, sunlight: 90 },
                { label: 'Sep 11', temperature: 24, humidity: 70, moisture: 38, sunlight: 75 },
                { label: 'Sep 12', temperature: 26, humidity: 60, moisture: 35, sunlight: 95 },
            ];
            console.log("Using dummy data:", dummyData);
            setChartData(dummyData);
        }
        setLoading(false);
    }, [timePeriod]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    useEffect(() => {
        // Refresh data every 30 seconds
        const interval = setInterval(fetchChartData, 30000);
        return () => clearInterval(interval);
    }, [fetchChartData]);

    const plants = [
        { id: 'all', name: 'All Plants' },
        { id: 'succulent', name: 'Succulent' },
        { id: 'semp', name: 'Semp' },
        { id: 'pinkGerbera', name: 'Pink Gerbera' },
    ];

    const metrics: Metric[] = [
        { id: 'temperature', name: 'Temperature', icon: Thermometer, color: COLORS.blue, unit: '°C' },
        { id: 'humidity', name: 'Humidity', icon: Droplet, color: COLORS.warning, unit: '%' },
        { id: 'sunlight', name: 'Sunlight', icon: Sun, color: COLORS.orange, unit: '%' },
        { id: 'moisture', name: 'Soil Moisture', icon: Flower, color: COLORS.darkGreen, unit: '%' },
    ];

    const timePeriods = [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'monthly', name: 'Monthly' },
        { id: 'yearly', name: 'Yearly' },
    ];

    const currentMetric = metrics.find(m => m.id === selectedMetric);
    const currentPlant = plants.find(p => p.id === selectedPlant);

    const data = {
        labels: chartData.length > 0 ? chartData.map(d => d.label) : ['No Data'],
        datasets: [
            {
                data: chartData.length > 0
                    ? chartData.map(d => {
                        const value = d[selectedMetric as keyof ProcessedData] as number;
                        return isNaN(value) || !isFinite(value) ? 0 : value;
                    })
                    : [0],
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
        // Grid and axis configurations
        propsForBackgroundLines: {
            strokeDasharray: "5,5", // dashed grid lines
            stroke: "#e3e3e3",
            strokeWidth: 1,
        },
        propsForLabels: {
            fontSize: 10,
        },
        propsForVerticalLabels: {
            fontSize: 10,
            rotation: 90, // rotate x-axis labels vertically
        },
        formatXLabel: (value: string) => {
            // Truncate long labels for better display
            return value.length > 8 ? value.substring(0, 8) + '...' : value;
        },
    };

    return (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Statistics</Text>

            {/* Plant Dropdown */}
            {/* <TouchableOpacity
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
            )} */}

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
            <View style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 16, marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
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
                
                {loading ? (
                    <View style={{ width: screenWidth - 64, height: 280, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 16 }}>
                        <ActivityIndicator size="large" color={currentMetric?.color || COLORS.primary} />
                        <Text style={{ marginTop: 12, fontSize: 16, color: 'gray', fontWeight: '500' }}>Loading Chart Data...</Text>
                        <Text style={{ marginTop: 4, fontSize: 14, color: 'gray' }}>Fetching latest sensor readings</Text>
                    </View>
                ) : (
                    <LineChart
                        data={data}
                        width={screenWidth - 64}
                        height={280}
                        chartConfig={chartConfig}
                        bezier
                        style={{ borderRadius: 16 }}
                        withDots={true}
                        withShadow={false}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLabels={true}
                        withHorizontalLabels={true}
                        fromZero={false}
                    />
                )}
            </View>
            <View style={{ height: 120, width: '100%' }}></View>
        </ScrollView>
    );
};

export default StatisticsScreen;
