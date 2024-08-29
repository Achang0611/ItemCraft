import { load } from "./Loader";

export interface Enchantment {
    id: string;
    name: string;
    category: string;
    maxLevel: number;
}

export const enchantments: Enchantment[] = await load("/src/assets/enchantments.json");

export const categories = Array.from(
    new Set(
        enchantments.map((ench) => {
            return ench.category;
        })
    )
).sort();
