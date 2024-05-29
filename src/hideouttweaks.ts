import hideout_config from "../configs/hideout_config.json";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { EchoBaseTweak } from "./Base/basetweak";

class EchoHideoutTweaks extends EchoBaseTweak 
{
    moduleName = "HideoutTweaks";

    public constructor(
        container: DependencyContainer,
        logger: ILogger,
        dataBase: IDatabaseTables
    ) 
    {
        super(container, logger, dataBase);
    }

    public init(): void 
    {
        super.init();

        if (hideout_config.Max_Hideout_Upgrades) 
        {
            this.maxHideoutUpgrades();
        }
        //*Change Hideout Construction Time Multipliers and Remove Construction Item Requirements
        if (hideout_config.Tweak_Hideout_Speed) 
        {
            if (hideout_config.Reduce_Construction_Time.Enabled) 
            {
                this.applyConstructTimeReductionMulti();
            }
            
            //*Change Hideout Production Time Multipliers
            if (hideout_config.Reduce_Production_Time_Multiplier.Enabled) 
            {
                this.applyProductionTimeReductionMulti();
            }

            //*Remove Construction Item Requirements
            if (
                hideout_config.Remove_Hideout_Construction_Requirements.Enabled
            ) 
            {
                this.removeConstructionItemRequirements();
            }
        }

        //*Change Scav Case Timer and Price
        if (hideout_config.Tweak_Scav_Case.Enabled) 
        {
            if (hideout_config.Tweak_Scav_Case.Fast_Scav_Case) 
            {
                this.updateScavCaseTimer();
            }
            if (hideout_config.Tweak_Scav_Case.Reduce_Price) 
            {
                this.reduceScavCasePrice();
            }
        }
    }

    public maxHideoutUpgrades(): void 
    {
        this.hideoutData.areas.forEach((area) => 
        {
            for (const idx in area.stages) 
            {
                if (area.stages[idx].requirements !== undefined) 
                {
                    area.stages[idx].requirements = [];
                }
                area.stages[idx].autoUpgrade = true;
            }
        });
        this.logToConsole("Max Hideout Upgrades", LogTextColor.GREEN);
    }

    private applyConstructTimeReductionMulti(): void
    {
        this.hideoutData.areas.forEach((area) => 
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
        this.logToConsole("Reduced Construction Time Multiplier", LogTextColor.GREEN);
    }

    private applyProductionTimeReductionMulti(): void
    {
        for (const data in this.hideoutData.production) 
        {
            const productionData = this.hideoutData.production[data];

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
        this.logToConsole("Reduced Production Time Multiplier", LogTextColor.GREEN);
    }

    private removeConstructionItemRequirements(): void
    {
        for (const data in this.hideoutData.areas) 
        {
            const areaData = this.hideoutData.areas[data];
            for (const i in areaData.stages) 
            {
                if (areaData.stages[i].requirements !== undefined) 
                {
                    areaData.stages[i].requirements = [];
                }
            }
        }
        this.logToConsole("Removed Hideout Construction Requirements", LogTextColor.GREEN);
    }

    private updateScavCaseTimer(): void
    {
        for (const scav in this.hideoutData.scavcase) 
        {
            const caseData = this.hideoutData.scavcase[scav];
            if (caseData.ProductionTime >= 10) 
            {
                caseData.ProductionTime =
                    caseData.ProductionTime *
                    hideout_config.Tweak_Scav_Case.Fast_Scav_Case_Multiplier;
            }
        }
        this.logToConsole("Updated Scav Case Timer", LogTextColor.GREEN);
    }

    private reduceScavCasePrice(): void
    {
        for (const scase in this.hideoutData.scavcase) 
        {
            const caseData = this.hideoutData.scavcase[scase];
            if (
                caseData.Requirements[0].count >= 10 &&
                (caseData.Requirements[0].templateId == "5449016a4bdc2d6f028b456f" ||
                    caseData.Requirements[0].templateId == "5696686a4bdc2da3298b456a" ||
                    caseData.Requirements[0].templateId == "569668774bdc2da2298b4568")
            ) 
            {
                caseData.Requirements[0].count = 10;
            }
        }
        this.logToConsole("Updated Scav Case Settings", LogTextColor.GREEN);
    }
}

export { EchoHideoutTweaks };
