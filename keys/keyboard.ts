import { InlineKeyboardButton } from 'node-telegram-bot-api';

const inlineKeyboardRow1: InlineKeyboardButton[] = [{
    text: 'text1',
    callback_data: 'cb1'
  }, {
    text: 'text2',
    callback_data: 'cb2'
  }
];

const inlineKeyboardRow2: InlineKeyboardButton[] = [
    {
      text: 'text3',
      callback_data: 'cb3',
    },
    {
      text: 'text4',
      callback_data: 'cb4',
    },
    {
      text: 'text5',
      callback_data: 'cb5',
    },
];
  


export default [inlineKeyboardRow1, inlineKeyboardRow2];