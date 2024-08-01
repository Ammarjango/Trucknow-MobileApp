/**
 * @format
 */
//reanimated ios latest and android 2.17.0
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
