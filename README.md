# Stókhos
Lenguaje interactivo orientado a simulaciones estocásticas. 

Adelina Figueira y Ana Santos.

Se utilizan el generador de parser tsPEG (https://github.com/EoinDavey/tsPEG), el paquete @types/node de npm, npm y el código está escrito en Typescript.
Se realiza la instalación de tsPEG con el comando:  npm install -g tspeg
Se instala el paquete @types/node con el comando:  npm install @types/node --save-dev
Se puede instalar Node.js por medio del sitio web:  https://nodejs.org/en/
Junto a Node.js se realiza la instalación de npm, desde donde se puede instalar Typescript en caso de ser necesario con el comando: npm install -g typescript

# ¿Cómo realizar la corrida?
En el branch Lenguaje-Stokhos-Etapa2, se deben ejecutar los siguientes comandos:

    tsc -p tsconfig.json
    node main.js

En caso de realizar cambios en la gramática, se requieren los siguientes comandos para que se hagan efectivos:

    tspeg gramatica.peg parser.ts
    tspeg parserGrammar.peg parser2.ts
    tsc -t ES2021 -m commonjs parser.ts
    tsc -t ES2021 -m commonjs parser2.ts

Luego se deben correr los comandos anteriores.

## NOTA: El archivo tsconfig.json es un archivo que permite compilar al mismo tiempo varios archivos de Typescript. Se incluyen en dicho archivo:
    "parser.ts",
    "parser2.ts",
    "parsingFunctions.ts",
    "VM.ts",
    "REPL.ts",
    "main.ts"


# El REPL
## Primera etapa
Se pueden observar los arreglos de tokens si se utiliza la funcion .lex seguido de una expresión correcta en el lenguaje Stókhos, si es correcta la expresión se muestra un arreglo con los tokens relacionados, si no lo es, se muestra un error adecuado.
Se puede utilizar la funcion .load para cargar un archivo que se leerá línea por línea, por el momento solo se lee correctamente las líneas que cuentan con la función .lex al igual que se realiza la lectura en el REPL. También se pueden utilizar las funciones .failed que demuestran los errores al leer un archivo y .reset que elimina dichos errores.
Hay un archivo de ejemplo para lectura utilizando la función .load llamado ej.txt.
Las entradas en el REPL pueden ser de la siguiente manera

    <Stokhos> .lex (expresión)
    <Stokhos> .load nombrearchivo.txt
    <Stokhos> .failed
    <Stokhos> .reset

Para salir del REPL se coloca únicamente un punto.

    <Stokhos> .
    
# El Parser
## Segunda etapa
En esta etapa se ha construido una gramática para el lenguaje Stókhos, que permite el uso de dos tipos (booleanos y números), también ofrece la posibilidad de generar arreglos de dichos tipos, reconocer operaciones binarias y unarias y se genera el AST o árbol de sintaxis abstracta para cada una de las expresiones e instrucciones que introduzca el usuario en el REPL.
También se ha generado una función .ast que permite al usuario probar el parser de Stókhos, en caso de introducir una expresión o instrucción de sintaxis inválida aparecerá un mensaje de error.
Se puede llamar a la función .ast de la siguiente manera:
    
    <Stokhos> .ast (expresión)

Se debe considerar que tanto las expresiones como instrucciones deben terminar con punto y coma (;) para que puedan ser leídas por el lenguaje.
Finalmente, se ha modificado la función de leerArchivo de la etapa 1, para que sea capaz de leer archivos que llamen a otros archivos dentro de sí mismos.
Aún no se han colocado los paréntesis en las expresiones (esto puede observarse al llamar a la función .ast), por lo que esperamos culminar esta parte esencial de la etapa muy pronto.