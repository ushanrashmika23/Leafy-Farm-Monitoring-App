import { useNavigation } from '@react-navigation/native';
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    CheckCircle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CameraAnalysisScreen: React.FC = () => {
    const navigation = useNavigation();
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [plantCondition, setPlantCondition] = useState<string | null>(null);

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setAnalysisComplete(true);
            const conditions = ['healthy', 'needs_water', 'disease'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            setPlantCondition(randomCondition);
        }, 3000);
    };

    const getConditionDetails = () => {
        switch (plantCondition) {
            case 'healthy':
                return {
                    icon: CheckCircle,
                    color: '#62C370',
                    title: 'Healthy Plant',
                    description: 'Your plant is healthy and thriving. Keep up the good work!',
                };
            case 'needs_water':
                return {
                    icon: AlertTriangle,
                    color: '#F59E0B',
                    title: 'Needs Water',
                    description: 'Your plant appears to be dehydrated. Consider watering it soon.',
                };
            case 'disease':
                return {
                    icon: AlertTriangle,
                    color: '#EF4444',
                    title: 'Possible Disease',
                    description: 'We detected signs of a possible disease. Check the leaves for spots or discoloration.',
                };
            default:
                return null;
        }
    };

    const conditionDetails = getConditionDetails();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Camera Analysis</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cameraFeedPlaceholder}>
                    <Camera size={48} color="rgba(255,255,255,0.5)" />
                    {analyzing && (
                        <View style={styles.analysisOverlay}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    )}
                </View>

                {!analysisComplete ? (
                    <TouchableOpacity
                        onPress={handleAnalyze}
                        disabled={analyzing}
                        style={[styles.analyzeButton, analyzing ? styles.analyzeButtonDisabled : styles.analyzeButtonEnabled]}
                    >
                        <Camera size={20} color="white" />
                        <Text style={styles.analyzeButtonText}>
                            {analyzing ? 'Analyzing...' : 'Analyze Plant'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.analysisResultContainer}>
                        {conditionDetails && (
                            <View style={[styles.conditionCard, { backgroundColor: `${conditionDetails.color}20` }]}>
                                <View style={styles.conditionIconContainer}>
                                    <conditionDetails.icon size={24} color={conditionDetails.color} />
                                </View>
                                <View>
                                    <Text style={[styles.conditionTitle, { color: conditionDetails.color }]}>
                                        {conditionDetails.title}
                                    </Text>
                                    <Text style={styles.conditionDescription}>
                                        {conditionDetails.description}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={() => {
                                setAnalysisComplete(false);
                                setPlantCondition(null);
                            }}
                            style={styles.analyzeButtonEnabled}
                        >
                            <Camera size={20} color="white" />
                            <Text style={styles.analyzeButtonText}>Analyze Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom: 24,
    },
    cameraFeedPlaceholder: {
        width: '100%',
        height: 256,
        backgroundColor: '#333',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    analysisOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    analyzeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    analyzeButtonEnabled: {
        backgroundColor: '#62C370',
    },
    analyzeButtonDisabled: {
        backgroundColor: 'gray',
    },
    analyzeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    analysisResultContainer: {
        marginTop: 16,
    },
    conditionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    conditionIconContainer: {
        marginRight: 12,
    },
    conditionTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    conditionDescription: {
        fontSize: 14,
        color: '#4B5563',
    },
});

export default CameraAnalysisScreen;
