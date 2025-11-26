import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ImageIcon, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { baseApiUrl } from './utils/Utils';

type RouteParams = {
    id: string;
    name: string;
    image: string;
    days: string;
    tempMin: string;
    tempMax: string;
    humidityMin: string;
    humidityMax: string;
    lightMin: string;
    lightMax: string;
    moistureMin: string;
    moistureMax: string;
};

interface FormData {
    name: string;
    image: string;
    idealTemperature: { min: string; max: string };
    idealHumidity: { min: string; max: string };
    idealLight: { min: string; max: string };
    idealMoisture: { min: string; max: string };
    plantedDate: string;
}

const EditPlantScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const params = route.params || {};

    const [formData, setFormData] = useState<FormData>({
        name: '',
        image: '',
        idealTemperature: { min: '18', max: '26' },
        idealHumidity: { min: '40', max: '60' },
        idealLight: { min: '60', max: '80' },
        idealMoisture: { min: '40', max: '60' },
        plantedDate: '2023-05-15',
    });

    useEffect(() => {
        // Load plant data from route parameters
        if (params.id) {
            setFormData({
                name: params.name || '',
                image: params.image || '',
                idealTemperature: {
                    min: params.tempMin || '18',
                    max: params.tempMax || '26'
                },
                idealHumidity: {
                    min: params.humidityMin || '40',
                    max: params.humidityMax || '60'
                },
                idealLight: {
                    min: params.lightMin || '60',
                    max: params.lightMax || '80'
                },
                idealMoisture: {
                    min: params.moistureMin || '40',
                    max: params.moistureMax || '60'
                },
                plantedDate: '2023-05-15', // You can add this to params if needed
            });
        }
    }, [params]);

    const handleChange = (name: string, value: string) => {
        if (name.includes('.')) {
            const [field, subfield] = name.split('.') as [keyof FormData, string];
            setFormData((prev) => ({
                ...prev,
                [field]: {
                    ...(prev[field] as any),
                    [subfield]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (!params.id) {
                // console.log('No plant ID provided');
                return;
            }

            const updateData = {
                name: formData.name,
                image: formData.image,
                temperature: [parseFloat(formData.idealTemperature.min), parseFloat(formData.idealTemperature.max)],
                humidity: [parseFloat(formData.idealHumidity.min), parseFloat(formData.idealHumidity.max)],
                sunLight: [parseFloat(formData.idealLight.min), parseFloat(formData.idealLight.max)],
                soilMoisture: [parseFloat(formData.idealMoisture.min), parseFloat(formData.idealMoisture.max)],
            };

            const response = await fetch(`${baseApiUrl}/userplants/update/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            if (result.code === 200) {
                // Success - navigate back
                navigation.navigate('Settings' as never);
            } else {
                // Handle error
                // console.log('Error updating plant:', result.message);
            }
        } catch (error) {
            // console.log('Error updating plant:', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (!params.id) {
                // console.log('No plant ID provided');
                return;
            }

            const response = await fetch(`${baseApiUrl}/userplants/delete/${params.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.code === 200) {
                // Success - navigate back
                navigation.navigate('Settings' as never);
            } else {
                // Handle error
                // console.log('Error deleting plant:', result.message);
            }
        } catch (error) {
            // console.log('Error deleting plant:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Plant Profile</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.imagePickerContainer}>
                    {formData.image ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => handleChange('image', '')}>
                                <X size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <ImageIcon size={40} color="gray" />
                            <Text style={styles.imagePlaceholderText}>Add plant image</Text>
                        </View>
                    )}
                    <TextInput
                        style={styles.imageInput}
                        placeholder="Enter image URL"
                        value={formData.image}
                        onChangeText={(text) => handleChange('image', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Plant Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Monstera Deliciosa"
                        value={formData.name}
                        onChangeText={(text) => handleChange('name', text)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date Planted</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={formData.plantedDate}
                        onChangeText={(text) => handleChange('plantedDate', text)}
                    />
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Ideal Growing Conditions</Text>

                {(['Temperature', 'Humidity', 'Light', 'Moisture'] as const).map((type) => {
                    const key = `ideal${type}` as keyof FormData;
                    const range = formData[key] as { min: string; max: string };
                    return (
                        <View key={type} style={styles.inputGroup}>
                            <Text style={styles.label}>{`${type} Range (${type === 'Temperature' ? '°C' : '%'})`}</Text>
                            <View style={styles.rangeInputContainer}>
                                <TextInput
                                    style={styles.rangeInput}
                                    placeholder="Min"
                                    keyboardType="numeric"
                                    value={range.min}
                                    onChangeText={(text) => handleChange(`${key}.min`, text)}
                                />
                                <TextInput
                                    style={styles.rangeInput}
                                    placeholder="Max"
                                    keyboardType="numeric"
                                    value={range.max}
                                    onChangeText={(text) => handleChange(`${key}.max`, text)}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete Plant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 16 },
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
    imagePickerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    imagePlaceholder: {
        width: 160,
        height: 160,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    imagePlaceholderText: { fontSize: 14, color: 'gray', marginTop: 8 },
    imagePreviewContainer: {
        position: 'relative',
        width: 160,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    removeImageButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    imageInput: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        fontSize: 14,
    },
    inputGroup: { marginBottom: 16 },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    input: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
    },
    cardTitle: { fontWeight: '600', fontSize: 16, marginBottom: 12 },
    rangeInputContainer: { flexDirection: 'row', gap: 8 },
    rangeInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
    },
    buttonContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    deleteButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#62C370',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '500' },
});

export default EditPlantScreen;
