# International Nodebots Day in Singapore (2015)

This is a repo that represents what I did for the hacking day
held in Singapore at the IDA Labs.

### BeagleBoneBlack (notes only - not used on the day)

The initial two pieces concern the BeagleBoneBlack board that 
I bought ages ago, and wanted to see whether could be used for 
NodeBots experiments.  

Short answer : Yes, but currently Fedora
does not easily package up the same 'ethernet over USB' boot mode
that the default Angstrom distro provides.  

Since I couldn't make Fedora boot to my satisfaction, that meant it
was game-over for the BeagleBoneBlack (for now).

### Gimbal - Rescued from crash and made NodeBot-able

The gimbal is a very attractive (to roboticists) piece of hardware that 
was originally designed to stabilised a camera mounted beneath a quadcopter.

One eye-catching thing is that the entire assembly (two brushless motors,
gimbal controller board, 3-axis sensor, CNCed aluminium hardware and
on-board USB/serial interface) currently costs :

*  [less than $60 from AliExpress](http://www.aliexpress.com/item/2-axis-BGC-Brushless-Camera-Gimbal-GoPro3-Controller-PTZ-aluminum-Full-set-of-parts/1585412479.html)

However, since the quadcopter in question has self-disassembled : It
was time to experiment with the gimbal board as (potentially) 
an Arduino compatible-host for for Johnny-Five nodebot control.

Fortunately, it became apparent from its documentation and source code 
that the 'Martinez-compatible' Gimbal board is equivalent to an Arduino MegaPro, 
and I spent the afternoon figuring out the pin assignments, etc.

Key features of the write-up:

* Identified board (and LED pin) so that the gimbal unit can run Blink 
  using the ```ino``` command-line utility (NB: wanted to do this due to heavy-IDE allergy)
  * This proved its programmability in C, and upload functionality via USB
  
* Create ```fermata``` firmware for the board (small modification required to avoid IDE)

* Write NodeBot code to (a) blink and (b) control the motors
  * The brushless motors are controlled by sending 3 different PWM signals (one to each brushless motor wire),
    which in turn can control the motor position fractionally between individual magnet poles

If anyone needs help enhancing the code (which I'll continue to add to), please let me know.

