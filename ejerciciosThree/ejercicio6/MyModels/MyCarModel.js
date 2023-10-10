import * as THREE from '../../libs/three.module.js'
import { MTLLoader } from '../../libs/MTLLoader.js'
import { OBJLoader } from '../../libs/OBJLoader.js'

class MyCarModel extends THREE.Object3D {
  constructor() {
    super();
    
    // Para controlar la animacion
    this.animation = false;

    // Para cargar el modelo
    // ver diapositivas 55-56 del tema 3
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../../models/porsche911/911.mtl',
     (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../../models/porsche911/Porsche_911_GT2.obj',
        (object) => {
          this.add(object);
        }, null, null);

     });
  }

  setAnimation(value) {
    this.animation = value;
  }

  update () {
    if(this.animation) {
      this.rotation.y += 0.01;
      // this.rotation.z -= 0.01;
    }
  }
}

export { MyCarModel };
