import TelegramBot from "node-telegram-bot-api";
import { StrategyFactory } from "./StrategyFactory";

export function setupBot(bot: TelegramBot) {
 bot.on('message', (msg) => {
    const text = msg.text || '';
    const strategy = StrategyFactory.getStrategy(text, msg.chat.id);
    if (strategy) {
      strategy.execute(bot, msg);
    }else {
    bot.sendMessage(msg.chat.id, 'Comando não reconhecido. Use /menu para ver as opções disponíveis.');
  }
})

}

