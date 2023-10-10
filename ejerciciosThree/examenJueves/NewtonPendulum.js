import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

import { Apple } from './Apple.js'

class NewtonPendulum extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.createAnimation();
  }
    
  createModel() {
    // Cuerda izquierda
    var appleLeft = new Apple();

    var cuerdaLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01,0.01,5),
      new THREE.MeshBasicMaterial({color: 0x000000})
    );

    // Nodo transformacion
    this.penduloLeft = new THREE.Object3D();

    cuerdaLeft.position.y = -2.5;
    appleLeft.position.y = -1.25-5;

    this.penduloLeft.add(cuerdaLeft);
    this.penduloLeft.add(appleLeft);

    // Transformaciones a la cuerda
    this.penduloLeft.position.x = -1.5;
    
    // Cuerda derecha
    var appleRight = new Apple();
    var cuerdaRight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01,0.01,5),
      new THREE.MeshBasicMaterial({color: 0x000000})
    );

    // Nodo transformacion
    this.penduloRight = new THREE.Object3D();
    this.penduloRight.add(cuerdaRight);
    this.penduloRight.add(appleRight);

    // Transformaciones a la cuerda
    this.penduloRight.position.x = 1.5;

    cuerdaRight.position.y = -2.5;
    appleRight.position.y = -1.25-5;

    this.add(this.penduloLeft);
    this.add(this.penduloRight);

    // Creamos el soporte exterior con 3 cajas
    var boxTopGeom = new THREE.BoxGeometry(30,1,1);
    boxTopGeom.translate(0,0.5,0);
    var boxLeftGeom = new THREE.BoxGeometry(1,10,1);
    boxLeftGeom.translate(-14.5,-5,0);
    var boxRightGeom = new THREE.BoxGeometry(1,10,1);
    boxRightGeom.translate(14.5,-5,0);

    this.add(new THREE.Mesh(
        boxTopGeom,
        new THREE.MeshPhongMaterial({color: 0xCCCCCC})
      )
    );

    this.add(new THREE.Mesh(
        boxLeftGeom,
        new THREE.MeshPhongMaterial({color: 0xCCCCCC})
      )
    );

    this.add( new THREE.Mesh(
        boxRightGeom,
        new THREE.MeshPhongMaterial({color: 0xCCCCCC})
      )
    );

    // Por último, centramos el objeto
    this.position.y = 5;

  }

  createAnimation() {
    // Animacion de la derecha 1
    var origen1 = {p:0};
    var destino1 = {p:0.8};

    var movimiento1 = new TWEEN.Tween(origen1)
    .to(destino1, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate (() => {
      this.penduloRight.rotation.z = origen1.p;
    })
    .onComplete(()=> {
      movimiento2.start();
    });

    // Animacion de la derecha 2
    var origen2 = {p:0.8};
    var destino2= {p:0};

    var movimiento2 = new TWEEN.Tween(origen2)
    .to(destino2, 1000)
    .easing(TWEEN.Easing.Cubic.In)
    .onUpdate (() => {
      this.penduloRight.rotation.z = origen2.p;
    })
    .onComplete(()=> {
      movimiento3.start();
    });

    // Animacion de la izquierda 1
    var origen3 = {p:0};
    var destino3 = {p:-0.8};
    var movimiento3 = new TWEEN.Tween(origen3)
    .to(destino3, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate (() => {
      this.penduloLeft.rotation.z = origen3.p;
    })
    .onComplete(()=> {
      movimiento4.start();
    });

    // Animacion de la izquierda 2
    var origen4 = {p:-0.8};
    var destino4 = {p:0};
    var movimiento4 = new TWEEN.Tween(origen4)
    .to(destino4, 1000)
    .easing(TWEEN.Easing.Cubic.In)
    .onUpdate (() => {
      this.penduloLeft.rotation.z = origen4.p;
    })
    .onComplete(()=> {
      movimiento1.start();
    });

    movimiento1.start();

  }

  update () {
    //this.penduloLeft.rotation.z = 0;
    //this.penduloRight.rotation.z = 0;

    // Actualizar la animacion
    TWEEN.update();
  }
}

export { NewtonPendulum };
