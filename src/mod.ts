import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import { EchoRouters } from "./routers";
import { EchoItemTweaks } from "./itemtweaks";
import { EchoMapTweaks } from "./maptweaks";
import { EchoMiscTweaks } from "./misctweaks";
import { EchoRaidTweaks } from "./raidtweaks";
import { EchoBotTweaks } from "./bottweaks";
import { EchoPlayerTweaks } from "./playertweaks";
import { EchoHideoutTweaks } from "./hideouttweaks";

class EchoTweaks implements IPostDBLoadMod, IPreAkiLoadMod
{
    modName = "EchoTweaks";

    public preAkiLoad(container: DependencyContainer): void
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

        // TODO Testing changing background color of attachments FIR based on value
        // const prices = DB.templates.prices
        // let parents = ['']
        // for (const item in items)
        // {
        //     if (items[item]._parent === '5448fe124bdc2da5018b4567')
        //     {
        //         if (prices[items[item]._id])
        //         {
        //             let left = items[item]._props.ExtraSizeLeft
        //             let right = items[item]._props.ExtraSizeRight
        //             let up = items[item]._props.ExtraSizeUp
        //             let down = items[item]._props.ExtraSizeDown
        //             // TODO this is bad but it should work bc no mods are 2x2 (i think)
        //             let total_size = 1 + left + right + up + down
        //             let item_price = total_size > 1 ? prices[item] / total_size : prices[item] 
        //             if (item_price > 10000)
        //             {
        //                 items[item]._props.BackgroundColor = 'yellow'
        //             }
        //         }
        //     }
        // }

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
