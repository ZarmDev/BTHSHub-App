// GENERATED USING AI

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

const MessageBubble = (props : any) => {
  return (
    <View style={[styles.container, props.isSender ? styles.rightAlign : styles.leftAlign]}>
      <Surface style={[styles.bubble, props.isSender ? styles.sender : styles.receiver]}>
        <Text>{props.message}</Text>
      </Surface>
      <Text style={[styles.senderName, props.isSender ? styles.rightText : styles.leftText]}>
        {props.sender}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 10,
    maxWidth: '75%',
  },
  rightAlign: {
    alignSelf: 'flex-end',
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sender: {
    backgroundColor: '#DCF8C6',
  },
  receiver: {
    backgroundColor: '#FFFFFF',
  },
  senderName: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  rightText: {
    textAlign: 'right',
  },
  leftText: {
    textAlign: 'left',
  },
});


export default MessageBubble;
