<template>
  <section
    :id="id"
    class="mt-5"
  >
    <header>
      <h2>{{ title }}</h2>
      <p
        v-if="subtitle"
        class="pt-2"
      >
        {{ subtitle }}
      </p>
      <p
        v-if="comment"
        class="text-black mb-0"
      >
        {{ comment }}
      </p>
    </header>
    <slot />
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

<style lang="scss">
#question_container {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;

  h2::before {
    /* Increment "header-counter" by 1 */
    counter-increment: header-counter;
    content: counter(header-counter) '. ';
  }
}
</style>
