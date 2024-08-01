/*
// Created by Muhammad Muneeb on 11/08/2023.
// Company: Codistan Pvt ltd.
//
// Current developer:  Muhammad Muneeb
// Edited by : [if any]
//
// Reference: [if any]
*/

// Centralized error management
// In this file, you can handle all your errors. Here's an example of how to handle errors received from the API.

// Example code snippet:
// This function handles the errors received from the API and centralizes the error management process.
// You can use this approach to maintain consistent error handling throughout your application.

// Usage example:
// This code snippet serves as an illustrative example to demonstrate how to utilize the `ErrorHandler` function in your code. It showcases the proper way to incorporate the `ErrorHandler` function for managing errors in your application.
// try {
//      Call API
//   } catch (error) {
//      Pass the error to the error handling function
//     ErrorHandler(error);
//   }

import { Alert } from 'react-native';

export const ErrorHandler = (error: any) => {
  if (error?.message === 'Network Error') {
    // You can use Toast as per UI requirement
    return Alert.alert('Project Name', 'Please check your internet try again');
  }
};
