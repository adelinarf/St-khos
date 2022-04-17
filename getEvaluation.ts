import { e1,e2,e3,e4,e5,e6,e7,e8, exp, termino, e2_$0 , ASTKinds } from "./parser2";
import {HashTable, Symbol} from "./hashtable.js"
import { getType , getASTType} from "./getTypes.js"
import {stringOfE1 , getString, stringOfArray} from "./getString.js"


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


function search(array : Array<any>,nombre : Function, evaluate : number) : Array<any> {
	var string = [];
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            string.push(array[i].op.kind);
            string.push(nombre(entrada,evaluate));
        }
    }
    return string;
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

function operateBinary(leftOp : any, operations : Array<any>) : any {
	var left = leftOp;
  	var operators = ["TkMult","TkDiv","TkPower","TkMod","TkPlus","TkMinus","TkAnd","TkOr","TkEQ","TkNE","TkLT","TkLE","TkGE","TkGT"];
	for (var i = 0; i < operations.length-1; i++) {
		if (operations[i]=="TkPlus"){
			left = left + operations[i+1];
		}
		if (operations[i]=="TkMinus"){
			left = left - operations[i+1];
		}
		if (operations[i]=="TkMod"){
			left = left % operations[i+1];
		}
		if (operations[i]=="TkLE"){
			left = left <= operations[i+1];
		}
		if (operations[i]=="TkNE"){
			left = left != operations[i+1];
		}
		if (operations[i]=="TkLT"){
			left = left < operations[i+1];
		}
		if (operations[i]=="TkGT"){
			left = left > operations[i+1];
		}
		if (operations[i]=="TkGE"){
			left = left >= operations[i+1];
		}
		if (operations[i]=="TkEQ"){
			left = left == operations[i+1];
		}
		if (operations[i]=="TkOr"){
			left = left || operations[i+1];
		}
		if (operations[i]=="TkAnd"){
			left = left && operations[i+1];
		}
		if (operations[i]=="TkPower"){
			left = Math.pow(left,operations[i+1]);
		}
		if (operations[i]=="TkDiv"){
			left = left / operations[i+1];
		}
		if (operations[i]=="TkMult"){
			left = left * operations[i+1];
		}
		if (operators.indexOf(operations[i]) <= -1){
			continue;
		}
	}
	return left;
}

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1, evaluate : number) : any {
	var leftVar : any = parseE2(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE2,evaluate);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2,evaluate : number) : any {
	var leftVar : any = parseE3(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE3,evaluate);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3,evaluate : number) : any {
	var leftVar : any = parseE4(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE4,evaluate);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4,evaluate : number) : any {
	var leftVar : any = parseE5(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE5,evaluate);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5,evaluate : number) : any {
	var leftVar : any = parseE6(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE6,evaluate);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

function operateUnary(leftOp : any , operations : Array<any>) : any {
	var left = leftOp;
  	var operators = ["TkPlus","TkMinus","TkNot"];
	for (var i = 0; i <= operations.length-1; i++) {
		if (operations[i]=="TkPlus"){
			left = + left;
		}
		if (operations[i]=="TkMinus"){
			left = - left;
		}
		if (operations[i]=="TkNot"){
			left = ! left;
		}
		if (operators.indexOf(operations[i]) <= -1){
			continue;
		}
	}
	return left;
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6,evaluate : number) : any {
	var leftVar : any = parseE7(expr.e,evaluate);
	var operations = [];
    if (expr.uop != undefined && expr.uop.length > 0){
    	operations.push(expr.uop[0].kind);
        for (var i = 1; i < expr.uop.length; i++) { //esto debe ser uno para que funcionen los unarios
    	    operations.push(expr.uop[i].kind);
        }
    }
    var salida : any;
	if (operations.length != 0){
		salida = operateUnary(leftVar,operations);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7,evaluate : number) : any {
	var leftVar = parseE8(expr.e,evaluate);
	var now : Array<any> = search(expr.a,parseE8,evaluate);
	var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un nodo
que contiene unicamente el valor de un TkId, TkNumber, TkFalse y TkTrue. Se verifica el tipo del termino, si es un numero, se
guarda en el tipo del nodo y si es un ID se analiza la tabla de simbolos para verificar que existe, si no existe se guarda como 
error. En caso de ser unicamente, expresiones, se llega a esta funcion la primera vez con type="", por lo que hay un caso que maneja
esto, para luego modificar el tipo de la primera variable o valor encontrado.*/
function parseE8(expr : e8,evaluate : number) : any {
	var salida : any;
	if (expr.kind == "e8_1" || expr.kind == "e8_3"){ //e8_4 estaba aqui antes
        salida = parseE1(expr.value.e as e1,evaluate);
    }
    if (expr.kind == "e8_4"){
    	salida = parseE1(expr.value.e as e1,evaluate);
    	//if (evaluate == 1){
    	//	salida = "'"+salida.toString()+"'";
    	//}
    }
    if (expr.kind == "e8_2"){ //esta salida es la de un arreglo
    	salida = parseArray(expr.value,evaluate);
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            if (expr.a != undefined){ //esta salida es la posicion del arreglo
            	salida = parseE1(expr.a.next.e as e1,evaluate);
                var getSearch = symbol.search(map(expr.value.value));
                if (getSearch[0]!=false){
                	if (evaluate == 0){
                		salida = getSearch[1].array[salida];
                	}
                	if (evaluate == 1){
                		var f = getSearch[1].AST.ast.start.e.e.e.e.e.e.e.e.e;
                		var pos = salida;
                		if (salida == 0){
                			salida = parseE1(f.value.e.e,evaluate);
                		}
                		else{
                			salida = parseE1(f.value.b[salida-1].e.e,evaluate);
                		}
                		getSearch[1].array[pos] = salida; 
                	}
                }
            }
            if (expr.b != undefined){ //esta salida es la de las funcion
            	if (expr.b.next!=undefined){
            		salida = parseFunctionWithArguments(expr.b.next,map(expr.value.value));
            	}
            	else{
            		salida = parseFunctionEmptyArguments(map(expr.value.value));
            	}
            }
            if (expr.a == undefined && expr.b == undefined){ //esta salida es el valor de la variable
            	salida = map(expr.value.value);
            	var getV = symbol.search(map(expr.value.value));
            	if (getV[0]!=false){
            		var t = getV[1].AST.ast.start.kind;
            		if (t == "declaration" || t=="assign"){
            			if (evaluate == 0){
            				//if (getV[1].AST.ast.start.e.e.e.e.e.e.e.e.e.kind == "e8_4"){
            				salida = getV[1].value;
            			}
            			if (evaluate == 1){
            				salida = parseE1(getV[1].AST.ast.start.e.e,evaluate);
            				getV[1].value = salida;
            			}
            			/*var re = /\'/gi;
            			var str : string = (getV[1].value).toString();
            			if (str.search(re) != -1){
            				salida = parseE1(getV[1].AST.ast.start.e.e,evaluate);
            			}
            			else{
            				salida = getV[1].value;
            			}*/
            		}
            		if (t == "array"){
            			if (evaluate == 0){
            				salida = getV[1].array;
            			}
            			if (evaluate == 1){
            				salida = parseE1(getV[1].AST.ast.start.e.e,evaluate);
            				getV[1].array = salida;
            			}
            		}
            	}
            }
        }
        else{
        	if (expr.kind == "TkNumber"){
            	salida = parseFloat(map(expr.value));
            }
            if (expr.kind == "TkFalse" || expr.kind == "TkTrue"){
            	salida = map(expr.value);
            }
        }
    }
    return salida;
}

function parseFunctionWithArguments(expr : termino, name : string) : any {
	var salida : any;
	if (name == "if"){
		salida = ifFun(expr);
	}
	if (name == "type"){
		salida = typeFun(expr);
	}
	if (name == "ltype"){
		salida = ltypeFun(expr);
	}
	if (name == "floor"){
		salida = floorFun(expr);
	}
	if (name == "length"){
		salida = lengthFun(expr);
	}
	if (name == "sum"){
		salida = sumFun(expr);
	}
	if (name == "avg"){
		salida = avgFun(expr);
	}
	if (name == "ln"){
		salida = lnFun(expr);
	}
	if (name == "exp"){
		salida = expFun(expr);
	}
	if (name == "sin"){
		salida = sinFun(expr);
	}
	if (name == "cos"){
		salida = cosFun(expr);
	}
	if (name == "formula"){
		salida = formulaFun(expr);
	}
	if (name == "array"){
		salida = arrayFun(expr);
	}
	if (name == "histogram"){
		salida = histogramFun(expr);
	}
	if (name == "sqrt"){
		salida = sqrtFun(expr);
	}
	return salida;
}

function parseFunctionEmptyArguments(name : string) : any {
	var salida : any;
	if (name == "reset"){
		salida = resetFun();
	}
	if (name == "uniform"){
		salida = uniformFun();
	}
	if (name == "pi"){
		salida = piFun();
	}
	if (name == "now"){
		salida = nowFun();
	}
	if (name == "tick"){
		salida = tickFun();
	}
	return salida;
}


function tickFun() : number {
	computedCyles += 1;
	return computedCyles;
}

function lnFun(expr : termino) : number {
	var f = parseE1(expr.e.e,0);
	return Math.log(f);
}

function sqrtFun(expr : termino) : number{
	var f = parseE1(expr.e.e,0);
	return Math.sqrt(f);
}

function expFun(expr : termino) : number {
	var f = parseE1(expr.e.e,0);
	var e = Math.E;
	return Math.pow(e,f);
}

function sinFun(expr : termino) : number {
	var f = parseE1(expr.e.e,0);
	return Math.sin(f);
}

function cosFun(expr : termino) : number {
	var f = parseE1(expr.e.e,0);
	return Math.cos(f);
}

function formulaFun(expr : termino) : any {
	var f = stringOfE1(expr.e.e);
	var out : string;
	var openbracket = /\[/gi;
	var closebracket = /\]/gi;
	if (f.search(openbracket) != -1 && f.search(closebracket) != -1){
		var separated = f.split("[");
		var search = symbol.search(separated[0]);
		var pos = parseFloat(separated[1].replace("]",""));
		if (search[0]!=false){
			var termino = search[1].AST.ast.start.e;
			if (pos==0){
				//console.log(search[1].AST.ast.start.e.e.e.e.e.e.e.e.e);
				//console.log(search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.e.e);
				var ast = search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.e.e;
				out = stringOfE1(ast);
			}
			else{
				//console.log(search[1].AST.ast.start.e.e.e.e.e.e.e.e);
				//console.log(search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.b[pos-1].e.e);
				var ast = search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.b[pos-1].e.e;
				out = stringOfE1(ast);
				//out = getString(termino.b[pos-1].e.e,2);
			}
		}
	}
	else{
		var search = symbol.search(f);
		if (search[0]!=false){
			var ast = search[1].AST;
			out = getString(ast,2);
		}
	}
	return out;
}

function arrayFun(expr : termino) : Array<any> {
	var size = parseE1(expr.e.e,0);
	var newArray = [];
	for (var i = 0; i < size; i++) {
		newArray.push(parseE1(expr.b[0].e.e,0));
	}
	newArray.push(expr.b[0].e.e,"arrayFun");
	return newArray;
}

function histogramFun(expr : termino) : Array<any> {
	//var exp = parseE1(expr.e.e);
	var nsamples = parseE1(expr.b[0].e.e,0);
	var nbuckets = parseE1(expr.b[1].e.e,0);
	var lowerBound = parseE1(expr.b[2].e.e,0);
	var upperBound = parseE1(expr.b[3].e.e,0);
	var count = 0;
	var results = [...Array(nbuckets+2)].map(x => 0);
	var values = [...Array(nbuckets+2)].map(x => 0);
	while (count < nsamples){
		var exp = parseE1(expr.e.e,0);
		if (exp <= lowerBound){
			results[0] = results[0]+1;
			values[0] = exp;
		}
		if (exp >= upperBound){
			results[results.length-1] = results[results.length-1] + 1;
			values[values.length-1] = exp; 
		}
		if (exp > lowerBound && exp < upperBound){
			results[Math.floor(exp%results.length)] = results[Math.floor(exp%results.length)] + 1; 
			values[Math.floor(exp%results.length)] = Math.floor(exp%results.length);
		}
		count += 1;
		tickFun();
	}
	var spaces : string = (results.length).toString();
	var space : number = spaces.length;
	for (var i = 0; i<results.length;i++){
		var bars : string = getBars(results[i]);
		var numberStr : string = i.toString();
		var digitQuantity : number = numberStr.length;
		console.log(getSpaces(space-digitQuantity)+i.toString() + "  "+bars);
	}
	var pos0 : exp = object(results[0]);
	var b = [];
	var e8 : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : pos0, b : []}};
	for (var x = 1; x<results.length;x++){
		e8.value.b.push({kind : ASTKinds.termino_$0, e : object(results[x])});
	}
	//var e : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-1] }, b : []}};
	var output : Array<any> = [];
	output = output.concat(results);
	output.push(e8,"histogram");
	return output;
}

function object(val : number) : exp {
	var e8 : e8 = {kind : ASTKinds.TkNumber , value : "TkNumber("+val.toString()+")"};
	var e7 : e7 = {kind : ASTKinds.e7 , e : e8 , a: []};
	var e6 : e6 = {kind : ASTKinds.e6 , e : e7 ,uop : []};
	var e5 : e5 = {kind : ASTKinds.e5 , e : e6 , a: []};
	var e4 : e4 = {kind : ASTKinds.e4 , e : e5 , a: []};
	var e3 : e3 = {kind : ASTKinds.e3 , e : e4 , a: []};
	var e2 : e2 = {kind : ASTKinds.e2 , e : e3 , a: []};
	var e1 : e1 = {kind : ASTKinds.e1 , e : e2 , a: []};
	var exp : exp = {kind : ASTKinds.exp, e: e1 };
	return exp;
}

function getSpaces(val : number) : string {
	var space = " ";
	return space.repeat(val);
}

function getBars(val : number) : string {
	var bar = "\u25A0";
	return bar.repeat(val);
}

function ifFun(expr : termino) : any {
	var resultCondition = parseE1(expr.e.e,0);
    if (resultCondition == true){
    	return parseE1(expr.b[0].e.e,0);
    }
    else{
    	return parseE1(expr.b[1].e.e,0);
    }
}
function typeFun(expr : termino) : string {
	var output : string;
	var resultOfEvaluating = parseE1(expr.e.e,0);
	if (Array.isArray(resultOfEvaluating)){
		output = getTypeOfArray(resultOfEvaluating);
		//revisar el tipo de cada variable del arreglo
	}
	else{
		output = getTypeOfExpression(resultOfEvaluating);
		//revisar el tipo y ver si es o no float,int o boolean
	}
	return output;
}

function getTypeOfArray(resultOfEvaluating : Array<any>) : string {
	var types = [];
	var output = "";
	for (var i = 0; i < resultOfEvaluating.length; i++) {
		types.push(getTypeOfExpression(resultOfEvaluating));
	}
	var set = new Set(types);
	if (set.size == 1){
		var m = set.values();
		var value = m.next().value;
		output = "["+value+"]";
	}
	else{
		if (set.has("int") && set.has("float")){
			output = "[float]";
		}
	}
	return output;
}

function getTypeOfExpression(resultOfEvaluating : any) : string {
	var output : string;
	if (resultOfEvaluating == true || resultOfEvaluating == false){
		output = "boolean";
	}
	else{
		var int = parseInt(resultOfEvaluating);
		var float = parseFloat(resultOfEvaluating);
		if (int == float){
			output = "int";
		}
		else{
			output = "float";
		}
	}
	return output;
}

function ltypeFun(expr : termino) : any {
	var output : string;
	var resultOfEvaluating = parseE1(expr.e.e,0);
	if (Array.isArray(resultOfEvaluating)){
		output = getTypeOfArray(resultOfEvaluating);
	}
	else{
		output = getTypeOfExpression(resultOfEvaluating);
	}
	return output;
}
function floorFun(expr : termino) : number {
	var f = parseE1(expr.e.e,0);
	return Math.floor(f);
}
function lengthFun(expr : termino) : number {
	var array = parseE1(expr.e.e,0);
	return (array.length);
}
function sumFun(expr : termino) : number {
	var array : Array<number> = parseE1(expr.e.e,0);
	var s = array.reduce((x, a) => x + a, 0);
	return s;
}
function avgFun(expr : termino) : number {
	var length = lengthFun(expr);
	var sum = sumFun(expr);
	return sum / length;
}

function resetFun() : boolean {
	symbol = new HashTable();
	return true;
}
function uniformFun() : number {
	var rad = (Math.random() * (2));
	//var output = (Math.floor(rad));
	return rad;
}
function piFun() : number {
	var pi = Math.asin(1)*2;
	return pi;
}
function nowFun() : number {
	var currentTimeInMiliSeconds=Math.floor(Date.now());
	return currentTimeInMiliSeconds;
}

function parseArray(expr : termino,evaluate:number) : Array<any> {
	var aSalir : Array<any>;
	if (expr!=null && expr.e != null && expr.e.e!=null){
	    var initNode = parseE1(expr.e.e,evaluate);
	    aSalir = [initNode];
	    if (expr.b != undefined){
	    	for (var i = 0; i < expr.b.length; i++) {
	            var n = parseE1(expr.b[i].e.e,evaluate);
	            aSalir.push(n);
	        }
	    }
	}
	else{
		aSalir = [];
	}
    return aSalir;
}

/*La funcion parseTermino analiza un arreglo y verifica un arbol por cada una de las posiciones del arreglo, luego crea el string
que representa al arreglo en su totalidad. Tambien se crea un arreglo con la evaluacion de cada una de las posiciones y los tipos.*/
function parseTermino(expr : termino) : Array<any> {
    var initNode = parseE1(expr.e.e,0);
    var aSalir : Array<any> = [initNode];
    if (expr.b != undefined){
    	for (var i = 0; i < expr.b.length; i++) {
            var n = parseE1(expr.b[i].e.e,0);
            aSalir.push(n);
        }
    }
    return aSalir;
}

export function evaluate(expr : e1) : any{
	return parseE1(expr,0);
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
var symbol : HashTable;
var computedCyles : number;

export function getEvaluation(ASTtree : any, symbolTable : HashTable,computeCycle : number, evaluate : number) : [any,HashTable,number] {
    var type = ASTtree.ast.start.kind; 
    symbol = symbolTable;
    computedCyles = computeCycle;
    let valor = ASTtree.ast.start.e as e1;
    var arbol : any;
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        var declarationID = ASTtree.ast.start.id.value;
        arbol = parseE1(valor,evaluate);
        var t = getASTType(getType(ASTtree,symbolTable,0),type);
        symbolTable.insert(new Symbol(map(declarationID),arbol,t[0],ASTtree));
        //guardar variable
    }
    if (type == "assign"){ //se debe buscar el tipo en la tabla de simbolos si no existe se lanza un error
    	var assignId = ASTtree.ast.start.id.value;
    	valor = ASTtree.ast.start.e.e as e1;
    	if (ASTtree.ast.start.a != undefined){
    		arbol = parseE1(valor,evaluate); //valor a cambiar
    		var pos = parseE1(ASTtree.ast.start.a.next.e,evaluate);  //valor de la posicion
    		var obtain = symbol.search(map(assignId));
    		if (obtain[0]!=false){
    			symbolTable.modifyArray(map(assignId),pos,arbol,valor);
    		}
    	}
    	else{
    		arbol = parseE1(valor,evaluate);  //guardar variable
    		var ty = getASTType(getType(ASTtree,symbolTable,1),type);
    		symbolTable.modify(map(assignId),arbol,ty[0],[],ASTtree); 
    	}
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e.e as e1;
        var arrayType = ASTtree.ast.start.type.kind;  //guardar arreglo
        var arrayName = ASTtree.ast.start.id.value;
        if (ASTtree.ast.start.e != null){
        	arbol = parseE1(valor2,evaluate);
        	if (arbol[arbol.length-1] == "histogram"){
        		ASTtree.ast.start.e.e.e.e.e.e.e.e.e = arbol[arbol.length-2];
        		var arbolMod = arbol.slice(0,arbol.length-2);
        		arbol = arbolMod;
        	}
        	if (arbol[arbol.length-1] == "arrayFun"){
        		var arbolM = arbol.slice(0,arbol.length-2);
        		var e : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }, b : []}};
        		ASTtree.ast.start.e.e.e.e.e.e.e.e.e = e;
        		for (var i = 0 ; i < arbolMod.length-1 ; i++){
        			ASTtree.ast.start.e.e.e.e.e.e.e.e.e.value.b.push({kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }});
        		}
        		arbol = arbolM;
        	}
        	var symbols = new Symbol(map(arrayName),"",map(arrayType),ASTtree);
        	symbols.array = arbol; 
        	symbolTable.insert(symbols);
        }
        else{
        	arbol = [];
        } 
    }
    if (type == "exp"){
    	arbol = parseE1(valor,evaluate);
    	if (Array.isArray(arbol)){
    		if (arbol[arbol.length-1]=="arrayFun" || arbol[arbol.length-1] == "histogram"){
    			var arbolModified = arbol.slice(0,arbol.length-2);
        		arbol = arbolModified;
    		}
    	}
    }
    symbolTable = symbol; 
    return [arbol,symbol,computedCyles];
}