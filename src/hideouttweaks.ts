import hideout_config from "../configs/hideout_config.json";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class EchoHideoutTweaks
{
    modName = "EchoTweaks";
    moduleName = "HideoutTweaks";

    container: DependencyContainer;
    logger: ILogger;

    dataBase: IDatabaseTables;
    hideout: IDatabaseTables["hideout"];

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;

        this.hideout = dataBase.hideout;
    }

    public init(): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //*Change Hideout Construction Time Multipliers and Remove Construction Item Requirements
        if (hideout_config.Tweak_Hideout_Speed === true) 
        {
            if (hideout_config.Reduce_Construction_Time.Enabled === true) 
            {
                this.hideout.areas.forEach((area) => 
                {
                    for (const idx in area.stages) 
                    {
                        if (area.stages[idx].constructionTime > 0) 
                        {
                            area.stages[idx].constructionTime = Math.round(
                                area.stages[idx].constructionTime /
                                hideout_config.Reduce_Construction_Time.Multiplier
                            );
                        }
                    }
                });
                this.logger.logWithColor(
                    `${this.moduleName} - Reduced Construction Time Multiplier`,
                    LogTextColor.GREEN
                );
            }
            //*Change Hideout Production Time Multipliers
            if (hideout_config.Reduce_Production_Time_Multiplier.Enabled === true) 
            {
                for (const data in this.hideout.production) 
                {
                    const productionData = this.hideout.production[data];

                    if (productionData._id == "5d5589c1f934db045e6c5492") 
                    {
                        productionData.productionTime =
                            hideout_config.Reduce_Production_Time_Multiplier.WaterFilterTime;
                        productionData.requirements[1].resource =
                            hideout_config.Reduce_Production_Time_Multiplier.WaterFilterRate;
                    }
                    if (productionData._id == "5d5c205bd582a50d042a3c0e") 
                    {
                        productionData.productionLimitCount =
                            hideout_config.Reduce_Production_Time_Multiplier.MaxBitcoins;
                        productionData.productionTime =
                            hideout_config.Reduce_Production_Time_Multiplier.BitcoinTime;
                    }
                    if (
                        !productionData.continuous &&
                        productionData.productionTime >= 10
                    ) 
                    {
                        productionData.productionTime =
                            productionData.productionTime *
                            hideout_config.Reduce_Production_Time_Multiplier.HideoutProdMult;
                    }
                }
                this.logger.logWithColor(
                    `${this.moduleName} - Reduced Production Time Multiplier`,
                    LogTextColor.GREEN
                );
            }

            //*Remove Construction Item Requirements
            if (
                hideout_config.Remove_Hideout_Construction_Requirements.Enabled === true
            ) 
            {
                for (const data in this.hideout.areas) 
                {
                    const areaData = this.hideout.areas[data];
                    for (const i in areaData.stages) 
                    {
                        if (areaData.stages[i].requirements !== undefined) 
                        {
                            areaData.stages[i].requirements = [];
                        }
                    }
                }
                this.logger.logWithColor(
                    `${this.moduleName} - Removed Hideout Construction Requirements`,
                    LogTextColor.GREEN
                );
            }
        }

        //*Change Scav Case Timer and Price
        if (hideout_config.Tweak_Scav_Case.Enabled === true) 
        {
            if (hideout_config.Tweak_Scav_Case.Fast_Scav_Case === true) 
            {
                for (const scav in this.hideout.scavcase) 
                {
                    const caseData = this.hideout.scavcase[scav];
                    if (caseData.ProductionTime >= 10) 
                    {
                        caseData.ProductionTime =
                            caseData.ProductionTime *
                            hideout_config.Tweak_Scav_Case.Fast_Scav_Case_Multiplier;
                    }
                }
                this.logger.logWithColor(
                    `${this.moduleName} - Updated Scav Case Timer`,
                    LogTextColor.GREEN
                );
            }
            if (hideout_config.Tweak_Scav_Case.Reduce_Price === true) 
            {
                for (const scase in this.hideout.scavcase) 
                {
                    const caseData = this.hideout.scavcase[scase];
                    if (
                        caseData.Requirements[0].count >= 10 &&
                        (caseData.Requirements[0].templateId ==
                            "5449016a4bdc2d6f028b456f" ||
                            caseData.Requirements[0].templateId ==
                            "5696686a4bdc2da3298b456a" ||
                            caseData.Requirements[0].templateId == "569668774bdc2da2298b4568")
                    ) 
                    {
                        caseData.Requirements[0].count = 10;
                    }
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Scav Case Settings`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoHideoutTweaks }