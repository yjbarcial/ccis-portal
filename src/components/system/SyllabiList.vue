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

  <v-row v-else>
    <v-col v-for="(syllabus, index) in syllabi" :key="index" cols="12" md="6" lg="4">
      <v-card>
        <v-card-title>{{ syllabus.descriptive_title }}</v-card-title>
        <v-card-subtitle>{{ syllabus.course_code }}</v-card-subtitle>
        <v-card-text>
          <p><strong>Academic Year:</strong> {{ syllabus.acad_year }}</p>
          <p><strong>Semester:</strong> {{ syllabus.semester }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="syllabus.file_url" target="_blank" color="orange-darken-3">View File</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
