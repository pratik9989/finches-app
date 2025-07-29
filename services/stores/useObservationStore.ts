import { FarmRecordType } from "@/utils/api.types";
import { loadString, remove, saveString } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { submitObservation } from "../apis/reportApi";

export const useObservationStore = create<any>()(
    persist(
        (set: any, get: any) => {
            return {
                reports: [],
                addObservation: async (record: FarmRecordType) => {
                    try {
                        console.log("record", record)
                        set((state: any) => ({ reports: [record, ...state.reports] }))
                        console.log("record added")
                        alert("Record added successfully")
                    } catch (error) {
                        set((state: any) => ({ reports: [...state.reports, { ...record, status: "failed" }] }))
                        console.error(error)
                        alert("Failed to add new observation")
                    }
                },
                updateRecord: (observation_id: string, record: FarmRecordType) => {
                    console.log("record to update", record)
                    set((state: any) => ({
                        reports: state.reports.map((rec: FarmRecordType) =>
                            rec.observation_id === observation_id ? { ...rec, ...record } : rec
                        ),
                    }))
                },
                syncObservation: async () => {
                    try {
                        const pendingRecords = get().reports.filter(
                            (record: FarmRecordType) => record.status === 'pending' || record.status === 'failed'
                        );

                        const syncResults = await Promise.allSettled(
                            pendingRecords.map(async (record: FarmRecordType) => {
                                let status = ""
                                try {
                                    await submitObservation(record);
                                    status = "synced"
                                } catch (error) {
                                    console.error("Sync failed for record:", record.observation_id, error);
                                    status = "failed"
                                } finally {
                                    // Mark as synced regardless of success/failure
                                    const updatedRecord = { ...record, status: status };
                                    console.log("status", updatedRecord)
                                    get().updateRecord(record.observation_id, updatedRecord);
                                }
                            })
                        );

                        console.log("Record sync complete");
                        if (pendingRecords.length > 0) {
                            alert("Records synced successfully");
                        }

                    } catch (error) {
                        console.error("Sync error:", error);
                        alert("Failed to sync observations");
                    }
                },

                clearAll: () => set({ reports: [], selectedRecord: null }),

            }
        }, {
        name: 'farm-storage',
        storage: createJSONStorage(() => ({
            getItem: async (key) => await loadString(key) || null,
            setItem: async (key, value) => await saveString(key, value),
            removeItem: async (key) => await remove(key),
        })),
        partialize: (state: any) => ({
            reports: state.reports,
        }),
    }))