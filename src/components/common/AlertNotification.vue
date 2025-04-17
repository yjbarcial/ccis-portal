<script setup>
const props = defineProps(['formSuccessMessage', 'formErrorMessage'])
</script>

<template>
  <!-- Alert Message: Success -->
  <v-alert
    v-if="props.formSuccessMessage"
    :text="props.formSuccessMessage"
    class="mb-4"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>

  <!-- Alert Message: Error -->
  <v-alert
    v-if="props.formErrorMessage"
    :text="props.formErrorMessage"
    class="mb-4"
    title="Oops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>
</template>
