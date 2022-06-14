import { config } from 'dotenv';
import axios from 'axios';
import logger from './logger';

config();

const getCreds = () => {
    const apiBaseURL = process.env.API_BASE_URL as string;
    const apiKey = process.env.API_KEY as string;
    return [ apiBaseURL, apiKey ];
}

const checkActiveUsers = async () => {
    try {
        const [ apiBaseURL, apiKey ] = getCreds();

        const url = `${apiBaseURL}/users/getActiveUsers`;

        const apiResponse = await axios.get(url, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const apiResponseJSON = await apiResponse.data;
        return apiResponseJSON.data;
    } catch (error) {
        logger.error(`error from api checkActiveUsers: ${error}`);
    }
}

const doAPIRequest = async (target: string, params?: object | null) => {

    try {
        const [ apiBaseURL, apiKey ] = getCreds();

        // for item cmd there is a payload, for tips - no
        let query = params ? `?${new URLSearchParams({...params})}` : '';
        logger.info(`query: ${query}`);
        
        const url = `${apiBaseURL}/${target}/find${query}`;

        const apiResponse = await axios.get(url, {
            headers: {
                'x-api-key': apiKey
            }
        });
        const apiResponseJSON = await apiResponse.data;
        return apiResponseJSON.data;

    } catch (error) {
        logger.error(`error from api: ${error}`);
    }

    

}

export {
    checkActiveUsers,
    doAPIRequest,
}