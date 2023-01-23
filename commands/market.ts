import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getData } from "../utils/utils.js";
export default {
    data: new SlashCommandBuilder()
        .setName('market')
        .setDescription('Get market info!')

        .addSubcommand((subcommand) => subcommand.setName('status')
            .setDescription('Get status of an exchange').addStringOption(option => option.setName('exchange')
                .setDescription('The exchange to get the status of')
                .setRequired(false)
                .addChoices(
                    { name: 'NASDAQ', value: 'nasdaq' },
                    { name: 'New York Stock Exchange (NYSE)', value: 'nyse' },
                    { name: 'OTC', value: 'otc' }
                )))

        .addSubcommand((subcommand) => subcommand.setName('holidays')
            .setDescription("The holidays upcoming!").addStringOption(option => option.setName('exchange')
                .setDescription('The exchange to get the status of')
                .setRequired(false)
                .addChoices(
                    { name: 'NASDAQ', value: 'nasdaq' },
                    { name: 'New York Stock Exchange (NYSE)', value: 'nyse' }
                ))),
    async execute(interaction : ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case 'status':
                const data = await getData(`https://api.polygon.io/v1/marketstatus/now?apiKey=${process.env.API_KEY}`)
                await interaction.reply({embeds : [ new EmbedBuilder()
                    .addFields(...Object.entries(interaction.options.getString('exchange') ? data.exchanges[interaction.options.getString('exchange') as string] : data.exchanges).map(([k , v] : [k : string, v : any]) => ({ name: k.toUpperCase(), value: v.replace('-', ' ').replace(/\w\S*/g, (txt : string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()), inline: true })))
                    .setTitle('Exchange Statuses')
                    .setColor('Aqua')
                ]});
                break;
            case 'holidays':
                console.log(interaction.options.getString('exchange'));
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle('Upcoming Holidays')
                        .setColor("Fuchsia")
                        .addFields(
                            ...((await getData(`https://api.polygon.io/v1/marketstatus/upcoming?apiKey=${process.env.API_KEY}`))
                                .filter((val : {exchange : string}) => interaction.options.getString('exchange') ? val.exchange == interaction.options.getString('exchange')?.toUpperCase() : true)
                                .slice(0, 25)
                                .map((val : {exchange : string, date : string, status : string, name : string}) => ({ name: val.date, value: `**Status**: ${val.status.replace('-', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}\n**Occassion**: ${val.name}\n**Exchange**: ${val.exchange}\n**Time**: <t:${Math.round(new Date(val.date).getTime() / 1000)}:R>`, inline: true }))))]
                })

                break;
        }
    }


};