const { SlashCommandBuilder } = require('@discordjs/builders');
const { color, name } = require('@config/bot.json');
const { MessageEmbed } = require('discord.js');

const fs = require('fs');

/* Static JSON */
let championData = require('@assets/lol/constants/champion.json');
let itemData = require('@assets/lol/constants/items.json');
let summonerData = require('@assets/lol/constants/summoners.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lolrandomizer')
		.setDescription('Random fun!'),
	async execute(interaction) {

        let items = [];
        let boots = [];
        let summonerSpells = [];
        let champion;
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
        
        const randomizerEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(`League Randomizer`)
            .setDescription('')
            .setTimestamp()
            .setFooter(`Pulled using the ${name} Bot`);

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
        randomizerEmbed.setThumbnail('https://ddragon.leagueoflegends.com/cdn/12.14.1/img/champion/'+champion.name+'.png');

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

        randomizerEmbed.addField('Champion', champion.name);
        randomizerEmbed.addField('\u200B', '\u200B');

        summonerSpells.forEach(function(spell) {
            randomizerEmbed.addField('Summoner Spell', spell.name, true);
        });

        randomizerEmbed.addField('\u200B', '\u200B');

        items.forEach(function(item, index) {
            if(index == 0) {
                randomizerEmbed.addField('Boots', item.name);
                randomizerEmbed.addField('\u200B', '\u200B');
            } else if (index == 1) {
                randomizerEmbed.addField('Mythic', item.name);
                randomizerEmbed.addField('\u200B', '\u200B');
            } else {
                randomizerEmbed.addField('Item', item.name,true);
            }
            
        });

        interaction.reply({ embeds: [randomizerEmbed], ephemeral: false });

        function getRandomChampion() {
            var keys = Object.keys(championData.data);
            return championData.data[keys[ keys.length * Math.random() << 0]];    
        }
        // Get a random valid summoner spell
        function getRandomSummonerSpell() {

            var keys = Object.keys(summonerData.data);
            let newSumm = summonerData.data[keys[ keys.length * Math.random() << 0]];

            let isOnSR = false
            if(summonerSpells.length > 0) {
                if(summonerSpells[0].name == newSumm.name) {
                    return getRandomSummonerSpell();
                }
            }

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
            Object.keys(newItem.maps).forEach(function(map) {
                if(map == '11') {
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
