<template>
  <div id="bc-reg-contacts" :class="{ 'flex-column': direction === 'col' }">
    <div
      class="contact-container" :class="{ 'justify-center': direction === 'row' }"
      v-for="(contact, i) in contacts" :key="i"
    >
      <v-icon class="contact-icon">{{contact.icon}}</v-icon>
      <div class="contact-key info-text" v-html="contact.key" />
      <a :href="contact.href" class="contact-value" v-html="contact.val" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class BcRegContacts extends Vue {
  /** Can be "row" (default) or "col". */
  @Prop({ default: 'row' })
  readonly direction: string

  readonly contacts = [
    {
      icon: 'mdi-phone',
      key: 'Canada &amp; U.S. Toll Free:',
      val: '1-877-526-1526',
      href: 'tel:+1-877-526-1526'
    },
    {
      icon: 'mdi-phone',
      key: 'Victoria Office:',
      val: '250-387-7848',
      href: 'tel:+1-250-387-7848'
    },
    {
      icon: 'mdi-email',
      key: 'Email:',
      val: 'BCRegistries@gov.bc.ca',
      href: 'mailto:BCRegistries@gov.bc.ca'
    }
  ]
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#bc-reg-contacts {
  display: flex;
  justify-content: space-between;
  row-gap: 0.25rem; /* in case direction = row */
}

.contact-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  min-width: 12rem;
}

.contact-icon {
  font-size: 1.25rem;
  color: $app-dk-blue;
}

.contact-key {
  white-space: nowrap;
}

.contact-value {
  white-space: nowrap;
  align-self: center;
}
</style>
