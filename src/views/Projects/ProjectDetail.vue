<template>
  <div class="full-height">
    <form class="full-height" @submit.prevent="onSaveClicked">
      <div class="column" style="height: 100%">
        <div class="col">
          <q-splitter
              class="full-height"
              v-model="splitterModel"
              v-if="!isLoading"
          >

            <template v-slot:before>
              <q-tabs
                  v-model="tab"
                  vertical
                  class="text-teal"


              >
                <q-tab name="general" icon="description" label="General" :alert="validators.nameErr ? 'red': false"/>
                <q-tab name="base" icon="settings_application" label="Base Settings"
                       :alert="validators.statusCodeErr? 'red': false"/>
                <q-tab name="configures" icon="settings_application" label="Configures"
                       v-if="$route.name ==='Projects.Detail' "/>
                <q-tab name="serial/parallel" icon="settings_application" label="Serial/Parallel"
                       v-if="$route.name === 'Projects.Detail' "/>
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

                  <q-input
                      filled
                      v-model="name"
                      label="Name *"
                      hint="Project Name"
                      :rules="[ val => val && val.length > 0 || 'Please type Project Name']"
                      name="name"
                      ref="name"
                  />
                  <p class="text-negative"> {{ errorTab1 }}</p>
                  <br/>
                  <q-input
                      filled
                      v-model="description"
                      label="Description *"
                      hint="Project Description"
                      type="textarea"
                  />

                </q-tab-panel>

                <q-tab-panel name="base">
                  <div class="text-h4 q-mb-md">Base Settings</div>
                  <q-input
                      v-model.number="maxCircular"
                      label="Max Circular Limit*"
                      hint="Maximum limit of circular request"
                      type="number"
                      ref="maxCircular"
                      :rules="[ val => val && val > 0  || 'Please specify max circular request']"
                      filled
                  />

                  <br/>
                    code add header is {{editorData}}
                    <EditorRequestResponseConfig ref="editor"
                                                 config-type="response"
                                                 :prop-enable-loop="false"
                                                 :have-log="false"
                                                v-model="editorData"
                    />

                </q-tab-panel>

                <q-tab-panel name="configures" style="height: 100%;"  v-if="$route.name === 'Projects.Detail'">
                  <Configures :project-id="$route.params.id" :prop-configs="configs" v-if="!isLoadConfigures"/>
                  <div style="height: 100%;" v-else class="flex justify-center items-center">
                    <q-spinner
                        color="primary"
                        size="3em"
                    />
                  </div>

                </q-tab-panel>

                <q-tab-panel name="serial/parallel"  v-if="$route.name === 'Projects.Detail'">
                  <ConfigSerialList :prop-serial="serial" :prop-project-id="$route.params.id"
                                    @on-confirm-serial-config="onConfirmSerialConfig"/>
                  <br/>

                  <ParallelConfigList :prop-parallel="parallel"/>
                </q-tab-panel>


              </q-tab-panels>
            </template>

          </q-splitter>
        </div>

        <div class="col-1">
          <div class="row">
            <div class="col-1 text-center">
              <q-btn type="submit">Save</q-btn>
            </div>
            <div class="col-1" v-if="$route.name === 'Projects.Detail' ">
              <q-btn @click="confirmDelete = true" type="negative">Delete</q-btn>
            </div>
          </div>

        </div>

      </div>

      <q-dialog v-model="confirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white"/>
            <span class="q-ml-sm">Are you sure want to delete this project ? </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup/>
            <q-btn flat label="Delete" color="primary" v-close-popup @click="onDeleteClicked"/>
          </q-card-actions>
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
            <q-btn flat label="OK" color="primary" v-close-popup @click="okClicked"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </form>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions, mapGetters} from "vuex";
import Configures from '../Configures/Configures'
import ConfigSerialList from "../SerialParallelConfig/SerialConfiglList";
import ParallelConfigList from "../SerialParallelConfig/ParallelConfigList";

export default {
  components: {ConfigSerialList, EditorRequestResponseConfig, Configures, ParallelConfigList},
  computed: {
    ...mapGetters({
      configs: 'configures/getConfigures',
      selectedProject: 'projects/selectedProject'
    })
  },
  data() {
    return {
      // validation provider error
      globalErrors: [],
      errorTab1: null,
      errorTab2: null,

      alertDialog: false,

      splitterModel: 10,
      tab: 'general',
      name: null,
      description: '',
      maxCircular: 10,
      id: null,

      selected: 'Adds.Header',
      editorData : {
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

     isLoading: false,
      isLoadConfigures: false,
      confirmDelete: false,

      serial: null,
      parallel: null,

      paginationSerial: {
        rowsPerPage: 1000
      },

      columnsSerial: [
        {
          name: 'id',
          label: 'Id',
          field: row => row.id,
          align: 'left',
        },
        {
          name: 'alias',
          required: false,
          label: 'Alias',
          align: 'left',
          field: row => row.alias,
          format: val => `${val ? val.substring(0, 30) + '...' : '-'}`,
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],
      /* serial saved data */
      serialConfigSaved: null,
      validators: {
        nameErr: false,
        statusCodeErr: false,
        maxCircularErr : false,
        formHasError: false,
        errCount: 0
      },

      tabNames: this.$route.name === 'Project.New' ? ["general", "base"] : ["general", "base", "configures", "serial/parallel"]
    }
  },
  methods: {
    ...mapActions({
      fetchSpecificProject: 'projects/fetchSpecificProject',
      updateProject: 'projects/updateProject',
      storeProject: 'projects/storeProject',
      deleteProject: "projects/deleteProject",
      actionFetchConfigures: 'configures/fetchConfigures',
      storeSerial: 'serial/storeSerial'
    }),

    okClicked() {
      this.alertDialog = false;
      this.globalErrors = [];

    },

    async onConfirmSerialConfig(val) {
      this.serialConfigSaved = val
      let data = this.constructDataConfigSerial(this.serialConfigSaved);
      await this.onSaveSerialConfig(data)
    },
    constructDataConfigSerial(configSerialData) {
      let configures = [];
      configSerialData.forEach(conf => {
        let cLogics = [];
        let configureId = conf.configure_id;
        let alias = conf.alias;
        let nextFailure = conf.next_failure
        conf.c_logics.forEach(cLogic => {
          let rule = cLogic.rule
          let data = cLogic.data
          let nextSuccess = cLogic.next_success;
          let response = null;
          if (cLogic.response) {
            response = {
              statusCode: cLogic.response.status_code,
              transform: cLogic.response.transform,
              adds: {
                header: cLogic.response.adds.header,
                body: cLogic.response.adds.body
              },
              modifies: {
                header: cLogic.response.modifies.header,
                body: cLogic.response.modifies.body
              },
              deletes: {
                header: cLogic.response.deletes.header,
                body: cLogic.response.deletes.body
              }
            }
          }

          cLogics.push({
            rule, data, nextSuccess, response
          })
        })
        configures.push({
          configureId, alias, cLogics, nextFailure
        })
      })
      return configures
    },
    async onSaveSerialConfig(val) {
      let data = {
        projectId: this.$route.params.id,
        configures: val
      }
      try {
        await this.storeSerial(data)
        this.$q.notify({
          message: 'Store Serial Success.',
          color: 'secondary'
        })
      } catch (err) {
        console.log(err)
      }
    },
    async fetchConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        await this.actionFetchConfigures(projectId);

      } catch (err) {
        console.log(err)
      }
      this.isLoadConfigures = false;

    },

    async onDeleteClicked() {
      try {
        await this.deleteProject(this.$route.params.id)
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Home.Projects'})
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: err.response.data,
          color: 'negative'
        })

      }
    },
    async getProjectDetail() {
      this.isLoading = true;
      try {
        await this.fetchSpecificProject(this.$route.params.id)
        this.fillData(this.selectedProject)
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false;
    },
    fillData(data) {
      const {name, description, base, id} = data
      this.id = id
      this.name = name
      this.description = description;

      const {project_max_circular, circular_response} = base
      this.maxCircular = project_max_circular

      const {adds, modifies, deletes, log_before_modify, log_after_modify, status_code, transform} = circular_response
      this.editorData.statusCode = status_code
      this.editorData.transform = transform
      this.editorData.logBeforeModify = log_before_modify
      this.editorData.logAfterModify = log_after_modify


      this.editorData.codeAddHeader = adds.header ? adds.header : {}

      this.editorData.codeAddBody = adds.body ? adds.body : {}

      this.editorData.codeModifyHeader = modifies.head ? modifies.head : {}
      this.editorData.codeModifyBody = modifies.body ? modifies.body : {}

      this.editorData.codeDeleteHeader = deletes.header ? deletes.header : []
      this.editorData.codeDeleteBody = deletes.body ? deletes.body : []

      this.serial = data.serial
      this.parallel = data.parallel
    },
    validateInput() {
      this.validators.errCount = 0
      this.globalErrors = []
      this.validators.formHasError = false;
      this.$refs.name.validate();
      this.validators.nameErr = this.$refs.name.hasError

      this.$refs.maxCircular.validate();
      this.validators.maxCircularErr =this.$refs.maxCircular.hasError

      this.$refs.editor.$refs.statusCode.validate();
      this.validators.statusCodeErr = this.$refs.editor.$refs.statusCode.hasError


      if (this.validators.nameErr) {
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.name.innerErrorMessage)
      }

      if(this.validators.maxCircularErr){
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.maxCircular.innerErrorMessage)
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
    onSaveClicked() {
      this.validateInput();
      if (!this.validators.formHasError) {
        let data = this.constructData();
        if (this.$route.name === 'Projects.Detail') {
          this.onUpdateProject(data)
        } else {
          this.onStoreProject(data)
        }
      }
    },
    async onStoreProject(data) {
      try {
        let response = await this.storeProject(data)
        this.$q.notify({
          message: 'Add Project Success.',
          color: 'secondary'
        })
        this.id = response.data.id
        // push to project detail
        await this.$router.replace({name: 'Projects.Detail', params: {id: this.id}})
      } catch (err) {
        console.log(err)
        // inside of a Vue file
// or with a config object:

      }
    },
    async onUpdateProject(data) {
      try {
        await this.updateProject(data)
        this.$q.notify({
          message: 'Update Project Success.',
          color: 'secondary'
        })
      } catch (err) {
        console.log(err)
      }
    },

    constructData() {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        base: {
          project_max_circular: this.maxCircular,
          circular_response: {
            status_code: this.editorData.statusCode,
            transform: this.editorData.transform,
            log_before_modify: this.editorData.logBeforeModify ? this.editorData.logBeforeModify : {},
            log_after_modify: this.editorData.logAfterModify ? this.editorData.logAfterModify : {},
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

          }
        }
      }
    }
  },
  async mounted() {
    if (this.$route.name === 'Projects.Detail') {
      await this.getProjectDetail()
      await this.fetchConfigures(this.$route.params.id);
    }

    await this.visitTabs()
  }
}
</script>

<style scoped>

</style>