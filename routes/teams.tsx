import ChatModal from '@/components/ChatModal';
import EventModal from '@/components/EventModal';
import ShowEventModal from '@/components/ShowEventModal';
import TeamModal from '@/components/TeamModal';
import { styles } from '@/constants/styles';
import ExploreTeams from '@/screens/exploreteams';
import ViewTeam from '@/screens/viewteam';
import { getUserTeams, readInDocumentDirectory, writeToDocumentDirectory } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, useColorScheme, View } from 'react-native';
import { Text } from 'react-native-paper';

const order = [EventModal, TeamModal, ShowEventModal, ChatModal];

enum STATE {
    NONE,
    EXPLORETEAMS,
    LOADTEAM
}

function Teams(props: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(0);
    const [state, setState] = useState<STATE>(STATE.NONE);
    const [teams, setTeams] = useState<Array<string>>([]);
    // const [selectedTeamData, setSelectedTeamData] = useState<string>();
    const [selectedTeamName, setSelectedTeamName] = useState<string>("No team selected...");
    
    const colorScheme = useColorScheme();

    async function updateTeams() {
        const req = await getUserTeams(props.token);
        if (req.data == "Unauthorized") {
            return;
        }
        // Expect an array
        const teams = JSON.parse(req.data);
        if (teams.length != 0) {
            const data = await readInDocumentDirectory("team");
            if (data) {
                const split = data.split('\n');
                const teamToLoad = split[0];
                setSelectedTeamName(teamToLoad);
            } else {
                if (teams.length != 0) {
                    await writeToDocumentDirectory("team", teams[0]);
                }
            }
            setState(STATE.LOADTEAM)
        }
        setTeams(teams)
    }

    async function joinTeam() {

    }

    useEffect(() => {
        if (state == STATE.NONE || state == STATE.LOADTEAM) {
            updateTeams();
        }
    }, [props.isActive, state]);

    const ModalComponent = order[modalType];
    var screenToShow = null;
    switch (state) {
        case STATE.EXPLORETEAMS:
            screenToShow = <ExploreTeams token={props.token} parentCallback={() => {setState(STATE.LOADTEAM)}}/>
            break;
        case STATE.LOADTEAM:
            screenToShow = <ViewTeam token={props.token} teams={teams} parentCallback={() => {setState(STATE.EXPLORETEAMS)}} selectedTeamName={selectedTeamName} changeTeam={(teamName : string) => {setSelectedTeamName(teamName)}}></ViewTeam>
    }

    return (
        <View>
            <Text style={styles.header}>Teams</Text>
            {screenToShow}

            {/* <Button mode="contained" onPress={createTeamModal} style={styles.button}>
                Create a team (only for moderators)
            </Button>
            <Button mode="contained" onPress={joinTeam} style={styles.button}>
                Join a team
            </Button>
            <Button mode="contained" onPress={updateTeams} style={styles.button}>
                Refresh
            </Button> */}
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={[
                    styles.modalView2,
                    colorScheme === 'dark' ? { "backgroundColor": "#342E35" } : { "backgroundColor": "white" }
                ]}>
                    {/* Render the modal based on which is chosen at moment (I used AI to help me figure out this neat trick) */}
                    <ModalComponent username={props.username} password={props.password} setModalVisibleCallback={(bool: boolean) => { setModalVisible(bool) }} refresh={updateTeams} />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.bigPaddingButton}>Hide</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

export default Teams;