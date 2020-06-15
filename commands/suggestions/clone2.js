const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('token');

function clone(){
    let texchannel = {
        id: '213821979sadadhg2wjk'
    }
    let guild = new Discord.Guild(client, data);
    let original = new Discord.TextChannel({
        guild: guild,
        data: texchannel
    });

    original.clone({
        name: original.name+'_Clone'
    })
    delete(reason); {
        return this.client.api
          .channels(this.id)
          .delete({ reason })
          .then(() => this);
      }

}