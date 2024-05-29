import raid_config from "../configs/raid_config.json";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { EchoBaseTweak } from "./Base/basetweak";

class EchoRaidTweaks extends EchoBaseTweak
{
    moduleName = "RaidTweaks";

    inRaidConfig: any;

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        super(container, logger, dataBase);
        this.inRaidConfig = this.configServer.getConfig<any>(ConfigTypes.IN_RAID);
    }

    public init(): void
    {
        super.init();

        //*Remove Skill Fatigue
        if (raid_config.Remove_Skill_Fatigue === true) 
        {
            this.globalsConfig.SkillPointsBeforeFatigue = 10000;
            this.logger.logWithColor(
                `${this.modName} - Removed Skill Fatigue`,
                LogTextColor.GREEN
            );
        }

        //*Change Skill Progress Rates
        if (raid_config.Tweak_Skill_Rate.Enabled === true) 
        {
            //DatabaseServer.tables.globals.config.SkillsSettings.SkillProgressRate =
            this.globalsConfig.SkillsSettings.SkillProgressRate =
                raid_config.Tweak_Skill_Rate.Skill_Progress_Rate;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Skill Progress Rate: ${this.globalsConfig.SkillsSettings.SkillProgressRate}`,
                LogTextColor.GREEN
            );
        }

        //*Change Weapon Skill Progress Rate
        if (raid_config.Tweak_Weapon_Skill_Rate.Enabled === true) 
        {
            //DatabaseServer.tables.globals.config.SkillsSettings.WeaponSkillProggressRate =
            this.globalsConfig.SkillsSettings.WeaponSkillProgressRate =
                raid_config.Tweak_Weapon_Skill_Rate.Weapon_Skill_Progress_Rate_Multiplier;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Weapon Skill Progress Rate: ${this.globalsConfig.SkillsSettings.WeaponSkillProgressRate}`,
                LogTextColor.GREEN
            );
        }

        //*Change Scav Cooldown
        if (raid_config.Tweak_Scav_Cooldown.Enabled === true) 
        {
            this.globalsConfig.SavagePlayCooldown =
                raid_config.Tweak_Scav_Cooldown.Scav_Cooldown;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Scav Cooldown: ${this.globalsConfig.SavagePlayCooldown}`,
                LogTextColor.GREEN
            );
        }

        //*Change Default Raid Menu Settings
        if (raid_config.Tweak_Raid_Menu.Enabled === true) 
        {
            this.inRaidConfig.MIAOnRaidEnd = raid_config.Tweak_Raid_Menu.MIA_On_Raid_End;
            this.inRaidConfig.raidMenuSettings.aiAmount =
                raid_config.Tweak_Raid_Menu.AI_Amount;
            this.inRaidConfig.raidMenuSettings.aiDifficulty =
                raid_config.Tweak_Raid_Menu.AI_Difficulty;
            this.inRaidConfig.raidMenuSettings.bossEnabled =
                raid_config.Tweak_Raid_Menu.Boss_Enabled;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Raid Menu Settings: AI Amount: ${this.inRaidConfig.raidMenuSettings.aiAmount} AI Difficulty: ${this.inRaidConfig.raidMenuSettings.aiDifficulty} Boss Enabled: ${this.inRaidConfig.raidMenuSettings.bossEnabled}`,
                LogTextColor.GREEN
            );
            this.globalsConfig.TimeBeforeDeploy = raid_config.Tweak_Raid_Menu.Time_Before_Deploy;
            this.globalsConfig.TimeBeforeDeployLocal =
                raid_config.Tweak_Raid_Menu.Time_Before_Deploy_Local;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Load-In Timer: ${this.globalsConfig.TimeBeforeDeploy}`,
                LogTextColor.GREEN
            );
        }

        //*Change End of Raid Exp Multipliers
        if (raid_config.Tweak_Raid_Exp_Multipliers.Enabled === true) 
        {
            this.globalsConfig.exp.match_end.runnerMult =
                raid_config.Tweak_Raid_Exp_Multipliers.Runner_Multiplier;
            this.globalsConfig.exp.match_end.miaMult =
                raid_config.Tweak_Raid_Exp_Multipliers.MIA_Multiplier;
            this.globalsConfig.exp.match_end.survivedMult =
                raid_config.Tweak_Raid_Exp_Multipliers.Survivor_Multiplier;
            this.globalsConfig.exp.match_end.killedMult =
                raid_config.Tweak_Raid_Exp_Multipliers.Killed_Multiplier;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Raid Exp Multipliers: 
                Runner: ${this.globalsConfig.exp.match_end.runnerMult} 
                MIA: ${this.globalsConfig.exp.match_end.miaMult} 
                Survivor: ${this.globalsConfig.exp.match_end.survivedMult} 
                Killed: ${this.globalsConfig.exp.match_end.killedMult}`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoRaidTweaks }