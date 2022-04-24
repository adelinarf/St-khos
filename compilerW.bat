cmd /c tspeg gramatica.peg parser.ts
cmd /c tspeg parserGrammar.peg parser2.ts
cmd /c tsc -p tsconfig.json
PAUSE