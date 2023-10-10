import * as THREE from '../../libs/three.module.js'
import { MyFooter } from './MyFooter.js';
import { MyHeart } from './MyHeart.js';

class MyPike extends THREE.Object3D {
  constructor() {
    super();

    // Para controlar la animacion
    this.animation = false;

    var heart = new MyHeart();
    heart.rotation.z = Math.PI;
    this.add(heart);

    var footer = new MyFooter();
    this.add(footer);

    // Colocamos el pie en su sitio
    footer.position.set(0,-1.5,0);

    this.position.y = 1;

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

export { MyPike };
