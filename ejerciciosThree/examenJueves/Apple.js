import * as THREE from '../libs/three.module.js'
 
class Apple extends THREE.Object3D {
  constructor() {
    super();
    
    var appleGeom = new THREE.TorusGeometry(0.5,1,20,20);
    appleGeom.rotateX(Math.PI/2);
    // Como material se crea uno a partir de un color
    var appleMat = new THREE.MeshPhongMaterial({color: 0xFF0000});
    var appleMesh = new THREE.Mesh (appleGeom, appleMat);

    var raboGeom = new THREE.CylinderGeometry(0.1,0.1, 0.5);
    raboGeom.translate(0,1,0);

    var raboMesh = new THREE.Mesh(
      raboGeom,
      new THREE.MeshPhongMaterial({color: 0x00CF00})
    );

    this.add(appleMesh);
    this.add(raboMesh);

    // Dimensiones:
    // Eje X: 3
    // Eje Y: 2.25
    // Eje Z: 3

    //this.position.z = -1.5;
    //this.position.y = -1.25;
    //this.position.x = 1.5;
  }
    
  
  update () {}
}

export { Apple };
