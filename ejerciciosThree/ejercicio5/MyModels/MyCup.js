import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'



class MyCup extends THREE.Object3D {
  constructor() {
    super();
    
    // Para controlar la animacion
    this.animation = false;

    // Crear la taza mediante operaciones booleanas
    this.createCSGmodel();
  }

  // Procedimiento para crear la geometría mediante ops booleanas
  // ver diapositivas 41-42 del tema 3
  createCSGmodel() {

    // (0) Definir el material
    var mat= new THREE.MeshNormalMaterial();

    // (1) Se crean las geometrías
    var cilindro1 = new THREE.CylinderGeometry(1,1,3, 30);
    var toro = new THREE.TorusGeometry(1, 0.2, 30, 30);
    var cilindro2 = new THREE.CylinderGeometry(0.8,0.8,3, 30);

    // (2) Se aplican las transformaciones A LA GEOMETRÍA necesarias
    // para operar
    toro.translate(-1,0,0);
    cilindro2.translate(0,0.3,0);

    // (3) Se construyen los correspondientes Meshes
    var cilindro1Mesh = new THREE.Mesh(cilindro1, mat);
    var toroMesh = new THREE.Mesh(toro, mat);
    var cilindro2Mesh = new THREE.Mesh(cilindro2, mat);

    // (4) Se construye un objeto CSG
    var csg = new CSG();

    // (5) Se le realizan operaciones booleanas a ese objeto de manera acumulada
    csg.union([cilindro1Mesh, toroMesh]);
    csg.subtract([cilindro2Mesh]);
    
    // (6) El resultado final se convierte a un Mesh
    this.mesh = csg.toMesh();

    // añadimos al hijo
    this.add(this.mesh);
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

export { MyCup };
