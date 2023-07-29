<template>
  <div>
    <template v-if="isBenefit">
      <div class="my-6">
        <p class="subtitle">
          {{ updatedArticleTitle }}
        </p>
        <p class="info-text">
          Before submitting your alteration notice you <span class="font-weight-bold">must
            change your company's articles to include a set of {{ updatedArticleTitle }}</span> OR draft new articles
          containing a benefit provision.
        </p>
      </div>

      <section class="text-body-3">
        <!-- Help Section Toggle -->
        <HelpSectionToggle>
          <template #content>
            <!-- Help Section -->
            <section
              class="mx-8 my-7"
            >
              <p class="subtitle mb-2">
                Benefit Provision
              </p>
              <p class="info-text">
                A benefit company must include a benefit provision (a statement by the company of its public benefits
                and its commitments to promote those public benefits and to conduct business in a responsible and
                sustainable manner) in the company's articles. The benefit provision can be added as part of the
                company's existing articles or as part of new articles.
              </p>
              <div class="provision-help pa-10">
                <p class="subtitle">
                  Part 1 - Benefit Provision
                </p>
                <ol class="info-text ml-2 pl-0">
                  <li style="list-style:none;">
                    <ol>
                      <li class="mb-4">
                        <span class="ml-4">The Company commits to promote the following public benefits:</span><br>
                        <span class="ml-2">[List your public benefits in this section]</span>
                      </li>
                      <li>
                        <span class="ml-4">The Company commits</span>
                        <br>
                        <div class="ml-5">
                          <span class="ml-n3">i) to conduct the benefit company's business in a responsible and
                            sustainable manner;</span>
                          <br>
                          <span class="ml-n3">ii) to promote the public benefits specific in paragraph 1.1</span>
                        </div>
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>
            </section>
          </template>
        </HelpSectionToggle>

        <!-- Confirm Articles Checkbox -->
        <div class="pr-2">
          <v-checkbox
            id="confirm-articles-checkbox"
            v-model="localConfirmArticles"
            :label="confirmLabel"
          />
        </div>
      </section>
    </template>

    <template v-else-if="isUnlimitedLiability">
      <div class="my-6">
        <p class="subtitle">
          {{ updatedArticleTitle }}
        </p>
        <p class="info-text">
          Before submitting your alteration notice you <span class="font-weight-bold">must
            change your company's articles to include a set of {{ updatedArticleTitle }} </span>
          OR draft new articles containing a liability provision.
        </p>
      </div>

      <section class="text-body-3">
        <!-- Help Section Toggle -->
        <HelpSectionToggle>
          <template #content>
            <!-- Help Section -->
            <section
              class="mx-8 my-7"
            >
              <p class="subtitle mb-2">
                Liability Provision
              </p>
              <p class="info-text">
                A Liability Provision is a statement by the company of the shareholders joint liability to
                satisfy all debts and liabilities of the company. An Unlimited Liability Company must
                include a Liability Provision in its Articles.
              </p>
              <div class="provision-help pa-10">
                <span class="info-text">
                  Refer to <span class="font-weight-bold">
                    sections 51.31, 257 and 259 of the Business Corporations Act. </span>
                  Please read these sections
                  carefully before you proceed with filing the Notice of Alteration. Every alteration to the
                  company's Notice of Articles must be appropriately authorized by the company or the court.
                </span>
              </div>
            </section>
          </template>
        </HelpSectionToggle>

        <!-- Confirm Articles Checkbox -->
        <div class="pr-2">
          <v-checkbox
            id="confirm-articles-checkbox"
            v-model="localConfirmArticles"
            :label="confirmLabel"
          />
        </div>
      </section>
    </template>

    <template v-else-if="isCommunityContribution">
      <div class="my-6">
        <p class="subtitle">
          {{ updatedArticleTitle }}
        </p>
        <p class="info-text">
          Before submitting your alteration notice you <span class="font-weight-bold">must
            change your company's articles to include a set of {{ updatedArticleTitle }} </span>
          OR draft new articles containing a community provision.
        </p>
      </div>

      <section class="text-body-3">
        <!-- Help Section Toggle -->
        <HelpSectionToggle>
          <template #content>
            <!-- Help Section -->
            <section
              class="mx-8 my-7"
            >
              <p class="subtitle mb-2">
                Community Provision
              </p>
              <p class="info-text">
                A Community Provision is a statement by the company of its benefits to society and its
                restrictions in its ability to pay dividends and distribute assets. A Community Contribution
                Company must include a community provision in its Articles.
              </p>
              <div class="provision-help pa-10">
                <span class="info-text">
                  Refer to <span class="font-weight-bold">
                    51.97, 257 and 259 of the Business Corporations Act. </span>
                  Please read these sections carefully before you proceed with filing the Notice of
                  Alteration. Every alteration to the company's Notice of Articles must be appropriately
                  authorized by the company or the court.
                </span>
              </div>
            </section>
          </template>
        </HelpSectionToggle>

        <!-- Confirm Articles Checkbox -->
        <div class="pr-2">
          <v-checkbox
            id="confirm-articles-checkbox"
            v-model="localConfirmArticles"
            :label="confirmLabel"
          />
        </div>
      </section>
    </template>

    <template v-else-if="isBcLimited">
      <div class="my-6">
        <p class="subtitle">
          {{ updatedArticleTitle }}
        </p>
        <p class="info-text">
          Before submitting your alteration notice you must change your company's articles
          to include a set of BC LTD Articles.
        </p>
      </div>

      <section class="text-body-3">
        <!-- Help Section Toggle -->
        <HelpSectionToggle>
          <!-- Help Section -->
          <template #content>
            <section
              class="mx-8 my-7"
            >
              <p class="subtitle mb-2">
                BC LTD Articles
              </p>
              <p class="info-text">
                Articles should outline the rules and procedures for corporate matters such as holding meetings,
                issuing and transferring shares, and duties of directors and officers.
              </p>
              <div class="provision-help pa-10">
                <span class="info-text">
                  Refer to <span class="font-weight-bold">
                    sections 51.4, 257 and 259 of the Business Corporations Act. </span>
                  Please read these sections
                  carefully before you proceed with filing the Notice of Alteration.
                  Every alteration to the company's Notice of Articles must be appropriately
                  authorized by the company or the court.
                </span>
              </div>
            </section>
          </template>
        </HelpSectionToggle>

        <!-- Confirm Articles Checkbox -->
        <div class="pr-2">
          <v-checkbox
            id="confirm-articles-checkbox"
            v-model="localConfirmArticles"
            :label="confirmLabel"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import HelpSectionToggle from '@/components/Alteration/HelpSectionToggle.vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { ResourceUtilities } from '@/utils'

@Component({
  components: {
    HelpSectionToggle
  }
})
export default class BcRegEntityDetails extends Vue {
  @Prop({ default: false }) readonly confirmArticles!: boolean
  @Prop({ default: false }) readonly isBenefit!: boolean
  @Prop({ default: false }) readonly isUnlimitedLiability!: boolean
  @Prop({ default: false }) readonly isCommunityContribution!: boolean
  @Prop({ default: false }) readonly isBcLimited!: boolean
  @Prop({ default: '' }) readonly selectedEntityType: CorpTypeCd

  localConfirmArticles = false

  mounted () {
    this.localConfirmArticles = this.confirmArticles
  }

  // Watch for changes to confirmArticles prop
  @Watch('confirmArticles')
  onConfirmArticlesChanged (newValue: boolean) {
    this.localConfirmArticles = newValue
  }

  // Watch for changes to localConfirmArticles data property
  @Watch('localConfirmArticles')
  onLocalConfirmArticlesChanged (newValue: boolean) {
    this.$emit('update:confirmArticles', newValue)
  }

  get confirmLabel (): string {
    return ResourceUtilities.articleInfo(this.selectedEntityType)
  }

  get updatedArticleTitle (): string {
    return ResourceUtilities.articleTitle(this.selectedEntityType)
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
ol {
  counter-reset: item;

  > li {
    counter-increment: item;
  }

  ol > li {
    display: block;
  }

  ol > li:before {
    content: counters(item, ".");
    margin-left: -32px;
  }
}
.provision-help {
  background-color: $gray1;
}
</style>
