import { change } from "./changeAST.js"
import { e1 } from "./parser2";

/*La clase HashTable es la estructura que sera utilizada para la elaboracion de la tabla de simbolos del lenguaje. 
Consiste de un arreglo bidimensional de Symbol, una estructura que puede ser utilizada para alojar la informacion de cada
una de las variables definidas por el usuario.*/
export class HashTable {
	list : Array<Array<Symbol>>;
	constructor(){
		this.list = [...Array(100)].map(x => []);
	}
	copy() : HashTable {
		var newHashTable : HashTable = new HashTable();
		var lista = [...Array(100)].map(x => []);
		newHashTable.list = this.list;
		return newHashTable;
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
		return [false,new Symbol("","","","",0)];
	}
	/*La funcion modify modifica una variable dentro de la tabla de simbolos. Se busca la variable y se actualizan sus valores de
	identifier, value,number, type, array (en caso de ser un arreglo), AST y ciclo en el que fue modificada.*/
	modify(variable : string, newVal : string,type:string,array : Array<string>, newAST: any,cycle:number) {
		var key = this.h(variable);
		for (var i = 0; i < this.list[key].length; i++) {
			if (this.list[key][i].identifier == variable){
				this.list[key][i].value = newVal;
				this.list[key][i].type = type;
				this.list[key][i].AST = newAST;
				this.list[key][i].cycle = cycle;
				if (this.list[key][i].array != undefined){
					this.list[key][i].array = array;
					this.list[key][i].arrayCycle = [...Array(array.length)].map(x => cycle);
				}
			}
		}
	}
	/*La funcion modifyArray modifica la posicion de un arreglo, actualiza su valor en el AST y el numero de ciclo en el que fue modificado.*/
	modifyArray(variable : string, pos : number, newVal : any, neweAtPos : e1, cycle : number){
		var key = this.h(variable);
		for (var i = 0; i < this.list[key].length; i++) {
			if (this.list[key][i].identifier == variable){
				this.list[key][i].array[pos] = newVal;
				this.list[key][i].AST = change(this.list[key][i].AST,pos,newVal,neweAtPos);
				this.list[key][i].arrayCycle[pos] = cycle;
				break;
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
/*La clase Symbol representa una variable que se agrega a la tabla de simbolos como tabla de hash. Los atributos de esta clase son:
	identifier : Nombre de la variable
	value      : Valor actual de la variable o rvalue
	type       : Tipo de la variable
	array      : Arreglo de strings con el valor de la variable
	cycle      : Ciclo en el que fue modificada la variable
	arrayCycle : Arreglo de numeros que indica el ciclo en el que se modificaron
	AST        : Arbol sintactico abstracto asociado a la variable.
*/
export class Symbol{
	identifier : string;
	value : string;
	type : any;
	array : Array<string>;
	cycle : number;
	arrayCycle : Array<number>;
	AST : any;
	constructor(ID: string, val : any, type: any, tree : any, cycle : number){
		this.identifier = ID;
		this.value = val;
		this.type = type;
		this.AST = tree;
		this.cycle = cycle;
	}
}