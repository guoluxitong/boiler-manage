<template>
  <div >
    <el-row class="app-query">
      <el-col :offset="19" :span="3">
        <el-button
          style="margin-left: 85%;"
          @click="canelForm"
          type="warning"
          icon="el-icon-back"
        >取消</el-button>
      </el-col>
    </el-row>
    <div  >
       <el-row>
         <el-col style=" border:1px solid #171717;height: 120px" :offset="3" :span="6">
           <div >
           <video-player v-if="srcList.length>0"  ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[0]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6">
           <div  >
           <video-player  v-if="srcList.length>1" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[1]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6">
           <div  >
           <video-player v-if="srcList.length>2" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[2]"></video-player>
           </div>
         </el-col>
       </el-row>
       <el-row>
         <el-col style=" border:1px solid #171717;height: 120px" :offset="3" :span="6">
           <div  >
           <video-player v-if="srcList.length>3" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[3]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6" >
           <div  >
           <video-player  v-if="srcList.length>4" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[4]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6" >
           <div  >
           <video-player v-if="srcList.length>5" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[5]"></video-player>
           </div>
         </el-col>
       </el-row>
       <el-row>
         <el-col style=" border:1px solid #171717;height: 120px" :offset="3" :span="6">
           <div  >
           <video-player v-if="srcList.length>6" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[6]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6">
           <div  >
           <video-player v-if="srcList.length>7" ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[7]"></video-player>
           </div>
         </el-col>
         <el-col style=" border:1px solid #171717;height: 120px" :span="6">
           <div  >
           <video-player v-if="srcList.length>8"  ref="videoPlayer" class="vjs-custom-skin videoPlayer" :options="playerOptionsList[8]"></video-player>
           </div>
         </el-col>
       </el-row>
     </div>
  </div>
</template>

<script>
import {
  getUserList,
  editUser,
  getUserRole,
  changeUserRole,
  deleteUserById
} from "@/api/user";
import { getRoleList } from "@/api/role";
import boilerCommonDeleteValidate from "@/views/boiler-common-delete-validate";
export default {
  components: {
    "boiler-common-delete-validate-dialog": boilerCommonDeleteValidate
  },
  data() {
    return {
      srcList:[
        { src: 'rtmp://rtmp01open.ys7.com/openlive/57762c47c8f24ebb807ea73f1ab6333f'},
      ],
      playerOptionsList: [],//这个是存放视频的数组，如果你要切换视频，直接判断要新增的视频（flagSrc）是否在数组内，如果不在，在数组里将他代替
      initialized: false,//初始化
      currentTech: '',
      streams: {
        rtmp: '',
        hls: ''
      },
      playerOptions: {
        height:'120',
        sources: [{
          type: 'rtmp/mp4',
          src: ''
        }],
        techOrder: ['html5','flash'],
        autoplay: true,
        muted: false,
        controls: true
      },
    };
  },
  created() {
this.inint()
  },
  methods: {
    inint(){
      this.playerOptionsList=[]
      for(var i=0;i<this.srcList.length;i++){
        this.playerOptionsList.push({
          height:'120',
          autoplay: true,
          muted: false,
          flash: {
            hls: { withCredentials: false },
          },
          html5: { hls: { withCredentials: false } },
            sources: [{
            type: 'rtmp/hls',
            src: this.srcList[i].src
          }],
            techOrder: ['html5','flash'],
            controls: true
        })
      }
},
    canelForm() {
      this.$router.push({ path: '/product' })
    },
  }
};
</script>
<style>
</style>
