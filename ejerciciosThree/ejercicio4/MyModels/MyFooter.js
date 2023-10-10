import * as THREE from '../../libs/three.module.js'
 
class MyFooter extends THREE.Object3D {
  constructor() {
    super();

    // Creamos el footer por revolución partiendo de un perfil Shape
    var points = [
      new THREE.Vector2(0,0),
      new THREE.Vector2(2,0),
      new THREE.Vector2(1,1),
      new THREE.Vector2(1,4),
      new THREE.Vector2(0,4)
    ];

    var footerGeometry = new THREE.LatheGeometry(points, 20,0, Math.PI * 2);

    // Modificamos la geometria del footer antes de crear el mesh:
    // Primero la centramos en el origen
    footerGeometry.translate(0,-2,0);
    // Despues, la encogemos (escalado uniforme)
    footerGeometry.scale(0.25,0.5,0.25);

    var mat = new THREE.MeshPhongMaterial({color: 0xCF0000});

    // Creamos finalmente el footer con el mesh
    var mesh = new THREE.Mesh(footerGeometry, mat);

    this.add(mesh);
  }

}

export { MyFooter };
