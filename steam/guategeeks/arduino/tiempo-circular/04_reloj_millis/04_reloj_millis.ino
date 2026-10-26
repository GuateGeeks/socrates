/*
  Tiempo Circular · 04 · El reloj que deriva
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI

  Un reloj completo, analógico y digital, sobre millis(). No se conecta a
  ninguna red: la hora sale del oscilador de la placa y de una hora inicial
  escrita a mano.

  Este reloj SE ATRASA O SE ADELANTA, y eso es intencional. En la sesión 9 se
  mide cuánto. En la sesión 10 se corrige con NTP.

  CNB Segundo Básico:
    CN 4.3: movimiento circular uniforme (p. 21) -- el segundero gira a 6 grados
            por segundo, con velocidad angular constante y periodo de 60 s
    MAT 1.3: razones trigonometricas (p. 13)
    MAT 2.1: conectivos logicos (p. 13) -- las condiciones de redibujo
*/

#include <DIYables_TFT_Round.h>

#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

const int CX    = 120;
const int CY    = 120;
const int RADIO = 118;

// Largo de cada manecilla. El segundero llega casi al borde; el horario es corto.
const int LARGO_HORA = 55;
const int LARGO_MIN  = 80;
const int LARGO_SEG  = 100;

uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

const uint16_t FONDO  = 0x0000;
const uint16_t BORDE  = 0xFFFF;
const uint16_t MARCA  = 0xFFE0;
const uint16_t C_HORA = 0xFFFF;
const uint16_t C_MIN  = 0x07FF;
const uint16_t C_SEG  = 0xF800;
const uint16_t C_TEXT = 0xFFE0;

/*
  HORA INICIAL

  millis() cuenta milisegundos desde que la placa arrancó, no desde medianoche.
  Para que el reloj muestre una hora creíble hay que decirle desde qué hora
  empezar a contar. Se escribe a mano antes de cargar el sketch.

  Consecuencia directa: cada vez que la placa se reinicia, el reloj vuelve a
  esta hora. Un reloj de verdad no hace eso.
*/
const unsigned long HORA_INICIAL_MS =
    9UL  * 3600000UL +   //  9 horas
    0UL  * 60000UL   +   //  0 minutos
    0UL  * 1000UL;       //  0 segundos

// Última posición dibujada de cada manecilla, para poder borrarla.
float prevAngHora = -1;
float prevAngMin  = -1;
float prevAngSeg  = -1;
int   prevSeg     = -1;

int puntoX(float ang, int r) { return CX + (int)(r * sin(ang * PI / 180.0)); }
int puntoY(float ang, int r) { return CY - (int)(r * cos(ang * PI / 180.0)); }

void dibujarAguja(float ang, int largo, uint16_t color) {
  TFT_display.drawLine(CX, CY, puntoX(ang, largo), puntoY(ang, largo), color);
}

void dibujarCaratula() {
  TFT_display.drawCircle(CX, CY, RADIO, BORDE);
  for (int hora = 0; hora < 12; hora++) {
    float ang = hora * 30.0;
    int largo = (hora % 3 == 0) ? 20 : 10;
    TFT_display.drawLine(puntoX(ang, RADIO - 2 - largo), puntoY(ang, RADIO - 2 - largo),
                         puntoX(ang, RADIO - 2), puntoY(ang, RADIO - 2), MARCA);
  }
}

/*
  Escribe la hora digital debajo del centro, en formato HH:MM:SS.

  Antes de escribir se borra el rectángulo que ocupa el texto. Escribir encima
  sin borrar deja los trazos del número anterior mezclados con el nuevo, y el
  resultado es ilegible en cuanto cambia un dígito.
*/
void dibujarDigital(int h, int m, int s) {
  const int X = CX - 52;
  const int Y = CY + 45;

  TFT_display.fillRect(X, Y, 104, 16, FONDO);

  // El reloj muestra 12 horas: la hora 0 se lee como 12.
  int h12 = (h == 0) ? 12 : h;

  char texto[9];
  sprintf(texto, "%02d:%02d:%02d", h12, m, s);

  TFT_display.setTextSize(2);
  TFT_display.setTextColor(C_TEXT);
  TFT_display.setCursor(X, Y);
  TFT_display.print(texto);
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println(F("Tiempo Circular 04 - reloj sobre millis()"));
  Serial.println(F("Este reloj deriva. En la sesion 9 se mide cuanto."));

  TFT_display.begin();
  TFT_display.setRotation(0);
  TFT_display.fillScreen(FONDO);
  dibujarCaratula();
}

void loop() {
  unsigned long ahora = HORA_INICIAL_MS + millis();

  unsigned long totalSeg = ahora / 1000UL;
  int segundos = totalSeg % 60;
  int minutos  = (totalSeg / 60) % 60;
  int horas    = (totalSeg / 3600) % 12;

  /*
    ÁNGULOS

    El segundero recorre 360 grados en 60 segundos: 6 grados por segundo,
    siempre los mismos. Eso es movimiento circular uniforme (CN 4.3).

    El horario avanza 30 grados por hora, pero además medio grado por cada
    minuto: si no, se quedaría clavado en la hora en punto durante 60 minutos
    y saltaría de golpe.
  */
  float angSeg  = segundos * 6.0;
  float angMin  = minutos * 6.0;
  float angHora = horas * 30.0 + minutos * 0.5;

  // Solo se redibuja cuando el segundo cambió. Repintar la pantalla completa en
  // cada vuelta del loop produce parpadeo: vale la pena probarlo para verlo.
  if (segundos != prevSeg) {

    if (prevAngSeg >= 0) dibujarAguja(prevAngSeg, LARGO_SEG, FONDO);
    if (prevAngMin >= 0) dibujarAguja(prevAngMin, LARGO_MIN, FONDO);
    if (prevAngHora >= 0) dibujarAguja(prevAngHora, LARGO_HORA, FONDO);

    // Borrar con el color de fondo también borra pedazos de la carátula que
    // estaban debajo, así que hay que volver a trazarla.
    dibujarCaratula();

    dibujarAguja(angHora, LARGO_HORA, C_HORA);
    dibujarAguja(angMin, LARGO_MIN, C_MIN);
    dibujarAguja(angSeg, LARGO_SEG, C_SEG);
    TFT_display.fillCircle(CX, CY, 4, C_SEG);

    dibujarDigital(horas, minutos, segundos);

    prevAngSeg = angSeg;
    prevAngMin = angMin;
    prevAngHora = angHora;
    prevSeg = segundos;
  }

  delay(50);
}
