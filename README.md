# DMV_Metro Alexa Skill 
This Alexa skill used the publicly available [WMATA API](https://developer.wmata.com/docs/services/) to retrieve real-time metro information in the DMV area. Once the skill gets the required intent slot values (the departing station and the destination station) from users, it will be able to tell users when the metro will arrive. The skill was built on Alexa developer console which involves conversation design, backend intent handling using Alexa Skill Kit SDK and API integrations.

# Setup Instructions 

You will need to have a Amazon account to log into their developer console.

Once you are on their Alexa Skills developer console, **Create Skill** > **Enter skill name** -> **choose Custom skill** -> **choose either Alexa-hosted (Node.js) or Alexa-hosted(python)**. After that, you can choose an existing template to start with or start from scratch. I decided to start from scratch because there were a template that was doing something similar,and I figured making changes could be more time consuming than starting from scratch. 

# Invocations

You will need to pick a unique invocation name for you skill. My skill is called dmv metro. So when a user says something like " hey alexa, open DMV metro", Alexa will invoke my skill. So if you are planning to pubish your skill, make sure to pick a unique name!

![Screenshot 2021-11-14 at 9 34 27 PM](https://user-images.githubusercontent.com/36772713/141713309-664c9413-0fa4-4084-a84a-ff5fd57b0822.png)

# Intents
Intents are basically the features you will provide to your users. In the DMV metro skill, there are two intents: UserSetHomeIntent and GetNextTrainIntent. The first intent allows users to save their home station, so the skill does not need to repeat asking where they are departing from over and over again. The second intent will retrieve the  arrival time of the coming metro. 

# Sample Utterances

Samples utterances are used to invoke a specific intent within a skill. For example, in my GetNextTrainIntent, these are some of the sample utterances:





