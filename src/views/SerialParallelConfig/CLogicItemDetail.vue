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

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="data">
        <div class="text-h6">JSON logic data</div>
        <Editor :prop-code="data" event-name="on-change-code-data" @on-change-code-data="onChangeCodeData"/>
      </q-tab-panel>

      <q-tab-panel name="rule">
        <div class="text-h6">JSON logic Rule</div>
        <Editor :prop-code="rule" event-name="on-change-code-rule" @on-change-code-rule="onChangeCodeRule"/>
      </q-tab-panel>

      <q-tab-panel name="next_success">
        <div class="text-h6">Config Alias for Next Success</div>
        <q-input
            filled
            v-model="nextSuccess"
            label="Next Success *"
            hint="Config Alias for next success"
        />
      </q-tab-panel>

      <q-tab-panel name="response">
        <div class="text-h6">Response</div>
        <q-toggle
            v-model="enableResponse"
            label="Enable Response"
        />
        <EditorRequestResponseConfig v-if="enableResponse"
                                     config-type="response"
                                     :prop-status-code="statusCode"
                                     :prop-transform="transform"
                                     :prop-log-after-modify="logAfterModify"
                                     :prop-log-before-modify="logBeforeModify"
                                     :prop-code-add-header="codeAddHeader"
                                     :prop-code-add-body="codeAddBody"
                                     :prop-code-modify-header="codeModifyHeader"
                                     :prop-code-modify-body="codeModifyBody"
                                     :prop-code-delete-header="codeDeleteHeader"
                                     :prop-code-delete-body="codeDeleteBody"
                                     @on-change-status-code-response="onChangeStatusCode"
                                     @on-change-transform-response="onChangeTransform"
                                     @on-change-log-before-modify-response="onChangeLogBeforeModify"
                                     @on-change-log-after-modify-response="onChangeLogAfterModify"
                                     @on-change-add-header-response="onChangeAddHeader"
                                     @on-change-add-body-response="onChangeAddBody"
                                     @on-change-modify-header-response="onChangeModifyHeader"
                                     @on-change-modify-body-response="onChangeModifyBody"
                                     @on-change-delete-header-response="onChangeDeleteHeader"
                                     @on-change-delete-body-response="onChangeDeleteBody"
        />

      </q-tab-panel>
    </q-tab-panels>
    <q-btn @click="onSaveClicked">Save</q-btn>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import Editor from "../../components/common/Editor";
import {mapActions} from "vuex";
import snakecaseKeys from "snakecase-keys";

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
        nextSuccess: this.nextSuccess,
      }
      console.log("rule is")
      console.log(snakecaseKeys(this.rule, { deep : true, exclude : ["=="]}));
      if(this.enableResponse){
        data.response = {
          transform: this.transform,
              status_code: this.statusCode,
              adds: {
            header: this.codeAddHeader ? this.codeAddHeader : {},
                body: this.codeAddBody ? this.codeAddBody : {},
          },
          modifies: {
            header: this.codeModifyHeader ? this.codeModifyHeader : {},
                body: this.codeModifyBody ? this.codeModifyBody : {}
          },
          deletes: {
            header: this.codeDeleteHeader ? this.codeDeleteHeader : [],
                body: this.codeDeleteBody ? this.codeDeleteBody : []
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

        } catch (err) {
          console.log(err)
        }
      }


      // console.log("data is before emit")
      // console.log(data)
      // this.$emit('on-clogic-save', {mode : this.propMode, data : data, index : this.propIndex})
    },
    onChangeCodeData(val) {
      this.data = val
    },
    onChangeCodeRule(val) {
      this.rule = val
    },
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
        this.statusCode = status_code
        this.transform = transform
        this.codeAddBody = adds.body ? adds.body : {},
            this.codeAddHeader = adds.header ? adds.header : {},
            this.codeModifyHeader = modifies.header ? modifies.header : {}
        this.codeModifyBody = modifies.body ? modifies.body : {},
            this.codeDeleteHeader = deletes.header ? deletes.header : [],
            this.codeDeleteBody = deletes.body ? deletes.body : [],

            this.logBeforeModify = log_before_modify
        this.logAfterModify = log_after_modify
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