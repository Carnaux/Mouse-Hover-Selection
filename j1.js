var objects = [];

var boundingBoxes = [];

var skirts = [];

var hovered = null;
var selected = null;
var activeSkirt;
var hoveredSkirt;

var tempLines = [];

var mouse = new THREE.Vector2();

var scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(120,120,130)")
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var orbit = new THREE.OrbitControls( camera, renderer.domElement);
orbit.update();
orbit.addEventListener( 'change', render );

var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
objects.push(cube);
cube.position.set(5,0,0)

let skirt1 = createSkirt(cube, null, boundingBoxes);
skirts.push(skirt1);



var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material = new THREE.MeshBasicMaterial( { color: 0xf2ff00 } );
var cube2 = new THREE.Mesh( geometry, material );
cube2.position.set(-4,0,0)
scene.add( cube2 );
objects.push(cube2);


let skirt2 = createSkirt(cube2, null, boundingBoxes);
skirts.push(skirt2);

camera.position.z = 10;

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'keydown', onkeydown, false);

animate();

function animate() {
    requestAnimationFrame( animate );
    
    render();
}

function render(){
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}// resize window

function onDocumentMouseDown(event) {
    //event.preventDefault();
  
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    let intersects = raycaster.intersectObjects(objects);

    
    if(intersects.length > 0){
        if(selected == null){
            selected = intersects[0].object;
            for(let i = 0; i < objects.length; i++){
                if(selected.id == objects[i].id){
                    activeSkirt = i;
                    break;
                }
            }
            skirts[activeSkirt].visible = true;
           if(selected.children.length > 0){
               
               
           }
        }else{
            if(selected.id == intersects[0].object.id){
                selected = null;
                skirts[activeSkirt].visible = false;
            }else{
                skirts[activeSkirt].visible = false;


                selected = intersects[0].object;
                for(let i = 0; i < objects.length; i++){
                    if(selected.id == objects[i].id){
                        activeSkirt = i;
                        break;
                    }
                }
                skirts[activeSkirt].visible = true;
            }
        }
        
    }else{
        if(selected != null){
            selected = null;
            skirts[activeSkirt].visible = false;
            activeSkirt = null;
        }
    }
    
   
    
} // select obj with mouse click

function onDocumentMouseMove(e) {
    
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    let intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0){
        if(hovered == null){
            hovered = intersects[0].object;
            for(let i = 0; i < objects.length; i++){
                if(hovered.id == objects[i].id){
                    hoveredSkirt = i;
                    break;
                }
            }
            skirts[hoveredSkirt].visible = true;
        }
    }else{
        if(activeSkirt == null && hoveredSkirt != null){
            hovered = null;
            skirts[hoveredSkirt].visible = false;
            hoveredSkirt = null;
        }
        
    }
}   // hover obj with mouse 


function createSkirt(m, o, reArr){
    let offset = 0;
    if(o == undefined){
        offset = 0.2;
    }else{
        offset = o;
    }
     
    let box = new THREE.Box3();
    box.setFromObject(m);
    let tempObj = {
        bb: box,
        id: m.id
    }

    if(reArr != null){
        reArr.push(tempObj);
    }
   
    var arround = new THREE.Shape();
        arround.moveTo(box.min.x - offset, box.max.z + offset);
        arround.lineTo(box.max.x + offset, box.max.z + offset);
        arround.lineTo(box.max.x + offset, box.min.z - offset);
        arround.lineTo(box.min.x - offset, box.min.z - offset);
        arround.lineTo(box.min.x - offset, box.max.z + offset);

    
    var hole = new THREE.Shape();
        hole.moveTo(box.min.x, box.max.z);
        hole.lineTo(box.max.x, box.max.z);
        hole.lineTo(box.max.x, box.min.z);
        hole.lineTo(box.min.x, box.min.z);
        hole.lineTo(box.min.x, box.max.z);
    
    arround.holes.push(hole);
        
    var geometry = new THREE.ShapeGeometry( arround );
    var material = new THREE.MeshBasicMaterial( { color: m.material.color, side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material ) ;
    m.add(mesh);
    mesh.position.set(-m.position.x,-m.position.y,-m.position.z);
    mesh.rotation.x = Math.PI/2;
    mesh.visible = false;

    return mesh;
}

function addTo(){
    cube.add(cube2);
}

function move(){
    cube.position.x += 1;
}