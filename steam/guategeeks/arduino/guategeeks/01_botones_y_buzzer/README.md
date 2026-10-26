# 01 · Botones y buzzer

Primer sketch que se carga al robot. Verifica la interfaz local: dos botones de entrada y un buzzer
de salida, sin mover motores.

**Sesión 6** · Reto nivel 2 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/guategeeks/botones-y-buzzer)

## Qué hace

Al pulsar **MODO** suena un tono de 880 Hz e imprime `Boton MODO` en el Monitor Serie. Al pulsar
**INICIO**, 1320 Hz y `Boton INICIO`. Entre pulsaciones aplica un antirrebote de 60 ms.

## Pines

| Pin | Destino |
|---|---|
| A1 | Botón MODO a GND, con `INPUT_PULLUP` |
| A2 | Botón INICIO a GND, con `INPUT_PULLUP` |
| A0 | Buzzer pasivo |

No usa motores ni sensor. Los botones se movieron a A1/A2 para no ocupar pines digitales del
shield L293D.

## Cómo cargarlo y verificar

1. Abrir la carpeta completa en Arduino IDE 2. El archivo debe conservar el nombre del directorio.
2. Herramientas → Placa → **Arduino Uno**; seleccionar el puerto.
3. Cargar.
4. Abrir el Monitor Serie a **9600 baudios**.
5. Pulsar cada botón: debe imprimir su nombre y sonar distinto.

## Conceptos que introduce

- `INPUT_PULLUP`: el pin queda en HIGH en reposo y baja a LOW al pulsar. Es lógica invertida y es la
  confusión más frecuente de esta sesión.
- Antirrebote por tiempo con `millis()`, no con `delay()`.
- `tone()` para generar frecuencias. Requiere buzzer **pasivo**.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Una pulsación cuenta como varias | La ventana de antirrebote de 60 ms |
| El buzzer no suena o suena igual siempre | Que sea pasivo, no activo |
| Nada aparece en el Monitor Serie | Velocidad en 9600 y puerto correcto |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Adoptado de `smars_aula_autonomo_v2_fuentes_publicas/code/arduino/01_botones_y_buzzer/` el
2026-07-30. Licencia **MIT**, conservada en el encabezado del archivo. Cambios: formato,
comentarios en español y pines adaptados al shield L293D. Ver [LICENCIAS.md](../LICENCIAS.md).
