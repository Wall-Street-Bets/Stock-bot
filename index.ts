
import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction, Message } from "discord.js";

import { Client, GatewayIntentBits, REST, Routes, Events, Collection } from 'discord.js';
import { config } from "dotenv";
config();
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from "./utils";
import { createInterface } from "node:readline";
import { exit } from "node:process";

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
    execute: (interaction: Interaction) => void
}
if (process.env.DEVELOPMENT){
    await prisma.stock.deleteMany({});
    await prisma.user.deleteMany({});
}
let commands = new Collection<String, Command>();
const cmdPath = path.join(path.resolve(), 'commands');
const cmdFile = fs.readdirSync(cmdPath).filter((file: string) => file.endsWith('.ts'));
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

async function reload(){
    commands.clear();
    for (const file of cmdFile) {
        const filePath = "file:///" + path.join(cmdPath, file);
        const { default: command } = await import(filePath);
        
        if ('data' in command && 'execute' in command) {
            console.log(command.data.name);
            commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    try {
        console.log(`Started refreshing ${commands.size} application (/) commands.`);
        const data: any = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
            { body: Array.from(await commands.values()).map((command) => command.data.toJSON()) },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
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
        await interaction[interaction.replied ? 'followUp' : 'reply']({ content: 'There was an error while executing this command!', ephemeral: true })
    }
});

client.once(Events.ClientReady, c => {
    console.log(`------ WALL STREET BOT ------`);
    console.log(`Tag: ${c.user.tag}`);
    console.log(`ID: ${c.user.id}`);
    
    readline.question(`>`, q);
})



function q(command : string){
    try {
    var a = command.split(' ', 3)[0];
    var b = command.split(' ', 3)[1];
    var c = command.split(' ', 3)[2];
    if (a == 'exit'){
        exit(0);
    } else if (a=='restart'){
        return reload().then(()=>{
            readline.question('>', q);
        });
    }
    prisma[b][a](JSON.parse(c)).then((val)=>{console.log(val);readline.question('>', q);}).catch(console.error);
    } catch (e){
        readline.question('>', q);
    }
        
        

    
}
const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
await reload();
client.login(process.env.TOKEN);
