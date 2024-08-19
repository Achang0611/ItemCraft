import ItemEditor from "@/components/ItemEditor.vue";
import ItemSelector from "@/components/ItemSelector.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", name: "home", component: ItemSelector },
    { path: "/edit", name: "edit", component: ItemEditor }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
