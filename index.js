var Botkit = require("botkit");
const request = require("request");
if (!process.env.token) {
  console.log("please specify token in environment");
  process.exit(1);
}
var controller = Botkit.slackbot({
  debug: false
});
controller
  .spawn({
    token: process.env.token
  })
  .startRTM(function(err) {
    if (err) {
      throw new Error(err);
    }
  });

controller.hears(
  ["hi", "hello", "howdy"],
  "direct_message,direct_mention,mention",
  function(bot, message) {
    bot.reply(message, "Hi Mel in person");
  }
);
controller.hears(["wod"], "direct_message,direct_mention,mention", function(
  bot,
  message
) {
  var students = ["WeiNing", "Weevian", "Melissa", "Erin"];
  var randomNumber = Math.floor(Math.random() * students.length);
  selectedStudent = students[randomNumber];
  var response = [
    selectedStudent + " is replying to WOD message",
    selectedStudent + " is willing to belanja boba tea",
    selectedStudent + " does not want to sleep tonight"
  ];
  var randomNumberResponse = Math.floor(Math.random() * response.length);
  randomMessage = response[randomNumberResponse];
  bot.reply(message, randomMessage);
});

controller.hears(["trip"], "direct_message,direct_mention,mention", function(
  bot,
  message
) {
  bot.startConversation(message, function(err, convo) {
    var place = " ";
    var days = 0;
    var persons = 0;
    convo.addQuestion(
      "Where do you planning to go?",
      function(response, convo) {
        place = response.text;
        convo.next();
      },
      {},
      "default"
    );
    convo.addQuestion(
      "How many person are going?",
      function(response, convo) {
        persons = response.text;
        convo.next();
      },
      {},
      "default"
    );
    convo.addQuestion(
      "How many days are you staying?",
      function(response, convo) {
        days = response.text;
        var randomPPP = 100 + Math.floor(Math.random() * 500);
        var finalPrice = randomPPP * persons * days;
        convo.next();
        convo.say(
          "So you are going to " +
            place +
            ". There will be " +
            persons +
            " person, and you are going for " +
            days +
            " days. The total price is " +
            finalPrice +
            " and price for per pax per day is " +
            randomPPP
        );
      },
      {},
      "default"
    );
  });
});

controller.hears(["weather"], "direct_message,direct_mention,mention", function(
  bot,
  message
) {
  bot.startConversation(message, function(err, convo) {
    convo.addQuestion(
      "Where are you at?",
      function(response, convo) {
        convo.say("You response is " + response.text);

        request(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            response.text +
            "&appid=9fd7a449d055dba26a982a3220f32aa2",
          function(error, response, body) {
            var jsonBody = JSON.parse(body);
            var deg = jsonBody["main"]["temp"] - 273.15;
            convo.say(
              "The weather is " +
                jsonBody.weather[0].main +
                " and the temperature is " +
                Math.round(deg, 2) +
                " \xB0C"
            );
            convo.next();
          }
        );
      },
      {},
      "default"
    );
  });
});
