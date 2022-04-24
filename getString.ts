import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
import {map, mapping} from "./mappingFunctions.js"

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se alojan los resultados de los strings
anteriores en una variable llamada string que retorna la funcion, una vez analizadas todas las operaciones.*/
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

/*La funcion stringOfE1 permite retornar el string de un objeto del AST sin tener que llamar a la funcion getString.*/
export function stringOfE1(expr : e1) : string {
	return parseE1(expr);
}
/*La funcion stringOfArray permite retornar el string de un arreglo sin necesidad de llamar a la funcion getString.*/
export function stringOfArray(expr : termino) : string{
	return parseArray(expr);
}

/*La funciones parseEi se encargan de visitar los nodos del arbol AST generados por el parser. Ademas se generan nodos en cada
una de las funciones. Se llama a la funcion search que se encarga de visitar el atributo a que contiene los hijos de la operacion
en el arbol, por lo que si es undefined, no contiene hijos y esa regla en particular no ha sido aplicada.
En cada funcion parseEi se llama a la funcion parseEi+1 de manera recursiva y se retorna un string que se concatena con las demas 
operaciones y expresiones conseguidas al visitar el arbol.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1) : string {
	var leftVar : string = parseE2(expr.e);
	var now : string = search(expr.a,parseE2);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2) : string {
	var leftVar : string = parseE3(expr.e);
	var now : string = search(expr.a,parseE3);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3) : string {
	var leftVar : string = parseE4(expr.e);
	var now : string = search(expr.a,parseE4);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4) : string {
	var leftVar : string = parseE5(expr.e);
	var now : string = search(expr.a,parseE5);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5) : string {
	var leftVar : string = parseE6(expr.e);
	var now : string = search(expr.a,parseE6);
    var salida = "";
	if (now != ""){
		salida = "("+leftVar + now+")";
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
        for (var i = 1; i < expr.uop.length; i++) {
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

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
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

/*La funcion parseE8 maneja la regla 8 de la gramatica. Es la ultima de las reglas y en este caso se encarga de tomar los valores
de las expresiones y convertirlos a un string que puede ser leido por el usuario.*/
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
    	salida = parseArray(expr.value);
    	salida = "["+salida+"]";   	
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            if (expr.a != undefined){
                salida = map(expr.value.value) +"[" + parseE1(expr.a.next.e as e1) + "]";
            }
            if (expr.b != undefined){
            	if (expr.b.next!=undefined){
            		salida = map(expr.value.value) +"(" + parseArray(expr.b.next)+")";
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

/*La funcion parseArray toma el objeto de un arreglo y retorna el string de cada uno de los elementos del arreglo, evaluando cada uno
de los elementoss con la funcion parseE1.*/
function parseArray(expr : termino) : string {
	var aSalir = "";
	if (expr!=null && expr.e != null && expr.e.e!=null){
	    var initNode = parseE1(expr.e.e);
	    aSalir = initNode;
	    if (expr.b != undefined){
	    	for (var i = 0; i < expr.b.length; i++) {
	            var n = parseE1(expr.b[i].e.e);
	            aSalir = aSalir + ","+n;
	        }
	    }
	}
    return aSalir;
}

/*La funcion getString visita el AST y retorna su informacion a modo de string. Cuenta con varios modos:
	Modo 0 : Cuando se desea imprimir el string con .ast
	Modo 1 : Cuando se desea imprimir el string con execute o eval de la VM.
	Modo 2 : Cuando se desea imprimir unicamente el string evaluado.
Se atraviesa el AST de manera recursiva para convertir las operaciones y valores en string que pueden ser impresos en el REPL.
*/
export function getString(ASTtree : any, mode : number) : string {
    var type = ASTtree.ast.start.kind; 
    let valor = ASTtree.ast.start.e as e1;
    var arbol : string;
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        var declarationID = ASTtree.ast.start.id.value;
        if (mode == 0){
        	arbol = "Def("+map(declarationType) +","+ map(declarationID) +","+ parseE1(valor)+")";
        }
        if (mode == 1){
        	arbol = map(declarationType)+" "+map(declarationID)+" := "+parseE1(valor)+";";
        }
        if (mode!=0 && mode!=1){
        	arbol = parseE1(valor);
        }
    }
    if (type == "assign"){ 
    	var assignId = ASTtree.ast.start.id.value;
    	valor = ASTtree.ast.start.e.e as e1;
    	if (ASTtree.ast.start.a != undefined){ //Asignacion de una posicion de un arreglo
    		var pos = parseE1(ASTtree.ast.start.a.next.e);
    		if (mode == 0){
    		    arbol = "Def("+map(assignId) +"["+pos.toString()+"]"+","+ parseE1(valor)+")";	
    		}
    		if (mode == 1){
    			arbol = map(assignId)+"["+pos.toString()+"]"+" := "+ parseE1(valor)+";";
    		}
    		if (mode!=0 && mode!=1){
    			arbol = parseE1(valor);
    		}
    	}
    	else{
    		if (mode == 0){
    			arbol = "Def("+map(assignId)+","+parseE1(valor)+")";
    		}
    		if (mode == 1){
    			arbol = map(assignId)+" := "+parseE1(valor)+";";
    		}
    		if (mode!=0 && mode!=1){
    			arbol = parseE1(valor);
    		}
    	}
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e.e as e1;
        var arrayType = ASTtree.ast.start.type.kind;
        var arrayName = ASTtree.ast.start.id.value;
        if (ASTtree.ast.start.e != null){
        	if (mode == 0){
        		arbol = "Def("+"["+map(arrayType)+"]," + map(arrayName) +","+ parseE1(valor2)+")";	
        	}
        	if (mode == 1){
        		arbol = "["+map(arrayType)+"] "+map(arrayName)+":="+parseE1(valor2)+";";
        	}
        	if (mode!=0 && mode!=1){
        		arbol = parseE1(valor2);
        	}
        	
        }
        else{
        	if (mode == 0){
        		arbol = "Def("+"["+map(arrayType)+"]," + map(arrayName) +",[])";
        	}
        	if (mode == 1){
        		arbol = "["+map(arrayType)+"] "+map(arrayName)+":= [];";
        	}
        	if (mode!=0 && mode!=1){
        		arbol = "[]";
        	}
        }
    }
    if (type == "exp"){
    	arbol = parseE1(valor);
    }
    return arbol;
}