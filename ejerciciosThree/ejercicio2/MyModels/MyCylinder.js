import * as THREE from '../../libs/three.module.js'
 
class MyCylinder extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la objeto
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Se crea la geometria
    var geom = new THREE.CylinderGeometry(this.guiControls.radiusTop, this.guiControls.radiusBottom, this.guiControls.height);

    // Se crea el material
    var mat = new THREE.MeshNormalMaterial();

    // Se crea el Mesh
    var mesh = new THREE.Mesh(geom, mat);
    mesh.name = 'cylinder';

    // Y añadirlo como hijo del Object3D (el this)
    this.add(mesh);    
  }
  
  createGUI (gui,titleGui) {


    // Controles para el tamaño de esfera
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      radiusTop : 0.5,
      radiusBottom : 0.5,
      height : 1.0,
      radialSegments: 8.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.radiusTop = 0.5;
        this.guiControls.radiusBottom = 0.5;
        this.guiControls.height = 1.0;
        this.guiControls.radialSegments = 8.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radiusTop', 0.5, 1.5, 0.1).name ('Radio Superior : ').listen();
    folder.add (this.guiControls, 'radiusBottom', 0.5, 1.5, 0.1).name ('Radio Inferior : ').listen();
    folder.add (this.guiControls, 'height', 0.5, 3.0, 0.1).name ('Altura : ').listen();
    folder.add (this.guiControls, 'radialSegments', 8.0, 32.0, 4.0).name ('Resolucion : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  setFlatShading(value) {
    this.getObjectByName('cylinder').material.flatShading = value;
  }
  
  update () {   
    this.getObjectByName('cylinder').geometry.dispose();
    this.getObjectByName('cylinder').geometry = new THREE.CylinderGeometry(this.guiControls.radiusTop, this.guiControls.radiusBottom, this.guiControls.height, this.guiControls.radialSegments);
  }
}

export { MyCylinder };
