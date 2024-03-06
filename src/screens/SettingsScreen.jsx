import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Appbar, Button, useTheme, Text } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { version } from '../../package.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../App';
import * as API from '../utils/sidechatAPI';

function SettingsScreen({ navigation }) {
  const appState = React.useContext(AppContext);
  const { colors } = useTheme();
  const signOut = () => {
    AsyncStorage.clear().then(() => RNRestart.restart());
  };
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <StatusBar animated={true} backgroundColor={colors.elevation.level2} />
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView style={{ padding: 20 }}>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          <Text variant="headlineSmall" style={{ color: colors.primary }}>
            Offsides{' '}
          </Text>
          <Text variant="headlineSmall">version {version}</Text>
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          a third-party client for Sidechat
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 30 }}>
          User ID: {appState.userID}
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 30 }}>
          Group ID: {appState.groupID}
        </Text>
        <Button mode="contained" onPress={signOut}>
          Sign Out
        </Button>
        <Button
          mode="contained"
          onPress={() => API.setDeviceID(appState.userToken)}>
          Device ID
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            API.getUserAndGroup(appState.groupID, appState.userToken)
          }>
          Update Group & User
        </Button>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;
