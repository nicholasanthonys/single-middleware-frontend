<template>
  <ValidationObserver>
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
            keep-alive
        >

          <q-tab-panel name="General">
            <div class="text-h4 q-mb-md">General</div>

            <div class="column">
              <div class="col-1" v-if="configType ==='response' ">
                <q-input
                    ref="statusCode"
                    v-model="data.statusCode"
                    type="number"
                    label="Status Code"
                    hint="Response Status Code"
                    filled
                    style="max-width: 200px"
                    :rules="[ val => val > 0 || `Please fill response status code`]"
                    @input="emitValue"

                />
                <br/>
              </div>

              <div class="col-1" v-if="configType ==='request' && propEnableLoop ">
                <q-input

                    filled
                    type="text"
                    v-model="data.loop"
                    label="Loop"
                    hint="Request Loop only available for parallel."
                    @input="emitValue"
                />

                <br/>
              </div>

              <div class="col-1" v-if="configType ==='request' ">
                <q-input
                    ref="destinationURL"
                    filled
                    type="text"
                    v-model="data.destinationUrl"
                    label="Destination Url *"
                    hint="Request Destination Url"
                    :rules="[ val => val && val.length > 0 || 'Please fill Request Destination URL']"
                    @input="emitValue"
                />

                <br/>
              </div>

              <div class="col-1" v-if="configType ==='request' ">
                <q-input

                    filled
                    type="text"
                    v-model="data.destinationPath"
                    label="Destination Path *"
                    hint="Destination Url's Path"
                    @input="emitValue"
                />
                <br/>
              </div>

              <div class="col-1" v-if="configType ==='request' ">
                <q-select
                    ref="requestMethod"
                    outlined v-model="data.requestMethod" :options="methodOptions" label="Request Method"
                    hint="Request Method'"
                    @input="emitValue"
                    :rules="[ val => val && val.length > 0 || 'Please fill Request Method']"
                    style="max-width: 200px"/>

                <br/>
              </div>

              <div class="col-1">
                <q-select

                    outlined v-model="data.transform" :options="transformOptions" label="Transform"
                    :hint="configType === 'request' ? 'Request Transform' : 'Response Transform'  "
                    @input="emitValue"
                    style="max-width: 200px"/>
              </div>
              <br/>
              <div class="col-2" v-if="haveLog">
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <p class="text-h5">Log Before Modify</p>
                    <Editor v-model="data.logBeforeModify" event-name="on-change-log-before-modify"
                            @input="emitValue"/>
                  </div>
                  <div class="col-12 col-lg-6">
                    <p class="text-h5">Log After Modify</p>
                    <Editor v-model="data.logAfterModify" event-name="on-change-log-after-modify"
                            @input="emitValue"/>
                  </div>
                </div>
              </div>
            </div>


          </q-tab-panel>


          <q-tab-panel name="Adds.Header">
            <div class="text-h4 q-mb-md">Add Header</div>
            <Editor v-model="data.codeAddHeader" :event-name="'on-change-add-header'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Adds.Body">
            <div class="text-h4 q-mb-md">Add Body</div>
            <Editor v-model="data.codeAddBody" :event-name="'on-change-add-body'" @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Adds.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Add Query</div>
            <Editor v-model="data.codeAddQuery" :event-name="'on-change-add-query'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Adds.Param" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Add Param</div>
            <Editor v-model="data.codeAddParam" :event-name="'on-change-add-param'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Header">
            <div class="text-h4 q-mb-md">Modify Header</div>
            <Editor v-model="data.codeModifyHeader" :event-name="'on-change-modify-header'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Body">
            <div class="text-h4 q-mb-md">Modify Body</div>
            <Editor v-model="data.codeModifyBody" :event-name="'on-change-modify-body'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Modify Query</div>
            <Editor v-model="data.codeModifyQuery" :event-name="'on-change-modify-query'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Param" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Modify Param</div>
            <Editor v-model="data.codeModifyParam" :event-name="'on-change-modify-param'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Header">
            <div class="text-h4 q-mb-md">Delete Header</div>
            <Editor v-model="data.codeDeleteHeader" :event-name="'on-change-delete-header'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Body">
            <div class="text-h4 q-mb-md">Delete Body</div>
            <Editor v-model="data.codeDeleteBody" :event-name="'on-change-delete-body'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Delete Query</div>
            <Editor v-model="data.codeDeleteQuery" :event-name="'on-change-delete-query'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Param" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Delete Param</div>
            <Editor v-model="data.codeDeleteParam" :event-name="'on-change-delete-param'"
                    @input="emitValue"/>
          </q-tab-panel>

        </q-tab-panels>
      </template>
    </q-splitter>
  </ValidationObserver>
</template>

<script>
import Editor from "./Editor";
import TreeConfigCircularResponse from "../../models/TreeConfigResponse";
import TreeConfigRequest from "../../models/TreeConfigRequest";

export default {
  props: [
    'value',
    'configType',
    'haveLog',
    'propEnableLoop'


  ],
  components: {Editor},

  data() {
    return {
      error: null,
      splitterModel: 20,
      selected: "General",

      data: {
        loop: this.value.loop,

        requestMethod: this.value.requestMethod,
        destinationUrl: this.value.destinationUrl,
        destinationPath: this.value.destinationPath,

        statusCode: this.value.statusCode,
        transform: this.value.transform,
        logBeforeModify: this.value.logBeforeModify,
        logAfterModify: this.value.logAfterModify,

        codeAddHeader: this.value.codeAddHeader,
        codeAddBody: this.value.codeAddBody,
        codeAddQuery: this.value.codeAddQuery,
        codeAddParam: this.value.codeAddParam,

        codeModifyHeader: this.value.codeModifyHeader,
        codeModifyBody: this.value.codeModifyBody,
        codeModifyQuery: this.value.codeModifyQuery,
        codeModifyParam: this.value.codeModifyParam,

        codeDeleteHeader: this.value.codeDeleteHeader,
        codeDeleteBody: this.value.codeDeleteBody,

        codeDeleteQuery: this.value.codeDeleteQuery,
        codeDeleteParam: this.value.codeDeleteParam,
      },
      simple: [
        this.configType === "request" ? TreeConfigRequest : TreeConfigCircularResponse
      ],

      transformOptions: ['ToJson', 'ToXml'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  methods: {
    emitValue() {
      this.$emit('input', this.data)
    },

  }
}
</script>

<style scoped>

</style>