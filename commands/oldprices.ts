// Get the aggregate previous days trading data for a given stock using Polygon.io.
// Send a graph of the close data using Chart.js
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('oldprices')
        .setDescription('Get the aggregate previous days trading data for a given stock.')
        .addStringOption(option =>
            option.setName('ticker')
                .setDescription('The ticker of the stock')
                .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let ticker = interaction.options.getString('ticker').toUpperCase();
        let data = (await (await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/15/minute/${+(new Date()) - 86400000 * 14}/${+(new Date())}?apiKey=${process.env.API_KEY}`)).json()).results;
        if (!data) {
            return await interaction.followUp({ embeds: [new EmbedBuilder().setTitle('Error finding Stock').setDescription('Does the stock exist?').setColor(0xFF0000)] });
        }
        let embed = new EmbedBuilder()
            .setTitle(`${ticker} Stock Information`)
            .setDescription(`Average Close: ${data.map(d => d.c).reduce((a, b) => a + b) / data.length}`)
            .setColor(0x00AE86)
            .setImage("attachment://chart.png")
        await interaction.followUp({
            embeds: [embed], files: [{
                attachment: new ChartJSNodeCanvas({ width: 400, height: 400, backgroundColour: 'white' }).renderToStream({
                    type: 'line',
                    data: {
                        labels: data.map(d => new Date(d.t).toLocaleDateString()),
                        datasets: [{
                            label: 'Close',
                            data: data.map(d => d.c),
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 255, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Open',
                            data: data.map(d => d.o),
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(255, 0, 0, 1)',
                            borderWidth: 1

                        }]
                    }, options: {
                        elements: {
                            point: {
                                radius: 0
                            }
                        }
                    }
                }), name: 'chart.png'
            }]
        });

    }
}