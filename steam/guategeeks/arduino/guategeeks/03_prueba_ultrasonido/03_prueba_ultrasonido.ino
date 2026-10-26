/*
  SMARS Aula Autónomo v1
  Licencia: MIT
  Hardware: Arduino Uno + shield L293D + HC-SR04 + 2 botones + buzzer
  No requiere Bluetooth ni teléfono.
*/

const byte TRIG = A3;
const byte ECHO = A4;

unsigned int distanciaCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(3);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  unsigned long duracion = pulseIn(ECHO, HIGH, 30000UL);
  if (duracion == 0) return 400;
  return (unsigned int)(duracion / 58UL);
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  Serial.begin(9600);
}
void loop() {
  Serial.print(F("Distancia: "));
  Serial.print(distanciaCm());
  Serial.println(F(" cm"));
  delay(150);
}
