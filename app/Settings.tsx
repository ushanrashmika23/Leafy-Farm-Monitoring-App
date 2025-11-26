import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronRight,
    Eraser,
    HelpCircle,
    Leaf,
    Pencil,
    PlusCircle,
    User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from './const/Color';
import { getUserData, UserData } from './utils/Storage';
import { baseApiUrl } from './utils/Utils';

type Plant = {
    _id: string;
    name: string;
    image: string;
    days: number;
    temperature?: number[];
    humidity?: number[];
    soilMoisture?: number[];
    sunLight?: number[];
};

type SettingItem = {
    icon: React.FC<{ size?: number; color?: string }>;
    label: string;
    color: string;
    screen: string;
};

const SettingsScreen: React.FC = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [plants, setPlants] = useState<Plant[]>([]);

    const loadUserData = async () => {
        try {
            const data = await getUserData();
            setUserData(data);
        } catch (error) {
            // console.log('Error loading user data:', error);
        }
    };

    const loadPlants = async () => {
        try {
            // console.log("Fetching all plants from API...");
            const response = await fetch(`${baseApiUrl}/userplants/all`);
            const data = await response.json();
            
            if (data?.data?.plants) {
                setPlants(data.data.plants);
            }
        } catch (error) {
            // console.log("Error fetching plants:", error);
        }
    };

    useEffect(() => {
        loadUserData();
        loadPlants();
    }, []);

    const settingsItems: SettingItem[] = [
        { icon: PlusCircle, label: 'Add New Plant', color: '#62C370', screen: 'AddPlant' },
        // { icon: Router, label: 'Connect Lefy', color: '#EC4899', screen: 'ConnectLeafy' },
        { icon: User, label: 'Edit User Data', color: '#4299E1', screen: 'EditUser' },
        { icon: Bell, label: 'Notifications', color: '#F59E0B', screen: 'NotificationType' },
        // { icon: HelpCircle, label: 'Help & Support', color: '#8B5CF6', screen: 'HelpSupport' },
        { icon: HelpCircle, label: 'Help & Support', color: '#EC4899', screen: 'HelpSupport' },
        { icon: Eraser, label: 'Erase All Data', color: '#EF4444', screen: 'EraseAllData' },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity onPress={() => router.push('/EditUser' as any)}>
                    <View style={styles.accountCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('./../assets/avatar.jpeg')}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.accountInfo}>
                            <Text style={styles.accountName}>{userData?.name || 'User'}</Text>
                            <Text style={styles.accountEmail}>{userData?.email || 'user@example.com'}</Text>
                        </View>
                        <ChevronRight size={20} color="gray" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Options</Text>
                <View style={styles.optionsContainer}>
                    {settingsItems.map((item, index) => {
                        const IconComp = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push(`/${item.screen}` as any)}
                                style={styles.optionItem}
                            >
                                <View style={[styles.optionIconContainer, { backgroundColor: `${item.color}20` }]}>
                                    <IconComp size={18} color={item.color} />
                                </View>
                                <Text style={styles.optionLabel}>{item.label}</Text>
                                <ChevronRight size={16} color="gray" />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={{ ...styles.section, marginBottom: 84 }}>
                <Text style={styles.sectionTitle}>My Plants</Text>
                <View style={styles.plantsContainer}>
                    {plants.map((plant) => (
                        <TouchableOpacity
                            key={plant._id}
                            onPress={() => {
                                router.push({
                                    pathname: '/EditPlant',
                                    params: {
                                        id: plant._id,
                                        name: plant.name,
                                        image: plant.image,
                                        days: plant.days?.toString() || '0',
                                        tempMin: plant.temperature?.[0]?.toString() || '20',
                                        tempMax: plant.temperature?.[1]?.toString() || '30',
                                        humidityMin: plant.humidity?.[0]?.toString() || '50',
                                        humidityMax: plant.humidity?.[1]?.toString() || '70',
                                        lightMin: plant.sunLight?.[0]?.toString() || '1000',
                                        lightMax: plant.sunLight?.[1]?.toString() || '3000',
                                        moistureMin: plant.soilMoisture?.[0]?.toString() || '40',
                                        moistureMax: plant.soilMoisture?.[1]?.toString() || '60',
                                    },
                                } as any);
                            }}
                            style={styles.plantItem}
                        >
                            <View style={styles.plantImageContainer}>
                                <Image source={{ uri: plant.image }} style={styles.plantImage} />
                            </View>
                            <View style={styles.plantInfo}>
                                <Text style={styles.plantName}>{plant.name}</Text>
                                <View style={styles.plantStatus}>
                                    <Leaf size={14} color={COLORS.primary} />
                                    <Text style={styles.plantStatusText}>Healthy</Text>
                                </View>
                            </View>
                            <View style={styles.editIconContainer}>
                                <Pencil size={16} color="gray" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 82,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        marginTop: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 12,
    },
    accountCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: 16,
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontWeight: '500',
        fontSize: 16,
    },
    accountEmail: {
        fontSize: 14,
        color: 'gray',
    },
    optionsContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    optionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionLabel: {
        flex: 1,
        fontSize: 16,
    },
    plantsContainer: {
        gap: 12,
    },
    plantItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    plantImageContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
    },
    plantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    plantInfo: {
        flex: 1,
    },
    plantName: {
        fontWeight: '500',
        fontSize: 16,
    },
    plantStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    plantStatusText: {
        fontSize: 12,
        color: 'gray',
        marginLeft: 4,
    },
    editIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SettingsScreen;
