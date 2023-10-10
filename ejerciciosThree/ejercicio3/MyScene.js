
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto
 
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

    this.createProfile();

    this.createLine();

    this.createParcialModel();

    this.createCompleteModel();
    
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
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    this.guiControls = {
      lightIntensity : 0.5,
      flatShading: false,
      segments: 3,
      phiLength: Math.PI * 0.5,

      reset : () => {
        this.guiControls.segments = 3;
        this.guiControls.phiLength = Math.PI * 0.5;
      }

    }

    var folder = gui.addFolder ('Luz e Iluminación');
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    folder.add (this.guiControls, 'flatShading')
      .name ('Flat shading : ')
      .onChange ( (value) => this.setFlatShading (value) );
    
    var folderRev = gui.addFolder('Param. Revolucion');
    folderRev.add(this.guiControls, 'segments', 3, 33, 1).name('Resolucion : ').listen();
    folderRev.add(this.guiControls, 'phiLength', 0, 2*Math.PI, 0.1).name('Ángulo : ').listen();
    folderRev.add (this.guiControls, 'reset').name ('[ Reset ]');

    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }

  // Crea el perfil (objeto de tipo shape)
  createProfile() {
    this.profile = new THREE.Shape();
    this.profile.moveTo(0,0);
    this.profile.lineTo(4,0);
    this.profile.lineTo(4,2);
    this.profile.quadraticCurveTo(2.3,3,1,6);
    this.profile.quadraticCurveTo(2.6,8.25,0,9);    
  }

  // Crea la linea a partir del perfil para poder ser visualizada
  createLine() {
    var lineGeometry = new THREE.BufferGeometry();
    var points = this.profile.extractPoints(20).shape;
    lineGeometry.setFromPoints(points);
    this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0x000000 }));
    
    this.line.position.x = -10;
    
    this.add(this.line);
  }

  // Convierte el objeto Shape (con coordenadas 2d) en coordenadas 3d
  // Ver ejemplo del código en las diapositivas del tema 3
  shapeToVector3(shape) {
    if (!(shape instanceof THREE.Shape)) {
      throw new Error("El parámetro debe ser un objeto THREE.Shape.");
    }
    var v2 = shape.getPoints();
    //var numPoints = shape.points.length;
    //var v2 = shape.extractPoints(numPoints);
    var v3 = [];

    v2.forEach((v)=> {
      v3.push(new THREE.Vector3(v.x, v.y, 0));
    });

    return v3;
  }

  // Crea el objeto por revolucion parcial
  createParcialModel() {
    var geom = new THREE.LatheGeometry(this.profile.getPoints(), this.guiControls.segments, 0, this.guiControls.phiLength);
    var mat = new THREE.MeshNormalMaterial();
    this.parcialModel = new THREE.Mesh(geom, mat);
    
    // Añadir el hijo a la escena para que se visualice
    this.add(this.parcialModel);
  }

  // Crea el objeto por revolucion completo
  createCompleteModel(){
    // var geom = new THREE.LatheGeometry(this.profile, this.guiControls.segments, 0, 2*Math.PI);
    var geom = new THREE.LatheGeometry(this.profile.getPoints(), 16, 0, 2*Math.PI);
    var mat = new THREE.MeshNormalMaterial();
    this.completeModel = new THREE.Mesh(geom, mat);

    // Añadir el hijo a la escena para que se visualice
    this.add(this.completeModel);

    // Movemos la posicion
    this.completeModel.position.x = 10;
  }

  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }

  setFlatShading (valor) {
    this.parcialModel.material.flatShading = valor;
    this.completeModel.material.flatShading = valor;
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

  updateModel() {
    this.parcialModel.geometry = new THREE.LatheGeometry(this.profile.getPoints(), this.guiControls.segments, 0, this.guiControls.phiLength);
    this.completeModel.geometry = new THREE.LatheGeometry(this.profile.getPoints(), this.guiControls.segments, 0, 2*Math.PI);
  }

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Se actualiza el resto del modelo
    this.updateModel();
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

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
