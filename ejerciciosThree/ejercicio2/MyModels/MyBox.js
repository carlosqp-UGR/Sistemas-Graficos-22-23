import * as THREE from '../../libs/three.module.js'
 
class MyBox extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // Un Mesh se compone de geometría y material
    var geom = new THREE.BoxGeometry (this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
    // Como material se crea uno a partir de un color
    var mat = new THREE.MeshNormalMaterial();
   
    // Ya podemos construir el Mesh
    var box = new THREE.Mesh (geom, mat);
    box.name = 'box';

    // Y añadirlo como hijo del Object3D (el this)
    this.add (box);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.5, 3.0, 0.1).name ('Dimension X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.5, 3.0, 0.1).name ('Dimension Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.5, 3.0, 0.1).name ('Dimension Z : ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  setFlatShading(value) {
    this.getObjectByName('box').material.flatShading = value;
  }
  
  update () {
    this.getObjectByName('box').geometry.dispose();
    this.getObjectByName('box').geometry = new THREE.BoxGeometry(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
  }
}

export { MyBox };
