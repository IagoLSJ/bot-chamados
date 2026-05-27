import TelegramBot from "node-telegram-bot-api";
import { StrategyFactory } from "./StrategyFactory";

export function setupBot(bot: TelegramBot) {
 bot.on('message', async (msg) => {
  try {
    const text = msg.text || '';
    const strategy = StrategyFactory.getStrategy(text, msg.chat.id);
    if (strategy) {
      await strategy.execute(bot, msg);
    }else {
      await bot.sendMessage(msg.chat.id, 'Comando não reconhecido. Use /menu para ver as opções disponíveis.');
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(msg.chat.id, 'Ocorreu um erro ao processar sua solicitação. Tente novamente pelo /menu.');
  }
})

}

