import { defineStore } from 'pinia';
import { getLotteryContract, getWeb3 } from "../utils/web3";
import { useAuthStore } from "./auth";
import { emitArray } from "../utils/events";

export const useLotteryStore = defineStore({
  id: 'lottery',
  state: () => ({
    players: [],
    prizePool: 0,
  }),
  actions: {
    async fetchPlayers() {
      const contract = await getLotteryContract().deployed();

      this.players = await contract.getParticipants();
    },
    async fetchPrizePool() {
      const contract = await getLotteryContract().deployed();

      this.prizePool = getWeb3().utils.fromWei(await contract.getPrizeValue(), 'ether');
    },
    async enter(slot) {
      try {
        const authStore = useAuthStore();

        const contract = await getLotteryContract().deployed();

        const { logs } = await contract.enter(slot, {from: authStore.account, value: getWeb3().utils.toWei('0.1', 'ether')})

        emitArray(logs);
      } catch (e) {
        return false;
      }

      return true;
    },
  },
});