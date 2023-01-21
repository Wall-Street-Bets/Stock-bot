import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('openclose')
        .setDescription('Get open, close and afterhours prices of a ticker')
        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker to check prices of')
            .setRequired(true))
        .addStringOption(option => option
            .setName('date')
            .setDescription('The date for the stock info (yyyy-mm-dd) eg.2023-01-18')
            .setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {
        await interaction.deferReply()
        const ticker = interaction.options.getString('ticker')
        var date1 = new Date();
        date1.setTime(date1.getTime()-1000*86400);
        const date = new Date((interaction.options.getString('date')));
        if (date.getTime() > date1.getTime()){
            return await interaction.reply("We're not a fortune teller, go to hell (P.S. you can only get yesterday's or older's stock prices, so well suck it)\n\nCustomer satisfaction on top");
        }
        let data = await getData(`https://api.polygon.io/v1/open-close/${ticker}/${date.toISOString().split('T')[0]}?adjusted=true&apiKey=${process.env.API_KEY}`);
        let components = [new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(randomUUID())
                    .setDisabled(date.getTime() >= date1.getTime()),
                new ButtonBuilder()
                    .setLabel("Previous")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(randomUUID()))];
        let msg;
        if (data.status == 'OK'){
            msg = await interaction.followUp({ embeds : [new EmbedBuilder().setTitle("Open/Close of "+data.symbol).setDescription(
                `**Open:** ${data.open}\n**Close: **${data.close}\n**High: **${data.high}\n**Low: **${data.low}\n**Volume: **${data.volume}\n**After Hours: **${data.afterHours}\n**Pre Market: **${data.preMarket}`
            ).setTimestamp(date).setColor('Aqua')], components });
        } else {
            msg = await interaction.followUp("Cannot get data!");
        }
        try {
            while (true) {
                const i = await msg.awaitMessageComponent({
                    filter: ((i) => i.user.id == interaction.user.id),
                    componentType: ComponentType.Button,
                    time: 60000
                });
                date.setTime(date.getTime() + (86400000 * (i.component.label == 'Next' ? 1 : -1)));
                let data = await getData(`https://api.polygon.io/v1/open-close/${ticker}/${date.toISOString().split('T')[0]}?adjusted=true&apiKey=${process.env.API_KEY}`);
                components[0].components[0].setDisabled(date.getTime() >= date1.getTime());
                components[0].components[1].setDisabled(data.status != 'OK');
                
                await i.deferUpdate();
                if (data.status == 'OK'){
                    await i.message.edit({content: '', embeds : [new EmbedBuilder().setTitle("Open/Close of "+data.symbol).setDescription(
                        `**Open:** ${data.open}\n**Close: **${data.close}\n**High: **${data.high}\n**Low: **${data.low}\n**Volume: **${data.volume}\n**After Hours: **${data.afterHours}\n**Pre Market: **${data.preMarket}`
                    ).setTimestamp(date).setColor('Aqua')], components });
                } else {
                    await i.message.edit({content: "Cannot get data!", embeds : [], components});
                }
                
            }

        } catch (e) {
            await msg.edit({ components: [] })
        }
    }
}