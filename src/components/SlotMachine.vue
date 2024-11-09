<script setup lang="ts">
import { ref } from 'vue';
import { useStatsStore } from '@/stores/stats';

const store = useStatsStore();

const playButton = ref<HTMLButtonElement | null>(null);
const slot1 = ref<HTMLLIElement | null>(null);
const slot2 = ref<HTMLLIElement | null>(null);
const slot3 = ref<HTMLLIElement | null>(null);
const slots = [slot1, slot2, slot3];

const newGame = async (): Promise<void> => {
    try {
        if (!playButton.value) throw new Error();

        playButton.value.disabled = true;

        store.addGame();
        const result: string[] = slots.map(() => getResult());

        const displayPromises = slots.map(async (slot, index) => {
            if (slot.value) {
                await new Promise((resolve) => setTimeout(resolve, 500 * index + 500));
                slot.value.textContent = result[index];
            } else throw new Error();
        });

        await Promise.all(displayPromises);

        if (checkResult(result)) {
            store.addWin();
            console.log('Gagné');
        } else {
            console.log('Perdu');
        }

        playButton.value.disabled = false;
    } catch (error) {
        console.error(error);
    }
};

const getResult = (): string => {
    return String(Math.floor(Math.random() * 9) + 1);
};

const checkResult = (results: string[]): boolean => {
    const numberMap = new Map<string, number>();

    for (const num of results) {
        const count = (numberMap.get(num) || 0) + 1;
        numberMap.set(num, count);

        if (count > 3) return false;
    }

    return Array.from(numberMap.values()).some((count) => count === 3);
};
</script>

<template>
    <div class="machine">
        <ul class="slots">
            <li ref="slot1">0</li>
            <li ref="slot2">0</li>
            <li ref="slot3">0</li>
        </ul>
        <button ref="playButton" @click="newGame">Jouer</button>
    </div>
</template>
