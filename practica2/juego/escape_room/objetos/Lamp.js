import * as THREE from '../../libs/three.module.js'

class Lamp extends THREE.Object3D {
    constructor() {
        super();
        this.createMaterials();
        this.createModel();
    }
  
    createModel() {

        // Crear la bombilla
        var bombillaGeom = new THREE.SphereGeometry( 0.05, 32, 32 );
        var bombilla = new THREE.Mesh( bombillaGeom, this.bombillaMat );

        // Crear la luz del foco
        this.luzFoco = new THREE.PointLight( 0xff0000, 0.5, 100 );
        this.luzFoco.position.set(0, 0.5, 0);
        this.luzFoco.rotation.set(-Math.PI/2, 0, 0);
        this.luzFoco.visible=false;

        // this.luzFoco = new THREE.PointLight( 0xffe699, 0.4, 100 );

        // Creamos la lampara: un cilindro abierto de "tela"
        var lampara = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.15,0.15,33,33, true), this.lamparaMat);

        // Creamos la base
        var points=[];
        points.push(new THREE.Vector3(0, 0));
        points.push(new THREE.Vector3(1, 0));
        points.push(new THREE.Vector3(1, 0.5));
        points.push(new THREE.Vector3(0.9, 0.6));
        points.push(new THREE.Vector3(0.8, 0.7));
        points.push(new THREE.Vector3(0.7, 0.8));
        points.push(new THREE.Vector3(0.6, 0.9));
        points.push(new THREE.Vector3(0.57, 0.95));
        points.push(new THREE.Vector3(0.54, 1.05));
        points.push(new THREE.Vector3(0.51, 1.1));
        points.push(new THREE.Vector3(0.48, 1.15));
        points.push(new THREE.Vector3(0.45, 1.2));
        points.push(new THREE.Vector3(0.45, 1.3));
        this.base = new THREE.Mesh( new THREE.LatheGeometry( points ), this.materialBase );
        this.base.scale.set(0.1, 0.1, 0.1); 
        this.add(this.base);

        this.final = new THREE.Object3D();
        bombilla.add(this.luzFoco);
        bombilla.position.set(0, 0.15, 0);
        lampara.position.y=0.1;
        this.final.add(lampara, bombilla);
        lampara.userData=this;
        bombilla.userData=this;
        this.base.userData=this;
        this.final.userData=this;
        this.add(this.final);

        // La colocamos en el suelo; de alto mide (y=0.625)
        lampara.position.y += 0.125;
    }

    createMaterials(){
        this.lamparaMat = new THREE.MeshPhongMaterial({color: 0xffa500, transparent: true, opacity: 0.8}); //Simula una tela de color Beige con algo de transparencia
        this.lamparaMat.side = THREE.DoubleSide;
        this.materialBase = new THREE.MeshPhongMaterial({ color: 0xffa500, opacity: 0.8 });
        this.bombillaMat = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.2, shininess: 100, reflectivity: 0.8 });
    }

    turnLights() {
        this.luzFoco.visible = !this.luzFoco.visible;
    }

    update () {}
}

export { Lamp };
