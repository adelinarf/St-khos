import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";

/*La funcion map toma un token del lexer y retorna su valor dentro de la sintaxis de Stokhos como un string.*/
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
/*La funcion mapping genera una estructura map que toma un token y retorna su valor dentro de la sintaxis de Stokhos.*/
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

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Mapea el nombre de la operacion con ayuda
de la funcion map y concatena los strings conseguidos con las funciones parseE1. En caso de que las operaciones tengan la misma 
precedencia, la entrada array tiene mas de un elemento.*/
function search(array : Array<any>,nombre : Function) : string {
	var string = "";
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            string = string + map(array[i].op.kind) +nombre(entrada);
        }
    }
    return string;
}

/*La funciones parseEi se encargan de visitar los nodos del arbol AST generados por el parser. Se busca en cada uno de los nodos
del arbol AST que ha sido generado y en caso de encontrar una operacion con la funcion search, se agregan parentesis. El arbol
se visita con un recorrido inorden, lo que garantiza junto al orden de las reglas de las gramaticas (que se han ordenado por precedencia)
que los parentesis sean colocados en el orden correcto en cada una de las operaciones.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1) : string {
	var leftVar : string = parseE2(expr.e)
	var now : string = search(expr.a,parseE2);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")"
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2) : string {
	var leftVar : string = parseE3(expr.e)
	var now : string = search(expr.a,parseE3);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")"
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3) : string {
	var leftVar : string = parseE4(expr.e)
	var now : string = search(expr.a,parseE4);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")"
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4) : string {
	var leftVar : string = parseE5(expr.e)
	var now : string = search(expr.a,parseE5);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")"
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5) : string {
	var leftVar : string = parseE6(expr.e)
	var now : string = search(expr.a,parseE6);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")"
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6) : string {
	var leftVar : string = parseE7(expr.e);
	var salida = "";
    if (expr.uop != undefined && expr.uop.length > 0){
    	salida = map(expr.uop[0].kind);
        for (var i = 1; i < expr.uop.length; i++) { //esto debe ser uno para que funcionen los unarios
    	    salida = salida + map(expr.uop[i].kind);
        }
    }
    if (salida!=""){
    	salida = "("+salida + leftVar+")";
    }
    else{
    	salida = leftVar;
    }
    return salida;
}

/*La funcion parseE7 maneja la regla 7 de la gramatica.*/
function parseE7(expr : e7) : string {
	var leftVar = parseE8(expr.e);
	var now : string = search(expr.a,parseE8);
	var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un string
que contiene el valor de un TkId, TkNumber, TkFalse, TkTrue e incluye las comillas simples o llaves ({}) en caso de que la expresion
cuente con dichos simbolos.*/
function parseE8(expr : e8) : string {
	var salida : string;
	if (expr.kind == "e8_1" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        salida = parseE1(expr.value.e as e1);
        if (expr.kind == "e8_4"){
        	salida = "'"+salida+"'";
        }
        if (expr.kind == "e8_3"){
        	salida = "{"+salida+"}";
        }
    }
    if (expr.kind == "e8_2"){
    	salida = parseArray(expr.value); //Este caso considera los arreglos de tipo [expresion] que no estan definidos en una variable
		salida = "["+salida+"]";    	
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            if (expr.a != undefined){
                salida = map(expr.value.value) +"[" + parseE1(expr.a.next.e as e1) + "]"; //Este caso considera las posiciones a[i] de un
            }                                                                             //arreglo a
            if (expr.b != undefined){
            	if (expr.b.next!=undefined){
            		salida = map(expr.value.value) +"(" + parseArray(expr.b.next)+")"; //Este caso considera las funciones 
            	}
            	else{
            		salida = map(expr.value.value) +"()";
            	}
            	
            }
            if (expr.a == undefined && expr.b == undefined){
            	salida = map(expr.value.value);
            }
        }
        else{
            salida = map(expr.value);
        }
    }
    return salida;
}

/*La funcion parseArray considera los valores de un arreglo o una funcion y utiliza las funciones anteriores de manera recursiva
para formar el string que se genera en el arreglo no definido o en los argumentos de la funcion.*/
function parseArray(expr : termino) : string {
    var initNode = parseE1(expr.e.e);
    var aSalir = initNode;
    if (expr.b != undefined){
    	for (var i = 0; i < expr.b.length; i++) {
            var n = parseE1(expr.b[i].e.e);
            aSalir = aSalir + ","+n;
        }
    }
    return aSalir;
}

/*La funcion parseTermino analiza un arreglo al igual que la funcion parseArray consigue cada uno de los elementos del arreglo
en forma de string y los concatena en un solo string.*/
function parseTermino(expr : termino) : string {
    var initNode = parseE1(expr.e.e);
    var aSalir = initNode;
    if (expr.b != undefined){
    	for (var i = 0; i < expr.b.length; i++) {
            var n = parseE1(expr.b[i].e.e);
            aSalir = aSalir + ","+n;
        }
    }
    aSalir = "["+aSalir+"]";
    return aSalir;
}

/*La funcion getString consigue la representacion en string de un AST que ha sido generado por el parser. Se verifica si se trata de
una declaracion, una asignacion, un arreglo o una expresion. Se utiliza la funcion parseTermino para conseguir el string de la 
definicion de un arreglo y el resto de los tipos llaman a la funcion parseE1. 
*/
export function getString(ASTtree : any) : string {
    var type = ASTtree.ast.start.kind; 
    let valor = ASTtree.ast.start.e as e1;
    var arbol : string;
    if (type == "declaration"){ //Def(bool, listo, cacao > N)
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        var declarationID = ASTtree.ast.start.id.value;
        arbol = "Def("+map(declarationType) +","+ map(declarationID) +","+ parseE1(valor)+")";
    }
    if (type == "assign"){
    	var assignId = ASTtree.ast.start.id.value;
    	valor = ASTtree.ast.start.e.e as e1;
    	if (ASTtree.ast.start.a != undefined){ //Este caso controla las asignaciones de tipo a[i]=expresion para un arreglo a
    		arbol = arbol + parseE1(valor);
    	}
    	else{
    		arbol = "Def("+map(assignId)+","+parseE1(valor)+")"; //Este caso controla asignaciones de tipo num o bool que no 
    	}                                                        //pertenecen a un arreglo
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e as termino;
        var arrayType = ASTtree.ast.start.type.kind;
        var arrayName = ASTtree.ast.start.id.value;
        if (ASTtree.ast.start.e != null){
        	arbol = "Def("+"["+map(arrayType)+"]," + map(arrayName) +","+ parseTermino(valor2)+")";	
        }
        else{
        	arbol = "Def("+"["+map(arrayType)+"]," + map(arrayName) +",[])";
        }
    }
    if (type == "exp"){
    	arbol = parseE1(valor);
    }
    return arbol;
}