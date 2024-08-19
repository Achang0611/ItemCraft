import { ignore } from "../Ignore";
import { Color } from "./Color";

export class RawJsonText {
    text: string;
    color?: Color;
    bold: boolean = false;
    italic: boolean = true;
    underlined: boolean = false;
    strikethrough: boolean = false;
    obfuscated: boolean = false;

    constructor(text: string) {
        this.text = text;
    }
}

export namespace RawJsonText {
    export function toJson(rawJsonText: RawJsonText) {
        const defo = new RawJsonText("");
        const s = ignore(rawJsonText, defo, { pass: ["text"] })
            .reduce((acc, [key, value]) => {
                return `${acc},${key}:${JSON.stringify(value)}`;
            }, "")
            .slice(1);

        return JSON.stringify(`{${s}}`);
    }
}
