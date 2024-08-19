import { useRoute } from "vue-router";

export function jsonQuery<T>(name: string, defo: T, failedCallback?: () => void): T {
    const json = useRoute().query[name];
    if (json == undefined) {
        failedCallback?.call(null);
        return defo;
    }

    return JSON.parse(json as string);
}
