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
                        await submitObservation(record)
                        console.log("record", record)
                        set((state: any) => ({ reports: [{ ...record, status: "synced" }, ...state.reports] }))
                        console.log("record added")
                        alert("Record added successfully")
                    } catch (error) {
                        set((state: any) => ({ reports: [...state.reports, { ...record, status: "failed" }] }))
                        console.error(error)
                        alert("Failed to add new observation")
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