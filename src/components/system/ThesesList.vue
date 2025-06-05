<script setup>
import { onMounted, watch, ref } from 'vue'

const props = defineProps({
  theses: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const dialog = ref(false)
const selectedThesis = ref(null)

onMounted(() => {
  console.log('ThesesList mounted with theses:', props.theses)
})

watch(
  () => props.theses,
  (newTheses) => {
    console.log('ThesesList received new theses:', newTheses)
  },
  { deep: true },
)

const showThesisDetails = (thesis) => {
  selectedThesis.value = thesis
  dialog.value = true
}
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.clickable-title {
  cursor: pointer;
}

.clickable-title:hover {
  color: rgb(var(--v-theme-orange-darken-3));
}
</style>

<template>
  <div v-if="theses.length === 0" class="text-center pa-4">
    <v-alert type="info"> No theses found. Upload a thesis to get started. </v-alert>
  </div>

  <v-row v-else class="d-flex justify-center mx-auto" dense>
    <v-col
      v-for="(thesis, index) in theses"
      :key="index"
      cols="12"
      sm="10"
      md="6"
      lg="4"
      class="pa-3"
    >
      <v-card class="h-100 mx-auto" elevation="2" max-width="450">
        <v-card-title
          class="text-h6 text-wrap py-3 clickable-title"
          @click="showThesisDetails(thesis)"
        >
          {{ thesis.title }}
        </v-card-title>

        <v-card-text class="pt-0">
          <div class="d-flex align-center mb-2">
            <v-icon size="small" color="grey" class="me-2">mdi-calendar</v-icon>
            <span class="text-body-2 text-grey">{{ thesis.acad_year }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" class="me-2">mdi-domain</v-icon>
            <span class="text-body-2 text-grey">{{ thesis.department }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-row no-gutters>
            <v-col cols="12" class="d-flex justify-center mb-2">
              <v-btn
                :href="thesis.file_url_front_page"
                target="_blank"
                color="orange-darken-3"
                variant="tonal"
                class="w-100"
                prepend-icon="mdi-file-document"
              >
                Front Page
              </v-btn>
            </v-col>
            <v-col cols="6" class="pe-1">
              <v-btn
                :href="thesis.file_url_abstract"
                target="_blank"
                color="orange-darken-3"
                variant="tonal"
                class="w-100"
                prepend-icon="mdi-image"
              >
                Abstract
              </v-btn>
            </v-col>
            <v-col cols="6" class="ps-1">
              <v-btn
                :href="thesis.file_url_objectives"
                target="_blank"
                color="orange-darken-3"
                variant="tonal"
                class="w-100"
                prepend-icon="mdi-image"
              >
                Objectives
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <!-- Thesis Details Dialog -->
  <v-dialog v-model="dialog" max-width="800">
    <v-card v-if="selectedThesis">
      <v-card-title class="text-h5 pa-4 text-wrap">
        <div class="w-100">{{ selectedThesis.title }}</div>
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="text-subtitle-1 font-weight-bold mb-2">Abstract</div>
        <div class="text-body-1">{{ selectedThesis.abstract }}</div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="orange-darken-3" variant="text" @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
