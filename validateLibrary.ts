import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
import { Tree,Node } from "./Tree.js"

/*La clase HashTable es la estructura que sera utilizada para la elaboracion de la tabla de simbolos del lenguaje. 
Consiste de un arreglo bidimensional de Symbol, una estructura que puede ser utilizada para alojar la informacion de cada
una de las variables definidas por el usuario.*/
export class HashTable {
	list : Array<Array<Symbol>>;
	constructor(){
		this.list = [...Array(100)].map(x => []);
	}
	/*La funcion insert agrega una variable en forma de Symbol a la lista de la tabla de hash, considerando la funcion de hash 
	definida para esta estructura.*/
	insert(variable : Symbol){
		this.list[this.h(variable.identifier)].push(variable);
	}
	/*La funcion search busca una variable dentro de la tabla de simbolos y retorna una tupla de booleano y Symbol que indica
	si se encontro la variable y el Symbol que fue encontrado.*/
	search(variable : string) : [boolean,Symbol] {
		var key = this.h(variable);
		for (var i = 0; i < this.list[key].length; i++) {
			if (this.list[key][i].identifier == variable){
				return [true,this.list[key][i]];
			}
		}
		return [false,new Symbol("","","")];
	}
	/*La funcion modify modifica una variable dentro de la tabla de simbolos. Se busca la variable y se actualizan sus valores de
	identifier, value,number, type y array (en caso de ser un arreglo).*/
	modify(variable : string, newVal : string,type:string,array : Array<string>,newEval :any) {
		var key = this.h(variable);
		for (var i = 0; i < this.list[key].length; i++) {
			if (this.list[key][i].identifier == variable){
				this.list[key][i].value = newVal;
				this.list[key][i].number = parseFloat(newEval);
				this.list[key][i].type = type;
				if (this.list[key][i].array != undefined){
					this.list[key][i].array = array;
				}
			}
		}
	}
	/*La funcion h es la funcion de hash que se utiliza en esta tabla de hash para realizar el hashing de los elementos a 
	insertar.*/
	h(variable : string) : number {
		var array : Array<string> = [variable];
		var value = array.reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
		return value%100;
	}
}
/*La clase Symbol representa una variable que se agrega a la tabla de simbolos representada como tabla de hash. Cuenta con un 
identificador o el TkId de la variable, su value o forma de string y number que es la evaluacion de la expresion de la variable.
type representa el tipo de la variable y en array se aloja el arreglo de evaluaciones en caso de que la variable sea un arreglo.*/
export class Symbol{
	identifier : string;
	value : string;
	number : any;
	type : string;
	array : Array<string>;
	constructor(ID: string, val : string, type: string){
		this.identifier = ID;
		this.value = val;
		this.type = type;
	}
	addArray(arr : Array<string>){
		this.array = arr;
	}
}

var errores : Array<string> = [];

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se crea un padre, que es la operacion
y de manera recursiva se incluyen los hijos derechos e izquierdos de este padre, para que se genere un arbol binario con el orden
correcto y que representa a este AST pero con un arbol binario.*/
function search(array : Array<any>,nombre : Function, type : string,symbolTable : HashTable) : Node {
	var leftChild : Node;
	var newNode : Node;
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            if (i==0){
            	newNode = new Node(array[i].op.kind);
            	newNode.type = array[i].op.kind;
            	var tuple = nombre(entrada,type,symbolTable)
	            var newChildren : Node = tuple[0];
	            newNode.addRightChildren(newChildren);
	            leftChild = newNode;
            }
            else{
            	newNode = new Node(array[i].op.kind);
            	newNode.type = array[i].op.kind;
            	var tuple = nombre(entrada,type,symbolTable)
	            var newChildren : Node = tuple[0];
	            newNode.addRightChildren(newChildren);
	            newNode.addLeftChildren(leftChild);
	            leftChild = newNode;
            } 
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
visitar de manera recursiva a la regla siguiente y la busqueda del atributo a.
A diferencia de la funcion parsing se requiere el retorno de un nodo y un string que es el tipo de la expresion que se esta analizando 
para realizar el analisis de tipos al llegar a la funcion parseE8.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE2(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE2,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE3(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE3,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE4(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE4,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE5(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE5,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE6(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE6,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE7(expr.e,type,symbolTable)
	var leftVar : Node = tuple[0];
	var newType : string = tuple[1];
    var prev : Node;
    if (expr.uop != undefined && expr.uop.length > 0){
    	prev = new Node(expr.uop[0].kind);
    	var actual = prev;
        for (var i = 0; i < expr.uop.length; i++) {
    	    var nuevoNodo = new Node(expr.uop[i].kind);
    	    nuevoNodo.type = expr.uop[i].kind;
        	actual.addLeftChildren(new Node(expr.uop[i].kind));
        	actual = actual.left;
        }
        actual.addLeftChildren(leftVar);
    }
    else{
    	prev = leftVar;
    }

    return [prev,newType];
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7, type : string, symbolTable : HashTable) : [Node,string] {
	var tuple : [Node,string] = parseE8(expr.e,type,symbolTable)
	var newType : string = tuple[1];
	var leftVar : Node = tuple[0];
	var now : Node = search(expr.a,parseE8,newType,symbolTable);
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
    return [prev,newType];
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un nodo
que contiene unicamente el valor de un TkId, TkNumber, TkFalse y TkTrue. Se verifica el tipo del termino, si es un numero, se
guarda en el tipo del nodo y si es un ID se analiza la tabla de simbolos para verificar que existe, si no existe se guarda como 
error. En caso de ser unicamente, expresiones, se llega a esta funcion la primera vez con type="", por lo que hay un caso que maneja
esto, para luego modificar el tipo de la primera variable o valor encontrado.*/
function parseE8(expr : e8, type : string, symbolTable : HashTable) : [Node,string] {
	var prev : Node;
	var newType : string;
	if (expr.kind == "e8_1" || expr.kind == "e8_2" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        var tuple = parseE1(expr.value.e as e1, type,symbolTable);
        prev = tuple[0];
    }
    else{
    	prev = new Node(expr.value);
    	prev.type = expr.kind;
    	if (type == "TkNum" || type == "num"){
    		if (expr.kind == "TkNumber" || expr.kind == "TkId"){
    			if (expr.kind == "TkId"){
    				var found = symbolTable.search(prev.map(expr.value));
    				if (found[0] == false){
    					var nodo = new Node(expr.value);
    					errores.push("La variable"+nodo.map(expr.value)+" no existe");
    				}
    				else{
    					newType = found[1].type;
    				}
    			}
    		}
    		else{
    			errores.push("Los tipos no coinciden");
    		}
    	}
    	if (type == "TkBool" || type == "bool"){
    		if (expr.kind == "TkFalse" || expr.kind == "TkTrue" || expr.kind == "TkId"){
    			if (expr.kind == "TkId"){
    				var found = symbolTable.search(prev.map(expr.value));
    				if (found[0] == false){
    					var nodo = new Node(expr.value);
    					errores.push("La variable"+nodo.map(expr.value)+" no existe");
    				}
    				else{
    					newType = found[1].type;
    				}
    			}
    		}
    		else{
    			errores.push("Los tipos no coinciden");
    		}
    	}
    	if (type == ""){
    		if (expr.kind == "TkId"){
    			var found = symbolTable.search(prev.map(expr.value));
				if (found[0] == false){
					var nodo = new Node(expr.value);
					errores.push("La variable"+nodo.map(expr.value)+" no existe");
				}
				else{
					newType = found[1].type;
				}
    		}
    	}
    }
    return [prev,newType];
}

/*La funcion parseTermino analiza un arreglo y verifica un arbol por cada una de las posiciones del arreglo, luego crea el string
que representa al arreglo en su totalidad. Tambien se crea un arreglo con la evaluacion de cada una de las posiciones y los tipos.*/
function parseTermino(expr : termino, type : string,symbolTable:HashTable) : [Array<string>,Array<any>,Array<string>] {
    var initNode = parseE1(expr.e.e,type,symbolTable);
    var arbol = new Tree(initNode[0]);
    var array = [];
    var evaluate = [];
    var types = [];
    array.push(arbol.toString());
    evaluate.push(arbol.getResult(symbolTable));
    types = types.concat(arbol.types(symbolTable));
    if (expr.b != undefined){
        for (var i = 0; i < expr.b.length; i++) {
            var n = parseE1(expr.b[i].e.e,type,symbolTable);
            var newTree = new Tree(n[0]);
            array.push(newTree.toString());
            evaluate.push(newTree.getResult(symbolTable));
            types = types.concat(newTree.types(symbolTable));
        }
    }
    return [array,evaluate,types];
}

/*La funcion parseDeclaration analiza una definicion o asignacion y obtiene un arbol en donde se aloja la informacion recolectada
con las funciones recursivas. Genera un arreglo con los tipos, la evaluacion de las definiciones o asignaciones y el string que las 
representa.*/
function parseDeclaration(e : e1, type : string, symbolTable:HashTable) : [string,any,Array<string>] {
	var initNode = parseE1(e,type,symbolTable);
	var arbol = new Tree(initNode[0]);
	var evaluation = arbol.getResult(symbolTable);
	var types = arbol.types(symbolTable);
	return [arbol.toString(),evaluation,types];
}

/*La funcion validateAndEvaluate visita el AST obtenido por medio del parser para realizar la validacion y evaluacion de las expresiones introducidas
en el lenguaje. Se visita el arbol de manera similar a la funcion parsing, pero se realizan cambios para considerar los tipos
de los terminos al conseguirlos en la funcion parseE8. Se genera un arbol que toma como nodo, lo obtenido en la evaluacion de las 
funciones, para conseguir la evaluacion de la expresion, se llama a una funcion del arbol llamada getResult.
Ademas en caso de crear nuevas variables o arreglos, se agregan a la tabla de simbolos que es una de las entradas de la funcion.
Si es una asignacion, se modifica la variable con ayuda de la estructura tabla de hash que se ha generado para la tabla de simbolos.
Ademas se consideran los tipos de la expresion para su posterior uso en un set que sera retornado por la funcion.
Se retorna una tupla de tipo [Array<string>,string,HashTable,Array<any>,Set<string>]. En los que se retorna:
	errores: Array<string>
	ASTStringForm : string
	symbolTable : HashTable
	evaluation : Array<any>
	setOfTypes : Set<string>
	Con la informacion obtenida con esta funcion se puede obtener toda la informacion relacionada a cualquier expresion que sea tipeada
	en Stokhos, ya que, se conocen los tipos, la nueva tabla de simbolos, su string asociado, los errores que genera en caso de hacerlo y
	la evaluacion de la expresion en los valores guardados en tabla de simbolos y otras expresiones.
*/
export function validateAndEvaluate(ASTtree : any, symbolTable : HashTable) : [Array<string>,string,HashTable,Array<any>,Set<string>] {
    var type = ASTtree.ast.start.kind; 
    let valor = ASTtree.ast.start.e as e1;
    var getStringForm = "";
    var toString = "";
    var tipo = "";
    var evaluations = [];
    var typeArray = [];
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        tipo = declarationType;
        var nodo = new Node(declarationType);
        var declarationID = ASTtree.ast.start.id.value;
        var busqueda = symbolTable.search(nodo.map(declarationID));
    	if (busqueda[0] == false){
    		var res = parseDeclaration(valor,declarationType,symbolTable);
    		toString = res[0];
    		evaluations = [res[1]];
    		typeArray = res[2];
    		var symbol = new Symbol(nodo.map(declarationID),toString,nodo.map(declarationType));
    		symbol.number = res[1];
            symbolTable.insert(symbol); //Se inserta en la tabla de simbolos la nueva variable
            getStringForm = nodo.map(declarationType) + " " + nodo.map(declarationID) + " := " + toString +";";
    	}
    	else{
    		var nodo = new Node(declarationID);
    		errores.push("La variable de nombre "+nodo.map(declarationID)+" ya existe");
    	}
    }
    if (type == "assign"){
    	var nodo = new Node(ASTtree.ast.start.id.value);
    	var assignId = ASTtree.ast.start.id.value;
        valor = ASTtree.ast.start.e.e as e1;
        var busqueda = symbolTable.search(nodo.map(assignId));
        if (busqueda[0] == true){
        	var variableType = busqueda[1].type;
        	tipo = variableType;
    		var res = parseDeclaration(valor,variableType,symbolTable);
    		toString = res[0];
    		evaluations = [res[1]];
    		typeArray = res[2];
    		getStringForm = nodo.map(assignId) + " := " + toString + ";";
    		symbolTable.modify(nodo.map(assignId),res[0],variableType,[],res[1]); //Si existe la variable se modifica en la tabla de simbolos
    	}
    	else{
    		var nodo = new Node(assignId);
    		errores.push("La variable de nombre "+nodo.map(assignId)+" no existe");
    	}
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e as termino;
        var nodo = new Node(ASTtree.ast.start.type.kind);
        var arrayType = ASTtree.ast.start.type.kind;
        tipo = arrayType;
        var arrayName = ASTtree.ast.start.id.value;
        var busqueda = symbolTable.search(nodo.map(arrayName));
        if (busqueda[0] == false){
        	var arr = parseTermino(valor2,arrayType,symbolTable);
        	var toArray = arr[0];
        	evaluations = arr[1];
        	typeArray = arr[2];
        	var symbol = new Symbol(nodo.map(arrayName),"array",nodo.map(arrayType));
        	symbol.addArray(toArray);
        	symbolTable.insert(symbol);  //Se guarda en la tabla de simbolos el nuevo arreglo.
        	var arraysValues = "";
        	for (var i = 0; i < toArray.length; i++) {
        		if (i < toArray.length - 1){
        			arraysValues = arraysValues + toArray[i] + ",";
        		}
        		else{
        			arraysValues = arraysValues + toArray[i];
        		}
        	}
        	getStringForm = "["+nodo.map(arrayType)+"] "+nodo.map(arrayName)+" := "+"["+arraysValues+"];";
    	}
    	else{
    		var nodo = new Node(arrayName);
    		errores.push("La variable de nombre "+nodo.map(arrayName)+" ya existe");
    	}
    }
    if (type == "exp"){
    	var nodoInicial = parseE1(valor,"",symbolTable);
	    var arbol = new Tree(nodoInicial[0]);
	    toString = arbol.toString();
	    getStringForm = toString;
	    evaluations = [arbol.getResult(symbolTable)];
	    typeArray = arbol.types(symbolTable);  //Se consiguen los tipos de la expresion.
    }
    typeArray = typeArray.map(function(value) {if (value == "TkNumber" || value == "num"){return "num";} else{ return "bool"}});
    var set  = new Set(typeArray);
    if (set.has("num") && set.has("bool")){  //Si tiene num y bool se trata de una operacion que tiene un resultado de tipo bool
    	set = new Set();                     //por lo que se elimina el tipo num de los operadores para evitar problemas en el
    	set.add("bool");                     //manejo de tipos posteriormente.
    }
    var salida : [Array<string>,string,HashTable,Array<any>,Set<string>] = [errores,getStringForm,symbolTable,evaluations,set];
    return salida;
}
/*La funcion cleanErrors se encarga de inicializar como un arreglo vacio al arreglo en donde se alojan los errores que luego son
mostrados al usuario por medio del REPL.*/
export function cleanErrors(){
	errores = [];
}