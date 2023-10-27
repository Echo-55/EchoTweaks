
import { DependencyContainer } from "tsyringe";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import player_config from "../configs/player_config.json";



class EchoRouters
{
    modName = "EchoTweaks";
    moduleName = "EchoRouters"

    logger: ILogger;
    staticRouterModService: StaticRouterModService;
    httpResponseUtil: HttpResponseUtil;
    profileHelper: ProfileHelper;

    public constructor(container: DependencyContainer, logger: ILogger)
    {
        this.logger = logger;
        // init is called in mod.ts main file
    }

    public init(container: DependencyContainer): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );

        this.staticRouterModService = container.resolve<StaticRouterModService>(
            "StaticRouterModService"
        );
        this.httpResponseUtil = container.resolve<HttpResponseUtil>("HttpResponseUtil");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");

        this.customHealthRouter();
        // TODO: Fix custom pocket router
        // this.customPocketRouter();
    }

    public customPocketRouter(): void
    {
        this.logger.logWithColor(
            `${this.moduleName} - Custom pocket router enabled`,
            LogTextColor.RED
        );

        // we'll use this to make sure we only apply the custom pocket once
        let customPocketApplied = false;

        // Custom pocket hook
        this.staticRouterModService.registerStaticRouter(
            "EditPocket",
            [
                {
                    // server url to intercept
                    url: "/client/game/version/validate",
                    // info about the request
                    action: (url, info, sessionID) => 
                    {
                        let pocketsCheck = 0;
                        const pmcData = this.profileHelper.getPmcProfile(sessionID);

                        if (player_config.Big_Pockets.Enabled)
                        {
                            // so as to not apply the custom pocket more than once
                            if (customPocketApplied)
                            {
                                return this.httpResponseUtil.nullResponse();
                            }

                            try
                            {
                                // for each pocket item, change the _tpl to the custom pocket item
                                pmcData.Inventory.items.forEach((item) =>
                                {
                                    if (item.slotId === "Pockets")
                                    {
                                        pocketsCheck++;
                                        item._tpl = "CustomPocket";
                                    }
                                })

                                // if there are no pockets, add the custom pocket item
                                if (pocketsCheck == 0)
                                {
                                    pmcData.Inventory.items.push(
                                        {
                                            "_id": "EchoCustomPocket",
                                            "_tpl": "627a4e6b255f7527fb05a0f6", // pocket item id
                                            "parentId": pmcData.Inventory.equipment,
                                            "slotId": "Pockets"
                                        }
                                    )
                                }
                                customPocketApplied = true;
                                return this.httpResponseUtil.nullResponse();
                            }
                            catch (e)
                            {
                                this.logger.error("EchoTweaks - EditPocket - Unknown error: " + e);
                                return this.httpResponseUtil.nullResponse();
                            }
                        }
                        else
                        {
                            // reset pocket to default
                            try
                            {
                                pmcData.Inventory.items.forEach((item) =>
                                {
                                    if (item.slotId === "Pockets")
                                    {
                                        pocketsCheck++;
                                        item._tpl = "627a4e6b255f7527fb05a0f6";
                                    }
                                })
                                if (pocketsCheck == 0)
                                {
                                    pmcData.Inventory.items.push(
                                        {
                                            "_id": "EchoCustomPockets",
                                            "_tpl": "627a4e6b255f7527fb05a0f6", // pocket item id
                                            "parentId": pmcData.Inventory.equipment,
                                            "slotId": "Pockets"
                                        }
                                    )
                                }
                                customPocketApplied = false;
                                return this.httpResponseUtil.nullResponse();
                            }
                            catch (e)
                            {
                                this.logger.error("EchoTweaks - EditPocket - Unknown error: " + e);
                                return this.httpResponseUtil.nullResponse();
                            }
                        }
                    }
                }
            ],
            "aki"
        );
    }

    public customHealthRouter(): void
    {
        this.logger.logWithColor(
            `${this.moduleName} - Custom health router enabled`,
            LogTextColor.RED
        );

        

        // we'll use this to make sure we only apply the custom health once
        let customHealthApplied = false;

        // Custom player health hook
        this.staticRouterModService.registerStaticRouter(
            "EditHealth",
            [
                {
                    // server url to intercept
                    url: "/client/game/version/validate",
                    // info about the request
                    action: (url, info, sessionID) => 
                    {
                        try
                        {
                            const pmcData = this.profileHelper.getPmcProfile(sessionID);
                            // logger.logWithColor(pmcData, LogTextColor.CYAN);
                            if (player_config.Custom_Health.Enabled) 
                            {
                                if (customHealthApplied) 
                                {
                                    return this.httpResponseUtil.nullResponse();
                                }

                                pmcData.Health.BodyParts["Head"].Health.Maximum =
                                    player_config.Custom_Health.Head;
                                pmcData.Health.BodyParts["Head"].Health.Current =
                                    player_config.Custom_Health.Head;

                                pmcData.Health.BodyParts["Chest"].Health.Maximum =
                                    player_config.Custom_Health.Chest;
                                pmcData.Health.BodyParts["Chest"].Health.Current =
                                    player_config.Custom_Health.Chest;

                                pmcData.Health.BodyParts["Stomach"].Health.Maximum =
                                    player_config.Custom_Health.Stomach;
                                pmcData.Health.BodyParts["Stomach"].Health.Current =
                                    player_config.Custom_Health.Stomach;

                                pmcData.Health.BodyParts["LeftArm"].Health.Maximum =
                                    player_config.Custom_Health.LeftArm;
                                pmcData.Health.BodyParts["LeftArm"].Health.Current =
                                    player_config.Custom_Health.LeftArm;

                                pmcData.Health.BodyParts["LeftLeg"].Health.Maximum =
                                    player_config.Custom_Health.LeftLeg;
                                pmcData.Health.BodyParts["LeftLeg"].Health.Current =
                                    player_config.Custom_Health.LeftLeg;

                                pmcData.Health.BodyParts["RightArm"].Health.Maximum =
                                    player_config.Custom_Health.RightArm;
                                pmcData.Health.BodyParts["RightArm"].Health.Current =
                                    player_config.Custom_Health.RightArm;

                                pmcData.Health.BodyParts["RightLeg"].Health.Maximum =
                                    player_config.Custom_Health.RightLeg;
                                pmcData.Health.BodyParts["RightLeg"].Health.Current =
                                    player_config.Custom_Health.RightLeg;

                                this.logger.logWithColor(
                                    `${this.moduleName} - Player custom health enabled`,
                                    LogTextColor.CYAN
                                );
                                customHealthApplied = true;
                            }
                            else 
                            {
                                // reset health to default
                                pmcData.Health.BodyParts["Head"].Health.Maximum = 35;
                                pmcData.Health.BodyParts["Chest"].Health.Maximum = 85;
                                pmcData.Health.BodyParts["Stomach"].Health.Maximum = 70;
                                pmcData.Health.BodyParts["LeftArm"].Health.Maximum = 60;
                                pmcData.Health.BodyParts["LeftLeg"].Health.Maximum = 65;
                                pmcData.Health.BodyParts["RightArm"].Health.Maximum = 60;
                                pmcData.Health.BodyParts["RightLeg"].Health.Maximum = 65;
                                
                                // make sure current health is not higher than max health
                                for (const bodyPart in pmcData.Health.BodyParts)
                                {
                                    if (pmcData.Health.BodyParts[bodyPart].Health.Current > pmcData.Health.BodyParts[bodyPart].Health.Maximum)
                                    {
                                        pmcData.Health.BodyParts[bodyPart].Health.Current = pmcData.Health.BodyParts[bodyPart].Health.Maximum
                                    }
                                }

                                this.logger.logWithColor(
                                    `${this.moduleName} - Player default health`,
                                    LogTextColor.CYAN
                                );
                                
                                // reset the flag so we can apply the custom health again
                                customHealthApplied = false;
                            }
                            // return null response because all we did was modify the pmcData
                            return this.httpResponseUtil.nullResponse();
                        }
                        catch (e) 
                        {
                            this.logger.error("EchoTweaks - EditHealth - Unknown error: " + e);
                            return this.httpResponseUtil.nullResponse();
                        }
                    }
                }
            ],
            "aki"
        );
    }
}

export { EchoRouters };