<script setup lang="ts">
import { useStatsStore } from '@/stores/stats';

const store = useStatsStore();
</script>

<template>
    <div class="statistics">
        <h3>Parties jouées : {{ store.games }}</h3>
        <h3>Parties gagnées : {{ store.wins }} ({{ store.ratio }}%)</h3>
    </div>
</template>
