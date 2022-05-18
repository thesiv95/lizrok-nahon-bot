import { config } from "dotenv";
import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import chatResponseConsts from "./consts/chat-response.consts";
import doAPIRequest from "./utils/doAPIRequest";
import getImagePath from "./utils/getImagePath";
import logger from "./utils/logger";
import sendMessageToAdmins from "./utils/sendMessageToAdmins";

config();

const token = process.env.BOT_TOKEN as string;
const cronInterval = process.env.CRON_INTERVAL as string;
const chatId = +process.env.CHAT_ID!;

const startCmdRegExp: RegExp = /\/start/g;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

cron.schedule(cronInterval, async () => {
  logger.info('Cron emitted!');
  const apiResponse = await doAPIRequest('tips');

  if (!apiResponse || apiResponse.isError) return bot.sendMessage(chatId, '!!! Internal error (cron)');

  return bot.sendMessage(chatId, apiResponse.tip);
});

bot.onText(startCmdRegExp, () => {
  // when user entered the bot for 1st time...
  return bot.sendMessage(chatId, chatResponseConsts.welcome);
});

bot.on('message', async (msg) => {
  const item = msg.text!;

  if (item.match(startCmdRegExp)) return; // break here, above function will work here!

  if (!item) bot.sendMessage(chatId, 'No msg found');

  const apiResponse = await doAPIRequest('items', item);

  if (!apiResponse || apiResponse.isError) return bot.sendMessage(chatId, '!!! Internal error');

  const itemFound: boolean = apiResponse.itemFound;

  if (!itemFound){
    await sendMessageToAdmins(item);
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
});