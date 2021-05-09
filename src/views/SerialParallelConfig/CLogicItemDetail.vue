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
    </q-tabs>

    <q-separator/>

    <q-tab-panels v-model="tab" animated
                  swipeable
                  keep-alive
                  ref="tabs"
    >
      <q-tab-panel name="data">
        <div class="text-h6">JSON logic data</div>
        <Editor v-model="data" event-name="on-change-code-data" />
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
                                     v-model="editorData"
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
import {mapActions} from "vuex";

export default {
  props: {
    propCLogic: Object,
    propIndex: Number,
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
      this.filLData(val)
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

      editorData : {

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
        statusCodeErr: false,
        formHasError: false,
        errCount: 0
      },
      tabNames: ["data", "rule", "next_success","response"],
      globalErrors: [],
      alertDialog: false,
    }
  },
  methods: {
    ...mapActions({
      addCLogicSerial: 'serial/storeSingleCLogic',
      updateCLogicSerial: 'serial/updateSingleCLogic',
      addCLogicParallel: 'parallel/storeSingleCLogicParallel',
      updateCLogicParallel: 'parallel/updateSingleCLogicParallel',
    }),
    async onSaveClicked() {
      let data = {
        projectId: this.$route.params.id,
        configId: this.propConfigId,
        data: this.data ? this.data : {},
        rule: this.rule ? this.rule : {},
        next_success: this.nextSuccess,
      }


      if(this.enableResponse){
        data.response = {
          transform: this.editorData.transform,
              status_code: this.editorData.statusCode,
              adds: {
            header: this.editorData.codeAddHeader ? this.editorData.codeAddHeader : {},
                body: this.editorData.codeAddBody ? this.editorData.codeAddBody : {},
          },
          modifies: {
            header: this.editorData.codeModifyHeader ? this.editorData.codeModifyHeader : {},
                body: this.editorData.codeModifyBody ? this.editorData.codeModifyBody : {}
          },
          deletes: {
            header: this.editorData.codeDeleteHeader ? this.editorData.codeDeleteHeader : [],
                body: this.editorData.codeDeleteBody ? this.editorData.codeDeleteBody : []
          }
        }
      }
      if (this.propMode === 'edit') {
        data.id = this.id
        if (this.propRequestType === 'serial') {
          await this.updateCLogicSerial(data)
        } else {
          await this.updateCLogicParallel(data)
        }
        this.$q.notify({
          message: 'Update CLogic Success',
          color: 'secondary'
        })
        this.$emit('on-clogic-save')
      } else {
        try {
          if (this.propRequestType === 'serial') {
            await this.addCLogicSerial(data)
          } else {
            await this.addCLogicParallel(data)
          }
          this.$q.notify({
            message: 'Add CLogic Success',
            color: 'secondary'
          })

          this.$emit('on-clogic-save')
        } catch (err) {
          console.log(err)
        }
      }


      // console.log("data is before emit")
      // console.log(data)
      // this.$emit('on-clogic-save', {mode : this.propMode, data : data, index : this.propIndex})
    },

    filLData(cLogicData) {
      const {id, data, next_success, response, rule, log_before_modify, log_after_modify} = cLogicData
      this.id = id
      this.data = data
      this.nextSuccess = next_success
      this.rule = rule
      if (response) {
      this.enableResponse = true
        const {adds, modifies, deletes, transform, status_code} = response
        this.editorData.statusCode = status_code
        this.editorData.transform = transform
        this.editorData.codeAddBody = adds.body ? adds.body : {},
            this.editorData.codeAddHeader = adds.header ? adds.header : {},
            this.editorData.codeModifyHeader = modifies.header ? modifies.header : {}
        this.editorData.codeModifyBody = modifies.body ? modifies.body : {},
            this.editorData.codeDeleteHeader = deletes.header ? deletes.header : [],
            this.editorData.codeDeleteBody = deletes.body ? deletes.body : [],

            this.editorData.logBeforeModify = log_before_modify
        this.editorData.logAfterModify = log_after_modify
      }

    },
  },
  mounted() {
    if (this.propMode === 'edit') {

      this.filLData(this.propCLogic)
    }
  }
}
</script>

<style scoped>

</style>