import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
var inorder : Array<string> = [];
var tipo : string = "exp";

/*La funcion search busca los hijos del operador en el AST y los analiza para conseguir una nueva expresion o
terminar de analizar el arbol.
Existe una operacion en el arbol en el atributo a de las reglas 1,2,3,4,5 y 7 de la gramatica del lenguaje.
De alli se parte a analizar el resto de la expresion, es decir, el operador derecho de la operacion.
*/
function search(array : Array<any>,nombre : Function){
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            inorder.push(array[i].op.kind);
            nombre(entrada);
        }
    }
}

/*Las funciones parseEi es analizan de manera recursiva el AST y busca en los atributos a en para aquellas reglas que lo contienen.
*/
function parseE1(expr : e1) : string {
    var leftVar : string = parseE2(expr.e);
    search(expr.a,parseE2);
    return leftVar;
}

function parseE2(expr : e2) : string {
    var leftVar : string = parseE3(expr.e);
    search(expr.a,parseE3);
    return leftVar;
}

function parseE3(expr : e3) : string {
    var leftVar : string = parseE4(expr.e);
    search(expr.a,parseE4);
    return leftVar;
}

function parseE4(expr : e4) : string {
    var leftVar : string = parseE5(expr.e);
    search(expr.a,parseE5);
    return leftVar;
}

function parseE5(expr : e5) : string {
    var leftVar : string = parseE6(expr.e);
    search(expr.a,parseE6);
    return leftVar;
}

/*La funcion parseE6 es la que representa la regla 6 de la gramatica, que trabaja con los operadores unarios del lenguaje.
Se verifica el atributo uop donde se guarda si existe o no un operador unario, si existe se añade al arreglo.*/
function parseE6(expr : e6) : string {
    if (expr.uop != undefined || expr.uop != null){
        for (var i = 0; i < expr.uop.length; i++) {
            inorder.push(expr.uop[i].kind);
        }
    }
    var leftVar : string = parseE7(expr.e);
    return leftVar;
}

function parseE7(expr : e7) : string {
    var leftVar : string = parseE8(expr.e);
    search(expr.a,parseE8);
    return leftVar;
}

/*La funcion parseE8 analiza el AST que se genera por la regla 8 de la gramatica que puede ser una expresion cubierta por parentesis 
o un termino, en caso de ser parentizada, se analiza la expresion siguiente que se encuentra en los arboles siguientes, si es un
termino se agrega al arreglo inorder. 
*/
function parseE8(expr : e8) : string {
    var leftVar : string = "";
    if (expr.kind == "e8_1" || expr.kind == "e8_2" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        if (expr.kind == "e8_2"){
            parseE1(expr.value.e.e as e1);
        }
        else{
            parseE1(expr.value.e as e1);
        }
    }
    else{
        leftVar = expr.value;
        inorder.push(expr.value);
    }
    return leftVar;    
}

/*En el caso de los arreglos, se utiliza una regla de gramatica diferente, ya que, se deben considerar las comas dentro del arreglo,
por esto la regla denominada termino debe utilizarse y de alli se parte a visitar los terminos de la gramatica normalmente como se 
realizaria con otras expresiones.
*/
function parseTermino(expr : termino){
    parseE1(expr.e.e);
    if (expr.b != undefined){
        for (var i = 0; i < expr.b.length; i++) {
            parseE1(expr.b[i].e.e);
        }
    }
}

/*Esta funcion analiza el AST y retorna un arreglo de strings que contiene los elementos del AST que se han analizado en orden inorder.
Se agregan los tipos para las declaraciones o definiciones y para las asignaciones. Cada AST se analiza con una serie de funciones
parseEi que analizan de manera recursiva el arbol. 
NOTA: Aun no se incluyen los parentesis de las expresiones, para realizar esto es necesaria una estructura de arbol que nos permita
conocer los hijos de cada nodo, es decir, para cada operacion existen 1 o 2 hijos que representan los operandos. Por esto, con esta
funcion recursiva podremos crear un arbol y asi conocer cual es el orden de las operaciones y colocar los parentesis de acuerdo a la
precedencia de cada uno de los operadores.
*/
export function parsing(ASTtree : any) : Array<string> {
    var type = ASTtree.ast.start.kind;    
    tipo = type;
    let valor = ASTtree.ast.start.e as e1;
    if (type == "declaration"){
        inorder.push(ASTtree.ast.start.type.kind);
        inorder.push(ASTtree.ast.start.id.value);
        valor = ASTtree.ast.start.e.e as e1;
    }
    if (type == "assign"){
        inorder.push(ASTtree.ast.start.id.value);
        valor = ASTtree.ast.start.e.e as e1;
    }
    if (type == "array"){
        inorder.push(ASTtree.ast.start.type.kind);
        inorder.push(ASTtree.ast.start.id.value);
        var valor2 = ASTtree.ast.start.e as termino;
        parseTermino(valor2);
    }
    if (type != "array"){
        var arbol = parseE1(valor);
    }
    inorder.push(type);
    return inorder;
}

/*La funcion blank inicializa el arreglo inorder para eliminar sus elementos luego de cada entrada por consola.*/
export function blank(){
    inorder = [];
}