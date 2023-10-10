
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto
import { MyMainPendulum } from './MyModels/MyMainPendulum.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    
    this.gui = this.createGUI ();
    
    this.initStats();

    this.createLights ();
    
    this.createCamera ();

    this.createAxes();

    // this.createGround();

    this.createModel();

    this.createRoute();

    this.createAnimation();

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

  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // velocidad se expresa en unidades/segundo
      velocidad: 0.0,
    }

    // En nuestro caso, las unidades son los radianes.
    // Si quisieramos que se diese una vuelta completa cada segundo
    // entonces velocidad = 2*Math.PI;

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Control');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'velocidad', -10.0, 10.0, 1.0).name('Velocidad : ').listen();

    return gui;
  }

  createLights () {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (ambientLight);

    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (20, 10, 20);
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

  createAxes() {
    this.axis = new THREE.AxesHelper (5);
    this.axis.visible = true;
    this.add (this.axis);
  }

  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (50,0.2,50);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }

  createModel() {
    var geom = new THREE.ConeGeometry(0.5,1.2,30,30);
    geom.rotateX(Math.PI/2);
    this.figura = new THREE.Mesh(
      geom,
      new THREE.MeshPhongMaterial()
    );

    this.add(this.figura);
  }

    // Crea los splines para la animacion
    createRoute() {
      var points = [
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(1,1,-2),
        new THREE.Vector3(4,2,0),
        new THREE.Vector3(1,1,2),
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(-1,-1,-2),
        new THREE.Vector3(-4,-2,0),
        new THREE.Vector3(-1,-1,2),
      ];
  
      this.spline = new THREE.CatmullRomCurve3(points, true);
  
      // Para dibujar la linea
      var geometryLine = new THREE.BufferGeometry();
      geometryLine.setFromPoints(this.spline.getPoints(100));
      var visibleSpline = new THREE.Line(
        geometryLine,
        new THREE.LineBasicMaterial({color:0xff0000, linewidth: 4})
      );
  
      this.add(visibleSpline);
    }

  createAnimation() {
    // Creamos dos objetos para almacenar los valores iniciales y finales de la animación
    var origen = {t: 0};
    var fin = {t: 0.5};

    // Definimos la duración de la animación en milisegundos
    var tiempoDeRecorrido = 4000; // 2000 ms = 2 segundos

    // Creamos la primera animación
    var animacion1 = new TWEEN.Tween(origen)
        .to(fin, tiempoDeRecorrido)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onUpdate(() => {
          var posicion = this.spline.getPointAt(origen.t);
          this.figura.position.copy(posicion);
    
          var tangente = this.spline.getTangentAt(origen.t);
          posicion.add(tangente); // Se mira a un punto en esa dirección
          this.figura.lookAt(posicion);
        });

    // Creamos un nuevo objeto para la segunda animación
    var origen2 = {t: 0.5};
    var fin2 = {t: 1};

    var tiempoDeRecorrido2 = 8000; // 4000 ms = 4 segundos

    // Creamos la segunda animación
    var animacion2 = new TWEEN.Tween(origen2)
        .to(fin2, tiempoDeRecorrido2)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onUpdate(() => {
          var posicion = this.spline.getPointAt(origen2.t);
          this.figura.position.copy(posicion);
    
          var tangente = this.spline.getTangentAt(origen2.t);
          posicion.add(tangente); // Se mira a un punto en esa dirección
          this.figura.lookAt(posicion);
        })
        .onComplete(()=> {
          animacion1.start();
        });

    // Concatenamos las dos animaciones usando el método .chain()
    animacion1.chain(animacion2);

    // Iniciamos la primera animación
    animacion1.start();
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

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
      
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Actualizar la animacion
    TWEEN.update();

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
