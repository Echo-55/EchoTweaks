import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { DependencyContainer } from "@spt/models/external/tsyringe";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import { EchoRouters } from "./routers";
import { EchoItemTweaks } from "./itemtweaks";
import { EchoMapTweaks } from "./maptweaks";
import { EchoMiscTweaks } from "./misctweaks";
import { EchoRaidTweaks } from "./raidtweaks";
import { EchoBotTweaks } from "./bottweaks";
import { EchoPlayerTweaks } from "./playertweaks";
import { EchoHideoutTweaks } from "./hideouttweaks";

class EchoTweaks implements IPostDBLoadMod, IPreSptLoadMod
{
    modName = "EchoTweaks";

    public preSptLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const routers = new EchoRouters(container, logger);
        routers.init(container);
    }

    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const dataBase: IDatabaseTables = container.resolve<DatabaseServer>("DatabaseServer").getTables();

        /* -------------------------------------------------------------------------- */
        /*                             SECTION Item Changes                            */
        /* -------------------------------------------------------------------------- */
        const itemTweaks = new EchoItemTweaks(container, logger, dataBase);
        itemTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                             SECTION Map Changes                            */
        /* -------------------------------------------------------------------------- */

        const mapTweaks = new EchoMapTweaks(container, logger, dataBase);
        mapTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                            SECTION Raid Changes                            */
        /* -------------------------------------------------------------------------- */

        const raidTweaks = new EchoRaidTweaks(container, logger, dataBase);
        raidTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                             SECTION Bot Changes                            */
        /* -------------------------------------------------------------------------- */

        const botTweaks = new EchoBotTweaks(container, logger, dataBase);
        botTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                            SECTION Misc Changes                            */
        /* -------------------------------------------------------------------------- */

        const miscTweaks = new EchoMiscTweaks(container, logger, dataBase);
        miscTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                           SECTION Player changes                           */
        /* -------------------------------------------------------------------------- */

        const playerTweaks = new EchoPlayerTweaks(container, logger, dataBase);
        playerTweaks.init();

        /* -------------------------------------------------------------------------- */
        /*                           SECTION Hideout changes                          */
        /* -------------------------------------------------------------------------- */

        const hideoutTweaks = new EchoHideoutTweaks(container, logger, dataBase);
        hideoutTweaks.init();
    }
}

module.exports = { mod: new EchoTweaks() };
