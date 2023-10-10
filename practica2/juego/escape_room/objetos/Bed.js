import * as THREE from '../../libs/three.module.js'
 
// Dimensiones (x:2, z:1)
class Bed extends THREE.Object3D {
  constructor() { // Las medidas de la cama son 2m de largo y 1 de ancho
    super();
    this.createModel();
  }

  createModel(){
    // Creamos los materiales a usar
    this.createMaterials();
    this.createSettings();

    //Creamos las patas de la cama. Las de la cabecera son mas largas
    this.createPosts();

    // Creamos la parte de madera que sujeta al colchon sujetándose en las patas
    this.sujeccionMid = this.createBox(1, 0.1, 1.9, this.materialMadera);
    this.sujeccionMid.position.y+=0.15

    this.sujeccionPies = this.createBox(1, 0.35, 0.04, this.materialMadera);
    this.sujeccionPies.position.set(0, 0.275, 0.97)

    this.sujeccionCab = this.createBox(1, 0.8, 0.04, this.materialMadera);
    this.sujeccionCab.position.set(0, 0.5, -0.97);

    // Creamos el colchon
    this.colchon = this.createBox(0.95, 0.17, 1.9, this.materialColchon);
    this.colchon.position.y+=0.285;

    // Creamos la colcha con el bisel para más realismo
    var lengthColcha = 0.8, widthColcha = 0.1;
    var colchaShape = new THREE.Shape();
    colchaShape.moveTo( 0,0 );
    colchaShape.lineTo( 0, widthColcha );
    colchaShape.lineTo( lengthColcha, widthColcha );
    colchaShape.lineTo( lengthColcha, 0 );
    colchaShape.lineTo( 0, 0 );
    this.colcha = new THREE.Mesh(new THREE.ExtrudeGeometry(colchaShape, this.colchaExtrudeSettings), this.materialColcha);
    this.colcha.position.set(-0.4, 0.3, -0.4)
    this.add(this.colcha);
    
    // Para que la almohada tenga más forma de cojín la haremos con el bisel
    var lengthAlmohada = 0.8, widthAlmohada = 0.05;
    var almohadaShape = new THREE.Shape();
    almohadaShape.moveTo( 0,0 );
    almohadaShape.lineTo( 0, widthAlmohada );
    almohadaShape.lineTo( lengthAlmohada, widthAlmohada );
    almohadaShape.lineTo( lengthAlmohada, 0 );
    almohadaShape.lineTo( 0, 0 );
    this.almohada = new THREE.Mesh(new THREE.ExtrudeGeometry(almohadaShape, this.almohadaExtrudeSettings), this.materialColchon);
    this.almohada.position.set(-0.4, 0.41, -0.8)


    //Unimos todas las partes
    this.cama = new THREE.Object3D();
    this.cama.add(this.colchon, this.sujeccionMid, this.sujeccionCab, this.sujeccionPies, this.posts[0], this.posts[1], this.posts[2], this.posts[3], this.almohada);
    this.add(this.cama);

    this.createCollisionBox();
  }

  createSettings(){
    this.almohadaExtrudeSettings = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 10
    };
    this.colchaExtrudeSettings = {
      steps: 2,
      depth: 1.28,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 10
    };
  }
  createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../imgs/wood.jpg');
    // this.material = new THREE.MeshBasicMaterial({map: texture});
    const materialMadera = new THREE.MeshPhongMaterial({
      specular: 0x111111, // Reflectividad especular
      shininess: 10, // Intensidad de la reflexión especular
      map: texture, // Textura de la madera
      side: THREE.DoubleSide // Para que se vea por ambos lados
    });
    this.materialMadera = materialMadera;
    this.materialColchon = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    this.materialColcha = new THREE.MeshStandardMaterial({
      color: 0xff0000, // rojo
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide // para que el material sea visible desde ambos lados de la colcha
  });
  
  }

  createPosts(){
    this.posts =[];
    for(var i=0; i<2; i++){ // El 0 y 2 son las cortas y el 1 y 3 las largas
      this.posts.push(this.createBox(0.05, 0.5, 0.05, this.materialMadera))
      this.posts.push(this.createBox(0.05, 1, 0.05, this.materialMadera))
    }

    this.posts[0].position.set(-0.475, 0.25, 0.975);
    this.posts[1].position.set(-0.475, 0.5, -0.975);
    this.posts[2].position.set(0.475, 0.25, 0.975);
    this.posts[3].position.set(0.475, 0.5, -0.975);
  }

  createBox(x, y, z, material){
    var boxGeom = new THREE.BoxGeometry(x, y, z);
    return new THREE.Mesh(boxGeom, material);
  }

  createCollisionBox() {
    this.collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1,4,2), new THREE.MeshBasicMaterial({transparent:true, opacity: 0}) );
    this.add(this.collisionMesh);
    this.collisionMesh.position.y += 2;
  }
}

export { Bed };