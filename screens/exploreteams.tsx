import { styles } from '@/constants/styles';
import { addUserToTeam, getAllTeams } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ExploreTeams(props: any) {
    const [teams, setTeams] = useState([]);

    async function loadTeams() {
        const res = await getAllTeams(props.token);
        if (res.data != "Unauthorized") {
            setTeams(JSON.parse(res.data));
        }
    }

    async function joinTeam(name: string) {
        console.log('crap')
        const res = await addUserToTeam(name, props.token);
        if (res.data != "Unauthorized") {
            setTeams(JSON.parse(res.data));
        }
        console.log(res.data)
    }

    useEffect(() => {
        loadTeams();
    }, [])

    return (
        <View>
            <Button mode="contained-tonal"onPress={props.parentCallback}>Go back</Button>
            {teams.length == 0 ? <Text>Unable to load teams, something went wrong... (or no teams exist)</Text> : teams.map((name, idx) => (
                <View key={idx} style={styles.teamItem}>
                    {/* <Image
                            source={require('@/assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        /> */}
                    <Text>{name}</Text>
                    <Button mode="contained" style={styles.inlineButton} onPress={() => { joinTeam(name) }}>Join team</Button>
                </View>
            ))}
        </View>
    );
}