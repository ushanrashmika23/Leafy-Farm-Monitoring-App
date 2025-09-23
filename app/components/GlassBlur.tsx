import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface GlassBlurProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const GlassBlur: React.FC<GlassBlurProps> = ({ children, style }) => (
    <BlurView intensity={40} tint="light" style={[styles.glass, style]}>
        {children}
    </BlurView>
);

const styles = StyleSheet.create({
    glass: {
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 16,
        overflow: 'hidden',
    },
});

export default GlassBlur;
