import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import * as TWEEN from '../../libs/tween.esm.js'

// Falta por implementar las colisiones

// Medidas del armario: x=1.90, y=2.50, z=1.20
// Centrado en el origen, sobre el suelo
class Closet extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.animacion = false;
  }
  
  
  createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../imgs/wood.jpg');
    const texturaRelieve = textureLoader.load('../../imgs/wood-bump.jpeg');

    // this.material = new THREE.MeshBasicMaterial({map: texture});
    const material = new THREE.MeshPhongMaterial({
      specular: 0x111111, // Reflectividad especular
      shininess: 10, // Intensidad de la reflexión especular
      map: texture, // Textura de la madera
      side: THREE.DoubleSide, // Para que se vea por ambos lados
      bumpMap: texturaRelieve,         // Textura de relieve en tonos de gris
      bumpScale:  0.025 
    });
    
    this.material = material;
  }

  createModel() {
    // Creamos todos los materiales que usaremos
    this.createMaterials();

    // Creamos las geometrias y operamos con ellas
    var baseGeometry = new THREE.BoxGeometry(1.90, 2.50, 1.20);
    
    var box1 = new THREE.BoxGeometry(1.70,0.7,1.20);
    box1.translate(0,0.8,0.1);
    var box2 = new THREE.BoxGeometry(1.70,0.7,1.20);
    box2.translate(0,0,0.1);
    var box3 = new THREE.BoxGeometry(1.70,0.7,1.20);
    box3.translate(0,-0.8,0.1);

    var auxBox1 = new THREE.BoxGeometry(1.70, 0.2,0.4);
    auxBox1.translate(0,0.4,0.6);
    var auxBox2 = new THREE.BoxGeometry(1.70, 0.2,0.4);
    auxBox2.translate(0,-0.4,0.6);

    // Creamos la base (CSG)
    var csg = new CSG();
    csg.subtract([new THREE.Mesh(baseGeometry, this.material),new THREE.Mesh(box1, this.material)]);
    csg.subtract([new THREE.Mesh(box2, this.material)]);
    csg.subtract([new THREE.Mesh(box3, this.material)]);
    csg.subtract([new THREE.Mesh(auxBox1, this.material)]);
    csg.subtract([new THREE.Mesh(auxBox2, this.material)]);

    this.base = csg.toMesh();

    // Añadimos la base al objeto
    this.add(this.base);
    this.collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1.90, 2.50, 1.20), new THREE.MeshBasicMaterial({transparent:true, opacity:0}));
    this.base.add(this.collisionMesh);

    // Creamos las puertas correderas

    this.puertaIzquierda = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.30, 0.1), this.material);
    this.puertaIzquierda.position.set(-0.425,0,0.45);
    this.add(this.puertaIzquierda);

    this.puertaDerecha = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.30, 0.1), this.material);
    this.puertaDerecha.position.set(0.425,0,0.55);
    this.add(this.puertaDerecha);

    // Nombramos las puertas del armario para futuras interacciones
    this.puertaIzquierda.name = "puertaIzquierda";
    this.puertaDerecha.name = "puertaDerecha";

    // Por último, colocamos al objeto por encima del suelo
    this.position.y = 1.25;
  }
  
  // La animacion de movimiento
  // El parametro door es un booleano: 0 indica la puerta izquierda, 1 indica la puerta dcha
  moveDoor(door) {

    // Si no hay ninguna animacion produciendose, entonces la crea y la inicia
    if(!this.animacion) {
      // Obtenemos la puerta que se quiere mover
      var puerta = this.puertaIzquierda;
      if(door) {
        puerta = this.puertaDerecha;
      }

      // Obtenemos su posicion antes de moverla;
      // Las puertas solo pueden estar en dos posiciones: izquierda (centro en x=-0.425) o derecha (centro en x=0.425)
      // Si la puerta está a la izquierda, entonces la moveremos a la derecha y viceversa
      var origen = {p: puerta.position.x};
      var destino = {p: -puerta.position.x};
      var movimiento = new TWEEN.Tween(origen)
      .to(destino, 2000)
      .onUpdate (() => {
        puerta.position.x = origen.p;
      })
      .onComplete(()=> {
        this.animacion = false;
      });

      this.animacion = true;
      movimiento.start();
    }
  }

  // Aquí, con el pick ya hecho, se llamaría a la función moveDoor
  // con la puerta que se haya seleccionado, y entonces se movería.
  // Es muy importante que no se corte la animación en mitad; debe completarse antes de iniciar otra.
  update () {
    if(this.animacion) TWEEN.update();
  }
}

export { Closet };
