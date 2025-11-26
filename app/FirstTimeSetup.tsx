import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from './const/Color';
import { storeUserData, UserData } from './utils/Storage';

interface FirstTimeSetupProps {
    onComplete: () => void;
}

export default function FirstTimeSetup({ onComplete }: FirstTimeSetupProps) {
    const [formData, setFormData] = useState<UserData>({
        name: '',
        email: '',
        telephone: '',
        address: '',
        isFirstTime: false
    });

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        if (!formData.telephone.trim()) {
            Alert.alert('Error', 'Please enter your telephone number');
            return false;
        }
        if (!formData.address.trim()) {
            Alert.alert('Error', 'Please enter your address');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await storeUserData({ ...formData, isFirstTime: false });
            // Direct navigation to home screen without confirmation
            onComplete();
        } catch (error) {
            Alert.alert('Error', 'Failed to save your information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof UserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to Leafy Farm!</Text>
                    <Text style={styles.subtitle}>Please fill in your details to get started</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChangeText={(text) => updateField('name', text)}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telephone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your telephone number"
                            value={formData.telephone}
                            onChangeText={(text) => updateField('telephone', text)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.addressInput]}
                            placeholder="Enter your address"
                            value={formData.address}
                            onChangeText={(text) => updateField('address', text)}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Saving...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 100,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addressInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 100,
        padding: 16,
        alignItems: 'center',
        marginTop: 30,
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.textSecondary,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
});