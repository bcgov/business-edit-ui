<template>
  <section class="mt-5" :id="id">
    <header>
      <h2>{{ title }}</h2>
      <p v-if="subtitle" class="pt-2">{{ subtitle }}</p>
      <p v-if="comment" class="black--text mb-0">{{ comment }}</p>
    </header>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'QuestionWrapper',
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
#question_container {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

#question_container h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
