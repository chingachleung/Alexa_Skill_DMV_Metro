# DMV_Metro Alexa Skill 
This Alexa skill uses the publicly available [WMATA API](https://developer.wmata.com/docs/services/) to retrieve real-time metro information in the DMV area. Once the skill gets the required intent slot values (the departing station and the destination station) from users, it will be able to tell users when the metro will arrive. The skill was built on Alexa developer console which involves conversation design, backend intent handling using Alexa Skill Kit SDK and API integrations.

# Setup Instructions 

You will need to have a Amazon account to log into their developer console.

Once you are on their Alexa Skills developer console, **Create Skill** > **Enter skill name** -> **choose Custom skill** -> **choose either Alexa-hosted (Node.js) or Alexa-hosted(python)**. After that, you can choose an existing template to start with or start from scratch. I decided to start from scratch because there were a template that was doing something similar,and I figured making changes could be more time consuming than starting from scratch. 

# Invocations

You will need to pick a unique invocation name for you skill. Our skill is called dmv metro. So when a user says something like " hey alexa, open DMV metro", Alexa will invoke the skill. So if you are planning to publish your skill, make sure to pick a unique name!

![Screenshot 2021-11-14 at 9 34 27 PM](https://user-images.githubusercontent.com/36772713/141713309-664c9413-0fa4-4084-a84a-ff5fd57b0822.png)

# Intents
Intents are basically the features you will provide to your users. In the DMV metro skill, there are two intents: UserSetHomeIntent and GetNextTrainIntent. The first intent allows users to save their home station, so the skill does not need to repeat asking where they are departing from over and over again. The second intent will retrieve the  arrival time of the coming metro. 

# Sample Utterances

Samples utterances are used to invoke a specific intent within a skill. For example, in the GetNextTrainIntent, these are some of the sample utterances:

![Screenshot 2021-11-14 at 10 37 03 PM](https://user-images.githubusercontent.com/36772713/141718550-d05cc4c5-0fb2-4052-967a-da2a6614da1f.png)

These utterances are used as training phrases to be fed into their machine learning model. Once you have enough training phrases, their model will be able to learn from the sample, and generalize to other similar utterances. So the skill is able to invoke the intent even with an utterance that is not in the sample!

# Intent Slots

Intent slots are arguments or information users need to provide to a skill in order to fulfil an intent. For example, in order to fulfil the GetNextTrainIntent, users need to tell provide information for the HomeStationName and UserDestination slots so Alexa knows which station they are departing from and where they want to go.

![Screenshot 2021-11-14 at 11 05 07 PM](https://user-images.githubusercontent.com/36772713/141720703-d3d0eb6b-efca-479e-9d96-dbbbfa760e24.png)

Slot types define the kind of data you are expected for each slot. Alexa developer console has some slot types built in, such as airline names and months, and you can also create your own slot types. In my skill, we created our own slot type STATIONNAME, which is a list of DMV metro stations. With the customized slot type, we can make sure we am getting the valid station names from users, and throw an error messge if users give Alexa a station name that does not exist. 

For each slot, you will decide whether it is a required slot to fulfil an intent. If it is a required one, then you will need to provide a speech prompt for Alexa to prompt users to give the value for that slot. Both GetNextTrainIntent's slots are required, so, for example, if a user says" hey alexa, when does the next train to dupont circle arrives?", Alexa will say "which station are you departing from?" to promt the user to provide the destination station. Note that since HomeStationName is already fulfiled, Alexa will not prompt the user to give this slot information.

![Screenshot 2021-11-15 at 7 45 41 PM](https://user-images.githubusercontent.com/36772713/141875409-d86d94f1-2b6a-4f12-9fa5-de33003b9e33.png)

Once you have done all these, your basic conversation design is finished! The next step is to handle intents to perform more advanced functions such as storing persistent slot values, chaining different intents or API calling. These will be all done in their backend AWS Lambda. 

