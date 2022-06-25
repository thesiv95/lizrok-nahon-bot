import TelegramBot from "node-telegram-bot-api";
import { checkActiveUsers, doAPIRequest } from "../utils/api";
import logger from "../utils/logger";
import serializeText from "../utils/serializeText";

const cronHandler = async (botInstance: TelegramBot) => {
    try {
      logger.info('Cron emitted!');
      const activeUsers = await checkActiveUsers();
      const userChatIds: string[] = activeUsers.map((el: { userChatId: any; }) => el.userChatId);
      
      // Get all tips
      const apiResponse = await doAPIRequest('tips');

      // *bold header*
      console.log(apiResponse.text);
      
      const tipText = `
      *${apiResponse.title}*
      ${serializeText(apiResponse.text)}
      `;

      // map pictures (there could be several urls)
      const tipImages = apiResponse.imageUrls.map((image: string) => {
        return {
          type: 'photo',
          media: image
        }
      });

      // send msgs to each active users...
      userChatIds.forEach(chatId => {
        logger.debug(`Sending to chatId = ${chatId}`);
        botInstance.sendMessage(chatId, tipText, { parse_mode: 'MarkdownV2' });
        botInstance.sendMediaGroup(chatId, tipImages);
      });
    } catch (error) {
      logger.error('cronHandler', error);
    }
};


export default cronHandler;