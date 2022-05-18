import { config } from 'dotenv';
import axios from 'axios';
import logger from './logger';

config();

const doAPIRequest = async (target: string, item?: string | null) => {

    try {
        const apiBaseURL = process.env.API_BASE_URL as string;
        const apiKey = process.env.API_KEY as string;

        // for item cmd there is a payload, for tips - no
        let query = item ? `?${new URLSearchParams({ item })}` : '';

        item ? logger.info(`query: ${query}`) : logger.info(`query: tip`);
        
        const url = `${apiBaseURL}/${target}/find${query}`;

        const apiResponse = await axios.get(url, {
            headers: {
                'x-api-key': apiKey
            }
        });
        const apiResponseJSON = await apiResponse.data;
        return apiResponseJSON.data;

    } catch (error) {
        console.error(`error from api: ${error}`);
    }

    

}

export default doAPIRequest;