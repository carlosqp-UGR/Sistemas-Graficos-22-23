import * as THREE from '../../libs/three.module.js'

// Lámpara que cuelga del techo e ilumina la habitación.
// Se enciende y se apaga con el interruptor, llamando al método turnLights()
// Medidas (altura y:0.625, radio: 0.3)
class RoomLight extends THREE.Object3D {
    constructor() {
        super();
        this.createModel();
    }
  
    createModel() {

        // Crear la bombilla
        var bombillaGeom = new THREE.SphereGeometry( 0.05, 32, 32 );
        var bombillaMat = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var bombilla = new THREE.Mesh( bombillaGeom, bombillaMat );

        // Crear la luz del foco
        this.luzFoco = new THREE.PointLight( 0xffffff, 0.8, 100 );
        // this.luzFoco = new THREE.PointLight( 0xffe699, 0.4, 100 );

        // Creamos la lampara: un cilindro abierto de "tela"
        var lamparaMat = new THREE.MeshPhongMaterial({color: 0xf5deb3, transparent: true, opacity: 0.8}); //Simula una tela de color Beige con algo de transparencia
        lamparaMat.side = THREE.DoubleSide;
        var lampara = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.3,0.25,33,33, true), lamparaMat);

        // Creamos el cable
        var cableGeom = new THREE.CylinderGeometry(0.001,0.001,0.5);
        cableGeom.translate(0,0.2525,0);
        var cableMat = new THREE.MeshBasicMaterial({color:0x000000});
        var cable = new THREE.Mesh(cableGeom,cableMat);

        // Añadimos: la luz a la bombilla, el cable y la bombilla a la lampara, y la lampara a this
        bombilla.add(this.luzFoco);
        lampara.add(bombilla);
        lampara.add(cable);
        this.add(lampara);

        // La colocamos en el suelo; de alto mide (y=0.625)
        lampara.position.y = 0.125;
    }

    turnLights() {
        this.luzFoco.visible = !this.luzFoco.visible;
    }

    update () {}
}

export { RoomLight };
