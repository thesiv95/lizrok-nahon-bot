import TelegramBot from "node-telegram-bot-api";
import chatResponseConsts from "../consts/chat-response.consts";
import { doAPIRequest } from "../utils/api";
import getImagePath from "../utils/getImagePath";
import logger from "../utils/logger";
import sendMessageToAdmins from "../utils/sendMessageToAdmins";

const messageHandler = async (startCmdRegExp: RegExp, msg: TelegramBot.Message, botInstance: TelegramBot) => {
    try {
        const userId = msg.chat.username || 'no nick';
        const thisChatId = msg.chat.id; // one user has its unique chat id...
        const item = msg.text!;
    
        if (item.match(startCmdRegExp)) return; // break here, above function will work here!
    
        if (!item) botInstance.sendMessage(thisChatId, 'No msg found');
    
        const apiResponse = await doAPIRequest('items', { item });
    
        if (!apiResponse || apiResponse.isError) return botInstance.sendMessage(thisChatId, '!!! Internal error');
    
        const itemFound: boolean = apiResponse.itemFound;
    
        if (!itemFound){
        await sendMessageToAdmins(item, userId);
        return botInstance.sendMessage(thisChatId, chatResponseConsts.unknownItem);
        } else {
        const categoryNeeded = apiResponse.categoryNeeded;
    
        if (categoryNeeded === 'orange') {
            return Promise.all([
                botInstance.sendPhoto(thisChatId, getImagePath('orange')),
                botInstance.sendMessage(thisChatId, chatResponseConsts.orange),
            ]);
        }
    
        if (categoryNeeded === 'purple') {
            return Promise.all([
                botInstance.sendPhoto(thisChatId, getImagePath('purple')),
                botInstance.sendMessage(thisChatId, chatResponseConsts.purple),
            ]);
        }
    
        }
    
        return botInstance.sendMessage(thisChatId, '?! unknown error');
    } catch (error) {
        logger.error('messageHandler', error);
    }
};

export default messageHandler;