import TelegramBot from "node-telegram-bot-api";
import chatResponseConsts from "../consts/chat-response.consts";
import checkUserInDB from "../utils/checkUserInDB";
import logger from "../utils/logger";

const startCommandHandler = async (msg: TelegramBot.Message, botInstance: TelegramBot) => {
  try {
    logger.info('Cron emitted!');
    const thisNickName = msg.chat.username!;
    const thisChatId = msg.chat.id; // one user has its unique chat id...

    // when user entered the bot for 1st time, it will be stored at db (this is needed for cron)
    return Promise.all([
      checkUserInDB(thisNickName, thisChatId),
      botInstance.sendMessage(thisChatId, chatResponseConsts.welcome),
      botInstance.sendMessage(thisChatId, chatResponseConsts.howto),
    ]);
  } catch (error) {
    logger.error('startCommandHandler', error);
  }
};

export default startCommandHandler;
