
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction, Message } from "discord.js";

import {Client, GatewayIntentBits, REST, Routes, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection} from 'discord.js';
import { config } from "dotenv";
config();
import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});
interface Command {
    data: SlashCommandBuilder;
    execute: (interaction : Interaction) => void
  }
let commands = new Collection<String, Command>();
const __dirname = path.resolve();
const cmdPath = path.join(__dirname, 'commands');
const cmdFile = fs.readdirSync(cmdPath).filter((file: string) => file.endsWith('.ts'));

for (const file of cmdFile) {
	const filePath = "file:///"+path.join(cmdPath, file);
	const command = await import(filePath);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command.default && 'execute' in command.default) {
		commands.set(command.default.data.name, command.default);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async (interaction : Interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.once(Events.ClientReady, c => {
    console.log(`bot ready, logged in as ${c.user.tag}`)
})

async function getData(url = '') {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res.json();
}

client.on('messageCreate', (message : Message) => {
    // if (!message.author.bot) {
    //     message.author.send(`Echo ${message}`)
    // }
    
    if (message.content.split(' ')[0] === '!open-close') {
        const ticker = message.content.split(' ')[1].toUpperCase();
        const date = message.content.split(' ')[2];

        getData(`https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=sCYUVFaYLzKQGvIbKz2DtLFtGd08ECKp`)
        .then((data) => {
            if (data.status === "OK") {
                message.reply(JSON.stringify(data));
            } else {
                message.reply("Data not found -- Try another date!")
            }
        })

    }

    
})
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);


(async () => {
	try {
		console.log(`Started refreshing ${commands.size} application (/) commands.`);
        console.log(Array.from(await commands.values()).map((command)=>
        {console.log(command.data.options[0]);command.data.toJSON()}))
		const data : any = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
			{ body: Array.from(await commands.values()).map((command)=>command.data.toJSON()) },
		);
        console.log()
        console.log(data);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
client.login(process.env.TOKEN);