
// Clases de la biblioteca

import * as THREE from '../../libs/three.module.js'
import { TrackballControls } from '../../libs/TrackballControls.js'
import { Stats } from '../../libs/stats.module.js'

// Clases de mi proyecto
import { WorldBall } from '../objetos/WorldBall.js' 
import { DesktopLamp } from '../objetos/DesktopLamp.js'
import { Sofa } from '../objetos/Sofa.js'
import { Closet } from '../objetos/Closet.js'
import { Nightstand } from '../objetos/Nightstand.js'
import { Door } from '../objetos/Door.js'
import { RoomLight } from '../objetos/RoomLight.js'
import { Table } from '../objetos/Table.js'
import { Bed } from '../objetos/Bed.js'
import { Key } from '../objetos/Key.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MySceneModels extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
        
    this.initStats();

    this.createLights ();
    
    this.createCamera ();

    this.createModel();

    this.createGround();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);

    // Añadir el event listener, en este caso solo enciende/apaga las luces
    window.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
  }

  // Función que implementa el pick (diapositivas teoria T4)
  onDocumentMouseDown(event) {
    // El usuario ha hecho clic con el botón izquierdo
    if(event.button === 0) {
      this.lamparaTecho.turnLights();
      this.lamparaTecho.update();
    }
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
  
  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (50,0.2,50);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/marble.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    materialGround.map.wrapS = THREE.RepeatWrapping;
    materialGround.map.wrapT = THREE.RepeatWrapping;
    materialGround.map.repeat.set(30, 30); // Se repite 10 veces en cada eje

    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }

  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (20, 10, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.15);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.8);
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
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
    // Lámpara que cuelga del techo
    this.lamparaTecho = new RoomLight();
    this.add(this.lamparaTecho);
    this.lamparaTecho.position.set(0, 3.5, 0);
    
    // Bola del mundo
    this.worldBall = new WorldBall();
    this.add(this.worldBall);
    this.worldBall.position.x = -10;

    // Lampara de escritorio (MAL)
    this.desktopLamp = new DesktopLamp();
    this.add(this.desktopLamp);
    this.desktopLamp.position.x = -8;

    // Armario
    this.closet = new Closet();
    this.add(this.closet);
    this.closet.position.x = -5;
    this.closet.rotation.y = Math.PI;

    // Sofa
    this.sofa = new Sofa();
    this.add(this.sofa);
    this.sofa.update(); // Solo se actualiza una vez (la primera)
    this.sofa.position.x = 5;
    this.sofa.rotation.y = Math.PI/2;

    // Puerta
    this.door = new Door();
    this.add(this.door);
    this.door.position.x = 10;
    this.door.rotation.y = -Math.PI/2;

    // Mesita de noche
    this.nightstand = new Nightstand();
    this.add(this.nightstand);
    this.nightstand.position.x = 8;

    // Escritorio
    this.table = new Table();
    this.add(this.table);
    this.table.position.x = 12;

    // Cama
    this.bed = new Bed();
    this.add(this.bed);
    this.bed.position.z = 0;

    // Llave
    this.key = new Key();
    this.add(this.key);

  }  

  updateModels() {
    this.worldBall.update();
    this.desktopLamp.update();
    this.closet.update();
    this.door.update();
    this.nightstand.update();
  }

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
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
export { MySceneModels };
