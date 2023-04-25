import { Vue } from 'vue-facing-decorator'

export interface ConfirmDialogType extends Vue {
 open (title: string, message: string, options: any): Promise<any>
}
