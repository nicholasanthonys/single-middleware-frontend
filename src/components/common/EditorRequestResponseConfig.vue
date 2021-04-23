<template>
  <q-splitter
      v-model="splitterModel"
      style="height: 600px"
  >

    <template v-slot:before>
      <div class="q-pa-md">
        <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            :selected.sync="selected"
            default-expand-all
        />
      </div>
    </template>

    <template v-slot:after>
      <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
      >

        <q-tab-panel name="General">
          <div class="text-h4 q-mb-md">General</div>

          <div class="column">
            <div class="col col-md-5">
              <q-input
                  v-if="configType ==='response' "
                  :value="statusCode"
                  type="number"
                  label="Status Code"
                  hint="Response Status Code"
                  filled
                  style="max-width: 200px"
                  @input="onChangeStatusCode"
              />

            </div>
            <br/>
            <div class="col col-md-5">
              <q-select outlined :value="transform" :options="transformOptions" label="Transform"
                        :hint="configType === 'request' ? 'Request Transform' : 'Response Transform'  "
                        @input="onChangeTransform"
                        style="max-width: 200px"/>
            </div>
            <br/>
            <div class="row">
              <div class="col-12 col-lg-6">
                <p class="text-h5">Log Before Modify</p>
                <Editor :prop-code="logBeforeModify" event-name="on-change-log-before-modify" @on-change-log-before-modify="onChangeLogBeforeModify"/>
              </div>
              <div class="col-12 col-lg-6">
                <p class="text-h5">Log After Modify</p>
                <Editor :prop-code="logAfterModify" event-name="on-change-log-after-modify" @on-change-log-after-modify="onChangeLogAfterModify"/>
              </div>
            </div>
          </div>


        </q-tab-panel>




        <q-tab-panel name="Adds.Header">
          <div class="text-h4 q-mb-md">Add Header</div>
          <Editor :propCode="codeAddHeader" :event-name="'on-change-add-header'"
                  @on-change-add-header="onChangeAddHeader"/>
        </q-tab-panel>

        <q-tab-panel name="Adds.Body">
          <div class="text-h4 q-mb-md">Add Body</div>
          <Editor :propCode="codeAddBody" :event-name="'on-change-add-body'" @on-change-add-body="onChangeAddBody"/>
        </q-tab-panel>

        <q-tab-panel name="Adds.Query" v-if="configType === 'request' ">
          <div class="text-h4 q-mb-md">Add Query</div>
          <Editor :propCode="codeAddQuery" :event-name="'on-change-add-query'"
                  @on-change-add-query="onChangeAddQuery"/>
        </q-tab-panel>

        <q-tab-panel name="Modifies.Header">
          <div class="text-h4 q-mb-md">Modify Header</div>
          <Editor :propCode="codeModifyHeader" :event-name="'on-change-modify-header'"
                  @on-change-modify-header="onChangeModifyHeader"/>
        </q-tab-panel>

        <q-tab-panel name="Modifies.Body">
          <div class="text-h4 q-mb-md">Modify Body</div>
          <Editor :propCode="codeModifyBody" :event-name="'on-change-modify-body'"
                  @on-change-modify-body="onChangeModifyBody"/>
        </q-tab-panel>

        <q-tab-panel name="Modifies.Query" v-if="configType === 'request' ">
          <div class="text-h4 q-mb-md">Modify Query</div>
          <Editor :propCode="codeModifyQuery" :event-name="'on-change-modify-query'"
                  @on-change-modify-query="onChangeModifyQuery"/>
        </q-tab-panel>

        <q-tab-panel name="Deletes.Header">
          <div class="text-h4 q-mb-md">Delete Header</div>
          <Editor :propCode="codeDeleteHeader" :event-name="'on-change-delete-header'"
                  @on-change-delete-header="onChangeDeleteHeader"/>
        </q-tab-panel>

        <q-tab-panel name="Deletes.Body">
          <div class="text-h4 q-mb-md">Delete Body</div>
          <Editor :propCode="codeDeleteBody" :event-name="'on-change-delete-body'"
                  @on-change-delete-body="onChangeDeleteBody"/>
        </q-tab-panel>

        <q-tab-panel name="Deletes.Query" v-if="configType === 'request' ">
          <div class="text-h4 q-mb-md">Delete Query</div>
          <Editor :propCode="codeDeleteQuery" :event-name="'on-change-delete-query'"
                  @on-change-delete-query="onChangeDeleteQuery"/>
        </q-tab-panel>

      </q-tab-panels>
    </template>
  </q-splitter>

</template>

<script>
import Editor from "./Editor";
import TreeConfigCircularResponse from "../../models/TreeConfigResponse";
import TreeConfigRequest from "../../models/TreeConfigRequest";

export default {
  props: [
    'configType',
    'propCodeAddHeader',
    'propCodeAddBody',
    'propCodeAddQuery',
    'propCodeModifyHeader',
    'propCodeModifyBody',
    'propCodeModifyQuery',
    'propCodeDeleteHeader',
    'propCodeDeleteBody',
    'propCodeDeleteQuery',

    'propStatusCode',
    'propTransform',
    'propLogBeforeModify',
    'propLogAfterModify',

    ],
  components: {Editor},
  watch: {
    // propCodeAddHeader(val) {
    //   this.codeAddHeader = val;
    // }
  },
  data() {
    return {
      splitterModel : 20,
      selected: "General",
      statusCode: this.propStatusCode,
      transform: this.propTransform,
      logBeforeModify: this.logBeforeModify,
      logAfterModify: this.logAfterModify,
      codeAddHeader: this.propCodeAddHeader,
      codeAddBody: this.propCodeAddBody,
      codeAddQuery: this.propCodeAddQuery,
      codeModifyHeader: this.propCodeModifyHeader,
      codeModifyBody: this.propCodeModifyBody,
      codeModifyQuery: this.propCodeModifyQuery,
      codeDeleteHeader: this.propCodeDeleteHeader,
      codeDeleteBody: this.propCodeDeleteBody,
      codeDeleteQuery: this.propCodeDeleteQuery,

      simple: [
        this.configType === "request" ? TreeConfigRequest : TreeConfigCircularResponse
      ],

      transformOptions: ['ToJson', 'ToXml']
    }
  },
  methods: {
    onChangeStatusCode(val) {
      this.$emit('on-change-status-code-' + this.configType, val)
      this.statusCode = val;
    },
    onChangeTransform(val) {
      this.$emit('on-change-transform-' + this.configType, val)
      this.transform = val;
    },
    onChangeLogBeforeModify(val) {
      this.$emit('on-change-log-before-modify-' + this.configType, val)
      this.logBeforeModify = val;
    },
    onChangeLogAfterModify(val) {
      this.$emit('on-change-log-after-modify-' + this.configType, val)
      this.logAfterModify = val;
    },
    onChangeAddHeader(val) {
      this.$emit('on-change-add-header-' + this.configType, val)
      this.codeAddHeader = val;
    },
    onChangeAddBody(val) {
      this.$emit('on-change-add-body-' + this.configType, val)
      this.codeAddBody = val
    },
    onChangeAddQuery(val) {
      this.$emit('on-change-add-query-' + this.configType, val)
      this.codeAddQuery = val
    },
    onChangeModifyHeader(val) {
      this.$emit('on-change-modify-header-' + this.configType, val)
      this.codeModifyHeader = val
    },
    onChangeModifyBody(val) {
      this.$emit('on-change-modify-body-' + this.configType, val)
      this.codeModifyBody = val
    },
    onChangeModifyQuery(val) {
      this.$emit('on-change-modify-query-' + this.configType, val)
      this.codeModifyQuery = val
    },
    onChangeDeleteHeader(val) {
      this.$emit('on-change-delete-header-' + this.configType, val)
      this.codeDeleteHeader = val
    },
    onChangeDeleteBody(val) {
      this.$emit('on-change-delete-body', val)
      this.codeDeleteBody = val
    },
    onChangeDeleteQuery(val) {
      this.$emit('on-change-delete-query-' + this.configType, val)
      this.codeDeleteQuery = val
    }


  }
}
</script>

<style scoped>

</style>