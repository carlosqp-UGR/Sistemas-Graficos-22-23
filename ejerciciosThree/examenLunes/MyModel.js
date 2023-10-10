import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyModel extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.createAnimation();
  }

  createModel() {

    // Creamos el objeto CSG

    var material = new THREE.MeshPhongMaterial();

    var cylinderGeometry = new THREE.CylinderGeometry(5,5,2,30);
    var torusGeometry = new THREE.TorusGeometry(5,1,30,30);
    torusGeometry.rotateX(-Math.PI/2);

    var malla1 = new THREE.Mesh(cylinderGeometry, material);
    var malla2 = new THREE.Mesh(torusGeometry, material);

    // Objeto CSG
    var csg = new CSG();
    csg.union([malla1,malla2]);
    var base = csg.toMesh();

    var torusGeometry1 = new THREE.TorusGeometry(4,0.75,30,30);
    torusGeometry1.rotateX(-Math.PI/2);
    torusGeometry1.translate(0,1,0);
    var malla3 = new THREE.Mesh(torusGeometry1, material);

    csg.subtract([malla3]);

    var torusGeometry2 = new THREE.TorusGeometry(1,0.75,30,30);
    torusGeometry2.rotateX(-Math.PI/2);
    torusGeometry2.translate(0,1,0);
    var malla4 = new THREE.Mesh(torusGeometry2, material);

    csg.subtract([malla4]);

    this.add(csg.toMesh());

    // Añadimos las varillas de ambos relojes (unas en radio 2.5 y otras en radio 4.8)
    var radiusExt = 4.8;
    var radiusInt = 2.5;

    for(var i=0; i<2*Math.PI; i+=(2*Math.PI/12)) {
      var boxInterior = new THREE.Mesh(
        new THREE.BoxGeometry(0.2,0.2,0.4),
        new THREE.MeshPhongMaterial({color:0xCF0000})
      );

      boxInterior.rotation.y = i+Math.PI/2;
      boxInterior.position.set(radiusInt*Math.cos(i), 1.1,-radiusInt*Math.sin(i));


      var boxExterior = new THREE.Mesh(
        new THREE.BoxGeometry(0.2,0.2,0.4),
        new THREE.MeshPhongMaterial({color:0xCF0000})
      );

      boxExterior.rotation.y = i+Math.PI/2;
      boxExterior.position.set(radiusExt*Math.cos(i), 1.1,-radiusExt*Math.sin(i));

      this.add(boxInterior);
      this.add(boxExterior);
      /*
      var boxGeometryInt = new THREE.BoxGeometry(0.2,0.2,0.4);
      boxGeometryInt.rotateY(i+Math.PI/2);
      boxGeometryInt.translate(radiusInt*Math.cos(i), 1.1,-radiusInt*Math.sin(i));

      var boxGeometryExt = new THREE.BoxGeometry(0.2,0.2,0.4);
      boxGeometryExt.rotateY(i+Math.PI/2);
      boxGeometryExt.translate(radiusExt*Math.cos(i), 1.1,-radiusExt*Math.sin(i));

      this.add(new THREE.Mesh(
        boxGeometryInt,
        material
      ));

      this.add(new THREE.Mesh(
        boxGeometryExt,
        material
      ));
      */
    }

    // Aquí creamos las esferas que realizarán la función de agujas de reloj
    var sphereIntGeom = new THREE.SphereGeometry(0.5,30,30);
    sphereIntGeom.translate(1,1,0);
    this.sphereInterior = new THREE.Mesh(
      sphereIntGeom,
      new THREE.MeshNormalMaterial()
    );

    this.add(this.sphereInterior);

    var sphereExtGeom = new THREE.SphereGeometry(0.5,30,30);
    sphereExtGeom.translate(4,1,0);
    this.sphereExterior = new THREE.Mesh(
      sphereExtGeom,
      new THREE.MeshNormalMaterial()
    );

    this.add(this.sphereExterior);

  }

  createAnimation() {
    var aux = 0;
    // Movimiento 1: la esfera exterior gira velocidad constante 
    var origen1 = {p:0};
    var destino1 = {p:(11*2*Math.PI)/12};

    var movimiento1 = new TWEEN.Tween(origen1)
    .to(destino1, 11000)
    .onUpdate (() => {
      this.sphereExterior.rotation.y = origen1.p; 
    })
    .onComplete(()=> {
      movimiento2.start();
      aux = this.sphereInterior.rotation.y;
    })

    // Movimiento 2: movimiento de la esfera interior y exterior a la vez
    var origen2 = {p: 11*2*Math.PI/12};
    var destino2 = {p: 2*Math.PI};

    var movimiento2 = new TWEEN.Tween(origen2)
    .to(destino2, 1000)
    .onUpdate (() => {
      this.sphereExterior.rotation.y = origen2.p; 
      this.sphereInterior.rotation.y = aux + origen2.p;
    })
    .onComplete(()=> {
      movimiento1.start();
    })

    movimiento1.start();
  }

  update () {
    TWEEN.update();
  }
}

export { MyModel};
