import * as THREE from '../../libs/three.module.js'
 
class MyIcosahedron extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la objeto
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // Se crea la geometria
    var geom = new THREE.IcosahedronGeometry(this.guiControls.radius);

    // Se crea el material
    var mat = new THREE.MeshNormalMaterial();

    // Se crea el Mesh
    var mesh = new THREE.Mesh(geom, mat);
    mesh.name = 'ico';

    // Y añadirlo como hijo del Object3D (el this)
    this.add(mesh);    
  }
  
  createGUI (gui,titleGui) {


    // Controles para el tamaño de esfera
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      radius : 0.5,
      detail : 0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.radius = 0.5;
        this.guiControls.detail = 0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'radius', 0.5, 1.5, 0.1).name ('Radio Superior : ').listen();
    folder.add (this.guiControls, 'detail', 0, 10, 1.0).name ('Subdivision : ').listen();

    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }

  setFlatShading(value) {
    this.getObjectByName('ico').material.flatShading = value;
  }
  
  update () {   
    this.getObjectByName('ico').geometry.dispose();
    this.getObjectByName('ico').geometry = new THREE.IcosahedronGeometry(this.guiControls.radius, this.guiControls.detail);
  }
}

export { MyIcosahedron };
