import dotenv from "dotenv";
import axios from "axios";
import logger from './logger';

dotenv.config();

const url = process.env.DISCORD_WEBHOOK_URL as string;

const notifyAdmin = async (msg: string) => {
    try {
        await axios.post(url, { content: msg });
    } catch (error) {
        logger.error('notify admin error ' + error)
    }
};

export default notifyAdmin;

