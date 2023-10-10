import * as THREE from '../../libs/three.module.js'

// Crea un poster centrado en el plano XY
class Poster extends THREE.Object3D {
  constructor(width, height, img_path) {
    super();
    var geom = new THREE.BoxGeometry(width,height,0.025);
    const texture = new THREE.TextureLoader().load(img_path);
    var mat = new THREE.MeshPhongMaterial({ map: texture });
    geom.translate(0,0,0.0125);
    this.add(new THREE.Mesh(geom,mat));
  }

  update () {
  }
}

export { Poster };
