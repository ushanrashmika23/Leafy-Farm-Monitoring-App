import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const NotificationSettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [emailNotif, setEmailNotif] = useState(true);
    const [popupNotif, setPopupNotif] = useState(true);

    const handleSave = () => {
        console.log('Notification Settings:', {
            email: emailNotif,
            popup: popupNotif,
        });
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.settingRow}>
                    <Mail size={20} color="gray" />
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Switch
                        value={emailNotif}
                        onValueChange={setEmailNotif}
                        thumbColor={emailNotif ? '#62C370' : '#ccc'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Bell size={20} color="gray" />
                    <Text style={styles.settingLabel}>Popup Notifications</Text>
                    <Switch
                        value={popupNotif}
                        onValueChange={setPopupNotif}
                        thumbColor={popupNotif ? '#62C370' : '#ccc'}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
        marginBottom: 22,
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    settingLabel: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    saveButton: {
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
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default NotificationSettingsScreen;
