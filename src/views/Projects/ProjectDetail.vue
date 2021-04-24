<template>
  <div class="full-height">

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
              <q-tab name="general" icon="description" label="General"/>
              <q-tab name="base" icon="settings_application" label="Base Settings"/>
              <q-tab name="configures" icon="settings_application" label="Configures" v-if="$route.name ==='Projects.Detail' "/>
              <q-tab name="serial/parallel" icon="settings_application" label="Serial/Parallel" v-if="$route.name === 'Projects.Detail' "/>
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

            >
              <q-tab-panel name="general">
                <div class="text-h4 q-mb-md">General</div>

                <q-input
                    filled
                    v-model="name"
                    label="Name *"
                    hint="Project Name"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <br/>
                <q-input
                    filled
                    v-model="description"
                    label="Description *"
                    hint="Project Description"
                    type="textarea"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                />

              </q-tab-panel>

              <q-tab-panel name="base">
                <div class="text-h4 q-mb-md">Base Settings</div>
                <q-input
                    v-model.number="maxCircular"
                    label="Max Circular Limit*"
                    hint="Maximum limit of circular request"
                    type="number"
                    filled
                />

                <br/>
                <EditorRequestResponseConfig config-type="response"
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
                                             @on-change-status-code="onChangeStatusCode"
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

              <q-tab-panel name="configures" style="height: 100%;">
                <Configures :project-id="$route.params.id" :prop-configs="configs" v-if="!isLoadConfigures"/>
                <div style="height: 100%;" v-else class="flex justify-center items-center">
                  <q-spinner
                      color="primary"
                      size="3em"
                  />
                </div>

              </q-tab-panel>

              <q-tab-panel name="serial/parallel">
                <p>Tes 2</p>
              </q-tab-panel>


            </q-tab-panels>
          </template>

        </q-splitter>
      </div>

      <div class="col-1">
        <div class="row">
          <div class="col-1 text-center">
            <q-btn @click="onSaveClicked" type="primary">Save</q-btn>
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
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions, mapGetters} from "vuex";
import Configures from '../Configures/Configures'
export default {
  components: {EditorRequestResponseConfig, Configures},
  computed : {
   ...mapGetters({
     configs : 'configures/getConfigures'
   })
  },
  data() {
    return {
      splitterModel: 10,
      tab: 'general',
      name: '',
      description: '',
      maxCircular: 0,
      id: null,
      selected: 'Adds.Header',
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
      isLoading: false,
      isLoadConfigures : false,
      confirmDelete: false,
    }
  },
  methods: {
    ...mapActions({
      fetchSpecificProject: 'projects/fetchSpecificProject',
      updateProject: 'projects/updateProject',
      storeProject: 'projects/storeProject',
      deleteProject: "projects/deleteProject",
      actionFetchConfigures: 'configures/fetchConfigures'
    }),
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
    async fetchConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        await this.actionFetchConfigures(projectId);
        /*this.data.forEach((row, index) => {
          row.index = index
        })*/
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
        let response = await this.fetchSpecificProject(this.$route.params.id)
        console.log("response is ")
        console.log(response.data)
        this.fillData(response.data)
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
      this.statusCode = status_code
      this.transform = transform
      this.logBeforeModify = log_before_modify
      this.logAfterModify = log_after_modify

      console.log("adds is ")
      console.log(adds)

      this.codeAddHeader = adds.header ? adds.header : {}

      this.codeAddBody = adds.body ? adds.body : {}

      this.codeModifyHeader = modifies.head ? modifies.head : {}
      this.codeModifyBody = modifies.body ? modifies.body : {}

      this.codeDeleteHeader = deletes.header ? deletes.header : []
      this.codeDeleteBody = deletes.body ? deletes.body : []

    },
    async onSaveClicked() {
      let data = this.constructData();
      if (this.$route.name === 'Projects.Detail') {
        await this.onUpdateProject(data)

      } else {
        await this.onStoreProject(data)
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
          projectMaxCircular: this.maxCircular,
          circularResponse: {
            statusCode: this.statusCode,
            transform: this.transform,
            logBeforeModify: this.logBeforeModify ? this.logBeforeModify : {},
            logAfterModify: this.logAfterModify ? this.logAfterModify : {},
            adds: {
              header: this.codeAddHeader,
              body: this.codeAddBody
            },
            modifies: {
              header: this.codeModifyHeader,
              body: this.codeModifyBody
            },
            deletes: {
              header: this.codeDeleteHeader,
              body: this.codeDeleteBody
            }

          }
        }
      }
    }
  },
  async mounted() {
    console.log(this.$route.name)
    if (this.$route.name === 'Projects.Detail') {
      await this.getProjectDetail()
      await this.fetchConfigures(this.$route.params.id);
    }
  }
}
</script>

<style scoped>

</style>