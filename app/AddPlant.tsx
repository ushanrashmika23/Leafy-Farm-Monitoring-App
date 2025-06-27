import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ImageIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from './const/Color';

interface FormData {
    name: string;
    image: string;
    idealTemperature: { min: string; max: string };
    idealHumidity: { min: string; max: string };
    idealLight: { min: string; max: string };
    idealMoisture: { min: string; max: string };
}

const AddPlantScreen: React.FC = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        image: '',
        idealTemperature: { min: '18', max: '26' },
        idealHumidity: { min: '40', max: '60' },
        idealLight: { min: '60', max: '80' },
        idealMoisture: { min: '40', max: '60' },
    });

    const handleChange = (name: string, value: string) => {
        if (name.includes('.')) {
            const [field, subfield] = name.split('.') as [keyof FormData, string];
            setFormData((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field] as object,
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

    const handleSubmit = () => {
        console.log('Plant data:', formData);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Plant</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.imagePickerContainer}>
                    {formData.image ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => handleChange('image', '')}
                            >
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
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Ideal Growing Conditions</Text>

                {[
                    { label: 'Temperature Range (°C)', field: 'idealTemperature' },
                    { label: 'Humidity Range (%)', field: 'idealHumidity' },
                    { label: 'Light Intensity Range (%)', field: 'idealLight' },
                    { label: 'Soil Moisture Range (%)', field: 'idealMoisture' },
                ].map(({ label, field }) => (
                    <View key={field} style={styles.inputGroup}>
                        <Text style={styles.label}>{label}</Text>
                        <View style={styles.rangeInputContainer}>
                            <TextInput
                                style={styles.rangeInput}
                                placeholder="Min"
                                keyboardType="numeric"
                                value={(formData as any)[field].min}
                                onChangeText={(text) => handleChange(`${field}.min`, text)}
                            />
                            <TextInput
                                style={styles.rangeInput}
                                placeholder="Max"
                                keyboardType="numeric"
                                value={(formData as any)[field].max}
                                onChangeText={(text) => handleChange(`${field}.max`, text)}
                            />
                        </View>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add Plant</Text>
            </TouchableOpacity>
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
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 24,
    },
    imagePickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    imagePlaceholder: {
        width: 160,
        height: 160,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    imagePlaceholderText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 8,
    },
    imagePreviewContainer: {
        position: 'relative',
        width: 160,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: COLORS.white,
        padding: 4,
        borderRadius: 9999,
        shadowColor: COLORS.black,
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
        borderColor: COLORS.border,
        borderRadius: 8,
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 4,
    },
    input: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 12,
    },
    rangeInputContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    rangeInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        marginBottom: 24,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddPlantScreen;
