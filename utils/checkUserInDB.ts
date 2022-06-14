import { doAPIRequest } from "./api";
import logger from "./logger";

const checkUserInDB = async (nickname: string, userChatId: number) => {
    try {
        const checkResult = await doAPIRequest('users', { nickname, userChatId });
        logger.debug(checkResult)
    } catch (error) {
        logger.error(`error from api: ${error}`);
    }
};

export default checkUserInDB;