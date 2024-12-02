import bot_config from "../configs/bot_config.json";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { EchoBaseTweak } from "./Base/basetweak";

class EchoBotTweaks extends EchoBaseTweak
{
    moduleName = "BotTweaks";

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        super(container, logger, dataBase);
    }

    public init() : void
    {
        super.init();

        //*Change Bot Waves
        if (bot_config.Tweak_Bot_Waves.Enabled) 
        {
            const botWaves = bot_config.Tweak_Bot_Waves;
            // DB.bots.core.WAVE_ONLY_AS_ONLINE = bot_waves.as_online;
            this.globalsConfig.WAVE_COEF_LOW = botWaves.low;
            this.globalsConfig.WAVE_COEF_MID = botWaves.medium;
            this.globalsConfig.WAVE_COEF_HIGH = botWaves.high;
            this.globalsConfig.WAVE_COEF_HORDE = botWaves.horde;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Waves: 
                Low: ${this.globalsConfig.WAVE_COEF_LOW} - 
                Mid: ${this.globalsConfig.WAVE_COEF_MID} - 
                High: ${this.globalsConfig.WAVE_COEF_HIGH} - 
                Horde: ${this.globalsConfig.WAVE_COEF_HORDE}`,
                LogTextColor.GREEN
            );
        }

        //*Change Bot Count
        if (bot_config.Tweak_Bot_Count.Enabled) 
        {
            const botCount = bot_config.Tweak_Bot_Count;
            this.globalsConfig.MaxBotsAliveOnMap = botCount.Max_Alive_Bots;
            this.dataBase.bots.core.LOCAL_BOTS_COUNT = botCount.Local_Bots_Count;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Count: 
                ${this.globalsConfig.MaxBotsAliveOnMap} - 
                ${this.dataBase.bots.core.LOCAL_BOTS_COUNT}`,
                LogTextColor.GREEN
            );
        }

        //TODO Don't think this works
        //*Change Boss Spawn Chance
        if (bot_config.Tweak_Boss_Spawn_Chance.Enabled) 
        {
            for (const locationIdx in this.locationsData) 
            {
                const location = this.locationsData[locationIdx];
                if (location.base && location.base.BossLocationSpawn) 
                {
                    for (const bossIdx in location.base.BossLocationSpawn) 
                    {
                        const boss = location.base.BossLocationSpawn[bossIdx];
                        const bossChance = bot_config.Tweak_Boss_Spawn_Chance;
                        switch (boss.BossName) 
                        {
                            case "sectantPriest":
                            case "bossSanitar":
                            case "bossTagilla":
                            case "bossBully":
                            case "bossKilla":
                            case "bossGluhar":
                            case "bossKojaniy":
                                boss.BossChance = bossChance[boss.BossName];
                                break;
                            default:
                        }
                    }
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Boss Spawn Chance`,
                LogTextColor.GREEN
            );
        }

        //*Change Bot Gear Durability
        if (bot_config.Tweak_Bot_Gear_Durability.Enabled) 
        {
            this.botConfig.durability.default.armor.minDelta =
                bot_config.Tweak_Bot_Gear_Durability.Min_Armor_Durability;
            this.botConfig.durability.default.armor.maxDelta =
                bot_config.Tweak_Bot_Gear_Durability.Max_Armor_Durability;
            this.botConfig.durability.default.weapon.lowestMax =
                bot_config.Tweak_Bot_Gear_Durability.Min_Weapon_Durability;
            this.botConfig.durability.default.weapon.highestMax =
                bot_config.Tweak_Bot_Gear_Durability.Max_Weapon_Durability;
            this.botConfig.durability.default.weapon.minDelta = 8; //default is 0
            this.botConfig.durability.default.weapon.maxDelta = 10; //default is 10
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Gear Durability: Armor: ${this.botConfig.durability.default.armor.minDelta} - ${this.botConfig.durability.default.armor.maxDelta} - Weapon: ${this.botConfig.durability.default.weapon.lowestMax} - ${this.botConfig.durability.default.weapon.highestMax}`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoBotTweaks };