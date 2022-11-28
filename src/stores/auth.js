import { defineStore } from 'pinia';
import { authorize } from "../utils/web3";

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        account: null,
    }),
    getters: {
        loggedIn: (state) => state.account !== null,
    },
    actions: {
        async authorize() {
            const wallets = await authorize();

            if (!wallets) {
                return;
            }

            this.account = wallets[0];
        }
    },
});