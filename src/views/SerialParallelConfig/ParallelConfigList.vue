<template>
  <div>
    <div v-if="parallel">

      <p>Parallel Config File</p>
      <q-btn @click="onAddSelectedConfig">Add New Parallel Config</q-btn>
      <q-table
          style="height: 400px"
          title="Your Parallel Config File"
          :data="parallel.configures"
          :columns="configColumns"
          row-key="index"
          virtual-scroll
          :pagination.sync="configPagination"
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

              <p v-if=" col.name !== 'action' ">{{ col.value }}</p>

              <q-icon
                  v-else
                  size="xs"
                  name="edit"
                  @click="onSelectedConfig(props.row, props.rowIndex)"
              />

            </q-td>
          </q-tr>
        </template>
      </q-table>
      <br/>

      <br/>
      <div v-if="!isLoading">
      <p>Parallel Next Failure Response</p>
      <q-btn @click="onSaveNextFailure">Save Next Failure</q-btn>
      <EditorRequestResponseConfig  config-type="response"
                                   :have-log="false"
                                   :prop-status-code="nextFailure.statusCode"
                                   :prop-transform="nextFailure.transform"
                                   :prop-log-after-modify="nextFailure.logAfterModify"
                                   :prop-log-before-modify="nextFailure.logBeforeModify"
                                   :prop-code-add-header="nextFailure.codeAddHeader"
                                   :prop-code-add-body="nextFailure.codeAddBody"
                                   :prop-code-modify-header="nextFailure.codeModifyHeader"
                                   :prop-code-modify-body="nextFailure.codeModifyBody"
                                   :prop-code-delete-header="nextFailure.codeDeleteHeader"
                                   :prop-code-delete-body="nextFailure.codeDeleteBody"

                                   @on-change-status-code-response="onChangeStatusCodeResponse"
                                   @on-change-transform-response="onChangeTransformResponse"
                                   @on-change-add-header-response="onChangeAddHeaderResponse"
                                   @on-change-add-body-response="onChangeAddBodyResponse"
                                   @on-change-modify-header-response="onChangeModifyHeaderResponse"
                                   @on-change-modify-body-response="onChangeModifyBodyResponse"
                                   @on-change-delete-header-response="onChangeDeleteHeaderResponse"
                                   @on-change-delete-body-repsonse="onChangeDeleteBodyResponse"
      />
      </div>
      <div v-else>
        <q-spinner
            color="primary"
            size="3em"
        />
      </div>
      <br/>
      <p>C Logics Parallel</p>
      <q-btn @click="openDialogAddCLogic"> Add CLogic</q-btn>

      <q-table
          style="height: 400px"
          title="CLogic Parallel"
          :data="parallel.c_logics"
          :columns="cLogicColumns"
          row-key="index"
          virtual-scroll
          :pagination.sync="cLogicPagination"
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

              <p v-if="col.name !=='description' && col.name !== 'action' ">{{ col.value }}</p>
              <div v-if="col.name === 'description'">
                <p>{{ col.value }}
                  <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    {{ props.row.description }}
                  </q-tooltip>
                </p>
              </div>
              <q-icon
                  v-if="col.name==='action'"
                  size="xs"
                  name="edit"
                  @click="selectCLogic(props.row, props.rowIndex)"

              />

            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!-- Parallel Config Dialog -->
      <q-dialog v-model="bar" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section class="q-pt-md q-pb-md q-pl-md q-pr-md">

            <q-select v-model="selectedConfigId" :options="configureOptions" label="Select Configuration Id"
                      style="max-width: 300px"/>
            <br/>


            <q-input
                outlined
                v-model="alias"
                label="Alias *"
                hint="Config Alias"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-btn @click="onConfigFileSave">Save</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!--- CLogic dialog -->
      <q-dialog
          v-model="cLogicDialog"
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
            <CLogicItemDetail :prop-c-logic="selectedCLogic" @on-clogic-save="onCLogicSave" :prop-mode="cLogicMode"
                              :prop-index="selectedCLogicIndex" prop-request-type="parallel"/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions, mapGetters} from "vuex";
import CLogicItemDetail from "./CLogicItemDetail";

export default {
  computed : {
   ...mapGetters({
     parallel : 'parallel/getParallel'
   })
  },
  components: {
    CLogicItemDetail,
    EditorRequestResponseConfig
  },
  data() {
    return {
      nextFailure: {
        statusCode: '',
        transform: "ToJson",
        codeAddHeader: {},
        codeAddBody: {},
        codeModifyHeader: {},
        codeModifyBody: {},
        codeDeleteHeader: [],
        codeDeleteBody: [],
      },

      /* for table config file */
      /* config columns */
      configPagination: {
        rowsPerPage: 1000
      },

      configColumns: [
        {
          name: 'id',
          label: 'Id',
          field: 'id',
          align: 'left',
        },
        {
          name: 'alias',
          label: 'alias',
          field: row => row.alias,
          align: 'left',
        },
        {
          name: 'configure_id',
          label: 'Configure id',
          field: 'configure_id',
          align: 'left',
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
        }
      ],
      /* c logics table */
      cLogicPagination: {
        rowsPerPage: 1000
      },
      cLogicColumns: [
        {
          name: 'id',
          label: 'Id',
          field: 'id',
          align: 'left',
        },

        {
          name: 'action',
          required: true,
          label: 'Action',
        }


      ],

      /* for dialog config file parallel */
      mode: 'add',
      configureOptions: [],
      bar: false,
      selectedConfigIndex: -1,
      selectedConfig: false,
      selectedConfigId: null,
      alias: null,

      /* for dialog clogic parallel */
      cLogicMode: 'add',
      cLogicDialog: false,
      selectedCLogic: null,
      selectedCLogicIndex: -1,
      maximizedToggle: true,

      isLoading : false,

    }
  },
  methods: {
    ...mapActions({
      actionFetchConfigures: 'configures/fetchConfigures',
      storeSingleConfigParallel: 'parallel/storeSingleConfigParallel',
      updateSingleConfigParallel: 'parallel/updateSingleConfigParallel',
      storeSingleCLogicParallel: 'parallel/storeSingleCLogicParallel',
      updateSingleCLogicParallel: 'parallel/updateSingleCLogicParallel',
      storeNextFailureParallel: 'parallel/storeNextFailure',
      actionFetchParallel : 'parallel/fetchParallel',
    }),
    async loadParallel(){
      this.isLoading = true;
      try {
       await this.actionFetchParallel(this.$route.params.id)
        this.fillDataNextFailure(this.parallel);
      }catch (e) {
       console.log(e)
      }
      this.isLoading = false;
    },

    async onSaveNextFailure() {
      try {
        await this.storeNextFailureParallel({
          projectId: this.$route.params.id,
          statusCode: this.nextFailure.statusCode,
          transform: this.nextFailure.transform,
          adds: {
            header: this.nextFailure.codeAddHeader,
            body: this.nextFailure.codeAddBody
          },
          modifies: {
            header: this.nextFailure.codeModifyHeader,
            body: this.nextFailure.codeModifyBody
          },
          deletes: {
            header: this.nextFailure.codeDeleteHeader,
            body: this.nextFailure.codeDeleteBody
          }
        })
        this.$q.notify({
          message: 'Store Parallel next FailureSuccess.',
          color: 'secondary'
        })
      } catch (err) {
        console.log(err)
      }
    },
    openDialogAddCLogic() {
      this.cLogicMode = 'add',
          this.cLogicDialog = true
    },
    async onCLogicSave(val) {
      const {mode, data } = val

      if (mode === 'edit') {
        try {
           await this.updateSingleCLogicParallel({
            projectId: this.$route.params.id,
            data: data.data,
            rule: data.rule,
            nextSuccess: data.next_success,
            response: data.response,
            id: data.id
          })
          // let temp = [...this.cLogics];
          // temp[index] = res.data
          // this.cLogics = temp;
          this.$q.notify({
            message: 'Update Parallel CLogic Success.',
            color: 'secondary'
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          await this.storeSingleCLogicParallel({
            projectId: this.$route.params.id,
            data: data.data,
            rule: data.rule,
            nextSuccess: data.next_success,
            response: data.response
          })
          // this.cLogics.push(res.data)
          this.$q.notify({
            message: 'Add Parallel CLogic Success.',
            color: 'secondary'
          })
        } catch (e) {
          console.log(e)
        }
      }
      this.cLogicDialog = false
    },
    async onConfigFileSave() {
      if (this.mode === 'edit') {
        try {
          await this.updateSingleConfigParallel({
            projectId: this.$route.params.id,
            id: this.parallel.configures  [this.selectedConfigIndex].id,
            configureId: this.selectedConfigId,
            alias: this.alias
          })
          this.$q.notify({
            message: 'Update Parallel Config Success.',
            color: 'secondary'
          })
        } catch (err) {
          console.log(err)
        }

      } else {
        try {
          await this.storeSingleConfigParallel({
            projectId: this.$route.params.id,
            configureId: this.selectedConfigId,
            alias: this.alias
          })

          this.$q.notify({
            message: 'Add Parallel Config Success.',
            color: 'secondary'
          })
        } catch (err) {
          console.log(err)
        }

      }
      this.bar = false
    },
    selectCLogic(cLogicItem, index) {
      this.selectedCLogic = cLogicItem
      this.selectedCLogicIndex = index
      this.cLogicMode = 'edit';
      this.cLogicDialog = true
    },
    onAddSelectedConfig() {
      this.mode = 'add';
      this.selectedConfigId = null;
      this.alias = null;
      this.bar = true
    },
    onSelectedConfig(val, index) {
      this.selectedConfigIndex = index
      this.selectedConfigId = val.configure_id
      this.alias = val.alias
      this.mode = 'edit'
      this.bar = true
    },

    async loadConfigures(projectId) {
      this.isLoadConfigures = true;
      try {
        let response = await this.actionFetchConfigures(projectId)
        this.configureOptions = this.constructOptionsConfigId(response.data.configs)
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
    /* Response */
    onChangeStatusCodeResponse(val) {
      this.nextFailure.statusCode = val
    },
    onChangeTransformResponse(val) {
      this.nextFailure.transform = val;
    },

    onChangeAddHeaderResponse(val) {
      this.nextFailure.codeAddHeader = val;
    },
    onChangeAddBodyResponse(val) {
      this.nextFailure.codeAddBody = val;
    },
    onChangeModifyHeaderResponse(val) {
      this.nextFailure.codeModifyHeaderRequest = val
    },
    onChangeModifyBodyResponse(val) {
      this.nextFailure.codeModifyBody = val
    },
    onChangeDeleteHeaderResponse(val) {
      this.nextFailure.codeDeleteHeader = val
    },
    onChangeDeleteBodyResponse(val) {
      this.response.codeDeleteBody = val
    },
    fillDataNextFailure(parallel) {
      if (parallel && parallel.next_failure) {
        const {transform, adds, modifies, deletes, status_code} = parallel.next_failure
        this.nextFailure = {
          statusCode: status_code,
          transform: transform,
          codeAddHeader: adds.header ? adds.header : {},
          codeAddBody:  adds.body ? adds.body : {},
          codeModifyHeader:  modifies.header ? modifies.header : {},
          codeModifyBody:  modifies.body ? modifies.body : {},
          codeDeleteHeader: deletes.header ? deletes.header : [],
          codeDeleteBody:   deletes.body ? deletes.body : [],

        }
      }
    }
  },
  created() {

  },
  async mounted() {
    await this.loadParallel();
    await this.loadConfigures(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>