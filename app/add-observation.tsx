import ImagePicker from '@/components/ImagePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { useObservationStore } from '@/services/stores';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

export default function AddObservation() {
    const router = useRouter();
    const { addObservation } = useObservationStore();

    const [userId, setUserId] = useState("");
    const [textObservation, setTextObservation] = useState("");
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!userId.trim()) {
            newErrors.userId = "User ID is required.";
        }

        if (!textObservation.trim()) {
            newErrors.textObservation = "Text observation is required.";
        }

        if (!photoUri) {
            newErrors.photoUri = "Please select a photo.";
        }

        if (!location) {
            newErrors.location = "Location is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setUserId("");
        setTextObservation("");
        setPhotoUri(null);
        setLocation(null);
    };

    const handleChange = <T extends keyof typeof errors>(
        field: T,
        value: any,
        setter: (value: any) => void
    ) => {
        setter(value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (!validate()) return;
        addObservation({
            observation_id: uuid.v4(),
            user_id: userId,
            text_observation: textObservation,
            photo_url: "https://www.finches.ai/hubfs/fi_logo_blue.png",
            location,
            status: "pending"
        });
        resetForm();
        router.back();

    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Location access is required.");
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const locationToSet = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
        }
        handleChange('location', locationToSet, setLocation)
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.mainContainer}>
            <ThemedView style={styles.mainContainer}>
                <ScrollView>

                    <SafeAreaView style={styles.container}>
                        <ThemedText type="title" style={styles.title}>Farm Details</ThemedText>

                        <ThemedTextInput
                            style={styles.input}
                            onChangeText={text => handleChange('userId', text, setUserId)}
                            value={userId}
                            placeholder="User Id"
                        />
                        {errors.userId && <Text style={styles.errorText}>{errors.userId}</Text>}

                        <ThemedTextInput
                            style={[styles.input, { height: 100 }]}
                            onChangeText={text => handleChange('textObservation', text, setTextObservation)}
                            value={textObservation}
                            placeholder="Text Observation"
                            multiline
                            numberOfLines={4}
                            textAlign="left"
                            textAlignVertical="top"
                        />
                        {errors.textObservation && <Text style={styles.errorText}>{errors.textObservation}</Text>}

                        <ImagePicker onImageSelected={(uri) => handleChange('photoUri', uri, setPhotoUri)} />
                        {errors.photoUri && <Text style={styles.errorText}>{errors.photoUri}</Text>}

                        <TouchableOpacity onPress={getLocation} style={styles.secondaryButton}>
                            <Text style={styles.buttonText}>📍 Get Current Location</Text>
                        </TouchableOpacity>
                        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

                        {location && (
                            <Text style={styles.locationText}>
                                Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
                            </Text>
                        )}

                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.loginText}>Submit</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </ScrollView>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        margin: 16,
        minWidth: 300,
    },
    title: {
        paddingBottom: 8
    },
    input: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    button: {
        backgroundColor: "blue",
        padding: 16,
        alignItems: "center",
        marginTop: 12,
        borderRadius: 8,
    },
    loginText: {
        fontSize: 16,
        color: "#ffffff",
    },
    secondaryButton: {
        backgroundColor: "#444",
        padding: 12,
        alignItems: "center",
        marginTop: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
    },
    locationText: {
        marginTop: 8,
        fontSize: 14,
        color: "#333",
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
        marginBottom: 8,
    }
});
