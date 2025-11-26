import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const EraseAllDataScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleErase = () => {
        Alert.alert(
            'Confirm Erase',
            'Are you sure you want to erase all data? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Erase', style: 'destructive', onPress: () => {/* console.log('Data erased') */} },
            ]
        );
    };

    return (

        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Erase All Data</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.warningText}>
                    This will permanently delete all your plants, settings, and synced data from the app.
                </Text>
            </View>

            <TouchableOpacity style={styles.eraseButton} onPress={handleErase}>
                <Trash2 size={18} color="white" />
                <Text style={styles.eraseButtonText}>Erase All Data</Text>
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
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        marginBottom: 24,
    },
    warningText: {
        fontSize: 16,
        color: '#991B1B',
        fontWeight: '500',
    },
    eraseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#DC2626',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    eraseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EraseAllDataScreen;
