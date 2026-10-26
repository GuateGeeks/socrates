/*
  Tiempo Circular · 03 · Geometría circular
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI

  Convierte un ángulo en un par de coordenadas. Es el corazón matemático del
  programa: todo lo que gira en las sesiones siguientes usa estas dos fórmulas.

  CNB Segundo Básico:
    MAT 1.2: ángulos notables en la circunferencia; simetría y transformaciones (p. 13)
    MAT 1.3: razones trigonométricas del triángulo rectángulo (p. 13)

  Se usa en las sesiones 5, 6 y 7, cambiando qué parte se activa:
    Sesión 5 -> MODO_PLANO      (centro, radio, los cuatro cuadrantes)
    Sesión 6 -> MODO_MARCAS     (las doce marcas cada 30 grados)
    Sesión 7 -> MODO_MANECILLA  (una manecilla que apunta a un ángulo dado)
*/

#include <DIYables_TFT_Round.h>

#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

// Cambiar este valor según la sesión: 5, 6 o 7.
#define SESION 7

const int CX    = 120;
const int CY    = 120;
const int RADIO = 118;

uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

const uint16_t FONDO   = 0x0000;
const uint16_t BORDE   = 0xFFFF;
const uint16_t MARCA   = 0xFFE0;  // amarillo
const uint16_t AGUJA   = 0xF800;  // rojo
const uint16_t EJE_X   = 0x07E0;  // verde
const uint16_t EJE_Y   = 0x001F;  // azul

/*
  ─────────────────────────────────────────────────────────────────────────
  LAS DOS FÓRMULAS

  El ángulo se mide en grados, en sentido horario, empezando en las 12.

      x = CX + radio * sin(angulo)
      y = CY - radio * cos(angulo)
                ↑
                el signo NEGATIVO es la parte que casi todos olvidan

  ¿Por qué el menos? Porque en la pantalla la Y crece hacia ABAJO, al revés
  que en el plano cartesiano de la clase de matemática. Si se pone un más, la
  carátula queda espejada de arriba a abajo: las 12 aparecen donde van las 6.

  ¿Por qué el seno va con la X y el coseno con la Y, si en clase suele ser al
  revés? Porque acá el ángulo se mide desde el eje vertical (las 12), no desde
  el horizontal. Medido desde las 12, el cateto horizontal es el opuesto —y por
  eso le toca el seno— y el vertical es el adyacente, que le toca al coseno.
  ─────────────────────────────────────────────────────────────────────────
*/
int puntoX(float anguloGrados, int radio) {
  float rad = anguloGrados * PI / 180.0;
  return CX + (int)(radio * sin(rad));
}

int puntoY(float anguloGrados, int radio) {
  float rad = anguloGrados * PI / 180.0;
  return CY - (int)(radio * cos(rad));
}

// Dibuja un radio desde el centro hacia el ángulo indicado.
void dibujarAguja(float anguloGrados, int largo, uint16_t color) {
  TFT_display.drawLine(CX, CY, puntoX(anguloGrados, largo), puntoY(anguloGrados, largo), color);
}

// Sesión 5: el plano. Centro, borde y los dos ejes.
void dibujarPlano() {
  TFT_display.drawCircle(CX, CY, RADIO, BORDE);

  // Eje horizontal en verde, eje vertical en azul.
  TFT_display.drawLine(CX - RADIO, CY, CX + RADIO, CY, EJE_X);
  TFT_display.drawLine(CX, CY - RADIO, CX, CY + RADIO, EJE_Y);

  TFT_display.setTextSize(1);
  TFT_display.setTextColor(BORDE);
  TFT_display.setCursor(CX + 4, CY - RADIO + 4);
  TFT_display.print(F("0 grados"));
  TFT_display.setCursor(CX + 4, CY + 6);
  TFT_display.print(F("(120,120)"));
}

/*
  Sesión 6: las doce marcas.

  Doce marcas repartidas en una vuelta completa: 360 / 12 = 30 grados exactos
  entre una y otra. Las de las 12, 3, 6 y 9 se dibujan más largas porque caen
  sobre los ángulos notables 0, 90, 180 y 270.

  La simetría se ve sola: la marca de las 12 y la de las 6 están sobre la misma
  recta, y lo mismo pasa con cada par opuesto. Girar la figura 30 grados la
  deja idéntica.
*/
void dibujarMarcas() {
  TFT_display.drawCircle(CX, CY, RADIO, BORDE);

  for (int hora = 0; hora < 12; hora++) {
    float angulo = hora * 30.0;
    bool notable = (hora % 3 == 0);       // 0, 90, 180 y 270 grados
    int largo = notable ? 20 : 10;

    int xExterno = puntoX(angulo, RADIO - 2);
    int yExterno = puntoY(angulo, RADIO - 2);
    int xInterno = puntoX(angulo, RADIO - 2 - largo);
    int yInterno = puntoY(angulo, RADIO - 2 - largo);

    TFT_display.drawLine(xInterno, yInterno, xExterno, yExterno, MARCA);
  }
}

/*
  Sesión 7: la manecilla.

  Apunta a un ángulo fijo para que se pueda comprobar a mano. Con ANGULO_PRUEBA
  en 90 la manecilla debe quedar horizontal, apuntando a la derecha, o sea a las
  3 en punto. Si apunta a las 9, sobra o falta un signo.
*/
const float ANGULO_PRUEBA = 90.0;

void dibujarManecilla() {
  dibujarMarcas();
  dibujarAguja(ANGULO_PRUEBA, RADIO - 30, AGUJA);
  TFT_display.fillCircle(CX, CY, 4, AGUJA);

  // Comprobación numérica: se imprime lo que la trigonometría predice y lo que
  // se dibujó, para que coincidan con lo calculado a mano en el cuaderno.
  int px = puntoX(ANGULO_PRUEBA, RADIO - 30);
  int py = puntoY(ANGULO_PRUEBA, RADIO - 30);

  Serial.print(F("Angulo: "));       Serial.println(ANGULO_PRUEBA);
  Serial.print(F("Radio usado: "));  Serial.println(RADIO - 30);
  Serial.print(F("x = 120 + r*sin = ")); Serial.println(px);
  Serial.print(F("y = 120 - r*cos = ")); Serial.println(py);

  /*
    Verificación con Pitágoras: la distancia del centro al extremo tiene que
    dar el radio otra vez. Si no da, el punto no está sobre la circunferencia.
  */
  float dx = px - CX;
  float dy = py - CY;
  Serial.print(F("Distancia al centro (Pitagoras): "));
  Serial.println(sqrt(dx * dx + dy * dy));
}

void setup() {
  Serial.begin(115200);
  delay(200);

  TFT_display.begin();
  TFT_display.setRotation(0);
  TFT_display.fillScreen(FONDO);

#if SESION == 5
  dibujarPlano();
#elif SESION == 6
  dibujarMarcas();
#else
  dibujarManecilla();
#endif
}

void loop() {
}
