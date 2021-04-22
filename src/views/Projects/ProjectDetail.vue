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
                                             @on-change-transform="onChangeTransform"
                                             @on-change-log-before-modify="onChangeLogBeforeModify"
                                             @on-change-log-after-modify="onChangeLogAfterModify"
                                             @on-change-add-header="onChangeAddHeader"
                                             @on-change-add-body="onChangeAddBody"
                                             @on-change-modify-header="onChangeModifyHeader"
                                             @on-change-modify-body="onChangeModifyBody"
                                             @on-change-delete-header="onChangeDeleteHeader"
                                             @on-change-delete-body="onChangeDeleteBody"
                />

              </q-tab-panel>


            </q-tab-panels>
          </template>

        </q-splitter>
      </div>

      <div class="col-1">
        <div class="row">
          <div class="col-1 text-center">
            <q-btn @click="onSaveClicked" type="primary" >Save</q-btn>
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
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn Delete" color="primary" v-close-popup  @click="onDeleteClicked"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions} from "vuex";

export default {
  components: {EditorRequestResponseConfig},
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
      confirmDelete : false,
    }
  },
  methods: {
    ...mapActions({
      fetchSpecificProject: 'projects/fetchSpecificProject',
      updateProject: 'projects/updateProject',
      storeProject: 'projects/storeProject',
      deleteProject : "projects/deleteProject"
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

    async onDeleteClicked(){
      try{
       await this.deleteProject(this.$route.params.id)
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Home.Projects'})
      }catch(err){
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
        this.filLData(response.data)
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false;
    },
    filLData(data) {
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

      this.codeDeleteHeader = deletes.header ? deletes.header : {}
      this.codeDeleteBody = deletes.body ? deletes.body : {}

    },
    async onSaveClicked() {
      let data = this.constructData();
      console.log("construct data is")
      console.log(data)
      if (this.$route.name === 'Projects.Detail') {
        await this.onUpdateProject(data)

      } else {
        await this.onStoreProject(data)
      }

    },
    async onStoreProject(data) {
      try {
        await this.storeProject(data)
        this.$q.notify({
          message: 'Update Success.',
          color: 'secondary'
        })
      } catch (err) {
        console.log(err)
        // inside of a Vue file
// or with a config object:

      }
    },
    async onUpdateProject(data) {
      try {
        await this.updateProject(data)

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
            logBeforeModify: this.logBeforeModify,
            logAfterModify: this.logAfterModify,
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
    }
  }
}
</script>

<style scoped>

</style>