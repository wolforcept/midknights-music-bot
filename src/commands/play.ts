import { Interaction, SlashCommandBuilder } from 'discord.js';
import { sendToServer } from '../comms.js';

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Provides information about the user.')
    .addStringOption(option => option.setName('url')
        .setDescription('url')
        .setAutocomplete(true));

export async function execute(interaction: any) {
    // However, the .getUser(), .getMember(), .getRole(), .getChannel(), .getMentionable() and .getAttachment() methods are not available to autocomplete interactions. Discord does not send the respective full objects for these methods until the slash command is completed. For these, you can get the Snowflake value using interaction.options.get('option').value:

    const url = interaction.options.getString('url');
    sendToServer("play", url);

    // const integer = interaction.options.getInteger('int');
    // const boolean = interaction.options.getBoolean('choice');
    // const number = interaction.options.getNumber('num');
    //you must first call storage.init
    // await storage.setItem('queue', 'yourname')
    // const queue = await storage.getItem('queue')
    // if (!queue || queue.length === 0) {
    //     queue = [];
    //     //play
    // }
    // queue.push(url)
    // storage.setItem('queue', queue)
    // await interaction.reply("Added to queue: " + url);
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
}