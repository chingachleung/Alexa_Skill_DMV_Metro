# DMV_Metro Alexa Skill 
This Alexa skill uses the publicly available [WMATA API](https://developer.wmata.com/docs/services/) to retrieve real-time metro information in the DMV area. Once the skill gets the required intent slot values (the departing station and the destination station) from users, it will be able to tell users when the next metro will arrive. The skill was built on the Alexa developer console which involves conversation design, back-end intent handling using Alexa Skill Kit SDK and API integrations.

# Setup Instructions 

You will need to have an Amazon account to log into their developer console.

Once you are on their Alexa Skill developer console, **create skill** > **enter skill name** -> **choose custom skill** -> **choose either Alexa-hosted (Node.js) or Alexa-hosted(python)**. After that, you can choose an existing template to start with or start from scratch. We decided to start from scratch because there wasn't a template that was doing something similar,and we figured making changes could be more time consuming than starting from scratch. 

# Invocations

You will need to pick a unique invocation name for your skill. Our skill is called DMV Metro. So when a user says something like "hey alexa, open DMV Metro", Alexa will invoke the skill. So if you are planning to publish your skill, make sure to pick a unique name!

![Screenshot 2021-11-14 at 9 34 27 PM](https://user-images.githubusercontent.com/36772713/141713309-664c9413-0fa4-4084-a84a-ff5fd57b0822.png)

# Intents
Intents are basically the features you will provide to your users. In the DMV Metro skill, there are two intents: UserSetsHomeIntent and GetNextTrainIntent. The first intent allows users to save their home station, so the skill does not need to repeat asking where they are departing from over and over again. The second intent will retrieve the  arrival time of the next metro. 

# Sample Utterances

Samples utterances are used to invoke intents within a skill. For example, for the GetNextTrainIntent, we have come up with these utterances:

![Screenshot 2021-11-14 at 10 37 03 PM](https://user-images.githubusercontent.com/36772713/141718550-d05cc4c5-0fb2-4052-967a-da2a6614da1f.png)

These utterances are also used to train their NLU model that makes Alexa able to generalize to other similar phrases. This is why Alexa can understand new utterances that are absent in the training sample!

# Intent Slots

Intent slots are arguments or information users need to provide in order to fulfil intents. For example, in order to fulfil the GetNextTrainIntent, Alexa needs to where users are departing from (HomeStationName) and where they want to go (UserDestination).

![Screenshot 2021-11-14 at 11 05 07 PM](https://user-images.githubusercontent.com/36772713/141720703-d3d0eb6b-efca-479e-9d96-dbbbfa760e24.png)

Slot types define the kind of data you expect for each slot. Alexa developer console has some slot types built in, such as airline names and months, and you can also create your own slot types. In our skill, we created our own slot type STATIONNAME, which is a list of DMV metro stations. With this customized slot type, we can make sure we am getting the valid station names from users, and throw an error messge if otherwise.

For each slot, you will decide whether it is required in order to fulfil an intent. If it is a required one, then you will need to provide a speech prompt that will be used to ask users for the value of the slot. Since both GetNextTrainIntent's slots are required, so, for example, if a user says" hey alexa, when does the next train to dupont circle arrive?", Alexa will ask "which station are you departing from?" to promt the user to provide the departing station (HomeStationName slot). Note that since UserDestination slot is already fulfiled, Alexa will not prompt the user for this.

![Screenshot 2021-11-15 at 7 45 41 PM](https://user-images.githubusercontent.com/36772713/141875409-d86d94f1-2b6a-4f12-9fa5-de33003b9e33.png)

Once you have done all these, your basic conversation design is finished! The next step is to perform more advanced functions such as storing persistent slot values, chaining different intents or API calling. These will be all done in their backend AWS Lambda. Check out [`index.js`](https://github.com/chingachleung/Alexa_Skill_DMV_Metro/blob/main/index.js) for the code we baked into the skill. 

