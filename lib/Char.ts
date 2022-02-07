import { IParser } from "./Parser";
import Input from "./Input";
import Result, { isSuccessful } from "./Result";

class CharParser implements IParser<string> {    
    parse(input: string) {
        const r = this._parseInternal(new Input(input, 0));
        if (isSuccessful(r)) {
            return r.value;
        }
        throw new Error(r.message);
    }

    _parseInternal(input: Input): Result<string> {
        if (input.isAtEnd) {
            return {
                isSuccessful: false,
                message: 'Unexpected end of input',
                remainder: input
            }
        }
        return {
            isSuccessful: true,
            value: input.current,
            remainder: input.advance()
        }
    }
}

const Char = new CharParser();

export default Char;