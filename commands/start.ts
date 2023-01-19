import { prisma } from './../utils';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js"
export default {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Get your starting money and start trading!'),
    async execute(interaction : ChatInputCommandInteraction) {
        await interaction.deferReply();
        try {
        const user = await prisma.user.findUnique({where : {user_id : Number.parseInt(interaction.user.id)}})
        if (user){
            await interaction.followUp("You've already claimed this!");
            return;
        } 
        throw new Error()
        } catch (e){
            console.error(e);
            await prisma.user.create({
                data : {
                    user_id : Number.parseInt(interaction.user.id)
                }
            })
            await interaction.followUp({embeds: [(new EmbedBuilder()).setTitle("Amount Deposited!").setDescription("Your loan at **WSB Ltd.** was accepted. 5000$ has been deposited in your account.").setColor('Green')]})
        }
        
        
        

    }

};