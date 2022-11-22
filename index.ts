import { config } from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import chatResponseConsts from "./consts/chat-response.consts";
import errorConsts from "./consts/error.consts";
import startCommandHandler from "./core/startCommandHandler";
import sendError from "./sendError";
import doAPIRequest from "./utils/doAPIRequest";
import getImagePath from "./utils/getImagePath";
import logger from "./utils/logger";
import notifyAdmin from "./utils/notifyAdmin";

config();

const token = process.env.BOT_TOKEN as string;

const startCmdRegExp: RegExp = /\/start/g;
const hebrewCharsRegExp = new RegExp(/[\u0590-\u05FF\uFB2A-\uFB4E]/);

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(startCmdRegExp, (msg) => {
  // when user entered the bot for 1st time...
  return startCommandHandler(msg, bot);
});

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const item = msg.text!;

    if (item.match(startCmdRegExp)) return; // break here, above function will work here

    if (!item) {
      return sendError(bot, chatId, errorConsts.ERR_EMPTY);
    }

    if (!hebrewCharsRegExp.test(item)) {
      return sendError(bot, chatId, errorConsts.ERR_HEBREW_ONLY);
    }

    const apiResponse = await doAPIRequest('items', item);

    if (!apiResponse) { // unknown error
      return sendError(bot, chatId, errorConsts.ERR_SERVER);
    }

    const itemFound: boolean = apiResponse.itemFound;

    if (!itemFound) {
      await sendError(bot, chatId, chatResponseConsts.unknownItem);
      // send msg to admin(s)
      return notifyAdmin(`New unknown item: ${item}`);
    } else {
      const categoryNeeded = apiResponse.categoryNeeded;

      if (categoryNeeded === 'orange') {
        return Promise.all([
          bot.sendPhoto(chatId, getImagePath('orange')),
          bot.sendMessage(chatId, chatResponseConsts.orange),
        ]);
      }

      if (categoryNeeded === 'purple') {
        return Promise.all([
          bot.sendPhoto(chatId, getImagePath('purple')),
          bot.sendMessage(chatId, chatResponseConsts.purple),
        ]);
      }

    }

    return sendError(bot, chatId);
  } catch (error) {
    logger.error('main function error: ' + error);
  }
});
