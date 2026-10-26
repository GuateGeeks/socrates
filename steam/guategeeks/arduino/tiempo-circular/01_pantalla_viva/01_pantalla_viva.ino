/*
  Tiempo Circular · 01 · Pantalla viva
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI
  Librería: DIYables TFT Round (depende de Adafruit GFX Library)

  Prueba el cableado y nada más. Si esto no enciende, ningún otro sketch va a
  funcionar: no se sigue adelante hasta que esta pantalla muestre algo.
*/

#include <DIYables_TFT_Round.h>

// Único mapa de pines del programa. Los seis sketches usan estos mismos valores.
#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

// La pantalla es cuadrada de 240x240, pero solo se ve el círculo inscrito.
// Todo lo que se dibuje fuera de ese círculo existe, pero nadie lo verá.
const int ANCHO = 240;
const int ALTO  = 240;
const int CX    = ANCHO / 2;  // 120
const int CY    = ALTO / 2;   // 120
const int RADIO = 120;

/*
  Arma un color de 16 bits en formato RGB565 a partir de tres componentes de
  8 bits. En la sesión 4 se desarma esta función bit por bit; aquí solo se usa.
*/
uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println(F("Tiempo Circular 01 - pantalla viva"));

  TFT_display.begin();

  // La rotación (0 a 3) decide dónde queda el "arriba" de la pantalla.
  // En una pantalla redonda no es obvio: hay que probar las cuatro y elegir.
  TFT_display.setRotation(0);

  Serial.print(F("Ancho reportado por la libreria: "));
  Serial.println(TFT_display.width());
  Serial.print(F("Alto reportado por la libreria: "));
  Serial.println(TFT_display.height());

  // Fondo azul oscuro. Si se ve esto, el bus SPI funciona.
  TFT_display.fillScreen(rgb565(10, 20, 60));

  // Círculo blanco pegado al borde: marca hasta dónde llega el área visible.
  TFT_display.drawCircle(CX, CY, RADIO - 1, rgb565(255, 255, 255));

  // Una cruz que marca el centro exacto. Servirá de referencia toda la unidad.
  TFT_display.drawLine(CX - 10, CY, CX + 10, CY, rgb565(255, 255, 255));
  TFT_display.drawLine(CX, CY - 10, CX, CY + 10, rgb565(255, 255, 255));

  TFT_display.setTextColor(rgb565(255, 220, 0));
  TFT_display.setTextSize(2);
  TFT_display.setCursor(CX - 60, CY - 50);
  TFT_display.print(F("Tiempo"));
  TFT_display.setCursor(CX - 65, CY + 32);
  TFT_display.print(F("Circular"));
}

void loop() {
  // Esta capa no anima nada. Una pantalla quieta que se ve bien es el objetivo.
}
