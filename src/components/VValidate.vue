<template>
  <ValidationProvider ref="vm" :name="name" :rules="rules" v-slot="{ errors }" :vid="vid">
    <input type="hidden" v-model="input">
    <div v-if="type=='alert'" class="alert alert-warning" v-show="errors[0]">{{message||errors[0]}}</div>
    <span v-else class="label_error" v-show="errors[0]">{{message||errors[0]}}</span>
  </ValidationProvider>
</template>

<script>
import Gen from '@/libs/Gen'

export default {
  props:{
    name: String,
    rules: [String,Object],
    vid: String,
    value: [String,Number,Boolean,Array,Object,Date],
    message: String,
    type: {type:String,default:()=>('label')}
  },
  data(){
    return {
      input: null
    }
  },
  mounted(){
    this.input = this.value
  },
  watch:{
    value(v){
      this.input = v;
      Gen.delay(()=>{
        this.$refs.vm.validate()
      }, 50)
    }
  }
}
</script>

<style>
.label_error {
  color: red;
  font-size:12px
}
</style>