function ignoreFullOptions<T extends { [x: string]: any }>(
    target: T,
    defo: T,
    options: { allowedNull: boolean; pass: (keyof T)[] }
) {
    return Object.entries(target).filter(([key, value]) => {
        return (
            (value != defo[key] && (value != undefined || options.allowedNull)) ||
            options.pass.includes(key)
        );
    });
}

export function ignore<T extends { [x: string]: any }>(
    target: T,
    defo: T,
    options?: { allowedNull?: boolean; pass?: (keyof T)[] }
) {
    const fullOptions = {
        allowedNull: options?.allowedNull ?? false,
        pass: options?.pass ?? []
    };
    return ignoreFullOptions(target, defo, fullOptions);
}
