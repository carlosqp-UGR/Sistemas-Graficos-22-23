import * as THREE from '../../libs/three.module.js'
import {CSG} from '../../libs/CSG-v2.js'
 
class Key extends THREE.Object3D {
  constructor(type) {
    super();
    this.createModel(type); // PROBAR SI FUNCIONA CSG
  }

  createModel(type){
    //Creamos un material que simula el latón si es verdadero, en caso contrario es metálica
    this.createMaterials(type);

    //Creamos las partes de la llave
    this.createModelCabeza();
    this.createModelCuerpo();

    //Unimos ambas partes y las escalamos
    this.key = new THREE.Object3D();
    this.key.add(this.cabeza, this.pinchosB); //La llave prescalada mide 12.5 de largo, 1 de alto y 6 de ancho (la cabeza)
    this.key.scale.set(0.01, 0.01, 0.01);  //Tras el escalado mide 12,5cm
    this.key.position.y+=0.005; //La colocamos encima del suelo

    //Ver el resultado (borrar)
    this.add(this.key);

    // Ponerle el userData para el pick
    this.userData = this;
    this.key.userData = this;
    this.cabeza.userData = this;
    this.pinchosB.userData = this;
  }

  createMaterials(type) {
    if(type){
      this.material = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        roughness: 0.5,
        metalness: 0.8,
        envMapIntensity: 1,
        side: THREE.DoubleSide
      }); 
    } else{
      this.material = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        roughness: 0.5, 
        metalness: 0.9, 
        envMapIntensity: 1,
        side: THREE.DoubleSide
      });
    }
       
  }

  createCylindrer(radiusTop, radiusBottom, height, radialSegments) {
    var cylinderGeom = new THREE.CylinderGeometry (radiusTop,radiusBottom,height,radialSegments);
    var cylinder = new THREE.Mesh(cylinderGeom, this.material);
    return cylinder
  }

  createModelCabeza() {
    // Hacemos la cabeza de la llave usando cilindros
    var circuloExt=this.createCylindrer(3,3,1,36)
    var circuloInt=this.createCylindrer(0.5, 0.5, 1, 32);
    circuloInt.position.x=-1.2;

    // CSG Para la cabeza
    var csg1 = new CSG();
    csg1.union([circuloExt]);
    csg1.subtract([circuloInt]);

    this.cabeza = csg1.toMesh();
    this.cabeza.position.x=-2;
  }

  createModelCuerpo(){
    // Creamos la forma de los pinchos de la llave
    var pinchosShape = new THREE.Shape();
    pinchosShape.lineTo(7, 0);
    pinchosShape.bezierCurveTo(7, 0, 7.5, 0 ,7.5, -1);
    pinchosShape.bezierCurveTo(7.5, -1, 7.2, -1.5, 6.7, -1.7);
    pinchosShape.bezierCurveTo(6.7, -1.7, 6.35, -1.6, 6, -1.6);
    pinchosShape.bezierCurveTo(6, -1.6, 5.75, -1.8, 5.5, -2);
    pinchosShape.bezierCurveTo(5.5, -2, 5.25, -1.8, 5, -1.6);
    pinchosShape.bezierCurveTo(5, -1.6, 4.75, -1.7, 4.5, -1.8);
    pinchosShape.bezierCurveTo(4.5, -1.8, 4.25, -1.6, 4, -1.5);
    pinchosShape.bezierCurveTo(4, -1.5, 3.75, -1.8, 3.5, -2);
    pinchosShape.bezierCurveTo(3.5, -2, 3.3, -1.8, 3.1, -1.7);
    pinchosShape.bezierCurveTo(3.1, -1.7, 2.9, -1.8, 2.7, -1.9);
    pinchosShape.bezierCurveTo(2.7, -1.9, 2.45, -1.7, 2.2, -1.6);
    pinchosShape.bezierCurveTo(2.2, -1.6, 2.05, -1.8, 1.9, -2);
    pinchosShape.bezierCurveTo(1.9, -2, 0.5, -2, 0, -2);
    pinchosShape.lineTo(0, 0);

    var extrudeSettings = {
        steps: 2,
        depth: 1,
        bevelEnabled: false
    };

    var pinchosGeom = new THREE.ExtrudeGeometry(pinchosShape, extrudeSettings);
    var pinchos = new THREE.Mesh(pinchosGeom, this.material);

    pinchos.position.set(0, 1, -0.5)

    this.pinchosB = new THREE.Object3D();
    this.pinchosB.add(pinchos);
    this.pinchosB.rotation.x=Math.PI/2;
  }
}

export { Key };