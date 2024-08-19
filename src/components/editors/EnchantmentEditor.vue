<script lang="ts">
class EnchantInfo {
    enchantments: { [x: string]: number } = {};
    showInTooltip = true;
    enchantmentGlint = false;

    constructor() {
        enchantments.forEach((enchantment) => {
            this.enchantments[enchantment.id] = 0;
        });
    }
}
</script>

<script setup lang="ts">
import { components } from "@/libs/ComponentGenerator";
import { categories, enchantments, type Enchantment } from "@/libs/EnchantmentLoader";
import { jsonQuery } from "@/libs/Queries";
import { ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const enchantInfo: Ref<EnchantInfo> = ref(jsonQuery("enchantInfo", new EnchantInfo()));

const categoryToEnchantments: { [x: string]: Enchantment[] } = Object.fromEntries(
    categories.map((category) => {
        return [category, []];
    })
);
enchantments.forEach((enchantment) => {
    categoryToEnchantments[enchantment.category].push(enchantment);
});
Object.keys(categoryToEnchantments).forEach((category) => {
    categoryToEnchantments[category] = categoryToEnchantments[category].sort();
});

const route = useRoute();
const router = useRouter();

components.value["enchantments"] = () => {
    const reduced = Object.fromEntries(
        Object.entries(enchantInfo.value.enchantments).filter(([_, value]) => value != 0)
    );

    if (Object.keys(reduced).length == 0) {
        return "";
    }

    return JSON.stringify(reduced);
};
components.value["enchantment_glint_override"] = () => {
    var enchanted = components.value["enchantments"]() != "";
    if (enchanted == enchantInfo.value.enchantmentGlint) {
        return "";
    }

    return JSON.stringify(enchantInfo.value.enchantmentGlint);
};

var once = 0;
watch(
    () => enchantInfo.value.enchantments,
    () => {
        var enchanted = components.value["enchantments"]();
        if (!enchanted) {
            enchantInfo.value.enchantmentGlint = false;
            once = 0;
            return;
        }

        var enchantedLen = Object.keys(JSON.parse(enchanted)).length;
        if (enchantedLen == 1 && once == 0) {
            enchantInfo.value.enchantmentGlint = true;
            once = 1;
        }
    },
    { deep: true }
);

watch(
    enchantInfo,
    () => {
        router.push({
            query: {
                ...route.query,
                enchantInfo: JSON.stringify(enchantInfo.value)
            }
        });
    },
    { deep: true }
);

function clear() {
    enchantInfo.value = new EnchantInfo();
}
</script>

<template>
    <div class="flex size-full flex-col gap-2">
        <!-- Addition options -->
        <div class="grid grid-cols-3 justify-between gap-10 rounded border-2 border-black p-2">
            <label class="flex cursor-pointer justify-center rounded border-2 border-black p-2">
                <span class="mr-4 text-lg"> Show tooltip</span>
                <input type="checkbox" v-model="enchantInfo.showInTooltip" />
            </label>
            <label class="flex cursor-pointer justify-center rounded border-2 border-black p-2">
                <span class="mr-4 text-lg">Show glint</span>
                <input type="checkbox" v-model="enchantInfo.enchantmentGlint" />
            </label>

            <button class="rounded border-2 border-black p-2 text-lg" @click="clear">Clear</button>
        </div>
        <!-- Enchant -->
        <div class="flex flex-col overflow-auto rounded border-2 border-black p-2">
            <!-- Enchantments sorted by category -->
            <template v-for="(enchantments, category) in categoryToEnchantments" :key="category">
                <!-- Category label -->
                <p class="text-center text-2xl">{{ category }}</p>
                <!-- Enchantments -->
                <div
                    class="my-4 grid max-w-full grid-cols-4 justify-center gap-4 border-y border-black py-2"
                >
                    <div
                        class="flex justify-between rounded border-2 border-black p-2"
                        v-for="enchantment in enchantments"
                        :key="enchantment.id"
                    >
                        <span class="my-auto mr-2 text-center"
                            >{{ enchantment.name }} ({{ enchantment.maxLevel }})</span
                        >
                        <input
                            type="number"
                            min="0"
                            max="255"
                            @change="
                                () => {
                                    enchantInfo.enchantments[enchantment.id] = Math.max(
                                        Math.min(enchantInfo.enchantments[enchantment.id], 255),
                                        0
                                    );
                                }
                            "
                            v-model="enchantInfo.enchantments[enchantment.id]"
                            class="size-fit rounded border-2 border-black text-center text-lg"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
