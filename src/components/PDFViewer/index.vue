<template>
  <div ref='viewer'></div>
</template>

<script>
/* eslint-disable */
import WebViewer from '@pdftron/webviewer'

export default {
  name: 'PDFViewer',
  props: {
    path: String,
    url: String,
    onInit: Function,
    onAnnotationChanged: Function,
    customToolbar: Function,
    readOnly: Boolean
  },
  data() {
    return {
      instance: null
    }
  },
  mounted: function () {
    WebViewer({
      path: this.path,
      initialDoc: this.url, // replace with your own PDF file
    }, this.$refs.viewer).then((instance) => {
      // call apis here
      const { UI, Core } = instance
      const { documentViewer, annotationManager } = Core
      UI.disableElements([
        'toolsHeader',
        'imageSignaturePanelButton',
        'rubberStampToolGroupButton',
        'fileAttachmentToolGroupButton',
        'calloutToolGroupButton',
        'eraserToolButton',
        'dropdown-item-toolbarGroup-View',
        'dropdown-item-toolbarGroup-Insert',
        'dropdown-item-toolbarGroup-Annotate',
        'dropdown-item-toolbarGroup-Shapes',
        'dropdown-item-toolbarGroup-Edit',
        'dropdown-item-toolbarGroup-FillAndSign',
        'dropdown-item-toolbarGroup-Forms',
        'toolbarGroup-View',
        'toolbarGroup-Insert',
        'toolbarGroup-Annotate',
        'toolbarGroup-Shapes',
        'toolbarGroup-Edit',
        'toolbarGroup-FillAndSign',
        'toolbarGroup-Forms',
        'toggleNotesButton'
      ])

      // const iframeDoc = UI.iframeWindow.document
      // const insertBtn = iframeDoc.querySelector('[data-element="toolbarGroup-Insert"]')

      UI.setSignatureFonts(['Roboto']);

      documentViewer.addEventListener('documentLoaded', (res) => {
        if(!this.readOnly) {
          UI.enableElements(['header', 'toolsHeader', 'toolbarGroup-Insert', 'dropdown-item-toolbarGroup-Insert'])
        }

        // auto select Insert toolbar
        instance.UI.setToolbarGroup('toolbarGroup-Insert')
        // setTimeout(() => {
        //   insertBtn.click()
        // }, 1000)
        if(this.customToolbar && typeof this.customToolbar === 'function') {
          this.customToolbar(instance)
        }
      })

      if(this.onInit && typeof this.onInit === 'function') {
        this.onInit(instance)
      }

      annotationManager.on('annotationChanged', (annotations, action) => {
        if(this.onAnnotationChanged && typeof this.onAnnotationChanged === 'function') {
          this.onAnnotationChanged(annotations, action)
        }
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
}
</style>
