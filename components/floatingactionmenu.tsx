// CREATED USING AI

import { send } from '@/utils/utils';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

function FloatingMenu(props : any) {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    setVisible(!visible);
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  async function createEvent() {
    const formData = new URLSearchParams();
    send("createEvent", formData)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleMenu}>
        <Text style={styles.buttonText}>Open Menu</Text>
      </TouchableOpacity>

      {visible && (
        <Animated.View style={[styles.menu, { transform: [{ translateY }], opacity: slideAnim }]}>
          <TouchableOpacity style={styles.menuItem}><Text>Create an event</Text></TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', position: "absolute", right: "5%", top: "5%" },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff' },
  menu: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    elevation: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    paddingVertical: 8,
  },
});

export default FloatingMenu;
