<template>
  <div class="full-height">
    <div class="column" style="height: 100%">
      <div class="col">
        <q-splitter
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
              <q-tab name="projects" icon="folder" label="Project"/>
              <q-tab name="router" icon="alt_route" label="Router"/>
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
                <p class="text-h7 q-mb-md"> Container Created : {{ container.containerId ? 'Yes' : 'No' }}</p>

                <div v-if="container.containerId">
                  <div v-if="!isToggling">
                    <q-icon
                        class="icon-toggle"
                        v-if="!container.running"
                        size="md"
                        name="play_arrow"
                        style="color:#2F612F "
                        @click="toggleContainer"
                    >
                      <q-tooltip>
                        Start Docker Container
                      </q-tooltip>
                    </q-icon>

                    <q-icon
                        class="icon-toggle"
                        v-if="container.running"
                        size="md"
                        name="pause"
                        style="color :#E84B1E"
                        @click="toggleContainer"
                    >
                      <q-tooltip>
                        Stop Docker Container
                      </q-tooltip>
                    </q-icon>
                  </div>

                  <div v-else>
                    <q-spinner
                        color="primary"
                        size="3em"
                        :thickness="2"
                    />
                  </div>
                </div>
                <div v-else>
                  <q-btn @click="createDockerContainer" v-if="!isCreatingDockerContainer">Create Docker Container</q-btn>
                  <q-spinner-hourglass color="light-green" v-else size="3em"
                                       :thickness="2" />
                </div>
                <br/>
                <q-input

                    filled
                    type="text"
                    v-model="container.name"
                    label="Container Name*"
                    hint="Container Name"
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <br/>

                <q-input
                    v-model="container.description"
                    type="textarea"
                    filled hint="Container Description"
                    label="Description"/>

                <br/>


              </q-tab-panel>

              <q-tab-panel name="projects">
                <div class="text-h4 q-mb-md">Assign Projects</div>

                <q-table
                    style="height: 400px"
                    title="Assigned Projects"
                    :data="container.projectIds"
                    :columns="projectAssignedColumns"
                    row-key="index"
                    virtual-scroll
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

                        <p v-if="col.name !== 'action' ">{{ col.value }}</p>
                        <q-icon
                            v-if="col.name==='action'"
                            size="xs"
                            name="delete"
                            @click="removeAssignedProject(props.row)"
                        />

                      </q-td>
                    </q-tr>
                  </template>
                </q-table>


                <q-table
                    style="height: 400px"
                    title="Your Projects"
                    :data="filteredProject"
                    :columns="projectColumns"
                    row-key="index"
                    virtual-scroll
                    :pagination.sync="projectPagination"
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
                            name="add"
                            @click="addProject(props.row)"
                        />

                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-dialog v-model="alert">
                  <q-card>
                    <q-card-section>
                      <div class="text-h6">Alert</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      Project Already Assigned
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn flat label="OK" color="primary" v-close-popup/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-tab-panel>

              <q-tab-panel name="router">
                <div class="text-h4 q-mb-md">Define Router</div>
                <q-btn @click="openAddRouteDialog">Add route</q-btn>
                <q-table
                    style="height: 400px"
                    title="Router"
                    :data="container.routers"
                    :columns="routerColumns"
                    row-key="index"
                    virtual-scroll
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

                        <div
                            v-if="col.name==='action'"
                            class="row"
                        >
                          <div class="col">
                            <q-icon
                                size="xs"
                                name="edit"
                                @click="openEditRouteDialog(props.row)"
                            />
                          </div>
                          <div class="col">
                            <q-icon
                                size="xs"
                                name="delete"
                                @click="removeRouter(props.rowIndex)"
                            />
                          </div>


                        </div>


                      </q-td>
                    </q-tr>
                  </template>
                </q-table>

                <q-dialog
                    v-model="routerDialog"
                >
                  <q-card style="width: 700px; max-width: 80vw;">

                    <q-bar>
                      <q-space/>
                      <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                      </q-btn>
                    </q-bar>

                    <q-card-section>
                      <div class="text-h6">Router</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <q-input

                          filled
                          type="text"
                          v-model="dataInputRoute.path"
                          label="Route Path*"
                          hint="Route Path"
                          :rules="[ val => val && val.length > 0 || 'Please type something']"
                      />

                      <q-select v-model="dataInputRoute.type" :options="type" label="Select request type"
                                style="max-width: 300px"/>

                      <q-select v-model="dataInputRoute.method" :options="method" label="Select REST Method"
                                style="max-width: 300px"/>

                      <q-select v-model="dataInputRoute.projectId" :options="container.projectIds"
                                label="Select Configuration Id"
                                style="max-width: 300px"/>
                      <br/>

                    </q-card-section>

                    <q-card-actions align="right" class="bg-white text-teal">
                      <q-btn flat label="Add" v-close-popup @click="addRoute"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
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
          <div class="col-1" v-if="$route.name === 'Containers.Detail' ">
            <q-btn @click="dialogDelete= true" type="negative">Delete</q-btn>
          </div>
        </div>

      </div>
    </div>
    <q-dialog v-model="dialogDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white"/>
          <span class="q-ml-sm">Are you sure want to delete this container ? </span>
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
import {mapActions,} from "vuex";

export default {
  computed: {
    filteredProject: function () {
      let projectNotAssigned = [];
      this.projects.forEach(e => {
        if (!this.container.projectIds.includes(e.id)) {
          projectNotAssigned.push(e);
        }
      })
      return projectNotAssigned
    }
  },
  data() {
    return {
      tab: 'general',
      splitterModel: 10,
      containerName: '',
      description: '',

      container: {
        containerId: null,
        name: '',
        description: '',
        projectIds: [],
        routers: [],
        running: false,
      },

      /* for table projects */
      projects: [],
      projectPagination: {
        rowsPerPage: 1000
      },
      projectColumns: [
        {
          name: 'index',
          label: '#',
          field: 'index',
          align: 'left',
        },
        {
          name: 'projectId',
          label: 'Project id',
          field: row => row.id,
          align: 'left',
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
        },
        {
          name: 'description',
          required: false,
          label: 'Description',
          align: 'left',
          field: row => row.description,
          format: val => `${val ? val.substring(0, 30) + '...' : '-'}`,
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
          align: 'left',
        }
      ],

      /* for table projectIds */
      projectAssignedColumns: [
        {
          name: 'projectId',
          label: 'Assigned Project id',
          field: row => row,
          align: 'left',
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
          align: 'left',
        }
      ],

      /* for alert dialog */
      alert: false,

      /* routers table */
      type: ['serial', 'parallel'],
      routerDialog: false,
      dataInputRoute: {
        path: '',
        type: '',
        method: '',
        projectId: ''

      },
      method: ['POST', 'GET', 'PUT', 'DELETE'],
      routerColumns: [
        {
          name: 'path',
          label: 'Path',
          field: row => row.path,
          align: 'left',
        },
        {
          name: 'type',
          label: 'Type',
          align: 'left',
          field: row => row.type,
        },
        {
          name: 'method',
          label: 'Method',
          align: 'left',
          field: row => row.method,
        },
        {
          name: 'project_id',
          label: 'Project id',
          field: row => row.project_id,
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
          align: 'left',
        }
      ],

      dialogDelete: false,

      /* for toggling start stop */
      isToggling : false,

      /* for creating docker container */
      isCreatingDockerContainer :false,
    }
  },
  methods: {
    ...mapActions({
      getSpecificContainer: 'containers/getContainerById',
      actionFetchProjects: 'projects/fetchProjects',
      storeContainer: 'containers/storeContainer',
      updateContainer: 'containers/updateContainer',
      deleteContainer: 'containers/deleteContainer',
      actionToggleContainer: 'containers/toggleStartStopContainer',
      actionCreateDockerContainer : 'containers/createDockerContainer',
    }),
    async createDockerContainer(){
      this.isCreatingDockerContainer = true;
      try {
       let response = await this.actionCreateDockerContainer({
         dbContainerId : this.$route.params.id
       })
        console.log("create docker repsonse")
        console.log(response.data)
        this.container.containerId = response.data.container_id;
        this.$q.notify({
          message: 'Create Docker Container Success.',
          color: 'secondary'
        })
      }catch (err) {
       console.log(err)
      }
      this.isCreatingDockerContainer = false;
    },
    async toggleContainer() {
      this.isToggling = true;
      try {
        let response = await this.actionToggleContainer({
          dbContainerId: this.$route.params.id,
        })
        this.container.running = response.data.running
      } catch (e) {
        console.log(e)
      }
      this.isToggling = false;
    },
    async onDeleteClicked() {
      try {
        await this.deleteContainer(this.$route.params.id);
        this.$q.notify({
          message: 'Delete Container Success',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Home.Containers'})
      } catch (e) {
        console.log(e)
      }
    },
    async onSaveClicked() {
      if (this.$route.name === 'Containers.Detail') {
        await this.onUpdateContainer()

      } else {
        await this.onStoreContainer()
      }
    },
    async onStoreContainer() {
      try {
        let response = await this.storeContainer({
          name: this.container.name,
          description: this.container.description,
          projectIds: this.container.projectIds,
          routers: this.container.routers

        });
        const {id} = response.data
        this.$q.notify({
          message: 'StoreContainer Success',
          color: 'secondary'
        })
        await this.$router.replace({name: 'Containers.Detail', params: {id}})
      } catch (e) {
        console.log(e)
      }
    },
    async onUpdateContainer() {
      try {
        await this.updateContainer({
          id: this.$route.params.id,
          name: this.container.name,
          description: this.container.description,
          projectIds: this.container.projectIds,
          routers: this.container.routers
        });
        this.$q.notify({
          message: 'Update Container Success',
          color: 'secondary'
        })
      } catch (e) {
        console.log(e)
      }
    },
    addRoute() {
      this.container.routers.push({
        path: this.dataInputRoute.path,
        method: this.dataInputRoute.method,
        type: this.dataInputRoute.type,
        project_id: this.dataInputRoute.projectId
      })
      this.clearDataInputRoute()
    },
    clearDataInputRoute() {
      this.dataInputRoute = {
        method: '',
        projectId: '',
        type: '',
        path: '',
      }
    },
    openAddRouteDialog() {
      this.clearDataInputRoute() ,
          this.routerDialog = true;
    },
    openEditRouteDialog(route) {
      this.dataInputRoute = {
        method: route.method,
        projectId: route.project_id,
        type: route.type,
        path: route.path,
      }
      this.routerDialog = true;
    },
    removeRouter(index) {
      this.container.routers.splice(index, 1)
    },
    removeAssignedProject(projectId) {
      this.container.projectIds = this.container.projectIds.filter(e => e !== projectId)
    },
    addProject(project) {
      if (this.container.projectIds.includes(project.id)) {
        /* show alert */
        this.alert = true
      } else {
        this.container.projectIds.push(project.id)
      }
    },
    async loadContainerById(id) {
      try {
        let response = await this.getSpecificContainer(id)
        this.fillContainerData(response.data)
      } catch (err) {
        console.log(err)
      }
    },
    async fetchProjects() {
      try {
        let response = await this.actionFetchProjects();
        this.projects = response.data;
        this.projects.forEach((row, index) => {
          row.index = index
        })
      } catch (err) {
        console.log(err)
      }

    },
    fillContainerData(data) {
      this.container = {
        name: data.name,
        containerId: data.container_id,
        description: data.description,
        projectIds: data.project_ids,
        routers: data.routers,
        running: data.running,
      }
    }
  },
  async mounted() {
    if (this.$route.name === 'Containers.Detail') {
      await this.loadContainerById(this.$route.params.id)
    }
    await this.fetchProjects();
  }
}
</script>

<style scoped lang="scss">
.icon-toggle {
  &:hover {
    cursor: pointer;
  }
}
</style>