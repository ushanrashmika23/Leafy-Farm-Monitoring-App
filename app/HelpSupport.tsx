import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, FileText, HelpCircle, Mail, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const HelpAndSupportScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleSelect = (item: string) => {
        console.log('Selected:', item);
        // You can navigate or show info here
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
            </View>

            <View style={styles.card}>
                <TouchableOpacity style={styles.item} onPress={() => handleSelect('FAQ')}>
                    <HelpCircle size={20} color="#62C370" />
                    <Text style={styles.itemText}>Frequently Asked Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => handleSelect('Contact')}>
                    <Mail size={20} color="#62C370" />
                    <Text style={styles.itemText}>Contact Support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => handleSelect('Terms')}>
                    <FileText size={20} color="#62C370" />
                    <Text style={styles.itemText}>Terms & Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => handleSelect('Privacy')}>
                    <ShieldCheck size={20} color="#62C370" />
                    <Text style={styles.itemText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6', // gray-100
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
});

export default HelpAndSupportScreen;
