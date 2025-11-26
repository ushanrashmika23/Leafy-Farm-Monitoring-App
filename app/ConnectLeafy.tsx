import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plug, PlugZap, RefreshCcw } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Device {
    id: string;
    name: string;
    image: string;
    connected: boolean;
}

const mockDevices: Device[] = [
    {
        id: '1',
        name: 'Leafy Sensor 01',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/017/773/678/small_2x/device-3d-illustration-png.png',
        connected: true,
    },
    {
        id: '2',
        name: 'GreenBox Pro',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/017/773/678/small_2x/device-3d-illustration-png.png',
        connected: false,
    },
];

const RecoveredDevicesScreen: React.FC = () => {
    const navigation = useNavigation();
    const [devices, setDevices] = useState<Device[]>(mockDevices);

    const handleToggleConnection = (id: string) => {
        setDevices((prev) =>
            prev.map((device) =>
                device.id === id ? { ...device, connected: !device.connected } : device
            )
        );
    };

    const handleRescan = () => {
        // Logic to rescan devices
        // console.log('Rescanning...');
    };

    return (

        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recovered Devices</Text>
            </View>

            <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
                <RefreshCcw size={18} color="white" />
                <Text style={styles.rescanButtonText}>Rescan</Text>
            </TouchableOpacity>

            {devices.map((device) => (
                <View key={device.id} style={styles.deviceCard}>
                    <Image source={{ uri: device.image }} style={styles.deviceImage} />
                    <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <Text style={[styles.deviceStatus, { color: device.connected ? '#62C370' : 'gray' }]}>
                            {device.connected ? 'Connected' : 'Disconnected'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.connectionButton,
                            {
                                backgroundColor: device.connected ? '#F87171' : '#62C370',
                            },
                        ]}
                        onPress={() => handleToggleConnection(device.id)}
                    >
                        {device.connected ? (
                            <Plug size={16} color="white" />
                        ) : (
                            <PlugZap size={16} color="white" />
                        )}
                        <Text style={styles.connectionButtonText}>
                            {device.connected ? 'Disconnect' : 'Connect'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
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
    rescanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#62C370',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 9999,
        alignSelf: 'flex-start',
        gap: 8,
        marginBottom: 24,
    },
    rescanButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    deviceImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
    },
    deviceStatus: {
        fontSize: 12,
        marginTop: 4,
    },
    connectionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 9999,
    },
    connectionButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 13,
    },
});

export default RecoveredDevicesScreen;
