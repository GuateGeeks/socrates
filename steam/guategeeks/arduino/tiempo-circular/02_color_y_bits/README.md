# 02 · El color es un número

Arma colores RGB565 desde sus componentes y los imprime en binario, hexadecimal y decimal.

**Sesión 4** · Reto nivel 1 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/tiempo-circular/el-color-es-un-numero)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.

## Subsistema que prueba

La **representación del color**. No hay ángulos ni tiempo todavía. Lo único que se investiga es qué
es un color para esta pantalla: un número de 16 bits donde la posición de cada bit determina cuánto
vale.

## Pines

Los mismos siete del programa. Ver [README del programa](../README.md#mapa-de-pines).

## Qué debe verse

Cuatro franjas horizontales —roja, verde, azul y blanca— cada una con su valor hexadecimal escrito
encima, y el rótulo `RGB565 = 5+6+5 bits` arriba.

En el Monitor Serie a 115200 baudios, una tabla con el mismo color escrito de tres formas, y luego
una lista del azul de 0 a 32.

## El reparto de los 16 bits

```
   bit  15 14 13 12 11 │ 10  9  8  7  6  5 │  4  3  2  1  0
        R  R  R  R  R  │  G  G  G  G  G  G │  B  B  B  B  B
         5 bits (32)   │    6 bits (64)    │   5 bits (32)

   ROJO   0xF800 = 1111 1000 0000 0000
   VERDE  0x07E0 = 0000 0111 1110 0000
   AZUL   0x001F = 0000 0000 0001 1111
```

El verde se lleva **seis** bits, uno más que los otros dos. No es un error: el ojo humano distingue
más tonos de verde, así que se le da más resolución.

Total de colores: 32 × 64 × 32 = **65 536**, que es 2¹⁶. No son los 16.7 millones que produce un
monitor de 24 bits.

## Los tres nombres del mismo número

El rojo puro se escribe de estas tres formas, y las tres son el mismo número:

| Escritura | Valor |
|---|---|
| Binario | `1111100000000000` |
| Hexadecimal | `0xF800` |
| Decimal | `63488` |

Que un número tenga varias escrituras y siga siendo el mismo número es justo lo que pide **MAT 5.1**
del CNB: valor absoluto y relativo, sistemas posicionales, manejo de las potencias.

## El experimento del final

El sketch imprime el azul de 0 a 32 subiendo de uno en uno. El valor en pantalla **no** cambia cada
unidad: cambia cada 8, porque `b >> 3` descarta los tres bits menos significativos. Ocho valores
distintos de entrada producen el mismo color de salida.

Esa es la pregunta de la sesión: *si le pido a la pantalla un azul de 5 y otro de 6, ¿por qué salen
iguales?*

## Evidencia de la sesión

- Tabla con al menos cinco colores escritos en las tres formas: componentes, binario y hexadecimal
- Respuesta escrita a por qué el verde tiene seis bits
- Anotación del intervalo con que cambia el azul en el experimento final, y su explicación

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Las franjas salen del color equivocado | Orden de los argumentos de `rgb565(r, g, b)` |
| Todo se ve en blanco y negro | La pantalla está en un modo de rotación raro, o `fillRect` recibe el mismo color que el fondo |
| El binario sale corrido | El separador de campos está en los bits 11 y 5, no en otros |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Código propio, licencia **MIT**. Ver [LICENCIAS.md](../LICENCIAS.md).
