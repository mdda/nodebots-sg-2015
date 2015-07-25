
var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var board = new five.Board();

// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  console.log("Ready!");

  var led = new five.Led(8);
  //led.blink(100);

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

/*
// Hardware Abstraction for Motor connectors,
// DO NOT CHANGE UNLES YOU KNOW WHAT YOU ARE DOING !!!
#define PWM_A_MOTOR1 OCR2A
#define PWM_B_MOTOR1 OCR1B
#define PWM_C_MOTOR1 OCR1A

#define PWM_A_MOTOR0 OCR0A
#define PWM_B_MOTOR0 OCR0B
#define PWM_C_MOTOR0 OCR2B
*/

  var servo = new five.Servo.Continuous(10).stop();

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      servo.cw();
    } else if (key.name === "down") {
      console.log("CCW");
      servo.ccw();
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
    }
  });
});
