import * as THREE from '../../libs/three.module.js'
import { OBJLoader } from '../../libs/OBJLoader.js'

// Objeto cargado sacado de internet
// No se conocen las medidas exactas del objeto
class Sofa extends THREE.Object3D {
  constructor() {
    super();

    const leatherMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // color rojo
      roughness: 0.6, // rugosidad media
      metalness: 0.2, // apariencia no metálica
      side: THREE.DoubleSide, // renderizar ambos lados de las caras
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

    // Escalamos el objeto
    this.scale.set(1.5,1.5,1.5);
    this.collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(2,4,0.835), new THREE.MeshBasicMaterial({transparent:true, opacity:0}));
    this.add(this.collisionMesh);
    // Movemos el objeto para que quede a la altura del suelo
    this.position.y = 0.2;
  }

  // El sofa no tiene animacion
  update () {}
}

export { Sofa };
