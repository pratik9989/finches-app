export interface LocationType {
    latitude: number;
    longitude: number;
}
export interface FarmRecordType {
    observation_id: string;
    user_id: string;
    text_observation: string;
    photo_url: string;
    location: LocationType;
}

export type StatusType = "pending" | "synced" | "failed";