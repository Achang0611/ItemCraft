import { load } from "./Loader";

export interface AttributeModifier {
    name: string;
    description: string;
    category: string;
    id: string;
    min: string;
    max: string;
}

export const attributeModifiers: AttributeModifier[] = await load(
    "/src/assets/attribute_modifiers.json"
);

export interface Opeartion {
    id: string;
    name: string;
}

export const operations: Opeartion[] = await load("/src/assets/operations.json");

export interface Slot {
    name: string;
    id: string;
    equivalent: string[];
}

export const slots: Slot[] = await load("/src/assets/slots.json");
