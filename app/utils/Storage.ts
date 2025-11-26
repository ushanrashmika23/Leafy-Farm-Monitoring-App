import AsyncStorage from '@react-native-async-storage/async-storage';

// User data interface
export interface UserData {
    name: string;
    email: string;
    telephone: string;
    address: string;
    isFirstTime: boolean;
}

// Storage keys
const STORAGE_KEYS = {
    USER_DATA: 'userData',
};

// Generic storage functions
export const storeData = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error(`Error storing data for key ${key}:`, error);
    }
};

export const getData = async (key: string): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error(`Error retrieving data for key ${key}:`, error);
        return null;
    }
};

// User data functions
export const storeUserData = (userData: UserData) => 
    storeData(STORAGE_KEYS.USER_DATA, userData);

export const getUserData = (): Promise<UserData | null> => 
    getData(STORAGE_KEYS.USER_DATA);

export const isFirstTimeUser = async (): Promise<boolean> => {
    const userData = await getUserData();
    return userData === null;
};