import player_config from "../configs/player_config.json";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";

class EchoPlayerTweaks
{
    modName = "EchoTweaks";
    moduleName = "PlayerTweaks";

    container: DependencyContainer;
    logger: ILogger;

    dataBase: IDatabaseTables;
    items: IDatabaseTables["templates"]["items"];
    globals: IDatabaseTables["globals"]["config"];
    suits: IDatabaseTables["templates"]["customization"]

    configServer: ConfigServer;

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;
        this.configServer = container.resolve<ConfigServer>("ConfigServer");

        this.items = dataBase.templates.items;
        this.globals = dataBase.globals.config;
        this.suits = dataBase.templates.customization;
    }

    public init(): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //* Unlimited Stamina
        if (player_config.Enable_Unlimited_Stamina === true) 
        {
            this.globals.Stamina.Capacity = 500;
            this.globals.Stamina.BaseRestorationRate = 500;
            this.globals.Stamina.StaminaExhaustionCausesJiggle = false;
            this.globals.Stamina.StaminaExhaustionStartsBreathSound = false;
            this.globals.Stamina.StaminaExhaustionRocksCamera = false;
            this.globals.Stamina.SprintDrainRate = 0;
            this.globals.Stamina.JumpConsumption = 0;
            this.globals.Stamina.AimDrainRate = 0;
            this.globals.Stamina.SitToStandConsumption = 0;
            this.logger.logWithColor(
                `${this.moduleName} - Unlimited Stamina Enabled`,
                LogTextColor.GREEN
            );
        }

        //* Change Load/Unload Speed
        if (player_config.Tweak_Load_Speed.Enabled === true) 
        {
            this.globals.BaseCheckTime = player_config.Tweak_Load_Speed.Base_Check_Time;
            this.globals.BaseUnloadTime = player_config.Tweak_Load_Speed.Base_Unload_Time;
            this.globals.BaseLoadTime = player_config.Tweak_Load_Speed.Base_Load_Time;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Load/Unload Speed`,
                LogTextColor.GREEN
            );
        }

        //*Change Ragfair Level Requirement
        if (player_config.Tweak_Ragfair_Level.Enabled === true) 
        {
            this.globals.RagFair.minUserLevel = player_config.Tweak_Ragfair_Level.Min_Level;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Ragfair Level Requirement`,
                LogTextColor.GREEN
            );
        }

        //*Make All Clothes Available
        if (player_config.All_Clothes_Available === true) 
        {
            for (const suit in this.suits) 
            {
                const suitData = this.suits[suit];
                if (
                    suitData._parent === "5cd944ca1388ce03a44dc2a4" ||
                    suitData._parent === "5cd944d01388ce000a659df9"
                ) 
                {
                    suitData._props.Side = ["Bear", "Usec"];
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - All Clothes Available`,
                LogTextColor.GREEN
            );
        }

        //* Change Pocket Size
        if (player_config.Big_Pockets.Enabled === true) 
        {
            const pockets = this.items["627a4e6b255f7527fb05a0f6"]
            for (let i = 0; i < pockets._props.Grids.length; i++) 
            {
                pockets._props.Grids[i]._props.cellsH = player_config.Big_Pockets.cellsH;
                pockets._props.Grids[i]._props.cellsV = player_config.Big_Pockets.cellsV;
            }
            this.logger.logWithColor(
                `${this.moduleName} - Bigger pockets enabled | ${player_config.Big_Pockets.cellsH}x${player_config.Big_Pockets.cellsV}`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoPlayerTweaks };