import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'
import * as TWEEN from '../../libs/tween.esm.js'

// Falta por implementar las colisiones
// Se abre hacia afuera para evitar colisiones con el jugador al abrir la puerta
// Medidas de la puerta: {x:1.025, y:2.13, z:0.14}
// Centrado en el origen, sobre el suelo
class Door extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
    this.animacion = false;
  }
  
  createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../imgs/wood.jpg');
    // this.material = new THREE.MeshBasicMaterial({map: texture});
    const material = new THREE.MeshPhongMaterial({
      specular: 0x111111, // Reflectividad especular
      shininess: 10, // Intensidad de la reflexión especular
      map: texture, // Textura de la madera
      side: THREE.DoubleSide // Para que se vea por ambos lados
    });
    
    this.material = material;
    /*
    // Dorado
    this.materialPomo = new THREE.MeshStandardMaterial( {
      color: 0xffd700, // amarillo dorado
      roughness: 0.2, // superficie ligeramente áspera
      metalness: 1, // material metálico
      envMapIntensity: 1, // intensidad del mapeado de entorno
      side: THREE.DoubleSide, // renderizado en ambas caras del objeto
    } );
    */

    // Plateado
    this.materialPomo = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Color blanco
      roughness: 0.4, // Rugosidad media
      metalness: 1.0, // Alta reflectividad
    });
  }

  createModel() {
    // Creamos todos los materiales que usaremos
    this.createMaterials();

    
    // Creamos el marco de la puerta
    var baseGeometry = new THREE.BoxGeometry(1.025,2.13,0.14);
    baseGeometry.translate(0,0.05,0);
    var huecoPuerta = new THREE.BoxGeometry(0.825,2.03,0.3);
    var csg = new CSG();
    csg.subtract([new THREE.Mesh(baseGeometry, this.material),new THREE.Mesh(huecoPuerta, this.material)]);
    var base = csg.toMesh();
    this.add(base);

    // Creamos la puerta
    this.puerta = new THREE.Mesh(new THREE.BoxGeometry(0.82,2.01,0.1),this.material) ;    

    // Creamos el pomo y se lo añadimos a la puerta
    var esfera = new THREE.SphereGeometry(0.075,33,33);
    esfera.translate(0,0.096,0);
    var cilindro1 = new THREE.CylinderGeometry(0.02,0.02,0.023,40);
    cilindro1.translate(0,0.02,0);
    var cilindro2 = new THREE.CylinderGeometry(0.075,0.075,0.01,40);
    cilindro2.translate(0,0.005,0);
    var csg2 = new CSG();
    csg2.union([new THREE.Mesh(esfera, this.materialPomo), new THREE.Mesh(cilindro1, this.materialPomo)]);
    csg2.union([new THREE.Mesh(cilindro2,  this.materialPomo)]);
    this.pomo = csg2.toMesh();
    this.pomo.scale.set(0.5,0.5,0.5);
    this.pomo.rotateX(Math.PI/2);
    this.pomo.position.set(0.33,0,0.05);
    this.puerta.add(this.pomo);

    // Le ponemos nombre al pomo para la interaccion futura
    this.pomo.name = "pomoPuerta";

    // Para la animación de mover abrir/cerrar la puerta necesitamos:
    // - Colocar la puerta con un extremo en el eje Y (traslacion en el eje X)
    // - Rotar en el eje Y (abrir/cerrar)
    // - Volver a colocar la puerta centrada (deshacer la traslacion primera)
    // Para ello crearemos un nodo padre llamado transformacion
    this.transformacion = new THREE.Object3D();
    this.transformacion.add(this.puerta);
    this.add(this.transformacion);

    // Colocar la mesa a la altura del suelo centrada
    this.position.y = 1.005;
  }
  
  // La animacion de movimiento
  moveDoor() {

    // Si no hay ninguna animacion produciendose, entonces la crea y la inicia
    if(!this.animacion) {

      // Obtenemos su posicion antes de moverla;
      // Las puertas solo pueden estar en dos posiciones: izquierda (centro en x=-0.425) o derecha (centro en x=0.425)
      // Si la puerta está a la izquierda, entonces la moveremos a la derecha y viceversa
      var origen = {p: this.transformacion.rotation.y};
      var destino = {p: origen.p == 0 ? 1.57 : 0};
      var movimiento = new TWEEN.Tween(origen)
      .to(destino, 2000)
      .onUpdate (() => {
        this.puerta.position.x = 0.4;
        this.transformacion.rotation.y = origen.p;
        this.transformacion.position.x = -0.4;
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

export { Door };
