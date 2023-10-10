import * as THREE from '../../libs/three.module.js'

class MyMainPendulum extends THREE.Object3D {
  constructor(gui) {
    super();
    this.createGUI(gui);

    // Parámetros para la animacion
    this.animation = false;

    // Para el primer péndulo
    this.sentidoLongitud1 = 1;
    this.sentidoGiro1 = -1;

    // Para el segundo péndulo
    this.sentidoLongitud2 = 1;
    this.sentidoGiro2 = 1;
    this.sentidoPos2 = 1;

    // Construccion del modelo jerárquico
    this.createModel();
  }

  setAnimation(value) {
    this.animation = value;
  }

  createGUI (gui) {

    // Parámetros para la GUI (los necesitamos para controlar la animacion)
    this.minLongitud1 = 5.0;
    this.maxLongitud1 = 10.0;

    this.minLongitud2 = 10.0;
    this.maxLongitud2 = 20.0;

    this.minPos = 0.1;
    this.maxPos = 0.9;

    this.minGiro = -0.8;
    this.maxGiro = 0.8;

    this.stepLongitud = 0.1;
    this.stepGiro = 0.1;
    this.stepPos = 0.1;

    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {

      // 1er pendulo
      giro1 : 0.0,
      longitud1 : this.minLongitud1,
      
      reset1 : () => {
        this.guiControls.giro1 = 0.0;
        this.guiControls.longitud1 = this.minLongitud1;
      },

      // 2o pendulo
      giro2: 0.0,
      longitud2: this.minLongitud2,
      pos: this.minPos,

      reset2 : () => {
        this.guiControls.giro2 = 0.0;
        this.guiControls.longitud2 = this.minLongitud2;
        this.guiControls.pos = this.minPos;
      }
    } 
    
    // Carpeta del primer pendulo
    var folder1 = gui.addFolder ("1er Péndulo");
    folder1.add (this.guiControls, 'longitud1', this.minLongitud1, this.maxLongitud1, this.stepLongitud).name ('Longitud : ').listen();
    folder1.add (this.guiControls, 'giro1', this.minGiro, this.maxGiro, this.stepGiro).name ('Giro : ').listen();
    folder1.add (this.guiControls, 'reset1').name ('[ Reset ]');
    
    // Carpeta del segundo pendulo
    var folder2 = gui.addFolder ("2o Péndulo");
    folder2.add (this.guiControls, 'longitud2', this.minLongitud2, this.maxLongitud2, this.stepLongitud).name ('Longitud : ').listen();
    folder2.add (this.guiControls, 'giro2', this.minGiro, this.maxGiro, this.stepGiro).name ('Giro : ').listen();
    folder2.add (this.guiControls, 'pos', this.minPos, this.maxPos, this.stepPos).name ('Posicion(%) : ').listen();
    folder2.add (this.guiControls, 'reset2').name ('[ Reset ]');
  }

  createModel() {
    // (1er hijo) Construimos el cilindro superior
    var auxGeom = new THREE.CylinderGeometry(1,1,3,6);
    auxGeom.rotateX(Math.PI/2);
    var cylinder1 = new THREE.Mesh(auxGeom, new THREE.MeshBasicMaterial({color: 0x800080}));

    // (2o hijo) Construimos la caja superior
    var topBox = new THREE.Mesh(
    new THREE.BoxGeometry(3,4,2),
    new THREE.MeshBasicMaterial({color:0x006400})
    );

    // (3er hijo) Construimos la caja del medio, que crece/decrece.
    // Este hijo también contiene el péndulo del medio
    // Esta compuesto por middleBox y middlePendulum
    var middleSection = new THREE.Object3D();
      // (3.1) construccion y posicionamiento de middlebox
      this.middleBox = new THREE.Mesh(
        new THREE.BoxGeometry(3,this.guiControls.longitud1, 2),
        new THREE.MeshBasicMaterial({color:0x8B0000})
      );
      // La posicionamos correctamente
      this.middleBox.position.y = -(this.guiControls.longitud1/2);

      // (3.2) construccion de middlePendulum
        this.middlePendulum = new THREE.Object3D();

        // (3.2.1) Construimos los hijos:
        // (a) La caja central, a esta se le aplica la escala (longitud 2)
        this.box = new THREE.Mesh(
          new THREE.BoxGeometry(1.5,this.guiControls.longitud2,1),
          new THREE.MeshBasicMaterial({color:0x000080})
        );

        //(b) El cilindro central, centrado en el origen, siempre en la misma posicion
        var geom = new THREE.CylinderGeometry(0.6,0.6,2,6);
        geom.rotateX(Math.PI/2);
        var cylinder = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color: 0x800080}));

        // (3.2.2) Transformamos los hijos
        // Movemos la caja para que el origen este a 1 ud de altura
        //this.box.position.y = -(this.guiControls.longitud2/2-1);

        // (3.2.3) Añadimos los hijos al padre
        this.middlePendulum.add(this.box);
        this.middlePendulum.add(cylinder);
        this.middlePendulum.position.z = 1.5;

    // Añadimos los hijos a middleSection
    middleSection.add(this.middleBox);
    middleSection.add(this.middlePendulum)

    middleSection.position.y = -2;

    // (4o hijo) La caja de abajo
    this.bottomBox = new THREE.Mesh(
      new THREE.BoxGeometry(3,4,2),
      new THREE.MeshBasicMaterial({color:0x006400})
    );

    // La posicionamos correctamente (el mesh)
    this.bottomBox.position.y = - (4 + this.guiControls.longitud1); 

    // Añadimos los hijos al padre final
    this.add(cylinder1);
    this.add(topBox);
    this.add(middleSection);
    this.add(this.bottomBox);

  }

  update () {

    if(this.animation) {
      // Establecemos el sentido de la animacion para movimientos
      // Péndulo 2
      if(this.guiControls.pos>=this.maxPos)
        this.sentidoPos2 = -1;
      else if (this.guiControls.pos<=this.minPos)
        this.sentidoPos2 = 1;

      this.guiControls.pos += (this.sentidoPos2*this.stepPos/10);
      
      if(this.guiControls.giro2>=this.maxGiro)
        this.sentidoGiro2 = -1;
      else if(this.guiControls.giro2<=this.minGiro)
        this.sentidoGiro2 = 1;

      this.guiControls.giro2 += (this.sentidoGiro2*this.stepGiro/3);

      if (this.guiControls.longitud2>=this.maxLongitud2)
        this.sentidoLongitud2 = -1;
      else if (this.guiControls.longitud2<=this.minLongitud2)
        this.sentidoLongitud2 = 1;

      this.guiControls.longitud2 += (this.sentidoLongitud2*this.stepLongitud)/10;
      
      // Péndulo 1
      if(this.guiControls.longitud1>=this.maxLongitud1)
        this.sentidoLongitud1 = -1;
      else if (this.guiControls.longitud1 <= this.minLongitud1)
        this.sentidoLongitud1 = 1;
      
      this.guiControls.longitud1 += (this.sentidoLongitud1*this.stepLongitud/10);


      if(this.guiControls.giro1 >= this.maxGiro)
        this.sentidoGiro1 = -1;
      else if (this.guiControls.giro1 <= this.minGiro)
        this.sentidoGiro1 = 1;

      this.guiControls.giro1 += (this.sentidoGiro1*this.stepGiro/10);
    }
    // Transformaciones de la parte del medio (middleSection -> middleBox)
    // hay que mover también la caja de abajo
    this.middleBox.scale.y = this.guiControls.longitud1/this.minLongitud1;
    this.middleBox.position.y = -(this.guiControls.longitud1/2);
    this.bottomBox.position.y = - (4 + this.guiControls.longitud1); 

    // Transformaciones del segundo péndulo
    this.box.scale.y = this.guiControls.longitud2/this.minLongitud2;
    this.box.position.y = -(this.guiControls.longitud2/2-1);
    this.middlePendulum.rotation.z = this.guiControls.giro2;
    this.middlePendulum.position.y = -this.guiControls.pos*this.guiControls.longitud1;

    // Transformaciones del propio objeto (this)
    this.rotation.z = this.guiControls.giro1;

  }


}

export { MyMainPendulum };
