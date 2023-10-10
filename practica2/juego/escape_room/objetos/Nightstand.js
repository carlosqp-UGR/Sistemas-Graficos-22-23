import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import * as TWEEN from '../../libs/tween.esm.js'

// Falta por implementar las colisiones

// Mesita de noche
// Medidas: {x:0.5,y:0.65,z:0.35}
// Tiene un cajon que se puede abrir y cerrar
class Nightstand extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.animacion = false;
  }

  // Con textura y relieve
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

    // Creamos las base con los agujeros para los cajones y sus patas
    var baseGeometry = new THREE.BoxGeometry(0.5,0.65,0.35);
    var hueco1 = new THREE.BoxGeometry(0.4,0.175,0.35);
    hueco1.translate(0,-0.0375,0.05);
    var hueco2 = new THREE.BoxGeometry(0.4,0.175,0.35);
    hueco2.translate(0,0.1875,0.05);

    var suelo1 = new THREE.BoxGeometry(0.4,0.15,0.4);
    suelo1.translate(0,-0.25,0);

    var suelo2 = new THREE.BoxGeometry(0.7,0.15,0.25);
    suelo2.translate(0,-0.25,0);

    // Creamos la base (CSG)
    var csg = new CSG();
    csg.subtract([new THREE.Mesh(baseGeometry, this.material),new THREE.Mesh(hueco1, this.material)]);
    csg.subtract([new THREE.Mesh(hueco2, this.material)]);
    csg.subtract([new THREE.Mesh(suelo1, this.material)]);
    csg.subtract([new THREE.Mesh(suelo2, this.material)]);

    this.base = csg.toMesh();

    // Añadimos la base al objeto
    this.add(this.base);
    this.collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5,4,0.65), new THREE.MeshBasicMaterial({transparent:true, opacity: 0}));
    this.collisionMesh.position.z += 0.15;
    this.base.add(this.collisionMesh);

    // Creamos los cajones (objetos móviles)
    // Se podrán abrir cerrar cuando se les haga el pick
    // Los hacemos ligeramente mas pequeños para que se vea visualmente la diferencia
    // entre el cajon y la mesilla
    var cajonGeometry = new THREE.BoxGeometry(0.39,0.17,0.3);
    var pomoCajon = new THREE.CylinderGeometry(0.01,0.025,0.02);
    pomoCajon.rotateX(-Math.PI/2);
    pomoCajon.translate(0,0,0.16);
    var huecoCajon = new THREE.BoxGeometry(0.34,0.2,0.25);
    huecoCajon.translate(0,0.05,0);

    var csg2 = new CSG();
    csg2.union([new THREE.Mesh(cajonGeometry, this.material),new THREE.Mesh(pomoCajon,this.material)]);
    csg2.subtract([new THREE.Mesh(huecoCajon, this.material)]);
    this.cajonArriba = csg2.toMesh();
    this.cajonAbajo = csg2.toMesh();

    // Posicionamos los cajones. Se podrán mover en el eje Z
    this.cajonArriba.position.set(0,0.1875,0.025);
    this.cajonAbajo.position.set(0,-0.0375,0.025);

    // Les ponemos un nombre; necesario para comprobaciones en el pick
    this.cajonArriba.name = "cajonArriba";
    this.cajonAbajo.name = "cajonAbajo";

    // Añadimos los cajones
    this.add(this.cajonArriba);
    this.add(this.cajonAbajo);

    // Por último, colocamos al objeto por encima del suelo
    this.position.y = 0.325;
  }
  
  // La animacion de movimiento
  // El parametro box es un booleano: 0 indica el cajon de arriba y 1 indica el de abajo
  moveCajon(box) {

    // Si no hay ninguna animacion produciendose, entonces la crea y la inicia
    // Si hay alguna animacion ya produciendose, entonces no hace nada
    if(!this.animacion) {
      // Obtenemos la puerta que se quiere mover
      var cajon = this.cajonArriba;
      if(box) {
        cajon = this.cajonAbajo;
      }

      // Un cajon solo puede tener dos posiciones:
      // Abierto z= 0.325
      // Cerrado z = 0.025
      var origen = {p: cajon.position.z};
      var destino = {p: origen.p == 0.025 ? 0.325 : 0.025};
      var movimiento = new TWEEN.Tween(origen)
      .to(destino, 1000)
      .onUpdate (() => {
        cajon.position.z = origen.p;
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

export { Nightstand };