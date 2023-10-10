import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'



class MyScrew extends THREE.Object3D {
  constructor() {
    super();
    
    // Para controlar la animacion
    this.animation = false;

    this.material = new THREE.MeshNormalMaterial();


    // Crear la taza mediante operaciones booleanas
    this.createCSGmodel();
  }

  createInteriorPart() {
    var mat = this.material;

    var radius = 1.5;
    var height = 1;
    var resolution = 30;
    var base = new THREE.CylinderGeometry(radius, radius, height, resolution);
    var baseMesh = new THREE.Mesh(base, mat);

    var csg = new CSG();
    csg.union([baseMesh]);

    var factor = 15;
    for(let i=(-height/2); i<height/2; i+=(2*height/factor)) {
      // Creamos la geometría y la transformamos (movemos)
      var geom = new THREE.CylinderGeometry(radius+0.05, radius+0.05, height/factor, resolution);
      geom.translate(0,i,0);

      // Creamos el mesh
      var aux = new THREE.Mesh(geom, mat);

      // realizamos la operacion de union con la base
      csg.union([aux]);
    }

    var mesh = csg.toMesh();
    return mesh;
  }

  // Procedimiento para crear la geometría mediante ops booleanas
  // ver diapositivas 41-42 del tema 3
  createCSGmodel() {

    // (0) Definir el material
    var mat = this.material;

    // (1-2) Se crean las geometrías y se aplican las transformaciones
    // a las geometrías para operar con ellas
    
    var base = new THREE.CylinderGeometry(2,2,1,6);
    
    // (3) Se construyen los correspondientes Meshes
    var baseMesh = new THREE.Mesh(base, mat);
    
    // (4) Se construye un objeto CSG
    var csg = new CSG();

    // (5) Se le realizan operaciones booleanas a ese objeto de manera acumulada
    csg.union([baseMesh]);
    csg.subtract([this.createInteriorPart()]);
    
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

export { MyScrew };
