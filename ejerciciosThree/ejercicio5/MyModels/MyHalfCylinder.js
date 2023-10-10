import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'



class MyHalfCylinder extends THREE.Object3D {
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
    var radio = 2;
    var h = 5;

    var cilindro1 = new THREE.CylinderGeometry(radio, radio, h, 33, 33);
    var cilindro2 = new THREE.CylinderGeometry(radio,radio, h, 3);
    var cilindro3 = new THREE.CylinderGeometry(radio,radio, h, 3);
    var cilindro4 = new THREE.CylinderGeometry(radio,radio, h, 3);

    // (2) Se aplican las transformaciones A LA GEOMETRÍA necesarias
    // para operar
    cilindro2.translate(radio/2, 1, 0);
    cilindro2.rotateY((2*Math.PI)/3);
    cilindro3.translate(radio/2, 1, 0);
    cilindro3.rotateY(2*(2*Math.PI)/3);
    cilindro4.translate(radio/2, 1, 0);

    // (3) Se construyen los correspondientes Meshes
    var cilindro1Mesh = new THREE.Mesh(cilindro1, mat);
    var cilindro2Mesh = new THREE.Mesh(cilindro2, mat);
    var cilindro3Mesh = new THREE.Mesh(cilindro3, mat);
    var cilindro4Mesh = new THREE.Mesh(cilindro4, mat);


    // (4) Se construye un objeto CSG
    var csg = new CSG();

    // (5) Se le realizan operaciones booleanas a ese objeto de manera acumulada
    csg.subtract([cilindro1Mesh, cilindro2Mesh]);
    csg.subtract([cilindro3Mesh]);
    csg.subtract([cilindro4Mesh]);
    
    // (6) El resultado final se convierte a un Mesh
    this.mesh = csg.toMesh();

    // añadimos al hijo
    this.add(this.mesh);
    //this.add(cilindro2Mesh);
    //this.add(cilindro3Mesh);
    //this.add(cilindro4Mesh);
  }

  setAnimation(value) {
    this.animation = value;
  }

  update () {
    if(this.animation) {
      // this.rotation.y += 0.01;
      // this.rotation.z -= 0.01;
    }
  }
}

export { MyHalfCylinder };
