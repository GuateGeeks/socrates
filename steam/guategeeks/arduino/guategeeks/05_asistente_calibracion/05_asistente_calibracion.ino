/*
  SMARS Aula Autónomo v1
  Licencia: MIT
  Hardware: Arduino Uno + shield L293D + HC-SR04 + 2 botones + buzzer
  No requiere Bluetooth ni teléfono.
*/

/*
  ── Nota de adopción GuateGeeks ──────────────────────────────────────────────
  Adoptado de: smars_aula_autonomo_v2_fuentes_publicas/code/arduino/
                 05_asistente_calibracion/05_asistente_calibracion.ino
  Fecha de adopción: 2026-07-30
  Licencia del código: MIT (ver encabezado original arriba y ../LICENCIAS.md)

  Cambios de formato: reindentado y comentarios en español.
                      Adaptado al contrato GuateGeeks con shield L293D.

  CORRECCIÓN NECESARIA PARA COMPILAR (única desviación de fondo):

    El original usaba pines directos de driver y, en setup(), un for-range
    sobre una lista entre llaves.

    Error del compilador para arduino:avr:uno:
        error: deducing from brace-enclosed initializer list
               requires #include <initializer_list>

    Recorrer una lista entre llaves con for-range necesita <initializer_list>,
    que el core AVR no expone. El sketch upstream nunca compiló.

    En esta variante el shield L293D no requiere declarar pines de motor; la
    salida se hace con AFMotor sobre M1 y M2. Se conserva el flujo observable
    del asistente: ajustar izquierda/derecha y probar 2 segundos.
  ─────────────────────────────────────────────────────────────────────────────

  ¿PARA QUÉ SIRVE ESTE SKETCH?

  Dos motores nunca son idénticos. Con el mismo valor PWM, una oruga gira algo
  más rápido que la otra, y el robot se desvía en vez de avanzar recto.

  Este asistente permite corregirlo desde el Monitor Serie, sin recompilar:

    i+   sube 5 al ajuste de la oruga izquierda
    i-   baja 5 al ajuste de la oruga izquierda
    d+   sube 5 al ajuste de la oruga derecha
    d-   baja 5 al ajuste de la oruga derecha
    p    prueba: avanza 2 segundos con los ajustes actuales

  PROCEDIMIENTO (sesión 11):
    1. Marca una línea recta en el piso y coloca el robot sobre ella.
    2. Escribe "p" y observa hacia qué lado se desvía.
    3. Si se desvía a la derecha, la oruga izquierda va más rápido: usa "i-".
       Si se desvía a la izquierda, usa "d-".
    4. Repite hasta que recorra los 2 segundos sin desviarse.
    5. Anota los valores I y D finales: son los offsets de TU robot.
    6. Trasládalos a 04_smars_autonomo y verifica que la trayectoria mejora.
*/

#include <AFMotor.h>

AF_DCMotor motorIzquierdo(1, MOTOR12_64KHZ);  // M1 del shield
AF_DCMotor motorDerecho(2, MOTOR12_64KHZ);    // M2 del shield

// Cambiar a true si una oruga gira al revés después de verificar M1/M2.
const bool INVERTIR_IZQUIERDO = false;
const bool INVERTIR_DERECHO = false;

// ── Ajustes de calibración ──────────────────────────────────────────────────
// Estos son los valores que vas descubriendo con los comandos serie.
int ajusteIzquierdo = 0;
int ajusteDerecho = 0;

const int BASE = 150;   // velocidad de referencia para la prueba

// ── Motores ─────────────────────────────────────────────────────────────────

/*
  Controla un motor del shield. La velocidad lleva signo.
*/
void motor(AF_DCMotor &m, int v, bool invertir){
  v = constrain(v, -255, 255);
  if(invertir) v = -v;

  if(v == 0){
    m.setSpeed(0);
    m.run(RELEASE);
    return;
  }

  m.setSpeed(abs(v));
  m.run(v > 0 ? FORWARD : BACKWARD);
}

void mover(int i,int d){
  motor(motorIzquierdo,i,INVERTIR_IZQUIERDO);
  motor(motorDerecho,d,INVERTIR_DERECHO);
}

void parar(){
  mover(0,0);
}

// ── Arranque ────────────────────────────────────────────────────────────────

void setup(){
  parar();
  Serial.begin(9600);
  Serial.println(F("Comandos: i+ i- d+ d- p. Cada prueba dura 2 s."));
  Serial.println(F("Shield L293D: izquierdo=M1, derecho=M2"));
}

// ── Bucle principal ─────────────────────────────────────────────────────────

void loop(){
  if(Serial.available()){
    String c=Serial.readStringUntil('\n');
    c.trim();

    if(c=="i+")ajusteIzquierdo+=5;
    if(c=="i-")ajusteIzquierdo-=5;
    if(c=="d+")ajusteDerecho+=5;
    if(c=="d-")ajusteDerecho-=5;

    if(c=="p"){
      mover(BASE+ajusteIzquierdo,BASE+ajusteDerecho);
      delay(2000);
      parar();
    }

    // Eco del estado actual, para no perder la cuenta de los ajustes.
    Serial.print(F("I="));
    Serial.print(ajusteIzquierdo);
    Serial.print(F(" D="));
    Serial.println(ajusteDerecho);
  }
}
