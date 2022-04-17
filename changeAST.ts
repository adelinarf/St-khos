import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se crea un padre, que es la operacion
y de manera recursiva se incluyen los hijos derechos e izquierdos de este padre, para que se genere un arbol binario con el orden
correcto y que representa a este AST pero con un arbol binario.*/

function map(token : string) : string {
		var re = /TkNumber\(/gi;
		var re1 = /TkId\(/gi;
		var re2 = /Tk/gi;
		var nuevo = "";
		if (token.search(re) == 0){
			var token = token.replace(re,"");
			token = token.replace(") ","");
			nuevo = token;
		}
		if (token.search(re1) == 0){
			var token = token.replace(re1,"");
			token = token.replace(") ","");
			nuevo = token;
		}
		if (token.search(re2) == 0){  //Si el token no es ni TkNumber ni TkId se llama a una funcion que contiene una estructura map
			var mappedTo = mapping(); //que mapea cada uno de los tokens del lenguaje a su verdadero valor.
			nuevo = mappedTo.get(token);
		}
		else{
			nuevo = token;
		}
		return nuevo;
	}

function mapping() : Map<string,string>{
  	var newMap = new Map<string,string>();
  	newMap.set("TkNum","num");
  	newMap.set("TkFalse ","false");
  	newMap.set("TkTrue ","true");
  	newMap.set("TkBool","bool");
  	newMap.set("TkAssign",":=");
  	newMap.set("TkColon",":");
  	newMap.set("TkSemiColon",";");
  	newMap.set("TkComma",",");
  	newMap.set("TkQuote","'");
  	newMap.set("TkNot","!");
  	newMap.set("TkOpenPar","(");
  	newMap.set("TkClosePar",")");
  	newMap.set("TkOpenBracket","[");
  	newMap.set("TkCloseBracket","]");
  	newMap.set("TkOpenBrace","{");
  	newMap.set("TkCloseBrace","}");
  	newMap.set("TkOr","||");
  	newMap.set("TkAnd","&&");
  	newMap.set("TkPower","^");
  	newMap.set("TkDiv","/");
  	newMap.set("TkPlus","+");
  	newMap.set("TkMult","*");
  	newMap.set("TkMod","%");
  	newMap.set("TkMinus","-");
  	newMap.set("TkLE","<=");
  	newMap.set("TkNE","<>");
  	newMap.set("TkLT","<");
  	newMap.set("TkGT",">");
  	newMap.set("TkGE",">=");
  	newMap.set("TkEQ","=");
  	return newMap;
  }


function search(array : Array<any>,nombre : Function,pos : number, value : any, counter: number, newVal :e1) : number {
	var string = "";
	var count = counter;
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            count = nombre(entrada,pos,value,count,newVal);
        }
    }
    return count;
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
function parseE1(expr : e1,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE2(expr.e,pos,value,counter,newVal);
	var now = search(expr.a,parseE2,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE3(expr.e,pos,value,counter,newVal);
	var now = search(expr.a,parseE3,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE4(expr.e,pos,value,counter,newVal)
	var now = search(expr.a,parseE4,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE5(expr.e,pos,value,counter,newVal);
	var now  = search(expr.a,parseE5,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE6(expr.e,pos,value,counter,newVal);
	var now : number = search(expr.a,parseE6,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE7(expr.e,pos,value,counter,newVal);
	var salida = "";
    if (expr.uop != undefined && expr.uop.length > 0){
    	salida = map(expr.uop[0].kind);
        for (var i = 1; i < expr.uop.length; i++) { //esto debe ser uno para que funcionen los unarios
    	    salida = salida + map(expr.uop[i].kind);
        }
    }
    return leftVar;
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7,pos : number, value : any, counter: number, newVal :e1) : number {
	var leftVar = parseE8(expr.e,pos,value,counter,newVal);
	var now : number = search(expr.a,parseE8,pos,value,leftVar,newVal);
    return now;
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un nodo
que contiene unicamente el valor de un TkId, TkNumber, TkFalse y TkTrue. Se verifica el tipo del termino, si es un numero, se
guarda en el tipo del nodo y si es un ID se analiza la tabla de simbolos para verificar que existe, si no existe se guarda como 
error. En caso de ser unicamente, expresiones, se llega a esta funcion la primera vez con type="", por lo que hay un caso que maneja
esto, para luego modificar el tipo de la primera variable o valor encontrado.*/
function parseE8(expr : e8,pos : number, value : any, counter: number, newVal :e1) : number {
	var salida : string = "";
	if (expr.kind == "e8_1" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        if (expr.kind == "e8_4"){
        	salida = "'"+salida+"'";
        }
        if (expr.kind == "e8_3"){
        	salida = "{"+salida+"}";
        }
    }
    if (expr.kind == "e8_2"){
    	if (expr.value!=undefined){
    		if (pos == 0){
    			expr.value.e.e = newVal;
    		}
    		else{
    			expr.value.b[pos-1].e.e = newVal;
    		}
    	}
		salida = "["+salida+"]";    	
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            salida = expr.value.value;
        }
        else{
        	if (counter == pos){
        	    counter = counter +1;	
        	}
        }
    }
    return counter;
}

/*La funcion parseTermino analiza un arreglo y verifica un arbol por cada una de las posiciones del arreglo, luego crea el string
que representa al arreglo en su totalidad. Tambien se crea un arreglo con la evaluacion de cada una de las posiciones y los tipos.*/
function parseTermino(expr : termino,pos : number, value : any, counter : number, tipo:string,newE : e1) {
	if (pos==0){
		expr.e.e = newE;
	}
	else{
		//expr.b[pos-1].e.e = newE;
		console.log(expr.e.e.e.e.e.e.e.e);
		//var d = expr.e.e.e.e.e.e.e.e.e.value as termino;
		//console.log(d.e.e);
		//console.log(d.b);
	}
    /*var initNode = parseE1(expr.e.e,pos,value,counter,tipo);
    var aSalir = initNode;
    if (expr.b != undefined){
    	for (var i = 0; i < expr.b.length; i++) {
            aSalir = parseE1(expr.b[i].e.e,pos,value,aSalir,tipo);
        }
    }*/
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
export function change(ASTtree : any, pos : number, value : any, newE :e1) : any {
    var type = ASTtree.ast.start.kind; 
    let valor = ASTtree.ast.start.e as e1;
    var arbol : number;
    var counter = 0;
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e as termino;
        var arrayType = ASTtree.ast.start.type.kind;
        var arrayName = ASTtree.ast.start.id.value;
        if (ASTtree.ast.start.e != null){
        	//parseTermino(valor2,pos,value,counter,map(arrayType),newE);	
        	var a = parseE1(ASTtree.ast.start.e.e,pos,value,counter,newE); 
        }
        else{
        	console.log("NO HAY AST");
        }
    }
    return ASTtree;
}