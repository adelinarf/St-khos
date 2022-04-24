import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";

/*La funcion changeNow modifica el objeto de un AST para incluir un nuevo elemento dentro de un arreglo.*/
function changeNow(object : e1,pos:number, newVal : any){
	var expr = object.e.e.e.e.e.e.e;
	if (expr.kind == "e8_2"){
    	if (expr.value!=undefined){
    		if (pos == 0){ //Si es la posicion 0, entonces se ubica en expr.value.e.e
    			expr.value.e.e = newVal;
    		}
    		else{ //A partir de la posicion 1 se encuentran en el arreglo b
    			expr.value.b[pos-1].e.e = newVal;
    		}
    	}
    }
}

/*La funcion change toma un AST, una posicion de un arreglo, su valor y un nuevo objeto y lo reemplaza por el objeto en la posicion
actual del arreglo.*/
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
        	changeNow(ASTtree.ast.start.e.e,pos,newE);
        }
    }
    return ASTtree;
}