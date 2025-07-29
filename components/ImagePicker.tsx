// components/ImagePicker.tsx

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePickerLib from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export default function ImagePicker({
    onImageSelected,
}: {
    onImageSelected: (uri: string) => void;
}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openCamera = async () => {
        const { granted } = await ImagePickerLib.requestCameraPermissionsAsync();
        if (!granted) {
            alert('Camera access denied');
            return;
        }

        const result = await ImagePickerLib.launchCameraAsync({
            mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0].uri) {
            handleSelection(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const { granted } = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            alert('Gallery access denied');
            return;
        }

        const result = await ImagePickerLib.launchImageLibraryAsync({
            mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0].uri) {
            handleSelection(result.assets[0].uri);
        }
    };

    const handleSelection = (uri: string) => {
        setSelectedImage(uri);
        onImageSelected(uri);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add-a-photo" size={20} color="#fff" />
                <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>

            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.modal}
            >
                <View style={styles.sheet}>
                    <Text style={styles.sheetTitle}>Select Image Source</Text>
                    <TouchableOpacity style={styles.sheetButton} onPress={openCamera}>
                        <MaterialIcons name="photo-camera" size={20} color="#333" />
                        <Text style={styles.sheetButtonText}>Take a Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sheetButton} onPress={openGallery}>
                        <MaterialIcons name="photo-library" size={20} color="#333" />
                        <Text style={styles.sheetButtonText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.sheetButton, { justifyContent: 'center' }]} onPress={() => setModalVisible(false)}>
                        <Text style={[styles.sheetButtonText, { color: 'red' }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.thumbnail} resizeMode="cover" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    thumbnail: {
        width: 100,
        height: 100,
        marginTop: 8,
        borderRadius: 8,
    },
    uploadButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    uploadText: {
        color: '#fff',
        fontWeight: '600',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    sheet: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    sheetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 10,
    },
    sheetButtonText: {
        fontSize: 16,
    },
});
