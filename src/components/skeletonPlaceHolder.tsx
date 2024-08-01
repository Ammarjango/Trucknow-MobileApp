import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { skeletionPlaceHolderType } from '../types/AppInterfaceTypes';
export const CustomSkeletonHolder: React.FC<skeletionPlaceHolderType> = ({
    placeHolserStyle,
    borderRadius,
}) => {

    return (
        <SkeletonPlaceholder
            borderRadius={borderRadius}
        >
            <View
                style={placeHolserStyle}
            />
        </SkeletonPlaceholder>
    );
};
