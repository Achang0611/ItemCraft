export async function load<T>(path: string): Promise<T> {
    return (await fetch(path).then((res) => res.json())) as T;
}
