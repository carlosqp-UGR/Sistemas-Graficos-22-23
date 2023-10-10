import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class MyModel extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.createAnimation();
  }

  createSofa() {
    // Crear el contorno
    var shape = new THREE.Shape();
    shape.moveTo(-2,-2);
    shape.lineTo(2,-2);
    shape.lineTo(2,2);
    shape.lineTo(0,2);
    shape.lineTo(0,0);
    shape.lineTo(-2,0);
    shape.lineTo(-2,-2);

    var options = {
      depth: 8,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 10
    };

    // Crear geometria
    var geometria = new THREE.ExtrudeGeometry(shape, options);

    // Girar la geometria
    geometria.rotateY(Math.PI/2);
    geometria.translate(-4,0,0);

    // Crear el mesh
    var sofa = new THREE.Mesh(
      geometria,
      new THREE.MeshPhongMaterial({color:0xCF0000})
    );

    return sofa;
  }

  createModel() {
    // Nodo transformacion (se le aplicará la rotacion)
    this.columpio = new THREE.Object3D();

    var height = 10;
    this.sofa = this.createSofa();
    var cuerda1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15,0.15, height),
      new THREE.MeshPhongMaterial({color:0x000000})
    );
    var cuerda2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15,0.15, height),
      new THREE.MeshPhongMaterial({color:0x000000})
    );

    this.sofa.position.set(0,-2.2-height, 1.1);
    cuerda1.position.set(-3.7,-height/2,0); 
    cuerda2.position.set(3.7,-height/2,0); 

    this.columpio.add(this.sofa);
    this.columpio.add(cuerda1);
    this.columpio.add(cuerda2);

    // Creamos la base, formada por tres "cajas"
    var box1geom = new THREE.BoxGeometry(12,0.5,0.5);
    box1geom.translate(0,0.25,0);
    this.add(new THREE.Mesh(
      box1geom,
      new THREE.MeshPhongMaterial({color: 0xCCCCCC})
    ));

    var box2geom = new THREE.BoxGeometry(0.5,16,0.5);
    box2geom.translate(-5.75,-8,0);
    this.add(new THREE.Mesh(
      box2geom,
      new THREE.MeshPhongMaterial({color: 0xCCCCCC})
    ));

    var box3geom = new THREE.BoxGeometry(0.5,16,0.5);
    box3geom.translate(5.75,-8,0);
    this.add(new THREE.Mesh(
      box3geom,
      new THREE.MeshPhongMaterial({color: 0xCCCCCC})
    ));

    this.add(this.columpio);
    
    // Ubicamos el modelo con centro en su base (en el suelo)
    this.position.y = 16;
  }

  createAnimation() {
    // Animacion de la derecha 1
    var origen1 = {p:0.8};
    var destino1 = {p:-0.8};

    var movimiento1 = new TWEEN.Tween(origen1)
    .to(destino1, 2000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate (() => {
      this.columpio.rotation.x = origen1.p;
      this.sofa.rotation.x = -origen1.p;
    })
    .onComplete(()=> {
      origen1.p = 0.8;
      //movimiento2.start();
    })
    .repeat(Infinity)
    .yoyo(true);

    /*
    // Animacion de la derecha 2
    var origen2 = {p:-0.8};
    var destino2= {p:0.8};

    var movimiento2 = new TWEEN.Tween(origen2)
    .to(destino2, 2000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate (() => {
      this.columpio.rotation.x = origen2.p;
      this.sofa.rotation.x = -origen2.p;
    })
    //.repeat(Infinity)
    .onComplete(()=> {
      origen2.p = -0.8;
      movimiento1.start();
    });
*/
    movimiento1.start();
  }

  update () {
    TWEEN.update();
    //this.columpio.rotation.x += 0.01; 
  }
}

export { MyModel};
