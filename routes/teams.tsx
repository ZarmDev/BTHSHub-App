import { styles } from '@/constants/styles';
import ExploreTeams from '@/screens/exploreteams';
import ViewTeam from '@/screens/viewteam';
import { getUserTeams, readInDocumentDirectory, writeToDocumentDirectory } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { Text } from 'react-native-paper';

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
    const [selectedTeamName, setSelectedTeamName] = useState<string>("No team selected...");
    
    const colorScheme = useColorScheme();

    async function updateTeams() {
        const req = await getUserTeams(props.token);
        if (req.data == "Unauthorized") {
            return;
        }
        console.log(req.data)
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
        } else {
            setState(STATE.EXPLORETEAMS)
        }
        setTeams(teams)
    }

    useEffect(() => {
        if (state == STATE.NONE || state == STATE.LOADTEAM) {
            updateTeams();
        }
    }, [props.isActive, state]);

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
        </View>
    );
};

export default Teams;