"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const config = require("../config.json");
class EchoTweaks {
    constructor() {
        this.modName = 'EchoTweaks';
    }
    preAkiLoad(container) {
        const logger = container.resolve('WinstonLogger');
        // const config = require('../config.json');
        const staticRouterModService = container.resolve('StaticRouterModService');
        const HttpResponse = container.resolve('HttpResponseUtil');
        const profileHelper = container.resolve('ProfileHelper');
        staticRouterModService.registerStaticRouter('EditHealth', [
            {
                url: '/client/game/version/validate',
                action: (url, info, sessionID) => {
                    try {
                        const pmcData = profileHelper.getPmcProfile(sessionID);
                        // logger.logWithColor(pmcData, LogTextColor.CYAN);
                        if (config.Player.Custom_Health.Enabled) {
                            pmcData.Health.BodyParts['Head'].Health.Maximum =
                                config.Player.Custom_Health.Head;
                            pmcData.Health.BodyParts['Chest'].Health.Maximum =
                                config.Player.Custom_Health.Chest;
                            pmcData.Health.BodyParts['Stomach'].Health.Maximum =
                                config.Player.Custom_Health.Stomach;
                            pmcData.Health.BodyParts['LeftArm'].Health.Maximum =
                                config.Player.Custom_Health.LeftArm;
                            pmcData.Health.BodyParts['LeftLeg'].Health.Maximum =
                                config.Player.Custom_Health.LeftLeg;
                            pmcData.Health.BodyParts['RightArm'].Health.Maximum =
                                config.Player.Custom_Health.RightArm;
                            pmcData.Health.BodyParts['RightLeg'].Health.Maximum =
                                config.Player.Custom_Health.RightLeg;
                            logger.logWithColor(`${this.modName} - Player custom health enabled`, LogTextColor_1.LogTextColor.CYAN);
                        }
                        else {
                            pmcData.Health.BodyParts['Head'].Health.Maximum = 35;
                            pmcData.Health.BodyParts['Chest'].Health.Maximum = 85;
                            pmcData.Health.BodyParts['Stomach'].Health.Maximum = 70;
                            pmcData.Health.BodyParts['LeftArm'].Health.Maximum = 60;
                            pmcData.Health.BodyParts['LeftLeg'].Health.Maximum = 65;
                            pmcData.Health.BodyParts['RightArm'].Health.Maximum = 60;
                            pmcData.Health.BodyParts['RightLeg'].Health.Maximum = 65;
                            logger.logWithColor(`${this.modName} - Player default health`, LogTextColor_1.LogTextColor.CYAN);
                        }
                        return HttpResponse.nullResponse();
                    }
                    catch (e) {
                        logger.error('EchoTweaks - EditHealth - Unknown error: ' + e);
                        return HttpResponse.nullResponse();
                    }
                }
            }
        ], 'aki');
    }
    postDBLoad(container) {
        const logger = container.resolve('WinstonLogger');
        const DB = container.resolve('DatabaseServer').getTables();
        const items = DB.templates.items;
        const hideout = DB.hideout;
        const locations = DB.locations;
        const suits = DB.templates.customization;
        const globals = DB.globals.config;
        const traders = DB.traders;
        const therapist = traders['54cb57776803fa99248b456e'];
        const prapor = traders['54cb50c76803fa8b248b4571'];
        const configServer = container.resolve('ConfigServer');
        const locationConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        const weatherConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        const airdropConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.AIRDROP);
        const InraidConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.IN_RAID);
        const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const insuranceConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.INSURANCE);
        const questConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.QUEST);
        const inventoryConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.INVENTORY);
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        // // TODO Testing changing background color of attachments FIR based on value
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
        //* Tweak Airdrops in map base json
        if (config.Map.Tweak_Airdrops.Enabled) {
            for (const map in locations) {
                if (map !== 'base') {
                    for (const x in locations[map].base.AirdropParameters) {
                        // locations[map].base.AirdropParameters[x].PlaneAirdropChance =
                        //     config.Map.Tweak_Airdrops.Plane_Airdrop_Chance;
                        locations[map].base.AirdropParameters[x].PlaneAirdropMax =
                            config.Map.Tweak_Airdrops.Plane_Airdrop_Start_Max;
                        locations[map].base.AirdropParameters[x].PlaneAirdropStartMin =
                            config.Map.Tweak_Airdrops.Plane_Airdrop_Start_Min;
                        locations[map].base.AirdropParameters[x].PlaneAirdropCooldownMin =
                            config.Map.Tweak_Airdrops.Plane_Airdrop_Cooldown_Min;
                        locations[map].base.AirdropParameters[x].MinPlayersCountToSpawnAirdrop =
                            config.Map.Tweak_Airdrops.Min_Players_Count_To_Spawn_Airdrop;
                    }
                }
            }
            //* Tweak Airdrops in airdropConfig
            for (const map in airdropConfig.airdropChancePercent) {
                airdropConfig.airdropChancePercent[map] = config.Map.Tweak_Airdrops.Plane_Airdrop_Chance;
            }
            airdropConfig.planeVolume = config.Map.Tweak_Airdrops.Plane_Volume;
        }
        //* Change loot modifiers
        if (config.Map.Tweak_Loot_Modifier.Enabled) {
            globals.GlobalLootChanceModifier =
                config.Map.Tweak_Loot_Modifier.Global_Loot_Chance_Modifier;
            logger.logWithColor(`${this.modName} - Global Loot Chance Modifier set to ${globals.GlobalLootChanceModifier}`, LogTextColor_1.LogTextColor.GREEN);
            for (const map in locationConfig.looseLootMultiplier) {
                locationConfig.looseLootMultiplier[map] = config.Map.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier;
            }
            for (const map in locationConfig.staticLootMultiplier) {
                locationConfig.staticLootMultiplier[map] = config.Map.Tweak_Loot_Modifier.All_Maps_StaticLoot_Modifier;
            }
            // for (const map in locations)
            // {
            //     if (locations[map].base && locations[map].looseLoot)
            //     {
            //         const locationBase: ILocationData['base'] = locations[map].base
            //         const locationLooseLoot: ILocationData['looseLoot'] = locations[map].looseLoot
            //         locationBase.GlobalLootChanceModifier = config.Map.Tweak_Loot_Modifier.Global_Loot_Chance_Modifier
            //         locationLooseLoot.spawnpointCount.mean *= config.Map.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier
            //         locationLooseLoot.spawnpointCount.std *= config.Map.Tweak_Loot_Modifier.All_Maps_LooseLoot_Modifier
            //         locationLooseLoot.spawnpoints.forEach(spawnPoint => {
            //             spawnPoint.probability = 1
            //             spawnPoint.itemDistribution.forEach(itemDist => itemDist.relativeProbability = 100)
            //         })
            //         logger.logWithColor(`${this.modName} - ${locationBase.GlobalLootChanceModifier}`, LogTextColor.RED)
            //     }
            // }
        }
        //*Change Load-In Timer
        if (config.Map.Tweak_Raid_Menu.Enabled === true) {
            globals.TimeBeforeDeploy = config.Map.Tweak_Raid_Menu.Time_Before_Deploy;
            globals.TimeBeforeDeployLocal =
                config.Map.Tweak_Raid_Menu.Time_Before_Deploy_Local;
            logger.logWithColor(`${this.modName} - Updated Load-In Timer: ${globals.TimeBeforeDeploy}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Disable Rain and Fog
        if (config.Map.Tweak_Weather === true) {
            weatherConfig.weather.rain.min = 0;
            weatherConfig.weather.rain.max = 2;
            weatherConfig.weather.fog.max = 0.01;
            logger.logWithColor(`${this.modName} - Updated Weather: Rain: ${weatherConfig.weather.rain.min} - ${weatherConfig.weather.rain.max} Fog: ${weatherConfig.weather.fog.max}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Remove Labs Entry Card Requirement
        if (config.Map.Remove_Labs_Keycard_Requirement === true) {
            locations['laboratory'].base.AccessKeys = [];
            logger.logWithColor(`${this.modName} - Removed Labs Keycard Requirement`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change spawned gear loose loot min/max durability
        if (config.Map.Tweak_LooseLoot_Gear_Durability.Enabled === true) {
            for (const id in items) {
                //Maximum durability
                if ((items[id]._parent == '5447b5cf4bdc2d65278b4567' ||
                    items[id]._parent == '5447b6254bdc2dc3278b4568' ||
                    items[id]._parent == '5447b5f14bdc2d61278b4567' ||
                    items[id]._parent == '5447bed64bdc2d97278b4568' ||
                    items[id]._parent == '5447b6094bdc2dc3278b4567' ||
                    items[id]._parent == '5447b5e04bdc2d62278b4567' ||
                    items[id]._parent == '5447b6194bdc2d67278b4567') &&
                    items[id]._props.durabSpawnMax !== undefined) {
                    items[id]._props.durabSpawnMax =
                        config.Map.Tweak_LooseLoot_Gear_Durability.Max_Durability;
                }
                //Minimum durability
                if ((items[id]._parent == '5447b5cf4bdc2d65278b4567' ||
                    items[id]._parent == '5447b6254bdc2dc3278b4568' ||
                    items[id]._parent == '5447b5f14bdc2d61278b4567' ||
                    items[id]._parent == '5447bed64bdc2d97278b4568' ||
                    items[id]._parent == '5447b6094bdc2dc3278b4567' ||
                    items[id]._parent == '5447b5e04bdc2d62278b4567' ||
                    items[id]._parent == '5447b6194bdc2d67278b4567') &&
                    items[id]._props.durabSpawnMin !== undefined) {
                    items[id]._props.durabSpawnMin =
                        config.Map.Tweak_LooseLoot_Gear_Durability.Min_Durability;
                }
            }
        }
        /* -------------------------------------------------------------------------- */
        /*                            SECTION Raid Changes                            */
        /* -------------------------------------------------------------------------- */
        //*Remove Skill Fatigue
        if (config.Raid.Remove_Skill_Fatigue === true) {
            globals.SkillPointsBeforeFatigue = 10000;
        }
        //*Change Skill Progress Rates
        if (config.Raid.Tweak_Skill_Rate.Enabled === true) {
            //DatabaseServer.tables.globals.config.SkillsSettings.SkillProgressRate =
            globals.SkillsSettings.SkillProgressRate =
                config.Raid.Tweak_Skill_Rate.Skill_Progress_Rate;
            logger.logWithColor(`${this.modName} - Updated Skill Progress Rate: ${globals.SkillsSettings.SkillProgressRate}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Weapon Skill Progress Rate
        if (config.Raid.Tweak_Weapon_Skill_Rate.Enabled === true) {
            //DatabaseServer.tables.globals.config.SkillsSettings.WeaponSkillProggressRate =
            globals.SkillsSettings.WeaponSkillProgressRate =
                config.Raid.Tweak_Weapon_Skill_Rate.Weapon_Skill_Progress_Rate_Multiplier;
            logger.logWithColor(`${this.modName} - Updated Weapon Skill Progress Rate: ${globals.SkillsSettings.WeaponSkillProgressRate}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Scav Cooldown
        if (config.Raid.Tweak_Scav_Cooldown.Enabled === true) {
            globals.SavagePlayCooldown =
                config.Raid.Tweak_Scav_Cooldown.Scav_Cooldown;
            logger.logWithColor(`${this.modName} - Updated Scav Cooldown: ${globals.SavagePlayCooldown}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Default Raid Menu Settings
        if (config.Map.Tweak_Raid_Menu.Enabled === true) {
            InraidConfig.MIAOnRaidEnd = config.Map.Tweak_Raid_Menu.MIA_On_Raid_End;
            InraidConfig.raidMenuSettings.aiAmount =
                config.Map.Tweak_Raid_Menu.AI_Amount;
            InraidConfig.raidMenuSettings.aiDifficulty =
                config.Map.Tweak_Raid_Menu.AI_Difficulty;
            InraidConfig.raidMenuSettings.bossEnabled =
                config.Map.Tweak_Raid_Menu.Boss_Enabled;
            logger.logWithColor(`${this.modName} - Updated Raid Menu Settings: AI Amount: ${InraidConfig.raidMenuSettings.aiAmount} AI Difficulty: ${InraidConfig.raidMenuSettings.aiDifficulty} Boss Enabled: ${InraidConfig.raidMenuSettings.bossEnabled}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change End of Raid Exp Multipliers
        if (config.Raid.Tweak_Raid_Exp_Multipliers.Enabled === true) {
            globals.exp.match_end.runnerMult =
                config.Raid.Tweak_Raid_Exp_Multipliers.Runner_Multiplier;
            globals.exp.match_end.miaMult =
                config.Raid.Tweak_Raid_Exp_Multipliers.MIA_Multiplier;
            globals.exp.match_end.survivedMult =
                config.Raid.Tweak_Raid_Exp_Multipliers.Survivor_Multiplier;
            globals.exp.match_end.killedMult =
                config.Raid.Tweak_Raid_Exp_Multipliers.Killed_Multiplier;
            logger.logWithColor(`${this.modName} - Updated Raid Exp Multipliers: Runner: ${globals.exp.match_end.runnerMult} MIA: ${globals.exp.match_end.miaMult} Survivor: ${globals.exp.match_end.survivedMult} Killed: ${globals.exp.match_end.killedMult}`, LogTextColor_1.LogTextColor.GREEN);
        }
        /* -------------------------------------------------------------------------- */
        /*                             SECTION Bot Changes                            */
        /* -------------------------------------------------------------------------- */
        //*Change Bot Waves
        if (config.Bot.Tweak_Bot_Waves.Enabled === true) {
            const bot_waves = config.Bot.Tweak_Bot_Waves;
            // DB.bots.core.WAVE_ONLY_AS_ONLINE = bot_waves.as_online;
            globals.WAVE_COEF_LOW = bot_waves.low;
            globals.WAVE_COEF_MID = bot_waves.medium;
            globals.WAVE_COEF_HIGH = bot_waves.high;
            globals.WAVE_COEF_HORDE = bot_waves.horde;
            logger.logWithColor(`${this.modName} - Updated Bot Waves: Low: ${globals.WAVE_COEF_LOW} - Mid: ${globals.WAVE_COEF_MID} - High: ${globals.WAVE_COEF_HIGH} - Horde: ${globals.WAVE_COEF_HORDE}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Bot Count
        if (config.Bot.Tweak_Bot_Count.Enabled === true) {
            const bot_count = config.Bot.Tweak_Bot_Count;
            globals.MaxBotsAliveOnMap = bot_count.Max_Alive_Bots;
            DB.bots.core.LOCAL_BOTS_COUNT = bot_count.Local_Bots_Count;
            logger.logWithColor(`${this.modName} - Updated Bot Count: ${globals.MaxBotsAliveOnMap} - ${DB.bots.core.LOCAL_BOTS_COUNT}`, LogTextColor_1.LogTextColor.GREEN);
        }
        //TODO Don't think this works
        //*Change Boss Spawn Chance
        if (config.Bot.Tweak_Boss_Spawn_Chance.Enabled === true) {
            for (const locationIdx in locations) {
                const location = locations[locationIdx];
                if (location.base && location.base.BossLocationSpawn) {
                    for (const bossIdx in location.base.BossLocationSpawn) {
                        const boss = location.base.BossLocationSpawn[bossIdx];
                        const boss_chance = config.Bot.Tweak_Boss_Spawn_Chance;
                        switch (boss.BossName) {
                            case 'sectantPriest':
                            case 'bossSanitar':
                            case 'bossTagilla':
                            case 'bossBully':
                            case 'bossKilla':
                            case 'bossGluhar':
                            case 'bossKojaniy':
                                boss.BossChance = boss_chance[boss.BossName];
                                break;
                            default:
                        }
                    }
                }
            }
        }
        //*Change Bot Gear Durability
        if (config.Bot.Tweak_Bot_Gear_Durability.Enabled === true) {
            botConfig.durability.default.armor.minDelta =
                config.Bot.Tweak_Bot_Gear_Durability.Min_Armor_Durability;
            botConfig.durability.default.armor.maxDelta =
                config.Bot.Tweak_Bot_Gear_Durability.Max_Armor_Durability;
            botConfig.durability.default.weapon.lowestMax =
                config.Bot.Tweak_Bot_Gear_Durability.Min_Weapon_Durability;
            botConfig.durability.default.weapon.highestMax =
                config.Bot.Tweak_Bot_Gear_Durability.Max_Weapon_Durability;
            botConfig.durability.default.weapon.minDelta = 8; //default is 0
            botConfig.durability.default.weapon.maxDelta = 10; //default is 10
        }
        //*Change Bot Loot Value
        if (config.Bot.Tweak_Bot_Loot_Value.Enabled === true) {
            botConfig.pmc.maxBackpackLootTotalRub =
                config.Bot.Tweak_Bot_Loot_Value.Max_Backpack_Loot_Value; //150000 default
            botConfig.pmc.maxPocketLootTotalRub =
                config.Bot.Tweak_Bot_Loot_Value.Max_Pocket_Loot_Value; //50000 default
            botConfig.pmc.maxVestLootTotalRub =
                config.Bot.Tweak_Bot_Loot_Value.Max_Vest_Loot_Value; //50000 default
        }
        /* -------------------------------------------------------------------------- */
        /*                            SECTION Item Changes                            */
        /* -------------------------------------------------------------------------- */
        //* Secure container ammo stack count
        if (config.Item.Tweak_Secure_Container_Ammo_Stack_Count.Enabled === true) {
            botConfig.secureContainerAmmoStackCount =
                config.Item.Tweak_Secure_Container_Ammo_Stack_Count.Ammo_Stack_Count;
        }
        //*Examine everything other than keys
        if (config.Item.Examine_Everything === true) {
            const parents = ['5c99f98d86f7745c314214b3', '5c164d2286f774194c5e69fa'];
            for (const i in items) {
                const item = items[i];
                if (parents.includes(item._parent)) {
                    item._props.ExaminedByDefault = false;
                }
                else {
                    item._props.ExaminedByDefault = true;
                }
            }
            logger.logWithColor(`${this.modName} - Examine Everything Enabled`, LogTextColor_1.LogTextColor.GREEN);
        }
        //* High cap mags only two slots
        if (config.Item.Lil_Big_Mags === true) {
            for (const i in items) {
                const item = items[i];
                if (item._parent === '5448bc234bdc2d3c308b4569' &&
                    item._props.Height > 2) {
                    item._props.Height = 2;
                }
                if (item._id === '5d2f213448f0355009199284') {
                    item._props.Height = 1;
                }
            }
        }
        //*Change Item Case and THICC Case to hold Grenade Cases
        if (config.Item.Tweak_Cases.Enabled === true) {
            //Add Grenade Case to Item Case
            items['59fb042886f7746c5005a7b2']._props.Grids[0]._props.filters[0].Filter.push('5e2af55f86f7746d4159f07c');
            //Add Grenade Case to THICC Case
            items['5c0a840b86f7742ffa4f2482']._props.Grids[0]._props.filters[0].Filter.push('5e2af55f86f7746d4159f07c');
            logger.logWithColor(`${this.modName} - Updated Case Filters`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Meds
        if (config.Item.Tweak_Meds.Enabled === true) {
            //Analgin painkillers
            const analgin = items['544fb37f4bdc2dee738b4567'];
            analgin._props.effects_damage.Pain.duration = 95;
            //Augmentin antibiotic pills
            items['590c695186f7741e566b64a2']._props.effects_health['Energy'].value = 15; // 5
            items['590c695186f7741e566b64a2']._props.effects_health['Hydration'].value = -20; // -5
            //Morphine injector
            items['544fb3f34bdc2d03748b456a']._props.effects_health['Energy'].value =
                -5; // -10
            items['544fb3f34bdc2d03748b456a']._props.effects_health['Hydration'].value = -10; // -15
            //Ibuprofen painkillers
            items['5af0548586f7743a532b7e99']._props.effects_health['Hydration'].value = -15; // -17
            //Vaseline balm
            items['5755383e24597772cb798966']._props.MaxHpResource = 6;
            items['5755383e24597772cb798966']._props.effects_health['Energy'].value =
                -5; // -9
            items['5755383e24597772cb798966']._props.effects_health['Hydration'].value = -5; // -9
            //Golden Star balm
            items['5751a89d24597722aa0e8db0']._props.effects_health['Energy'].value =
                -15;
            items['5751a89d24597722aa0e8db0']._props.effects_damage.Pain.duration = 350;
            logger.logWithColor(`${this.modName} - Updated Meds`, LogTextColor_1.LogTextColor.GREEN);
            if (config.Item.Tweak_Meds.Goldenstar_Remove_Contusion === true) {
                //Golden Star balm
                globals.Health.Effects.Stimulator.Buffs.BuffsGoldenStarBalm =
                    JSON.parse('[{"BuffType": "EnergyRate","Chance": 1,"Delay": 1,"Duration": 5,"Value": 1,"AbsoluteValue": true,"SkillName": ""},{"BuffType": "HydrationRate","Chance": 1,"Delay": 1,"Duration": 5,"Value": 1,"AbsoluteValue": true,"SkillName": ""}]');
                items['5751a89d24597722aa0e8db0']._props.effects_damage = JSON.parse('{"Pain": {"delay": 1,"duration": 350,"fadeOut": 20},"RadExposure": {"delay": 0,"duration": 400,"fadeOut": 20}}');
                logger.logWithColor(`${this.modName} - Removed contusion Golden Star Balm`, LogTextColor_1.LogTextColor.GREEN);
            }
        }
        //* Change Caze Sizes and Eliminate Filters
        if (config.Item.Tweak_Cases.Enabled === true) {
            const Cases = config.Item.Tweak_Cases.Cases;
            const SecCon = config.Item.Tweak_Cases.SecureContainers;
            const CasesID = [
                '59fb016586f7746d0d4b423a',
                '5783c43d2459774bbe137486',
                '60b0f6c058e0b0481a09ad11',
                '5e2af55f86f7746d4159f07c',
                '59fb042886f7746c5005a7b2',
                '59fb023c86f7746d0d4b423c',
                '5b7c710788a4506dec015957',
                '5aafbde786f774389d0cbc0f',
                '5c127c4486f7745625356c13',
                '5c093e3486f77430cb02e593',
                '5aafbcd986f7745e590fff23',
                '5c0a840b86f7742ffa4f2482',
                '5b6d9ce188a4501afc1b2b25',
                '5d235bb686f77443f4331278',
                '59fafd4b86f7745ca07e1232',
                '590c60fc86f77412b13fddcf',
                '567143bf4bdc2d1a0f8b4567',
                '5c093db286f7740a1b2617e3',
                '619cbf7d23893217ec30b689',
                '619cbf9e0a7c3a1a2731940a'
            ];
            const SecConID = [
                '544a11ac4bdc2d470e8b456a',
                '5c093ca986f7740a1867ab12',
                '5857a8b324597729ab0a0e7d',
                '59db794186f77448bc595262',
                '5857a8bc2459772bad15db29'
            ];
            const Vsize = [
                Cases.MoneyCase.VSize,
                Cases.SimpleWallet.VSize,
                Cases.WZWallet.VSize,
                Cases.GrenadeCase.VSize,
                Cases.ItemsCase.VSize,
                Cases.WeaponCase.VSize,
                Cases.LuckyScav.VSize,
                Cases.AmmunitionCase.VSize,
                Cases.MagazineCase.VSize,
                Cases.DogtagCase.VSize,
                Cases.MedicineCase.VSize,
                Cases.ThiccItemsCase.VSize,
                Cases.ThiccWeaponCase.VSize,
                Cases.SiccCase.VSize,
                Cases.Keytool.VSize,
                Cases.DocumentsCase.VSize,
                Cases.PistolCase.VSize,
                Cases.Holodilnick.VSize,
                Cases.InjectorCase.VSize,
                Cases.KeycardHolderCase.VSize
            ];
            const Hsize = [
                Cases.MoneyCase.HSize,
                Cases.SimpleWallet.HSize,
                Cases.WZWallet.HSize,
                Cases.GrenadeCase.HSize,
                Cases.ItemsCase.HSize,
                Cases.WeaponCase.HSize,
                Cases.LuckyScav.HSize,
                Cases.AmmunitionCase.HSize,
                Cases.MagazineCase.HSize,
                Cases.DogtagCase.HSize,
                Cases.MedicineCase.HSize,
                Cases.ThiccItemsCase.HSize,
                Cases.ThiccWeaponCase.HSize,
                Cases.SiccCase.HSize,
                Cases.Keytool.HSize,
                Cases.DocumentsCase.HSize,
                Cases.PistolCase.HSize,
                Cases.Holodilnick.HSize,
                Cases.InjectorCase.HSize,
                Cases.KeycardHolderCase.HSize
            ];
            const SecVsize = [
                SecCon.Alpha.VSize,
                SecCon.Kappa.VSize,
                SecCon.Beta.VSize,
                SecCon.Epsilon.VSize,
                SecCon.Gamma.VSize
            ];
            const SecHsize = [
                SecCon.Alpha.HSize,
                SecCon.Kappa.HSize,
                SecCon.Beta.HSize,
                SecCon.Epsilon.HSize,
                SecCon.Gamma.HSize
            ];
            const Filters = [
                Cases.MoneyCase.Filter,
                Cases.SimpleWallet.Filter,
                Cases.WZWallet.Filter,
                Cases.GrenadeCase.Filter,
                Cases.ItemsCase.Filter,
                Cases.WeaponCase.Filter,
                Cases.LuckyScav.Filter,
                Cases.AmmunitionCase.Filter,
                Cases.MagazineCase.Filter,
                Cases.DogtagCase.Filter,
                Cases.MedicineCase.Filter,
                Cases.ThiccItemsCase.Filter,
                Cases.ThiccWeaponCase.Filter,
                Cases.SiccCase.Filter,
                Cases.Keytool.Filter,
                Cases.DocumentsCase.Filter,
                Cases.PistolCase.Filter,
                Cases.Holodilnick.Filter,
                Cases.InjectorCase.Filter,
                Cases.KeycardHolderCase.Filter
            ];
            for (const Case in CasesID) {
                items[CasesID[Case]]._props.Grids[0]._props['cellsV'] = Vsize[Case];
                items[CasesID[Case]]._props.Grids[0]._props['cellsH'] = Hsize[Case];
            }
            for (const SecConts in SecConID) {
                items[SecConID[SecConts]]._props.Grids[0]._props['cellsV'] =
                    SecVsize[SecConts];
                items[SecConID[SecConts]]._props.Grids[0]._props['cellsH'] =
                    SecHsize[SecConts];
            }
            for (const Filter in Filters) {
                if (config.Item.Tweak_Cases.Disable_Filters === true) {
                    items[CasesID[Filter]]._props.Grids[0]._props['filter'] = '';
                }
            }
        }
        //* Stackable Barters
        if (config.Item.Stackable_Barters.Enabled === true) {
            for (const id in items) {
                const base = items[id];
                switch (base._parent) {
                    //Battery
                    case '57864ee62459775490116fc1':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Battery);
                        break;
                    //Building materials
                    case '57864ada245977548638de91':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Building_Materials);
                        break;
                    //Electronics
                    case '57864a66245977548f04a81f':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Electronics);
                        break;
                    //Household goods
                    case '57864c322459775490116fbf':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Household_Goods);
                        break;
                    // Valuables
                    case '57864a3d24597754843f8721':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Valuables);
                        break;
                    //Medical supplies
                    case '57864c8c245977548867e7f1':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Med_Supplies);
                        break;
                    //Flammable
                    case '57864e4c24597754843f8723':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Fuel);
                        break;
                    //Tools
                    case '57864bb7245977548b3b66c2':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Tools);
                        break;
                    //Other
                    case '590c745b86f7743cc433c5f2':
                        EditSimpleItemData(id, 'StackMaxSize', config.Item.Stackable_Barters.Other);
                        break;
                }
            }
        }
        /* -------------------------------------------------------------------------- */
        /*                            SECTION Misc Changes                            */
        /* -------------------------------------------------------------------------- */
        //* Disable flea blacklist
        if (config.Misc.Disable_Blacklist === true) {
            let canSellCount = 0;
            ragfairConfig.dynamic.blacklist.enableBsgList = false;
            for (const itemKey in items) {
                const itemDetails = items[itemKey];
                if (itemDetails._type === 'Item' &&
                    !itemDetails._props.CanSellOnRagfair) {
                    itemDetails._props.CanSellOnRagfair = true;
                    canSellCount++;
                }
            }
            logger.logWithColor(`${this.modName} - Disabled Blacklist for ${canSellCount} items`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Insurance Price Multiplier, Return Chance, and Max Storage Time.
        if (config.Misc.Tweak_Insurance.Enabled === true) {
            insuranceConfig.priceMultiplier =
                config.Misc.Tweak_Insurance.Price_Multiplier;
            insuranceConfig.returnChance = config.Misc.Tweak_Insurance.Return_Chance;
            therapist.base.insurance.min_return_hour = 0;
            therapist.base.insurance.max_return_hour = 0;
            prapor.base.insurance.min_return_hour = 0;
            prapor.base.insurance.max_return_hour = 0;
            globals.Insurance.MaxStorageTimeInHour =
                config.Misc.Tweak_Insurance.Max_Storage_Time;
            logger.logWithColor(`${this.modName} - Updated Insurance Settings`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Quest Redeem Tme
        if (config.Misc.Tweak_Quest_Redeem_Time.Enabled === true) {
            questConfig.redeemTime = config.Misc.Tweak_Quest_Redeem_Time.Redeem_Time;
            logger.logWithColor(`${this.modName} - Updated Quest Redeem Time`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Mark New Items FIR
        if (config.Misc.New_Items_Marked_FIR === true) {
            inventoryConfig.newItemsMarkedFound = true;
            logger.logWithColor(`${this.modName} - New Items Marked FIR`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Fence Assort Size, Min Durability, and Refresh Time
        if (config.Misc.Tweak_Fence_Assort.Enabled === true) {
            traderConfig.fenceAssortSize = config.Misc.Tweak_Fence_Assort.Assort_Size;
            traderConfig.minDurabilityForSale =
                config.Misc.Tweak_Fence_Assort.Min_Durability;
            traderConfig.UpdateTime = config.Misc.Tweak_Fence_Assort.Refresh_Time;
            logger.logWithColor(`${this.modName} - Updated Fence Assort Settings`, LogTextColor_1.LogTextColor.GREEN);
        }
        //* Holster SMGs
        if (config.Misc.Holster_SMGs === true) {
            const inventory = items['55d7217a4bdc2d86028b456d'];
            const holster = inventory._props.Slots[2];
            holster._props.filters[0].Filter.push('5447b5e04bdc2d62278b4567');
        }
        //* Bigger Ammo Stacks
        if (config.Misc.Tweak_Ammo_Stacks.Enabled === true) {
            for (const ammo in items) {
                if (items[ammo]._parent === '5485a8684bdc2da71d8b4567') {
                    items[ammo]._props.StackMaxSize *=
                        config.Misc.Tweak_Ammo_Stacks.Stack_Size_Multi;
                    items[ammo]._props.Weight /=
                        config.Misc.Tweak_Ammo_Stacks.Stack_Size_Multi;
                }
            }
            logger.logWithColor(`${this.modName} - Updated Ammo Stacks`, LogTextColor_1.LogTextColor.GREEN);
        }
        //* Bigger Money Stacks
        if (config.Misc.Tweak_Money_Stacks.Enabled === true) {
            const euros = items['569668774bdc2da2298b4568']; //Euros
            const usd = items['5696686a4bdc2da3298b456a']; //USD
            const roubles = items['5449016a4bdc2d6f028b456f']; //Roubles
            euros._props.StackMaxSize =
                config.Misc.Tweak_Money_Stacks.EUR_Max_Stack_Size;
            usd._props.StackMaxSize =
                config.Misc.Tweak_Money_Stacks.USD_Max_Stack_Size;
            roubles._props.StackMaxSize =
                config.Misc.Tweak_Money_Stacks.RUB_Max_Stack_Size;
        }
        //* Better Hearing
        if (config.Misc.Tweak_Hearing === true) {
            for (const item in items) {
                if (items[item]._props.DeafStrength) {
                    items[item]._props.DeafStrength = 'None';
                }
            }
            logger.logWithColor(`${this.modName} - Updated Hearing Settings`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Wear Rigs with Armor
        if (config.Misc.Wear_Rigs_With_Armor === true) {
            for (const id in items) {
                EditSimpleItemData(id, 'BlocksArmorVest', false);
            }
            logger.logWithColor(`${this.modName} - Updated Wear Rigs with Armor Settings`, LogTextColor_1.LogTextColor.GREEN);
        }
        /* -------------------------------------------------------------------------- */
        /*                           SECTION Player changes                           */
        /* -------------------------------------------------------------------------- */
        //* Unlimited Stamina
        if (config.Player.Enable_Unlimited_Stamina === true) {
            globals.Stamina.Capacity = 500;
            globals.Stamina.BaseRestorationRate = 500;
            globals.Stamina.StaminaExhaustionCausesJiggle = false;
            globals.Stamina.StaminaExhaustionStartsBreathSound = false;
            globals.Stamina.StaminaExhaustionRocksCamera = false;
            globals.Stamina.SprintDrainRate = 0;
            globals.Stamina.JumpConsumption = 0;
            globals.Stamina.AimDrainRate = 0;
            globals.Stamina.SitToStandConsumption = 0;
        }
        //* Change Load/Unload Speed
        if (config.Player.Tweak_Load_Speed.Enabled === true) {
            globals.BaseCheckTime = config.Player.Tweak_Load_Speed.Base_Check_Time;
            globals.BaseUnloadTime = config.Player.Tweak_Load_Speed.Base_Unload_Time;
            globals.BaseLoadTime = config.Player.Tweak_Load_Speed.Base_Load_Time;
            logger.logWithColor(`${this.modName} - Updated Load/Unload Speed`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Change Ragfair Level Requirement
        if (config.Player.Tweak_Ragfair_Level.Enabled === true) {
            globals.RagFair.minUserLevel = config.Player.Tweak_Ragfair_Level.Min_Level;
            logger.logWithColor(`${this.modName} - Updated Ragfair Level Requirement`, LogTextColor_1.LogTextColor.GREEN);
        }
        //*Make All Clothes Available
        if (config.Player.All_Clothes_Available === true) {
            for (const suit in suits) {
                const suitData = suits[suit];
                if (suitData._parent === '5cd944ca1388ce03a44dc2a4' ||
                    suitData._parent === '5cd944d01388ce000a659df9') {
                    suitData._props.Side = ['Bear', 'Usec'];
                }
            }
        }
        //* Change Pocket Size
        if (config.Player.Big_Pockets) {
            const pockets = items['627a4e6b255f7527fb05a0f6'];
            for (let i = 0; i < pockets._props.Grids.length; i++) {
                pockets._props.Grids[i]._props.cellsH = 1;
                pockets._props.Grids[i]._props.cellsV = 3;
            }
            logger.logWithColor(`${this.modName} - Bigger pockets enabled`, LogTextColor_1.LogTextColor.GREEN);
        }
        /* -------------------------------------------------------------------------- */
        /*                           SECTION Hideout changes                          */
        /* -------------------------------------------------------------------------- */
        //*Change Hideout Construction Time Multipliers and Remove Construction Item Requirements
        if (config.Hideout.Tweak_Hideout_Speed === true) {
            if (config.Hideout.Reduce_Construction_Time.Enabled === true) {
                hideout.areas.forEach((area) => {
                    for (const idx in area.stages) {
                        if (area.stages[idx].constructionTime > 0) {
                            area.stages[idx].constructionTime = Math.round(area.stages[idx].constructionTime /
                                config.Hideout.Reduce_Construction_Time.Multiplier);
                        }
                    }
                });
                logger.logWithColor(`${this.modName} - Reduced Construction Time Multiplier`, LogTextColor_1.LogTextColor.GREEN);
            }
            //*Change Hideout Production Time Multipliers
            if (config.Hideout.Reduce_Production_Time_Multiplier.Enabled === true) {
                for (const data in hideout.production) {
                    const productionData = hideout.production[data];
                    if (productionData._id == '5d5589c1f934db045e6c5492') {
                        productionData.productionTime =
                            config.Hideout.Reduce_Production_Time_Multiplier.WaterFilterTime;
                        productionData.requirements[1].resource =
                            config.Hideout.Reduce_Production_Time_Multiplier.WaterFilterRate;
                    }
                    if (productionData._id == '5d5c205bd582a50d042a3c0e') {
                        productionData.productionLimitCount =
                            config.Hideout.Reduce_Production_Time_Multiplier.MaxBitcoins;
                        productionData.productionTime =
                            config.Hideout.Reduce_Production_Time_Multiplier.BitcoinTime;
                    }
                    if (!productionData.continuous &&
                        productionData.productionTime >= 10) {
                        productionData.productionTime =
                            productionData.productionTime *
                                config.Hideout.Reduce_Production_Time_Multiplier.HideoutProdMult;
                    }
                }
            }
            //*Remove Construction Item Requirements
            if (config.Hideout.Remove_Hideout_Construction_Requirements.Enabled === true) {
                for (const data in hideout.areas) {
                    const areaData = hideout.areas[data];
                    for (const i in areaData.stages) {
                        if (areaData.stages[i].requirements !== undefined) {
                            areaData.stages[i].requirements = [];
                        }
                    }
                }
                logger.logWithColor(`${this.modName} - Removed Hideout Construction Requirements`, LogTextColor_1.LogTextColor.GREEN);
            }
        }
        //*Change Scav Case Timer and Price
        if (config.Hideout.Tweak_Scav_Case.Enabled === true) {
            if (config.Hideout.Tweak_Scav_Case.Fast_Scav_Case === true) {
                for (const scav in hideout.scavcase) {
                    const caseData = hideout.scavcase[scav];
                    if (caseData.ProductionTime >= 10) {
                        caseData.ProductionTime =
                            caseData.ProductionTime *
                                config.Hideout.Tweak_Scav_Case.Fast_Scav_Case_Multiplier;
                    }
                }
            }
            if (config.Hideout.Tweak_Scav_Case.Reduce_Price === true) {
                for (const scase in hideout.scavcase) {
                    const caseData = hideout.scavcase[scase];
                    if (caseData.Requirements[0].count >= 10 &&
                        (caseData.Requirements[0].templateId ==
                            '5449016a4bdc2d6f028b456f' ||
                            caseData.Requirements[0].templateId ==
                                '5696686a4bdc2da3298b456a' ||
                            caseData.Requirements[0].templateId == '569668774bdc2da2298b4568')) {
                        caseData.Requirements[0].count = 10;
                    }
                }
            }
            logger.logWithColor(`${this.modName} - Updated Scav Case Settings`, LogTextColor_1.LogTextColor.GREEN);
        }
        function EditSimpleItemData(id, data, value) {
            items[id]._props[data] = value;
        }
    }
}
module.exports = { mod: new EchoTweaks() };
