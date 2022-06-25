import axios from "axios";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";

const cb3Func = () => {
    return Math.random().toString();
}

const cb4Func = async () => {
    const response = await axios.get('https://swapi.dev/api/people/3');
    const name = response.data.name;
    return `SW API name: ${name}`;
}

const keysHandler = (callbackQuery: CallbackQuery, botInstance: TelegramBot) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
  
    if (data === 'cb3') {
        return botInstance.sendMessage(message!.chat.id, cb3Func());
    } else if (data === 'cb4') {
        return cb4Func().then((val) => botInstance.sendMessage(message!.chat.id, val));
    } else {
        return botInstance.sendMessage(message!.chat.id, `data "${data}"`);
    }
  
}

export default keysHandler;