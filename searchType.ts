import {HashTable, Symbol} from "./hashtable.js"
import {map, mapping} from "./mappingFunctions.js"

/*La funcion searchType busca el tipo de una variable a ser asignada y en caso de ser un arreglo lo retorna.*/
export function searchType(ASTtree : any, symbolTable : HashTable) : string {
	var type = ASTtree.ast.start.kind; 
	var output = type;
	if (type == "assign"){
    	var assignId = ASTtree.ast.start.id.value;
    	var result = symbolTable.search(map(assignId));
    	if (result[0]!=false){
    		if (result[1].AST.ast.start.kind == "array"){
    			output = "array";
    		}
    	}
    }
    return output;
}