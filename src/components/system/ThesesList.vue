<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" lg="4" v-for="(item, index) in items" :key="index">
      <v-card class="mb-4" elevation="2">
        <v-card-title class="font-weight-medium">
          {{ item.title }}
        </v-card-title>
        <v-card-subtitle>{{ item.acad_year }} • {{ item.semester }}</v-card-subtitle>
        <v-card-actions>
          <v-btn icon :href="item.file_url_abstract" target="_blank" variant="text">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col v-if="items.length === 0">
      <v-alert type="info" border="start" colored-border>
        No theses match your filters.
      </v-alert>
    </v-col>
  </v-row>
</template>
