var express = require('express');
var router = express.Router();
const Promise = require("bluebird");
const fse = Promise.promisifyAll(require("fs-extra"));
const config = require('../../config')
const pathfs = require('path')
let cv = require("opencv4nodejs")

const gm = require('gm').subClass({
  imageMagick: true
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  const draws = await getAllDraws()
  res.json(draws);
});
router.post('/:id/parse', async function (req, res, next) {
  const parsed = await parse(req.param.id)
  const draw = await getDraw(req.param.id)
  res.json(draw);
});

async function getAllDraws() {
  const dirs = await getDraws()
  return dirs.map(dir => ({ // TODO: send only if exist
    id: dir.split('/').pop(),
    picture: pathfs.resolve(dir, 'original.png'),
    dots: pathfs.resolve(dir, 'dots.json'),
    preprocessed: pathfs.resolve(dir, 'preprocessed.png'),
  }))
}
async function getDraw(id) {
  const draws = await getAllDraws()
  return draws.filter(draw => draw.id === id).pop()
}
async function parse(id) {
  const draw = await getDraw(id)
  const inputPath = config.getAbsolutePath(draw.picture)
  const outputPath = config.getAbsolutePath(draw.preprocessed)
  console.log(inputPath, outputPath)
  const im = await readImage(inputPath)
  const contours = await im.findContoursAsync(1, 1)
  console.log(contours)
  await cv.imwriteAsync(outputPath, im)
}

async function readImage(inputPath, outputPath) {
  const img = await cv.imreadAsync(inputPath);
  const grayImg = await img.bgrToGrayAsync();
  return grayImg.cannyAsync(100,100)
}

function filter(im) {
  im.canny(lowThresh, highThresh);
  im.dilate(nIters);
  return im
} 

(async _ => {
  const parsed = await parse('123456789') 
  console.log(parsed) 
})().catch(console.error)


async function getDraws() {
  return fse
    .readdirAsync(config.drawsPath)
    .map(dir => {
      const absolutePath = pathfs.resolve(config.drawsPath, dir)
      return config.getPublicPath(absolutePath)
    })
}
module.exports = router;
