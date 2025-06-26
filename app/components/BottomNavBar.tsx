import { usePathname, useRouter } from 'expo-router';
import { ChartNoAxesColumnIncreasing, House, Settings } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../const/Color';


const BottomNav = () => {

    const tabs = [
        { name: 'Statistics', label: 'Stats', icon: ChartNoAxesColumnIncreasing },
        { name: 'Home', label: 'Home', icon: House },
        { name: 'Settings', label: 'Settings', icon: Settings },
    ];
    const router = useRouter();
    const pathname = usePathname();

    // Set Home as default selection if no tab matches
    const getActiveTab = () => {
        const found = tabs.find(tab => pathname === `/${tab.name}`);
        return found ? found.name : 'Home';
    };
    const activeTabName = getActiveTab();

    return (
        <View style={styles.wrapper} >
            <View style={styles.navbar}>
                {
                    tabs.map((tab) => {
                        const isActive = activeTabName === tab.name;
                        const IconComponent = tab.icon;
                        return (
                            <TouchableOpacity
                                key={tab.name}
                                onPress={() => router.push(('/' + tab.name) as any)}
                                style={[
                                    styles.tab,
                                    isActive ? styles.activeTab : null,
                                ].filter(Boolean)}
                            >
                                <IconComponent color={isActive ? COLORS.primary : COLORS.text} />
                                <Text style={[
                                    styles.label,
                                    isActive ? { color: COLORS.primary } : null,
                                ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
        zIndex: 99,
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        paddingVertical: 30,
        width: Dimensions.get('window').width * 0.9,
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    tab: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 14,
        color: '#222',
        marginTop: 4,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: COLORS.primary,
    },
});

export default BottomNav;
