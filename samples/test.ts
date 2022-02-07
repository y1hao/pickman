import Parser, { Char } from "../lib/index"

const parser = Parser.of<void>()
    .with(Char)
    .withMany(Char)
    .withMany(Char)
    .with(Char)
    .collect((a, b, c, d) => {
        console.log(a, b, c, d);
    });

parser.parse('12345')