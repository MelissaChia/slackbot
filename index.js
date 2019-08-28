var Botkit = require("botkit");
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
