## Fedora :: ino

http://inotool.org/

### Determine port used for USB serial

```
tail -f /var/log/messages
# ...
# Jul 25 12:32:58 changi kernel: usb 1-5: FTDI USB Serial Device converter now attached to ttyUSB0
# ...
```

This indicates that the correct interface setting is ```/dev/ttyUSB0```


### Determine board type for Gimbal

According to Martinez 50mm v3.0 manual, the gimbal board is a :
* Arduino Pro or Pro Mini (5V, 16MHz) w/ ATMega328

```
ino list-models
```

implies that the correct model setting is ```pro5v328```

### Create ```ino.ini```

Contents of ``ino.ini``` (to be put in each project being built) :
```
board-model = pro5v328
serial-port = /dev/ttyUSB0
```

### Initialise a Blink project

Following the notes in http://inotool.org/quickstart :
```
mkdir 0-blink
cd 0-blink
# here, 'blink' is a template (default is <BLANK>, which is very basic)
ino init -t blink  
```

Build it:
```
ino build
```

All the assets / intermediate files appear in ```.build/uno/```


Upload it:
```
ino upload
```

... And no flashing light ...

But, the gimbal does go limp, which suggests something is happening!


