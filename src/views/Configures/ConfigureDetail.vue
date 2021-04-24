<template>
  <div class="full-height">
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
              <q-tab name="request" icon="list" label="Request"/>
              <q-tab name="response" icon="list" label="Response"/>
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
                <q-input v-model="id" filled hint="Config Id" label="Id" v-if="mode === 'edit' "/>

                <q-input v-model="description" type="textarea" filled hint="Config Description" label="Description"/>
              </q-tab-panel>
              <q-tab-panel name="request">
                <div class="text-h4 q-mb-md">Request</div>
                <EditorRequestResponseConfig config-type="request"
                                             :have-log="true"
                                             :prop-request-method="request.method"
                                             :prop-destination-url="request.destinationUrl"
                                             :prop-destination-path="request.destinationPath"
                                             :prop-transform="request.transform"
                                             :prop-log-after-modify="request.logAfterModify"
                                             :prop-log-before-modify="request.logBeforeModify"

                                             :prop-code-add-header="request.codeAddHeader"
                                             :prop-code-add-body="request.codeAddBody"
                                             :prop-code-add-query="request.codeAddQuery"
                                             :prop-code-add-param="request.codeAddParam"

                                             :prop-code-modify-header="request.codeModifyHeader"
                                             :prop-code-modify-body="request.codeModifyBody"
                                             :prop-code-modify-query="request.codeModifyQuery"
                                             :prop-code-modify-param="request.codeModifyParam"

                                             :prop-code-delete-header="request.codeDeleteHeader"
                                             :prop-code-delete-body="request.codeDeleteBody"
                                             :prop-code-delete-query="request.codeDeleteQuery"
                                             :prop-code-delete-param="request.codeDeleteParam"

                                             @on-change-transform-request="onChangeTransformRequest"
                                             @on-change-log-before-modify-request="onChangeLogBeforeModifyRequest"
                                             @on-change-log-after-modify-request="onChangeLogAfterModifyRequest"
                                             @on-change-add-header-request="onChangeAddHeaderRequest"
                                             @on-change-add-body-request="onChangeAddBodyRequest"
                                             @on-change-modify-header-request="onChangeModifyHeaderRequest"
                                             @on-change-modify-body-request="onChangeModifyBodyRequest"
                                             @on-change-delete-header-request="onChangeDeleteHeaderRequest"
                                             @on-change-delete-body-request="onChangeDeleteBodyRequest"
                                             @on-change-method-request="onChangeMethodRequest"
                                             @on-change-destination-url-request="onChangeDestinationUrlRequest"
                                             @on-change-destination-path-request="onChangeDestinationPathRequest"
                />
              </q-tab-panel>

              <q-tab-panel name="response">
                <div class="text-h4 q-mb-md">Response</div>
                <EditorRequestResponseConfig config-type="response"
                                             :have-log="true"
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
      <div class="col-1">
        <div class="row">
          <div class="col-1 text-center">
            <q-btn @click="onSaveClicked" type="primary">Save</q-btn>
          </div>
          <div class="col-1" v-if="$route.name === 'Configures.Detail' ">
            <q-btn @click="confirmDelete = true" type="negative">Delete</q-btn>
          </div>
        </div>

      </div>
    </div>


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
        destinationUrl: '',
        destinationPath: '',
        method: 'POST',

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

      }
    }
  },
  methods: {
    ...mapActions({
      fetchSpecificConfigure: 'configures/fetchSpecificConfigure',
      storeConfigure: 'configures/storeConfigure',
      updateConfigure: 'configures/updateConfigure',
      deleteConfigure : 'configures/deleteConfigure'
    }),
    async onSaveClicked() {
      console.log("on save clicked triggered")
      if (this.$route.name === 'Configures.Detail') {
        await this.onUpdateConfig()
      } else {
        await this.onStoreConfig()
      }
    },
    async onDeleteClicked() {
      try {
        let params  ={
          projectId : this.$route.params.projectId,
          configureId : this.$route.params.id
        }
       await this.deleteConfigure(params)
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Projects.Detail', params : {id : this.$route.params.projectId}})

      }catch (err) {
       console.log(err)
      }
    },
    async onUpdateConfig() {
      try {
        let data = this.constructData();
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
        console.log("data is ")
        console.log(data)
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
        projectId : this.$route.params.projectId,
        config : {
          id : this.$route.params.id,
          description : this.description,
          request : {
            destinationUrl : this.request.destinationUrl,
            destinationPath : this.request.destinationPath,
            method : this.request.method,
            transform : this.request.transform,
            logBeforeModify : this.request.logBeforeModify ? this.request.logBeforeModify : {},
            logAfterModify : this.request.logAfterModify ? this.request.logAfterModify : {},
            adds : {
              header : this.request.codeAddHeader,
              body : this.request.codeAddBody,
              query : this.request.codeAddQuery,
              param : this.request.codeAddParam,
            },
            modifies : {
              header : this.request.codeModifyHeader,
              body : this.request.codeModifyBody,
              query : this.request.codeModifyQuery,
              param : this.request.codeModifyParam,
            },
            deletes : {
              header : this.request.codeDeleteHeader,
              body : this.request.codeDeleteBody,
              query : this.request.codeDeleteQuery,
              param : this.request.codeDeleteParam,
            }
          },
          response : {
            statusCode : this.response.statusCode,
            transform : this.response.transform,
            logBeforeModify : this.response.logBeforeModify ? this.response.logBeforeModify : {},
            logAfterModify : this.response.logAfterModify ? this.response.logAfterModify : {},
            adds : {
              header : this.response.codeAddHeader,
              body : this.response.codeAddBody,
            },
            modifies : {
              header : this.response.codeModifyHeader,
              body : this.response.codeModifyBody,
            },
            deletes : {
              header : this.response.codeDeleteHeader,
              body : this.response.codeDeleteBody,
            }
          }


        }
      }
    },
    async loadConfigure(projectId, configureId) {
      this.isLoading = true
      const param = {configureId, projectId}
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
      const {
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
        destinationUrl: destination_url,
        destinationPath: destination_path,
        method,
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
    /* Request */
    onChangeDestinationUrlRequest(val) {
      this.request.destinationUrl = val
    },
    onChangeDestinationPathRequest(val) {
      this.request.destinationPath = val
    },
    onChangeMethodRequest(val) {
      this.request.method = val
    },
    onChangeTransformRequest(val) {
      this.request.transform = val;
    },
    onChangeLogBeforeModifyRequest(val) {
      this.request.logBeforeModify = val;
    },
    onChangeLogAfterModifyRequest(val) {
      this.request.logAfterModify = val;
    },

    /* Add header, body, query, param for request*/
    onChangeAddHeaderRequest(val) {
      this.request.codeAddHeader = val;
    },
    onChangeAddBodyRequest(val) {
      this.request.codeAddBody = val;
    },
    onChangeAddQueryRequest(val) {
      this.request.codeAddQuery = val;
    },
    onChangeAddParamRequest(val) {
      this.request.codeAddParam = val;
    },

    /* Modify header, body, query, param for request*/
    onChangeModifyHeaderRequest(val) {
      this.request.codeModifyHeaderRequest = val
    },
    onChangeModifyBodyRequest(val) {
      this.request.codeModifyBody = val
    },
    onChangeModifyQueryRequest(val) {
      this.request.codeModifyQuery = val
    },
    onChangeModifyParamRequest(val) {
      this.request.codeModifyParam = val
    },

    /* Delete header, body, query, param for request*/
    onChangeDeleteHeaderRequest(val) {
      this.request.codeDeleteHeader = val
    },
    onChangeDeleteBodyRequest(val) {
      this.request.codeDeleteBody = val
    },
    onChangeDeleteQueryRequest(val) {
      this.request.codeDeleteQuery = val
    },
    onChangeDeleteParamRequest(val) {
      this.request.codeDeleteParam = val
    },

    /* Response */
    onChangeStatusCodeResponse(val) {
      this.response.statusCode = val
    },
    onChangeTransformResponse(val) {
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
  },
  async mounted() {
    if (this.$route.name === 'Configures.Detail') {
      await this.loadConfigure(this.$route.params.projectId, this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>