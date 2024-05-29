import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DependencyContainer } from "tsyringe";


export abstract class EchoBaseTweak
{
    modName: string = "EchoTweaks";
    logColor: LogTextColor = LogTextColor.GREEN;
    abstract moduleName: string;
    container: DependencyContainer;
    logger: ILogger;

    configServer: ConfigServer;

    dataBase: IDatabaseTables;
    globalsConfig: IDatabaseTables["globals"]["config"];
    botConfig: IBotConfig;
    itemsData: IDatabaseTables["templates"]["items"];
    hideoutData: IDatabaseTables["hideout"];
    locationsData: IDatabaseTables["locations"];

    constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.container = container;
        this.logger = logger;

        this.configServer = container.resolve<ConfigServer>("ConfigServer");
        this.botConfig = this.configServer.getConfig<any>(ConfigTypes.BOT)

        this.dataBase = dataBase;
        this.globalsConfig = dataBase.globals.config;
        this.itemsData = dataBase.templates.items;
        this.hideoutData = dataBase.hideout;
        this.locationsData = dataBase.locations;
    }

    public init(): void
    {
        this.logInit();
    }

    public logInit(): void
    {
        this.logToConsole(this.moduleName + " initialized", LogTextColor.CYAN);
    }

    public logToConsole(message: string, color: LogTextColor=this.logColor): void
    {
        this.logger.logWithColor(message, color);
    }

    public editSimpleItemData(id: string, data: string, value: number | boolean): void 
    {
        if (this.itemsData[id]._props[data] !== undefined) 
        {
            this.itemsData[id]._props[data] = value;
        }
    }
}