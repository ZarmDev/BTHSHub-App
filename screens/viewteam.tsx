import { styles } from '@/constants/styles';
import { getTeamAnnouncements } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Divider, Menu, Surface, Text } from 'react-native-paper';


interface Announcement {
    content: string;
    created_at: string;
    owner: string;
}

export default function ViewTeam(props: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    async function getAnnoucements() {
        const res = await getTeamAnnouncements(props.selectedTeamName, props.token);
        // console.log(res.data, props.selectedTeamName, props.token);
        try {
            const parsedData = JSON.parse(res.data);
            setAnnouncements(parsedData);
        } catch (error) {
            console.error("Failed to parse announcements:", error);
        }
    }

    useEffect(() => {
        getAnnoucements();
    }, [props.selectedTeamName])

    // Format timestamp to readable date
    const formatDate = (timestamp: string) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const renderAnnouncement = ({ item }: { item: Announcement }) => (
        <Surface style={announcementStyles.card} elevation={1}>
            <Text style={announcementStyles.content}>{item.content}</Text>
            <View style={announcementStyles.footer}>
                <Text style={announcementStyles.owner}>Posted by: {item.owner}</Text>
                <Text style={announcementStyles.date}>{formatDate(item.created_at)}</Text>
            </View>
        </Surface>
    );

    return (
        <View style={{height: "70%"}}>
            <View>
                <Text style={styles.header}>{props.selectedTeamName}</Text>
                <Button mode="contained" style={styles.button} onPress={props.parentCallback}>
                    Explore teams
                </Button>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button mode="contained" style={styles.button} onPress={() => setMenuVisible(true)}>
                            Select Team
                        </Button>
                    }
                >
                    {props.teams?.map((team: string, idx: number) => (
                        <Menu.Item
                            key={team}
                            onPress={() => {
                                props.onSelectTeam(team);
                                setMenuVisible(false);
                            }}
                            title={team}
                        />
                    ))}
                </Menu>

                <Divider style={{ width: '100%', marginVertical: 10 }} />

                <Text style={styles.header2}>Team Announcements</Text>

                {announcements.length > 0 ? (
                    <FlatList
                        data={announcements}
                        renderItem={renderAnnouncement}
                        keyExtractor={(item, index) => index.toString()}
                        style={announcementStyles.list}
                    />
                ) : (
                    <Text>No announcements for this team yet.</Text>
                )}
            </View></View>
    );
}

const announcementStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    list: {
        width: '150%'
    },
    card: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    content: {
        fontSize: 16,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    owner: {
        fontSize: 12,
        color: '#666',
    },
    date: {
        fontSize: 12,
        color: '#666',
    }
});