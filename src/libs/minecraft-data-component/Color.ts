import { chatCodeColors, type ChatCodeColor } from "./ChatCode";

export enum Color {
    Black = "black",
    DarkBlue = "dark_blue",
    DarkGreen = "dark_green",
    DarkAqua = "dark_aqua",
    DarkRed = "dark_red",
    DarkPurple = "dark_purple",
    Gold = "gold",
    Gray = "gray",
    DarkGray = "dark_gray",
    Blue = "blue",
    Green = "green",
    Aqua = "aqua",
    Red = "red",
    LightPurple = "light_purple",
    Yellow = "yellow",
    White = "white"
}

export const hexCodes = [
    "000000",
    "0000AA",
    "00AA00",
    "00AAAA",
    "AA0000",
    "AA00AA",
    "FFAA00",
    "AAAAAA",
    "555555",
    "5555FF",
    "55FF55",
    "55FFFF",
    "FF5555",
    "FF55FF",
    "FFFF55",
    "FFFFFF"
];

export type HexCode = (typeof hexCodes)[number];

export interface ChatColor {
    color: Color;
    hex: HexCode;
    chat: ChatCodeColor;
}

const chatColors = (() => {
    const colors = Object.values(Color);
    const hexs = Object.values(hexCodes);
    const chats = Object.values(chatCodeColors);
    return colors.map((v, i) => {
        return { color: v, hex: hexs[i], chat: chats[i] } as ChatColor;
    });
})();

export function getChatColor(val: Color | HexCode | ChatCodeColor) {
    return chatColors
        .filter((chatColor) => {
            return Object.values(chatColor).some((colorVal) => {
                return colorVal == val;
            });
        })
        .pop();
}
