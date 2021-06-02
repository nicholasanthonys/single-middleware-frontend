<template>
  <div>
    <div v-if="parallel">

      <p class="text-h5">Parallel Config File</p>
      <div class="column" style="height: 500px">
        <div class="col-1">
          <q-btn @click="onAddSelectedConfig">Add New Parallel Config</q-btn>
        </div>
        <div class="col">
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
                  <div v-else>
                    <q-btn color="primary" icon="edit" label="edit" size="sm"
                           class="q-mr-sm"

                           @click="onSelectedConfig(props.row, props.rowIndex)"
                    />

                    <q-btn color="negative" icon="delete" label="Delete" size="sm"
                           @click="onDeleteConfig($route.params.id, props.row)"
                    />


<!--                    <q-icon-->
<!--                        size="xs"-->
<!--                        name="edit"-->
<!--                        @click="onSelectedConfig(props.row, props.rowIndex)"-->
<!--                    />-->
                  </div>


                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <div v-if="!isLoading">
        <p class="text-h5">Parallel Next Failure Response</p>
        <div class="column" style="height: 700px">
          <div class="col-1">
            <q-btn @click="onSaveNextFailure">Save Next Failure</q-btn>
          </div>
          <div class="col">
            <EditorRequestResponseConfig ref="editor"
                                         config-type="response"
                                         :have-log="false"

                                         v-model="nextFailure"
            />
          </div>
        </div>

      </div>
      <div v-else>
        <q-spinner
            color="primary"
            size="3em"
        />
      </div>

      <p class="text-h5">C Logics Parallel</p>
      <div class="column" style="height: 500px">
        <div class="col-1">
          <q-btn @click="openDialogAddCLogic"> Add CLogic</q-btn>
        </div>
        <div class="col">
        <CLogicTable :c-logics="parallel.c_logics" @on-select-clogic="selectCLogic"
                     @on-delete-clogic="onDeleteCLogic" />
        </div>
      </div>


      <!-- Parallel Config Dialog -->
      <q-dialog v-model="dialogParallelConfig" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section class="q-pt-md q-pb-md q-pl-md q-pr-md">

            <q-select v-model="selectedConfigId" :options="configureOptions" label="Select Configuration Id"
                      style="max-width: 300px"
                      :rules="[ val => val && val.length > 0 || 'Please select config id']"
                      ref="configId"
            />
            <br/>


            <q-input
                outlined
                v-model="alias"
                label="Alias *"
                hint="Config Alias"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                ref="alias"
            />

            <q-input

                filled
                type="text"
                v-model="loop"
                label="Loop"
                hint="Request Loop only available for parallel."
            />

            <br/>

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

      <q-dialog v-model="dialogDeleteCLogic" persistent v-if="selectedCLogic">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white"/>
            <span class="q-ml-sm">Are you sure want to delete cLogic with id {{ selectedCLogic.id }} ? </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup/>
            <q-btn flat label="Delete" color="primary" :loading="isDeletingCLogic"
                   @click="deleteCLogic($route.params.id, selectedCLogic.id)"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogDeleteConfig" persistent v-if="selectedConfigId">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="negative" text-color="white"/>
            <span class="q-ml-sm">Are you sure want to delete config parallel with id {{ selectedConfigId }} ? </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup/>
            <q-btn flat label="Delete" color="primary" :loading="isDeletingConfig"
                   @click="deleteConfig($route.params.id, selectedConfigId)"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import EditorRequestResponseConfig from "../../components/common/EditorRequestResponseConfig";
import {mapActions, mapGetters} from "vuex";
import CLogicItemDetail from "./CLogicItemDetail";
import CLogicTable from "../../components/CLogic/CLogicTable";

export default {
  computed: {
    ...mapGetters({
      parallel: 'parallel/getParallel'
    })
  },
  components: {
    CLogicTable,
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

      /* for dialog config file parallel */
      mode: 'add',
      configureOptions: [],
      dialogParallelConfig: false,
      selectedConfigIndex: -1,
      selectedConfig: false,
      selectedConfigId: null,
      alias: null,
      loop: null,

      /* for dialog clogic parallel */
      cLogicMode: 'add',
      cLogicDialog: false,
      selectedCLogic: null,
      selectedCLogicIndex: -1,
      maximizedToggle: true,

      isLoading: false,
      validatorConfig: {
        configIdErr: false,
        aliasErr: false,
        formHasError: false,
      },

      validatorNextFailure: {
        statusCodeErr: false,
        formHasError: false,
      },

      dialogDeleteCLogic: false,
      isDeletingCLogic: false,

      dialogDeleteConfig: false,
      isDeletingConfig: false,
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
      actionFetchParallel: 'parallel/fetchParallel',
      deleteCLogicParallel: 'parallel/deleteSpecificCLogic',
      deleteConfigFileParallel: 'parallel/deleteSpecificConfigFile',
    }),
    onDeleteConfig(projectId, config) {
      this.selectedConfigId = config.id
      this.dialogDeleteConfig = true;
    },
    async deleteConfig(projectId, configFileId) {
      this.isDeletingConfig = true;
      try {
        await this.deleteConfigFileParallel({projectId, configFileId})
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        this.dialogDeleteConfig = false;
      } catch (e) {
        this.$q.notify({
          message: 'Somethings wrong when deleting parallel config file',
          color: 'negative'
        })
        console.log(e)
      }
      this.isDeletingConfig = false;
    },
    onDeleteCLogic(val) {
      const {cLogic} = val
      this.selectedCLogic = cLogic
      this.dialogDeleteCLogic = true;
    },
    async deleteCLogic(projectId, cLogicId) {
      this.isDeletingCLogic = true;
      try {
        await this.deleteCLogicParallel({projectId, cLogicId});
        this.$q.notify({
          message: 'Delete Success.',
          color: 'secondary'
        })
        this.dialogDeleteCLogic = false;
      } catch (err) {
        this.$q.notify({
          message: 'Somethings wrong when deleting clogic.',
          color: 'negative'
        })
        console.log(err)
      }
      this.isDeletingCLogic = false;
    },

    validateInputNextFailure() {
      this.validatorNextFailure.formHasError = false;
      this.$refs.editor.$refs.statusCode.validate()
      this.validatorNextFailure.statusCodeErr = this.$refs.editor.$refs.statusCode.hasError

      if (this.validatorNextFailure.statusCodeErr) {
        this.validatorNextFailure.formHasError = true
      }
    },

    validateInputConfig() {
      this.validatorConfig.formHasError = false;
      this.$refs.configId.validate();
      this.validatorConfig.configIdErr = this.$refs.configId.hasError

      this.$refs.alias.validate();
      this.validatorConfig.aliasErr = this.$refs.alias.hasError

      if (this.validatorConfig.configIdErr) {
        this.validatorConfig.formHasError = true
      }

      if (this.validatorConfig.aliasErr) {
        this.validatorConfig.formHasError = true
      }
    },
    async loadParallel() {
      this.isLoading = true;
      try {
        await this.actionFetchParallel(this.$route.params.id)
        this.fillDataNextFailure(this.parallel);
      } catch (e) {
        console.log(e)
      }
      this.isLoading = false;
    },

    async onSaveNextFailure() {
      this.validateInputNextFailure()
      if (!this.validatorNextFailure.formHasError) {
        try {
          await this.storeNextFailureParallel({
            projectId: this.$route.params.id,
            status_code: this.nextFailure.statusCode,
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
      }

    },
    openDialogAddCLogic() {
      this.cLogicMode = 'add',
          this.cLogicDialog = true
    },
    async onCLogicSave() {
      this.cLogicDialog = false
    },
    async onConfigFileSave() {
      this.validateInputConfig();
      if (!this.validatorConfig.formHasError) {
        if (this.mode === 'edit') {
          try {
            await this.updateSingleConfigParallel({
              projectId: this.$route.params.id,
              id: this.parallel.configures  [this.selectedConfigIndex].id,
              configure_id: this.selectedConfigId,
              alias: this.alias,
              loop: this.loop
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
              configure_id: this.selectedConfigId,
              alias: this.alias,
              loop: this.loop
            })

            this.$q.notify({
              message: 'Add Parallel Config Success.',
              color: 'secondary'
            })
          } catch (err) {
            console.log(err)
          }

        }
        this.dialogParallelConfig = false
      }

    },
    selectCLogic(val) {
      const {cLogic, cLogicIndex} = val
      this.selectedCLogic = cLogic
      this.selectedCLogicIndex = cLogicIndex
      this.cLogicMode = 'edit';
      this.cLogicDialog = true
    },
    onAddSelectedConfig() {
      this.mode = 'add';
      this.selectedConfigId = null;
      this.alias = null;
      this.dialogParallelConfig = true
    },
    onSelectedConfig(val, index) {
      this.selectedConfigIndex = index
      this.selectedConfigId = val.configure_id
      this.alias = val.alias
      this.loop = val.loop

      this.mode = 'edit'
      this.dialogParallelConfig = true
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

    fillDataNextFailure(parallel) {
      console.log("parallel is ")
      console.log(parallel)
      if (parallel && parallel.next_failure) {
        const {transform, adds, modifies, deletes, status_code} = parallel.next_failure
        this.nextFailure = {
          statusCode: status_code,
          transform: transform,
          codeAddHeader: adds.header ? adds.header : {},
          codeAddBody: adds.body ? adds.body : {},
          codeModifyHeader: modifies.header ? modifies.header : {},
          codeModifyBody: modifies.body ? modifies.body : {},
          codeDeleteHeader: deletes.header ? deletes.header : [],
          codeDeleteBody: deletes.body ? deletes.body : [],

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