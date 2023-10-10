import * as THREE from '../../libs/three.module.js'
import { MyFooter } from './MyFooter.js';
import { MyTrebol } from './MyTrebol.js';

class MyTrebolWithFooter extends THREE.Object3D {
  constructor() {
    super();

    // Para controlar la animacion
    this.animation = false;

    var trebol = new MyTrebol();
    this.add(trebol);

    var footer = new MyFooter();
    this.add(footer);

    // Colocamos el pie en su sitio
    footer.position.set(0,-1,0);

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

export { MyTrebolWithFooter };
