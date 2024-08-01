import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from "../../../assets/colors/Colors";
import { Button } from "../../../components";
import { SmallText } from "../../../components/text";
import { IMAGES } from "../../../theme/assets";
import { getResponsiveSize, responsiveFontSize } from "../../../utils";
import { TRootStack } from "../../../types/mainStack";
type Props = NativeStackScreenProps<TRootStack, 'RegisterSelection'>;

const RegisterSelection = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={IMAGES.logo}
        style={styles.logoImg}
        resizeMode="contain"
      />
      <View>
        <Button
          title="Login as User"
          containerStyle={styles.button}
          onPress={() => navigation.navigate('Login')}
        />
        <Button
          title="Register as User"
          containerStyle={styles.button}
          onPress={() => navigation.navigate('Register')}

        />
      </View>
      <View style={styles.row}>
        <Ionicons
          name='checkmark-circle'
          color={Colors.lightPrimaryColor}
          style={styles.checkStyle} />
        <SmallText
          text="Agree with"
          style={styles.text}
          isInverted={false}
        />
        <Pressable onPress={() => { }}>
          <SmallText
            text=" Terms and Conditions"
            style={styles.terms}
            isInverted={false}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  logoImg: {
    width: getResponsiveSize(95).width,
    height: getResponsiveSize(20).height
  },
  text: {
    color: Colors.primaryColor,
    fontSize: responsiveFontSize(15),
  },
  terms: {
    color: Colors.blueColor,
    fontSize: responsiveFontSize(15),
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    alignSelf: "center",
    position: 'absolute',
    bottom: getResponsiveSize(3).height,
  },
  button: {
    marginTop: getResponsiveSize(3.5).height
  },
  checkStyle: {
    fontSize: responsiveFontSize(18),
    marginRight: getResponsiveSize(1).width
  }
});
