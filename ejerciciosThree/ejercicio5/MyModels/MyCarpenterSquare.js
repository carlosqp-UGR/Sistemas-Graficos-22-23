import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'



class MyCarpenterSquare extends THREE.Object3D {
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

    // (1-2) Se crean las geometrías y se aplican las transformaciones
    // a las geometrías para operar con ellas
    
    var base = new THREE.BoxGeometry(5,5,2);
    
    // (*) Los conos dan error, usar cilindros con radiusTop muy pequeños
    var cil1 = new THREE.CylinderGeometry(0.2, 1, 3);
    cil1.rotateZ(Math.PI*1/2);
    cil1.translate(-1.5,1.5,0);
    
    var cil2 = new THREE.CylinderGeometry(0.2, 1, 3);
    cil2.rotateZ(Math.PI);
    cil2.translate(1.5, -1.5, 0);

    var shape = new THREE.Shape();
    shape.moveTo(-1.5,-0.5);
    shape.quadraticCurveTo(-1.5,-1.5,0,-1.5);
    shape.lineTo(5.5,-1.5);
    shape.lineTo(5.5, 4.5);
    shape.lineTo(-1.5, 4.5);
    shape.lineTo(-1.5,-0.5);

    var prof = 4;
    var options = {depth : prof , steps : 1 , curveSegments : 10, bevelEnabled: false};
    var sub = new THREE.ExtrudeGeometry(shape, options);
    sub.translate(0,0,-prof/2); // Centrado en el origen

    // (3) Se construyen los correspondientes Meshes
    var baseMesh = new THREE.Mesh(base, mat);
    var cil1Mesh = new THREE.Mesh(cil1, mat);
    var cil2Mesh = new THREE.Mesh(cil2, mat);
    var subMesh = new THREE.Mesh(sub, mat);

    // (4) Se construye un objeto CSG
    var csg = new CSG();

    // (5) Se le realizan operaciones booleanas a ese objeto de manera acumulada
    csg.subtract([baseMesh, subMesh]);
    csg.subtract([cil1Mesh]);
    csg.subtract([cil2Mesh]);
    
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

export { MyCarpenterSquare };
