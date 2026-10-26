# 02 · Prueba de motores

Verifica el shield L293D y las dos orugas: sentido, velocidad y giro diferencial.

**Sesión 7** · Reto nivel 2 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/guategeeks/dos-motores-y-direccion)

> **Levante el robot antes de cargar.** El sketch mueve ambas orugas apenas termina la carga. En la
> mesa, el robot se cae. El propio programa lo advierte por el Monitor Serie.

## Qué hace

Ciclo continuo: adelante 1.5 s, pausa, atrás 1.5 s, pausa, giro a la izquierda 0.9 s, pausa larga.
Usa una velocidad segura de 160 sobre 255.

## Shield y pines

| Puerto / pin | Destino |
|---|---|
| Shield M1 | Motor izquierdo |
| Shield M2 | Motor derecho |
| D3-D12 | Reservados por el shield L293D |

Alimentación: entrada de motor del shield desde el interruptor, **nunca** desde el pin 5V del
Arduino. Capacitor de 470 µF entre la entrada de motor y GND, respetando polaridad.

Requiere la librería **AFMotor / Adafruit Motor Shield V1**.

## Cómo cargarlo y verificar

1. Conectar motor izquierdo en M1 y motor derecho en M2.
2. **Levantar el robot** sobre un soporte.
3. Cargar el sketch y abrir el Monitor Serie a 9600 baudios.
4. Confirmar la secuencia: adelante, atrás, giro.
5. Si una oruga gira al revés, intercambiar sus dos cables o ajustar la constante `INVERTIR_*`.

## Conceptos que introduce

- **Velocidad con signo**: la función `motor()` recibe un valor entre −255 y 255. El signo decide el
  sentido y el valor absoluto va al shield.
- **Giro diferencial**: con signos opuestos en cada oruga, el robot rota sobre su propio eje.
- **Puertos M1/M2**: el curso nombra los motores por borne del shield, no por pines internos.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Ningún motor responde | Potencia del shield, M1/M2, librería `AFMotor` |
| Solo un motor responde | Borne del puerto afectado o motor defectuoso |
| El robot gira al revés de lo esperado | M1/M2 intercambiados, o cables de motor invertidos |
| El Arduino se reinicia al arrancar los motores | Alimentación insuficiente o falta el capacitor de 470 µF |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Adoptado de `smars_aula_autonomo_v2_fuentes_publicas/code/arduino/02_prueba_motores/` el
2026-07-30. Licencia **MIT**, conservada en el encabezado del archivo. Cambios: formato,
comentarios en español y motor API adaptada al shield L293D con `AFMotor`. Ver
[LICENCIAS.md](../LICENCIAS.md).
