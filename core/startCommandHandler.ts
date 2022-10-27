import TelegramBot from "node-telegram-bot-api";
import chatResponseConsts from "../consts/chat-response.consts";
import logger from "../utils/logger";

const startCommandHandler = async (msg: TelegramBot.Message, botInstance: TelegramBot) => {
  try {

    const thisChatId = msg.chat.id; // one user has its unique chat id...

    return Promise.all([
      botInstance.sendMessage(thisChatId, chatResponseConsts.welcome),
      botInstance.sendMessage(thisChatId, chatResponseConsts.howto),
    ]);
  } catch (error) {
    logger.error('startCommandHandler', error);
  }
};

export default startCommandHandler;
