<script setup>
import { useLotteryStore } from "@/stores/lottery";
import { ref } from "@vue/reactivity";
import { lottery } from "@/utils/events";
import { useAuthStore } from "@/stores/auth";
import Swal from 'sweetalert2';
import { getWeb3 } from "../utils/web3";
import { computed } from "vue";

const lotteryStore = useLotteryStore();
const authStore = useAuthStore();

const loadData = () => {
  lotteryStore.fetchPlayers();
  lotteryStore.fetchPrizePool();
};

loadData();

const slotId = ref(null);
const inProgress = ref(false);
const hasError = ref(false);

const enter = async () => {
  inProgress.value = true;

  const response = await lotteryStore.enter(slotId.value);

  hasError.value = !response;

  inProgress.value = false;

  loadData();
};

lottery.on('WinnerSelected', (event) => {
  const winner = event.args.winner;
  const prize = getWeb3().utils.fromWei(event.args.prize.toString(), 'ether');

  if (authStore.account.toLowerCase() === winner.toLowerCase()) {
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: `You have won ${prize} ETH.`,
      confirmButtonText: 'Woooho 🥳 🎉',
    });
  }
});

const players = computed(() => {
  return lotteryStore.players.map((player) => {
    return (player !== '0x0000000000000000000000000000000000000000')
      ? player
      : 'Empty';
  });
});
</script>

<template>
  <div class="h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
           stroke="currentColor" class="w-12 h-12 text-indigo-600 mx-auto">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
      <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
        Smart Lottery
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="grid grid-cols-2">
          <div class="p-4">
            <h4 class="text-lg font-semibold text-gray-900">
              Current players
            </h4>
            <p class="text-sm">Prize pool: {{ lotteryStore.prizePool }} ETH</p>
            <ul>
              <li
                v-for="(player, slot) in players"
                :key="`player-${slot}`"
                class="text-xs">
                Slot <span class="font-semibold">{{ slot }}</span>: <span class="font-semibold text-[0.625rem]">{{ player }}</span>
              </li>
            </ul>
          </div>
          <div class="p-4">
            <div class="mt-1 mb-2">
              <input
                type="number"
                min="0"
                v-model="slotId"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                :class="{ 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500': hasError }"
                placeholder="Enter selected slot">
              <p v-if="hasError" class="text-sm text-red-600">Invalid slot number.</p>
            </div>
            <button
              :disabled="inProgress"
              @click="enter"
              type="button"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed">
              Place a bet
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>