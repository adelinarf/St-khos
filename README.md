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
    "Tree.ts",
    "parsingFunctions.ts",
    "validateLibrary.ts",
    "VM.ts",
    "REPL.ts",
    "main.ts"

También se puede realizar la corrida con los archivos batch de Windows: compilerWindows.bat y runWindows.bat, solo deben ejecutarse estos archivos en Windows, primero compilerWindows.bat y luego runWindows.bat para poder iniciar un nuevo REPL de Stókhos.
Puede realizarse la corrida en otros sistemas operativos con los archivos run y compiler. Se debe ejecutar el archivo compiler y luego el archivo run para iniciar un nuevo REPL de Stókhos.

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
Finalmente, se ha modificado la función de leerArchivo de la etapa 1, para que sea capaz de leer archivos que llamen a otros archivos dentro de sí mismos. Al llamar la funcion .ast se recibe la expresión con paréntesis que representa el AST como string.

# Validaciones estáticas y evaluación restringida de expresiones
## Tercera etapa
En esta etapa se ha comenzado a construir a la funcion process que es la responsable de recibir la entrada por parte del usuario que desea
utilizar el lenguaje Stókhos. Se pueden utilizar las funciones:

    if(condicion,exp1,exp2): Evalua la exp1 y exp2 bajo la condicion y si exp1 es cierta, retorna true, sino retorna la evaluación de exp2.
    type(exp) : Retorna el tipo de la expresión exp.
    ltype(exp) : Retorna el tipo de una expresión asignable (arreglo, definición o asignación).
    reset() : Elimina todas las variables creadas por el usuario.
    uniform() : Retorna un número aleatorio entero entre 0 y 1.
    floor(exp) : Retorna un número n tal que n<=exp, siempre que la expresión exp sea de tipo num.
    length(exp) : Retorna el tamaño de un arreglo exp.
    sum(exp) : Retorna la suma de los elementos de un arreglo exp.
    avg(exp) : Retorna el promedio del valor de los elementos de un arreglo exp.
    pi() : Retorna un aproximado de la constante Pi con doble precisión.
    now() : Retorna un número entero correspondiente al número de milisegundos transcurridos desde un punto de referencia en el tiempo.

Además se puede hacer uso de las variables, se pueden generar variables y operar con ellas, a su vez que es posible obtener los valores de 
las expresiones que se introducen en el lenguaje y realizar operaciones. Es importante señalar que en Stókhos las expresiones 'x' y x son equivalentes, por lo que se ignoran las comillas simples al momento de definir una variable o escribir una expresión dentro del REPL del lenguaje.
