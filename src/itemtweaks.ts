import item_config from "../configs/item_config.json"
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { IGlobals } from "@spt-aki/models/eft/common/IGlobals";

class EchoItemTweaks
{
    modName = "EchoTweaks";
    moduleName = "ItemTweaks";

    container: DependencyContainer;
    logger: ILogger;
    dataBase: IDatabaseTables;

    items: IDatabaseTables["templates"]["items"];
    globals: IGlobals["config"];

    configServer: ConfigServer;
    botConfig: any;
    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;

        this.items = dataBase.templates.items;
        this.globals = dataBase.globals.config;
        
        this.botConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.BOT);
    }

    public init(): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //* Secure container ammo stack count
        if (item_config.Tweak_Secure_Container_Ammo_Stack_Count)
        {
            this.botConfig.secureContainerAmmoStackCount = item_config.Tweak_Secure_Container_Ammo_Stack_Count.Ammo_Stack_Count;
            this.logger.logWithColor(
                `${this.modName} - Updated Secure Container Ammo Stack Count`,
                LogTextColor.GREEN
            );
        }

        //*Examine everything other than keys
        if (item_config.Examine_Everything === true) 
        {
            const parents = ["5c99f98d86f7745c314214b3", "5c164d2286f774194c5e69fa"];

            for (const i in this.items) 
            {
                const item = this.items[i];
                if (parents.includes(item._parent)) 
                {
                    item._props.ExaminedByDefault = false;
                }
                else 
                {
                    item._props.ExaminedByDefault = true;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Examine Everything Enabled`,
                LogTextColor.GREEN
            );
        }

        //* High cap mags only two slots
        if (item_config.Lil_Big_Mags) 
        {
            for (const i in this.items) 
            {
                const item = this.items[i];
                if (
                    item._parent === "5448bc234bdc2d3c308b4569" &&
                    item._props.Height > 2
                ) 
                {
                    item._props.Height = 2;
                }
                if (item._id === "5d2f213448f0355009199284") 
                {
                    item._props.Height = 1;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Lil Big Mags Enabled`,
                LogTextColor.GREEN
            );
        }

        //*Change Item Case and THICC Case to hold Grenade Cases
        if (item_config.Tweak_Cases.Enabled) 
        {
            //Add Grenade Case to Item Case
            this.items[
                "59fb042886f7746c5005a7b2"
            ]._props.Grids[0]._props.filters[0].Filter.push(
                "5e2af55f86f7746d4159f07c"
            );
            //Add Grenade Case to THICC Case
            this.items[
                "5c0a840b86f7742ffa4f2482"
            ]._props.Grids[0]._props.filters[0].Filter.push(
                "5e2af55f86f7746d4159f07c"
            );
            this.logger.logWithColor(
                `${this.moduleName} - Updated Case Filters`,
                LogTextColor.GREEN
            );
        }

        //*Change Meds
        if (item_config.Tweak_Meds.Enabled) 
        {
            //Analgin painkillers
            const analgin = this.items["544fb37f4bdc2dee738b4567"];
            analgin._props.effects_damage.Pain.duration = 95;
            //Augmentin antibiotic pills
            this.items["590c695186f7741e566b64a2"]._props.effects_health[
                "Energy"
            ].value = 15; // 5
            this.items["590c695186f7741e566b64a2"]._props.effects_health[
                "Hydration"
            ].value = -20; // -5
            //Morphine injector
            this.items["544fb3f34bdc2d03748b456a"]._props.effects_health["Energy"].value =
                -5; // -10
            this.items["544fb3f34bdc2d03748b456a"]._props.effects_health[
                "Hydration"
            ].value = -10; // -15
            //Ibuprofen painkillers
            this.items["5af0548586f7743a532b7e99"]._props.effects_health[
                "Hydration"
            ].value = -15; // -17
            //Vaseline balm
            this.items["5755383e24597772cb798966"]._props.MaxHpResource = 6;
            this.items["5755383e24597772cb798966"]._props.effects_health["Energy"].value =
                -5; // -9
            this.items["5755383e24597772cb798966"]._props.effects_health[
                "Hydration"
            ].value = -5; // -9
            //Golden Star balm
            this.items["5751a89d24597722aa0e8db0"]._props.effects_health["Energy"].value =
                -15;
            this.items[
                "5751a89d24597722aa0e8db0"
            ]._props.effects_damage.Pain.duration = 350;
            this.logger.logWithColor(`${this.moduleName} - Updated Meds`, LogTextColor.GREEN);

            if (item_config.Tweak_Meds.Goldenstar_Remove_Contusion === true) 
            {
                //Golden Star balm
                this.globals.Health.Effects.Stimulator.Buffs.BuffsGoldenStarBalm =
                    JSON.parse(
                        "[{\"BuffType\": \"EnergyRate\",\"Chance\": 1,\"Delay\": 1,\"Duration\": 5,\"Value\": 1,\"AbsoluteValue\": true,\"SkillName\": \"\"},{\"BuffType\": \"HydrationRate\",\"Chance\": 1,\"Delay\": 1,\"Duration\": 5,\"Value\": 1,\"AbsoluteValue\": true,\"SkillName\": \"\"}]"
                    );
                this.items["5751a89d24597722aa0e8db0"]._props.effects_damage = JSON.parse(
                    "{\"Pain\": {\"delay\": 1,\"duration\": 350,\"fadeOut\": 20},\"RadExposure\": {\"delay\": 0,\"duration\": 400,\"fadeOut\": 20}}"
                );
                this.logger.logWithColor(
                    `${this.moduleName} - Removed contusion Golden Star Balm`,
                    LogTextColor.GREEN
                );
            }
        }

        //* Change Caze Sizes and Eliminate Filters
        if (item_config.Tweak_Cases.Enabled === true) 
        {
            const cases = item_config.Tweak_Cases.Cases;
            const secCon = item_config.Tweak_Cases.SecureContainers;
            const casesID = [
                "59fb016586f7746d0d4b423a",
                "5783c43d2459774bbe137486",
                "60b0f6c058e0b0481a09ad11",
                "5e2af55f86f7746d4159f07c",
                "59fb042886f7746c5005a7b2",
                "59fb023c86f7746d0d4b423c",
                "5b7c710788a4506dec015957",
                "5aafbde786f774389d0cbc0f",
                "5c127c4486f7745625356c13",
                "5c093e3486f77430cb02e593",
                "5aafbcd986f7745e590fff23",
                "5c0a840b86f7742ffa4f2482",
                "5b6d9ce188a4501afc1b2b25",
                "5d235bb686f77443f4331278",
                "59fafd4b86f7745ca07e1232",
                "590c60fc86f77412b13fddcf",
                "567143bf4bdc2d1a0f8b4567",
                "5c093db286f7740a1b2617e3",
                "619cbf7d23893217ec30b689",
                "619cbf9e0a7c3a1a2731940a"
            ];
            const secConID = [
                "544a11ac4bdc2d470e8b456a",
                "5c093ca986f7740a1867ab12",
                "5857a8b324597729ab0a0e7d",
                "59db794186f77448bc595262",
                "5857a8bc2459772bad15db29"
            ];
            const vSize = [
                cases.MoneyCase.VSize,
                cases.SimpleWallet.VSize,
                cases.WZWallet.VSize,
                cases.GrenadeCase.VSize,
                cases.ItemsCase.VSize,
                cases.WeaponCase.VSize,
                cases.LuckyScav.VSize,
                cases.AmmunitionCase.VSize,
                cases.MagazineCase.VSize,
                cases.DogtagCase.VSize,
                cases.MedicineCase.VSize,
                cases.ThiccItemsCase.VSize,
                cases.ThiccWeaponCase.VSize,
                cases.SiccCase.VSize,
                cases.Keytool.VSize,
                cases.DocumentsCase.VSize,
                cases.PistolCase.VSize,
                cases.Holodilnick.VSize,
                cases.InjectorCase.VSize,
                cases.KeycardHolderCase.VSize
            ];
            const hSize = [
                cases.MoneyCase.HSize,
                cases.SimpleWallet.HSize,
                cases.WZWallet.HSize,
                cases.GrenadeCase.HSize,
                cases.ItemsCase.HSize,
                cases.WeaponCase.HSize,
                cases.LuckyScav.HSize,
                cases.AmmunitionCase.HSize,
                cases.MagazineCase.HSize,
                cases.DogtagCase.HSize,
                cases.MedicineCase.HSize,
                cases.ThiccItemsCase.HSize,
                cases.ThiccWeaponCase.HSize,
                cases.SiccCase.HSize,
                cases.Keytool.HSize,
                cases.DocumentsCase.HSize,
                cases.PistolCase.HSize,
                cases.Holodilnick.HSize,
                cases.InjectorCase.HSize,
                cases.KeycardHolderCase.HSize
            ];
            const secVsize = [
                secCon.Alpha.VSize,
                secCon.Kappa.VSize,
                secCon.Beta.VSize,
                secCon.Epsilon.VSize,
                secCon.Gamma.VSize
            ];
            const secHsize = [
                secCon.Alpha.HSize,
                secCon.Kappa.HSize,
                secCon.Beta.HSize,
                secCon.Epsilon.HSize,
                secCon.Gamma.HSize
            ];
            const filters = [
                cases.MoneyCase.Filter,
                cases.SimpleWallet.Filter,
                cases.WZWallet.Filter,
                cases.GrenadeCase.Filter,
                cases.ItemsCase.Filter,
                cases.WeaponCase.Filter,
                cases.LuckyScav.Filter,
                cases.AmmunitionCase.Filter,
                cases.MagazineCase.Filter,
                cases.DogtagCase.Filter,
                cases.MedicineCase.Filter,
                cases.ThiccItemsCase.Filter,
                cases.ThiccWeaponCase.Filter,
                cases.SiccCase.Filter,
                cases.Keytool.Filter,
                cases.DocumentsCase.Filter,
                cases.PistolCase.Filter,
                cases.Holodilnick.Filter,
                cases.InjectorCase.Filter,
                cases.KeycardHolderCase.Filter
            ];

            for (const cCase in casesID) 
            {
                this.items[casesID[cCase]]._props.Grids[0]._props["cellsV"] = vSize[cCase];
                this.items[casesID[cCase]]._props.Grids[0]._props["cellsH"] = hSize[cCase];
            }
            for (const secConts in secConID) 
            {
                this.items[secConID[secConts]]._props.Grids[0]._props["cellsV"] =
                    secVsize[secConts];
                this.items[secConID[secConts]]._props.Grids[0]._props["cellsH"] =
                    secHsize[secConts];
            }
            for (const filter in filters) 
            {
                if (item_config.Tweak_Cases.Disable_Filters === true) 
                {
                    this.items[casesID[filter]]._props.Grids[0]._props["filter"] = "";
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Case Sizes`,
                LogTextColor.GREEN
            );
        }

        //* Stackable Barters
        if (item_config.Stackable_Barters.Enabled === true) 
        {
            for (const id in this.items) 
            {
                const base = this.items[id];
                switch (base._parent) 
                {
                    //Battery
                    case "57864ee62459775490116fc1":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Battery
                        );
                        break;
                    //Building materials
                    case "57864ada245977548638de91":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Building_Materials
                        );
                        break;
                    //Electronics
                    case "57864a66245977548f04a81f":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Electronics
                        );
                        break;
                    //Household goods
                    case "57864c322459775490116fbf":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Household_Goods
                        );
                        break;
                    // Valuables
                    case "57864a3d24597754843f8721":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Valuables
                        );
                        break;
                    //Medical supplies
                    case "57864c8c245977548867e7f1":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Med_Supplies
                        );
                        break;
                    //Flammable
                    case "57864e4c24597754843f8723":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Fuel
                        );
                        break;
                    //Tools
                    case "57864bb7245977548b3b66c2":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Tools
                        );
                        break;
                    //Other
                    case "590c745b86f7743cc433c5f2":
                        this.editSimpleItemData(
                            id,
                            "StackMaxSize",
                            item_config.Stackable_Barters.Other
                        );
                        break;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Barter Stack Size`,
                LogTextColor.GREEN
            );
        }
    }

    public editSimpleItemData(id: string, data: string, value: number | boolean): void 
    {
        if (this.items[id]._props[data] !== undefined) 
        {
            this.items[id]._props[data] = value;
        }
    }
}

export { EchoItemTweaks };