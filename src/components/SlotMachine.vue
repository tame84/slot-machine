<script setup lang="ts">
import { ref } from 'vue';
import { useStatsStore } from '@/stores/stats';

const store = useStatsStore();

const playButton = ref<HTMLButtonElement | null>(null);
const slot1 = ref<HTMLLIElement | null>(null);
const slot2 = ref<HTMLLIElement | null>(null);
const slot3 = ref<HTMLLIElement | null>(null);
const slots = [slot1, slot2, slot3];

const slot1Value = ref('0');
const slot2Value = ref('0');
const slot3Value = ref('0');
const slotValues = [slot1Value, slot2Value, slot3Value];

const resultMessage = ref<string | null>(null);
const isSpinning = ref(false);

const spinSlot = async (slotRef: HTMLElement, finalValue: string, delay: number): Promise<void> => {
    console.log(finalValue);

    const slotNumbers = slotRef.querySelector('.slot-numbers');
    if (!slotNumbers) return;

    slotNumbers.classList.add('spinning');

    await new Promise((resolve) => setTimeout(resolve, delay));

    slotNumbers.classList.remove('spinning');
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = slots.findIndex((slot) => slot.value === slotRef);
            if (index != -1) {
                slotValues[index].value = finalValue;
            }
            resolve();
        }, 100);
    });
};

const newGame = async (): Promise<void> => {
    try {
        if (!playButton.value) throw new Error();

        isSpinning.value = true;
        resultMessage.value = null;

        const result: string[] = slots.map(() => getResult());

        const spinPromises = slots.map(async (slot, index) => {
            if (slot.value) {
                return spinSlot(slot.value, result[index], 1000 + index * 500);
            }
            return Promise.reject(new Error('Slot non trouvé.'));
        });

        await Promise.all(spinPromises);

        if (checkResult(result)) {
            store.addWin();
            resultMessage.value = 'Gagné !';
        } else {
            resultMessage.value = 'Perdu, peut-être une prochaine fois.';
        }

        store.addGame();
    } catch (error) {
        console.error(error);
    } finally {
        isSpinning.value = false;
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
    <div style="position: relative">
        <div class="machine">
            <ul class="slots">
                <li ref="slot1" class="slot">
                    <div class="slot-numbers">
                        <span v-for="n in 9" :key="n">{{ n }}</span>
                        <span class="single-result">{{ slot1Value }}</span>
                    </div>
                </li>
                <li ref="slot2" class="slot">
                    <div class="slot-numbers">
                        <span v-for="n in 9" :key="n">{{ n }}</span>
                        <span class="single-result">{{ slot2Value }}</span>
                    </div>
                </li>
                <li ref="slot3" class="slot">
                    <div class="slot-numbers">
                        <span v-for="n in 9" :key="n">{{ n }}</span>
                        <span class="single-result">{{ slot3Value }}</span>
                    </div>
                </li>
            </ul>
            <button ref="playButton" @click="newGame" :disabled="isSpinning">Jouer</button>
        </div>
        <p v-if="resultMessage" class="result-message">{{ resultMessage }}</p>
    </div>
</template>

<style scoped>
.machine {
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 1rem;
}
.slots {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
}
.slot {
    width: 80px;
    height: 100px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
}
.slot-numbers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    transition: transform 0.1s ease-out;
}
.slot-numbers span {
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #bebebe;
}
.spinning {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-1000px);
    }
}
button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.3s;
}
button:disabled {
    background: #ccc;
    cursor: not-allowed;
}
button:hover:not(:disabled) {
    background: #45a049;
}
p {
    font-size: 1.2rem;
    margin-top: 1rem;
    font-weight: bold;
}
.result-message {
    position: absolute;
    left: 0;
}
</style>
