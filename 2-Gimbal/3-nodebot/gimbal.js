


// https://github.com/rwaldron/johnny-five
// https://github.com/rwaldron/johnny-five/wiki/Board
// https://www.arduino.cc/en/Main/ArduinoBoardPro


// npm install johnny-five

var five = require("johnny-five");
var board = new five.Board();

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {
  console.log("Ready!");

  var led = new five.Led(5);
  led.blink(100);
});
