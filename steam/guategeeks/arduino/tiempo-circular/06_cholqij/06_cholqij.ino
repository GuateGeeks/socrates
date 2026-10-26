/*
  Tiempo Circular · 06 · Cholq'ij
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI

  Una carátula que cuenta el ciclo de 260 días del Cholq'ij en lugar de las
  12 horas del reloj.

  QUÉ HACE ESTE SKETCH: dibuja la estructura del ciclo -- 20 posiciones y 13
  números -- y avanza la cuenta a partir de un día de anclaje configurado por
  el docente.

  QUÉ NO HACE: no interpreta el significado de un día, no lee energías y no
  sustituye a quien sí tiene ese conocimiento. Ver el README y la sesión 11.

  CNB Segundo Básico:
    MAT 5.1: sistemas de numeracion posicional, base 20 (p. 15)
    MAT 5.2: ciclos en el calendario Cholq'ij y Hab' (contenido 5.2.1, p. 15)
    MAT 5.3: el 13 y el 20, ciclos de la vida (contenido 5.3.1, p. 15)
    MAT 1.2: angulos notables en la circunferencia (p. 13)
*/

#include <DIYables_TFT_Round.h>

#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

const int CX = 120;
const int CY = 120;

uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

const uint16_t FONDO      = 0x0000;
const uint16_t C_ANILLO   = 0xFFFF;
const uint16_t C_POSICION = 0xFFE0;  // amarillo: las 20 posiciones
const uint16_t C_NUMERO   = 0x07FF;  // celeste: el ciclo de 13
const uint16_t C_ACTUAL   = 0xF800;  // rojo: el día de hoy
const uint16_t C_TEXTO    = 0xFFFF;

/*
  ─────────────────────────────────────────────────────────────────────────
  LA ESTRUCTURA DEL CICLO

  El Cholq'ij combina 20 posiciones con 13 números. Cada día avanza las dos
  cuentas a la vez, y la combinación no se repite hasta que pasan

      13 x 20 = 260 dias

  porque 13 y 20 no tienen divisores comunes.

  Al repartir cada cuenta sobre la circunferencia:

      20 posiciones -> 360 / 20 = 18 grados          EXACTO
      13 numeros    -> 360 / 13 = 27.6923...  grados NO EXACTO

  Ese segundo divisor es el que da la lección de la sesión: no cabe un número
  entero de veces en la vuelta, así que cualquier redondeo acumula error.
  ─────────────────────────────────────────────────────────────────────────
*/
const int POSICIONES = 20;
const int NUMEROS    = 13;
const int CICLO      = POSICIONES * NUMEROS;  // 260

const float PASO_POSICION = 360.0 / POSICIONES;  // 18.0 exacto
const float PASO_NUMERO   = 360.0 / NUMEROS;     // 27.6923...

/*
  ─────────────────────────────────────────────────────────────────────────
  EL ANCLA

  Para saber en qué día del ciclo estamos hoy hace falta un dato que el
  dispositivo NO puede deducir solo: qué día del Cholq'ij corresponde a una
  fecha conocida.

  Este programa NO trae una constante de correlación propia, porque no está en
  posición de afirmar una que no puede verificar. El docente toma el dato de
  una fuente publicada y lo escribe aquí, y el dispositivo cuenta hacia
  adelante desde ese punto.

  Que el modelo necesite un dato de afuera no es una limitación del sketch: es
  parte de lo que se aprende. Un modelo se ancla en una observación, no se
  deduce de la nada.

  POSICION_ANCLA: 0 a 19   (índice de la posición en el anillo de 20)
  NUMERO_ANCLA:   1 a 13   (número que acompaña a esa posición)
  DIAS_DESDE_ANCLA: cuántos días pasaron desde ese día hasta hoy
  ─────────────────────────────────────────────────────────────────────────
*/
const int POSICION_ANCLA    = 0;
const int NUMERO_ANCLA      = 1;
const long DIAS_DESDE_ANCLA = 0;

int posicionDeHoy() {
  long p = (POSICION_ANCLA + DIAS_DESDE_ANCLA) % POSICIONES;
  if (p < 0) p += POSICIONES;   // por si el ancla es una fecha futura
  return (int)p;
}

int numeroDeHoy() {
  // Los números van de 1 a 13, no de 0 a 12: hay que correr el índice.
  long n = ((NUMERO_ANCLA - 1) + DIAS_DESDE_ANCLA) % NUMEROS;
  if (n < 0) n += NUMEROS;
  return (int)n + 1;
}

int puntoX(float ang, int r) { return CX + (int)(r * sin(ang * PI / 180.0)); }
int puntoY(float ang, int r) { return CY - (int)(r * cos(ang * PI / 180.0)); }

/*
  Anillo exterior: las 20 posiciones, cada una a 18 grados de la anterior.

  Este anillo hace visible la base 20 que pide MAT 5.1: la posición en la
  pantalla ES el valor posicional. Contar de 19 a 0 da la vuelta completa y
  empieza otra vez, igual que al pasar de 19 a 20 en una cuenta de base 20.
*/
void dibujarAnilloPosiciones() {
  const int R = 112;
  TFT_display.drawCircle(CX, CY, R + 4, C_ANILLO);

  for (int i = 0; i < POSICIONES; i++) {
    float ang = i * PASO_POSICION;
    bool esHoy = (i == posicionDeHoy());

    // Los cuatro puntos cardinales del anillo caen en 0, 90, 180 y 270 grados,
    // que son las posiciones 0, 5, 10 y 15. Contenido 5.2.3 de la malla.
    bool cardinal = (i % 5 == 0);

    int radio = esHoy ? 7 : (cardinal ? 5 : 3);
    uint16_t color = esHoy ? C_ACTUAL : C_POSICION;

    TFT_display.fillCircle(puntoX(ang, R), puntoY(ang, R), radio, color);
  }
}

/*
  Anillo interior: los 13 números, cada uno a 360/13 grados del anterior.

  Acá está el error de redondeo. El paso real es 27.6923... grados. Se dibuja
  con el valor completo, en float, y aun así el último punto no cae exactamente
  donde cayó el primero, porque la pantalla trabaja en píxeles enteros.
*/
void dibujarAnilloNumeros() {
  const int R = 78;
  TFT_display.drawCircle(CX, CY, R + 4, C_ANILLO);

  for (int i = 0; i < NUMEROS; i++) {
    float ang = i * PASO_NUMERO;
    bool esHoy = (i == numeroDeHoy() - 1);

    int radio = esHoy ? 7 : 3;
    uint16_t color = esHoy ? C_ACTUAL : C_NUMERO;

    TFT_display.fillCircle(puntoX(ang, R), puntoY(ang, R), radio, color);
  }
}

void dibujarCentro() {
  char texto[16];

  TFT_display.setTextSize(2);
  TFT_display.setTextColor(C_TEXTO);

  // Número y posición del día, en el centro.
  sprintf(texto, "%d - %d", numeroDeHoy(), posicionDeHoy());
  TFT_display.setCursor(CX - 34, CY - 16);
  TFT_display.print(texto);

  TFT_display.setTextSize(1);
  TFT_display.setCursor(CX - 30, CY + 8);
  TFT_display.print(F("Cholq'ij"));

  // Día del ciclo de 260, para que se vea la cuenta avanzar.
  long dia = ((DIAS_DESDE_ANCLA % CICLO) + CICLO) % CICLO;
  sprintf(texto, "dia %ld/260", dia + 1);
  TFT_display.setCursor(CX - 32, CY + 22);
  TFT_display.print(texto);
}

void setup() {
  Serial.begin(115200);
  delay(200);

  TFT_display.begin();
  TFT_display.setRotation(0);
  TFT_display.fillScreen(FONDO);

  dibujarAnilloPosiciones();
  dibujarAnilloNumeros();
  dibujarCentro();

  // Los números que la sesión pide comprobar a mano antes de creerle al código.
  Serial.println(F("=== Estructura del ciclo ==="));
  Serial.print(F("Posiciones: "));        Serial.println(POSICIONES);
  Serial.print(F("Numeros: "));           Serial.println(NUMEROS);
  Serial.print(F("Dias del ciclo: "));    Serial.println(CICLO);
  Serial.print(F("Paso por posicion: ")); Serial.print(PASO_POSICION, 4);
  Serial.println(F(" grados"));
  Serial.print(F("Paso por numero: "));   Serial.print(PASO_NUMERO, 4);
  Serial.println(F(" grados"));

  /*
    El experimento del error acumulado.

    Si alguien redondeara el paso de los números a un decimal (27.7 grados) y
    diera las trece vueltas, no llegaría a 360 sino a 360.1. Esa décima de
    grado, a un radio de 78 pixeles, vale menos de un pixel: existe pero no se
    ve. La pregunta de la sesión es qué pasaría si el radio fuera mucho mayor,
    o si las vueltas fueran cientos en vez de trece.
  */
  Serial.println();
  Serial.println(F("=== Error de redondeo ==="));
  float redondeado = 27.7;
  Serial.print(F("13 pasos de 27.7 grados = "));
  Serial.println(redondeado * NUMEROS, 4);
  Serial.print(F("13 pasos exactos = "));
  Serial.println(PASO_NUMERO * NUMEROS, 4);
  Serial.print(F("Error acumulado: "));
  Serial.print(redondeado * NUMEROS - 360.0, 4);
  Serial.println(F(" grados"));
}

void loop() {
}
