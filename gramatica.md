# Gramática de STÓKHOS
Esta es la gramática utilizada en nuestra implementación del lenguaje Stókhos. Se asume que los operadores son asociativos a izquierda
y el símbolo * representa una regla de la gramática que puede ser utilizada 0 o más veces.

	<input> -> <grammar> <semicolon>
	<instruction> -> <definition> | <assign> | <array> | <exp>
	<definition> -> <type> <id> <assignSymbol> <exp>
	<assign> -> <id> <assignSymbol> <exp>
	<array> -> <OpenBracket> <type> <CloseBracket> <id> <assignSymbol> <OpenBracket> <termino> <CloseBracket>

	<unary> -> <plus> | <minus> | <not>
	<terms> -> <number> | <boolean> | <id> | <lambda>

	<exp> -> <e1>
	<e1> -> <e2> (<and>|<or>)*          | <e2>
	<e2> -> <e3> (<eq> |<ne>)*          | <e3>
	<e3> -> <e4> (<lt>|<le>|<ge>|<gt>)* | <e4>
	<e4> -> <e5> (<plus>|<minus>)*      | <e5>
	<e5> -> <e6> (<mult>|<div>|<mod>)*  | <e6>
	<e6> -> <unary>* <e7>               | <e7>
	<e7> -> <e8> (<power>)*             | <e8>  
	<e8> -> <OpenPar> <exp> <ClosePar> | <OpenBracket> <exp> <CloseBracket> | <OpenBrace> <exp> <CloseBrace> | <quote> <exp> <quote> | <terms>
	<termino> -> <exp> <comma> <exp> | <exp>  

	<semicolon>    -> '\;'
	<assignSymbol> -> '\:='
	<type>         -> <num> | <bool>
	<num>          -> 'num'
	<bool>         -> 'bool'
	<id>           -> '\b([a-zA-Z_][^\s\W]*)'
	<OpenBracket>  -> '\['
	<CloseBracket> -> '\]'
	<OpenPar>      -> '\('
	<ClosePar>     -> '\)'
	<quote>        -> '\''
	<power>        -> '\^'
	<plus>         -> '\+'
	<minus>        -> '\-'
	<comma>        -> '\,'
	<not>          -> '\!'
	<number>       -> '\([0-9]+\)'
	<boolean>      -> 'false' | 'true'
	<lambda>       -> ' '
	<lt>           -> '\<'
	<le>           -> '\<='
	<ge>           -> '\>='
	<gt>           -> '\>'
	<mult>         -> '\*'
	<div>          -> '\/'
	<mod>          -> '\%'
	<and>          -> '\&&'
	<or>           -> '\||'
	<eq>           -> '\='
	<ne>           -> '\<>'