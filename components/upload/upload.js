// components/upload/upload.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
    },
    name: {
      type: String,
      value:'file'
    },
    tipText: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploadMax: 3,//最多上传图片数量
    uploadCount: 9,//最多可以选择的图片张数
    uploadFileList: []
  },

  created() {
    this.index = 0;
    this.createdAt = Date.now();
    this.getUid = () => `${this.createdAt}-${++this.index}`;
    this.tempFilePaths = [];
    this.uploadTask = {};
  },
  /**
   * 组件的方法列表
   */
  methods: {
    calcValue(count, max) {
      const realCount = parseInt(count)
      const uploadMax = parseInt(max) > -1 ? parseInt(max) : -1
      let uploadCount = realCount

      // 限制总数时
      if (uploadMax !== -1 && uploadMax <= 9 && realCount > uploadMax) {
          uploadCount = uploadMax
      }

      return {
          uploadMax,
          uploadCount,
      }
    },
    onSelect(event) {
      const { uploadCount, uploadMax, uploadFileList: fileList } = this.data;
      const { uploadCount: count } = this.calcValue(uploadCount, uploadMax - fileList.length);
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.tempFilePaths = res.tempFilePaths.map((item) => ({ url: item, uid: this.getUid() }));
          this.triggerEvent('before', { ...res, fileList })
          this.uploadFile();
        }
      })
    },
    uploadFile() { 
      if (!this.tempFilePaths.length) return;
      const { url, name } = this.data;
      const file = this.tempFilePaths.shift();
      const { uid, url:filePath } = file
      this.onStart(file);
      this.uploadTask[uid] = wx.uploadFile({
        url,
        filePath,
        name,
        // header:{
        //   "content-type": "application/json",
        // },
        header: {
          "content-type": "multipart/form-data"
        },  
        success: (res)=>this.onSuccess(file,res),
        fail: (res) => this.onFail(file, res),
        complete: (res)=> { 
          delete this.uploadTask[uid];
          this.triggerEvent('complete', res);
          this.uploadFile();
        }
      });
      this.uploadTask[uid].onProgressUpdate((res) => this.onProgress(file, res));
    },
    onStart(file) {
      const targetItem = {
          ...file,
          status: 'uploading',
      }

      this.onChange({
        file: targetItem,
        fileList: [...this.data.uploadFileList, targetItem],
      })
    },
    onChange(info = {}) { 
      this.setData({
        uploadFileList: info.fileList
      });
      this.triggerEvent('change',info);
    },
    onSuccess(file, res) {
      const fileList = [...this.data.uploadFileList];
      const index = fileList.map((item) => item.uid).indexOf(file.uid);
      if (index !== -1) { 
        const targetFile = {
          ...file,
          status: 'done',
          res: JSON.parse(res.data)
        }
        const info = {
          file: targetFile,
          fileList
        }
        fileList.splice(index, 1, targetFile);
        this.triggerEvent('success', info);
        this.onChange(info);
      }
    },
    onProgress(file, res) { 
      const fileList = [...this.data.uploadFileList];
      const index = fileList.map((item) => item.uid).indexOf(file.uid);
      
      if (index !== -1) { 
        const targetFile = {
          ...file,
          progress: res.progress,
          res
        }
        console.log(targetFile);
        const info = {
          file: targetFile,
          fileList
        }
        fileList.splice(index, 1, targetFile);
        this.triggerEvent('progress', info);
        this.onChange(info);
      }
    },
    onFail(res) {
      console.log('上传错误')
      const fileList = [...this.data.uploadFileList];
      const index = fileList.map((item) => item.uid).indexOf(file.uid);
      if (index !== -1) { 
        const targetFile = {
          ...file,
          status: 'fail',
          res
        };
        const info = {
          file: targetFile,
          fileList
        };
        fileList.splice(index, 1, targetFile);
        this.triggerEvent('fail', info);
        this.onChange(info);
      }
    },
    onRemove(event) { 
      const file = event.currentTarget.dataset.file;
      const fileList = [...this.data.uploadFileList];
      const index = fileList.map((item) => item.uid).indexOf(file.uid);
      if (index !== -1) { 
        const targetFile = {
          ...file,
          status: 'remove',
        }
        const info = {
          file: targetFile,
          fileList
        }
        fileList.splice(index, 1);
        this.triggerEvent('remove', {...event.currentTarget.dataset,info});
        this.onChange(info)
      }

    },
    abort(uid) {
      const { uploadTask } = this

      if (uid) {
          if (uploadTask[uid]) {
              uploadTask[uid].abort()
              delete uploadTask[uid]
          }
      } else {
          Object.keys(uploadTask).forEach((uid) => {
              if (uploadTask[uid]) {
                  uploadTask[uid].abort()
                  delete uploadTask[uid]
              }
          })
      }
    },
    detached() {
      this.abort()
    },
  }
})
