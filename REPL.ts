import {VM} from "./VM";

/*La clase REPL implementa un REPL para el lenguaje Stokhos y tiene como entrada al inicializarse una maquina virtual que manejara
el lenguaje y realiza todas las operaciones relacionadas con el lenguaje. Esta clase contiene un arreglo global que sera utilizado
para guardar los errores de la lectura de archivos con la funcion .load de Stokhos.*/
export class REPL {
  errores : Array<Array<string>>;
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  VM_ : VM;
  constructor(VM_ : VM) {
    this.errores = [];
    this.VM_ = VM_;
  }
  /*La funcion newLine es la funcion principal del REPL, en ella se realizan las verificaciones de los strings insertados por el 
  usuario en la consola y decide si llamar a la VM o manejarlos dentro de ella misma. Se llama a esta funcion de manera recursiva, ya que,
  genera una nueva linea del REPL con cada llamada.*/
  newLine() {
    this.readline.question('<Stokhos> ', entrada => {
    var re = /.lex/gi;
    var re1 = /.load/gi;
    var re2 = /.failed/gi;
    var re3 = /.reset/gi;
    var re4 = /.ast/gi;
    if (entrada == " " || entrada == ""){
      this.newLine();
    }
    if (entrada == "."){
      this.readline.input.destroy();
    }
    if (entrada.search(re) == 0){
      var instruccion = entrada.replace(re,"");
      var retorna1 : Array<string> = this.VM_.lextest(instruccion,0);
      if (retorna1[0] == "newLine"){
        this.newLine();
      }
    }
    if (entrada.search(re1) == 0){
      var name = entrada.replace(re1,"");
      var fileName = name.replace(" ","");
      var retorna : [string, Array<Array<string>>] = this.VM_.leerArchivo(fileName,0);
      if (retorna[0] == "newLine"){
        this.newLine();
      }
      this.errores = this.errores.concat(retorna[1]);
    }
    if (entrada.search(re2) == 0){
      this.imprimirErrores();
    }
    if (entrada.search(re3) == 0){
      this.eliminarErrores();
    }
    if (entrada.search(re4) == 0){
      var line = entrada.replace(re4,"");
      this.VM_.testParser(line);
      this.newLine();
    }
    else{
      var a = entrada.search(re);
      var b = entrada.search(re1);
      var c = entrada.search(re2);
      var d = entrada.search(re3);
      var e = entrada.search(re4);
      if (entrada != "." && entrada != "" && entrada != " " && a != 0 && b != 0 && c != 0 && d != 0 && e !=0){
        if (a > 0 || b > 0 || c > 0 || d > 0){
          this.printInvalid(a,entrada); 
          this.printInvalid(b,entrada);
          this.printInvalid(c,entrada);
          this.printInvalid(d,entrada);
          this.printInvalid(e,entrada);
        }
        else{
          this.VM_.process();
        }
        this.newLine();
      }
    }
    });
  }
  /*La funcion printInvalid muestra por consola un error si el string introducido es incorrecto y solo se muestra al usuario el 
  substring desde la posicion en que es correcto.*/
  printInvalid(a : number,entrada : string){
    if (a>0){
      console.log("ERROR: Caracter invalido ('" + entrada.substr(0,a) + "') en la entrada");
    }
  }
  /*La funcion imprimirErrores es llamada por la funcion .failed y muestra en consola los errores de lectura de un archivo.*/
  imprimirErrores(){
    console.log(this.errores);
    this.newLine();
  }
  /*La funcion eliminarErrores es llamada por la funcion .reset y inicializa el arreglo de errores como un arreglo vacio.*/
  eliminarErrores(){
    this.errores = [];
    this.newLine();
  }
}