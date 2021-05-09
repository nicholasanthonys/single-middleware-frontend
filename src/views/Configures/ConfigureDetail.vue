<template>
  <div class="full-height">
    <form class="full-height" @submit.prevent="onSaveClicked">
      <div class="column " style="height: 100%">
        <div class="col">
          <q-splitter
              v-if="!isLoading"
              v-model="splitterModel"
              class="full-height"
          >
            <template v-slot:before>
              <q-tabs
                  v-model="tab"
                  vertical
                  class="text-teal"
              >
                <q-tab name="general" icon="description" label="General"/>
                <q-tab name="request" icon="list" label="Request" :alert="validators.destinationURLErr? 'red': false"/>
                <q-tab name="response" icon="list" label="Response" :alert="validators.statusCodeErr? 'red': false"/>
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
                  keep-alive
                  ref="tabs"
              >

                <q-tab-panel name="general">
                  <div class="text-h4 q-mb-md">General</div>
                  <q-input v-model="id" filled hint="Config Id" label="Id" v-if="mode === 'edit' "/>

                  <q-input v-model="description" type="textarea" filled hint="Config Description" label="Description"/>
                </q-tab-panel>
                <q-tab-panel name="request">
                  <div class="text-h4 q-mb-md">Request</div>
                  {{ request }}
                  <EditorRequestResponseConfig
                      ref="editorRequest"
                      config-type="request"
                      :have-log="true"
                      :prop-enable-loop="true"
                      v-model="request"
                  />
                </q-tab-panel>

                <q-tab-panel name="response">
                  <div class="text-h4 q-mb-md">Response</div>
                  {{ response }}
                  <EditorRequestResponseConfig
                      ref="editorResponse"
                      config-type="response"
                      :prop-enable-loop="false"
                      :have-log="true"
                      v-model="response"
                  />
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
            <div class="col-1" v-if="$route.name === 'Configures.Detail' ">
              <q-btn @click="confirmDelete = true" type="negative">Delete</q-btn>
            </div>
          </div>

        </div>
      </div>
    </form>


    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white"/>
          <span class="q-ml-sm">Are you sure want to delete this configure ? </span>
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
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions} from "vuex";

export default {
  props: {
    mode: String
  },
  components: {
    EditorRequestResponseConfig
  },
  data() {

    return {
      confirmDelete: false,
      isLoading: false,

      tab: 'general',
      splitterModel: 10,

      id: '',
      description: '',
      request: {
        loop: null,
        destinationUrl: '',
        destinationPath: '',
        requestMethod: 'POST',

        codeAddHeader: {},
        codeAddBody: {},
        codeAddQuery: {},
        codeAddParam: {},

        codeModifyHeader: {},
        codeModifyBody: {},
        codeModifyQuery: {},
        codeModifyParam: {},

        codeDeleteHeader: [],
        codeDeleteBody: [],
        codeDeleteQuery: [],
        codeDeleteParam: [],

        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
      },
      response: {
        statusCode: null,
        transform: "ToJson",
        logBeforeModify: {},
        logAfterModify: {},
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],

      },
      validators: {
        destinationURLErr: false,
        requestMethodErr :  false,
        statusCodeErr: false,
        formHasError: false,
        errCount: 0
      },
      tabNames: ["general", "request", "response"],
      globalErrors: [],
      alertDialog: false,

    }
  },
  methods: {
    ...mapActions({
      fetchSpecificConfigure: 'configures/fetchSpecificConfigure',
      storeConfigure: 'configures/storeConfigure',
      updateConfigure: 'configures/updateConfigure',
      deleteConfigure: 'configures/deleteConfigure'
    }),
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
    validateInput() {
      this.validators.errCount = 0
      this.globalErrors = []
      this.validators.formHasError = false;

      this.$refs.editorRequest.$refs.destinationURL.validate();
      this.validators.destinationURLErr = this.$refs.editorRequest.$refs.destinationURL.hasError

      this.$refs.editorRequest.$refs.requestMethod.validate();
      this.validators.requestMethodErr= this.$refs.editorRequest.$refs.requestMethod.hasError

      const editor = this.$refs.editorResponse
      console.log("editor is")
      console.log(editor)
      this.$refs.editorResponse.$refs.statusCode.validate();
      this.validators.statusCodeErr = this.$refs.editorResponse.$refs.statusCode.hasError

      if (this.validators.destinationURLErr) {
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.editorRequest.$refs.destinationURL.innerErrorMessage)
      }

      if (this.validators.requestMethodErr) {
        this.validators.errCount++;
        this.globalErrors.push(this.$refs.editorRequest.$refs.requestMethod.innerErrorMessage)
      }

      if (this.validators.statusCodeErr) {
        this.validators.errCount++
        this.globalErrors.push(this.$refs.editorResponse.$refs.statusCode.innerErrorMessage)
      }
      if (this.validators.errCount > 0) {
        this.validators.formHasError = true
        this.alertDialog = true;

      }
    },
    async onSaveClicked() {
      this.validateInput()
      if (!this.validators.formHasError) {
        if (this.$route.name === 'Configures.Detail') {
          await this.onUpdateConfig()
        } else {
          await this.onStoreConfig()
        }
      }

    },
    async onDeleteClicked() {
      try {
        let params = {
          project_id: this.$route.params.projectId,
          configure_id: this.$route.params.id
        }
        await this.deleteConfigure(params)
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Projects.Detail', params: {id: this.$route.params.projectId}})

      } catch (err) {
        console.log(err)
      }
    },
    async onUpdateConfig() {
      try {
        let data = this.constructData();
        console.log("data is ")
        console.log(data)
        await this.updateConfigure(data)
        this.$q.notify({
          message: 'Update Success.',
          color: 'secondary'
        })
      } catch (err) {
        console.log(err)
      }
    },
    async onStoreConfig() {
      try {
        let data = this.constructData();
        let response = await this.storeConfigure(data)
        const {id} = response.data
        this.$q.notify({
          message: 'Add Configure Success.',
          color: 'secondary'
        })
        await this.$router.replace({
          name: "Configures.Detail", params: {
            projectId: this.$route.params.projectId,
            id
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    constructData() {
      return {
        project_id: this.$route.params.projectId,
        config: {
          id: this.$route.params.id,
          description: this.description,
          request: {
            loop: this.request.loop,
            destination_url: this.request.destinationUrl,
            destination_path: this.request.destinationPath,
            method: this.request.requestMethod,
            transform: this.request.transform,
            log_before_modify: this.request.logBeforeModify ? this.request.logBeforeModify : {},
            log_after_modify: this.request.logAfterModify ? this.request.logAfterModify : {},
            adds: {
              header: this.request.codeAddHeader,
              body: this.request.codeAddBody,
              query: this.request.codeAddQuery,
              param: this.request.codeAddParam,
            },
            modifies: {
              header: this.request.codeModifyHeader,
              body: this.request.codeModifyBody,
              query: this.request.codeModifyQuery,
              param: this.request.codeModifyParam,
            },
            deletes: {
              header: this.request.codeDeleteHeader,
              body: this.request.codeDeleteBody,
              query: this.request.codeDeleteQuery,
              param: this.request.codeDeleteParam,
            }
          },
          response: {
            status_code: this.response.statusCode,
            transform: this.response.transform,
            log_before_modify: this.response.logBeforeModify ? this.response.logBeforeModify : {},
            log_after_modify: this.response.logAfterModify ? this.response.logAfterModify : {},
            adds: {
              header: this.response.codeAddHeader,
              body: this.response.codeAddBody,
            },
            modifies: {
              header: this.response.codeModifyHeader,
              body: this.response.codeModifyBody,
            },
            deletes: {
              header: this.response.codeDeleteHeader,
              body: this.response.codeDeleteBody,
            }
          }


        }
      }
    },
    async loadConfigure(projectId, configureId) {
      this.isLoading = true
      const param = {
        configure_id: configureId, project_id: projectId
      }
      try {
        let response = await this.fetchSpecificConfigure(param)
        this.fillData(response.data)
      } catch (err) {
        console.log(err)
      }
      this.isLoading = false
    },
    fillData(data) {
      const {description, request, response} = data
      this.description = description
      this.request = this.fillRequest(request)
      this.response = this.fillResponse(response)

    },
    fillRequest(request) {
      console.log("fill request triggered, request is ")
      console.log(request)
      const {
        loop,
        transform,
        destination_url,
        destination_path,
        method,
        adds,
        modifies,
        deletes,
        log_before_modify,
        log_after_modify,
      } = request
      return {
        loop,
        destinationUrl: destination_url,
        destinationPath: destination_path,
        requestMethod : method,
        transform,
        logBeforeModify: log_before_modify,
        logAfterModify: log_after_modify,
        codeAddHeader: adds.header ? adds.header : {},
        codeAddBody: adds.body ? adds.body : {},
        codeAddQuery: adds.query ? adds.query : {},
        codeAddParam: adds.param ? adds.param : {},
        codeModifyHeader: modifies.head ? modifies.head : {},
        codeModifyBody: modifies.body ? modifies.body : {},
        codeModifyParam: modifies.param ? modifies.param : {},
        codeModifyQuery: modifies.query ? modifies.query : {},
        codeDeleteHeader: deletes.header ? deletes.header : [],
        codeDeleteBody: deletes.body ? deletes.body : [],
      }
    },

    fillResponse(response) {
      const {adds, modifies, deletes, log_before_modify, log_after_modify, status_code, transform} = response

      return {
        statusCode: status_code,
        transform: transform,
        logBeforeModify: log_before_modify,
        logAfterModify: log_after_modify,
        codeAddHeader: adds.header ? adds.header : {},
        codeAddBody: adds.body ? adds.body : {},
        codeModifyHeader: modifies.head ? modifies.head : {},
        codeModifyBody: modifies.body ? modifies.body : {},
        codeDeleteHeader: deletes.header ? deletes.header : [],
        codeDeleteBody: deletes.body ? deletes.body : [],
      }
    },
  },
  async mounted() {
    if (this.$route.name === 'Configures.Detail') {
      await this.loadConfigure(this.$route.params.projectId, this.$route.params.id)
    }

    await this.visitTabs()
  }
}
</script>

<style scoped>

</style>