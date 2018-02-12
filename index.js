

const Agent = require('./node-agent-sdk/AgentSDK');
var echoAgent = new Agent({
  accountId: '13099967',
  username: 'botLivePerson',
  password: 'Password123!!!'
});

var bearer = "";
var agentsLogged = [];
var activeSkills = [];
var answer = [];
var limboskill = 1051213232;
var risvegliataskill = 1051213332;
var accountNumber = 13099967;
var botID = 1051214932;
var customBotID = accountNumber + "." + botID;
var agentJSON = {};





function retrieveSkills(){

	console.log("SKILLS");
	var request = require('request');
	var oauth = "Bearer " + bearer;
	var url = 'https://lo.ac.liveperson.net/api/account/13099967/configuration/le-users/skills';
	request.get({
    		url: url,
    		json: true,
    		headers: {
        		'Content-Type': 'application/json',
			'Authorization': oauth
    		}
	}, function (e, r, b) {

		activeSkills = b;

	});


}






function retrieveAgentsLogged(){

	console.log("AGENTS");
	var request = require('request');
	var oauth = "Bearer " + bearer;
	var body = {"status":["ONLINE"]};
	var url = 'https://lo.msghist.liveperson.net/messaging_history/api/account/13099967/agent-view/status';
	request.post({
    		url: url,
    		body: body,
    		json: true,
    		headers: {
        		'Content-Type': 'application/json',
			'Authorization': oauth
    		}
	}, function (e, r, b) {

		if(typeof b.agentStatusRecords !== 'undefined'){
			for (var m = 0; m < (b.agentStatusRecords.length); m++){
				agentsLogged = agentsLogged.concat(b.agentStatusRecords[m].agentLoginName);
			}
		agentJSON = b;
			
		}

	});


}



function closeChat(dialogID, agentID){

	var agentToRemove = accountNumber + "." + agentID


		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'ADD',
				userId: customBotID,
				role: 'ASSIGNED_AGENT'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});

/*
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'REMOVE',
				userId: agentToRemove,
				role: 'ASSIGNED_AGENT'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});


		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'REMOVE',
				userId: customBotID,
				role: 'MANAGER'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});


*/



	echoAgent.updateConversationField({
            conversationId: dialogID,
            conversationField: [{
                    field: "ConversationStateField",
                    conversationState: "CLOSE"
                }]
        });



}






function limboChat(dialogID, agentID) {

	var agentToRemove = accountNumber + "." + agentID

		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'ADD',
				userId: customBotID,
				role: 'READER'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});

		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'REMOVE',
				userId: agentToRemove,
				role: 'ASSIGNED_AGENT'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});

		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: "Skill",
				type: "UPDATE",
				skill: limboskill
				}]

			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});




		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
							
				{
				field: 'ParticipantsChange',
				type: 'REMOVE',
				userId: customBotID,
				role: 'READER'
				}]

			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
    			console.log("Transfering..." , resp)
		});



	


}


function checkIfConnected(agentName){

	if(agentsLogged.includes(agentName)){
		var a = agentJSON.agentStatusRecords.length;
		for (var m = 0; m < a; m++){
			if(agentJSON.agentStatusRecords[m].agentLoginName === agentName){
				if((agentJSON.agentStatusRecords[m].configuredMaxSlots - agentJSON.agentStatusRecords[m].busySlots)>=1){
					console.log(agentJSON.agentStatusRecords[m].configuredMaxSlots + " ***** " + agentJSON.agentStatusRecords[m].busySlots);
					m = a;
					return 1;
				}
				else{
					return 0;
				}
			}

		}
	}
	else{
		return 0;
	}

}


function wakeUpChat(dialogID, agentName) {

		var isSent = 0;

		transferToActualSkill = 0;
		var skillPreviousAgent = "***" + agentName;
		if(checkIfConnected(agentName)){
			for (var m = 0; m < (activeSkills.length); m++){
				if(activeSkills[m].name === skillPreviousAgent){
					transferToActualSkill = activeSkills[m].id;
					m = activeSkills.length;
				}

			}
		}
		else{
			transferToActualSkill = risvegliataskill;
		}


		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: 'ParticipantsChange',
				type: 'ADD',
				userId: customBotID,
				role: 'ASSIGNED_AGENT'
				}]
			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});

/****************************

		if((transferToActualSkill === risvegliataskill) && (!isSent)){

			echoAgent.publishEvent({
				'dialogId': dialogID,
				'event': {
					message: "ciao! la tua conversazione ricevera' presto risposta!", // escalation message
					contentType: "text/plain",
					type: "ContentEvent"
					}

				}, (e, resp) => {
   					if (e) { 
						console.error(e) 
    				}
			});
			isSent = 1;



		}

****************************/
		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
				{
				field: "Skill",
				type: "UPDATE",
				skill: transferToActualSkill
				}]

			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
		});



		
		echoAgent.updateConversationField({
			'conversationId': dialogID,
			'conversationField': [
							
				{
				field: 'ParticipantsChange',
				type: 'REMOVE',
				userId: customBotID,
				role: 'ASSIGNED_AGENT'
				}]

			}, (e, resp) => {
   				if (e) { 
					console.error(e) 
    			}
    			console.log("Transfering..." , resp)
		});






}






function proceedWithActions(){

	console.log("ACTIONS");

	for (var m = 0; m < (answer.length); m++){

		var howManyMessages = answer[m].messageRecords.length;
			if(howManyMessages){
		 		if (answer[m].messageRecords[(howManyMessages - 1)].sentBy === "Agent"){
					var moveToLimbo = (Date.now() - (1000*60*10));            // timestamp "move to Limbo" conversation
					var closure = (Date.now() - (1000*60*60*24));            // timestamp closure conversation
					var whatTime = answer[m].messageRecords[(howManyMessages - 1)].timeL;
					if (answer[m].info.latestSkillId !== limboskill){
						if((whatTime < moveToLimbo) && (answer[m].info.latestSkillId !== limboskill)){
							console.log("moving to Limbo");
							limboChat(answer[m].info.conversationId, answer[m].info.latestAgentId);
						}
					}
					if (whatTime < closure){
						console.log("closing");
						closeChat(answer[m].info.conversationId, answer[m].info.latestAgentId);
		 			}
		 		}
				else if((answer[m].messageRecords[(howManyMessages - 1)].sentBy === "Consumer") && (answer[m].info.latestSkillId === limboskill)){
					console.log(JSON.stringify(answer[m].messageRecords));
					console.log("waking up");
					wakeUpChat(answer[m].info.conversationId, answer[m].info.latestAgentLoginName);					
				}
		 	}

	}



}




function tryUntilSuccess(integer, callback) {


	var now = Date.now();
	var before = (Date.now() - (1000*60*60*24*30));    // only the conversation of the last 30 days will be fetched
	var request = require('request');
	var oauth = "Bearer " + bearer;
	var body = {"start":{"from":before,"to":now}, "status": ["open"]};
	var url = 'https://lo.msghist.liveperson.net/messaging_history/api/account/13099967/conversations/search?offset=' + integer + '&limit=100';
		request.post({
    			url: url,
    			body: body,
    			json: true,
    			headers: {
        			'Content-Type': 'application/json',
				'Authorization': oauth
    			}
		}, function (e, r, b) {
			if(b.hasOwnProperty('conversationHistoryRecords')){
    				if((b.conversationHistoryRecords.length) == 100){
	 				answer = answer.concat(b.conversationHistoryRecords);
         				integer = integer + 100;
         				tryUntilSuccess(integer, callback);

    				}
    				else{
					integer = 0;
					answer = answer.concat(b.conversationHistoryRecords);
					proceedWithActions();
    				}
			}else{
				tryUntilSuccess(integer, callback);
			}

		});

}








var integer = 0;

setTimeout(function(){
	console.log("********* let's go! **********");
	bearer = echoAgent.transport.configuration.token;
	retrieveSkills();
	setInterval(function(){
		agentsLogged = [];
		retrieveAgentsLogged();
		setTimeout(function(){
			answer = [];
			console.log("fetching convs");
			tryUntilSuccess(integer, function(err, resp) {
    				// Your code here...
			});
						
		}, 2000);
	}, 10000);
}, 10000);






