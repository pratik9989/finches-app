import { loadString, remove, saveString } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type StatusType = "pending" | "success" | "failed";
interface LocationType {
    latitude: number;
    longitude: number;
}
interface FarmRecordType {
    observation_id: string;
    user_id: string;
    text_observation: string;
    photo_url: string;
    location: LocationType;
}
export const useObservationStore = create<any>()(
    persist(
        (set: any, get: any) => {
            return {
                reports: [],
                addFarmRecord: (record: FarmRecordType) => {
                    try {
                        console.log("record", record)
                        set((state: any) => ({ reports: [...state.reports, record] }))
                        console.log("record added")
                    } catch (error) {
                        console.log("error", error)
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