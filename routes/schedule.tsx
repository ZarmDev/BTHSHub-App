// THE UI, interfaces, etc were completely generated using AI. I created some functions and some logic 

import { readInDocumentDirectory, uploadSchedule, writeToDocumentDirectory } from '@/utils/utils';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Paragraph, SegmentedButtons, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define TypeScript interfaces for schedule data
interface Course {
  courseId: string;
  courseName: string;
  room: string;
  teacher: string;
  timeSlot: string;
}

interface Day {
  courses: Course[];
  dayNumber: number;
}

interface Schedule {
  days: Day[];
}

export default function Schedule(props: any) {
    const [scheduleData, setScheduleData] = useState<Day[]>([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isWaitingForServer, setIsWaitingForServer] = useState(true);
    const [error, setError] = useState("");
    
    // Load schedule data on component mount
    useEffect(() => {
        loadSavedSchedule();
    }, []);
    
    const loadSavedSchedule = async () => {
        try {
            const savedData = await readInDocumentDirectory("schedule");
            if (savedData) {
                setScheduleData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load schedule:", error);
        }
    };

    async function uploadFile() {
        const result = await DocumentPicker.getDocumentAsync({});
        if (result.assets && result.assets.length > 0) {
            const file = result.assets[0];

            // Create the file object that uploadSchedule expects
            const fileToUpload = {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf',
            };

            try {
                const req = await uploadSchedule(fileToUpload, props.token);
                console.log('Upload status:', req.status);

                if (req.ok) {
                    console.log('File uploaded successfully!');
                    writeToDocumentDirectory("schedule", req.data);
                    setScheduleData(JSON.parse(req.data)[0])
                    console.log(scheduleData);
                } else {
                    console.log('Upload failed:', req.data);
                }
            } catch (error) {
                console.error('Upload error:', error);
            }
        } else {
            console.log('No file selected or upload cancelled');
        }
    };

    // Generate day selection buttons
    const renderDaySelector = () => {
        if (!scheduleData || scheduleData.length === 0) return null;
        console.log(scheduleData)
        // Create an array of valid days (days with courses)
        const validDays = scheduleData
            // .filter(day => day.courses && day.courses.length > 0)
            .map(day => ({
                value: day.dayNumber.toString(),
                label: `Day ${day.dayNumber}`
            }));
            
        return (
            // <ScrollView horizontal={true} style={styles.daySelector}>
            <SegmentedButtons
                value={selectedDayIndex.toString()}
                onValueChange={(value) => setSelectedDayIndex(parseInt(value))}
                buttons={validDays}
                style={styles.daySelector}
            />
            // </ScrollView>
        );
    };
    
    // Render a single course card
    const renderCourseCard = (course: Course, idx: number) => {
        return (
            <Card style={styles.courseCard} key={course.courseId + course.timeSlot}>
                <Card.Content>
                    <Title numberOfLines={1} style={styles.courseName}>{course.courseName || "Free Period"}</Title>
                    
                    <View style={styles.courseDetails}>
                        {course.timeSlot ? (
                            <Chip icon="clock" style={styles.chip}>{course.timeSlot}</Chip>
                        ) : null}
                        
                        {course.room ? (
                            <Chip icon="map-marker" style={styles.chip}>{course.room}</Chip>
                        ) : null}

                        <Chip icon="arrow-right-thin" style={styles.chip}>Period {idx + 1}</Chip>
                    </View>
                    
                    {course.teacher ? (
                        <Paragraph style={styles.teacher}>Teacher: {course.teacher}</Paragraph>
                    ) : null}
                </Card.Content>
            </Card>
        );
    };
    
    // Render the selected day's schedule
    const renderDaySchedule = () => {
        if (!scheduleData || scheduleData.length === 0 && !isWaitingForServer) {
            return (
                <View style={styles.emptyState}>
                    <Text>No schedule data available. Please upload your schedule.</Text>
                    <Button 
                        mode="contained" 
                        onPress={uploadFile} 
                        style={styles.uploadButton}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Schedule'}
                    </Button>
                </View>
            );
        }
        
        const selectedDay = scheduleData[selectedDayIndex];
        if (!selectedDay || !selectedDay.courses || selectedDay.courses.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Text>No classes scheduled for this day.</Text>
                </View>
            );
        }
        
        return (
            <ScrollView style={styles.scrollView}>
                <Title style={styles.dayTitle}>
                    {selectedDay.dayNumber || `Day ${selectedDay.dayNumber}`}
                </Title>
                
                {selectedDay.courses.map((course, idx) => renderCourseCard(course, idx))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Title style={styles.title}>My Schedule</Title>
                <Button 
                    mode="outlined" 
                    icon="upload" 
                    onPress={uploadFile}
                    disabled={loading}
                >
                    Update
                </Button>
            </View>
            
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Processing your schedule...</Text>
                </View>
            )}
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            {renderDaySelector()}
            {renderDaySchedule()}
        </SafeAreaView>
    );
}

// const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    daySelector: {
        marginBottom: 16
    },
    dayTitle: {
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    courseCard: {
        marginBottom: 12,
        elevation: 2,
    },
    courseName: {
        fontSize: 18,
        fontWeight: '600',
    },
    courseDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    teacher: {
        marginTop: 4,
        color: '#555',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    uploadButton: {
        marginTop: 16,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 2,
    },
    loadingText: {
        marginTop: 12,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 12,
    },
});