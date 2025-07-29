import * as SecureStore from 'expo-secure-store';

/**
 * Loads a string from secure storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(key);
    } catch {
        return null;
    }
}

/**
 * Saves a string to secure storage.
 *
 * @param key The key to store.
 * @param value The string value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
    try {
        await SecureStore.setItemAsync(key, value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Loads and parses a JSON object from secure storage.
 *
 * @param key The key to fetch.
 */
export async function load<T>(key: string): Promise<T | null> {
    try {
        const str = await loadString(key);
        return str ? JSON.parse(str) as T : null;
    } catch {
        return null;
    }
}

/**
 * Saves an object as a JSON string to secure storage.
 *
 * @param key The key to store.
 * @param value The object to store.
 */
export async function save(key: string, value: unknown): Promise<boolean> {
    try {
        const json = JSON.stringify(value);
        return await saveString(key, json);
    } catch {
        return false;
    }
}

/**
 * Removes a value from secure storage.
 *
 * @param key The key to remove.
 */
export async function remove(key: string): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch { }
}

/**
 * SecureStore does not support "clear all", so you must manually remove known keys.
 * Optionally, keep a list of stored keys.
 */
export async function clear(keys: string[]): Promise<void> {
    try {
        for (const key of keys) {
            await remove(key);
        }
    } catch { }
}
