// const basePath = process.cwd();
// const { NETWORK } = require(`../constants/network`);
// const fs = require("fs");
// const sha1 = require(`sha1`);
// const { createCanvas, loadImage } = require(`canvas`);
// const buildDir = `${basePath}/build`;
// const layersDir = `${basePath}/layers`;
// const layersDir = `${basePath}/folder/layers`;
// const {
//   format,
//   baseUri,
//   description,
//   background,
//   uniqueDnaTorrance,
// //   layerConfigurations,
//   rarityDelimiter,
//   shuffleLayerConfigurations,  
//   debugLogs,
//   extraMetadata,
//   text,
//   namePrefix,
//   network,
//   solanaMetadata,
//   gif,
// } = require(`./config`);
// const _ = require('lodash')

import host from '../constants/host';
import { shuffleLayerConfigurations, debugLogs } from './config'
import { mergeTrait } from '../utils/index'


// If you have selected Solana then the collection starts from 0 automatically
// const layerConfigurations = [
//     {
//       growEditionSizeTo: 5,
//       layersOrder: [
//         { name: "Background" },
//         { name: "Eyeball" },
//         { name: "Eye color" },
//         { name: "Iris" },
//         { name: "Shine" },
//         { name: "Bottom lid" },
//         { name: "Top lid" },
//       ],
//     },
//   ];



// const canvas = createCanvas(format.width, format.height);
// const ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = format.smoothing;
// var metadataList = [];
// var attributesList = [];
// let dnaList = new Set()
const DNA_DELIMITER = "-";

// const HashlipsGiffer = require(`./HashlipsGiffer.js`);
// const { resolve } = require("path");

let hashlipsGiffer = null;

// const buildSetup = () => {
//   if (fs.existsSync(buildDir)) {
//     fs.rmdirSync(buildDir, { recursive: true });
//   }
//   fs.mkdirSync(buildDir);
//   fs.mkdirSync(`${buildDir}/json`);
//   fs.mkdirSync(`${buildDir}/images`);
//   if (gif.export) {
//     fs.mkdirSync(`${buildDir}/gifs`);
//   }
// };

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());  // 
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

// const getElements = (path ,layer) => {
//   return fs
//     .readdirSync(path)
//     .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
//     .map((i, index) => {
//       if (i.includes("-")) {
//         throw new Error(`layer name can not contain dashes, please fix: ${i}`);
//       }

//       let weight = getRarityWeight(i)
//       const imageName =  cleanName(i)

//       if(!_.isEmpty(layer)) {
//         if(!_.isEmpty(layer.image)){

//            const imageConfig = layer.image.find(img => img.name == imageName)
//            if(!_.isEmpty(imageConfig)){
//               weight = imageConfig.rarity 
//            }

//         }
//       }
//       //console.log(cleanName(i))

//       return {
//         id: index,
//         name: imageName,  // without png
//         filename: i,
//         path: `${path}${i}`,
//         weight:  weight ,
//       };
//     });
// };


const getElements = (layer) => {
  let res = []
  for (const [index, item] of layer.images.entries()) {
    res.push({
      id: index,
      name: item.name,  // without png
      filename: item.name,
      path: item.path,
      weight: item.rarity,
    })
  }

  return res

}

const layersSetup = (layersOrder, projecDir = `${layersDir}`) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(layerObj),

    // elements: getElements(`${projecDir}/${layerObj.name}/` ,layerObj),
    // elements: getElements(`${layersDir}/${layerObj.name}/` ,layerObj),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    blend:
      layerObj.options?.["blend"] != undefined
        ? layerObj.options?.["blend"]
        : "source-over",
    opacity:
      layerObj.options?.["opacity"] != undefined
        ? layerObj.options?.["opacity"]
        : 1,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
  return layers;
};

const saveImage = (_editionCount, buildFolder = `${buildDir}/images`) => {
  try {
    //   fs.writeFileSync(
    //     `${buildDir}/images/${_editionCount}.png`,
    //     canvas.toBuffer("image/png")
    //   );
    fs.writeFileSync(
      `${buildFolder}/${_editionCount}.png`,
      canvas.toBuffer("image/png")
    );
  } catch (ex) {
    console.log(ex)
  }
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = ({
  _dna,
  _edition,
  projectName = "",
  symbol = "",
  description = "",
}) => {
  let dateTime = Date.now();
  let metadataList = [];

  let attributes = []
  for (const item of _dna) {
    const res = addAttributes(item, item.name)
    attributes.push(res[0])
  }

  let tempMetadata = {
    name: `${projectName}#${_edition - 1}`,
    description: description,
    symbol: symbol,
    image: '',
    dna: '',
    edition: _edition - 1,
    date: dateTime,
    attributes: attributes,
  };

  metadataList.push(tempMetadata);

  return metadataList
};

const addAttributes = (_element, name) => {
  let attributesList = []
  let selectedElement = _element.selectedElement;

  attributesList.push({
    trait_type: name,
    value: selectedElement.name
  });

  return attributesList
};

const loadLayerImg = async (_layer) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${_layer.selectedElement.path}`);
      resolve({ layer: _layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen) => {
  //ctx.globalAlpha = _renderObject.layer.opacity;
  // ctx.globalCompositeOperation = _renderObject.layer.blend;

  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  text.only
    ? addText(
      `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
      text.xGap,
      text.yGap * (_index + 1),
      text.size
    )
    : ctx.drawImage(
      _renderObject.loadedImage,
      0,
      0,
      format.width,
      format.height
    );

  addAttributes(_renderObject);
};

const constructLayerToDna = async (_dna = "", _layers = []) => {

  let mappedDnaToLayers = []
  let path = []
  for (const [index, layer] of _layers.entries()) {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index]) // [2BG Water]  ===> 2
    );
    mappedDnaToLayers.push({
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    });
    path.push(host.baseImg + selectedElement.path)

  }
  return {
    layers: mappedDnaToLayers, //element list
    path: path,
    dna: _dna
  }

};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = [], _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.some((item) => item == _filteredDNA);
};

const createDna = (_layers = []) => {
  let randNum = [];
  _layers.forEach((layer) => {
    var totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  try {

    let metadata = metadataList.find((meta) => meta.edition == _editionCount);

    console.log(
      `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
    )
    fs.writeFileSync(
      `${buildDir}/json/${_editionCount}.json`,
      JSON.stringify(metadata, null, 2)
    );
  } catch (ex) {
    console.log(ex)

  }

};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async ({
  layerConfigurations,
  projectName,
  projectDir,
  buildFolder,
  jsonFolder,
  symbol,
  description,
  totalImage,
}) => {

  return new Promise(async (resolve, reject) => {

    let layerConfigIndex = 0;
    let editionCount = 0; // start count
    let failedCount = 0;
    let abstractedIndexes = [];
    let dnaList = []
    let elementList = []
    let previewList = []
    // let uniqueDnaTorrance = layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo
    let uniqueDnaTorrance = 10000

    const t0 = performance.now();

    for (
      let i = 1;
      i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo; // 49
      i++
    ) {
      abstractedIndexes.push(i); // push i
    }
    if (shuffleLayerConfigurations) {
      abstractedIndexes = shuffle(abstractedIndexes);
    }
    debugLogs
      ? console.log("Editions left to create: ", abstractedIndexes)
      : null;

    while (layerConfigIndex < layerConfigurations.length) {

      const layers = layersSetup(
        layerConfigurations[layerConfigIndex].layersOrder,
        projectDir
      );


      while (
        editionCount < layerConfigurations[layerConfigIndex].growEditionSizeTo
      ) {

        // random image
        let newDna = createDna(layers);

        // check image duplicate

        if (isDnaUnique(dnaList, newDna)) {
          let results = await constructLayerToDna(newDna, layers);



          //   let imgList = []
          //   for( const layer of results ){
          //     imgList.push(host.baseImg+layer.selectedElement?.path)
          //   }



          dnaList.push(filterDNAOptions(newDna));
          editionCount++;
          abstractedIndexes.shift(); // remove arr first element

          //  const res  = await mergeTrait(results.path)

          const info = addMetadata({
            _dna: results.layers,
            _edition: totalImage ? totalImage + editionCount : editionCount,
            projectName,
            symbol,
            description
          })
          previewList.push({ ...info[0], path: results.path, dna: newDna })

          elementList.push({
            dna: newDna,
            layers: results.layers,
            metaData: { ...info[0] }
          })


        } //end if
        else {
          console.log("DNA exists!");
          failedCount++;
          if (failedCount >= uniqueDnaTorrance) {
            console.log(
              `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
            );
            //process.exit();
            //   reject("Error")

            //  resolve({ elementList, previewList })
            break

          }
        }


      } //end while gowEdition
      layerConfigIndex++;
    }


    // writeMetaData(JSON.stringify(metadataList, null, 2));
    // console.log("end loop")
    const t1 = performance.now();
    console.log(` ==== Call gen image  finish total ${editionCount}  in ${(t1 - t0) / 1000} seconds.======`)

    resolve({ elementList, previewList })

  }) //  end promise
};


export {
  startCreating
}

// module.exports = { startCreating, buildSetup, getElements };
