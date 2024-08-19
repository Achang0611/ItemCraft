export interface Enchantment {
    id: string;
    name: string;
    category: string;
    maxLevel: number;
}

export const enchantments = (await fetch("src/assets/enchantments.json").then((res) =>
    res.json()
)) as Enchantment[];

export const categories = Array.from(
    new Set(
        enchantments.map((ench) => {
            return ench.category;
        })
    )
).sort();
