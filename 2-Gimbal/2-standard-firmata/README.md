## Loading in the Firmata

This firmware enables Node to talk to a standard 'resident' firmware interface
that runs on the Arduino.

The ```.ino``` file modified here is taken from the [Firmata Repo Examples](https://raw.githubusercontent.com/firmata/arduino/master/examples/StandardFirmata/StandardFirmata.ino


Clone the repo into the ```lib``` folder (will be called ```arduino``` there) :
```
pushd lib
git clone https://github.com/firmata/arduino.git
popd
```

When compiling, this produces the following warning, which appears to be harmless :
```
.build/pro5v328/Makefile:229: warning: 
   overriding recipe for target '.build/pro5v328/arduino/libarduino.a'
.build/pro5v328/Makefile:92: warning: 
   ignoring old recipe for target '.build/pro5v328/arduino/libarduino.a'
```

### StandardFirmata.ino Tweaks

* FastPWM initialisation has been added to ```setup()```


### Building the Firmware and Uploading

```
ino build
ino upload
```

