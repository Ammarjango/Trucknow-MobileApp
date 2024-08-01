import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../assets/colors/Colors';
import {getResponsiveSize, responsiveFontSize} from '../utils';
import {LargeText, MediumText} from './text';
import {UserImg} from './userImg';

const Header = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.row}>
      <View style={styles.welcometxtView}>
        <UserImg
          imageContainer={styles.imgContainer}
          skeletonStyle={styles.profileSkeleton}
          onPressImg={() => {
            navigation.navigate('UserAccount');
          }}
        />
        <TouchableOpacity
          disabled
          activeOpacity={0.7}
          onPress={() => navigation.navigate('UserAccount')}>
          <MediumText text="Welcome," />
          <LargeText text="Hello!" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.iconsContainer}
        onPress={() => {
          navigation.navigate('MenuScreen');
        }}>
        <Feather
          name="menu"
          color={Colors?.primaryColor}
          size={25}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginVertical: getResponsiveSize(1).height,
    backgroundColor: Colors.blackColor,
    alignItems: 'center',
  },
  icon: {},
  welcometxtView: {
    width: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: responsiveFontSize(10),
  },
  imgContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  iconsContainer: {
    width: 43,
    height: 43,
    borderRadius: 43 / 2,
    backgroundColor: Colors.mediumGrayClor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSkeleton: {
    height: '100%',
    width: '100%',
  },
});
