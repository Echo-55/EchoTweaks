import bot_config from "../configs/bot_config.json";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

class EchoBotTweaks
{
    modName = "EchoTweaks";
    moduleName = "BotTweaks";

    container: DependencyContainer;
    logger: ILogger;
    dataBase: IDatabaseTables;
    globals: IDatabaseTables["globals"]["config"];
    locations: IDatabaseTables["locations"];

    configServer: ConfigServer;
    botConfig: any;

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;
        this.configServer = container.resolve<ConfigServer>("ConfigServer");
        this.botConfig = this.configServer.getConfig<any>(ConfigTypes.BOT)

        this.globals = dataBase.globals.config;
        this.locations = dataBase.locations;
    }

    public init() : void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //*Change Bot Waves
        if (bot_config.Tweak_Bot_Waves.Enabled === true) 
        {
            const botWaves = bot_config.Tweak_Bot_Waves;
            // DB.bots.core.WAVE_ONLY_AS_ONLINE = bot_waves.as_online;
            this.globals.WAVE_COEF_LOW = botWaves.low;
            this.globals.WAVE_COEF_MID = botWaves.medium;
            this.globals.WAVE_COEF_HIGH = botWaves.high;
            this.globals.WAVE_COEF_HORDE = botWaves.horde;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Waves: Low: ${this.globals.WAVE_COEF_LOW} - Mid: ${this.globals.WAVE_COEF_MID} - High: ${this.globals.WAVE_COEF_HIGH} - Horde: ${this.globals.WAVE_COEF_HORDE}`,
                LogTextColor.GREEN
            );
        }

        //*Change Bot Count
        if (bot_config.Tweak_Bot_Count.Enabled === true) 
        {
            const botCount = bot_config.Tweak_Bot_Count;
            this.globals.MaxBotsAliveOnMap = botCount.Max_Alive_Bots;
            this.dataBase.bots.core.LOCAL_BOTS_COUNT = botCount.Local_Bots_Count;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Count: ${this.globals.MaxBotsAliveOnMap} - ${this.dataBase.bots.core.LOCAL_BOTS_COUNT}`,
                LogTextColor.GREEN
            );
        }

        //TODO Don't think this works
        //*Change Boss Spawn Chance
        if (bot_config.Tweak_Boss_Spawn_Chance.Enabled === true) 
        {
            for (const locationIdx in this.locations) 
            {
                const location = this.locations[locationIdx];
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
        if (bot_config.Tweak_Bot_Gear_Durability.Enabled === true) 
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

        //*Change Bot Loot Value
        if (bot_config.Tweak_Bot_Loot_Value.Enabled === true) 
        {
            this.botConfig.pmc.maxBackpackLootTotalRub =
                bot_config.Tweak_Bot_Loot_Value.Max_Backpack_Loot_Value; //150000 default
            this.botConfig.pmc.maxPocketLootTotalRub =
                bot_config.Tweak_Bot_Loot_Value.Max_Pocket_Loot_Value; //50000 default
            this.botConfig.pmc.maxVestLootTotalRub =
                bot_config.Tweak_Bot_Loot_Value.Max_Vest_Loot_Value; //50000 default
            this.logger.logWithColor(
                `${this.moduleName} - Updated Bot Loot Value: Backpack: ${this.botConfig.pmc.maxBackpackLootTotalRub} - Pocket: ${this.botConfig.pmc.maxPocketLootTotalRub} - Vest: ${this.botConfig.pmc.maxVestLootTotalRub}`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoBotTweaks };