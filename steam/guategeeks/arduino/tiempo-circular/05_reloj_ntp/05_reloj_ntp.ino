/*
  Tiempo Circular · 05 · La hora que viene de la red
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI

  El mismo reloj de la capa anterior, pero con la hora tomada de un servidor
  NTP por WiFi. Corrige las dos fallas de millis(): la deriva del oscilador y
  la hora inicial escrita a mano.

  CNB Segundo Básico:
    TAC 1.1: dispositivos perifericos de comunicacion (p. 15)
    CN 1.3: medicion de magnitudes, unidades de tiempo (p. 16)

  CREDENCIALES: van en credenciales.h, que NO se versiona. Copiar
  credenciales.h.ejemplo, renombrarlo y escribir ahi el SSID y la clave.
*/

#include <WiFi.h>
#include <time.h>
#include <DIYables_TFT_Round.h>
#include "credenciales.h"

#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

const int CX    = 120;
const int CY    = 120;
const int RADIO = 118;

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
  HUSO HORARIO

  Los servidores NTP entregan la hora en UTC, el mismo instante para todo el
  planeta. Guatemala está en UTC-6, así que hay que restar seis horas.

  Guatemala NO cambia de hora en verano, así que el ajuste de horario de verano
  es cero. En un país que sí lo hace, esa segunda constante no sería cero, y el
  reloj se atrasaría o adelantaría una hora dos veces al año.
*/
const long  OFFSET_UTC_SEG       = -6 * 3600;  // UTC-6
const int   OFFSET_VERANO_SEG    = 0;          // Guatemala no aplica horario de verano
const char* SERVIDOR_NTP         = "pool.ntp.org";

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

void dibujarDigital(int h, int m, int s) {
  const int X = CX - 52;
  const int Y = CY + 45;
  TFT_display.fillRect(X, Y, 104, 16, FONDO);
  int h12 = (h % 12 == 0) ? 12 : h % 12;
  char texto[9];
  sprintf(texto, "%02d:%02d:%02d", h12, m, s);
  TFT_display.setTextSize(2);
  TFT_display.setTextColor(C_TEXT);
  TFT_display.setCursor(X, Y);
  TFT_display.print(texto);
}

// Mensaje centrado en pantalla, para avisar del estado de la conexión.
void aviso(const char* texto) {
  TFT_display.fillRect(20, CY - 12, 200, 20, FONDO);
  TFT_display.setTextSize(1);
  TFT_display.setTextColor(C_TEXT);
  TFT_display.setCursor(CX - 55, CY - 6);
  TFT_display.print(texto);
}

void setup() {
  Serial.begin(115200);
  delay(200);

  TFT_display.begin();
  TFT_display.setRotation(0);
  TFT_display.fillScreen(FONDO);
  aviso("Conectando WiFi...");

  WiFi.begin(WIFI_SSID, WIFI_CLAVE);

  // Se intenta durante 20 segundos. Si la red no responde, no se queda colgado
  // para siempre: avisa y sigue, para poder pasar a la ruta sin red.
  unsigned long inicio = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - inicio < 20000UL) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("Sin WiFi. Usar la ruta alterna de la sesion 10."));
    aviso("Sin WiFi");
    delay(2000);
  } else {
    Serial.print(F("Conectado. IP: "));
    Serial.println(WiFi.localIP());
    aviso("Pidiendo la hora...");

    configTime(OFFSET_UTC_SEG, OFFSET_VERANO_SEG, SERVIDOR_NTP);

    // configTime() no espera respuesta: hay que preguntar hasta que llegue.
    struct tm t;
    if (getLocalTime(&t, 10000)) {
      Serial.print(F("Hora obtenida por NTP: "));
      Serial.println(asctime(&t));
    } else {
      Serial.println(F("El servidor NTP no respondio."));
      aviso("NTP no respondio");
      delay(2000);
    }
  }

  TFT_display.fillScreen(FONDO);
  dibujarCaratula();
}

void loop() {
  struct tm t;

  if (!getLocalTime(&t)) {
    // Todavía no hay hora válida. No se dibuja basura: se avisa y se espera.
    aviso("Sin hora valida");
    delay(1000);
    return;
  }

  int segundos = t.tm_sec;
  int minutos  = t.tm_min;
  int horas    = t.tm_hour % 12;

  float angSeg  = segundos * 6.0;
  float angMin  = minutos * 6.0;
  float angHora = horas * 30.0 + minutos * 0.5;

  if (segundos != prevSeg) {
    if (prevAngSeg >= 0)  dibujarAguja(prevAngSeg, LARGO_SEG, FONDO);
    if (prevAngMin >= 0)  dibujarAguja(prevAngMin, LARGO_MIN, FONDO);
    if (prevAngHora >= 0) dibujarAguja(prevAngHora, LARGO_HORA, FONDO);

    dibujarCaratula();

    dibujarAguja(angHora, LARGO_HORA, C_HORA);
    dibujarAguja(angMin, LARGO_MIN, C_MIN);
    dibujarAguja(angSeg, LARGO_SEG, C_SEG);
    TFT_display.fillCircle(CX, CY, 4, C_SEG);

    dibujarDigital(t.tm_hour, minutos, segundos);

    prevAngSeg = angSeg;
    prevAngMin = angMin;
    prevAngHora = angHora;
    prevSeg = segundos;
  }

  delay(50);
}
