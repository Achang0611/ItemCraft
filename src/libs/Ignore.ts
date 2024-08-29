function ignoreFullOptions<T extends Record<string, any>>(
    target: T,
    defo: T,
    options: { allowedNull: boolean; pass: (keyof T)[] }
) {
    return Object.entries(target).filter(([key, value]) => {
        if (options.pass.includes(key)) {
            return true;
        }

        if (value == undefined) {
            return defo[key] == undefined && options.allowedNull;
        }

        return JSON.stringify(value) != JSON.stringify(defo[key]);
    });
}

export function ignore<T extends Record<string, any>>(
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
