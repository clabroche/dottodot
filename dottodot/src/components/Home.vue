<template>
  <div class>
    <div class="navbar">
      Dot to Dot
    </div>
    <div class="draws">
      <button class="button-add-draw" @click="showPopup = true"><i class="fas fa-plus"></i></button>
      <div class="popup" v-if="showPopup">
        <div class="popup-content">
          <div class="close" @click.stop="showPopup = false"><i class="fas fa-times"></i></div>
          <input type="text" v-model="name" placeholder="Name of this drawing...">
          <input v-if="name" type="file" id="file" ref="file" v-on:change="handleFileUpload()">
          <button v-if="name && file" v-on:click="submitFile()">Submit</button>
        </div>
      </div>
      <div v-for="draw of draws" :key="draw.id" class="draw-container" @click.stop="$router.push('/draws/' + draw.id)">
        <div class="actions">
          <button @click.stop="deleteDraw(draw)"><i class="fas fa-times"></i></button>
          <button @click.stop="$router.push('/draws/' + draw.id + '/edit')"><i class="fas fa-edit"></i></button>
        </div>
        <img :src="'http://localhost:3000' +draw.dots" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data() {
    return {
      draws: [],
      name: '',
      file:null,
      showPopup: false
    }
  },
  async mounted() {
    await this.getDraws()
  },
  methods: {
    async getDraws() {
      const {data: draws} = await axios.get('http://localhost:3000/api/v1/draws', {responseType:'json'})
      this.draws = draws
    },
    async deleteDraw(draw) {
      await axios.delete('http://localhost:3000/api/v1/draws/' + draw.id)
      return this.getDraws()
    },
    openPopup() {
      this.showPopup = true
    },
    submitFile(){
      if(!this.name) return
      let formData = new FormData();
      formData.append('file', this.file);
      const url = 'http://localhost:3000/api/v1/draws/'+ this.name
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
        // data: {
        //   name: this.name
        // }
      } 
      axios.post(url, formData, options)
      .then(function(){

        console.log('SUCCESS!!');
      })
      .catch(function(){
        console.log('FAILURE!!');
      });
      this.file = null
      this.name = ''
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
.button-add-draw {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: none;
  background-color: #3a388c;
  color: white;
  box-shadow: 0 0 5px 1px #444444;
  z-index: 3;
}
.popup {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2;
  .popup-content{
    input {
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    position: relative;
    width: 90vw;
    height: 90vh;
    margin-top: 5vh;
    margin-bottom: 5vh;
    margin-left: 5vw;
    margin-right: 5vw;
    background-color: #fff;
    box-sizing: border-box;
    padding: 40px;
    .close {
      margin: 10px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
.navbar {
  width: 100%;
  height: 50px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  padding:10px; 
  background-color: #3a388c;
  margin-bottom: 20px;
  box-sizing: border-box;
  color: white;
}
.draws {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: calc(100vh - 50px)
}
  .draw-container{
    position: relative;
    width: 250px;
    height: 250px;
    margin: 10px;
    img {
      position: absolute;
      top: 0;
      left:0;
      width: 100%;
      height: 100%;
    }
    .actions {
      width: 100%;
      position: absolute;
      bottom: 0;
      right:0;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      button {
        font-size: 1.2em;
        width: 40px;
        height: 40px;
      }
    }
  }
</style>