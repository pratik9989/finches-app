import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useObservationStore } from '@/services/stores';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// const isConnected = true;

export default function HomeScreen() {
    const { reports, updateRecord } = useObservationStore();
    const router = useRouter();

    // useEffect(() => {
    //     if (isConnected) {
    //         const recordsWithPendingStatus = reports.filter((record: any) => record.status === 'pending');
    //         recordsWithPendingStatus.forEach((record: any) => {
    //             // Simulate sync call and update status
    //             const updatedRecord = { ...record, status: 'synced' };
    //             updateRecord(record.observation_id, updatedRecord);
    //         });
    //     }
    // }, [isConnected]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'orange';
            case 'synced':
                return 'green';
            case 'failed':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <ThemedView style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedText type="title" style={styles.title}>🌾 Farm Records</ThemedText>

                {reports.length === 0 ? (
                    <ThemedText style={styles.emptyText}>No records found. Add a new farm record to get started.</ThemedText>
                ) : (
                    <FlatList
                        data={reports}
                        contentContainerStyle={styles.listContainer}
                        renderItem={({ item }) => {
                            const statusColor = getStatusColor(item.status);
                            return (
                                <ThemedView style={styles.card}>
                                    <ThemedText style={styles.cardTitle}>User: {item.user_id}</ThemedText>
                                    <View style={styles.cardRow}>
                                        <ThemedText style={styles.label}>Observation:</ThemedText>
                                        <ThemedText>{item.textObservation}</ThemedText>
                                    </View>
                                    {item.photo_url ? (
                                        <Image
                                            source={{ uri: item.photo_url }}
                                            style={styles.thumbnail}
                                            resizeMode="cover"
                                        />
                                    ) : null}

                                    {item.location ? (
                                        <View style={styles.cardRow}>
                                            <ThemedText style={styles.label}>Location:</ThemedText>
                                            <ThemedText>
                                                {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                                            </ThemedText>
                                        </View>
                                    ) : null}
                                    <View style={styles.cardRow}>
                                        <ThemedText style={styles.label}>Status:</ThemedText>
                                        <ThemedText style={[styles.status, { color: statusColor }]}>
                                            {item.status}
                                        </ThemedText>
                                    </View>
                                </ThemedView>
                            );
                        }}
                        keyExtractor={item => item.observation_id}
                    />
                )}
            </SafeAreaView>
            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/add-observation')}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: 16,
    },
    mainContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#9BA1A6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontWeight: '500',
    },
    status: {
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    emptyText: {
        marginTop: 32,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 56,
        right: 24,
        backgroundColor: '#007AFF',
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    thumbnail: {
        width: 100,
        height: 100,
        marginTop: 8,
        borderRadius: 8,
    },
});
