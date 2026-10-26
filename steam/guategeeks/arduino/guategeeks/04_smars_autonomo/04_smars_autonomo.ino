/*
  SMARS Aula Autónomo v1
  Licencia: MIT
  Hardware: Arduino Uno + shield L293D + HC-SR04 + 2 botones + buzzer
  No requiere Bluetooth ni teléfono.
*/

/*
  ── Nota de adopción GuateGeeks ──────────────────────────────────────────────
  Adoptado de: smars_aula_autonomo_v2_fuentes_publicas/code/arduino/
                 04_smars_autonomo/04_smars_autonomo.ino
  Fecha de adopción: 2026-07-30
  Cambios aplicados: solo formato y comentarios en español.
                     Adaptado al contrato GuateGeeks con shield L293D.
  Licencia del código: MIT (ver encabezado original arriba y ../LICENCIAS.md)
  ─────────────────────────────────────────────────────────────────────────────

  Este es el firmware final. Integra todo lo que se probó por separado en los
  sketches 01, 02 y 03:

    01_botones_y_buzzer     → botones MODO/INICIO y tonos
    02_prueba_motores       → función motor() y mover()
    03_prueba_ultrasonido   → lectura de distancia

  Actividad de lectura (sesión 9): localiza en este archivo las constantes de
  pines, los parámetros calibrables, las funciones de motores, la función de
  distancia, la función de evasión y las decisiones del loop.
*/

// ── Pines ───────────────────────────────────────────────────────────────────
#include <AFMotor.h>

// Deben coincidir con la tabla de cableado canónica. No cambiar.
const byte BUZZER = A0, BOTON_MODO = A1, BOTON_INICIO = A2;
const byte TRIG = A3, ECHO = A4, PIN_ENTROPIA = A5;

AF_DCMotor motorIzquierdo(1, MOTOR12_64KHZ);  // M1 del shield
AF_DCMotor motorDerecho(2, MOTOR12_64KHZ);    // M2 del shield

// Cambiar a true si una oruga gira al revés después de verificar M1/M2.
const bool INVERTIR_IZQUIERDO = false;
const bool INVERTIR_DERECHO = false;

// ── Parámetros calibrables ──────────────────────────────────────────────────
// Estos tres valores son los que conviene ajustar según tu robot y tu batería.
const int VELOCIDAD = 165;            // límite seguro para 6xAAA NiMH
const int VELOCIDAD_GIRO = 155;       // algo menor: girar exige más torque
const unsigned int UMBRAL_CM = 24;    // a qué distancia se considera obstáculo

// ── Estado del robot ────────────────────────────────────────────────────────
enum Modo : byte { DETENIDO, EXPLORAR, DEMOSTRACION };
Modo modo = DETENIDO;
bool ejecutando = false;              // el botón INICIO alterna esta bandera
unsigned long ultimoBoton = 0;        // marca de tiempo para el antirrebote

// ── Motores ─────────────────────────────────────────────────────────────────

/*
  Controla un motor del shield L293D.
  La velocidad lleva signo: positiva avanza, negativa retrocede, 0 libera.
*/
void motor(AF_DCMotor &m, int v, bool invertir) {
  v = constrain(v, -255, 255);
  if (invertir) v = -v;

  if (v == 0) {
    m.setSpeed(0);
    m.run(RELEASE);
    return;
  }

  m.setSpeed(abs(v));
  m.run(v > 0 ? FORWARD : BACKWARD);
}

/*
  Mueve las dos orugas de forma independiente. Aquí está la clave del giro:
  con signos opuestos el robot rota sobre su propio eje (giro pivote), que es
  lo que permite maniobrar en un espacio cerrado.
*/
void mover(int izquierda, int derecha) {
  motor(motorIzquierdo, izquierda, INVERTIR_IZQUIERDO);
  motor(motorDerecho, derecha, INVERTIR_DERECHO);
}

void frenar() {
  mover(0, 0);
}

// ── Botones ─────────────────────────────────────────────────────────────────

/*
  Lee un botón con antirrebote.
  Los botones usan INPUT_PULLUP: en reposo leen HIGH, y al pulsarse leen LOW.
  Tras detectar la pulsación espera a que se suelte, para no contarla dos veces.
*/
bool pulsado(byte pin) {
  if (millis() - ultimoBoton < 180) return false;

  if (digitalRead(pin) == LOW) {
    ultimoBoton = millis();
    while (digitalRead(pin) == LOW) delay(4);   // esperar a que suelte
    return true;
  }
  return false;
}

// ── Distancia ───────────────────────────────────────────────────────────────

/*
  Una sola lectura del HC-SR04.
  El 58 convierte microsegundos a centímetros y ya incluye el viaje de ida y
  vuelta del sonido: NO hay que dividir otra vez entre 2.
  Si no llega eco dentro del tiempo límite, devuelve 400 cm como centinela de
  "vía libre", no 0.
*/
unsigned int unaLecturaCm() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(3);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  unsigned long us = pulseIn(ECHO, HIGH, 30000UL);
  return us == 0 ? 400 : (unsigned int)(us / 58UL);
}

/*
  Toma tres lecturas y devuelve la mediana.
  Una lectura aislada puede fallar por un eco raro; la mediana descarta ese
  valor extremo sin necesidad de promediar.
*/
unsigned int distanciaFiltradaCm() {
  unsigned int a = unaLecturaCm();
  delay(12);
  unsigned int b = unaLecturaCm();
  delay(12);
  unsigned int c = unaLecturaCm();

  // Tres intercambios ordenan a <= b <= c, dejando la mediana en b.
  if (a > b) { unsigned int t = a; a = b; b = t; }
  if (b > c) { unsigned int t = b; b = c; c = t; }
  if (a > b) { unsigned int t = a; a = b; b = t; }

  return b;
}

// ── Señales y maniobras ─────────────────────────────────────────────────────

/*
  Anuncia el modo activo con tantos pitidos como el número de modo, cada uno
  más agudo que el anterior. Permite operar el robot sin pantalla.
*/
void anunciarModo() {
  frenar();
  for (byte i = 0; i <= modo; i++) {
    tone(BUZZER, 900 + i * 180, 90);
    delay(130);
  }
  Serial.print(F("Modo: "));
  Serial.println((int)modo);
}

/*
  Maniobra de evasión: frena, avisa, retrocede, gira y vuelve a medir.

  La dirección y la duración del giro son ALEATORIAS a propósito. Si el robot
  girara siempre al mismo lado y siempre lo mismo, en una esquina repetiría la
  misma maniobra para siempre y quedaría atrapado.
*/
void evitarObstaculo() {
  frenar();
  tone(BUZZER, 520, 120);
  delay(140);

  // Retroceder para ganar espacio antes de girar.
  mover(-VELOCIDAD, -VELOCIDAD);
  delay(320);
  frenar();
  delay(80);

  bool izquierda = random(0, 2) == 0;
  int tiempoGiro = random(380, 680);

  // Signos opuestos = giro pivote sobre el propio eje.
  mover(izquierda ? -VELOCIDAD_GIRO : VELOCIDAD_GIRO,
        izquierda ?  VELOCIDAD_GIRO : -VELOCIDAD_GIRO);
  delay(tiempoGiro);
  frenar();
  delay(70);
}

// ── Modos de operación ──────────────────────────────────────────────────────

/*
  Modo EXPLORAR: avanza mientras haya espacio; si detecta un obstáculo dentro
  del umbral, ejecuta la evasión.
*/
void modoExplorar() {
  unsigned int cm = distanciaFiltradaCm();
  Serial.print(F("Distancia: "));
  Serial.println(cm);

  if (cm <= UMBRAL_CM) evitarObstaculo();
  else mover(VELOCIDAD, VELOCIDAD);
}

/*
  Modo DEMOSTRACION: secuencia fija corta para exhibición. Al terminar se
  detiene solo, apagando la bandera de ejecución.
*/
void modoDemostracion() {
  mover(VELOCIDAD, VELOCIDAD);
  delay(800);
  mover(-VELOCIDAD_GIRO, VELOCIDAD_GIRO);
  delay(500);
  mover(VELOCIDAD, VELOCIDAD);
  delay(800);
  mover(VELOCIDAD_GIRO, -VELOCIDAD_GIRO);
  delay(500);

  frenar();
  ejecutando = false;
}

// ── Arranque ────────────────────────────────────────────────────────────────

void setup() {
  const byte pines[] = {TRIG, BUZZER};
  for (byte i = 0; i < sizeof(pines) / sizeof(pines[0]); i++) {
    pinMode(pines[i], OUTPUT);
  }

  pinMode(ECHO, INPUT);
  pinMode(BOTON_MODO, INPUT_PULLUP);
  pinMode(BOTON_INICIO, INPUT_PULLUP);

  frenar();

  Serial.begin(9600);

  // Semilla de aleatoriedad desde A5 sin conectar: su ruido hace que la
  // secuencia de giros no sea igual en cada encendido.
  randomSeed(analogRead(PIN_ENTROPIA));

  tone(BUZZER, 1200, 150);   // pitido de arranque
}

// ── Bucle principal ─────────────────────────────────────────────────────────

void loop() {
  // El botón MODO rota entre DETENIDO, EXPLORAR y DEMOSTRACION.
  if (pulsado(BOTON_MODO)) {
    modo = (Modo)((modo + 1) % 3);
    ejecutando = false;
    anunciarModo();
  }

  // El botón INICIO arranca o pausa el modo activo.
  if (pulsado(BOTON_INICIO)) {
    ejecutando = !ejecutando;
    if (!ejecutando) frenar();
    tone(BUZZER, ejecutando ? 1400 : 500, 120);
  }

  // Guarda de seguridad: sin ejecución activa o en DETENIDO, no mover nada.
  if (!ejecutando || modo == DETENIDO) {
    frenar();
    delay(20);
    return;
  }

  if (modo == EXPLORAR) modoExplorar();
  else if (modo == DEMOSTRACION) modoDemostracion();
}
