import * as THREE from '../../libs/three.module.js'
 
class MyTrebol extends THREE.Object3D {
  constructor() {
    super();
    
    // Para controlar la animacino
    this.animation = false;

    // Creamos primero la geometria 2d con Shape
    this.shape = new THREE.Shape();

    this.shape.moveTo(0,0);
    this.shape.quadraticCurveTo(0,-1,1,-1);
    this.shape.quadraticCurveTo(2,-1,2,0);
    this.shape.quadraticCurveTo(2,1,1,1);
    this.shape.quadraticCurveTo(1,2,0,2);
    this.shape.quadraticCurveTo(-1,2,-1,1);
    this.shape.quadraticCurveTo(-2,1,-2,0);
    this.shape.quadraticCurveTo(-2,-1,-1,-1);
    this.shape.quadraticCurveTo(0,-1,0,0);

    var prof = 0.5;

    // Opciones para la extrusion
    // var options = { depth : 0.5 , steps : 1 , curveSegments : 30, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.1, bevelSegments: 10} ;
    var options = { depth : prof , steps : 1 , curveSegments : 30, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.1, bevelSegments: 10};

    // A parir del Shape, generamos la geometria 3d
    // por extrusión
    var geom = new THREE.ExtrudeGeometry(this.shape, options);

    // Centramos LA GEOMETRIA del trebol en el origen, una vez creada
    geom.translate(0,-0.5, -prof/2);

    // Como material se crea uno a partir de un color
    var mat = new THREE.MeshPhongMaterial({color: 0xCF0000});
    
    // Ya podemos construir el Mesh
    var mesh = new THREE.Mesh (geom, mat);

    // Y añadirlo como hijo del Object3D (el this)
    this.add (mesh);
    
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

export { MyTrebol };
