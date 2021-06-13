<template>
  <div>
    <div class="column" style="height: 600px">
      <div class="col">
        <q-splitter
            v-model="splitterModel"
            v-if="!isLoading"
        >

          <template v-slot:before>
            <q-tabs
                v-model="tab"
                vertical
                class="text-teal"
            >
              <q-tab name="general" icon="description" label="General"
                     :alert="validators.configIdErr|| validators.aliasErr? 'red': false"/>
              <q-tab name="failure_response" icon="settings_application" label="Next Failure"
                     :alert="validators.statusCodeErr? 'red': false"/>
              <q-tab name="c_logics" icon="settings_application" label="CLogics" v-if="propSerialConfig!= null"/>
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
                style="height: 100%"
                keep-alive
                ref="tabs"

            >
              <q-tab-panel name="general">
                <div class="text-h4 q-mb-md">General</div>
                <div class="column" style="height: 500px" >
                 <div class="col-2">
                   <q-select v-model="selectedConfigId" :options="configureOptions" label="Select Configuration Id"
                             style="max-width: 300px"
                             ref="configId"
                             :rules="[ val => val && val.length > 0 || 'Please Select Configuration Id']"

                   />
                 </div>
                  <div class="col-1">
                    <q-input
                        ref="alias"
                        filled
                        v-model="alias"
                        label="Alias *"
                        hint="Config Alias"
                        :rules="[ val => val && val.length > 0 || 'Please type alias']"
                    />
                  </div>
                </div>

              </q-tab-panel>

              <q-tab-panel name="failure_response">
                <div class="text-h4 q-mb-md">Failure Response</div>
                <EditorRequestResponseConfig
                    ref="editor"
                    config-type="response"
                    v-model="editorData"
                />

              </q-tab-panel>

              <q-tab-panel name="c_logics" v-if="propSerialConfig!= null">
                <div class="column" style="height: 500px" >
                  <div class="col-1">
                    <q-btn @click="openDialogAddCLogic"> Add CLogic</q-btn>
                  </div>
                  <div class="col">
                    <q-table
                        style="height: 400px"
                        title="CLogic List"
                        :data="propSerialConfig? propSerialConfig.c_logics : [] "
                        :columns="cLogicTableColumns"
                        row-key="index"
                        virtual-scroll
                        :pagination.sync="pagination"
                        :rows-per-page-options="[0]"
                    >

                      <template v-slot:header="props">
                        <q-tr :props="props">
                          <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                          >
                            {{ col.label }}
                          </q-th>
                        </q-tr>
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props">

                          <q-td
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                          >

                            <p>{{ propSerialConfig.c_logics[props.rowIndex][col.name] }} </p>

                            <div
                                v-if="col.name==='action'"
                            >
                              <q-btn
                                  class="q-mr-sm"
                                  icon="edit"
                                  size="sm"
                                  label="Edit"
                                  color="primary"
                                  @click="selectCLogic( props.rowIndex)"
                              />

                              <q-btn
                                  icon="delete"
                                  size="sm"
                                  label="Delete"
                                  color="negative"
                                  @click="onDeleteCLogicSerial(props.row)"
                              />

                            </div>


                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </div>

              </q-tab-panel>


            </q-tab-panels>
          </template>

        </q-splitter>
      </div>
    </div>
    <q-dialog
        v-if="propSerialConfig "
        v-model="dialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card class="text-black">
        <q-bar>
          <q-space/>

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">

          <div class="text-h6">CLogic</div>
          <CLogicItemDetail :prop-c-logic=" propSerialConfig.c_logics[selectedIndex]"
                            @on-clogic-save="onCLogicSave" :prop-mode="mode"
                            :prop-config-id="propSerialConfig.id"
                            prop-request-type="serial"/>
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogDeleteCLogic" persistent v-if="selectedCLogic">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure want to delete cLogic with id {{selectedCLogic.id}} ? </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" :loading="isDeletingCLogic" @click="deleteCLogicSerial($route.params.id, propSerialConfig.id,selectedCLogic.id)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-btn @click="onSaveClick">Confirm</q-btn>

  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";

import {mapActions, mapGetters} from "vuex";
import CLogicItemDetail from "./CLogicItemDetail";

export default {
  props: {
    propSerialConfig: Object,
    configureOptions: Array,
    propIndex: Number,
    propMode: String,
    propConfigureId: String,
  },
  components: {
    CLogicItemDetail,
    EditorRequestResponseConfig
  },
  computed: {
    ...mapGetters({
      serial: 'serial/getSerial'
    })
  },

  data() {
    return {
      splitterModel: 10,
      tab: 'general',
      isLoading: false,
      isLoadConfigures: false,

      alias: null,
      selectedConfigId: null,
      options: [],

      id: null,
      editorData : {
        /* Next Failure*/
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

      /* C Logics */
      cLogicTableColumns: [
        {
          name: 'id',
          label: 'Id',
          field: row => row.id,
          align: 'left',
        },

        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],

      pagination: {
        rowsPerPage: 1000
      },

      /* for dialog */
      selectedCLogic: null,
      mode: 'add',
      selectedIndex: -1,
      dialog: false,
      maximizedToggle: true,

      validators: {
        configIdErr: false,
        aliasErr: false,
        statusCodeErr: false,
        formHasError: false,
        errCount: 0
      },

      tabNames: ["general", "failure_response", "c_logics"],
      globalErrors: [],
      alertDialog: false,

      dialogDeleteCLogic : false,
      isDeletingCLogic : false,

    }
  },
  methods: {
    ...mapActions({
      addCLogicSerial: 'serial/storeSingleCLogic',
      updateCLogicSerial: 'serial/updateSingleCLogic',
      actionFetchSerial: 'serial/fetchSerial',
      actionFetchConfigures: 'configures/fetchConfigures',
      actionStoreSerial: 'serial/storeSerial',
      storeSingleConfig: 'serial/storeSingleConfig',
      updateSpecificConfig: 'serial/updateSingleConfig',
      actionDeleteCLogicSerial : 'serial/deleteCLogic'
    }),
    onDeleteCLogicSerial(cLogic){
      this.selectedCLogic = cLogic
     this.dialogDeleteCLogic = true;
    },
    async deleteCLogicSerial(projectId, configId, cLogicId){
      this.isDeletingCLogic = true;
     try {
       await this.actionDeleteCLogicSerial({projectId,configId,cLogicId})
       this.$q.notify({
         message: 'Delete Success.',
         color: 'secondary'
       })
       this.dialogDeleteCLogic = false;
     } catch (err) {
       this.$q.notify({
         message: 'Somethings wrong when deleting c logic serial.',
         color: 'negative'
       })
       console.log(err)
     }
     this.isDeletingCLogic = false;
    },
    validateInput() {
      this.validators.errCount = 0
      this.globalErrors = []
      this.validators.formHasError = false;
      this.$refs.configId.validate();
      this.validators.configIdErr = this.$refs.configId.hasError

      this.$refs.alias.validate();
      this.validators.aliasErr = this.$refs.alias.hasError

      this.$refs.editor.$refs.statusCode.validate();

      this.validators.statusCodeErr = this.$refs.editor.$refs.statusCode.hasError

      if (this.validators.configIdErr) {
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.configId.innerErrorMessage)

      }
      if (this.validators.aliasErr) {
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.alias.innerErrorMessage)
      }

      if (this.validators.statusCodeErr) {
        this.validators.errCount++
        this.globalErrors.push(this.$refs.editor.$refs.statusCode.innerErrorMessage)
      }
      if (this.validators.errCount > 0) {
        this.validators.formHasError = true
        this.alertDialog = true;

      }
    },
    visitTabs() {
      let traversal = this.tabNames.reduce((promiseChain, item) => {
        return promiseChain.then(() => new Promise(resolve => {
              console.log("done with", item)
              resolve()
              this.$refs.tabs.goTo(item)
            })
        )
      }, Promise.resolve())


      traversal.then(() => {
        this.$refs.tabs.goTo('general')
      })
    },
    openDialogAddCLogic() {
      this.mode = 'add'
      this.dialog= true
    },
    constructData() {
      return {
        project_id: this.$route.params.id,
        configure_id: this.selectedConfigId,
        alias: this.alias,
        failure_response: {
          status_code: this.editorData.statusCode,
          transform: this.editorData.transform,
          adds: {
            header: this.editorData.codeAddHeader,
            body: this.editorData.codeAddBody
          },
          modifies: {
            header: this.editorData.codeModifyHeader,
            body: this.editorData.codeModifyBody
          },
          deletes: {
            header: this.editorData.codeDeleteHeader,
            body: this.editorData.codeDeleteBody
          }
        },
        mode: this.propMode,
      }
    },
    async onSaveClick() {
      this.validateInput()
      if (!this.validators.formHasError) {
        let data = this.constructData()
        if (this.propMode === 'edit') {
          /* add id */
          try {
            data.id = this.id;
            await this.updateSpecificConfig(data);
            this.$q.notify({
              message: 'Update Config Serial Success.',
              color: 'secondary'
            })

            this.$emit('on-confirm-clicked')
          } catch (e) {
            console.log(e)
          }
        } else {
          try {
            await this.storeSingleConfig(data)
            this.$q.notify({
              message: 'Store Config Serial Success.',
              color: 'secondary'
            })
            this.$emit('on-confirm-clicked')
          } catch (e) {
            console.log(e)
          }
        }
      }
    },

    async onCLogicSave(data) {
      if (this.mode === 'edit') {
          await this.updateCLogicSerial(data)
        this.$q.notify({
          message: 'Update CLogic Success',
          color: 'secondary'
        })

        this.dialog = false
      } else {
        try {
            await this.addCLogicSerial(data)
          this.$q.notify({
            message: 'Add CLogic Success',
            color: 'secondary'
          })
          this.$emit('on-clogic-save', data)
        } catch (err) {
          console.log(err)
        }
      }

    },
    selectCLogic(index) {
      this.selectedIndex = index
      this.mode = 'edit';
      this.dialog = true
    },
    async loadConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        await this.actionFetchConfigures(projectId)
        this.options = this.constructOptionsConfigId(this.configs)
      } catch (e) {
        console.log(e)
      }
      this.isLoadConfigures = false;
    },
    constructOptionsConfigId(configures) {
      let options = []
      configures.forEach(e => {
        options.push(
            e.id,
        )
      });
      return options
    },

    fillDataFromProps(config) {
      const {alias, configure_id, failure_response, id} = config
      this.id = id
      this.alias = alias
      this.selectedConfigId = configure_id

      /* Next Failure*/
      const {status_code, transform, adds, modifies, deletes, log_before_modify, log_after_modify} = failure_response
      this.editorData.statusCode = status_code,
          this.editorData.transform = transform,
          this.editorData.codeAddHeader = adds.header,
          this.editorData.codeAddBody = adds.body,
          this.editorData.codeModifyHeader = modifies.header
      this.editorData.codeModifyBody = modifies.body,
          this.editorData.codeDeleteHeader = deletes.header,
          this.editorData.codeDeleteBody = deletes.body,

          this.editorData.logBeforeModify = log_before_modify,
          this.editorData.logAfterModify = log_after_modify

    }
  },
  async mounted() {

    if (this.propMode === 'edit') {
      this.fillDataFromProps(this.propSerialConfig)
    }
  },
  created() {

    this.visitTabs()
  }
}
</script>

<style scoped>

</style>