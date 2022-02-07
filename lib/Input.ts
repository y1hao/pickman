class Input {
    private _source: string;
    private _position: number;

    public get source() {
         return this._source;
    }

    public get position() {
        return this._position;
    }

    public get current() {
        if (this._position >= this._source.length) {
            throw new Error("Cannot read the current character because input has reached the end.");
        }
        return this._source[this._position];
    }

    public get isAtEnd() {
        return this._position >= this._source.length;
    }

    constructor(source: string, position: number) {
        this._source = source;
        this._position = position;
    }

    advance() {
        return new Input(this._source, this._position + 1);
    }
}

export default Input;