<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  syllabi: {
    type: Array,
    required: true,
    default: () => [],
  },
})

onMounted(() => {
  console.log('SyllabiList mounted with syllabi:', props.syllabi)
})

watch(
  () => props.syllabi,
  (newSyllabi) => {
    console.log('SyllabiList received new syllabi:', newSyllabi)
  },
  { deep: true },
)
</script>

<template>
  <div v-if="syllabi.length === 0" class="text-center pa-4">
    <v-alert type="info"> No syllabi found. Upload a syllabus to get started. </v-alert>
  </div>

  <v-row v-else class="d-flex justify-center" dense>
    <v-col
      v-for="(syllabus, index) in syllabi"
      :key="index"
      cols="12"
      sm="10"
      md="6"
      lg="4"
      class="pa-2"
    >
      <v-card class="h-100 mx-auto" elevation="2" max-width="400">
        <v-card-title class="text-h6 text-wrap py-3">{{ syllabus.descriptive_title }}</v-card-title>
        <v-card-subtitle class="text-subtitle-1">{{ syllabus.course_code }}</v-card-subtitle>
        <v-card-text class="pt-0">
          <div class="d-flex align-center mb-2">
            <v-icon size="small" color="grey" class="me-2">mdi-calendar</v-icon>
            <span class="text-body-2 text-grey">{{ syllabus.acad_year }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" class="me-2">mdi-school</v-icon>
            <span class="text-body-2 text-grey">{{ syllabus.semester }}</span>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-btn
            :href="syllabus.file_url"
            target="_blank"
            color="orange-darken-3"
            variant="tonal"
            class="w-100"
            prepend-icon="mdi-file-document"
          >
            View File
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
