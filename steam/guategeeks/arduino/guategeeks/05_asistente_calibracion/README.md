# 05 · Asistente de calibración

Encuentra, desde el Monitor Serie y sin recompilar, la compensación que hace avanzar recto al robot.

**Sesión 11** · Reto nivel 3 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/guategeeks/calibracion)

## Por qué hace falta

Dos motorreductores del mismo modelo no giran igual. Con el mismo PWM, una oruga avanza algo más que
la otra y el robot se desvía. Hay dos caminos: perseguir componentes idénticos, o aceptar la
diferencia y compensarla. Este asistente hace lo segundo.

## Comandos

Escribir en el Monitor Serie a 9600 baudios y pulsar Enter:

| Comando | Efecto |
|---|---|
| `i+` | Sube 5 al ajuste de la oruga izquierda |
| `i-` | Baja 5 al ajuste de la oruga izquierda |
| `d+` | Sube 5 al ajuste de la oruga derecha |
| `d-` | Baja 5 al ajuste de la oruga derecha |
| `p` | Prueba: avanza 2 segundos con los ajustes actuales |

Los ajustes se suman a una velocidad base de 150. Tras cada comando, el programa imprime los valores
vigentes.

## Procedimiento

1. Marcar una línea recta en el piso y alinear el robot sobre ella.
2. Escribir `p` y observar hacia qué lado se desvía.
3. Si se desvía a la **derecha**, la oruga izquierda va más rápido: usar `i-`.
   Si se desvía a la **izquierda**: usar `d-`.
4. Repetir hasta que recorra los dos segundos sin desviarse.
5. Anotar los valores finales de I y D: son los de **su** robot, no transferibles a otro.
6. Trasladarlos a `04_smars_autonomo`, sumándolos a las velocidades en `mover()`.

## Shield

Usa el mismo contrato de motores del curso: motor izquierdo en M1 y motor derecho en M2 del shield
L293D. No usa sensor ni botones.

Requiere la librería **AFMotor / Adafruit Motor Shield V1**.

## Una calibración que no se repite no es calibración

Verificar con **tres ensayos** usando los mismos valores. Si el resultado varía mucho entre ellos, la
causa suele estar en otra parte: carga de la batería, tipo de piso o tensión desigual de las orugas.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| No responde a los comandos | Terminador de línea del Monitor Serie y velocidad 9600 |
| Un motor gira al revés | Intercambiar sus dos cables o ajustar `INVERTIR_IZQUIERDO` / `INVERTIR_DERECHO` |
| Se desvía siempre al mismo lado por más que se ajuste | Roce mecánico; revisar la oruga antes de seguir compensando |
| Funciona una vez y luego no | Batería descargándose durante la prueba |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Adoptado de `smars_aula_autonomo_v2_fuentes_publicas/code/arduino/05_asistente_calibracion/` el
2026-07-30. Licencia **MIT**, conservada en el encabezado del archivo.

**Este sketch lleva una adaptación de hardware.** La versión GuateGeeks usa shield L293D con
`AFMotor` en M1/M2 y conserva el flujo de calibración del original: ajustar izquierda/derecha y
probar dos segundos. El detalle está documentado dentro del propio archivo. Ver
[LICENCIAS.md](../LICENCIAS.md).
