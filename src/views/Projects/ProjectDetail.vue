<template>
  <div class="full-height">
    <q-splitter
        class="full-height"
        v-model="splitterModel"
    >

      <template v-slot:before>
        <q-tabs
            v-model="tab"
            vertical
            class="text-teal"
        >
          <q-tab name="general" icon="description" label="General"/>
          <q-tab name="base" icon="settings_application" label="Base Settings"/>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"

        >
          <q-tab-panel name="general">
            <div class="text-h4 q-mb-md">General</div>

            <q-input
                filled
                v-model="name"
                label="Name *"
                hint="Project Name"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <br/>
            <q-input
                filled
                v-model="description"
                label="Description *"
                hint="Project Description"
                type="textarea"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

          </q-tab-panel>

          <q-tab-panel name="base">
            <div class="text-h4 q-mb-md">Base Settings</div>
            <q-input
                v-model.number="maxCircular"
                label="Max Circular Limit*"
                hint="Maximum limit of circular request"
                type="number"
                filled
            />

            <br/>

            <EditorRequestResponseConfig config-type="response"
                                         :prop-status-code="statusCode"
                                         :prop-transform="transform"
                                         :prop-log-after-modify="logAfterModify"
                                         :prop-log-before-modify="logBeforeModify"
                                         :prop-code-code-add-header="codeAddHeader"
                                         :prop-code-code-add-body="codeAddBody"
                                         :prop-code-modify-header="codeModifyHeader"
                                         :prop-code-modify-body="codeModifyBody"
                                         :prop-code-delete-header="codeDeleteHeader"
                                         :prop-code-delete-body="codeDeleteBody"
                                         @on-change-status-code="onChangeStatusCode"
                                         @on-change-transform="onChangeTransform"
                                         @on-change-log-before-modify="onChangeLogBeforeModify"
                                         @on-change-log-after-modify="onChangeLogAfterModify"
                                         @on-change-add-header="onChangeAddHeader"
                                         @on-change-add-body="onChangeAddBody"
                                         @on-change-modify-header="onChangeModifyHeader"
                                         @on-change-modify-body="onChangeModifyBody"
                                         @on-change-delete-header="onChangeDeleteHeader"
                                         @on-change-delete-body="onChangeDeleteBody"
            />

          </q-tab-panel>


        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";

export default {
  components: {EditorRequestResponseConfig},
  data() {
    return {
      tab: 'general',
      name: '',
      description: '',
      maxCircular: 0,
      selected: 'Adds.Header',
      codeAddHeader: {},
      codeAddBody: {},
      codeModifyHeader: {},
      codeModifyBody: {},
      codeDeleteHeader: [],
      codeDeleteBody: [],
      statusCode : null,
      transform : {},
      logBeforeModify : {},
      logAfterModify : {}
    }
  },
  methods: {
    onChangeStatusCode(val) {
      this.statusCode = val;
    },
    onChangeTransform(val) {
      this.transform = val;
    },
    onChangeLogBeforeModify(val) {
      this.logBeforeModify = val;
    },
    onChangeLogAfterModify(val) {
      this.logAfterModify = val;
    },
    onChangeAddHeader(val) {
      this.codeAddHeader = val;
    },
    onChangeAddBody(val) {
      this.codeAddBody = val;
    },
    onChangeModifyHeader(val) {
      this.codeModifyHeader = val
    },
    onChangeModifyBody(val) {
      this.codeModifyBody = val
    },
    onChangeDeleteHeader(val) {
      this.codeDeleteHeader = val
    },
    onChangeDeleteBody(val) {
      this.codeDeleteBody = val
    }

  }
}
</script>

<style scoped>

</style>