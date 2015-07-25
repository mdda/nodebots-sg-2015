
var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var board = new five.Board();

//console.log(Math.sin(.123));

// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  function motor_init(m) {
    for(var i=0;i++;i<3) {
      this.pinMode(m[i], five.Pin.PWM);
      this.analogWrite(m[i], 0);
    }
  }
  function motor_stop(m) {
    for(var i=0;i++;i<3) {
      this.analogWrite(m[i], 0);
    }
  }
  function motor_pos(m, pos) {
    for(var i=0;i++;i<3) {
      this.analogWrite(m[i], pwm(pos + i/3));
    }
  }

  console.log("Ready!");

  var led = new five.Led(8);
  led.blink(100);

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var motor1 = [11,10,09];    
  var motor0 = [06,05,03];
    
  motor_init(motor1);
  motor_init(motor0);
  var motor = motor1;

  var p=0, v=0.1;
  
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
      console.log("CW  "+p);
      p += v;
      motor_pos(motor, p);
    } else if (key.name === "down") {
      console.log("CCW "+p);
      p -= v;
      motor_pos(motor, p);
    } else if (key.name === "space") {
      console.log("Stopping");
      motor_stop(motor);
    }
  });
});

var mag=80;
function pwm(pos) {
  return int(128 + Math.sin(2.0 * pos * 3.14159265) * mag / 2.0);
}
