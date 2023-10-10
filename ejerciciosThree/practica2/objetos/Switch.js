import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
 
class Switch extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
  }

  createModel(){
    // Creamos los materiales a usar
    this.createMaterials();

    // Primero creamos el marco exterior
    this.exterior=this.createBox(8.5, 8.5, 2, this.material);
    this.interior=this.createBox(5.5, 5.5, 2, this.material);

    var csg = new CSG();
    csg.union([this.exterior]);
    csg.subtract([this.interior]);
    this.marco = csg.toMesh();

    // Ahora creamos la palanca
    this.caja=this.createBox(5.5, 5.5, 2, this.material);
    this.forma = new THREE.Mesh (new THREE.CylinderGeometry (7.5,7.5,6,5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    this.forma.rotation.x+=Math.PI/3;
    this.forma.rotation.z+=Math.PI/2;
    this.forma.position.set(0, 0, 6);

    var csg2 = new CSG();
    csg2.union([this.caja]);
    csg2.subtract([this.forma]);
    this.palanca=csg2.toMesh();
    this.palanca.position.z+=1;

    this.interruptor = new THREE.Object3D();
    this.interruptor.add(this.palanca, this.marco);
    this.interruptor.scale.set(0.01, 0.01, 0.01);
    this.interruptor.position.y+=0.0375;

    this.add(this.interruptor);

    this.marco.userData = this;
    this.palanca.userData = this;
    this.interruptor.userData = this;
    this.userData = this;
  }

  createMaterials(){
    this.material = new THREE.MeshPhongMaterial({ color: 0xdddddd });
  }

  createBox(x, y, z, material){
    var boxGeom = new THREE.BoxGeometry(x, y, z);
    return new THREE.Mesh(boxGeom, material);
  }

  turn(){
    this.interruptor.rotation.z+=Math.PI;
  }
}

export { Switch };