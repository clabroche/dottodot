<template>
  <div class="">
    <div v-if="paths && edit" class="edit-box">
      <button @click="save()">Save</button>
      <button @click="resolve()">Resolve</button>
      <button @click="resolve(1)">Draw</button>
      <button @click="paths.contours.map(contour => $set(contour, 'hidden', true)); render()">Hide all</button>
      <div v-for="(contour, index) of paths.contours" :key="index" :style="{color: contour.color}">
        <button @click="$set(contour, 'hidden', true); render()" v-if="!contour.hidden">Hide</button>
        <button @click="$set(contour, 'hidden', false); render()" v-else>Show</button>
        <button @click="paths.contours.splice(index, 1); render()">Delete</button>
        {{index}}
      </div>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Axios from 'axios';
import Promise from 'bluebird'
const d3 = require('d3')
export default {
  name: 'draw',
  props: {
    edit: { default: false}
  },
  data() {
    return {
      resolvedPoints: [],
      canvas: null,
      ctx: null,
      paths: [],
      width: () => this.canvas.property("width"),
      height: () => this.canvas.property("height"),
      radius: 2.5,
      transform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },
  async mounted() {
    const id = this.$route.params.id
    this.canvas = d3.select("canvas")
    this.ctx = this.canvas.node().getContext("2d")
    const {data: draw} = await Axios.get(process.env.VUE_APP_HOST + '/api/v1/draws/' + id)
    const {data: paths} = await Axios.get(process.env.VUE_APP_HOST + draw.json)
    this.draw = draw
    this.paths = paths
    let resolvedPoints = localStorage.getItem('resolvedPoints-' + this.$route.params.id)
    if(resolvedPoints) {
      resolvedPoints = JSON.parse(resolvedPoints)
      this.resolvedPoints = resolvedPoints
      this.paths.contours.forEach(contour=> {
        contour.path.forEach(point => {
          resolvedPoints.forEach(resolved => {
            if(resolved.x === point.x && resolved.y === point.y && !point.hiden) {
              point.resolved = true
            }
          })
        })
      })
    }
    const canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    this.canvas
      .call(d3.drag().subject(this.dragsubject).on("drag", this.dragged))
      .call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", this.zoomed))
      .call(this.render);
  },
  methods: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async resolve(ms) {
      await Promise.mapSeries(this.paths.contours, async contour => {
        await Promise.mapSeries(contour.path, async point => {
          if(ms) {
            this.render()
            await this.wait(ms)
          }
          point.resolved = true
        })
      }).catch(err => console.error(err.message))
      if(!ms) this.render() 
    },
    zoomed() {
      if(!d3.event) return
      const transform = d3.event.transform
      if(transform.x > window.innerWidth || transform.y > window.innerHeight) return 
      this.transform = transform;
      this.render(); 
    },
    dragsubject() {
      const x = this.transform.invertX(d3.event.x)
      const y = this.transform.invertY(d3.event.y)
      const r = this.radius
      this.paths.contours.forEach(contour=> {
        if(contour.hidden) return 
        contour.path.forEach((point, index, points) => {
          const px = point.x;
          const py = point.y;
          if (x > px - r && x < px + r && y > py - r && y < py + r) {
            const previousPoint = points[index - 1]
            if(!previousPoint || previousPoint.resolved) {
              this.resolvePoint(point)
            } 
          }
        })
      })
      this.render()
    },
    resolvePoint(point) {
      point.resolved = true
      this.resolvedPoints.push(point)
      localStorage.setItem('resolvedPoints-' + this.$route.params.id, JSON.stringify(this.resolvedPoints))
    },
    dragged() {
      d3.event.subject[0] = this.transform.invertX(d3.event.x);
      d3.event.subject[1] = this.transform.invertY(d3.event.y);
      this.render();
    },

    render() {
      this.ctx.lineWidth = 2;
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width(), this.height());
      this.ctx.beginPath();
      this.ctx.translate(this.transform.x, this.transform.y);
      this.ctx.scale(this.transform.k, this.transform.k);
      this.paths.contours.forEach(contour=> {
        if(contour.hidden) return
        contour.path.forEach((point, index, points) => {
          if(point.resolved) {
            if(points[index - 1]) {
              this.drawLine(point, points[index - 1])
              if(!points[index + 1]) {
                this.drawLine(point, points[0])
              }
            }
          } 
          if((!points[index + 1]&& !point.resolved)|| (points[index + 1] && !points[index + 1].resolved)) {
            this.drawPoint(point, contour.color, index)
          }
        });
      })
      this.ctx.restore();
    },
    drawLine(pt1, pt2) {
      this.ctx.beginPath()
      this.ctx.moveTo(pt1.x, pt1.y);
      this.ctx.lineTo(pt2.x, pt2.y);
      this.ctx.stroke();
    },
    drawPoint(point, color, nb) {
      this.ctx.beginPath();
      this.ctx.fillStyle = color

      this.ctx.StrokeStyle = color
      this.ctx.moveTo(point.x + this.radius, point.y);
      this.ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill()
      this.ctx.font = '10px serif';
      this.ctx.fillText(nb, point.x + 5, point.y - 5);
    },
    async save() {
      this.paths.contours.forEach(contour=> {
        contour.path.forEach(point => {
          point.resolved = false
        })
      })
      await Axios.put(process.env.VUE_APP_HOST +'/api/v1/draws/'+ this.$route.params.id, this.paths)
    }
  },
}
</script>

<style scoped lang="scss">
.edit-box {
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 220px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  div {
    display: flex;

  }
}
</style>