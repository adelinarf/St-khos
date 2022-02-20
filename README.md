# Stókhos
Lenguaje interactivo orientado a simulaciones estocásticas. 

Adelina Figueira y Ana Santos.

Se utilizan el generador de parser tsPEG (https://github.com/EoinDavey/tsPEG), el paquete @types/node de npm, npm y el código está escrito en Typescript.
Se realiza la instalación de tsPEG con el comando: npm install -g tspeg
Se instala el paquete @types/node con el comando: npm install @types/node --save-dev
Se puede instalar Node.js por medio del sitio web: https://nodejs.org/en/
Junto a Node.js se realiza la instalación de npm, desde donde se puede instalar Typescript en caso de ser necesario con el comando: npm install -g typescript

¿Cómo realizar la corrida?
Se deben ejecutar los siguientes comandos:
tspeg gramatica.peg parser.ts
tsc -t ES2015 -m commonjs parser.ts
tsc prueba.ts
node prueba.js

Si no se han realizado cambios en el archivo de gramatica.peg se puede omitir el segundo comando, ya que, el archivo parser.ts se encuentra actualizado.

El REPL
Primera etapa
Se pueden observar los arreglos de tokens si se utiliza la funcion .lex seguido de una expresión correcta en el lenguaje Stókhos, si es correcta la expresión se muestra un arreglo con los tokens relacionados, si no lo es, se muestra un error adecuado.
Se puede utilizar la funcion .load para cargar un archivo que se leerá línea por línea, por el momento solo se lee correctamente las líneas que cuentan con la función .lex al igual que se realiza la lectura en el REPL. También se pueden utilizar las funciones .failed que demuestran los errores al leer un archivo y .reset que elimina dichos errores.
Hay un archivo de ejemplo para lectura utilizando la función .load llamado ej.txt.
Las entradas en el REPL pueden ser de la siguiente manera
<Stokhos> .lex (expresion)
<Stokhos> .load nombrearchivo.txt
<Stokhos> .failed
<Stokhos> .reset
Para salir del REPL se coloca únicamente un punto.
<Stokhos> .
$
