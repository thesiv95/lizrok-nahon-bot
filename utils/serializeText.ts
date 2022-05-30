/**
 * Telegram requires escaping some symbols
 * @param text 
 * @returns 
 */
const serializeText = (text: string) => text.replace(/!/g, '\\!');

export default serializeText;