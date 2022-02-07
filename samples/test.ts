import Parser, { Char, Letter, Not, Space } from "../lib/index"

const input = "My name is #{Yihao | Upper}. I am a #{ Developer|Lower }."

type Person = {
    name: string,
    title: string
};

const pipeFuncs = new Map([
    ["upper", (s: string) => s.toUpperCase()],
    ["lower", (s: string) => s.toLowerCase()]
])

const wordParser = Parser.of<string>()
    .withMany(Letter)
    .collect((chars) => chars.join(''));

const funcParser = Parser.of<(s: string) => string>()
    .with(wordParser)
    .collect((name) => pipeFuncs.get(name.toLowerCase())!)

const templateParser = Parser.of<string>()
    .with(Char('{')).withOptional(Space)
    .with(wordParser).withOptional(Space)
    .with(Char('|')).withOptional(Space)
    .with(funcParser).withOptional(Space)
    .with(Char('}'))
    .collect((openBrace, space1, word, space2, space3, space4, func) => func(word));

const until = (c: string) => Parser.of<string>()
    .withMany(Not(c))
    .with(Char(c))
    .collect((chars) => chars.join(''));

const parser = Parser.of<Person>()
    .with(until('#'))
    .with(templateParser)
    .with(until('#'))
    .with(templateParser)
    .collect((_, name, __,  title) => ({
        name: name,
        title: title
    }));

const me = parser.parse(input);

console.log(me);