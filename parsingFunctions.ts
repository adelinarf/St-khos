import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
import { Tree,Node } from "./Tree.js"

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se crea un padre, que es la operacion
y de manera recursiva se incluyen los hijos derechos e izquierdos de este padre, para que se genere un arbol binario con el orden
correcto y que representa a este AST pero con un arbol binario.*/
function search(array : Array<any>,nombre : Function) : Node {
    var arreglo = [];
    var leftChild : Node;
    var newNode : Node;
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            if (i==0){
                newNode = new Node(array[i].op.kind);
                var newChildren : Node = nombre(entrada);
                newNode.addRightChildren(newChildren);
                leftChild = newNode;
            }
            else{
                newNode = new Node(array[i].op.kind);
                var newChildren : Node = nombre(entrada);
                newNode.addRightChildren(newChildren);
                newNode.addLeftChildren(leftChild);
                leftChild = newNode;
            } 
            arreglo.push(newNode);
        }
    }
    return newNode;
}

/*La funciones parseEi se encargan de visitar los nodos del arbol AST generados por el parser. Ademas se generan nodos en cada
una de las funciones. Se llama a la funcion search que se encarga de visitar el atributo a que contiene los hijos de la operacion
en el arbol, por lo que si es undefined, no contiene hijos y esa regla en particular no ha sido aplicada.
Se debe considerar que se van generando los nodos de manera recursiva, por lo que el arbol consiste de un nodo que recursivamente 
contiene hijos que forman un arbol binario que puede visitarse con mayor facilidad que el arbol que nos proporciona el parser.
En cada funcion parseEi se llama a la funcion parseEi+1 si es utilizada la regla i y se genera un nodo cuyos hijos son el acumulado de
visitar de manera recursiva a la regla siguiente y la busqueda del atributo a.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1) : Node {
    var leftVar : Node = parseE2(expr.e)
    var now : Node = search(expr.a,parseE2);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2) : Node {
    var leftVar : Node = parseE3(expr.e)
    var now : Node = search(expr.a,parseE3);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3) : Node {
    var leftVar : Node = parseE4(expr.e)
    var now : Node = search(expr.a,parseE4);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4) : Node {
    var leftVar : Node = parseE5(expr.e)
    var now : Node = search(expr.a,parseE5);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5) : Node {
    var leftVar : Node = parseE6(expr.e)
    var now : Node = search(expr.a,parseE6);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6) : Node {
    var leftVar : Node = parseE7(expr.e);
    var prev : Node;
    if (expr.uop != undefined && expr.uop.length > 0){
        prev = new Node(expr.uop[0].kind);
        var actual = prev;
        for (var i = 1; i < expr.uop.length; i++) {
            actual.addLeftChildren(new Node(expr.uop[i].kind));  //Se agrega el nodo de la operacion unaria al arbol.
            actual = actual.left;
        }
        actual.addLeftChildren(leftVar);
    }
    else{
        prev = leftVar;
    }

    return prev;
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7) : Node {
    var leftVar : Node = parseE8(expr.e)
    var now : Node = search(expr.a,parseE7);
    var prev : Node;
    if (now == undefined){
        prev = leftVar;
    }
    else{
        prev = now;
        var node = prev;
        while(node.left != undefined){
            node = node.left;
        }
        node.left = leftVar;
    }
    return prev;
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un nodo
que contiene unicamente el valor de un TkId, TkNumber, TkFalse y TkTrue.*/
function parseE8(expr : e8) : Node {
    var prev : Node;
    if (expr.kind == "e8_1" || expr.kind == "e8_2" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        prev = parseE1(expr.value.e as e1);
    }
    else{
        if (expr.kind == "terms_3"){
            prev = new Node(expr.value.value);
            if (expr.a != undefined){
                prev.type = "id";
                var newChildren : Node = parseE1(expr.a.next.e as e1);
                prev.addRightChildren(newChildren);
            }
        }
        else{
            prev = new Node(expr.value);
        }
    }
    return prev
}

/*La funcion parseTermino analiza un arreglo y verifica un arbol por cada una de las posiciones del arreglo, luego crea el string
que representa al arreglo en su totalidad.*/
function parseTermino(expr : termino, output : string) : string{
    var initNode = parseE1(expr.e.e);
    var arbol = new Tree(initNode);
    output = output + arbol.toString() + ",";
    if (expr.b != undefined){
        for (var i = 0; i < expr.b.length; i++) {
            var n = parseE1(expr.b[i].e.e);
            var newTree = new Tree(n);
            if (i == expr.b.length-1){
                output = output + newTree.toString() + ")";
            }
            else{
                output = output + newTree.toString() + ",";
            }
        }
    }
    return output;
}

/*La funcion parseDeclaration analiza una definicion o asignacion y obtiene un arbol en donde se aloja la informacion recolectada
con las funciones recursivas.*/
function parseDeclaration(e : e1, input : string) : string {
    var initNode = parseE1(e);
    var arbol = new Tree(initNode);
    input = input + arbol.toString()+")";
    return input;
}

/*La funcion parsing se encarga de visitar el arbol AST obtenido por medio del parser y devuelve un string que consiste de el arbol
en forma de string o la expresion en forma de string que ha sido analizada por medio del AST.*/
export function parsing(ASTtree : any) : string {
    var type = ASTtree.ast.start.kind; 
    let valor = ASTtree.ast.start.e as e1;
    var toString = "";
    //Se verifica el tipo de AST con el que se esta trabajando, en caso de ser una declaracion, se escriben el tipo, nombre y := antes
    //de obtener los valores del arbol. Si es una asignacion se hace lo mismo pero sin incluir el tipo y en el caso de los arreglos 
    //se genera un arbol por cada elemento del arreglo y luego se obtiene el string de cada uno de estos arboles, para luego
    //generar un string de todo el arreglo. En caso de las expresiones, solo se corre el AST y se obtiene el string.
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var nodo = new Node(ASTtree.ast.start.type.kind); //Se genera un nuevo nodo para mapear el nombre del tipo y id
        var declarationType = nodo.map(ASTtree.ast.start.type.kind);
        var declarationID = nodo.map(ASTtree.ast.start.id.value);
        var string = "def("+declarationType+","+declarationID+",";
        toString = parseDeclaration(valor,string);
    }
    if (type == "assign"){
        var nodo = new Node(ASTtree.ast.start.id.value);  //Se genera un nuevo nodo para mapear el nombre del id
        var assignId = nodo.map(ASTtree.ast.start.id.value);
        var string = "def("+assignId+",";
        valor = ASTtree.ast.start.e.e as e1;
        toString = parseDeclaration(valor,string);
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e as termino;
        var nodo = new Node(ASTtree.ast.start.type.kind); //Se genera un nuevo nodo para mapear el nombre del tipo y array
        var arrayType = nodo.map(ASTtree.ast.start.type.kind);
        var arrayName = nodo.map(ASTtree.ast.start.id.value);
        var output = "def("+arrayType+","+arrayName+",";
        toString = parseTermino(valor2,output);
    }
    if (type == "exp"){
        var nodoInicial = parseE1(valor);
        var arbol = new Tree(nodoInicial);
        toString = arbol.toString();
    }
    return toString;
}