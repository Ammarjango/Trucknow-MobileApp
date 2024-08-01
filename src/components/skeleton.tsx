import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomSkeletonHolder} from './skeletonPlaceHolder';
import Feather from 'react-native-vector-icons/Feather';
import {getResponsiveSize, responsiveFontSize} from '../utils';
import Colors from '../assets/colors/Colors';
import {FlatList} from 'react-native-gesture-handler';

export default Skeleton = ({type = '', count = 1}) => {
  const arr = [];
  for (let index = 0; index < count; index++) {
    arr.push(index);
  }

  const renderTrucks = ({item, index}) => {
    return (
      <View key={index} style={styles.mapContainer}>
        <View style={styles.truckContainerSkeleton}>
          <CustomSkeletonHolder placeHolserStyle={styles.truckImage} />
        </View>
        <View style={[styles.horizontalLine, styles.widthAndMargin]} />
        <View style={styles.imgDescriptionContainer}>
          <View style={styles.widthAndGap}>
            <CustomSkeletonHolder placeHolserStyle={styles.skeletonsmallTxt} />
            <CustomSkeletonHolder
              placeHolserStyle={styles.skeletonLengthyTxt}
            />
          </View>
          <View style={styles.widthStyle}>
            <Feather
              name="plus-square"
              style={[styles.plusIconStyle, styles.lightGreyStyle]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {type === 'truck' && (
        <>
          <FlatList
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            style={{flex: 1}}
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            data={arr}
            renderItem={renderTrucks}
            ItemSeparatorComponent={() => (
              <View style={{height: getResponsiveSize(2).height}} />
            )}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: Colors.mediumGrayClor,
    borderBottomWidth: 0.7,
    width: '95%',
    alignSelf: 'center',
    marginBottom: getResponsiveSize(1).height,
  },

  lightGreyStyle: {
    color: Colors.lightGreyColor,
  },

  widthAndMargin: {
    width: '100%',
    marginBottom: 0,
  },

  widthStyle: {
    width: '20%',
    alignItems: 'flex-end',
  },

  plusIconStyle: {
    fontSize: responsiveFontSize(25),
    color: Colors.lightPrimaryColor,
  },

  mapContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: getResponsiveSize(3).width,
    width: '48%',
  },
  truckContainerSkeleton: {
    height: getResponsiveSize(15).height,
  },
  truckImage: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'silver',
  },
  imgDescriptionContainer: {
    flexDirection: 'row',
    padding: getResponsiveSize(2).width,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  widthAndGap: {
    width: '80%',
    gap: responsiveFontSize(5),
  },
  skeletonsmallTxt: {
    width: getResponsiveSize(20).width,
    height: getResponsiveSize(3).height,
  },
  skeletonLengthyTxt: {
    width: getResponsiveSize(30).width,
    height: getResponsiveSize(3).height,
  },
});
