<script setup lang="ts">
import SlotMachine from '@/components/SlotMachine.vue';
import { useStatsStore } from '@/stores/stats';

const store = useStatsStore();
</script>

<template>
    <h3>Parties gagnées : {{ store.wins }}</h3>
    <br />
    <h3>Ratio : {{ store.ratio }} %</h3>
    <SlotMachine />
</template>
