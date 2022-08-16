import * as THREE from '../node_modules/three/build/three.module.js';

var synchronous = false;
var globalMouseDown = false;
var globalCameraX = 0;
var globalCameraY = 0;
var rotateSpeed = 0.003;
var canvasList = [];
var canAddCanvas = false;
var canShowData = false;

function createCanvas(path){
    let that = this;
    this.index = canvasList.length;
    const newCanvas = document.createElement( 'canvas' );
    var parent = document.getElementById('canvasContainer');
    var box = document.createElement('div')
    box.classList.add('box')
    var clearBtn = document.createElement('div');
    clearBtn.classList.add('clear');
    var board = document.createElement('ul')
    board.classList.add('board')
    var label1 = document.createElement('li');
    var label2 = document.createElement('li');
    var label3 = document.createElement('li');


    parent.appendChild(box);
    box.appendChild(newCanvas)
    box.appendChild(clearBtn);
    box.appendChild(board)
    board.appendChild(label1);
    board.appendChild(label2);
    board.appendChild(label3);
    
    const scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/(canvasList.length+1)) / window.innerHeight, 0.1, 1000 );
    // this.camera.lookAt(new THREE.Vector3(-1, 0, 0));
    this.renderer = new THREE.WebGLRenderer( {canvas: newCanvas, antialias: true} );

    this.renderer.setSize( window.innerWidth/(canvasList.length+1), window.innerHeight );

    const geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );//set a sphere
    geometry.scale(-1, 1, 1);//make the image can show on its inner

    const texture = new THREE.TextureLoader().load( path );
	this.material = new THREE.MeshBasicMaterial( { map: texture } );

    this.mesh = new THREE.Mesh( geometry, this.material );
    scene.add( this.mesh );


    var isMouseDown =false;
    var currentX = 0;
    var currentY = 0;

    newCanvas.onmousedown = (event) => {
        if (!synchronous) {
            isMouseDown = true;
            currentX = event.clientX;
            currentY = event.clientY;
        }
    }

    newCanvas.onmouseup = (event) => {
        isMouseDown = false;
    }
    newCanvas.onmousemove = (event) => {
        if (isMouseDown && !synchronous) {
            this.mesh.rotation.y -= rotateSpeed * (event.clientX-currentX);
            this.mesh.rotation.x -= rotateSpeed * (event.clientY-currentY);
            // console.log(event.clientX, currentX);
            // console.log(event.clientY, currentY);
            if (this.mesh.rotation.x > Math.PI/2) {
                this.mesh.rotation.x = Math.PI/2;
            }
            if (this.mesh.rotation.x < -Math.PI/2) {
                this.mesh.rotation.x = -Math.PI/2;
            }
            if (this.mesh.rotation.y > Math.PI/2) {
                this.mesh.rotation.y = -Math.PI*3/2;
            }
            if (this.mesh.rotation.y < -Math.PI*3/2) {
                this.mesh.rotation.y = Math.PI/2;
            }
            currentX = event.clientX;
            currentY = event.clientY;
            this.updateData();
        }    
    }
    newCanvas.onmousewheel = (event) => {
        if (!synchronous) {
            this.camera.fov -= event.wheelDelta>0?1:-1;
            if (this.camera.fov > 150) {
                this.camera.fov = 150;
            }
            if (this.camera.fov < 30) {
                this.camera.fov = 30;
            }
            this.camera.updateProjectionMatrix();
            this.updateData();
        }
    }
    newCanvas.ondragenter = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }
    newCanvas.ondragleave = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }
    newCanvas.ondragover = (event) => {
        event.stopPropagation();
        event.preventDefault();
        // console.log(event);
    }
    newCanvas.ondrop = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(event);
        var file = event.dataTransfer.files[0];
        
        console.log(file)
    }
    clearBtn.onclick = (event) => {
        var p = document.getElementById('canvasContainer');
        var canvas2delete = p.children[this.index];
        p.removeChild(canvas2delete);
        canvasList.splice(this.index, 1);
        resizeCanvas();
        for(var i in canvasList){
            canvasList[i].index = i;
        }
    }

    this.updateData = () => {
        if(canShowData) {
            label1.innerHTML = "vertical FoV:"+this.camera.fov.toString()
            label2.innerHTML = 'vertical degree:'+(-this.mesh.rotation.x/Math.PI*180).toString().substring(0, 7);
            label3.innerHTML = 'horizontal degree:'+((this.mesh.rotation.y/Math.PI*180)+90).toString().substring(0, 7);
        } else {
            label1.innerHTML = '';
            label2.innerHTML = '';
            label3.innerHTML = '';
        }
    }

    function animate() {
        requestAnimationFrame( animate );
        that.renderer.render( scene, that.camera ); 
    };

    animate();
}

function controlAll() {
    var x, y, fov = 0;
    for(var i in canvasList){
        if(i == 0){
            x = canvasList[i].mesh.rotation.x;
            y = canvasList[i].mesh.rotation.y;
        } else {
            canvasList[i].mesh.rotation.x = x;
            canvasList[i].mesh.rotation.y = y;
        }
    }
    for(var i in canvasList){
        if(i == 0){
            fov = canvasList[i].camera.fov;
        } else {
            canvasList[i].camera.fov = fov;
            canvasList[i].camera.updateProjectionMatrix();
        }
    }

    var parent = document.getElementById('canvasContainer');

    parent.onmousedown = (event) => {
        if (synchronous) {
            globalMouseDown = true;
            globalCameraX = event.clientX;
            globalCameraY = event.clientY;
        }
    }

    parent.onmouseup = (event) => {
        globalMouseDown = false;
    }
    parent.onmousemove = (event) => {
        if (globalMouseDown && synchronous) {
            var deltay = rotateSpeed * (event.clientX-globalCameraX);
            var deltax = rotateSpeed * (event.clientY-globalCameraY);
            for(var i of canvasList) {
                i.mesh.rotation.y -= deltay;
                i.mesh.rotation.x -= deltax;
                // console.log(event.clientX, currentX);
                // console.log(event.clientY, currentY);
                if (i.mesh.rotation.x > Math.PI/2) {
                    i.mesh.rotation.x = Math.PI/2;
                }
                if (i.mesh.rotation.x < -Math.PI/2) {
                    i.mesh.rotation.x = -Math.PI/2;
                }
                if (i.mesh.rotation.y > Math.PI) {
                    i.mesh.rotation.y = -Math.PI;
                }
                if (i.mesh.rotation.y < -Math.PI) {
                    i.mesh.rotation.y = Math.PI;
                }
                globalCameraX = event.clientX;
                globalCameraY = event.clientY;
            }
        }  
        for(var i of canvasList){
            i.updateData();
        }  
    }
    parent.onmousewheel = (event) => {
        if (synchronous) {
            var deltaf = event.wheelDelta>0?1:-1
            for(var i of canvasList) {
                i.camera.fov -= deltaf;
                if (i.camera.fov > 120) {
                    i.camera.fov = 120;
                }
                if (i.camera.fov < 30) {
                    i.camera.fov = 30;
                }
                i.camera.updateProjectionMatrix();
                
            }
        }
        for(var i of canvasList){
            i.updateData();
        }
    }
}

function cancelControlAll() {
    var parent = document.getElementById('canvasContainer');
    parent.onmousedown = null;
    parent.onmouseup = null;
    parent.onmousemove = null;
    parent.onmousewheel = null;
}

function resizeCanvas() {
    var p = document.getElementById('canvasContainer');
    for(var i of canvasList) {
        i.camera.aspect = (p.clientWidth/canvasList.length) / p.clientHeight;
        i.camera.updateProjectionMatrix();
        i.renderer.setSize( p.clientWidth/canvasList.length, p.clientHeight );
    }
}

window.addEventListener('message', event => {

    var message = event.data; // The JSON data our extension sent
    if(canAddCanvas ||canvasList.length == 0){
        canvasList.push(new createCanvas(message.text));//init
        resizeCanvas();
    } else {
        canvasList[canvasList.length-1].material.map.image.src = message.text;
        canvasList[canvasList.length-1].material.map.needsUpdate = true;
    }
    
}); 

window.addEventListener( 'resize', resizeCanvas);

document.getElementById('same').addEventListener('click', ()=>{
    synchronous = !synchronous;
    if(synchronous){
        controlAll();
        document.getElementById("same").style.backgroundColor = '#cbd2d4';
    } else {
        cancelControlAll();
        document.getElementById("same").style.backgroundColor = '#f0fcff';
    }
})

document.getElementById('add').addEventListener('click', ()=>{
    canAddCanvas = !canAddCanvas;
    if(canAddCanvas) {
        document.getElementById('add').style.backgroundColor = '#cbd2d4';
    } else {
        document.getElementById("add").style.backgroundColor = '#f0fcff';
    }
})

document.getElementById('data').addEventListener('click', ()=>{
    canShowData = !canShowData;
    if(canShowData) {
        document.getElementById('data').style.backgroundColor = '#cbd2d4';
    } else {
        document.getElementById("data").style.backgroundColor = '#f0fcff';
    }
    for(var i of canvasList){
        i.updateData();
    }
})

