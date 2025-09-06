import { send } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import MessageBubble from './MessageBubble';

export default function ChatModal(props: any) {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<string[][]>([]);
    
    async function sendMessage() {
        const formData = new URLSearchParams();
        formData.append('groupName', props.selectedGroupName)
        formData.append('username', props.username)
        formData.append('content', text)
        const res = await send("sendMessage", formData)
        if (res?.status == 200) {
            props.refresh();
            var prevMessages = messages;
            prevMessages.push([props.username, text])
            setMessages(prevMessages)
            setText("");
        }
    }

    useEffect(() => {
        setMessages(props.selectedGroupData["chat"])
    }, [])

    const items = messages.map((item: any, idx: number) => (<View>
        <View key={idx} style={{
            margin: 20
        }}>
            <MessageBubble message={item[1]} isSender={true} sender={item[0]}></MessageBubble>
        </View>
    </View>))
    return (
        <ScrollView>
            {items}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 20
            }}>
                <TextInput
                    label="Message"
                    value={text}
                    onChangeText={text => setText(text)}
                    style={{width: 200}}
                />
                <IconButton
                    mode="contained-tonal"
                    icon="arrow-right-drop-circle"
                    onPress={sendMessage}
                />
            </View>
        </ScrollView>
    );
}