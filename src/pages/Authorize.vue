<script setup>
import { ref } from "@vue/reactivity";
import { useAuthStore } from "@/stores/auth";
import { walletAvailable } from '@/utils/web3';
import router from "@/router";

const authStore = useAuthStore();

const inProgress = ref(false);

const attemptAuthorization = async () => {
    inProgress.value = true;

    await authStore.authorize();

    inProgress.value = false;

    router.push({ name: 'index' });
};
</script>

<template>
    <div class="h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-12 h-12 text-indigo-600 mx-auto">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
                Smart Lottery
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Authorize your wallet to get started.
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form class="space-y-6" method="POST" @submit.prevent="attemptAuthorization">
                    <div>
                        <button
                            :disabled="inProgress || !walletAvailable()"
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed">
                            Authorize wallet
                        </button>
                        <p
                            v-if="!walletAvailable()"
                            class="text-red-600 text-sm mt-2 font-semibold">
                            MetaMask browser extensions is required.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>