import { styles } from '@/constants/styles';
import { send } from '@/utils/utils';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ShowEventModal(props: any) {
    // may modify wrong event if idx is not same as server... but I don't really care because
    // it's a hackathon, just force refresh every second
    async function joinEvent(idx: number) {
        const formData = new URLSearchParams();
        formData.append('groupName', props.selectedGroupName)
        formData.append('idx', String(idx));
        send("joinEvent", formData)
        props.setModalVisibleCallback(false);
        props.refresh();
    }

    var items = <Text style={{ textAlign: "center" }}>No events found...</Text>
    console.log(props.selectedGroupData)
    if (props.selectedGroupData["currentevents"].length > 0) {
        items = props.selectedGroupData["currentevents"].map((place: any, idx: number) => (<View>
            <View key={idx} style={{
                flexDirection: "row",
                alignItems: "center",
            }}>
                <Text style={{ marginRight: 12 }}>
                    {place["title"]} ({place["participants"]} participants)
                </Text>
                <Button
                    style={styles.button}
                    mode="contained-tonal"
                    onPress={() => { props.showMapCallback(idx) }}
                >
                    See on map
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => { joinEvent(idx) }}
                >
                    Join event
                </Button>
            </View>
            <Text key={idx+"2"} style={{ marginLeft: 12 }}>Created by {place["owner"]}</Text>
        </View>));
    }

    return (
        <View>
            <Text style={styles.header}>Current events for {props.selectedGroupName}</Text>
            {items}
        </View>
    );
}