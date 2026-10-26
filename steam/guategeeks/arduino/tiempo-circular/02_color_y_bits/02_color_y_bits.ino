/*
  Tiempo Circular · 02 · El color es un número
  Licencia: MIT
  Hardware: ESP32 + módulo TFT redondo 1.28" GC9A01 (240x240) por SPI

  Un color en esta pantalla es un número de 16 bits. Este sketch lo arma
  bit por bit y lo imprime en binario, hexadecimal y decimal, para que las tres
  escrituras del mismo número se puedan comparar.

  CNB Segundo Básico, MAT 5.1: valor absoluto y relativo, sistemas posicionales,
  manejo de las potencias en los sistemas posicionales (p. 15).
*/

#include <DIYables_TFT_Round.h>

#define TFT_DC   25
#define TFT_CS   26
#define TFT_RST  27

DIYables_TFT_GC9A01_Round TFT_display(TFT_CS, TFT_DC, TFT_RST);

const int CX = 120;
const int CY = 120;

/*
  RGB565: 16 bits repartidos entre los tres componentes.

    bit  15 14 13 12 11 | 10  9  8  7  6  5 |  4  3  2  1  0
         R  R  R  R  R  |  G  G  G  G  G  G |  B  B  B  B  B
          5 bits (32)   |    6 bits (64)    |   5 bits (32)

  El verde se lleva un bit más porque el ojo humano distingue más tonos de
  verde que de rojo o azul. Total: 32 * 64 * 32 = 65 536 colores, que es 2^16.

  Cada componente llega con 8 bits y hay que recortarlo:
    r >> 3  deja los 5 bits más significativos del rojo
    g >> 2  deja los 6 del verde
    b >> 3  deja los 5 del azul
  y luego cada uno se corre a su posición con un desplazamiento.
*/
uint16_t rgb565(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

// Imprime un número de 16 bits en binario, separando los tres campos.
void imprimirBinario(uint16_t valor) {
  for (int bit = 15; bit >= 0; bit--) {
    Serial.print((valor >> bit) & 1);
    if (bit == 11 || bit == 5) Serial.print(' ');  // separa R | G | B
  }
}

// Imprime el mismo color en sus tres escrituras.
void reportarColor(const char* nombre, uint8_t r, uint8_t g, uint8_t b) {
  uint16_t c = rgb565(r, g, b);

  Serial.print(nombre);
  Serial.print(F("\t rgb("));
  Serial.print(r); Serial.print(',');
  Serial.print(g); Serial.print(',');
  Serial.print(b); Serial.print(F(")\t bin "));
  imprimirBinario(c);
  Serial.print(F("\t hex 0x"));
  if (c < 0x1000) Serial.print('0');
  if (c < 0x0100) Serial.print('0');
  if (c < 0x0010) Serial.print('0');
  Serial.print(c, HEX);
  Serial.print(F("\t dec "));
  Serial.println(c);
}

// Dibuja una franja del color indicado y le pone su valor hexadecimal encima.
void franja(int fila, uint16_t color, const char* etiqueta) {
  int y = 40 + fila * 32;
  TFT_display.fillRect(30, y, 180, 26, color);
  TFT_display.setTextColor(rgb565(255, 255, 255));
  TFT_display.setTextSize(1);
  TFT_display.setCursor(36, y + 9);
  TFT_display.print(etiqueta);
}

void setup() {
  Serial.begin(115200);
  delay(200);

  TFT_display.begin();
  TFT_display.setRotation(0);
  TFT_display.fillScreen(rgb565(0, 0, 0));

  Serial.println(F("=== El mismo color, tres escrituras ==="));
  Serial.println(F("nombre\t componentes\t binario (R G B)\t hex\t decimal"));

  reportarColor("ROJO  ", 255, 0, 0);
  reportarColor("VERDE ", 0, 255, 0);
  reportarColor("AZUL  ", 0, 0, 255);
  reportarColor("BLANCO", 255, 255, 255);
  reportarColor("NEGRO ", 0, 0, 0);

  franja(0, rgb565(255, 0, 0), "ROJO  0xF800");
  franja(1, rgb565(0, 255, 0), "VERDE 0x07E0");
  franja(2, rgb565(0, 0, 255), "AZUL  0x001F");
  franja(3, rgb565(255, 255, 255), "BLANCO 0xFFFF");

  TFT_display.setTextColor(rgb565(255, 220, 0));
  TFT_display.setTextSize(1);
  TFT_display.setCursor(CX - 52, 22);
  TFT_display.print(F("RGB565 = 5+6+5 bits"));

  /*
    Prueba que vale la pena hacer en clase: subir el azul de uno en uno desde 0
    y anotar a partir de qué valor cambia el color en pantalla. Como solo
    sobreviven 5 bits, el cambio ocurre cada 8 unidades, no cada una.
  */
  Serial.println();
  Serial.println(F("Azul de 0 a 32, de uno en uno. Observar cada cuanto cambia el valor:"));
  for (uint8_t b = 0; b <= 32; b++) {
    Serial.print(b);
    Serial.print(F(" -> 0x"));
    Serial.println(rgb565(0, 0, b), HEX);
  }
}

void loop() {
}
