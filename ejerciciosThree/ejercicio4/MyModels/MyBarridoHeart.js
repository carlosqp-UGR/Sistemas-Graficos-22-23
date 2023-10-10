import * as THREE from '../../libs/three.module.js'
import { MyHeart } from './MyHeart.js';

class MyBarridoHeart extends THREE.Object3D {
  constructor() {
    super();

    // Para controlar la animacion
    this.animation = false;

    // Obtenemos la forma 2d del corazon
    var shape = (new MyHeart()).shape;

    // Creamos el camino para el barrido
    var path = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( -2, 0, 2 ),
      new THREE.Vector3( -1, 1, 1 ),
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 1, -1, 1 ),
      new THREE.Vector3( 2, 0, 2 )
    ] );

    // Creamos la geometria
    var options = { steps : 50 , curveSegments : 4 , extrudePath : path } ;

    var geom = new THREE.ExtrudeGeometry(shape, options);
    
    // Creamos el material
    var mat = new THREE.MeshPhongMaterial({color: 0xCF0000});
    
    // Añadimos el mesh
    var mesh = new THREE.Mesh (geom, mat);
    this.add(mesh);

  }

  setAnimation(value) {
    this.animation = value;
  }

  update () {
    if(this.animation) {
      this.rotation.y += 0.01;
      this.rotation.z -= 0.01;
    }
  }
}

export { MyBarridoHeart };
