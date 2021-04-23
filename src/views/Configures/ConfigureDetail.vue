<template>
  <div>
    <p>Response {{response}}</p>
    <p>Request {{request}}</p>
    <q-splitter
        v-model="splitterModel"
        style="height: 100%"
    >
      <template v-slot:before>
        <q-tabs
            v-model="tab"
            vertical
            class="text-teal"
        >
          <q-tab name="request" icon="mail" label="Request"/>
          <q-tab name="response" icon="alarm" label="Response"/>
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
          <q-tab-panel name="request">

            <EditorRequestResponseConfig config-type="request"
                                         :prop-transform="request.transform"
                                         :prop-log-after-modify="request.logAfterModify"
                                         :prop-log-before-modify="request.logBeforeModify"
                                         :prop-code-add-header="request.codeAddHeader"
                                         :prop-code-add-body="request.codeAddBody"
                                         :prop-code-modify-header="request.codeModifyHeader"
                                         :prop-code-modify-body="request.codeModifyBody"
                                         :prop-code-delete-header="request.codeDeleteHeader"
                                         :prop-code-delete-body="request.codeDeleteBody"
                                         @on-change-transform-request="onChangeTransformRequest"
                                         @on-change-log-before-modify-request="onChangeLogBeforeModifyRequest"
                                         @on-change-log-after-modify-request="onChangeLogAfterModifyRequest"
                                         @on-change-add-header-request="onChangeAddHeaderRequest"
                                         @on-change-add-body-request="onChangeAddBodyRequest"
                                         @on-change-modify-header-request="onChangeModifyHeaderRequest"
                                         @on-change-modify-body-request="onChangeModifyBodyRequest"
                                         @on-change-delete-header-request="onChangeDeleteHeaderRequest"
                                         @on-change-delete-body-request="onChangeDeleteBodyRequest"
            />
          </q-tab-panel>

          <q-tab-panel name="response">
            <div class="text-h4 q-mb-md">Response</div>
                <EditorRequestResponseConfig config-type="response"
                                             :prop-status-code="response.statusCode"
                                             :prop-transform="response.transform"
                                             :prop-log-after-modify="response.logAfterModify"
                                             :prop-log-before-modify="response.logBeforeModify"
                                             :prop-code-add-header="response.codeAddHeader"
                                             :prop-code-add-body="response.codeAddBody"
                                             :prop-code-modify-header="response.codeModifyHeader"
                                             :prop-code-modify-body="response.codeModifyBody"
                                             :prop-code-delete-header="response.codeDeleteHeader"
                                             :prop-code-delete-body="response.codeDeleteBody"
                                             @on-change-status-code-response="onChangeStatusCodeResponse"
                                             @on-change-transform-response="onChangeTransformResponse"
                                             @on-change-log-before-modify-response="onChangeLogBeforeModifyResponse"
                                             @on-change-log-after-modify-response="onChangeLogAfterModifyResponse"
                                             @on-change-add-header-response="onChangeAddHeaderResponse"
                                             @on-change-add-body-response="onChangeAddBodyResponse"
                                             @on-change-modify-header-response="onChangeModifyHeaderResponse"
                                             @on-change-modify-body-response="onChangeModifyBodyResponse"
                                             @on-change-delete-header-response="onChangeDeleteHeaderResponse"
                                             @on-change-delete-body-repsonse="onChangeDeleteBodyResponse"
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
  components: {
    EditorRequestResponseConfig
  },
  data() {

    return {
      tab: 'request',
      splitterModel: 10,
      request: {
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },
      response: {
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
      }
    }
  },
  methods: {
    /* Request */
    onChangeTransformRequest(val) {
      this.request.transform = val;
    },
    onChangeLogBeforeModifyRequest(val) {
      this.request.logBeforeModify = val;
    },
    onChangeLogAfterModifyRequest(val) {
      this.request.logAfterModify = val;
    },
    onChangeAddHeaderRequest(val) {
      this.request.codeAddHeader = val;
    },
    onChangeAddBodyRequest(val) {
      this.request.codeAddBody = val;
    },
    onChangeModifyHeaderRequest(val) {
      this.request.codeModifyHeaderRequest = val
    },
    onChangeModifyBodyRequest(val) {
      this.request.codeModifyBody = val
    },
    onChangeDeleteHeaderRequest(val) {
      this.request.codeDeleteHeader = val
    },
    onChangeDeleteBodyRequest(val) {
      this.request.codeDeleteBody = val
    },

    /* Response */
    onChangeStatusCodeResponse(val){
      this.response.statusCode = val
    },
    onChangeTransformResponse(val) {
      console.log("on change transform response triggered")
      this.response.transform = val;
    },
    onChangeLogBeforeModifyResponse(val) {
      this.response.logBeforeModify = val;
    },
    onChangeLogAfterModifyResponse(val) {
      this.response.logAfterModify = val;
    },
    onChangeAddHeaderResponse(val) {
      this.response.codeAddHeader = val;
    },
    onChangeAddBodyResponse(val) {
      this.response.codeAddBody = val;
    },
    onChangeModifyHeaderResponse(val) {
      this.response.codeModifyHeaderRequest = val
    },
    onChangeModifyBodyResponse(val) {
      this.response.codeModifyBody = val
    },
    onChangeDeleteHeaderResponse(val) {
      this.response.codeDeleteHeader = val
    },
    onChangeDeleteBodyResponse(val) {
      this.response.codeDeleteBody = val
    },
  }
}
</script>

<style scoped>

</style>