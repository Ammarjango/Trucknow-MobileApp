import React, { useContext, useRef, useState, useEffect } from 'react';
import { Keyboard, TextInput, View, StyleSheet } from 'react-native';
import { getResponsiveSize, responsiveFontSize } from '../utils';
import FONTS from '../assets/fonts/FONTS';
import Colors from '../assets/colors/Colors';

const CustomOTPInput = (props) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    const handleOTPChange = (text, index) => {
        console.log(index, text)

        if (text.length === 1 && index < 3) {
            console.log('inside first')
            // Automatically focus the next input field
            inputRefs.current[index + 1].focus();
        } else if (text.length === 0 && index > 0) {
            console.log('inside second')

            // Handle backspace key press: delete the current digit and focus the previous input field
            const updatedOTP = [...otp];
            updatedOTP[index] = '';
            setOtp(updatedOTP);

            inputRefs.current[index - 1].focus();

        } else if (index < 3) {
            console.log('inside third')

            // Handle keyboard dismiss when otp code completes
            console.log('4 is not empty but pressed on input')
        } else if (text.length != 0 && index < 3) {
            console.log('inside fourth')

        }
        else if (text.length === 1 && index === 3) {
            console.log('inside fifth')

            // Handle keyboard dismiss when otp code completes
            Keyboard.dismiss();
        }
        console.log('inside fifth')

        const updatedOTP = [...otp];
        updatedOTP[index] = text;
        setOtp(updatedOTP);

        // otpCodeContext = updatedOTP;

    };


    // const handleOTPChange = (text: any, index: number) => {
    //     console.log('index, text', index, text)

    //     if (text.length === 1 && index < 3) {
    //         // Automatically focus the next input field
    //         inputRefs.current[index + 1].focus();
    //     } else if (text.length === 0 && index > 0) {
    //         // Handle backspace key press: delete the current digit and focus the previous input field
    //         const updatedOTP = [...otp];
    //         updatedOTP[index] = '';
    //         setOtp(updatedOTP);

    //         inputRefs.current[index - 1].focus();

    //     } else if (index < 3) {
    //         // Handle keyboard dismiss when otp code completes
    //         console.log('3 is not empty but pressed on input')
    //     } else if (text.length != 0 && index < 3) {

    //     }
    //     else if (text.length === 1 && index === 3) {
    //         // Handle keyboard dismiss when otp code completes
    //         Keyboard.dismiss();
    //     }

    //     const updatedOTP = [...otp];
    //     updatedOTP[index] = text;
    //     setOtp(updatedOTP);

    //     // setSharedValue(updatedOTP)
    //     // otpCodeContext = updatedOTP;

    // };

    return (
        <View style={styles.container}>
            {otp.map((digit, index) => (
                <TextInput
                    key={index}
                    underlineColorAndroid={Colors.darkGreyColor}
                    style={styles.input}
                    onChangeText={(text) => {
                        {
                            handleOTPChange(text, index)
                        }
                    }}
                    // caretHidden
                    onKeyPress={(text) => {
                        console.log('onKeyPress')
                        if ((digit !== '') && (index !== 0)) {
                            console.log('onKeyPress first')
                            if (index !== 0) {
                                inputRefs?.current[index - 1]?.focus();
                            } else {
                                inputRefs?.current[index + 1]?.focus();
                            }

                        } else {
                            console.log('onKeyPress second')

                            inputRefs?.current[index - 1]?.focus();
                        }
                    }}
                    autoFocus={index === 0}
                    onFocus={() => {
                        // const trimmedDigit = digit.trim();
                        // const updatedOTP = [...otp];
                        // updatedOTP[index] = trimmedDigit;
                        // setOtp(updatedOTP);
                        inputRefs?.current[index - 1]?.focus();
                    }}
                    value={digit}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={(input) => {
                        inputRefs.current[index] = input;
                    }}
                />
            ))}
        </View>
    );
};


export default CustomOTPInput;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'red'
    },
    input: {
        width: getResponsiveSize(10).width,
        height: getResponsiveSize(10).height,
        borderRadius: 5,
        fontSize: responsiveFontSize(16),
        textAlign: 'center',
        // color: Colors.,
        fontFamily: FONTS.MONTSERRAT_Regular,
        borderWidth: 2,
        borderColor: 'white',

    },
});

