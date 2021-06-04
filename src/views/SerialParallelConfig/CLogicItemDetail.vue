<template>
  <div>
    <q-tabs
        v-model="tab"
        inline-label
        outside-arrows
        mobile-arrows
        class="text-teal"
    >
      <q-tab name="data" icon="mail" label="Data"/>
      <q-tab name="rule" icon="alarm" label="Rule"/>
      <q-tab name="next_success" icon="photo" label="NextSuccess"/>
      <q-tab name="response" icon="slow_motion_video" label="Response"/>
      <q-tab name="next_failure" icon="slow_motion_video" label="NextFailure"/>
      <q-tab name="failure_response" icon="slow_motion_video" label="FailureResponse"/>
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated
                  swipeable
                  keep-alive
                  ref="tabs"
    >
      <q-tab-panel name="data">
        <div class="text-h6">JSON logic data</div>
        <Editor v-model="data" event-name="on-change-code-data"/>
      </q-tab-panel>

      <q-tab-panel name="rule">
        <div class="text-h6">JSON logic Rule</div>
        <Editor v-model="rule" event-name="on-change-code-rule"/>
      </q-tab-panel>

      <q-tab-panel name="next_success">
        <div class="text-h6">Config Alias for Next Success</div>
        <q-input
            filled
            v-model="nextSuccess"
            label="Next Success *"
            hint="Config Alias for next success"
            ref="nextSuccess"
        />
      </q-tab-panel>

      <q-tab-panel name="response">
        <div class="text-h6">Response</div>
        <q-toggle
            v-model="enableResponse"
            label="Enable Response"
        />
        <EditorRequestResponseConfig v-if="enableResponse"
                                     ref="editor"
                                     :have-log="false"
                                     :prop-enable-loop="false"
                                     config-type="response"
                                     v-model="editorDataResponse"
        />

      </q-tab-panel>

      <q-tab-panel name="next_failure">
        <div class="text-h6">Config Alias for Next Failure</div>
        <q-input
            filled
            v-model="nextFailure"
            label="Next Success *"
            hint="Config Alias for next success"
            ref="nextSuccess"
        />
      </q-tab-panel>

      <q-tab-panel name="failure_response">
        <div class="text-h6">Response</div>
        <q-toggle
            v-model="enableFailureResponse"
            label="Enable Response"
        />
        <EditorRequestResponseConfig v-if="enableFailureResponse"
                                     ref="editor"
                                     :have-log="false"
                                     :prop-enable-loop="false"
                                     config-type="response"
                                     v-model="editorDataFailureResponse"
        />

      </q-tab-panel>

    </q-tab-panels>
    <q-btn @click="onSaveClicked">Save</q-btn>

    <q-dialog v-model="alertDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Validation Error</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <ul>
            <li v-for="(error,index) in globalErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import Editor from "../../components/common/Editor";

export default {
  props: {
    propCLogic: Object,
    propMode: String,
    propConfigId: String,
    propRequestType: String,
  },
  components: {
    Editor,
    EditorRequestResponseConfig
  },
  watch: {
    propCLogic(val) {
      this.fillData(val)
    },
  },
  data() {
    return {
      enableResponse: false,
      tab: 'data',
      id: null,
      nextSuccess: null,
      /* json logic cdata and rule */
      data: {},
      rule: {},

      editorDataResponse: {

        /* response */
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
        statusCode: '',
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },

      enableFailureResponse: false,
      nextFailure: null,
      editorDataFailureResponse: {

        /* response */
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
        statusCode: '',
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },
      validators: {
        nextSuccess: false,
        nextFailure: false,
        statusCodeErr: false,
        formHasError: false,
        errCount: 0
      },
      tabNames: ["data", "rule", "next_success", "response"],
      globalErrors: [],
      alertDialog: false,
    }
  },
  methods: {
    async onSaveClicked() {
      let data = {
        id : null,
        projectId: this.$route.params.id,
        configId: this.propConfigId,
        data: this.data ? this.data : {},
        rule: this.rule ? this.rule : {},
        next_success: this.nextSuccess,
        next_failure: this.nextFailure,
        response : null,
        failure_response : null,
      }


      if (this.enableResponse) {
        data.response = {
          transform: this.editorDataResponse.transform,
          status_code: this.editorDataResponse.statusCode,
          adds: {
            header: this.editorDataResponse.codeAddHeader ? this.editorDataResponse.codeAddHeader : {},
            body: this.editorDataResponse.codeAddBody ? this.editorDataResponse.codeAddBody : {},
          },
          modifies: {
            header: this.editorDataResponse.codeModifyHeader ? this.editorDataResponse.codeModifyHeader : {},
            body: this.editorDataResponse.codeModifyBody ? this.editorDataResponse.codeModifyBody : {}
          },
          deletes: {
            header: this.editorDataResponse.codeDeleteHeader ? this.editorDataResponse.codeDeleteHeader : [],
            body: this.editorDataResponse.codeDeleteBody ? this.editorDataResponse.codeDeleteBody : []
          }
        }
      }

      if (this.enableFailureResponse) {
        data.failure_response= {
          transform: this.editorDataFailureResponse.transform,
          status_code: this.editorDataFailureResponse.statusCode,
          adds: {
            header: this.editorDataFailureResponse.codeAddHeader ? this.editorDataFailureResponse.codeAddHeader : {},
            body: this.editorDataFailureResponse.codeAddBody ? this.editorDataFailureResponse.codeAddBody : {},
          },
          modifies: {
            header: this.editorDataFailureResponse.codeModifyHeader ? this.editorDataFailureResponse.codeModifyHeader : {},
            body: this.editorDataFailureResponse.codeModifyBody ? this.editorDataFailureResponse.codeModifyBody : {}
          },
          deletes: {
            header: this.editorDataFailureResponse.codeDeleteHeader ? this.editorDataFailureResponse.codeDeleteHeader : [],
            body: this.editorDataFailureResponse.codeDeleteBody ? this.editorDataFailureResponse.codeDeleteBody : []
          }
        }
      }

      if (this.propMode === 'edit') {
        data.id = this.id
      }

      this.$emit('on-clogic-save',data)
    },

    fillData(cLogicData) {
      const {
        id, data, next_success, response, rule, log_before_modify, log_after_modify, next_failure,
        failure_response
      } = cLogicData
      this.id = id
      this.rule = rule
      this.data = data
      this.nextSuccess = next_success
      this.nextFailure = next_failure
      if (response) {
        this.enableResponse = true
        const {adds, modifies, deletes, transform, status_code} = response
        this.editorDataResponse.statusCode = status_code
        this.editorDataResponse.transform = transform
        this.editorDataResponse.codeAddBody = adds.body ? adds.body : {},
            this.editorDataResponse.codeAddHeader = adds.header ? adds.header : {},
            this.editorDataResponse.codeModifyHeader = modifies.header ? modifies.header : {}
        this.editorDataResponse.codeModifyBody = modifies.body ? modifies.body : {},
            this.editorDataResponse.codeDeleteHeader = deletes.header ? deletes.header : [],
            this.editorDataResponse.codeDeleteBody = deletes.body ? deletes.body : [],

            this.editorDataResponse.logBeforeModify = log_before_modify
        this.editorDataResponse.logAfterModify = log_after_modify
      }

      if (failure_response) {
        this.enableFailureResponse = true
        const {adds, modifies, deletes, transform, status_code} = response
        this.editorDataFailureResponse.statusCode = status_code
        this.editorDataFailureResponse.transform = transform
        this.editorDataFailureResponse.codeAddBody = adds.body ? adds.body : {},
            this.editorDataFailureResponse.codeAddHeader = adds.header ? adds.header : {},
            this.editorDataFailureResponse.codeModifyHeader = modifies.header ? modifies.header : {}
        this.editorDataFailureResponse.codeModifyBody = modifies.body ? modifies.body : {},
            this.editorDataFailureResponse.codeDeleteHeader = deletes.header ? deletes.header : [],
            this.editorDataFailureResponse.codeDeleteBody = deletes.body ? deletes.body : [],

            this.editorDataFailureResponse.logBeforeModify = log_before_modify
        this.editorDataFailureResponse.logAfterModify = log_after_modify
      }

    },
  },
  mounted() {
    if (this.propMode === 'edit') {
      this.fillData(this.propCLogic)
    }
  }
}
</script>

<style scoped>

</style>