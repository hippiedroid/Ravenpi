<h2>Winter Hideout Dayz Discord Community Bot</h2>

Pre-requisites: 
- Discord developer application created
- Discord bot auth token
- Node installed

Installation:
1. Download the project and place it in a folder you want to run it from.
2. Navigate to that folder in a CLI and run the following:
   - npm i discord.js
   - npm i dotenv
3. Navigate to <a href="https://discord.com/developers/applications/">Discord Applications</a>
4. Open the application you have created and navigate to the bot tab on the left.
5. Click reset token and then grab it. If you lose this, you'll need to reset token again
6. Go back to the folder the project is in and create a file called .env, paste the following:<br>
   DISCORD_TOKEN=PASTE THE TOKEN YOU RESET HERE<br>
   CLIENT_ID=PASTE APPLICATION ID HERE // You'll find this in the general tab on the discord application<br>
   GUILD_ID=1189221028744925294 // You don't need to change this, just remove this comment
7. Copy this link and where it says YOUR_CLIENT_ID in the URL, replace it with clientid you pasted above: https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147485696&scope=bot%20applications.commands
8. At this point your bot should be in the server, you should see the join notification after using that link in the browser, your .env should be filled with the required ids and token.
9. All thats left to do is type "node ." in the CLI without the quotes whilst you are in the root of the folder where the application is.
