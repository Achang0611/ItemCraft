import { ref, type Ref } from "vue";

export const components: Ref<Record<string, () => string>> = ref({});

export function generate() {
    let arg = "";

    Object.entries(components.value).forEach(([key, generator]) => {
        const generated = generator();
        if (generated == "") {
            return;
        }

        arg += `${key}=${generated},`;
    });

    arg = `[${arg.slice(0, -1)}]`;

    return arg == "[]" ? "" : arg;
}
