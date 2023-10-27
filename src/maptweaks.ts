import map_config from "../configs/map_config.json";
import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { stringify } from "querystring";


class EchoMapTweaks
{
    modName = "EchoTweaks";
    moduleName = "MapTweaks";

    container: DependencyContainer;
    logger: ILogger;
    dataBase: IDatabaseTables;
    locations: IDatabaseTables["locations"];
    globals: IDatabaseTables["globals"]["config"];
    items: IDatabaseTables["templates"]["items"];

    configServer: ConfigServer;
    airDropConfig: any;
    locationConfig: any;
    weatherConfig: any;

    public constructor(container: DependencyContainer, logger: ILogger, dataBase: IDatabaseTables)
    {
        this.logger = logger;

        this.locations = dataBase.locations;
        this.globals = dataBase.globals.config;
        this.items = dataBase.templates.items;

        this.airDropConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.AIRDROP)
        this.locationConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.LOCATION)
        this.weatherConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<any>(ConfigTypes.WEATHER)
    }

    public init(): void
    {
        this.logger.logWithColor(
            `${this.modName} - ${this.moduleName} Initialized`,
            LogTextColor.RED
        );
        //* Tweak Airdrops in map json
        if (map_config.Tweak_Airdrops.Enabled)
        {
            for (const map in this.locations)
            {
                if (map !== "base")
                {
                    for (const x in this.locations[map].base.AirdropParameters)
                    {
                        // Airdrop chance
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropChance =
                            map_config.Tweak_Airdrops.Plane_Airdrop_Chance;
                        // Max airdrops
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropMax = 
                            map_config.Tweak_Airdrops.Max_Airdrops;
                        // Airdrop start and cooldown
                        // Start min
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropStartMin =
                            map_config.Tweak_Airdrops.Plane_Airdrop_Start_Min;
                        // Start max
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropStartMax =
                            map_config.Tweak_Airdrops.Plane_Airdrop_Start_Max;
                        // Cooldown min
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropCooldownMin =
                            map_config.Tweak_Airdrops.Plane_Airdrop_Cooldown_Min;
                        // Cooldown max
                        this.locations[map].base.AirdropParameters[x].PlaneAirdropCooldownMax =
                            map_config.Tweak_Airdrops.Plane_Airdrop_Cooldown_Max;
                        // Min players to spawn airdrop
                        this.locations[map].base.AirdropParameters[x].MinPlayersCountToSpawnAirdrop =
                            map_config.Tweak_Airdrops.Min_Players_Count_To_Spawn_Airdrop;
                    }
                }
            }
            //* Tweak Airdrops in airdropConfig
            // Airdrop chance on all maps
            for (const map in this.airDropConfig.airdropChancePercent) 
            {
                this.airDropConfig.airdropChancePercent[map] = map_config.Tweak_Airdrops.Plane_Airdrop_Chance
            }
            // Plane volume
            this.airDropConfig.planeVolume = map_config.Tweak_Airdrops.Plane_Volume;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Airdrops`,
                LogTextColor.GREEN
            );
        }

        //* Change loot modifiers
        if (map_config.Tweak_Loot_Modifier.Enabled) 
        {
            this.globals.GlobalLootChanceModifier =
                map_config.Tweak_Loot_Modifier.Global_Loot_Chance_Modifier;
            this.logger.logWithColor(
                `${this.moduleName} - Global Loot Chance Modifier set to ${this.globals.GlobalLootChanceModifier}`,
                LogTextColor.GREEN
            );

            for (const map in this.locationConfig.looseLootMultiplier) 
            {
                this.locationConfig.looseLootMultiplier[map] = map_config.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier
            }

            for (const map in this.locationConfig.staticLootMultiplier) 
            {
                this.locationConfig.staticLootMultiplier[map] = map_config.Tweak_Loot_Modifier.All_Maps_StaticLoot_Modifier
            }

            // for (const map in locations)
            // {
            //     if (locations[map].base && locations[map].looseLoot)
            //     {
            //         const locationBase: ILocationData['base'] = locations[map].base
            //         const locationLooseLoot: ILocationData['looseLoot'] = locations[map].looseLoot
            //         locationBase.GlobalLootChanceModifier = map_config.Tweak_Loot_Modifier.Global_Loot_Chance_Modifier
            //         locationLooseLoot.spawnpointCount.mean *= map_config.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier
            //         locationLooseLoot.spawnpointCount.std *= map_config.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier
            //         locationLooseLoot.spawnpoints.forEach(spawnPoint => {
            //             spawnPoint.probability = 1
            //             spawnPoint.itemDistribution.forEach(itemDist => itemDist.relativeProbability = 100)
            //         })
            //         logger.logWithColor(`${this.modName} - ${locationBase.GlobalLootChanceModifier}`, LogTextColor.RED)
            //     }
            // }
        }

        //*Disable Rain and Fog
        if (map_config.Tweak_Weather === true) 
        {
            this.weatherConfig.weather.rain.min = 0;
            this.weatherConfig.weather.rain.max = 2;
            this.weatherConfig.weather.fog.max = 0.01;
            this.logger.logWithColor(
                `${this.moduleName} - Updated Weather: Rain: ${this.weatherConfig.weather.rain.min} - ${this.weatherConfig.weather.rain.max} Fog: ${this.weatherConfig.weather.fog.max}`,
                LogTextColor.GREEN
            );
        }

        //*Remove Labs Entry Card Requirement
        if (map_config.Remove_Labs_Keycard_Requirement) 
        {
            this.locations["laboratory"].base.AccessKeys = [];
            this.logger.logWithColor(
                `${this.moduleName} - Removed Labs Keycard Requirement`,
                LogTextColor.GREEN
            );
        }

        //*Change spawned weapon loose loot min/max durability
        if (map_config.Tweak_LooseLoot_Weapon_Durability.Enabled) 
        {
            for (const id in this.items) 
            {
                //Maximum durability
                if (
                    (this.items[id]._parent == "5447b5cf4bdc2d65278b4567" ||
                    this.items[id]._parent == "5447b6254bdc2dc3278b4568" ||
                    this.items[id]._parent == "5447b5f14bdc2d61278b4567" ||
                    this.items[id]._parent == "5447bed64bdc2d97278b4568" ||
                    this.items[id]._parent == "5447b6094bdc2dc3278b4567" ||
                    this.items[id]._parent == "5447b5e04bdc2d62278b4567" ||
                    this.items[id]._parent == "5447b6194bdc2d67278b4567") &&
                    this.items[id]._props.durabSpawnMax !== undefined
                ) 
                {
                    this.items[id]._props.durabSpawnMax =
                        map_config.Tweak_LooseLoot_Weapon_Durability.Max_Durability;
                }
                //Minimum durability
                if (
                    (this.items[id]._parent == "5447b5cf4bdc2d65278b4567" ||
                    this.items[id]._parent == "5447b6254bdc2dc3278b4568" ||
                    this.items[id]._parent == "5447b5f14bdc2d61278b4567" ||
                    this.items[id]._parent == "5447bed64bdc2d97278b4568" ||
                    this.items[id]._parent == "5447b6094bdc2dc3278b4567" ||
                    this.items[id]._parent == "5447b5e04bdc2d62278b4567" ||
                    this.items[id]._parent == "5447b6194bdc2d67278b4567") &&
                    this.items[id]._props.durabSpawnMin !== undefined
                ) 
                {
                    this.items[id]._props.durabSpawnMin =
                        map_config.Tweak_LooseLoot_Weapon_Durability.Min_Durability;
                }
            }
            this.logger.logWithColor(
                `${this.moduleName} - Updated Loose Loot Weapon Durability: Min: ${map_config.Tweak_LooseLoot_Weapon_Durability.Min_Durability} Max: ${map_config.Tweak_LooseLoot_Weapon_Durability.Max_Durability}`,
                LogTextColor.GREEN
            );
        }
    }
}

export { EchoMapTweaks }