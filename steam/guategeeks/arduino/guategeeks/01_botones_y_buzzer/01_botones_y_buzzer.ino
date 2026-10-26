/*
  SMARS Aula Autónomo v1
  Licencia: MIT
  Hardware: Arduino Uno + shield L293D + HC-SR04 + 2 botones + buzzer
  No requiere Bluetooth ni teléfono.
*/

const byte PIN_BOTON_MODO = A1;
const byte PIN_BOTON_INICIO = A2;
const byte PIN_BUZZER = A0;

bool pulsado(byte pin) {
  static unsigned long ultimaLectura = 0;
  if (millis() - ultimaLectura < 60) return false;
  if (digitalRead(pin) == LOW) {
    ultimaLectura = millis();
    while (digitalRead(pin) == LOW) { delay(5); }
    return true;
  }
  return false;
}

void setup() {
  pinMode(PIN_BOTON_MODO, INPUT_PULLUP);
  pinMode(PIN_BOTON_INICIO, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.begin(9600);
  Serial.println(F("Prueba de botones lista"));
}

void loop() {
  if (pulsado(PIN_BOTON_MODO)) {
    tone(PIN_BUZZER, 880, 120);
    Serial.println(F("Boton MODO"));
  }
  if (pulsado(PIN_BOTON_INICIO)) {
    tone(PIN_BUZZER, 1320, 180);
    Serial.println(F("Boton INICIO"));
  }
}
