import { apiWrapper } from "@/utils/api";

// API to submit report
export const submitObservation = async (record: any) => {
    const response = await apiWrapper('/observation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
    return response
}