<script setup lang="ts">
import { items, type Item } from "@/libs/asset-loader/ItemLoader";
import Fuse from "fuse.js";
import { ref, watch } from "vue";
import { BasicItemInfo } from "./ItemEditor.vue";

const searchOptions = {
    keys: ["name"]
};
const searchHelper = new Fuse(items, searchOptions);
const search = ref("");
watch(search, (value) => {
    if (value == "") {
        filteredItems.value = items;
    } else {
        filteredItems.value = searchHelper.search(value).map((e) => e.item);
    }
});
const filteredItems = ref(items);

function makeItem(item: Item) {
    return new BasicItemInfo(item);
}
</script>

<template>
    <!-- Search bar -->
    <div class="container mx-auto mt-2 flex justify-center rounded border-2 border-black p-2">
        <input
            type="text"
            class="size-3/4 rounded border-2 border-black p-2 text-3xl"
            placeholder="Diamond"
            v-model="search"
        />
    </div>
    <!-- Items -->
    <div
        class="container m-2 mx-auto flex flex-row flex-wrap justify-center rounded border-2 border-black p-2"
    >
        <template v-for="item in filteredItems" :key="item">
            <div class="group m-2 rounded-lg border-4 border-black p-2 hover:bg-gray-500">
                <span
                    class="invisible absolute -mt-6 ml-10 rounded bg-black p-2 text-lg capitalize text-white shadow group-hover:visible"
                >
                    {{ item.name }}
                </span>
                <RouterLink
                    :to="{
                        name: 'edit',
                        query: { basicItemInfo: JSON.stringify(makeItem(item)) }
                    }"
                >
                    <img :src="item.path" :alt="item.id" />
                </RouterLink>
            </div>
        </template>
    </div>
</template>
