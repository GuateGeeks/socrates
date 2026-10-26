/*
  SMARS Aula Autónomo v1
  Licencia: MIT
  Hardware: Arduino Uno + shield L293D + HC-SR04 + 2 botones + buzzer
  No requiere Bluetooth ni teléfono.
*/

#include <AFMotor.h>

AF_DCMotor motorIzquierdo(1, MOTOR12_64KHZ);  // M1 del shield
AF_DCMotor motorDerecho(2, MOTOR12_64KHZ);    // M2 del shield

const int VELOCIDAD_SEGURA = 160;  // 0..255

// Cambiar a true si una oruga gira al revés después de verificar M1/M2.
const bool INVERTIR_IZQUIERDO = false;
const bool INVERTIR_DERECHO = false;

void motor(AF_DCMotor &m, int velocidad, bool invertir) {
  velocidad = constrain(velocidad, -255, 255);
  if (invertir) velocidad = -velocidad;

  if (velocidad == 0) {
    m.setSpeed(0);
    m.run(RELEASE);
    return;
  }

  m.setSpeed(abs(velocidad));
  m.run(velocidad > 0 ? FORWARD : BACKWARD);
}

void mover(int izquierda, int derecha) {
  motor(motorIzquierdo, izquierda, INVERTIR_IZQUIERDO);
  motor(motorDerecho, derecha, INVERTIR_DERECHO);
}

void detener() {
  mover(0, 0);
}

void setup() {
  detener();
  Serial.begin(9600);
  Serial.println(F("Levanta el robot: inicia prueba de motores"));
  Serial.println(F("Shield L293D: izquierdo=M1, derecho=M2"));
}

void loop() {
  Serial.println(F("Adelante"));
  mover(VELOCIDAD_SEGURA, VELOCIDAD_SEGURA);
  delay(1500);

  detener();
  delay(700);

  Serial.println(F("Atras"));
  mover(-VELOCIDAD_SEGURA, -VELOCIDAD_SEGURA);
  delay(1500);

  detener();
  delay(700);

  Serial.println(F("Giro izquierda"));
  mover(-VELOCIDAD_SEGURA, VELOCIDAD_SEGURA);
  delay(900);

  detener();
  delay(1500);
}
