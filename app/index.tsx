import React from 'react';
import { StyleSheet, View } from 'react-native';
import Data from './Data';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Data />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
