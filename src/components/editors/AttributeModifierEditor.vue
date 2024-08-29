<script lang="ts">
class ModifierInfo {
    type: string;
    slot: Record<string, boolean>;
    defaultId: string;
    id: string = "";
    amount: number = 0;
    operation: string = "add_value";

    constructor(type: string) {
        this.type = type;
        this.slot = Object.fromEntries(
            slots.map((slot) => {
                return [slot.id, false];
            })
        );
        this.defaultId = uuidv4();
    }
}

class AttributeInfo {
    attributeModifiers: ModifierInfo[] = [];
    showInTooltip: boolean = true;
}

function addModifier(info: AttributeInfo, type: string) {
    return info.attributeModifiers.push(new ModifierInfo(type));
}
</script>

<script setup lang="ts">
import { attributeModifiers, operations, slots } from "@/libs/asset-loader/AttributeModifierLoader";
import { components } from "@/libs/ComponentGenerator";
import { jsonQuery } from "@/libs/Queries";
import { v4 as uuidv4 } from "uuid";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

function setupModifier(index: number) {
    const modifier = attributeInfo.value.attributeModifiers[index];

    const equivalentCount: Record<string, number> = {};
    Object.keys(modifier.slot).forEach((slot) => {
        const equivalent = idToSlots[slot].equivalent;
        if (equivalent.length == 0) {
            return;
        }

        equivalentCount[slot] = 0;
        watch(
            () => modifier.slot[slot],
            (toggle) => {
                equivalent.forEach((equSlot) => {
                    if (toggle) {
                        modifier.slot[equSlot] = toggle;
                    } else {
                        if (equivalentCount[slot] == equivalent.length) {
                            modifier.slot[equSlot] = toggle;
                        }
                    }
                });
            }
        );
        equivalent.forEach((equSlot) => {
            if (modifier.slot[equSlot]) {
                equivalentCount[slot] += 1;
            }

            watch(
                () => modifier.slot[equSlot],
                (toggle) => {
                    equivalentCount[slot] += toggle ? 1 : -1;
                    modifier.slot[slot] = equivalentCount[slot] == equivalent.length;
                }
            );
        });
    });

    Object.keys(modifier.slot).forEach((slot) => {
        modifier.slot[slot] = true;
    });
}

function createModifier() {
    const index = addModifier(attributeInfo.value, attributeModifiers[0].id) - 1;
    setupModifier(index);
}

function deleteModifier(index: number) {
    attributeInfo.value.attributeModifiers.splice(index, 1);
}

const idToSlots = Object.fromEntries(
    slots.map((slot) => {
        return [slot.id, { name: slot.name, equivalent: slot.equivalent }];
    })
);

const attributeInfo = ref(jsonQuery("attributeInfo", new AttributeInfo()));
attributeInfo.value.attributeModifiers.forEach((_, index) => {
    setupModifier(index);
});

const route = useRoute();
const router = useRouter();

watch(
    attributeInfo,
    () => {
        router.push({
            query: {
                ...route.query,
                attributeInfo: JSON.stringify(attributeInfo.value)
            }
        });
    },
    { deep: true }
);

components.value["attribute_modifiers"] = () => {
    const expandedModifiers = attributeInfo.value.attributeModifiers
        .map((modifier) => {
            const removalSlots: string[] = [];
            Object.keys(modifier.slot).forEach((slot) => {
                if (!modifier.slot[slot]) {
                    return;
                }

                const equivalent = idToSlots[slot].equivalent;
                if (equivalent.length == 0) {
                    return;
                }

                equivalent.forEach((equSlot) => {
                    if (modifier.slot[equSlot]) {
                        removalSlots.push(equSlot);
                    }
                });
            });

            return Object.entries(modifier.slot)
                .filter(([_, toggle]) => toggle)
                .filter(([slot, _]) => !removalSlots.includes(slot))
                .map(([slot, _]) => {
                    const a: Record<string, string | number> = {
                        ...modifier,
                        id: modifier.id == "" ? modifier.defaultId : modifier.id,
                        slot: slot
                    };

                    delete a.defaultId;

                    return a;
                });
        })
        .filter((modifier) => modifier.length > 0)
        .flat();

    if (expandedModifiers.length == 0) {
        return "";
    }

    if (attributeInfo.value.showInTooltip) {
        return JSON.stringify(expandedModifiers);
    } else {
        return JSON.stringify({ modifiers: expandedModifiers, show_in_tooltip: false });
    }
};
</script>

<template>
    <div class="flex size-full flex-col">
        <label class="mb-2 flex cursor-pointer justify-center rounded border-2 border-black p-2">
            <span class="mr-4 text-lg"> Show tooltip</span>
            <input type="checkbox" v-model="attributeInfo.showInTooltip" />
        </label>
        <!-- Modifiers -->
        <div class="mb-2 flex h-full flex-col gap-2 overflow-auto">
            <template
                v-for="(modifierInfo, index) in attributeInfo.attributeModifiers"
                :key="modifierInfo"
            >
                <div class="mx-auto flex size-fit gap-2 rounded border-2 border-black p-2">
                    <!-- Modifier Info -->
                    <div class="grid grid-cols-4 gap-1 rounded border-2 border-black p-2">
                        <span class="my-auto text-center">ID</span>
                        <input
                            type="text"
                            class="col-span-3 rounded border-2 border-black text-center"
                            :placeholder="modifierInfo.defaultId"
                            v-model="modifierInfo.id"
                        />

                        <span class="my-auto text-center">Type</span>
                        <select
                            class="col-span-3 rounded border-2 border-black bg-white text-center"
                            v-model="modifierInfo.type"
                        >
                            <option
                                :value="modifier.id"
                                v-for="modifier in attributeModifiers"
                                :key="modifier.id"
                                :title="modifier.description"
                            >
                                {{ modifier.name }} ({{ modifier.category }})
                            </option>
                        </select>

                        <span class="my-auto text-center">Opeartion</span>
                        <select
                            class="col-span-3 rounded border-2 border-black bg-white text-center"
                            v-model="modifierInfo.operation"
                        >
                            <option
                                :value="operation.id"
                                v-for="operation in operations"
                                :key="operation.id"
                            >
                                {{ operation.name }}
                            </option>
                        </select>

                        <span class="my-auto text-center">Amount</span>
                        <input
                            type="number"
                            class="col-span-3 rounded border-2 border-black text-center"
                            v-model="modifierInfo.amount"
                        />
                    </div>
                    <!-- Slots -->
                    <div class="flex divide-x rounded border-2 border-black p-2">
                        <div
                            class="flex flex-col gap-1"
                            v-for="(slots, index) in [
                                ['any', 'body'],
                                ['armor', 'head', 'chest', 'legs', 'feet'],
                                ['hand', 'mainhand', 'offhand']
                            ]"
                            :key="index"
                        >
                            <label
                                v-for="name in slots"
                                :key="name"
                                class="flex justify-between p-1"
                            >
                                <span class="mr-3 text-lg">{{ idToSlots[name].name }}</span>
                                <input type="checkbox" v-model="modifierInfo.slot[name]" />
                            </label>
                        </div>
                    </div>
                    <!-- Delete Modifier -->
                    <button
                        class="rounded border-2 border-black p-2"
                        @click="deleteModifier(index)"
                    >
                        -
                    </button>
                </div>
            </template>
        </div>

        <!-- Add Modifier -->
        <button class="rounded border-2 border-black px-2" @click="createModifier">+</button>
    </div>
</template>
