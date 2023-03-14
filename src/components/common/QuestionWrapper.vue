<template>
  <section>
    <header>
      <h2 :id="id">{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
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

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
