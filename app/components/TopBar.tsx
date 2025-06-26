import { Wifi } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../const/Color';

export default function TopBar() {
    return (
        <View style={styles.container}>
            <Image source={require('./../../assets/avatar.jpeg')} style={styles.avatar} />
            <View style={styles.center}>
                <Text style={styles.greeting}>Hi Rashmika 👋</Text>
                <Text style={styles.sub}>Welcome back to Leafy</Text>
            </View>
            <View style={styles.statusContainer}>
                {/* <View style={styles.dot} /> */}
                <Text style={styles.statusText}>Disconnected</Text>
                <Wifi color={COLORS.danger} strokeWidth={2.5}/>
            </View>
        </View>
    );
}

{/* <Wifi color="#fff" strokeWidth={2.75} /> */}

const styles = StyleSheet.create({
    container: {
        height: 78,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
        // borderBottomWidth: 1,
        // borderBottomColor: '#E0E0E0',
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 19,
        backgroundColor: '#CCC',
    },
    center: {
        flex: 1,
        marginHorizontal: 12,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sub: {
        fontSize: 12,
        color: '#777',
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
