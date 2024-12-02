
import player_config from "../configs/player_config.json";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { HttpResponseUtil } from "@spt/utils/HttpResponseUtil";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { INullResponseData } from "@spt/models/eft/httpResponse/INullResponseData";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

class EchoRouters
{
    modName = "EchoTweaks";
    moduleName = "EchoRouters"

    logger: ILogger;
    staticRouterModService: StaticRouterModService;
    httpResponseUtil: HttpResponseUtil;
    profileHelper: ProfileHelper;

    customHealthApplied = false;

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
    }

    public customHealthRouter(): void
    {
        this.logger.logWithColor(
            `${this.moduleName} - Custom health router enabled`,
            LogTextColor.RED
        );


        this.staticRouterModService.registerStaticRouter(
            "EchoTweaks - EditHealth",
            [
                {
                    url: "/client/game/version/validate",
                    action: (url, info, sessionID) =>
                    {
                        return new Promise<INullResponseData>((resolve, reject) =>
                        {
                            try
                            {
                                const pmcData = this.profileHelper.getPmcProfile(sessionID);
                                if (player_config.Custom_Health.Enabled) 
                                {
                                    if (this.customHealthApplied) 
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
                                    this.customHealthApplied = true;
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

                                    this.logger.logWithColor(
                                        `${this.moduleName} - Player default health`,
                                        LogTextColor.CYAN
                                    );

                                    // reset the flag so we can apply the custom health again
                                    this.customHealthApplied = false;
                                }

                                // make sure current health is not higher than max health
                                for (const bodyPart in pmcData.Health.BodyParts)
                                {
                                    if (pmcData.Health.BodyParts[bodyPart].Health.Current > pmcData.Health.BodyParts[bodyPart].Health.Maximum)
                                    {
                                        pmcData.Health.BodyParts[bodyPart].Health.Current = pmcData.Health.BodyParts[bodyPart].Health.Maximum
                                    }
                                }
                                resolve(this.httpResponseUtil.nullResponse());
                            }
                            catch (e) 
                            {
                                this.logger.error("EchoTweaks - EditHealth - Unknown error: " + e);
                                resolve(this.httpResponseUtil.nullResponse());
                            }
                        });
                    }
                }
            ],
            "yeet"
        );
    }
}

export { EchoRouters };