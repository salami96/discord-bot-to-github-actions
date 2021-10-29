/**
 * Discord-specific configuration.
 */
export class DiscordConfig {
  readonly DISCORD_TOKEN: string;

  readonly PRISMA_TOKEN: string | undefined;

  readonly TOPGG: string | undefined;

  readonly owner: string;

  readonly commandPrefix: string;

  readonly nonCommandEditable: boolean;

  constructor(dstoken: string, ptoken?: string, topgg?: string) {
    this.DISCORD_TOKEN = dstoken;
    this.PRISMA_TOKEN = ptoken;
    this.TOPGG = topgg;
    this.owner = "817789370022101053"; // diogoscf#2167
    this.commandPrefix = ";";
    this.nonCommandEditable = false;
  }
}

import { Command, CommandoMessage } from "discord.js-commando";
import { Message, PermissionString } from "discord.js";

/**
 * custom class for custom rate-limiting
 */
export class RLCommand extends Command {
  async onBlock(
    message: CommandoMessage,
    reason: string,
    data?: { throttle?; remaining?: number; response?: string; missing?: PermissionString[] }
  ): Promise<Message | Message[]> {
    if (reason !== "throttling") return super.onBlock(message, reason, data);

    const response = await super.onBlock(message, reason, data);

    // delete messages after 5 seconds
    setTimeout(() => {
      if (response instanceof Message) {
        response.delete();
      } else {
        for (const msg of response) {
          msg.delete();
        }
      }
      if (message.deletable) message.delete();
    }, 5000);

    return response;
  }
}
