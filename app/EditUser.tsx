import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    Home,
    Mail,
    Phone,
    User,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from './const/Color';
import { getUserData, storeUserData, UserData } from './utils/Storage';

interface FormData {
    name: string;
    email: string;
    telephone: string;
    address: string;
}

const EditUserScreen: React.FC = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        telephone: '',
        address: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadUserData = async () => {
        try {
            const userData = await getUserData();
            if (userData) {
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    telephone: userData.telephone || '',
                    address: userData.address || '',
                });
            }
        } catch (error) {
            console.log('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleChange = (key: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const userData: UserData = {
                name: formData.name,
                email: formData.email,
                telephone: formData.telephone,
                address: formData.address,
                isFirstTime: false,
            };
            
            await storeUserData(userData);
            Alert.alert(
                'Success',
                'Your profile has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log('Error saving user data:', error);
            Alert.alert('Error', 'Failed to save your changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
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
                    <Image source={require('./../assets/avatar.jpeg')} style={styles.avatar} />
                </View>
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
                            value={formData.telephone}
                            onChangeText={(text) => handleChange('telephone', text)}
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

            <TouchableOpacity 
                style={[styles.submitButton, (isLoading || isSaving) && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                disabled={isLoading || isSaving}
            >
                <Text style={styles.submitButtonText}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
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
    submitButtonDisabled: {
        backgroundColor: COLORS.textSecondary,
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default EditUserScreen;
