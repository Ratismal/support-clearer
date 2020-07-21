const config = require('./config.json');
const Eris = require('eris');
const { CronJob } = require('cron');

const bot = new Eris(config.token);

bot.on('ready', () => {
  console.log('Bot is ready!');
});

async function clearChannel() {
  console.log('clearing channel');
  const channel = bot.getChannel(config.channel);

  let messages = await channel.getMessages(1000);
  while (messages.length > 0) {
    messages = messages.map(m => m.id);

    await channel.deleteMessages(messages, 'Clearing Emotional Support');

    messages = await channel.getMessages(1000);
  }

  await channel.createMessage('✨ Emotional Support has been cleared. I hope you have a great day!');
}


async function handleCommand(msg, command, words) {
  switch (command) {
    case 'ping': {
      return 'Pong!';
    }
    case 'clear': {
      await clearChannel();
    }
  }
}

bot.on('messageCreate', async msg => {
  if (msg.member.roles.includes(config.modRole)) {
    if (msg.content.startsWith(config.prefix)) {
      const words = msg.content.substring(1).trim().split(/\s/);
      const command = words.shift();

      const res = await handleCommand(msg, command, words);
      if (typeof res === 'string' || typeof res === 'object') {
        await msg.channel.createMessage(res);
      }
    }
  }
});

bot.connect();

const clearJob = new CronJob(config.time, function () {
  return clearChannel();
}, null, false, config.timezone);