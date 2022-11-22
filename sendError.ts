import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";
import errorConsts from "./consts/error.consts";

const sendError = async (bot: TelegramBot, chatId: number, errText?: string) => {
    try {
        const template = `
            *${errorConsts.ERR}*
            ${errText ? errText : errorConsts.UNKNOWN_ERR}
        `
        return bot.sendMessage(chatId, template, { parse_mode: "Markdown"});
    } catch (error) {
        logger.error('send error tg: ' + error);
    }
};

export default sendError;