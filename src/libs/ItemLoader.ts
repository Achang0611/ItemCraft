export interface Item {
    id: string;
    name: string;
    path: string;
}

export const items = Object.keys(
    import.meta.glob("/src/assets/images/item_textures_1.21/*.png")
).map((path) => {
    const id = path.split("/").pop()?.split(".")[0]!;
    const item: Item = {
        id: id,
        name: id.split("_").join(" ")!,
        path: path
    };
    return item;
});

export function findItem(id: string) {
    return items.find((i) => i.id == id);
}
