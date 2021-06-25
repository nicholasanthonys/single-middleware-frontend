<template>
  <ValidationObserver>
    <div class="q-pa-md q-gutter-sm" v-if="!hideErrorBanner">
      <q-banner rounded class="text-white bg-red"
                v-if="!isObjEmpty(resultValidationObj)">
        <ul>
          <li v-for="(value, name) in resultValidationObj" :key="name">
            <p>
              <b>{{ name }}</b>: {{ value }}
            </p>
          </li>
        </ul>
      </q-banner>
    </div>

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
                data status code is {{data.statusCode}}
                <q-select
                    ref="statusCode"
                    filled
                    v-model="data.statusCode"
                    :options="statusOptions"
                    label="Status Code"
                    color="teal"
                    style="max-width: 200px"
                    options-selected-class="text-deep-orange"
                    map-options
                    :rules="[ val => val != null && val >= 0 ||
                    `Please fill response status code`]"

                >
                  <template v-slot:option="scope">
                    <q-expansion-item
                        expand-separator
                        group="somegroup"
                        :default-opened="hasChild(scope)"
                        header-class="text-weight-bold"
                        :label="scope.opt.label"

                    >
                      <template >
                        <div v-for="child in scope.opt.children"
                             :key="child.value">
                          <q-item
                              :key="child.label"
                              clickable
                              v-ripple
                              v-close-popup
                              @click="clickItemStatusCode(child.value)"
                              :class="{ 'bg-light-blue-1': data.statusCode===
                            child.value}"
                          >
                            <q-item-section>
                              <q-item-label v-html="child.label" class="q-ml-md" ></q-item-label>
                            </q-item-section>
                          </q-item>
                        </div>

                      </template>
                    </q-expansion-item>
                  </template>
                </q-select>
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
                    outlined v-model="data.requestMethod"
                    :options="methodOptions" label="Request Method"
                    hint="Request Method'"
                    @input="emitValue"
                    :rules="[ val => val && val.length > 0 || 'Please fill Request Method']"
                    style="max-width: 200px"/>

                <br/>
              </div>

              <div class="col-1">
                <q-select

                    outlined v-model="data.transform"
                    :options="transformOptions" label="Transform"
                    :hint="configType === 'request' ? 'Request Transform' : 'Response Transform'  "
                    @input="emitValue"
                    style="max-width: 200px"/>
              </div>
              <br/>
              <div class="col-2" v-if="haveLog">
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <p class="text-h5">Log Before Modify</p>
                    <Editor v-model="data.logBeforeModify"
                            event-name="on-change-log-before-modify"
                            @input="emitValue" ref="logBeforeModify"/>
                  </div>
                  <div class="col-12 col-lg-6">
                    <p class="text-h5">Log After Modify</p>
                    <Editor v-model="data.logAfterModify"
                            event-name="on-change-log-after-modify"
                            @input="emitValue" ref="logAfterModify"/>
                  </div>
                </div>
              </div>
            </div>


          </q-tab-panel>


          <q-tab-panel name="Adds.Header">
            <div class="text-h4 q-mb-md">Add Header</div>
            <Editor v-model="data.codeAddHeader"
                    :event-name="'on-change-add-header'"
                    @input="emitValue" ref="codeAddHeader"/>
          </q-tab-panel>

          <q-tab-panel name="Adds.Body">
            <div class="text-h4 q-mb-md">Add Body</div>
            <Editor v-model="data.codeAddBody"
                    :event-name="'on-change-add-body'" @input="emitValue"
                    ref="codeAddBody"/>
          </q-tab-panel>

          <q-tab-panel name="Adds.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Add Query</div>
            <Editor v-model="data.codeAddQuery"
                    :event-name="'on-change-add-query'"
                    @input="emitValue" ref="codeAddQuery"/>
          </q-tab-panel>


          <q-tab-panel name="Modifies.Header">
            <div class="text-h4 q-mb-md">Modify Header</div>
            <Editor v-model="data.codeModifyHeader"
                    :event-name="'on-change-modify-header'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Body">
            <div class="text-h4 q-mb-md">Modify Body</div>
            <Editor v-model="data.codeModifyBody"
                    :event-name="'on-change-modify-body'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Modifies.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Modify Query</div>
            <Editor v-model="data.codeModifyQuery"
                    :event-name="'on-change-modify-query'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Header">
            <div class="text-h4 q-mb-md">Delete Header</div>
            <Editor v-model="data.codeDeleteHeader"
                    :event-name="'on-change-delete-header'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Body">
            <div class="text-h4 q-mb-md">Delete Body</div>
            <Editor v-model="data.codeDeleteBody"
                    :event-name="'on-change-delete-body'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="Deletes.Query" v-if="configType === 'request' ">
            <div class="text-h4 q-mb-md">Delete Query</div>
            <Editor v-model="data.codeDeleteQuery"
                    :event-name="'on-change-delete-query'"
                    @input="emitValue"/>
          </q-tab-panel>

          <q-tab-panel name="CLogics" v-if="enableCLogics">
            <div class="text-h4 q-mb-md">Request Logic</div>
            <div class="col-1">
              <q-btn @click="openDialogAddCLogic"> Add CLogic</q-btn>
            </div>
            <CLogicTable :c-logics="data.cLogics"
                         @on-select-clogic="onSelectCLogic"
                         @on-delete-clogic="onDeleteCLogic"/>
          </q-tab-panel>

        </q-tab-panels>
      </template>
    </q-splitter>
    <q-dialog
        v-model="dialogCLogic"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card class="text-black">
        <q-bar>
          <q-space/>

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false"
                 :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle"
                       content-class="bg-white text-primary">Minimize
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true"
                 :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle"
                       content-class="bg-white text-primary">Maximize
            </q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">

          <div class="text-h6">CLogic</div>
          <CLogicItemDetail v-if="cLogicMode === 'add'"
                            @on-clogic-save="onCLogicSave"
                            :prop-mode="cLogicMode"
                            :prop-index="selectedCLogicIndex"
                            prop-request-type="serial"/>
          <CLogicItemDetail v-if="cLogicMode === 'edit'"
                            :prop-c-logic="data.cLogics[selectedCLogicIndex]"
                            @on-clogic-save="onCLogicSave"
                            :prop-mode="cLogicMode"
                            :prop-index="selectedCLogicIndex"
                            prop-request-type="serial"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </ValidationObserver>
</template>

<script>
import Editor from "./Editor";
import TreeConfigCircularResponse from "../../models/TreeConfigResponse";
import TreeConfigRequest from "../../models/TreeConfigRequest";
import TreeConfigRequestWithClogics
  from "../../models/TreeConfigRequestWithCLogic";
import CLogicTable from "../CLogic/CLogicTable";
import CLogicItemDetail
  from "../../views/SerialParallelConfig/CLogicItemDetail";
import {mapActions} from "vuex";
import {isObjectEmpty, traverseObj} from "../../util/syntaxchecker";
import {statusCodeOptions} from "../../util/statuscode";

export default {
  name: "EditorRequestResponseConfig",
  props: [
    'value',
    'configType',
    'haveLog',
    'enableCLogics',
    'configureId',
    'projectId',
    'hideErrorBanner',
    'noValidate'
  ],
  components: {CLogicItemDetail, CLogicTable, Editor},
  watch: {
    enableCLogics() {
      this.simple = [this.determineTreeMenu()]
    },
  },

  data() {
    return {
      statusOptions : statusCodeOptions,
      resultValidationObj: {},
      error: null,
      splitterModel: 20,
      selected: "General",
      cLogicMode: 'add',
      dialogCLogic: false,
      maximizedToggle: true,
      selectedCLogicIndex: -1,

      data: {

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

        codeModifyHeader: this.value.codeModifyHeader,
        codeModifyBody: this.value.codeModifyBody,
        codeModifyQuery: this.value.codeModifyQuery,

        codeDeleteHeader: this.value.codeDeleteHeader,
        codeDeleteBody: this.value.codeDeleteBody,

        codeDeleteQuery: this.value.codeDeleteQuery,

        cLogics: this.value.cLogics
      },
      simple: [
        this.determineTreeMenu()
      ],

      transformOptions: ['ToJson', 'ToXml'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  methods: {
    ...mapActions({
      storeRequestCLogic: 'configures/storeConfigureCLogicRequest',
      updateRequestCLogic: 'configures/updateConfigureCLogicRequest',
      deleteRequestCLogic: 'configures/deleteConfigureCLogicRequest'
    }),
    getLabel (scope) {
      console.log(scope)
      return scope.label
    },
    clickItemStatusCode(code){
     this.data.statusCode= code;
     this.emitValue()
    },
    hasChild (scope) {
      if(scope.opt.children){
        return scope.opt.children.some(c => c.value === this.data.statusCode)
      }
      return false;
    },
    determineTreeMenu() {
      if (this.configType === "request") {
        if (this.enableCLogics) {
          return TreeConfigRequestWithClogics
        }
        return TreeConfigRequest
      }
      return TreeConfigCircularResponse

    },
    isObjEmpty(obj) {
      console.log("is object empty for object : ")
      console.log(obj)
      console.log("is object null ? ")
      console.log(obj === null)
      return isObjectEmpty(obj)
    },
    constructObjToTraverse() {
      if (this.configType === 'request') {
        return {
          logBeforeModify: this.data.logBeforeModify,
          logAfterModify: this.data.logAfterModify,

          codeAddHeader: this.data.codeAddHeader,
          codeAddBody: this.data.codeAddBody,
          codeAddQuery: this.data.codeAddQuery,

          codeModifyHeader: this.data.codeModifyHeader,
          codeModifyBody: this.data.codeModifyBody,
          codeModifyQuery: this.data.codeModifyQuery,

          codeDeleteHeader: this.data.codeDeleteHeader,
          codeDeleteBody: this.data.codeDeleteBody,

          codeDeleteQuery: this.data.codeDeleteQuery,
        }
      } else {
        return {
          logBeforeModify: this.data.logBeforeModify,
          logAfterModify: this.data.logAfterModify,

          codeAddHeader: this.data.codeAddHeader,
          codeAddBody: this.data.codeAddBody,

          codeModifyHeader: this.data.codeModifyHeader,
          codeModifyBody: this.data.codeModifyBody,

          codeDeleteHeader: this.data.codeDeleteHeader,
          codeDeleteBody: this.data.codeDeleteBody,
        }
      }

    },
    emitValue() {
      this.resultValidationObj = traverseObj(this.constructObjToTraverse())
      if (!this.isObjEmpty(this.resultValidationObj)) {
        this.$emit("on-validate-result", this.resultValidationObj)
      }
      this.$emit("on-validate-result", {})

      this.$emit('input', this.data)
    },
    async onCLogicSave(cLogic) {
      let {
        id,
        data,
        rule,
        next_success,
        next_failure,
        response,
        failure_response
      } = cLogic
      if (this.cLogicMode === 'add') {
        try {
          let res = await this.storeRequestCLogic({
            project_id: this.projectId,
            configure_id: this.configureId,
            c_logic: {
              data, rule, next_success, next_failure, response, failure_response
            }
          })
          this.$q.notify({
            message: 'Add CLogic Success.',
            color: 'secondary'
          })

          this.data.cLogics.push(res.data)
          this.$emit('input', this.data)
        } catch (e) {
          console.log(e)
          this.$q.notify({
            message: e.response.data.message ? e.response.data.message : 'Something Wrong',
            color: 'negative'
          })
        }
      } else {
        try {
          let res = await this.updateRequestCLogic({
            project_id: this.projectId,
            configure_id: this.configureId,
            c_logic: {
              id,
              data,
              rule,
              next_success,
              next_failure,
              response,
              failure_response
            }
          })
          this.$q.notify({
            message: 'Edit CLogic Success.',
            color: 'secondary'
          })

          let index = this.data.cLogics.findIndex(e => e.id === id)
          if (index >= 0) {
            let temp = [...this.data.cLogics]
            temp[index] = res.data

            this.data.cLogics = [...temp]
          }
          this.$emit('input', this.data)
        } catch (e) {
          console.log(e)
          this.$q.notify({
            message: e.response.data.message ? e.response.data.message : 'Something Wrong',
            color: 'negative'
          })
        }
      }
      this.dialogCLogic = false
    },
    onSelectCLogic(value) {
      const {cLogicIndex} = value
      this.selectedCLogicIndex = cLogicIndex
      this.cLogicMode = 'edit'
      this.dialogCLogic = true
    },
    async onDeleteCLogic(value) {
      const {cLogic} = value
      const {id} = cLogic
      console.log("on deletecLogic triggered id : " + id)
      console.log(cLogic)
      try {
        await this.deleteRequestCLogic({
          id,
          project_id: this.projectId,
          configure_id: this.configureId,
        })
        // make request to delete configure cLogic
        // let temp = this.data.cLogics.filter(c => c.id !== id)
        this.data.cLogics = this.data.cLogics.filter(c => c.id !== id)
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        this.emitValue()
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: err.response.data.message ? err.response.data.message : 'Something Wrong',
          color: 'negative'
        })
      }

    },
    openDialogAddCLogic() {
      this.dialogCLogic = true
    },

  }
}
</script>

<style scoped>

</style>