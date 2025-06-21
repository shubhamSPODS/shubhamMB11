import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../helper/utility';
import { USER_TOKEN_KEY } from '../libs/constants';
import { Dimensions } from 'react-native';

export const GET_WITH_TOKEN = async (endpoint) => {
    const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, config);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
}; 

export const FULL_WIDTH = Dimensions.get('screen').width
export const FULL_HIGHT= Dimensions.get('screen').height
