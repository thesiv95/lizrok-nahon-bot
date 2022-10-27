import { config } from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import chatResponseConsts from "./consts/chat-response.consts";
import startCommandHandler from "./core/startCommandHandler";
import doAPIRequest from "./utils/doAPIRequest";
import getImagePath from "./utils/getImagePath";
import logger from "./utils/logger";

config();

const token = process.env.BOT_TOKEN as string;

const startCmdRegExp: RegExp = /\/start/g;

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

    if (!item) bot.sendMessage(chatId, 'No msg found');

    const apiResponse = await doAPIRequest('items', item);

    if (!apiResponse || apiResponse.isError) return bot.sendMessage(chatId, '!!! Internal error');

    const itemFound: boolean = apiResponse.itemFound;

    if (!itemFound) {
      return bot.sendMessage(chatId, chatResponseConsts.unknownItem);
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

    return bot.sendMessage(chatId, '?! unknown error');
  } catch (error) {
    logger.error('main function error: ' + error);
  }
});
