import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import IndexPage from "@/pages/Index.vue";
import AuthorizePage from "@/pages/Authorize.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "index",
            component: IndexPage,
            meta: { auth: 'user' },
        },
        {
            path: "/authorize",
            name: "authorize",
            component: AuthorizePage,
            meta: { auth: 'guest' },
        },
    ],
});

router.beforeEach(async (to, from) => {
    if (Object.prototype.hasOwnProperty.call(to.meta, 'auth')) {
        const authType = to.meta.auth;
        const authStore = useAuthStore();

        if (
            authType === 'user' &&
            !authStore.loggedIn &&
            to.name !== 'authorize'
        ) {
            return { name: 'authorize' };
        }

        if (
            authType === 'guest' &&
            authStore.loggedIn
        ) {
            return { name: 'index' };
        }
    }
});

export default router;