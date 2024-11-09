import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useStatsStore = defineStore(
    'stats',
    () => {
        const games = ref(0);
        const wins = ref(0);
        const ratio = computed(() => wins.value / games.value || 0);
        function addGame() {
            games.value++;
        }
        function addWin() {
            wins.value++;
        }

        return { wins, games, ratio, addGame, addWin };
    },
    { persist: true }
);
