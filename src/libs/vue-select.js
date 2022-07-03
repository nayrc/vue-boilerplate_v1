import Vue from "vue"
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  OpenIndicator: {
    render: (createElement) => createElement("span"),
  },
})

Vue.component("VSelect", vSelect)
