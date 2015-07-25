
// #define LED_PIN 13
// See LEDPIN_PINMODE in BruGi definitions.h
#define LED_PIN 8

void setup()
{
    pinMode(LED_PIN, OUTPUT);
}

void loop()
{
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(900);
}
