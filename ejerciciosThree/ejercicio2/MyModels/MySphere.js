import * as THREE from '../../libs/three.module.js'
 
class MySphere extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la objeto
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Se crea la geometria
    var geom = new THREE.SphereGeometry(this.guiControls.radius);

    // Se crea el material (basado en una textura)
    // Carga la textura de la bola del mundo
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../imgs/tierra.jpg');

    // Crea un material MeshBasicMaterial y establece la textura como su mapa de texturas
    const mat = new THREE.MeshBasicMaterial({ map: texture });

    //var mat = new THREE.MeshNormalMaterial();

    // Se crea el Mesh
    var sphere = new THREE.Mesh(geom, mat);
    sphere.name = 'sphere';

    // Y añadirlo como hijo del Object3D (el this)
    this.add(sphere);    
  }
  
  createGUI (gui,titleGui) {


    // Controles para el tamaño de esfera
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      radius : 0.5,
      equatorResolution : 16.0,
      meridianResolution : 16.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.radius = 0.5;
        this.guiControls.equatorResolution = 16.0;
        this.guiControls.meridianResolution = 16.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 0.5, 1.5, 0.1).name ('Radio : ').listen();
    folder.add (this.guiControls, 'equatorResolution', 16.0, 33.0, 1.0).name ('Res. Ecuador : ').listen();
    folder.add (this.guiControls, 'meridianResolution', 16.0, 33.0, 1.0).name ('Res. Meridiano: ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  setFlatShading(value) {
    this.getObjectByName('sphere').material.flatShading = value;
  }
  
  update () {   
    this.getObjectByName('sphere').geometry.dispose();
    this.getObjectByName('sphere').geometry = new THREE.SphereGeometry(this.guiControls.radius, this.guiControls.equatorResolution, this.guiControls.meridianResolution);
  }
}

export { MySphere };
