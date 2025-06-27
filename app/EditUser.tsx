import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    Home,
    Mail,
    Phone,
    User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from './const/Color';

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
}

const EditUserScreen: React.FC = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<FormData>({
        name: 'Rashmika',
        email: 'rashmika@example.com',
        phone: '+1 234 567 890',
        address: '123 Plant Street, Green City',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    });

    const handleChange = (key: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('User data:', formData);
        navigation.navigate('Settings' as never); // adjust as per your route type
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: formData.avatar }} style={styles.avatar} />
                </View>
                <TouchableOpacity>
                    <Text style={styles.changePictureText}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWithIcon}>
                        <User size={18} color="gray" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWithIcon}>
                        <Mail size={18} color="gray" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWithIcon}>
                        <Phone size={18} color="gray" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <View style={styles.inputWithIcon}>
                        <Home size={18} color="gray" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={formData.address}
                            onChangeText={(text) => handleChange('address', text)}
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Save Changes</Text>
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
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        overflow: 'hidden',
        marginBottom: 16,
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    changePictureText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 24,
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
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
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
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EditUserScreen;
