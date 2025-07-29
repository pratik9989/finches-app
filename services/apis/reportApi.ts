import { apiWrapper } from "@/utils/api";

export const submitObservation = async (record: any) => {
    const response = await apiWrapper('/observation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add auth token if needed
        },
        body: JSON.stringify(record),
    });
    console.log("response", response)
}