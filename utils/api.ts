const API_URL = "http://172.27.90.75:8000"
/**
 * Makes an HTTP request to the API and parses the JSON response.
 * Throws an error if the response status is not OK.
 *
 * @template T - The expected type of the response data.
 * @param {string} endpoint - API endpoint path (e.g., "/observations").
 * @param {RequestInit} [options={}] - Optional fetch options like method, headers, body, etc.
 * @returns {Promise<T>} - The parsed JSON response typed as T.
 * @throws {Error} - Throws if the response is not ok.
 */
export const apiWrapper = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    console.log("url", url)
    console.log("options", options)
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(json)}`);
    }

    return json as T;
};
