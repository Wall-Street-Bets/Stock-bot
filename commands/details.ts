import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('details')
        .setDescription('find out details of tickers and the associated company')
        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker that you want to check')
            .setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {
        await interaction.deferReply()
        const ticker = interaction.options.getString('ticker');
        let data = await getData(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${process.env.API_KEY}`);
        console.log(data.results.name);

        function nFormatter(num, digits) {
            const lookup = [
              { value: 1, symbol: "" },
              { value: 1e3, symbol: "k" },
              { value: 1e6, symbol: "M" },
              { value: 1e9, symbol: "B" },
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var item = lookup.slice().reverse().find(function(item) {
              return num >= item.value;
            });
            return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        }

        let embed = new EmbedBuilder()
        .setAuthor({ name: `${data.results.name}`, url: `${data.results.homepage_url}` })
        .setTitle(`${ticker}'s Information`)
        .setDescription(`${JSON.stringify(data.results.description)}`)
        .addFields(
            {name: 'Website', value: `${data.results.homepage_url}`},
            {name: 'Primary Exchange', value: `${data.results.primary_exchange}`, inline: true},
            {name: 'Central Index Key', value: `${data.results.cik}`, inline: true},
            {name: 'Total Employees', value: `${nFormatter(data.results.total_employees, 1)}`, inline: true},
            {name: 'Market Cap', value: `${nFormatter(data.results.market_cap, 1)}`},
        )
        .setColor(0x00AE86)

        await interaction.followUp({ embeds: [embed] });
    }
}