const Alexa = require('ask-sdk-core');
const CTA_CONFIG = require('./cta.config.js');
const axios = require('axios');
const api_key = CTA_CONFIG.config.BUS_API_KEY;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hi there! How can I help you?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//ignore this for this stage 
const GetBusPositionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBusPositionIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        //get the value of the entities/slots which should be set already in the developer console 
        const RouteID = Alexa.getSlotValue(requestEnvelope,'RouteID');
        
        // Given the bus number and direction, get the corresponding bus stop number from the CTA config file
        //const busStop = CTA_CONFIG.config.BUS_STOPS[busNumber][busDirection.toLowerCase()];
        // Construct the params needed for the API call
        const params1 = {
          RouteID: RouteID
        };

        // Execute the API call to get the real-time next bus predictions
        //this is the correct version, but how to show flexibility to how to get parameters 
        //let response = await axios.get(`${CTA_CONFIG.config.BUS_ROOT_URL}jBusPositions?RouteID=70`, {headers: {"api_key":'846745bc4e1c4ac78f9b6fe6633a9b54'}});
        let response = await axios.get('https://api.wmata.com/Bus.svc/json/jBusPositions', {headers: {"api_key": api_key}}, {params: params1});
        // Define the speakOutput string variable, then populate accordingly
        let speakOutput;
        // Check to ensure there is a 'bustime-response' object
        if(response && response.data){
          // Check to ensure there are available prediction times
          //if(response.data['bustime-response'].prd && 0 < response.data['bustime-response'].prd.length){
            // Extract the position of the lastest bus
            let blockNumber = response.data['BusPositions'][0]["BlockNumber"];
            let lat = response.data['BusPositions'][0]["Lat"];
            let lon = response.data['BusPositions'][0]["Lon"];
            // Construct the next bus arrival speech output with the given time retrieved
            speakOutput = `the bus ${blockNumber} in route ${RouteID} is in ${lat} ${lon}`;
        }else{
            speakOutput = `An error has occurred while retrieving the position information`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            //.withShouldEndSession(true)
            .getResponse();
    }
};
//ignore this for this stage
const GetNextBusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNextBusIntent';
    },
    async handle(handlerInput) {
        //what does request envelope do?
        const {requestEnvelope} = handlerInput;
        //get the value of the entities/slots which should be set already in the developer console 
        //stop id is required for this API
        const stopID = Alexa.getSlotValue(requestEnvelope,'StopID');
        
        // Given the bus number and direction, get the corresponding bus stop number from the CTA config file
        //const busStop = CTA_CONFIG.config.BUS_STOPS[busNumber][busDirection.toLowerCase()];
    
        // Execute the API call to get the real-time next bus predictions

        let response = await axios.get(`https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=${stopID}`, {headers: {"api_key": api_key}});
        // Define the speakOutput string variable, then populate accordingly
        let speakOutput;
        // Check to ensure there is a 'bustime-response' object
        if(response && response.data){
          // Check to ensure there are available prediction times
          //if(response.data['bustime-response'].prd && 0 < response.data['bustime-response'].prd.length){
            // Extract the arrival time of the lastest bus
            let stopName = response.data["StopName"];
            let routeID = response.data['Predictions'][0]["RouteID"];
            let minutes = response.data['Predictions'][0]["Minutes"];
            // Construct the next bus arrival speech output with the given time retrieved
            speakOutput = `the next bus in route ${routeID} will arrive at ${stopName} in ${minutes} minutes`;
        }else{
            speakOutput = `An error has occurred while retrieving the position information`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            //.withShouldEndSession(true)
            .getResponse();
    }
};

const GetNextTrainIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNextTrainIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        
        //convert the value spoken by the users into canonical value 
        const getCanonicalSlot = (slot) => {
        if (slot.resolutions && slot.resolutions.resolutionsPerAuthority.length) {
            for (let resolution of slot.resolutions.resolutionsPerAuthority) {
                if (resolution.status && resolution.status.code === 'ER_SUCCESS_MATCH') {
                    return resolution.values[0].value.name;
                }
            }
            return null; 
        }
        else{
            return null;
        }
        }
        // function to get station code from station name
        const getStationCode = (stationName) => {
            for (let i = 0; i < stations.length; i++){
                if (stations[i]["Name"].toLowerCase() === stationName){
                    let StationCode = stations[i]["Code"];
                    return StationCode;
                }
            }
            return null;
        }
        
        const responseForStations = await axios.get(`https://api.wmata.com/Rail.svc/json/jStations`, {headers: {"api_key": api_key}});
        const stations = responseForStations.data["Stations"]; 
        
        
        //get station code only if the station name given by users is valid, else return null 
        
        let homeStationSlot = Alexa.getSlot(requestEnvelope, 'HomeStationName');
        let homeStation = getCanonicalSlot(homeStationSlot); // return null if station does not exist 
        let homeStationCode;
        
        if (homeStation === null) {
            homeStationCode = null;
        }
        else{
            homeStationCode = getStationCode(homeStation.toLowerCase());
        }
        
        let userDestinationSlot = Alexa.getSlot(requestEnvelope, 'UserDestination');
        let userDestination = getCanonicalSlot(userDestinationSlot);
        let userDestinationCode;
        
        if (userDestination === null) {
            userDestinationCode = null;
        }
        else{
            
            userDestinationCode = getStationCode(userDestination.toLowerCase());
        }
       
        // Execute the API call to get the real-time next bus predictions
        let speakOutput;
        if (!(homeStationCode === null || userDestinationCode === null)){
            let response = await axios.get(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${homeStationCode}`, {headers: {"api_key": api_key}});
            // Define the speakOutput string variable, then populate accordingly
            let found;
            let endPointCode;
            // Check to ensure there is a 'response' object
            if (response && response.data) {
              // Check to ensure there are available prediction times
              //if(response.data['bustime-response'].prd && 0 < response.data['bustime-response'].prd.length){
                // Extract the arrival time of the lastest bus
                //let stopName = response.data["StopName"];
                speakOutput = `there is no train that goes directly from ${homeStation} to ${userDestination}`;
                //check if the direction is valid
                let trainPredictions = response.data['Trains'];
                for (let i = 0; i <trainPredictions.length; i++){
                    let prediction = trainPredictions[i]
                    if (prediction["DestinationCode"] === endPointCode){
                        //check if the endpoint is already checked
                        continue;    
                    }
                    else{
                        endPointCode = prediction["DestinationCode"];
                        let response2 = await axios.get(`https://api.wmata.com/Rail.svc/json/jPath?FromStationCode=${homeStationCode}&ToStationCode=${endPointCode}`,{headers: {"api_key": api_key}});
                        if (response2 && response2.data){
                            let path = response2.data["Path"];
                            for(let i = 1; i < path.length; i++){
                                if (path[i]["StationCode"] === userDestinationCode){
                                    let minutes = prediction["Min"];
                                    if (minutes === "ARR") {
                                        speakOutput = ` the train is arriving now`;
                                    }
                                    else if (minutes === "BRD" ){
                                        speakOutput = `the train is boarding passengers now`;
                                    }
                                    else{
                                        speakOutput = `the next train to ${userDestination} will arrive in ${minutes} minutes`;
                                    }
                                    found = true;
                                    break;
                                }
                            }                        
                        }
                        else{
                            speakOutput = `An error has occurred while retrieving the requried information`;
                        }
                    }
                    if (found === true) {
                        break;
                    }
                }
            } 
            else {
                speakOutput = `An error has occurred while retrieving the position information`;
    
            }            
        }
        else{
            speakOutput = "Sorry, at least one of the stations you mentioned is not valid"
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Is there anything else I can help you with?')
            //.withShouldEndSession(true)
            .getResponse();
        }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetBusPositionIntentHandler,
        GetNextBusIntentHandler,
        GetNextTrainIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
