
import { config } from 'dotenv';
import twilioApi from 'twilio';
import logger from './logger';

config();

const sid = process.env.TWILIO_SID as string;
const token = process.env.TWILIO_TOKEN as string;
const virtualPhoneNumber = process.env.TWILIO_VIRTUAL_PHONE_NUMBER as string;
const adminsPhones = process.env.ADMINS_PHONES as string;

const adminsPhonesList = adminsPhones.split(',');

const twilio = twilioApi(sid, token, { logLevel: 'debug' });

const sendMessageToAdmins = async (newItem: string, userId: string): Promise<void> => {
  try {
    const twilioRequests = adminsPhonesList.map((adminPhone) => {
      return twilio.messages.create({
        body: `פריט לא ידוע מהבוט - ${newItem} || ${userId}`,
        from: virtualPhoneNumber,
        to: adminPhone,
      })
    })

    const apiResponse = await Promise.all(twilioRequests);

    logger.info(JSON.stringify(apiResponse));
  } catch (error) {
    logger.error(`twilio error: ${error}`);
  }
};

export default sendMessageToAdmins;