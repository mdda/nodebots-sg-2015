# International Nodebots Day in Singapore (2015)

This is a repo that represents what I did for the hacking day
held in Singapore at the IDA Labs.

### BeagleBoneBlack (notes)

The initial two pieces concern the BeagleBoneBlack board that 
I bought ages ago, and wanted to see whether could be used for 
NodeBots experiments.  Short answer : Yes, but currently Fedora
does not easily package up the same 'ethernet over USB' boot mode
that the default Angstrom distro provides.  

* Desire to make it work on Fedora 22
* But, network-over-USB seems to be a sticking point...

Since I couldn't make Fedora boot to my satisfation, that meant it
was game-over for the BeagleBoneBlack (for now).

### Gimbal

The gimbal is a very attractive (to roboticists) piece of hardware that 
was originally designed to stabilised a camera mounted beneath a quadcopter.

One eye-catching thing is that the entire assembly (two brushless motors,
gimbal controller board, 3-axis sensor and CNCed aluminium hardware) 
currently costs :

*  [less than $60 from AliExpress](http://www.aliexpress.com/item/2-axis-BGC-Brushless-Camera-Gimbal-GoPro3-Controller-PTZ-aluminum-Full-set-of-parts/1585412479.html)

However, since the quadcopter in question has self-disassembled : It
was time to exeriment with the gimbal board as (potentially) 
an Arduino compatible-host for for Johnny-Five nodebot control.

Fortunately, it became apparent that the 'Martinez-compatible' 
Gimbal board is equivalent to an Arduino MegaPro, and 
I spent the afternoon figuring out the pin assignments, etc.

