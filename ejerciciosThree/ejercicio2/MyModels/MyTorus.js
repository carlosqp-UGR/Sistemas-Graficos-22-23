import * as THREE from '../../libs/three.module.js'
 
class MyTorus extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la objeto
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Se crea la geometria
    var geom = new THREE.TorusGeometry(this.guiControls.radius, this.guiControls.tubeRadius);

    // Se crea el material
    var mat = new THREE.MeshNormalMaterial();

    // Se crea el Mesh
    var mesh = new THREE.Mesh(geom, mat);
    mesh.name = 'torus';

    // Y añadirlo como hijo del Object3D (el this)
    this.add(mesh);    
  }
  
  createGUI (gui,titleGui) {


    // Controles para el tamaño de esfera
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      radius : 0.5,
      tubeRadius: 0.2,
      radialSegments: 8.0,
      tubularSegments: 6.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.radius = 0.5;
        this.guiControls.tubeRadius = 0.2;
        this.guiControls.radialSegments = 8.0;
        this.guiControls.tubularSegments = 6.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 0.5, 1.5, 0.1).name ('Radio Principal : ').listen();
    folder.add (this.guiControls, 'tubeRadius', 0.2, 1.3, 0.1).name ('Radio Tubo : ').listen();
    folder.add (this.guiControls, 'radialSegments', 8.0, 32.0, 4.0).name ('Resolucion Toro : ').listen();
    folder.add (this.guiControls, 'tubularSegments', 6.0, 30.0, 4.0).name ('Resolucion Tubo : ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  setFlatShading(value) {
    this.getObjectByName('torus').material.flatShading = value;
  }
  
  update () {   
    this.getObjectByName('torus').geometry.dispose();
    this.getObjectByName('torus').geometry = new THREE.TorusGeometry(this.guiControls.radius, this.guiControls.tubeRadius, this.guiControls.radialSegments, this.guiControls.tubularSegments);
  }
}

export { MyTorus };
