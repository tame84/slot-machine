import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useStatsStore = defineStore(
    'stats',
    () => {
        const games = ref<number>(0);
        const wins = ref<number>(0);
        const ratio = computed(() => ((wins.value / games.value) * 100).toFixed(2) || 0);
        function addGame(): void {
            games.value++;
        }
        function addWin(): void {
            wins.value++;
        }

        return { wins, games, ratio, addGame, addWin };
    },
    { persist: true }
);
