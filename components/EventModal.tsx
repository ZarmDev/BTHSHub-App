import GooglePlacesInput from '@/components/GooglePlacesInput';
import { styles } from '@/constants/styles';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { send } from '../utils/utils';

export default function EventModal(props: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventLocation, setEventLocation] = useState<object>();

    async function createEvent() {
        const formData = new URLSearchParams();
        formData.append('groupName', props.selectedGroupName)
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', JSON.stringify(eventLocation));
        formData.append("username", props.username);
        formData.append("password", props.password);
        await send("createEvent", formData)
        props.setModalVisibleCallback(false);
        props.refresh();
    }

    return (
        <View>
            <Text style={styles.header}>Create an event for {props.selectedGroupDataName}</Text>
            <TextInput
                style={styles.textInput}
                label="Event name"
                value={title}
                onChangeText={text => setTitle(text)}
            />
            {/* <TextInput
                style={styles.textInput}
                label="Event description"
                value={description}
                onChangeText={text => setDescription(text)}
            /> */}
            <Text style={styles.header2}>Choose the event location:</Text>
            <GooglePlacesInput setEventLocation={setEventLocation} />
            <Button mode="contained" onPress={createEvent} style={styles.modalButton}>
                Create event
            </Button>
        </View>
    );
}