<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-banner
        rounded
        class="text-white bg-red"
        v-if="
          !(
            isObjEmpty({ rule: resultValidator.resultRuleObj }.rule) &&
            isObjEmpty({ data: resultValidator.resultDataObj }.data) &&
            isObjEmpty(
              { response: resultValidator.resultResponseObj }.response
            ) &&
            isObjEmpty(
              { failureResponse: resultValidator.resultFailureResponseObj }
                .failureResponse
            )
          )
        "
      >
        <ul>
          <li
            v-for="(value, name) in traverse({
              rule: resultValidator.resultRuleObj,
              data: resultValidator.resultDataObj,
              response: resultValidator.resultResponseObj,
              failureResponse: resultValidator.resultFailureResponseObj,
            })"
            :key="name"
          >
            <p>
              <b>{{ name }}</b
              >: {{ value }}
            </p>
          </li>
        </ul>
      </q-banner>
    </div>
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="text-teal"
    >
      <q-tab
        name="data"
        icon="mail"
        label="Data"
        :alert="validators.dataEditorErr ? 'red' : false"
      />
      <q-tab
        name="rule"
        icon="alarm"
        label="Rule"
        :alert="validators.ruleEditorErr ? 'red' : false"
      />
      <q-tab name="next_success" icon="photo" label="NextSuccess" />
      <q-tab
        name="response"
        icon="slow_motion_video"
        label="Response"
        :alert="
          validators.responseStatusCodeErr || validators.responseEditorErr
            ? 'red'
            : false
        "
      />
      <q-tab name="next_failure" icon="slow_motion_video" label="NextFailure" />
      <q-tab
        name="failure_response"
        icon="slow_motion_video"
        label="FailureResponse"
        :alert="
          validators.failureResponseStatusCodeErr ||
          validators.failureResponseEditorErr
            ? 'red'
            : false
        "
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated swipeable keep-alive ref="tabs">
      <q-tab-panel name="data">
        <div class="text-h6">JSON logic data</div>
        <Editor
          v-model="data"
          event-name="on-change-code-data"
          @input="validateInput"
        />
      </q-tab-panel>

      <q-tab-panel name="rule">
        <div class="text-h6">JSON logic Rule</div>
        <Editor
          v-model="rule"
          event-name="on-change-code-rule"
          @input="validateInput"
        />
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
        <q-toggle v-model="enableResponse" label="Enable Response" />
        <EditorRequestResponseConfig
          v-if="enableResponse"
          ref="responseEditor"
          :have-log="false"
          :prop-enable-loop="false"
          config-type="response"
          v-model="editorResponse"
          :hide-error-banner="true"
          @input="validateInput"
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
        <q-toggle v-model="enableFailureResponse" label="Enable Response" />
        <EditorRequestResponseConfig
          v-if="enableFailureResponse"
          ref="failureResponseEditor"
          :have-log="false"
          :prop-enable-loop="false"
          config-type="response"
          v-model="editorFailureResponse"
          :hide-error-banner="true"
          @input="validateInput"
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
            <li v-for="(error, index) in globalErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            @click="okClicked"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Editor from "../../components/common/Editor";
import { isObjectEmpty, traverseObj } from "../../util/syntaxchecker";
import {
  INVALID_FAILURE_RESPONSE_EDITOR_SYNTAX,
  INVALID_RESPONSE_EDITOR_SYNTAX,
  INVALID_RULE_EDITOR_SYNTAX,
} from "../../models/const";

export default {
  name: "CLogicItemDetail",
  props: {
    propCLogic: Object,
    propMode: String,
    propConfigId: String,
    propRequestType: String,
  },
  components: {
    Editor,
    EditorRequestResponseConfig: () =>
      import("../../components/common/EditorRequestResponseConfig"),
  },
  watch: {
    propCLogic(val) {
      this.fillData(val);
    },
  },
  data() {
    return {
      enableResponse: false,
      tab: "data",
      id: null,
      nextSuccess: null,
      /* json logic cdata and rule */
      data: {},
      rule: {},

      editorResponse: {
        /* response */
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
        statusCode: null,
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },

      enableFailureResponse: false,
      nextFailure: null,
      editorFailureResponse: {
        /* response */
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
        statusCode: 400,
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },
      validators: {
        nextSuccess: false,
        nextFailure: false,
        responseStatusCodeErr: false,
        failureResponseStatusCodeErr: false,
        failureResponseEditorErr: false,
        responseEditorErr: false,
        ruleEditorErr: false,
        dataEditorErr: false,
        formHasError: false,
        errCount: 0,
      },
      resultValidator: {
        resultFailureResponseObj: {},
        resultResponseObj: {},
        resultRuleObj: {},
        resultDataObj: {},
      },
      tabNames: [
        "data",
        "rule",
        "next_success",
        "response",
        "next_failure",
        "failure_response",
      ],
      globalErrors: [],
      alertDialog: false,
    };
  },
  methods: {
    okClicked() {
      this.alertDialog = false;
    },
    isObjEmpty(obj) {
      return isObjectEmpty(obj);
    },
    traverse(obj) {
      return traverseObj(obj);
    },
    formatObjError(obj) {
      let result = {};
      for (let [key, value] of Object.entries(obj)) {
        if (!isObjectEmpty(obj[key])) {
          result[key] = value;
        }
      }
      return result;
    },
    resetValidator() {
      this.globalErrors = [];
      this.validators = {
        nextSuccess: false,
        nextFailure: false,
        responseStatusCodeErr: false,
        failureResponseStatusCodeErr: false,
        failureResponseEditorErr: false,
        responseEditorErr: false,
        ruleEditorErr: false,
        dataEditorErr: false,
        formHasError: false,
        errCount: 0,
      };
    },
    validateInput() {
      this.resetValidator();

      // validate rule syntax
      this.resultValidator.resultRuleObj = traverseObj(this.rule);
      if (!isObjectEmpty(this.resultValidator.resultRuleObj)) {
        this.validators.ruleEditorErr = true;
        this.validators.errCount++;
        this.validators.formHasError = true;
        this.globalErrors.push(INVALID_RULE_EDITOR_SYNTAX);
      }

      // validate data syntax
      this.resultValidator.resultDataObj = traverseObj(this.data);
      if (!isObjectEmpty(this.resultValidator.resultDataObj)) {
        this.validators.dataEditorErr = true;
        this.validators.errCount++;
        this.validators.formHasError = true;
        this.globalErrors.push(INVALID_RULE_EDITOR_SYNTAX);
      }

      // if failure response enabled
      if (this.enableFailureResponse) {
        this.$refs.failureResponseEditor.$refs.statusCode.validate();
        this.validators.failureResponseStatusCodeErr =
          this.$refs.failureResponseEditor.$refs.statusCode.hasError;

        if (this.validators.failureResponseStatusCodeErr) {
          this.validators.errCount++;
          this.validators.formHasError = true;
          this.globalErrors.push(
            this.$refs.failureResponseEditor.$refs.statusCode.innerErrorMessage
          );
        }

        this.resultValidator.resultFailureResponseObj = traverseObj(
          this.editorFailureResponse
        );
        if (!isObjectEmpty(this.resultValidator.resultFailureResponseObj)) {
          this.validators.failureResponseEditorErr = true;
          this.validators.errCount++;
          this.validators.formHasError = true;
          this.globalErrors.push(INVALID_FAILURE_RESPONSE_EDITOR_SYNTAX);
        }
      }

      // if response enabled
      if (this.enableResponse) {
        this.$refs.responseEditor.$refs.statusCode.validate();
        this.validators.responseStatusCodeErr =
          this.$refs.responseEditor.$refs.statusCode.hasError;

        if (this.validators.responseStatusCodeErr) {
          this.validators.errCount++;
          this.validators.formHasError = true;
          this.globalErrors.push(
            this.$refs.responseEditor.$refs.statusCode.innerErrorMessage
          );
        }

        this.resultValidator.resultResponseObj = traverseObj(
          this.editorResponse
        );
        if (!isObjectEmpty(this.resultValidator.resultResponseObj)) {
          this.validators.responseEditorErr = true;
          this.validators.errCount++;
          this.validators.formHasError = true;
          this.globalErrors.push(INVALID_RESPONSE_EDITOR_SYNTAX);
        }
      }
    },
    async onSaveClicked() {
      this.validateInput();
      if (!this.validators.formHasError) {
        let data = {
          id: null,
          projectId: this.$route.params.id,
          configId: this.propConfigId,
          data: this.data ? this.data : {},
          rule: this.rule ? this.rule : {},
          next_success: this.nextSuccess,
          next_failure: this.nextFailure,
          response: null,
          failure_response: null,
        };

        if (this.enableResponse) {
          data.response = {
            transform: this.editorResponse.transform,
            status_code: this.editorResponse.statusCode,
            adds: {
              header: this.editorResponse.codeAddHeader
                ? this.editorResponse.codeAddHeader
                : {},
              body: this.editorResponse.codeAddBody
                ? this.editorResponse.codeAddBody
                : {},
            },
            modifies: {
              header: this.editorResponse.codeModifyHeader
                ? this.editorResponse.codeModifyHeader
                : {},
              body: this.editorResponse.codeModifyBody
                ? this.editorResponse.codeModifyBody
                : {},
            },
            deletes: {
              header: this.editorResponse.codeDeleteHeader
                ? this.editorResponse.codeDeleteHeader
                : [],
              body: this.editorResponse.codeDeleteBody
                ? this.editorResponse.codeDeleteBody
                : [],
            },
          };
        }

        if (this.enableFailureResponse) {
          data.failure_response = {
            transform: this.editorFailureResponse.transform,
            status_code: this.editorFailureResponse.statusCode,
            adds: {
              header: this.editorFailureResponse.codeAddHeader
                ? this.editorFailureResponse.codeAddHeader
                : {},
              body: this.editorFailureResponse.codeAddBody
                ? this.editorFailureResponse.codeAddBody
                : {},
            },
            modifies: {
              header: this.editorFailureResponse.codeModifyHeader
                ? this.editorFailureResponse.codeModifyHeader
                : {},
              body: this.editorFailureResponse.codeModifyBody
                ? this.editorFailureResponse.codeModifyBody
                : {},
            },
            deletes: {
              header: this.editorFailureResponse.codeDeleteHeader
                ? this.editorFailureResponse.codeDeleteHeader
                : [],
              body: this.editorFailureResponse.codeDeleteBody
                ? this.editorFailureResponse.codeDeleteBody
                : [],
            },
          };
        }

        if (this.propMode === "edit") {
          data.id = this.id;
        }

        this.$emit("on-clogic-save", data);
      } else {
        this.alertDialog = true;
      }
    },

    fillData(cLogicData) {
      const {
        id,
        data,
        next_success,
        response,
        rule,
        log_before_modify,
        log_after_modify,
        next_failure,
        failure_response,
      } = cLogicData;
      this.id = id;
      this.rule = rule ? rule : {};
      this.data = data ? data : {};
      this.nextSuccess = next_success;
      this.nextFailure = next_failure;
      if (response) {
        this.enableResponse = true;
        const { adds, modifies, deletes, transform, status_code } = response;
        this.editorResponse.statusCode = status_code;
        this.editorResponse.transform = transform;
        (this.editorResponse.codeAddBody = adds.body ? adds.body : {}),
          (this.editorResponse.codeAddHeader = adds.header ? adds.header : {}),
          (this.editorResponse.codeModifyHeader = modifies.header
            ? modifies.header
            : {});
        (this.editorResponse.codeModifyBody = modifies.body
          ? modifies.body
          : {}),
          (this.editorResponse.codeDeleteHeader = deletes.header
            ? deletes.header
            : []),
          (this.editorResponse.codeDeleteBody = deletes.body
            ? deletes.body
            : []),
          (this.editorResponse.logBeforeModify = log_before_modify);
        this.editorResponse.logAfterModify = log_after_modify;
      }

      if (failure_response) {
        this.enableFailureResponse = true;
        const { adds, modifies, deletes, transform, status_code } = response;
        this.editorFailureResponse.statusCode = status_code;
        this.editorFailureResponse.transform = transform;
        (this.editorFailureResponse.codeAddBody = adds.body ? adds.body : {}),
          (this.editorFailureResponse.codeAddHeader = adds.header
            ? adds.header
            : {}),
          (this.editorFailureResponse.codeModifyHeader = modifies.header
            ? modifies.header
            : {});
        (this.editorFailureResponse.codeModifyBody = modifies.body
          ? modifies.body
          : {}),
          (this.editorFailureResponse.codeDeleteHeader = deletes.header
            ? deletes.header
            : []),
          (this.editorFailureResponse.codeDeleteBody = deletes.body
            ? deletes.body
            : []),
          (this.editorFailureResponse.logBeforeModify = log_before_modify);
        this.editorFailureResponse.logAfterModify = log_after_modify;
      }
    },
    visitTabs() {
      let traversal = this.tabNames.reduce((promiseChain, item) => {
        return promiseChain.then(
          () =>
            new Promise((resolve) => {
              console.log("done with", item);
              resolve();
              this.$refs.tabs.goTo(item);
            })
        );
      }, Promise.resolve());

      traversal.then(() => {
        this.$refs.tabs.goTo("data");
      });
    },
  },

  mounted() {
    if (this.propMode === "edit") {
      this.fillData(this.propCLogic);
    }
    this.visitTabs();
  },
};
</script>

<style scoped></style>
