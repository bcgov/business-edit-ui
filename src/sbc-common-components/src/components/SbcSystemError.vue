<template>
    <v-card>
        <v-card-title v-html="cardTitle"></v-card-title>
        <v-card-text>
            <p v-html="cardDesc"></p>
            <p>
                <v-icon small>phone</v-icon>
                <a href="tel:+1-877-526-1526" class="error-dialog-padding">1-877-526-1526</a>
            </p>
            <p>
                <v-icon small>email</v-icon>
                <a href="mailto:BCRegistries@gov.bc.ca" class="error-dialog-padding"
                >BCRegistries@gov.bc.ca</a>
            </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary"  @click="submit()" v-if="primaryButtonTitle">{{primaryButtonTitle}}</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="cancel()" v-if="secondaryButtonTitle">{{secondaryButtonTitle}}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class SbcSystemError extends Vue {
    @Prop() title: String
    @Prop() readonly description: string
    @Prop() primaryButtonTitle: String
    @Prop() secondaryButtonTitle: String
    @Prop() showAsModal:boolean

    defaultDesc:String = 'We were unable to save your filing. You can continue to try to save this filing or you can exit without saving and re-create this filing at another time.\n' +
        'If you exit this filing, any changes you\'ve made will not be saved.'

    defaultTitle:String = 'Unable to Save Filing'

    get cardTitle () {
      return this.title || this.defaultTitle
    }

    get cardDesc () {
      return this.description || this.defaultDesc
    }
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
    article{
        .v-card{
            line-height: 1.2rem;
            font-size: 0.875rem;
        }
    }
    section p{
        // font-size 0.875rem
        color: $gray6;
    }
    section + section{
        margin-top: 3rem;
    }
    h2{
        margin-bottom: 0.25rem;
    }
    .title-container{
        margin-bottom: 0.5rem;
    }
    #buttons-container{
        padding-top: 2rem;
        border-top: 1px solid $gray5;
        .buttons-left{
            width: 50%;
        }
        .buttons-right{
            margin-left: auto;
        }
        .v-btn + .v-btn{
            margin-left: 0.5rem;
        }
    }
    .error-dialog-padding{
        margin-left: 1rem;
    }
</style>
