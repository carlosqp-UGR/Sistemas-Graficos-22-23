import * as THREE from '../../libs/three.module.js'

// Medidas de la mesa {x:2, y:0.7, z:2}
class Table extends THREE.Object3D {
  constructor() { // Las medidas de la mesa son 2x2
    super();
    this.createModel();
  }

  createModel(){
    // Creamos los materiales a usar
    this.createMaterials();
    this.createSettings();

    var lengthMesa = 2, widthMesa = 2;
    var mesaShape = new THREE.Shape();
    mesaShape.moveTo( 0,0 );
    mesaShape.lineTo( 0, widthMesa );
    mesaShape.lineTo(lengthMesa-1.2, widthMesa);
    mesaShape.lineTo(lengthMesa-1.2, widthMesa-0.4)
    mesaShape.bezierCurveTo(lengthMesa-1.2, widthMesa-0.4, lengthMesa-1.2, widthMesa-1.2, lengthMesa-0.4, widthMesa-1.2);
    mesaShape.lineTo(lengthMesa, widthMesa-1.2);
    mesaShape.lineTo(lengthMesa, 0);
    mesaShape.lineTo(0, 0);

    this.tabla = new THREE.Mesh(new THREE.ExtrudeGeometry(mesaShape, this.extrudeSettings), this.materialMadera);

    //Caja para las colisiones
    var colisionShape = new THREE.Shape();
    colisionShape.moveTo( 0,0 );
    colisionShape.lineTo( 0, widthMesa );
    colisionShape.lineTo(lengthMesa-1.2, widthMesa);
    colisionShape.lineTo(lengthMesa-1.2, widthMesa-0.4)
    colisionShape.bezierCurveTo(lengthMesa-1.2, widthMesa-0.4, lengthMesa-1.2, widthMesa-1.2, lengthMesa-0.4, widthMesa-1.2);
    colisionShape.lineTo(lengthMesa, widthMesa-1.2);
    colisionShape.lineTo(lengthMesa, 0);
    colisionShape.lineTo(0, 0);
    this.collisionMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(colisionShape, this.extrudeSettingsColisiones), new THREE.MeshBasicMaterial({transparent:true, opacity:0}));

    this.tabla.add(this.collisionMesh);
    this.tabla.rotation.x+=Math.PI/2
    this.tabla.position.y=0.1;
    this.collisionMesh.position.z-=2;
    
    //Postes
    this.posts =[];
    this.posts.push(this.createBox(0.1, 0.6, 0.1, this.materialMadera))
    this.posts.push(this.createBox(0.1, 0.6, 0.1, this.materialMadera))

    this.posts[0].position.set(1.75, -0.3, 0.4);
    this.posts[1].position.set(0.4, -0.3, 1.75);

    this.mesa = new THREE.Object3D();
    this.mesa.add(this.tabla, this.posts[0], this.posts[1]);
    this.mesa.position.y+=0.6;
    this.add(this.mesa);
  }

  createSettings(){
    this.extrudeSettings = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: false,
    };
    this.extrudeSettingsColisiones = {
      steps: 2,
      depth: 4,
      bevelEnabled: false,
    };
  }

  createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../imgs/wood.jpg');
    // this.material = new THREE.MeshBasicMaterial({map: texture});
    const materialMadera = new THREE.MeshPhongMaterial({
      specular: 0x111111, // Reflectividad especular
      shininess: 10, // Intensidad de la reflexión especular
      map: texture, // Textura de la madera
      side: THREE.DoubleSide // Para que se vea por ambos lados
    });
    this.materialMadera = materialMadera;
  }

  createBox(x, y, z, material){
    var boxGeom = new THREE.BoxGeometry(x, y, z);
    return new THREE.Mesh(boxGeom, material);
  }

  update() {}
}

export { Table };