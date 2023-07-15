const { SlashCommandBuilder, AttachmentBuilder } = require('@discordjs/builders');
const { color, name } = require('@config/bot.json');

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage} = require('canvas');

/* Static JSON */
let championData = require('@assets/lol/constants/champion.json');
let itemData = require('@assets/lol/constants/items.json');
let summonerData = require('@assets/lol/constants/summoners.json');
let runeData = require('@assets/lol/constants/runes.json');
const { join } = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lolrandomizer')
		.setDescription('Random fun!')
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Your role on the Rift')
                .setRequired(true)
                .addChoices(
                    { name: 'ADC', value: 'adc' },
                    { name: 'Support', value: 'support' },
                    { name: 'Mid', value: 'mid' },
                    { name: 'Jungle', value: 'jungle' },
                    { name: 'Top', value: 'top' },
                    { name: 'Fill', value: 'fill' }
                )),
	async execute(interaction) {
        await interaction.deferReply();

        /* Deployed Arrays*/
        let items = [];
        let summonerSpells = [];
        let abilities = [];
        let champion;
        let runeTree = [];
        let mods = [];

        /* Utility */
        const appRoot = path.dirname(require.main.filename);
        let boots = [];
        const selectedRole = interaction.options.getString('role');
        let allowedAbilities = ['Q', 'W', 'E'];
        const statMods = [
            [   
                { name: 'Adaptive Force', picture: 'StatModsAdaptiveForceIcon' },
                { name: 'Attack Speed', picture: 'StatModsAttackSpeedIcon' },
                { name: 'Ability Haste', picture: 'StatModsCDRScalingIcon' }
            ],
            [
                { name: 'Adaptive Force', picture: 'StatModsAdaptiveForceIcon' },
                { name: 'Armor', picture: 'StatModsArmorIcon' },
                { name: 'Magic Resist', picture: 'StatModsMagicResIcon.MagicResist_Fix' }
            ],
            [
                { name: 'Health', picture: 'StatModsHealthScalingIcon' },
                { name: 'Armor', picture: 'StatModsArmorIcon' },
                { name: 'Magic Resist', picture: 'StatModsMagicResIcon.MagicResist_Fix' }
            ]
        ];
        const mythicItems = [
            'Crown of the Shattered Queen',
            'Divine Sunderer',
            'Duskblade of Draktharr',
            'Eclipse',
            'Evenshroud',
            'Everfrost',
            'Frostfire Gauntlet',
            'Galeforce',
            'Goredrinker',
            'Hextech Rocketbelt',
            'Immortal Shieldbow',
            'Imperial Mandate',
            'Kraken Slayer',
            'Liandry\'s Anguish',
            'Locket of the Iron Solari',
            'Luden\'s Tempest',
            'Moonstone Renewer',
            'Night Harvester',
            'Prowler\'s Claw',
            'Riftmaker',
            'Shurelya\'s Battleson',
            'Stridebreaker',
            'Sunfire Aegis',
            'Trinity Force',
            'Turbo Chemtank'
        ];


        /**
         * START THE FUN
         */

        // Get rune tree
        getRandomRunePrimary();
        getRandomRuneSecondary();
        getRandomStatMods();

        // Get a random leveling order
        for(var i = 0; i < 3; i++) {
            var random = allowedAbilities[Math.floor(Math.random() * allowedAbilities.length)];
            abilities.push(random);
            allowedAbilities.splice(allowedAbilities.indexOf(random), 1);
        }

        // Get array of boots
        for (const [key, value] of Object.entries(itemData.data)) {

            var validBoot = false;
            value.tags.forEach(function(x) {
                if(x == 'Boots') {
                    validBoot = true;
                }
            });

            if(validBoot && value.name != 'Slightly Magical Footwear') {
                boots.push(value);
            }
        }

        // Random champion
        champion = getRandomChampion();

        // Give 'er a random boot
        items.push(boots[Math.floor(Math.random() * boots.length)]);

        // Random mythic
        items.push(getRandomItem(true));
        
        // Give 4 random items
        for(var i = 0; i < 4; i++) {
            items.push(getRandomItem());
        }

        // Two random sum spells
        for(var j = 0; j < 2; j++) {
            summonerSpells.push(getRandomSummonerSpell());
        }


        /**
         * Generate the embed image
         */

        const width = 1920;
        const height = 1080;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.font = 'bold 55pt Menlo'
        context.textAlign = 'left'
        context.fillStyle = '#fff'

        // Load base image
        await loadImage(appRoot + '/assets/lol/constants/template.png').then(image => {
            context.drawImage(image, 0, 0, width, height);
        });

        // Load champion Icon
        await loadImage('https://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/'+ champion.image.full).then(image => {
            context.drawImage(image, 55, 34, 160, 160);
        });
        context.fillText(champion.name, 270, 140);

        // Load summs
        await loadImage(appRoot + '/assets/lol/constants/spell/' + summonerSpells[0].image['full']).then(image => {
            context.drawImage(image, 1677, 71, 85, 85);
        });
        await loadImage(appRoot + '/assets/lol/constants/spell/' + summonerSpells[1].image['full']).then(image => {
            context.drawImage(image, 1790, 71, 85, 85);
        });

        // Load Runes (NON DYNAMIC)

        // Col 1 (Left Runes)
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[0].keystones[0].icon).then(image => {
            context.drawImage(image, 1300, 390, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[0].keystones[1].icon).then(image => {
            context.drawImage(image, 1300, 510, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[0].keystones[2].icon).then(image => {
            context.drawImage(image, 1300, 630, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[0].keystones[3].icon).then(image => {
            context.drawImage(image, 1300, 750, 100, 100);
        });

        // Col 2 (Right Runes)
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[1].keystones[0].icon).then(image => {
            context.drawImage(image, 1600, 390, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/' + runeTree[1].keystones[1].icon).then(image => {
            context.drawImage(image, 1600, 510, 100, 100);
        });

        // Col 3 (Stat Mods)
        await loadImage(appRoot + '/assets/lol/constants/mods/' + mods[0].picture +'.png').then(image => {
            context.drawImage(image, 1300, 900, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/mods/' + mods[1].picture +'.png').then(image => {
            context.drawImage(image, 1450, 900, 100, 100);
        });
        await loadImage(appRoot + '/assets/lol/constants/mods/' + mods[2].picture +'.png').then(image => {
            context.drawImage(image, 1600, 900, 100, 100);
        });

        // Load Items (NON DYNAMIC RIGHT NOW)
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[0].image['full']).then(image => {
            context.drawImage(image, 74, 390, 150, 150);
        });
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[1].image['full']).then(image => {
            context.drawImage(image, 269, 390, 150, 150);
        });
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[2].image['full']).then(image => {
            context.drawImage(image, 464, 390, 150, 150);
        });
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[3].image['full']).then(image => {
            context.drawImage(image, 659, 390, 150, 150);
        });
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[4].image['full']).then(image => {
            context.drawImage(image, 854, 390, 150, 150);
        });
        await loadImage(appRoot + '/assets/lol/constants/item/' + items[5].image['full']).then(image => {
            context.drawImage(image, 1049, 390, 150, 150);
        });


        // Ability Order
        context.textAlign = 'left'
        context.font = 'bold 55pt Menlo'
        let joinedAbilities = abilities.join('      :      ');
        context.fillText(joinedAbilities, 67, 865);

        const buffer = canvas.toBuffer('image/png');
        let randString = (Math.random() + 1).toString(36).substring(7);
        await fs.writeFileSync(appRoot + "/tmp/"+randString+".png", buffer);

        await interaction.editReply({ files: [appRoot + "/tmp/" + randString + ".png"]});

        /* Try to delete file */
        try {
            fs.unlinkSync(appRoot + "/tmp/"+randString+".png");
          } catch(err) {
            console.error(err)
          }

        /**
         * Helper Functions
         */

        // Get a random primary rune
        function getRandomRunePrimary() {
            var runeObj = {};
            var randomRune = runeData[Math.floor(Math.random() * 5)];
            
            runeObj['name'] = randomRune.name;
            runeObj['icon'] = randomRune.icon;
            runeObj['keystones'] = [];

            for(var i = 0; i < 4; i++) {
                let keystone = randomRune.slots[i].runes[Math.floor(Math.random() * randomRune.slots[i].runes.length)];
                
                runeObj['keystones'].push({
                    name: keystone.name,
                    icon: keystone.icon
                });
            }

            runeTree.push(runeObj);            
        }

        // Get a random secondary Rune
        function getRandomRuneSecondary() {
            var runeObj = {};
            var randomRune = runeData[Math.floor(Math.random() * 5)];

            // No duplicate
            if(randomRune.name == runeTree[0].name) {
                return getRandomRuneSecondary();
            }

            runeObj['name'] = randomRune.name;
            runeObj['icon'] = randomRune.icon;
            runeObj['keystones'] = [];

            var excludedSlot;
            for(var i = 0; i < 2; i++) {
                // Always 4 slots
                var randomKeystoneSlot = Math.floor(Math.random() * 3) + 1;
                if(excludedSlot) {
                    while(randomKeystoneSlot == excludedSlot) {
                        randomKeystoneSlot = Math.floor(Math.random() * 3) + 1;
                    }
                }
                
                var randomRuneLength = randomRune.slots[randomKeystoneSlot].runes.length;
                let keystone = randomRune.slots[randomKeystoneSlot].runes[Math.floor(Math.random() * randomRuneLength)];
                
                if(!excludedSlot) {
                    excludedSlot = randomKeystoneSlot;
                }

                // Make sure keystone
                runeObj['keystones'].push({
                    name: keystone.name,
                    icon: keystone.icon
                });
            }

            runeTree.push(runeObj);
        }

        // Get random rune stat mods
        function getRandomStatMods() {
            statMods.forEach(modRow => {
                let randomMod = modRow[Math.floor(Math.random() * 2)];
                mods.push({ name: randomMod.name, picture: randomMod.picture });
            });
        }

        // Get a random valid champion
        function getRandomChampion() {
            var keys = Object.keys(championData.data);
            let randomChampion = championData.data[keys[ keys.length * Math.random() << 0]];
           
            var validRole = false;

            switch(selectedRole) {
                case 'adc':
                    if(randomChampion.tags.includes('Marksman')) {
                        validRole = true;
                    }
                    break;

                case 'mid':
                    if(randomChampion.tags.includes('Assassin') || randomChampion.tags.includes('Mage') || randomChampion.tags.includes('Support')) {
                        validRole = true;
                    }
                    break;

                case 'top':
                    if(randomChampion.tags.includes('Fighter') || randomChampion.tags.includes('Tank')) {
                        validRole = true;
                    }
                    break;

                case 'jungle':
                    if(randomChampion.tags.includes('Fighter') || randomChampion.tags.includes('Assassin') || randomChampion.tags.includes('Tank')) {
                        validRole = true;
                    }
                    break;

                case 'support':
                    if(randomChampion.tags.includes('Support') || randomChampion.tags.includes('Mage')) {
                        validRole = true;
                    }
                    break;

                case 'fill':
                    validRole = true;
                    break;
            }

            if(!validRole) {
                return getRandomChampion();
            }

            return randomChampion;
        }

        // Get a random valid summoner spell
        function getRandomSummonerSpell() {

            // Give jungler smite every time
            if(selectedRole == 'jungle' && summonerSpells.length > 0) {
                return summonerData.data['SummonerSmite'];
            }
            
            var keys = Object.keys(summonerData.data);
            let newSumm = summonerData.data[keys[ keys.length * Math.random() << 0]];

            
            if(summonerSpells.length > 0) {
                if(summonerSpells[0].name == newSumm.name) {
                    return getRandomSummonerSpell();
                }
            }

            let isOnSR = false
            newSumm.modes.forEach(function(x) {
                if(x == 'CLASSIC') {
                    isOnSR = true;
                }
            });

            if(!isOnSR) {
                return getRandomSummonerSpell();
            }

            return newSumm;
        }

        // Get a random valid item
        function getRandomItem(mythic = false) {

            var keys = Object.keys(itemData.data);
            let newItem = itemData.data[keys[ keys.length * Math.random() << 0]];

            // Make sure non-consumable or boots
            newItem.tags.forEach(function(x) {
                if(x == 'Boots' || x == 'Consumable') {
                    return getRandomItem(mythic);
                }
            });

            // No duplicates
            items.forEach(function(existing) {
                if(newItem.name == existing.name) {
                    return getRandomItem(mythic);
                }
            });

            // Only full items
            if(newItem.depth != 3) {
                return getRandomItem(mythic);
            }

            // No Ornn items
            if(newItem.requiredAlly == 'Ornn') {
                return getRandomItem(mythic);
            }
            
            if(mythic == true) {
                if(!mythicItems.includes(newItem.name)) {
                    return getRandomItem(mythic);
                }
            } else {
                if(mythicItems.includes(newItem.name)) {
                    return getRandomItem(mythic);
                }
            }

            // Map check
            let isOnSR = false;
            Object.keys(newItem.maps).forEach(function(map, mapIndex) {
                if(map == '11' && newItem.maps[map] == true) {
                    isOnSR = true;
                }
            });

            if(!isOnSR) {
                return getRandomItem(mythic);
            }
            
            return newItem;
        }


	},
};
