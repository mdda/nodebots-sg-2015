
https://raw.githubusercontent.com/firmata/arduino/master/examples/StandardFirmata/StandardFirmata.ino


git clone https://github.com/firmata/arduino.git
cp arduino/Firmata.* src/
cp arduino/Boards.* src/

## NB: The StandardFirmata.ino required tweaking :
```
#include <Firmata.h>
```
to
```
#include "Firmata.h"
```


```
ino build
ino upload
```

