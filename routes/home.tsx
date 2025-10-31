import { styles } from '@/constants/styles';
import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

export default function Home(props: any) {
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: "5%", marginLeft: "1%"}}>
                <Text>{props.username}</Text>
                <Button mode="contained-tonal" style={styles.inlineButton}>View profile</Button>
                <Icon size={20} source="cog"></Icon>
            </View>
            <Text style={styles.header2}>Upcoming events</Text>
        </View>
    )
}