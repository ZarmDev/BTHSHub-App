import { styles } from '@/constants/styles';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function TeamModal(props: any) {
    const [eventText, setEventText] = useState("");

    async function createTeam() {
    }

    return (
        <View>
            <Text style={styles.header}>Create a group</Text>
            <TextInput
                style={styles.textInput}
                label="Group name"
                value={eventText}
                onChangeText={text => setEventText(text)}
            />
            <Button mode="contained" onPress={createTeam} style={styles.modalButton}>
                Create group
            </Button>
        </View>
    );
}