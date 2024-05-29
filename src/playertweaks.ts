import player_config from "../configs/player_config.json";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { EchoBaseTweak } from "./Base/basetweak";

class EchoPlayerTweaks extends EchoBaseTweak
{
    moduleName = "PlayerTweaks";

    suits: IDatabaseTables["templates"]["customization"]

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        super(container, logger, dataBase);
        this.suits = dataBase.templates.customization;
    }

    public init(): void
    {
        super.init();

        //* Unlimited Stamina
        if (player_config.Enable_Unlimited_Stamina === true) 
        {
            this.globalsConfig.Stamina.Capacity = 500;
            this.globalsConfig.Stamina.BaseRestorationRate = 500;
            this.globalsConfig.Stamina.StaminaExhaustionCausesJiggle = false;
            this.globalsConfig.Stamina.StaminaExhaustionStartsBreathSound = false;
            this.globalsConfig.Stamina.StaminaExhaustionRocksCamera = false;
            this.globalsConfig.Stamina.SprintDrainRate = 0;
            this.globalsConfig.Stamina.JumpConsumption = 0;
            this.globalsConfig.Stamina.AimDrainRate = 0;
            this.globalsConfig.Stamina.SitToStandConsumption = 0;
            this.logger.logWithColor(
                `${this.moduleName} - Unlimited Stamina Enabled`,
                LogTextColor.GREEN
            );
        }

        //* Change Load/Unload Speed
        if (player_config.Tweak_Load_Speed.Enabled === true) 
        {
            this.globalsConfig.BaseCheckTime = player_config.Tweak_Load_Speed.Base_Check_Time;
            this.globalsConfig.BaseUnloadTime = player_config.Tweak_Load_Speed.Base_Unload_Time;
            this.globalsConfig.BaseLoadTime = player_config.Tweak_Load_Speed.Base_Load_Time;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Load/Unload Speed`,
                LogTextColor.GREEN
            );
        }

        //*Change Ragfair Level Requirement
        if (player_config.Tweak_Ragfair_Level.Enabled === true) 
        {
            this.globalsConfig.RagFair.minUserLevel = player_config.Tweak_Ragfair_Level.Min_Level;
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
            const pockets = this.itemsData["627a4e6b255f7527fb05a0f6"]
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