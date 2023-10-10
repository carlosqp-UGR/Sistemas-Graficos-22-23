// Clases de la biblioteca
import * as THREE from '../../libs/three.module.js'
import * as KeyCode from '../../libs/keycode.esm.js';
import { PointerLockControls } from '../../libs/PointerLockControls.js'
import { Stats } from '../../libs/stats.module.js'
import { CSG } from '../../libs/CSG-v2.js'

// Clases de mi proyecto
import { WorldBall } from '../objetos/WorldBall.js' 
import { Sofa } from '../objetos/Sofa.js'
import { Closet } from '../objetos/Closet.js'
import { Nightstand } from '../objetos/Nightstand.js'
import { Door } from '../objetos/Door.js'
import { RoomLight } from '../objetos/RoomLight.js'
import { Table } from '../objetos/Table.js'
import { Bed } from '../objetos/Bed.js'
import { Key } from '../objetos/Key.js'
import { Poster } from '../objetos/Poster.js';
import { Switch } from '../objetos/Switch.js';

/// La clase fachada del modelo
// Contiene el modelado de la habitacion
// Permite hacer pick en algunos objetos:
// - Las puertas del armario (ambas)
// - Las llaves (sólo muestra un mensaje diciendo que se ha seleccionado la llave)
// - Los cajones de la mesita de noche (ambos)
// - El pomo de la puerta
// Contiene la camara en primera persona, sin gestion de colisiones (ver errores de consola)
// Request for pointer lock was denied because Element.requestPointerLock() was not called from inside a short running user-generated event handler, and the document is not in full screen.
class MyScene_v3 extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
        
    this.initStats();

    this.createLights ();
    
    // Cámara en primera persona, con sus variables, eventListeners y controlador de movimiento
    this.createCamera ();

    // Solo para guiarnos, despues eliminar
    this.createAxis();

    // Antes de crear los objetos, creamos las estructuras necesarias
    // para posteriormente ejecutar el pick
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    // Array de objetos con los que se puede interactuar. Aquí se deben
    // ir añadiendo aquellos objetos con los que se puede interactuar.
    this.pickableObjects = new Array();

    // Crea la habitación y sus objetos
    this.createModel();

    // Añadir el event listener, en este caso solo enciende/apaga las luces
    window.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
  }

  // Función que implementa el pick (diapositivas teoria T4)
  onDocumentMouseDown(event) {
    // El usuario ha hecho clic con el botón izquierdo
    if(event.button === 0) {
      // Suponemos que se tienen las siguientes variables
      // mouse = new THREE.Vector2();
      // raycaster = new THREE.Raycaster();
      // Reutilizamos esos objetos, evitamos construirlos en cada pulsación

      // Se obtiene la posición del click en coordenadas de dispositivo no normalizado
      // - La esquina inferior izquierda tiene la coordenada (-1,-1)
      // - La esquina superior derecha tiene la coordenada (1,1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

      // Se actualiza un rayo que parte de la cámara (el ojo del usuario)
      // y que pasa por la posición donde se ha hecho clic
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Hay que buscar qué objetos intersectan con el rayo
      // Es una operación costosa, solo se buscan intersecciones
      // con los objetos que interesan en cada momento
      // Las referencias de dichos objetos se guardan en un array
      // pickableObjects es el array de objetos donde se van a buscar intersecciones con el rayo
      // Los objetos alcanzados por el rayo, entre los seleccionables,
      // se devuelven en otro array
      var pickedObjects = this.raycaster.intersectObjects(this.pickableObjects, true);

      // pickedObjects es un vector ordenado desde el objeto más cercano
      if (pickedObjects.length > 0) {
        // Se puede referenciar el Mesh clicado
        var selectedObject = pickedObjects[0].object;

        // Según el objeto seleccionado, realizamos una acción u otra
        if (selectedObject.name === "cajonArriba") {
          this.nightstand.moveCajon(false);
        } else if (selectedObject.name === "cajonAbajo") {
          this.nightstand.moveCajon(true);
        } else if (selectedObject.name === "puertaIzquierda") {
          this.closet.moveDoor(false);
        } else if (selectedObject.name === "puertaDerecha") {
          this.closet.moveDoor(true);
        } else if (selectedObject.name === "pomoPuerta") {
          this.door.moveDoor();
        } else if (selectedObject.userData === this.key) {
          window.alert("¡Atencion!Acaba de seleccionar la llave del cajon \n\nPulse aceptar para continuar...");
          // Implementar
        } else if (selectedObject.userData === this.key) {
          window.alert("¡Atencion!\nAcaba de seleccionar la llave de la puerta \nPulse aceptar para continuar...");
          // Implementar
        } else if (selectedObject.userData === this.switch) {
          // Encender la luz
          this.switch.turn();
          this.lamparaTecho.turnLights();
          this.lamparaTecho.update();
        }
      }
    } else if (event.button===1) {
      // Encendemos/apagamos la luz (cuando implementemos el interruptor tendremos que cambiarlo)
      // window.alert("¡Atencion!\nPulse aceptar para continuar...");
      this.lamparaTecho.turnLights();
      this.lamparaTecho.update();
    }
  }

  createAxis() {
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
  }
    
  initStats() {
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }

  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.2);
    // La añadimos a la escena
    this.add (ambientLight);

    // El resto de luces las contienen los propios objetos por
    // lo que se crearán junto con el objeto
  }

  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  createModel() {

    /// Creamos el suelo y las paredes

    // Material del suelo, se basa en una textura de marmol
    var texture = new THREE.TextureLoader().load('../imgs/marmol-blanco.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    materialGround.map.wrapS = THREE.RepeatWrapping;
    materialGround.map.wrapT = THREE.RepeatWrapping;
    materialGround.map.repeat.set(10, 10); // Se repite 10 veces en cada eje

    // Creacion del suelo
    var geometryGround = new THREE.BoxGeometry (10,0.2,10);
    var ground = new THREE.Mesh (geometryGround, materialGround);
    ground.position.y = -0.1;    
    this.add (ground);

    // Material de las paredes, se basa en una textura
    var texturaPared = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    var materialPared = new THREE.MeshPhongMaterial ({map: texturaPared});
    materialPared.map.wrapS = THREE.RepeatWrapping;
    materialPared.map.wrapT = THREE.RepeatWrapping;
    materialPared.map.repeat.set(10, 10); // Se repite 10 veces en cada eje
    
    // Pared de la puerta (necesita un agujero para poder entrar/salir)
    var paredPuertaGeom = new THREE.BoxGeometry(10,3.625,0.2);
    paredPuertaGeom.translate(0,1.8125,0);
    var huecoPuerta = new THREE.BoxGeometry(1.025,2.13,0.4);
    huecoPuerta.translate(3,1.065,0);
    var csg = new CSG();
    csg.subtract([new THREE.Mesh(paredPuertaGeom, materialPared), new THREE.Mesh(huecoPuerta, materialPared)]);
    
    var paredPuerta = csg.toMesh();
    paredPuerta.rotation.y = -Math.PI/2;
    paredPuerta.position.x = 5.1;
    this.add(paredPuerta);

    // Resto de paredes
    var paredGeom = new THREE.BoxGeometry(10,3.625,0.2);

    var paredFondo = new THREE.Mesh(paredGeom, materialPared);
    paredFondo.position.y = 1.8125;
    paredFondo.position.z = -5.1;
    this.add(paredFondo);

    var paredFrente = new THREE.Mesh(paredGeom, materialPared);
    paredFrente.position.y = 1.8125;
    paredFrente.position.z = 5.1;
    this.add(paredFrente);

    var paredLado = new THREE.Mesh(paredGeom, materialPared);
    paredLado.rotation.y = Math.PI/2;
    paredLado.position.y = 1.8125;
    paredLado.position.x = -5.1;
    this.add(paredLado);

    // Techo (textura de hormigon) con color
    var texturaTecho = new THREE.TextureLoader().load('../imgs/hormigon.jpg');
    var materialTecho = new THREE.MeshPhongMaterial ({map: texturaTecho});
    
    var techoGeom = new THREE.BoxGeometry (10.05,0.2,10.05);
    techoGeom.translate(0,3.635,0);
    var techo = new THREE.Mesh(techoGeom,materialTecho);
    this.add(techo);

    /// Creamos y posicionamos los objetos dentro de la habitacion
    // Lámpara que cuelga del techo
    this.lamparaTecho = new RoomLight();
    this.add(this.lamparaTecho);
    this.lamparaTecho.position.set(0, 3, 0);
    
    // Escritorio
    this.table = new Table();
    this.add(this.table);
    this.table.position.set(-5,0,-5);

    // Bola del mundo (está encima de la mesa)
    // Posicionamos la bola del mundo en función de su posición respecto
    // a la mesa (su padre directo).
    this.worldBall = new WorldBall();
    this.worldBall.position.x = 1.6;
    this.worldBall.position.y = 0.7;
    this.worldBall.position.z = 0.4;
    this.table.add(this.worldBall);

    // Armario
    this.closet = new Closet();
    this.add(this.closet);
    this.closet.position.z = 4.4;
    this.closet.rotation.y = Math.PI;
    this.pickableObjects.push(this.closet.puertaIzquierda);
    this.pickableObjects.push(this.closet.puertaDerecha);

    // Sofa
    this.sofa = new Sofa();
    this.add(this.sofa);
    this.sofa.update(); // Solo se actualiza una vez (la primera)
    this.sofa.position.z = 2;
    this.sofa.position.x = -4.3;
    this.sofa.rotation.y = Math.PI/2;

    // Puerta
    this.door = new Door();
    this.add(this.door);
    this.door.position.x = 5;
    this.door.position.z = 3 ;
    this.door.rotation.y = -Math.PI/2;
    this.pickableObjects.push(this.door.pomo);

    // Mesita de noche
    this.nightstand = new Nightstand();
    this.nightstand.position.x = 3.5;
    this.nightstand.position.z = -4.825;
    this.add(this.nightstand);
    this.pickableObjects.push(this.nightstand.cajonAbajo);
    this.pickableObjects.push(this.nightstand.cajonArriba);

    // Cama
    this.bed = new Bed();
    this.add(this.bed);
    this.bed.position.set(4.5,0,-4);

    // Llave
    this.key = new Key();
    this.add(this.key);
    this.key.name = "llavePuerta";
    this.pickableObjects.push(this.key);

    // Poster de la Champions
    var poster1 = new Poster(2.64,1.482, '../../imgs/real_madrid_champions.jpg');
    this.add(poster1);
    poster1.position.set(0,2,-5);

    // Poster de CR7
    var poster2 = new Poster(2.3*0.514,2.3*0.768, '../../imgs/poster_cr7.jpg');
    this.add(poster2);
    poster2.rotation.y = -Math.PI/2;
    poster2.position.set(5,1.8,0);

    // Poster de la Copa del Rey
    var poster3 = new Poster(1.5*1.6,1.5*1.066, '../../imgs/copa_del_rey.jpg');
    this.add(poster3);
    poster3.rotation.y = Math.PI/2;
    poster3.position.set(-5,2,-1);

    // Interruptor
    this.switch = new Switch();
    this.add(this.switch);
    this.switch.position.set(4.9625, 1.2, 2)
    this.switch.rotation.y-=Math.PI/2;
    this.pickableObjects.push(this.switch);
  }  

  updateModels() {
    this.worldBall.update();
    this.closet.update();
    this.door.update();
    this.nightstand.update();
  }

  /// Cámara en primera persona con PointerLockControls
  createCamera () {

    // Cámara de la escena
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 1.8, 0);
    var look = new THREE.Vector3 (0,1.8,-1);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Variables para el control de la cámara (movimiento)
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    // Reloj para que la velocidad del movimiento sea constante
    this.clock = new THREE.Clock();
    this.velocidad = 5;

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new PointerLockControls (this.camera, this.renderer.domElement);

    // Añadimos los eventos asociados al movimiento de la camara
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(event) {
    switch(event.keyCode) {
      // Para mover la camara
      case KeyCode.KEY_UP: this.moveForward = true; break;
      case KeyCode.KEY_DOWN: this.moveBackward = true; break;
      case KeyCode.KEY_LEFT: this.moveLeft = true; break;
      case KeyCode.KEY_RIGHT: this.moveRight = true; break;

      // Para rotarla
      case KeyCode.KEY_CONTROL: this.cameraControl.lock(); break;
    }
  }

  onKeyUp(event) {
    switch(event.keyCode) {
      // Para mover la camara
      case KeyCode.KEY_UP: this.moveForward = false; break;
      case KeyCode.KEY_DOWN: this.moveBackward = false; break;
      case KeyCode.KEY_LEFT: this.moveLeft = false; break;
      case KeyCode.KEY_RIGHT: this.moveRight = false; break;

      // Para rotarla
      case KeyCode.KEY_CONTROL: this.cameraControl.unlock(); break;
    }
  }

  updateCameraControl() {
    var segundos = this.clock.getDelta();
    var distancia = this.velocidad*segundos;

    // Cuando se tengan implementadas las colisiones, comprobar aquí.

    if(this.moveForward) this.cameraControl.moveForward(distancia);
    if(this.moveBackward) this.cameraControl.moveForward(-distancia);
    if(this.moveRight) this.cameraControl.moveRight(distancia);
    if(this.moveLeft) this.cameraControl.moveRight(-distancia);
  }


  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.updateCameraControl();
    
    // Se actualiza el resto del modelo
    this.updateModels(); 

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}
export { MyScene_v3 };
