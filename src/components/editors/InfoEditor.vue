<script lang="ts">
export class Info {
    customName: RawJsonText = new RawJsonText("");
    lore: RawJsonText[] = [];
}
</script>

<script setup lang="ts">
import { components } from "@/libs/ComponentGenerator";
import { RawJsonText } from "@/libs/minecraft-data-component/RawJsonText";
import { jsonQuery } from "@/libs/Queries";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const info = ref(jsonQuery("info", new Info()));

function update() {
    router.push({
        query: {
            ...route.query,
            info: JSON.stringify(info.value)
        }
    });
}

watch(info, update, { deep: true });

const loreInput = ref(
    (() => {
        return info.value.lore
            .reduce((acc, line) => {
                return `${acc}${line.text}\n`;
            }, "")
            .slice(0, -1);
    })()
);
watch(loreInput, (lines) => {
    if (lines == "") {
        info.value.lore = [];
    }

    info.value.lore = lines.split("\n").map((line) => {
        return new RawJsonText(line);
    });
});

components.value["custom_name"] = () => {
    if (info.value.customName.text == "") {
        return "";
    }

    return RawJsonText.toJson(info.value.customName);
};
components.value["lore"] = () => {
    if (info.value.lore.length == 0) {
        return "";
    }

    const loreStr = info.value.lore
        .map((line) => {
            return RawJsonText.toJson(line);
        })
        .join(",");
    return `[${loreStr}]`;
};
</script>

<template>
    <div class="flex size-full flex-col">
        <!-- Custom name -->
        <div class="mt-2">
            <input
                type="text"
                placeholder="Custom name"
                class="w-full rounded border-2 border-black p-2"
                v-model="info.customName.text"
            />
        </div>
        <!-- Lore -->
        <div class="mt-2 size-full rounded border-2 border-black">
            <textarea
                name="lore"
                id="lore"
                class="size-full resize-none text-nowrap border-0 p-2"
                v-model="loreInput"
                placeholder="Lore"
            ></textarea>
        </div>
    </div>
</template>
