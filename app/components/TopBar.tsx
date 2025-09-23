import { Wifi, WifiOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../const/Color';
import { baseApiUrl } from '../utils/Utils';

export default function TopBar() {
    const [isConnected, setIsConnected] = useState(false);

    const checkConnectionStatus = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            try {
                const response = await fetch(`${baseApiUrl}/test`, {
                    method: 'GET',
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        } catch (error) {
            console.log('Connection check failed:', error);
            setIsConnected(false);
        }
    };

    useEffect(() => {
        // Check connection status immediately
        checkConnectionStatus();
        
        // Check connection status every 5 seconds
        const interval = setInterval(checkConnectionStatus, 5000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/avatar.jpeg')} style={styles.avatar} />
            <View style={styles.center}>
                <Text style={styles.greeting}>Hi Rashmika 👋</Text>
                <Text style={styles.sub}>Welcome back to Leafy</Text>
            </View>
            <View style={styles.statusContainer}>
                {/* Show connection status based on isConnected */}
                {isConnected ? (
                    <>
                        <Text style={{ ...styles.statusText, color: COLORS.primary }}>Connected</Text>
                        <Wifi color={COLORS.primary} strokeWidth={2.5} />
                    </>
                ) : (
                    <>
                        <Text style={styles.statusText}>Disconnected</Text>
                        <WifiOff color={COLORS.danger} strokeWidth={2.75} />
                    </>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 78,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 19,
    },
    center: {
        flex: 1,
        marginHorizontal: 12,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    sub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'green',
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: COLORS.danger,
        fontWeight: '700',
        marginRight: 10,
    },
});
