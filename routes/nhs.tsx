import { styles } from '@/constants/styles';
import { readInDocumentDirectory, writeToDocumentDirectory } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function NHS(props: any) {
    const [username, setUsername] = useState("");
    const [userData, setUserData] = useState<string[]>([]);

    async function getNHSData() {
        console.log('wtf')
        const req = await fetch("https://raw.githubusercontent.com/BTHS-NHS-Secretaries/bthsnhs.org/refs/heads/main/members.csv")
        const text = await req.text();
        const userIdx = text.indexOf(username);
        if (userIdx == -1) {
            return;
        }
        const data = text.slice(userIdx, text.indexOf("\n", userIdx));
        setUserData(data.split(','));
        await writeToDocumentDirectory("nhsdata", `${username}`);
    }

    async function getUserData() {
        const data = await readInDocumentDirectory("nhsdata");
        if (data) {
            const split = data.split('\n')
            const username = split[0];
            setUsername(username)
        }
    }

    useEffect(() => {
        getUserData();
    }, [])

    return (
        <View style={styles.centeredView}>
            <Text style={styles.header2}>Enter your full name, this will be remembered if the login was successful</Text>
            <Text>If nothing happens, you are not in the spreadsheet.</Text>
            <TextInput
                style={styles.textInput}
                label=""
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <Button onPress={getNHSData} mode="contained">Submit</Button>

            {userData.length != 0 ? <View>
                <Text>Committee: {userData[3]}</Text>
                <Text>Class: {userData[5]}</Text>
                <Text>Prefect: {userData[6]}</Text>
                <Text>Total general points: {userData[7]}</Text>
            </View> : <></>}
        </View>
    )
}