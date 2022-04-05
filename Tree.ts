/*La clase Tree constituye un arbol que sera utilizado para convertir el arbol obtenido por medio de la libreria en un arbol binario.
Cuenta con un nodo raiz, en donde se encuentra el resto del arbol de manera recursiva.*/
export class Tree {
	root : Node;
	actualNode : Node;
  constructor(nodoPadre : Node) {
  	this.root = nodoPadre;
  	this.actualNode = this.root;
  }
  /*La funcion toString retorna la expresion que se encuentra en el arbol en forma de string incluyendo los parentesis.*/
  toString() : string {
  	var res = this.root.precedes();
  	return res[0];
  }  
}
/*La clase Node constituye un nodo del arbol y puede tener las propiedades node, left, right y type que definen su nombre, el hijo
izquierdo, derecho y el tipo del nodo. Esta estructura es esencial para la elaboracion del arbol, ya que, consiste de nodos que se llaman 
entre si de manera recursiva.*/
export class Node{
	node : string;
	left : Node;
	right : Node;
	type : string;
	constructor(name : string){
		this.node = name;
	}
	addLeftChildren(nodo : Node){
		this.left = nodo;
	}
	addRightChildren(nodo : Node){
		this.right = nodo;
	}
	/*La funcion precedencia toma un string que es el token de una operacion y retorna su numero de precedencia.*/
	precedencia(name : string) : number{
		var val : number = 1;
		var re = /TkNumber/gi;
		var re1 = /TkId/gi;
		var re2 = /TkTrue/gi;
		var re3 = /TkFalse/gi;
  	if (name == "TkPower"){
  		val = 7;
  	}
  	if (name=="TkNot"){
  		val = 6;
  	}
  	if (name == "TkMult" || name =="TkMod" || name =="TkDiv"){
  		val = 5;
  	}
  	if (name == "TkPlus" || name=="TkMinus"){
  		val = 4;
  	}
  	if (name == "TkLT" || name=="TkLE" || name=="TkGE" || name=="TkGT"){
  		val = 3;
  	}
  	if (name == "TkEQ" || name=="TkNE"){
  		val = 2;
  	}
  	if (name == "TkAnd" || name=="TkOr"){
  		val = 1;
  	}
  	if (name.search(re) != -1 || name.search(re1) != -1 || name.search(re2) != -1 || name.search(re3) != -1){
  		val = 8;
  	}
  	return val;
	}
	/*La funcion precedes se llama recursivamente para evaluar la precedencia y genera un string para cada uno de los hijos de los nodos.
	Se colocan los parentesis dependiendo de la precedencia del padre y la de los hijos y finalmente retorna una tupla de [string,number]
	en donde en la posicion 0 se encuentra el string que representa a todo el arbol, si se llama a precedes a partir del nodo raiz del 
	arbol.*/
	precedes() : [string,number] {
		var left = ["",8];
		var right = ["",8];
		var output = "";
		var parentPrecedence : number = this.precedencia(this.node);
		if (this.left !=undefined){
			left = this.left.precedes();
		}
		if (this.right !=undefined){
			right = this.right.precedes();
		}
		var valor = this.map(this.node);
		if (parentPrecedence > left[1] && parentPrecedence > right[1]){
			//parentiza el hijo izquierdo y el derecho
			output = "("+left[0]+")"+valor+"("+right[0]+")";
		}
		if (parentPrecedence > left[1] && parentPrecedence < right[1]){
			//parentiza el hijo izquierdo
			output = "("+left[0]+")"+valor+right[0];
		}
		if (parentPrecedence < left[1] && parentPrecedence > right[1]){
			//parentiza el hijo derecho
			output = left[0]+valor+"("+right[0]+")";
		}
		if (parentPrecedence < left[1] && parentPrecedence < right[1]){
			output = "("+left[0] + valor + right[0]+")"; 
		}
		var a = parentPrecedence > left[1] && parentPrecedence < right[1];
		var b = parentPrecedence < left[1] && parentPrecedence > right[1];
		var c = parentPrecedence < left[1] && parentPrecedence < right[1];
		var d = parentPrecedence > left[1] && parentPrecedence > right[1];
		if (!a && !b && !c && !d){
			if (this.type != "id" && this.type != "function"){
				output = left[0] + valor + right[0]; 
			}
			if (this.type == "function"){
				output = valor + "(" + right[0] + ")";
			}
			if (this.type == "id"){
				output = valor + "[" + right[0] + "]";
			}
		}
		return [output,parentPrecedence];
	}
	/*La funcion map toma un token y devuelve su valor dentro de la sintaxis de Stokhos.*/
	map(token : string) : string {
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
			var mappedTo = this.mapping(); //que mapea cada uno de los tokens del lenguaje a su verdadero valor.
			nuevo = mappedTo.get(token);
		}
		else{
			nuevo = token;
		}
		return nuevo;
	}
  /*La funcion mapping genera una estructura de mapeo que puede ser utilizada para obtener los valores de los tokens que no son
  TkNumber o TkId.*/
  mapping() : Map<string,string>{
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
}
