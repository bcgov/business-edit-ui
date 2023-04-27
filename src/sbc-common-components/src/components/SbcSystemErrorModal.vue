<template>
    <v-dialog v-model="showModal" width="50rem" persistent>
        <sbc-system-error v-bind="$props" v-on:continue-event="submit()"  v-on:cancel-event="cancel()"></sbc-system-error>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import SbcSystemError from '../components/SbcSystemError.vue'
@Component({
  components: { SbcSystemError }
})
export default class SbcSystemErrorModal extends Vue {
    @Prop() title: String
    @Prop() readonly description: string
    @Prop() primaryButtonTitle: String
    @Prop() secondaryButtonTitle: String
    @Prop() showModal:boolean

    defaultDesc:String = 'We were unable to save your filing. You can continue to try to save this filing or you can exit without saving and re-create this filing at another time.\n' +
        'If you exit this filing, any changes you\'ve made will not be saved.'

    defaultTitle:String = 'Unable to Save Filing'

    @Emit('continue-event')
    submit ():void {
    }
    @Emit('cancel-event')
    cancel () :void{
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/theme.scss';
    @import '../assets/scss/overrides.scss';

    article {
      .v-card {
        line-height: 1.2rem;
        font-size: 0.875rem;
      }
    }
    section p {
      // font-size 0.875rem
      color: $gray6;
    }
    section + section {
      margin-top: 3rem;
    }
    h2 {
      margin-bottom: 0.25rem;
    }
    .title-container {
      margin-bottom: 0.5rem;
    }
    #buttons-container {
      padding-top: 2rem;
      border-top: 1px solid $gray5;
      .buttons-left {
        width: 50%;
      }
      .buttons-right {
        margin-left: auto;
      }
      .v-btn + .v-btn {
        margin-left: 0.5rem;
      }
    }
    .error-dialog-padding {
      margin-left: 1rem;
    }
</style>
