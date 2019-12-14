const { Command } = require('discord.js-commando');
const db = require('../../db/db.js');

module.exports = class ShareCommand extends Command {
	
	constructor(client) {
		
		super(client, {
			name: 'save',
			group: 'user',
			memberName: 'save',
			description: 'Allows the user to save code for future.',
            args: [
                {
                    key: 'name',
                    prompt: '',
                    type: 'string',
                    default: ''
                },
                {
                	key: 'code',
                	prompt: '',
                	type: 'string',
                	default: ''
                }
            ]
		});
	}

    async run(msg, { name, code }) {
    	
    	let lang;
    	
        const docRef = db.collection('users').doc(msg.author.id).collection('saved-code').doc(name);
        
        if(name.substring(0, 3) == '```'){
        	await msg.say("Please provide a name for you code.");
        	return;
        }
        
        code = code.substring(3);
        code = code.split('\n');
        lang = code[0].toLowerCase();
        code = code.slice(1).join("\n").slice(0, -3);
        
        if(!lang){
        	await msg.say("Please provide a language for your code");
        	return;
        }
        
        await docRef.set({
        	lang, code,
        	output: '',
        	date: Date.now()
        });
        
        await msg.say("ok");
	}
};
