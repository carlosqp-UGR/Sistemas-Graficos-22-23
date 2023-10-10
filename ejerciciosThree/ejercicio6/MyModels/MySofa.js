import * as THREE from '../../libs/three.module.js'
import { MTLLoader } from '../../libs/MTLLoader.js'
import { OBJLoader } from '../../libs/OBJLoader.js'

class MySofa extends THREE.Object3D {
  constructor() {
    super();
    
    // Para controlar la animacion
    this.animation = false;

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b, // color marrón oscuro
      roughness: 0.6, // rugosidad media
      metalness: 0.2, // apariencia no metálica
      side: THREE.DoubleSide // renderizar ambos lados de las caras
    });

    // Para cargar el modelo
    // ver diapositivas 55-56 del tema 3
    //var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    objectLoader.load(
      '../../models/sofa/Koltuk.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = leatherMaterial;
          }
        });
        this.add(obj);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
      },
      (error) => {
        console.log('Error al cargar el archivo: ' + error);
      }
    );
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

export { MySofa };
