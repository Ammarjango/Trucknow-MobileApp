import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated } from 'react-native';

const AnimatedComponent = forwardRef(({ children }: any, ref) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const animateView = () => {
        Animated.sequence([
            Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: false }),
            Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: false }),
            Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: false }),
        ]).start();
    };

    useImperativeHandle(ref, () => ({
        animateView: animateView
    }));

    return (
        <Animated.View style={{ transform: [{ translateX: animatedValue }] }}>
            {children}
        </Animated.View>
    );
});

export default AnimatedComponent;
