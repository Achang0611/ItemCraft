<script lang="ts">
type TargetSelector = "@p" | "@r" | "@a" | "@e" | "@s" | "player";

export class BasicItemInfo {
    item: Item;
    amount: number = 1;
    targetSelector: TargetSelector = "@p";
    playerName: string = "Achang_0611";

    constructor(item: Item) {
        this.item = item;
    }
}
</script>

<script setup lang="ts">
import { components, generate } from "@/libs/ComponentGenerator";
import { items, type Item } from "@/libs/ItemLoader";
import { jsonQuery } from "@/libs/Queries";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import EnchantmentEditor from "./editors/EnchantmentEditor.vue";
import InfoEditor from "./editors/InfoEditor.vue";

const route = useRoute();
watch(() => route.query, updateCommand);

const basicItemInfo = ref(
    jsonQuery("basicItemInfo", new BasicItemInfo(items[0]), () => {
        useRouter().push({ name: "home" });
    })
);

watch(basicItemInfo, updateCommand, { deep: true });

const command = ref("");
function updateCommand() {
    const target =
        basicItemInfo.value.targetSelector != "player"
            ? basicItemInfo.value.targetSelector
            : basicItemInfo.value.playerName;
    var components = generate();
    command.value = `/give ${target} ${basicItemInfo.value.item.id}${components} ${basicItemInfo.value.amount}`;
}
updateCommand();

watch(components, updateCommand, { deep: true });

function copyOnClick() {
    navigator.clipboard.writeText(command.value);
}

function playerNameChange() {
    if (basicItemInfo.value.playerName == "") {
        basicItemInfo.value.playerName = "Achang_0611";
    }
}

const editors: { [x: string]: any } = { Info: InfoEditor, Enchantment: EnchantmentEditor };
const currentEditor = ref(`Info`);
</script>

<template>
    <div class="container mx-auto h-screen p-10">
        <div class="grid h-full grid-rows-12 gap-y-2">
            <!-- Item and command arguments -->
            <div class="row-span-1 grid grid-flow-row grid-cols-12 gap-2">
                <!-- Item display, amount, target, player name(optional) -->
                <RouterLink
                    :to="{ name: 'home' }"
                    class="col-span-1 m-auto flex size-fit justify-self-center rounded border-4 border-black p-2 hover:bg-gray-500"
                >
                    <img :src="basicItemInfo.item.path" alt="Editing item" />
                </RouterLink>
                <div
                    class="col-span-11 m-auto grid h-1/3 w-full grid-flow-col justify-stretch gap-3"
                >
                    <input
                        type="number"
                        v-model="basicItemInfo.amount"
                        min="1"
                        max="64"
                        class="rounded-lg border-2 border-black text-center"
                    />
                    <select
                        name="target"
                        id="target"
                        class="rounded-lg border-2 border-black bg-white text-center"
                        v-model="basicItemInfo.targetSelector"
                    >
                        <option value="@p">Nearest player</option>
                        <option value="@r">Random player</option>
                        <option value="@a">All players</option>
                        <option value="@e">All entities</option>
                        <option value="@s">Executor</option>
                        <option value="player">Player</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Player name"
                        :disabled="basicItemInfo.targetSelector != 'player'"
                        class="rounded-lg border-2 border-black text-center disabled:bg-gray-300"
                        id="player-name"
                        v-model="basicItemInfo.playerName"
                        @change="playerNameChange"
                    />
                </div>
            </div>
            <!-- All editors -->
            <div class="container row-span-10 mx-auto flex flex-col">
                <!-- Tab bar -->
                <div class="container mx-auto flex gap-1">
                    <button
                        class="rounded-t border-x-2 border-t-2 border-black p-1 text-lg hover:bg-gray-500"
                        :class="[{ 'bg-black text-white': currentEditor == editor }]"
                        :key="editor"
                        v-for="(_, editor) in editors"
                        @click="currentEditor = editor.toString()"
                    >
                        {{ editor }}
                    </button>
                </div>
                <!-- Editor -->
                <div class="flex-grow overflow-hidden">
                    <component
                        :is="editors[currentEditor]"
                        class="rounded-b border-2 border-black p-2"
                    />
                </div>
            </div>
            <!-- Generated command -->
            <div
                class="group container relative row-span-1 mx-auto flex justify-center overflow-auto border-2"
            >
                <p class="invisible absolute inset-y-0 content-center group-hover:visible">
                    Click to copy
                </p>
                <p
                    class="size-full cursor-text select-all group-hover:blur-sm"
                    @click="copyOnClick"
                >
                    {{ command }}
                </p>
            </div>
        </div>
    </div>
</template>
