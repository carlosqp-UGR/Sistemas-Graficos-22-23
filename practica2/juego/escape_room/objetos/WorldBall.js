import * as THREE from '../../libs/three.module.js'
 
// Dimensiones totales (tras aplicar la escala de 0.2)
class WorldBall extends THREE.Object3D {
  constructor() {
    super();
    this.createModel();
  }
  

  createMaterials() {
    // Se crea el material (basado en una textura)
    // Carga la textura de la bola del mundo
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../imgs/tierra.jpg');
    this.materialSphere = new THREE.MeshPhongMaterial({ map: texture });

    // Aquí creamos el material del soporte y la base
    var materialPlastico = new THREE.MeshPhysicalMaterial( {
      color: 0xffffff,
      opacity: 0.8,
      transparent: true,
      roughness: 0.3,
      metalness: 0.1,
      transmission: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.3,
    } );
    
    this.material = materialPlastico;
  }
  createModel() {
    // Creamos todos los materiales que usaremos
    this.createMaterials();

    // Creación del globo terráqueo
    var sphereGeometry = new THREE.SphereGeometry(1,30,30);

    // Crea un material MeshBasicMaterial y establece la textura como su mapa de texturas

    this.sphere = new THREE.Mesh(
      sphereGeometry,
      this.materialSphere
    );

    // Creación de el soporte del globo (arqueado y eje)
    // Lo guardaremos en un Object3D para inclinarlo en el eje Z
    var top = new THREE.Object3D();

    const R = 1.25;
    const r = 1.15;
    const shape = new THREE.Shape();
    shape.moveTo(0,-R);
    shape.bezierCurveTo(0.55*R,-R,R,0.45*-R,R,0);
    shape.bezierCurveTo(R,0.45*R,0.55*R,R,0,R);
    shape.lineTo(0,r);
    shape.bezierCurveTo(0.55*r,r,r,0.45*R,r,0);
    shape.bezierCurveTo(r,-0.45*r,0.55*r,-r, 0, -r);
    shape.lineTo(0,-R);

    var options = {
      depth: 0.15,
      curveSegments: 33,
      bevelEnabled: false
    };

    var extrudeGeometry = new THREE.ExtrudeGeometry(shape, options);
    extrudeGeometry.translate(0,0,-options.depth/2);

    var aux = new THREE.Mesh(
      extrudeGeometry,
      this.material
    );

    var ejeRotatorio = new THREE.Mesh(
      new THREE.CylinderGeometry(options.depth/2,options.depth/2,2*R+0.2,33,33),
      this.material
    );


    top.add(this.sphere);
    top.add(aux);
    top.add(ejeRotatorio);
    top.rotation.z = -Math.PI/8;

    // Creamos la base Inferior compuesta por dos cilindros
    var heightSoporte = 0.4;
    var soporte = new THREE.Mesh(
      new THREE.CylinderGeometry(options.depth,2*options.depth,heightSoporte,33,33),
      this.material
    );

    var heightBase = 0.1;
    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(1,1,heightBase,33,33),
      this.material
    );
  
    // Movemos los elementos para que la base quede en el suelo
    top.position.y = R-0.02+heightSoporte+heightBase;  // Justo en el suelo (0.02 por la rotacion en Z)
    soporte.position.y = heightSoporte/2 + heightBase;
    base.position.y = heightBase/2;

    this.add(top);
    this.add(soporte);
    this.add(base);


    // Aplicamos la escala de 0.25 para unas medidas realistas
    this.scale.set (0.2,0.2,0.2);
  }
  
  update () {   
    this.sphere.rotation.y += 0.04; 

  }
}

export { WorldBall };
