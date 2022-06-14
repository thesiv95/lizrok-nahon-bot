import { config } from "dotenv";
import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import cronHandler from "./core/cronHandler";
import startCommandHandler from "./core/startCommandHandler";
import messageHandler from "./core/messageHandler";

config();

const token = process.env.BOT_TOKEN as string;
const cronInterval = process.env.CRON_INTERVAL as string;

const startCmdRegExp: RegExp = /\/start/g;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Tips cron initialization
cron.schedule(cronInterval, () => cronHandler(bot));

// /start command
bot.onText(startCmdRegExp, async (msg) => startCommandHandler(msg, bot));

// any message
bot.on('message', async (msg) => messageHandler(startCmdRegExp, msg, bot));