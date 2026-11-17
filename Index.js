
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events
} = require('discord.js');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('ERRO: Configure as variáveis de ambiente.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testar se o Mike Bot está online'),

  new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Mostrar os comandos do Mike Bot'),

  new SlashCommandBuilder()
    .setName('saldo')
    .setDescription('Consultar o faturamento da loja')
];

client.once(Events.ClientReady, (bot) => {
  console.log(`Mike Bot Vendas online: ${bot.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong! Mike Bot está funcionando! 🟢');
    }

    if (interaction.commandName === 'ajuda') {
      await interaction.reply({
        content:
          '**🤖 MIKE BOT VENDAS**\n\n' +
          '`/ping` - Testar o bot\n' +
          '`/ajuda` - Mostrar comandos\n' +
          '`/saldo` - Consultar faturamento',
        ephemeral: true
      });
    }

    if (interaction.commandName === 'saldo') {
      await interaction.reply({
        content: 'O sistema de faturamento está em configuração.',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('Erro no comando:', error);

    if (!interaction.replied) {
      await interaction.reply({
        content: 'Ocorreu um erro ao executar esse comando.',
        ephemeral: true
      });
    }
  }
});

async function iniciarBot() {
  const rest = new REST({ version: '10' })
    .setToken(DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: commands.map(command => command.toJSON())
    }
  );

  await client.login(DISCORD_TOKEN);
}

iniciarBot().catch(console.error);

