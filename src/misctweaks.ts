import misc_config from "../configs/misc_config.json";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

class EchoMiscTweaks
{
    modName = "EchoTweaks";
    moduleName = "MiscTweaks";

    container: DependencyContainer;
    logger: ILogger;
    dataBase: IDatabaseTables;
    items: IDatabaseTables["templates"]["items"];
    globals: IDatabaseTables["globals"]["config"];
    traders: IDatabaseTables["traders"];
    therapist: IDatabaseTables["traders"]["therapist"];
    prapor: IDatabaseTables["traders"]["prapor"];

    ragfairConfig: any;
    insuranceConfig: any;
    questConfig: any;
    inventoryConfig: any;
    traderConfig: any;

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;
        this.globals = dataBase.globals.config;
        this.items = dataBase.templates.items;

        this.traders = dataBase.traders;
        // this.therapist = dataBase.traders.therapist;
        this.therapist = dataBase.traders["54cb57776803fa99248b456e"]
        // this.prapor = dataBase.traders.prapor;
        this.prapor = dataBase.traders["54cb50c76803fa8b248b4571"]

        this.ragfairConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.RAGFAIR)
        this.insuranceConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.INSURANCE)
        this.questConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.QUEST)
        this.inventoryConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.INVENTORY)
        this.traderConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.TRADER)
    }

    public init(): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //* Disable flea blacklist
        if (misc_config.Disable_Blacklist === true) 
        {
            let canSellCount = 0;
            this.ragfairConfig.dynamic.blacklist.enableBsgList = false;

            for (const itemKey in this.items) 
            {
                const itemDetails = this.items[itemKey];
                if (
                    itemDetails._type === "Item" &&
                    !itemDetails._props.CanSellOnRagfair
                ) 
                {
                    itemDetails._props.CanSellOnRagfair = true;
                    canSellCount++;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Disabled Blacklist for ${canSellCount} items`,
                LogTextColor.GREEN
            );
        }

        //*Change Insurance Price Multiplier, Return Chance, and Max Storage Time.
        if (misc_config.Tweak_Insurance.Enabled === true) 
        {
            this.insuranceConfig.priceMultiplier =
                misc_config.Tweak_Insurance.Price_Multiplier;
            this.insuranceConfig.returnChance = misc_config.Tweak_Insurance.Return_Chance;

            this.therapist.base.insurance.min_return_hour = 0;
            this.therapist.base.insurance.max_return_hour = 0;
            this.prapor.base.insurance.min_return_hour = 0;
            this.prapor.base.insurance.max_return_hour = 0;

            this.globals.Insurance.MaxStorageTimeInHour =
                misc_config.Tweak_Insurance.Max_Storage_Time;

            this.logger.logWithColor(
                `${this.moduleName} - Updated Insurance Settings`,
                LogTextColor.GREEN
            );
        }

        //*Change Quest Redeem Tme
        if (misc_config.Tweak_Quest_Redeem_Time.Enabled === true) 
        {
            this.questConfig.redeemTime = misc_config.Tweak_Quest_Redeem_Time.Redeem_Time;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Quest Redeem Time`,
                LogTextColor.GREEN
            );
        }

        //*Mark New Items FIR
        if (misc_config.New_Items_Marked_FIR === true) 
        {
            this.inventoryConfig.newItemsMarkedFound = true;
            this.logger.logWithColor(
                `${this.moduleName} - New Items Marked FIR`,
                LogTextColor.GREEN
            );
        }

        //*Change Fence Assort Size, Min Durability, and Refresh Time
        if (misc_config.Tweak_Fence_Assort.Enabled === true) 
        {
            this.traderConfig.fenceAssortSize = misc_config.Tweak_Fence_Assort.Assort_Size;
            this.traderConfig.minDurabilityForSale =
                misc_config.Tweak_Fence_Assort.Min_Durability;
            this.traderConfig.UpdateTime = misc_config.Tweak_Fence_Assort.Refresh_Time;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Fence Assort Settings`,
                LogTextColor.GREEN
            );
        }

        //* Holster SMGs
        if (misc_config.Holster_SMGs === true) 
        {
            const inventory = this.items["55d7217a4bdc2d86028b456d"];
            const holster = inventory._props.Slots[2];

            holster._props.filters[0].Filter.push("5447b5e04bdc2d62278b4567");
            this.logger.logWithColor(
                `${this.moduleName} - Holster SMGs`,
                LogTextColor.GREEN
            );
        }

        //* Bigger Ammo Stacks
        if (misc_config.Tweak_Ammo_Stacks.Enabled === true) 
        {
            for (const ammo in this.items) 
            {
                if (this.items[ammo]._parent === "5485a8684bdc2da71d8b4567") 
                {
                    this.items[ammo]._props.StackMaxSize *=
                        misc_config.Tweak_Ammo_Stacks.Stack_Size_Multi;
                    this.items[ammo]._props.Weight /=
                        misc_config.Tweak_Ammo_Stacks.Stack_Size_Multi;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Ammo Stacks`,
                LogTextColor.GREEN
            );
        }

        //* Bigger Money Stacks
        if (misc_config.Tweak_Money_Stacks.Enabled === true) 
        {
            const euros = this.items["569668774bdc2da2298b4568"]; //Euros
            const usd = this.items["5696686a4bdc2da3298b456a"]; //USD
            const roubles = this.items["5449016a4bdc2d6f028b456f"]; //Roubles

            euros._props.StackMaxSize =
                misc_config.Tweak_Money_Stacks.EUR_Max_Stack_Size;
            usd._props.StackMaxSize =
                misc_config.Tweak_Money_Stacks.USD_Max_Stack_Size;
            roubles._props.StackMaxSize =
                misc_config.Tweak_Money_Stacks.RUB_Max_Stack_Size;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Money Stacks`,
                LogTextColor.GREEN
            );
        }

        //* Better Hearing
        if (misc_config.Tweak_Hearing === true) 
        {
            for (const item in this.items) 
            {
                if (this.items[item]._props.DeafStrength) 
                {
                    this.items[item]._props.DeafStrength = "None";
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Hearing Settings`,
                LogTextColor.GREEN
            );
        }

        //*Wear Rigs with Armor
        if (misc_config.Wear_Rigs_With_Armor === true) 
        {
            for (const id in this.items) 
            {
                this.editSimpleItemData(id, "BlocksArmorVest", false);
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Wear Rigs with Armor Settings`,
                LogTextColor.GREEN
            );
        }
    }

    public editSimpleItemData(id: string, prop: string, value: any): void
    {
        if (this.items[id]._props[prop] !== undefined) 
        {
            this.items[id]._props[prop] = value;
        }
    }
}

export { EchoMiscTweaks }