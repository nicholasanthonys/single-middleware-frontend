<template>
  <div>
    <v-jsoneditor
        :value="value"
        :plus="false"
        style="height:300px"
        @error="onError"
        :options="options"
        @input="updateValue"

    />
    <br/>
    <p class="text-h5">Raw JSON Representation</p>
    <pre>{{ JSON.stringify(value, null, '\t') }}</pre>
  </div>
</template>

<script>

export default {
  props :[
    'value'
  ],
  data(){
    return {
      code : this.value,
      options: {
        mode: null,
        // onEditable: function (node) {
        //   // console.log("node")
        //   return true;
        // },
        theme: "ace/theme/tomorrow_night_bright",
      },
    }
  },
  methods : {
    updateValue(val){
     this.$emit('input',val)
    },
    onError(err) {
      console.log("error with editor")
      console.log(err);

    },
  }
}
</script>

<style scoped>

</style>