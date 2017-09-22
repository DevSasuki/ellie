
const ping = 'e!ping';
const say = 'e!say';
let devIDs = ['298706728856453121', '229552088525438977', '222054596820992021', '260246864979296256']
const ownerID = '298706728856453121';
const kick = 'e!kick';
const pingresponse = ['Pong', 'No', ':thinking:', '...']
const responses = [
   'Yes', 'No', 'Maybe', 'Definitely', 'Probably', 'Ask me later', 'Definitely not', 'Eh', 'What am I, A fortune teller?', 'Absolutely'
]
const Copypasta = ['Heads up! Look out for a Discord user by the name of "Kazuto Kirigia " with the tag #2169.', 'Dear discord members, Discord is suppose to be closing down it is recently becoming very overpopulated. there have been many members complaining that discord is becoming very slow.' ]
const errors = ["DiscordAPIError: Privilege is too low..."]
const restartMessages = ["Rebooting...", "Re:boot:ing...", "Breaking something...", "Downloading memes...", "Stealing passwords...", "Dominating the world...", "bYE"]
const HugGifs = ["https://media.giphy.com/media/lXiRKBj0SAA0EWvbG/giphy.gif", "https://media.giphy.com/media/EvYHHSntaIl5m/giphy.gif", "https://media.giphy.com/media/8KKRIP5ZHUo2k/giphy.gif", "https://media.giphy.com/media/llmZp6fCVb4ju/giphy.gif", "https://media.giphy.com/media/gnXG2hODaCOru/giphy.gif", "https://media.giphy.com/media/xT1XGPy39lDKJ5Gc5W/giphy.gif", "https://media.giphy.com/media/OiKAQbQEQItxK/giphy.gif", "https://media.giphy.com/media/8tpiC1JAYVMFq/giphy.gif", "https://media.giphy.com/media/3EJsCqoEiq6n6/giphy.gif", "https://media.giphy.com/media/4d4HEGpLiwTQc/giphy.gif"]
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs")
const sql = require("sqlite");

let prefix = ['e!', 'elliepls'];

bot.on('ready', () => {
  console.log(`${bot.user.tag} is Ready!`);
  bot.user.setPresence({ game: { name: `in ${bot.guilds.size} servers | e!help`, type: 0 } });
  bot.user.setStatus('online');

  bot.on('guildCreate', guild => {
  });

  bot.on('guildDelete', guild => {
  });

  bot.on('guildBanAdd',(guild, user) => {
    if(!guild.channels.find('name', 'mod-log')) return
    guild.fetchAuditLogs({type: "MEMBER_BAN_ADD",limit: 1}).then(d => {
    let entry = d.entries.first();
    let mod = entry.executor;
    let punished = entry.target;
    guild.channels.find('name', 'mod-log').send('', {
      embed: {
        color: 0xff0202,
        author: {
          name: mod.username,
          icon_url: mod.avatarURL
        },
        url: '',
        description: `**Action:** Ban\n**Member:** ${punished.username}#${punished.discriminator} (${punished.id})\n**Reason:** ${entry.reason}`,
        timestamp: new Date(),
        }
      });
  })
});


bot.on('guildBanRemove',(guild, user) => {
  if(!guild.channels.find('name', 'mod-log')) return
  guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE",limit: 1}).then(d => {
  let entry = d.entries.first();
  let mod = entry.executor;
  let punished = entry.target;
  guild.channels.find('name', 'mod-log').send('', {
    embed: {
      color: 0xf279e0,
      author: {
        name: mod.username,
        icon_url: mod.avatarURL
      },
      url: '',
      description: `**Action:** Unban\n**Member:** ${punished.username}#${punished.discriminator} (${punished.id})`,
      timestamp: new Date(),
      }
    });
  });
});


process.on('uncaughtException', function(err) {
  console.log('ERROR: ' + err); //STOPS THE BOT FROM CRASHING
});


bot.on('message', message => {

  const prefixes = ['e!', 'E!'];
  let prefix = false;
  for(const thisPrefix of prefixes) {
    if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
  }
  if(!prefix) return;

  if (!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) {
    return message.author.send(`Whoops! You sent \`${message.content}\` but I couldn't respond to it. Please make sure I have permissions to send messages.`)
}


  sql.open("./score.sqlite");

    if (message.author.bot) return;
    if (message.channel.type !== "text") return;

    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      } else {
        let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
        if (curLevel > row.level) {
          row.level = curLevel;
          sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
          const embed = new Discord.RichEmbed()
          .setAuthor(`LEVEL UP!`, `${message.author.avatarURL}`)

          .setColor("0x5fef2f")
          .setDescription(`You are now level ${curLevel}!`)
          message.channel.send({embed});
        }
        sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      });
    });

    if (message.content.startsWith(prefix + "level")) {
      let target = message.mentions.users.first();

      if (!target) return sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        const embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`)

        .setColor("0x7bd8d3")
        .addField(`Points`, `${row.points}`, true)
        .addField(`Level`, `${row.level}`, true)

        return message.channel.send({embed});
        if (!row) return message.reply("Your current level is 0");

    sql.get(`SELECT * FROM scores WHERE userId ="${target.id}"`).then(row => {
        const embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}`, `${target.avatarURL}`)

        .setColor("0x7bd8d3")
        .addField(`Points`, `${row.points}`, true)
        .addField(`Level`, `${row.level}`, true)
  message.channel.send({embed})
      });
    });
  }

  if (message.content.startsWith(prefix + 'prune')) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      message.channel.send('Sorry, you do not have permission to execute the "prune" command!');
      return;
    }
const user = message.mentions.users.first();
const amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])
if (!amount) return message.channel.send('You must specify an amount to delete!');
if (!amount && !user) return message.channel.send('Must specify a user and amount, or just an amount of messages to purge!');
message.channel.fetchMessages({
  limit: amount,
}).then((messages) => {
  if (user) {
    const filterBy = user ? user.id : bot.user.id;
    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
  }
  message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  message.channel.send('Successfully deleted messages. :scissors:')
}) }

  if (message.content.startsWith(prefix + 'info')) {
    var milliseconds = parseInt((bot.uptime % 1000) / 100),
           seconds = parseInt((bot.uptime / 1000) % 60),
           minutes = parseInt((bot.uptime / (1000 * 60)) % 60),
           hours = parseInt((bot.uptime / (1000 * 60 * 60)) % 24);

           hours = (hours < 10) ? "0" + hours : hours;
           minutes = (minutes < 10) ? "0" + minutes : minutes;
           seconds = (seconds < 10) ? "0" + seconds : seconds;
    const embed = new Discord.RichEmbed()
    .setAuthor(`Ellie Info`, `${bot.user.avatarURL}`)

    .setColor("0x7bd8d3")
    .addField(`Main Developer`, `Nicki#8825`, true)
    .addField(`Aweseome Contributors ♥`, `void#4938 \n Boekie#0869 \n goddy#8210`, true)
    .addField(`Memory Usage`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("Uptime", hours + " hours, " + minutes + " minutes and " + seconds + " seconds.", true)
    .addField("Node Version", `${process.version}`, true)
    .setDescription('You can join my server for help or to hangout [here](https://discord.gg/ZZ3Knaa).')
    return message.channel.send({embed});
  }

  if (message.content.startsWith(prefix + 'changelog')) {
  let args = message.content.slice(11).split(' ').join(' ')
  const devIDS = ["298706728856453121", "229552088525438977", "222054596820992021", "260246864979296256"]
  if(message.guild.id !== '329922729211985921') {
  return message.channel.send('This command is not available in this server.')
  }
  if(message.author.id !== devIDS) {
  const embed = new Discord.RichEmbed()
  .setTitle(`Changelog (${message.guild.createdAt.toString().substr(0, 15)})`)

  .setColor("RANDOM")
  .setDescription(`${args}`)

  .setTimestamp()
  .setFooter(`${message.author.tag}`, `${message.author.avatarURL}`)
bot.channels.get('330289743910797323').send({embed})
message.channel.send(':ok_hand:')
  }
  }

  if (message.content.startsWith(prefix + 'kick')) {
    let userToKick = message.mentions.users.first()
    let reason = message.content.slice(28).split(' ').join(' ')
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      message.channel.send('Sorry, you do not have permission to execute the "kick" command!');
      return;
    }

    if (message.author.id === message.mentions.users.first().id)
     return message.channel.send("You can't kick yourself!")

  if (bot.user.id === message.mentions.users.first().id)
  return message.channel.send("I can't kick myself!")

   if(message.mentions.users.size === 0) {
      return message.reply("Please mention a user to kick.");
  }
  if(!userToKick.kickable) return message.channel.send(`I can't kick ${userToKick.username}!`)
     message.guild.member(userToKick).kick(reason)
     message.channel.send("Successfully kicked that user! :boot:");
  }

if (message.content.startsWith(prefix + 'announce')) {
  if (!message.member.permissions.has("MANAGE_ROLES_OR_PERMISSIONS")) {
    message.channel.send('Sorry, you do not have permission to execute the "announce" command!');
    return;
  }
  let command = message.content.split(' ')[0];
  command = command.slice(prefix.length);

  let announcement = message.content.split(" ").slice(1).join(" ")
  const embed = new Discord.RichEmbed()
  .setTitle("📡 Announcement")

  .setColor("RANDOM")
  .setDescription(`${announcement}`)

  .setTimestamp()
  .setFooter(`${message.author.tag}`, `${message.author.avatarURL}`)
if(!message.guild.channels.find('name', 'announcements')) return message.guild.defaultChannel.send("Failed to execute the announce command. I can't find a channel named `announcements`.")
message.guild.channels.find('name', 'announcements').send({embed})
}

if(message.content.startsWith(prefix + 'sayd')) {
  if (message.author.id !== '298706728856453121') return message.channel.send("Only developers can use this command!");
  let wordz = message.content.split(' ')[0];
  wordz = wordz.slice(prefix.length);

  let words = message.content.split(" ").slice(1).join(" ")
  message.delete()
  message.channel.send(`${words}`)
}

if(message.content.startsWith(prefix + 'name')) {
  if (!message.member.permissions.has("MANAGE_NICKNAMES")) {
    message.channel.send('Sorry, you do not have permission to execute the "name" command!');
    return;
  }
  let test = message.content.split(' ').slice(1);
  if (test == '' || test == null){
      return message.channel.send({embed: {
          color: 0x5fef2f,
          description: `${message.author} cleared my nickname.`
      } }).then(message.guild.member(bot.user).setNickname(''));
  }
  else{
      let command = message.content.split(' ')[0];
      command = command.slice(prefix.length);

      let nickname = message.content.split(" ").slice(1).join(" ")
      message.guild.member(bot.user).setNickname(`${nickname}`)
      message.channel.send({embed: {
          color: 0x5fef2f,
          description: `${message.author} set my nickname to "**${nickname}**"`
      } });
  }

}
if(message.content.startsWith(prefix + 'roles')) {
  message.channel.send({embed: {
  color: 0x4f351,
  title: `Roles for ${message.guild.name}:`,
  description: `${message.guild.roles.map(r=>r.name).join('\n')}`
} })
}



if(message.content.startsWith(prefix + 'uptime')) {
var milliseconds = parseInt((bot.uptime % 1000) / 100),
       seconds = parseInt((bot.uptime / 1000) % 60),
       minutes = parseInt((bot.uptime / (1000 * 60)) % 60),
       hours = parseInt((bot.uptime / (1000 * 60 * 60)) % 24);

       hours = (hours < 10) ? "0" + hours : hours;
       minutes = (minutes < 10) ? "0" + minutes : minutes;
       seconds = (seconds < 10) ? "0" + seconds : seconds;

       message.channel.send(":chart_with_upwards_trend: I've been running for** " + hours + " **hours, **" + minutes + "** minutes and **" + seconds + "." + milliseconds + "** seconds!");
}

if (message.content.startsWith(prefix + "r")) {
   if(message.author.id !== '298706728856453121') return
 				message.channel.send(`${restartMessages[Math.floor(Math.random() * restartMessages.length)]}`).then(() => {
 					bot.destroy().then(() => {
 						process.exit();
        })
      })
      }

      if (message.content.startsWith(prefix + "kiss")) {
        let userToKiss = message.mentions.members.first()
        if (!userToKiss) {
          message.channel.send(`Don't be like that, ${message.author.username} *hugs* :heart:`)
        } else if (message.author.id === userToKiss.id) {
          message.channel.send("Why are you kissing yourself? :face_palm:")
        } else {
          message.channel.send(`${message.author} just kissed ${userToKiss}! <3`)
        }
      }

const antiads = ["https://discord.gg/", "https://discord.io/", "https://discord.me/", "https://discord.li"];
      if( antiads.some(word => message.content.includes(word)) ) {
        message.delete()
        message.reply("No advertising!");
        const embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag} (${message.author.id})`)
      
        .setColor("0xff0202")
        .setDescription(`Invite Posted: \n ${message.content}`)
      
        .setTimestamp()
        .setFooter('Discord Invite Detected')
        message.guild.channels.find('name', 'mod-log').send({embed})
      }

let command = message.content.split(' ')[0];
command = command.slice(prefix.length);

let args = message.content.split(' ').slice(1);

if (message.content.startsWith(prefix + 'say')) {
  message.delete();
  message.channel.send({embed: {
  color: 0x30f7ae,
  description: `**${message.author.username} says: **` + (args.join(' '))
} }) }

if (message.content.startsWith(prefix + 'ban')) {
  let userToBan = message.mentions.users.first()
  let reason = message.content.slice(28).split(' ').join(' ')
  if (!message.member.permissions.has("BAN_MEMBERS")) {
    message.channel.send('Sorry, you do not have permission to execute the "ban" command!');
    return;
  }

  if (message.author.id === message.mentions.users.first().id)
   return message.channel.send("You can't ban yourself!")

if (bot.user.id === message.mentions.users.first().id)
return message.channel.send("I can't ban myself!")

 if(message.mentions.users.size === 0) {
    return message.reply("Please mention a user to ban.");
}
if(!userToBan.bannable) return message.channel.send(`I can't ban ${userToBan.username}!`)
   message.guild.member(userToBan).ban(reason)
   message.channel.send("Successfully banned that user! :hammer:");
}

if(message.content.startsWith(prefix + 'lockdown')) {
  if (!message.member.permissions.has("MANAGE_SERVER")) {
    message.channel.send('Sorry, you do not have permission to execute the "lockdown" command!');
    return;
  }
  const ms = require('ms');
    if (!bot.lockit) bot.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');

    if (validUnlocks.includes(time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.channel.send('Lockdown lifted.');
        clearTimeout(bot.lockit[message.channel.id]);
        delete bot.lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        message.channel.send(`Channel locked down for ${ms(ms(time), { long:true })}`).then(() => {

          bot.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: null
            }).then(message.channel.send('Lockdown lifted.')).catch(console.error);
            delete bot.lockit[message.channel.id];
          }, ms(time));

        }).catch(error => {
          console.log(error);
        });
      });
    }
}

if (message.isMentioned("329926149734137856")) {
  return message.channel.send('kachow')
}

if(message.content.startsWith(prefix + 'quote')) {
  let args = message.content.split(" ").slice(1).join(' ')
  let userToQuote = message.mentions.users.first();

  const embed = new Discord.RichEmbed()
  .setTitle(``)
  .setAuthor(`Quote`)

  .setColor("RANDOM")
  .setDescription(`${args}`)
  .setFooter(`Submitted by ${message.author.tag}`, `${message.author.avatarURL}`)
  .setImage('')

  .setTimestamp()

  if(!message.guild.channels.find('name', 'quotes')) return message.channel.send("I couldn't find a quotes channel. Please make one and name it `quotes`")
  message.channel.send('👌');
  message.guild.channels.find('name', 'quotes').send({embed})

}

if(message.content.startsWith(prefix + 'checkinvites')) {
  const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
  return message.channel.send(members.map(member => `User(s) found! \`${member.id}\` - ${member.displayName}`).join("\n") || "Nobody has an invite link as game name.");
};

var target = message.mentions.users.first();

  if(message.content.startsWith(prefix + 'user')) {
      if (message.mentions.users.size === 0) return message.channel.send({embed: {
        color: message.member.displayColor,
        author: {
          name: `${message.author.username}`,
        icon_url: message.author.avatarURL,
        },
        title: `Full Username`,
        description: `${message.author.tag}`,
        fields: [{
            name: 'Created At',
            value: `${message.author.createdAt.toString().substr(0, 15)}`
          },
          {
            name: 'Status',
            value: `${message.author.presence.status}`
          },
          {
            name: 'Bot Account',
            value: `${message.author.bot}`
          },
          {
            name: 'Nickname',
            value: `${message.member.displayName}`
          },
          {
            name: 'ID',
            value: `${message.author.id}`
          },
        ],
      }
    })

  const embed = new Discord.RichEmbed()
  .setTitle(``)
  .setAuthor(`${target.username}`, `${target.avatarURL}`)

  .setColor("RANDOM")
  .setDescription('')
  .setFooter('')
  .setImage('')
  .setThumbnail(`${target.avatarURL}`)

  .setTimestamp(new Date())
  .addField('Full username',
    `${target.tag}`)
  .addField('Created At ', `${target.createdAt.toString().substr(0, 15)}`, true)
  .addField('Status ', `${target.presence.status}`, true)
  .addField('Nickname', `${target.displayName}`, true)
  .addField('Bot ', `${target.bot}`, true);

  message.channel.send({embed});
  }

if(message.content.startsWith(prefix + 'leave')) {
  message.channel.send(`Are you sure you want me to leave, ${message.author.username}? Type \`confirm\` if you really want me to. You have 10 seconds to decide.`)
  .then(() => {
    message.channel.awaitMessages(response => response.content === 'confirm', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
        message.channel.send('Alright. Goodbye! :wave:').then(message.guild.leave())
      })
      .catch(() => {
        message.channel.send('Time\'s up. Looks like i\'m staying here.');
      });
  });
  }

if(message.content.startsWith(prefix + 'achievement')) {
  const snekfetch = require('snekfetch');
  let args = message.content.slice(14).split(' ')
  let [title, contents] = args.join(" ").split("|");
  if(!args) return message.channel.send('You have to tell me what to put in the achievement!')
  if(!contents) {
    [title, contents] = ["Achievement Get!", title];
  }
  let rnd = Math.floor((Math.random() * 39) + 1);
  if(args.join(" ").toLowerCase().includes("burn")) rnd = 38;
  if(args.join(" ").toLowerCase().includes("cookie")) rnd = 21;
  if(args.join(" ").toLowerCase().includes("cake")) rnd = 10;

  if(title.length > 22 || contents.length > 22) return message.edit("Max Length: 22 Characters. Soz.").then(message.delete.bind(message), 2000);
  const url = `https://www.minecraftskinstealer.com/achievement/a.php?i=${rnd}&h=${encodeURIComponent(title)}&t=${encodeURIComponent(contents)}`;
  snekfetch.get(url)
   .then(r=>message.channel.send("", {files:[{attachment: r.body}]}));
  message.delete();

};

  if(message.channel.type === "dm") {
    if(message.author.id === '298706728856453121') return;
    if(message.author.bot) return;

    const embed = new Discord.RichEmbed()
    .setTitle(`DM from ${message.author.tag}`)

    .setColor("RANDOM")
    .setDescription(`The message was: \n "${message.content}"`)

    .setTimestamp()
    .setFooter(`${message.author.tag}`, `${message.author.avatarURL}`)

    bot.users.get('298706728856453121').send({embed});
  }

if (message.content.startsWith(prefix + 'server')) {
  const emojiList = message.guild.emojis.map(e=> `${e.toString()} \`:${e.name}:\``).join(" ");
  message.channel.send({embed: {
    thumbnail: {url: `${message.guild.iconURL}`},
    color: 0x1b74f9,
    author: {
      name: '',
    },
    title: `${message.guild.name}`,
    description: '',
    fields: [{
        name: 'Owner',
        value: `${message.channel.guild.owner.user.tag} (${message.channel.guild.owner.user.id})`
      },
      {
        name: 'Members',
        value: `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`,
      },
      {
        name: 'Region',
        value: `${message.guild.region}`
      },
      {
        name: 'ID',
        value: `${message.guild.id}`
      },
      {
        name: 'Channels',
        value: `${message.guild.channels.size}`
      },
      {
        name: 'Created at',
        value: `${message.guild.createdAt.toString().substr(0, 15)}`
      },
      {
        name: 'Emojis',
        value: `${emojiList}`
      },
    ],
  }
  }).catch(() => {
   message.channel.send({embed: {
    color: 0x1b74f9,
    author: {
      name: '',
    },
    title: `${message.guild.name}`,
    description: '',
    fields: [{
        name: 'Owner',
        value: `${message.channel.guild.owner.user.tag} (${message.channel.guild.owner.user.id})`
      },
      {
        name: 'Members',
        value: `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`,
      },
      {
        name: 'Region',
        value: `${message.guild.region.toUpperCase()}`
      },
      {
        name: 'ID',
        value: `${message.guild.id}`
      },
      {
        name: 'Channels',
        value: `${message.guild.channels.size}`
      },
      {
        name: 'Created at',
        value: `${message.guild.createdAt.toString().substr(0, 15)}`
      },
      {
        name: 'Emojis',
        value: 'Error, You have either 0 emojis or too many to display.'
      },
    ],
  }
})
})
}

if (message.content.startsWith(prefix + 'unban')) {
  if (!message.member.permissions.has("BAN_MEMBERS")) {
    message.channel.send('Sorry, you do not have permission to execute the "unban" command!');
    return;
  }
 let UnbanXD = message.content.split(' ')[0];
 UnbanXD = command.slice(prefix.length);

 let Unban1 = message.content.split(' ').slice(1);

   message.guild.unban(`${Unban1.join('')}`).catch(e => message.reply(e.message));
   message.channel.send("Successfully unbanned that user! :hibiscus: ");
}

if (message.content.startsWith(prefix + 'mute')) {
 let user = message.mentions.users.first();
 var member = message.guild.member(user);
 if (!message.member.permissions.has("MANAGE_ROLES")) {
   message.channel.send('Sorry, you do not have permission to execute the "mute" command!');
   return;
 }
 if(!user) return message.channel.send({embed: {
   color: 0xFF0000,
   author: {
   },
   title: 'User not found',
   description: "Please specify a valid user to mute!",
   timestamp: new Date(),
 }});
 if(member.roles.has('Admin')) return message.channel.send('This user can\'t be muted, as they have the Bot Commander role, Bot Commanders control the bot')
 let Muted = message.guild.roles.find("name", "Muted");
 if(!Muted) return message.channel.send({embed: {
   color: 0xFF0000,
   author: {
   },
   title: 'Unable To Mute',
   description: `${user.username}#${user.discriminator} was unable to be muted`,
   timestamp: new Date(),
 }});
  message.guild.channels.find('name', 'mod-log').send({embed: {
   color: 0xd8d036,
   author: {
   },
   title: `🔇 User Muted: ${user.tag} (${user.id})`,
   description: ``,
 }});
 message.guild.member(user).addRole(Muted);
 }

  if (message.content.startsWith(prefix + 'unmute')) {
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      message.channel.send('Sorry, you do not have permission to execute the "unmute" command!');
      return;
    }
  let user = message.mentions.users.first();
  if(!user) return  message.channel.send({embed: {
    color: 0xFF0000,
    author: {
    },
    title: 'User not found',
    description: "Please specify a valid user to unmute!",
    timestamp: new Date(),
  }});
  let Muted = message.guild.roles.find("name", "Muted");
  if(!Muted) return message.channel.send({embed: {
    color: 0xFF0000,
    author: {
    },
    title: 'Unable To Unmute',
    description: `${user.username}#${user.discriminator} was unable to be unmuted`,
    timestamp: new Date(),
  }});
  message.guild.channels.find('name', 'mod-log').send({embed: {
    color: 0x5dc446,
    author: {
    },
    title: `🔊 User Unmuted: ${user.tag} (${user.id})`,
    description: ``,
  }});
  message.guild.member(user).removeRole(Muted);
  }

  if( Copypasta.some(word => message.content.includes(word)) ) {
    message.delete();
    message.channel.send(`**The Discord Alert Copypasta
And why you're an idiot for believing it**

There have been numerous copypastas going around "warning" users about specific users. The user in question varies, but 99% of the time it isn't even a real account. The copypasta goes on to claim how they "send friend requests" and if you accept the friend request you'll get "DDoSed", causing all the members of their groups to fall victim as well.

I'd like to invite you to take a minute to close your eyes, and just imagine how stupid this claim is. Really.

**1.** The Discord Team would not rely on word of mouth to spread the news of any danger. They would make a blog post, and make an announcement in their official guild. Really, common sense.

**2.** The Discord Team would not warn people about a specific account. They would just delete it. Again, common sense.

**3.** It is impossible to DDoS somebody from a friend request. This part of the copypasta targets those who are technologically incompetent, and don't actually know what DDoSing is.

A DDoS (Distributed Denial of Service) attack is something that overloads a server/network to force it to crash, go down, or become inaccessible. In order to achieve this, you need an IP address.

At no point does Discord ever expose your IP address. Thus, it is impossible for somebody to DDoS you via friend request.

Futhermore, DDoSing is not hacking. It is not a virus that can spread to other users. Even if some sort of malware is involved, it can't just jump from user accounts based on friend request.

And finally, even if Discord did accidently expose your IP address, it certainly wouldn't require something as trivial as a friend request to obtain.

Conclusion

${message.author}, *Before you start spam copy-pasting things just because it tells you to, give it an actual read through to make sure you're not just being an absolute idiot. Thanks.*`);
  }


    if(message.content.startsWith(prefix+'ping')) {
  message.channel.send('Ping?').then(m => m.edit(`${pingresponse[Math.floor(Math.random() * pingresponse.length)]} | Response Delay: **${m.createdTimestamp - message.createdTimestamp}ms**.`) );
}


  if (message.content.startsWith(prefix + 'invite')) {
    message.reply('Click this to invite me to your server: \n https://discordapp.com/oauth2/authorize?client_id=329926149734137856&scope=bot&permissions=2080898303');
  }

if (message.content.startsWith(prefix + 'google')) {
    var request = require('request');
    const args = message.content.split(' ').slice(1).join(' ');
    let res = message.channel.send(`:mag: \`${args}\`...`);
    request(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDu7_tL50kfEcegjXnYqfBxXrKqBrknkkY&cx=013036536707430787589:_pqjad5hr1a&q=${args}&alt=json`, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var kek = JSON.parse(body)
        //message.edit(`:mag: \`${args}\` **${kek.items[0].title}**\n__<${kek.items[0].link}>__\n${kek.items[0].snippet}`);
        message.channel.send({embed: {
          author: {name: `${args} - Google Search`, icon_url: `https://shady.world/assets/google.jpg`},
          description: `[**${kek.items[0].title}**](${kek.items[0].link})\n\n${kek.items[0].snippet}`,
          color: 0xffffff,
          footer: {text: `${Number(kek.queries.request[0].totalResults).toLocaleString()} total results`}
        }})
      }
    });
  }

if(message.content.startsWith(prefix + 'discrim')) {
  let embed = new Discord.RichEmbed();
    message.delete();
    let args = message.content.split(" ").splice(1).join(" ");
    const res = bot.users.filter(u => u.discriminator === `${args}`).map(u => u.tag);
    if(res.length === 0) {
      embed.setAuthor(`No users found with ${args}`)
      .setColor("#53A6F3")
      .setTimestamp();
      message.channel.send({ embed });
    } else {
      embed.setAuthor(`Users found with ${args}`)
      .setDescription(`${res.join('\n')}`)
      .setColor("#53A6F3")
      .setTimestamp();
      message.channel.send({ embed });
    }
  }
  
if (message.content.startsWith(prefix + 'hug')) {
  let userToHug = message.mentions.users.first();
  if (userToHug = bot.user) return message.channel.send(`*Hugs ${message.author.username} back* :heart:`)
  message.channel.send(`**${userToHug.username}**, you got hugged by **${message.author.username}**! \n ${HugGifs[Math.floor(Math.random() * HugGifs.length)]}`)
}

  if (message.content.startsWith(prefix + '8ball')) {
    let ball = message.content.split(" ").slice(1).join(" ")
    if (!message.content.endsWith("?")) {
    message.channel.send("That doesn't look like a question. Make sure you end your question with `?`")
    } else {
     message.channel.send(`:8ball: | Question: **${ball}** \n Response: ${responses[Math.floor(Math.random() * responses.length)]}`);
  }
  }

if(message.content.startsWith(prefix + 'dog')) {
  const {get} = require("snekfetch");
  message.channel.send('Getting dog image...')
      get("https://random.dog/woof.json").then(res => {
          message.channel.send(res.body.url);
      });
  };

if(message.content.startsWith(prefix + 'cat')) {
  const {get} = require("snekfetch");
      get("https://random.cat/meow").then(response => {
        message.channel.send('Getting cat image...').then(message.delete).then(message.channel.send(response.body.file))
      });
  };

  if(message.content.startsWith(prefix + 'rate')) {
  message.channel.send(`No offense but I'd rate **${message.author.username}** ${(Math.floor(Math.random() * 101))}\/100`)
}

  if (message.content.startsWith(prefix + 'avatar')) {
    let mentioned = message.mentions.users.first()

    if (!mentioned) {
      const embed = new Discord.RichEmbed()
      .setTitle(`${message.author.tag}'s Avatar`)

      .setColor("0x4f351")
      .setImage(`${message.author.avatarURL}`)

      message.channel.send({embed}) } else {
    const embed = new Discord.RichEmbed()
      .setTitle(`${mentioned.tag}'s Avatar`)

      .setColor("0x4f351")
      .setImage(`${mentioned.avatarURL}`)

      message.channel.send({embed});
}
}

if (message.content.startsWith(prefix + 'help')) {
  message.react('✅');
  message.channel.send('A DM containing a list of commands is being sent to your DMs.')
  message.author.send({embed: {
    color: 0x5d2fc4,
    author: {
      name: bot.user.username,
      icon_url: bot.user.avatarURL
    },
    title: 'Ellie ',
    description: 'These are the current commands for Ellie!',
    fields: [{
        name: '8ball',
        value: 'Answers your questions'
      },
      {
        name: 'Achievement',
        value: 'Generates a Minecraft Achievement'
      },
      {
        name: 'Announce',
        value: 'Makes an announcement to the server'
      },
      {
        name: 'Avatar',
        value: 'Gets the avatar of the specified user'
      },
      {
        name: 'Ban',
        value: 'Bans the specified user'
      },
      {
        name: 'Cat',
        value: 'Sends a random cat image'
      },
      {
        name: 'Checkinvites',
        value: 'Scans playing status for links'
      },
      {
        name: 'Dog',
        value: 'Sends a random dog image'
      },
      {
        name: 'Hug',
        value: 'Hugs the specified user'
      },
      {
        name: 'Info',
        value: 'Shows the bot info'
      },
      {
        name: 'Invite',
        value: 'Sends the bot inviting link'
      },
      {
        name: 'Kick',
        value: 'Kicks the specified user'
      },
      {
        name: 'Kiss',
        value: 'Kisses the specified user'
      },
      {
        name: 'Leave',
        value: 'Makes the bot leave the server'
      },
      {
        name: 'Level',
        value: 'Shows your current level for the leveling system'
      },
      {
        name: 'Lockdown',
        value: 'Disables permissions for @everyone to send messages'
      },
      {
        name: 'Mute',
        value: 'Gives the specified user a role that can\'t send messages'
      },
      {
        name: 'Name',
        value: 'Changes the bot\'s nickname'
      },
      {
        name: 'Ping',
        value: 'Shows the bot\'s response delay'
      },
      {
        name: 'Prune',
        value: 'Deletes the specified amount of messages from the channel'
      },
      {
        name: 'Quote',
        value: 'Quotes a user on something they said'
      },
      {
        name: 'Rate',
        value: 'Rates you out of 100'
      },
      {
        name: 'Roles',
        value: 'Shows the roles in the server'
      },
      {
        name: 'Say',
        value: 'Says what you typed in the message'
      },
      {
        name: 'Server',
        value: 'Shows information about the server'
      },
      {
        name: 'Unban',
        value: 'Unbans a user ID from the server'
      },
      {
        name: 'Unmute',
        value: 'Removes the Muted role from the specified user'
      },
      {
        name: 'Uptime',
        value: 'Shows how long the bot has been running for'
      },
      {
        name: 'User',
        value: 'Shows information about the specified user'
      }
    ],
    footer: {
      text: ''
    }
  }
})

}

if (message.content.startsWith(prefix + 'eval')) {
 if(message.author.id !== '298706728856453121') return message.channel.send('no')
 let evall = message.content.split(' ')[0];
 let evalstuff = message.content.split(" ").slice(1).join(" ")
 try {
      const code = message.content.split(" ").slice(1).join(" ")
      let evaled = eval(code);

      if (typeof evaled !== 'string')
        evaled = require('util').inspect(evaled);

        const embed = new Discord.RichEmbed()
        .setTitle(`Evaluation:`)

        .setColor("0x4f351")
        .setDescription(`:inbox_tray: Input: \n \`\`\`${evalstuff}\`\`\` \n :outbox_tray: Output: \n  \`\`\`${clean(evaled)}\`\`\``)
        .setFooter('Eval command revamped by Nicki#8825')

      message.channel.send({embed});
    } catch (err) {
      const embed = new Discord.RichEmbed()
      .setTitle(`Evaluation:`)

      .setColor("0xff0202")
      .setDescription(`:inbox_tray: Input: \n \`\`\`${evalstuff}\`\`\` \n :outbox_tray: Output: \n  \`\`\`${clean(err)}\`\`\``)

      message.channel.send({embed});
    }
  }
});

function clean(text) {
  if (typeof(text) === 'string')
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  else
      return text;
}
});


bot.login('MzI5OTI2MTQ5NzM0MTM3ODU2.DDdsMA.TL2LZl7NA-Ne5ZPrpT6OTJTtJs4');
