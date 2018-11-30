
function Cat(name,speed,imgPack,canvas){
    this.name =  name || 'v';
    this.speed = speed || 0.5;
    this.startTime = new Date() - 0;
    this.imgPack = imgPack || [] ;
    this.ctx = document.getElementById('cat').getContext('2d') || canvas.getContext('2d');
    this.canvas = document.getElementById('cat');
    //this.rainbowP = this.initRainbowPiece(24);
    this.rainbow = this.initAllRainBow(120);
}
Cat.prototype = {
    //展示第几帧
    _drawImg(image){
        if(!image){
            return false;
        }
        var imgWidth = image.width;
        var imgHeight = image.height;
        var positionX = this.canvas.width/2 - imgWidth/2;
        var positionY = this.canvas.height/2 - imgHeight/2;
        this.ctx.drawImage(image,positionX,positionY)
    },
    animate(delta){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        //delta时间在在运行良好的时候接近13.3ms  真实时间片
        var allTime = this.speed * this.imgPack.length * 1000;//所有帧运行一个循环所需的时间 ms 这里正好1000
        var duration = (new Date()-0) - this.startTime;//距离对象创建的时间
        var singleLoopTime = duration % allTime;//在当前循环下的时间
        var imgClipNum  = Math.floor(singleLoopTime / (this.speed * 1000));
        var showTime = this.speed * 1000;//每一帧要展示的时间
        var imgPack = this.imgPack;
        var imgToShow = imgPack[imgClipNum];
        this._drawImg(imgToShow);
        if(this.rainbow){
            var rainbows = this.rainbow.children;
            var xDistance = rainbows[0].position.x - rainbows[rainbows.length-1].position.x;
            for(var x = 0 ; x < rainbows.length; x++){
                var SingleRainbow = rainbows[x];
                SingleRainbow.position.y =Math.sin((SingleRainbow.position.x + singleLoopTime/1000*(Math.PI*2))*2*(1/(this.speed*this.imgPack.length)))/5;
            }
        }
    },
    //init6colorsrainBow width:1 height:6 90deg camera;
    initRainbow(){
        var points;
        var positions = [];
        var colors = [1.0,0.0,0.0,
            1.0,0.5,0.0,
            1.0,1.0,0.0,
            0.0,1.0,0.0,
            0.0,1.0,1.0,
            0.0,0.0,1.0];
        for(var i = 0 ; i < 6 ; i++){
            var x = 0;
            var y = (3-(i+1)+0.5)/(2);
            var z = 0;
            positions.push(x,y,z);
        }
        var PointsGeometry = new THREE.BufferGeometry();
        PointsGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        PointsGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ));
        var material = new THREE.PointsMaterial( { size: 0.52, vertexColors: THREE.VertexColors } );
        points = new THREE.Points( PointsGeometry, material );
        return points;
    },
    /*initRainbowPiece(length){
        var points;
        var positions = [];
        var colors = [1.0,0.0,0.0,
            1.0,0.5,0.0,
            1.0,1.0,0.0,
            0.0,1.0,0.0,
            0.0,1.0,1.0,
            0.0,0.0,1.0];
        var colors2 = [];
        for(var i = 0 ; i < 6 ; i++){
            var x = 0;
            var y = (3-(i+1)+0.5)/2;
            var z = 0;
            for(var j = 0 ; j < length; j++){
                x = (length/2-(j+1)+0.5)/2;
                colors2.push(colors[i*3]);
                colors2.push(colors[i*3+1]);
                colors2.push(colors[i*3+2]);
                positions.push(x,y,z);
            }
        }
        console.log(positions);
        var PointsGeometry = new THREE.BufferGeometry();
        PointsGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        PointsGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors2, 3 ));
        var material = new THREE.PointsMaterial( { size: .51, vertexColors: THREE.VertexColors } );
        points = new THREE.Points( PointsGeometry, material );
        return points;
    },*/
    initAllRainBow(num){
        var p = this.initRainbow();
        var rainBowGroup = new THREE.Group();
        for(var i = 0 ; i < num ; i++){
            var x = ((num/2)-(i+1)+0.5)/2;
            var y = Math.sin(x)*0.2;
            var SingleRainbow = p.clone();
            SingleRainbow.position.set(x,y,0);
            rainBowGroup.add(SingleRainbow);
        }
        rainBowGroup.name = 'rainbow';
        rainBowGroup.position.x = -30.25;
        return rainBowGroup;
    }
};
function Background(name,speed){
    this.name = name || 'background';
    this.speed = speed || 0.5;
    this.startTime = new Date();
    this.points = this._initBackground();
}
Background.prototype = {
    //生成一个简单的背景1k随机点 x(-50~50) y(-50~50) z(-50~6)
    _initBackground:function(){
        var colors = [];
        var positions = [];

        for(var i = 0 ; i < 1000 ; i++){
            //生成随机位置
            var x = Math.random()*100 - 50;
            var y = Math.random()*100 - 50;
            var z = -Math.random()*56 + 6;
            positions.push(x,y,z);
            //随机颜色
            var r = Math.random();
            var g = Math.random();
            var b = Math.random();
            colors.push(r,g,b);
        }
        var PointsGeometry = new THREE.BufferGeometry();
        PointsGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        PointsGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ));
        var material = new THREE.PointsMaterial( { size: .51, vertexColors: THREE.VertexColors } );
        var points = new THREE.Points( PointsGeometry, material );
        var PointsGroup = new THREE.Group();
        for(var z = 0 ; z < 20; z ++){
            var clonedPoints = points.clone();
            clonedPoints.position.x = (10-z)*50;
            PointsGroup.add(clonedPoints);
        }
        return PointsGroup;
    }
}

;(function(undefined){
    'use strict';
    var _global;
    var renderer,scene,light,camera,manager,imgLoader,musicShape;
    var imgArr = [];
    var show = {
        renderer:renderer,
        scene:scene,
        light:light,
        camera:camera,
        manager:manager,
        imgLoader:imgLoader,
        imgArr:imgArr,
        musicShape:musicShape,
        cat:new THREE.Sprite(),
        init:function(){
            var canvas = document.getElementById('stage');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            //初始化three的加载器
            manager = initLoadingManager();
            imgLoader = initImgLoader(manager);
            this.scene = initScene();
            this.renderer = initRenderer();
            this.camera = initCamera();
            this.light = initLight();

            //引用加载器
            this.manager = manager;
            this.imgLoader = imgLoader;

            this.musicShape = initObjs();
            initTest();
            //this.camera.lookAt(scene.position);

            //var axes = new THREE.AxesHelper(20);

            var catSprite = initCat();
            catSprite.scale.set(11,11,1);
            this.cat = catSprite;
            catSprite.position.set(1,0,0);
            scene.add(catSprite);
            //scene.add(axes);
            //addControler();
        },
        render:function(){
            renderer.render(scene,camera)
        },
        //获取单个图片并且返回图片对象
        getImg(url,target,index){
            var that = this;
            that.imgLoader.load(
                url,
                function(image){
                    //加载完成之后将图片添加进去
                    if(typeof(index) === 'undefined'){
                        console.log('此处的加载需要提供索引');
                        return false;
                    }
                    target[index] = image;
                },
                undefined,
                function(){
                    console.log('加载'+url+'失败，原因是:我也不知道。。。');
                }
            )
        },
        LoadAllImgs(srcArr,tempSpace){
            var imgArr = [];
            for(var i = 0 ; i < srcArr.length;i++){
                var imgSrc = srcArr[i];
                //var img = this.getImg(imgSrc);
                this.getImg(imgSrc,tempSpace,i)
            }
        }
    };
    function initTest(){
        //scene.add(points2);
        var cubeG = new THREE.BoxGeometry(1,1,1);
        var CubeMaterial = new THREE.MeshPhongMaterial({
            color:0xff0000,
            transparent:true,
            opacity:0.5
        })
        var cube = new THREE.Mesh(cubeG,CubeMaterial);
        cube.position.z = -0.5;
        //scene.add(cube);

    }
    function initLoadingManager(){
        var manager = new THREE.LoadingManager();
        manager.onStart = function(url, itemsLoaded, itemsTotal){
            console.log('开始加载文件：'+url+'，在'+itemsTotal+'中已经加载完成的文件:'+itemsLoaded);
        };
        manager.onLoad = function(){
            console.log('所有文件加载完毕')
        };
        manager.onProgress = function(url,itemsLoaded,itemsTotal){
            console.log('正在加载文件:'+url+'，已完成：'+Math.round(itemsLoaded*100/itemsTotal)+'%')
        };
        manager.onError = function(url){
            console.log('加载过程中出现失败，加载失败的文件是'+url);
        };
        return manager;
    }
    function initImgLoader(manager){
        var loader = new THREE.ImageLoader(manager);
        return loader;
    }
    function initScene(){
        scene = new THREE.Scene();
        return scene;
    }
    function initRenderer(){
        renderer = new THREE.WebGLRenderer({antialias:true,canvas:document.getElementById('stage')});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setClearColor(0xffffff);
        return renderer;
    }
    function initCamera(){
        camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,200);
        camera.position.set(2,0,9);
        if(!IsPC()){
            camera.position.x = 6;
            camera.position.z = 9;
            console.log('手机')
        }
        camera.lookAt(scene.position);
        return camera;
    }
    function initLight(){
        scene.add(new THREE.AmbientLight(0x444444));
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-20, 30, 30);

        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;
        light.shadow.camera.left = -10;
        light.shadow.camera.right = 10;

        light.castShadow = true;

        scene.add(light);
        return light;
    }
    function initObjs(){//此函数生成一个会根据声音来改变形状或者位置的形状组
        var group = new THREE.Group();
        for(var i = 0 ; i < 128 ; i++){
            var cubeG = new THREE.BoxGeometry(0.1,0.1,0.1);
            var cubeM = new THREE.MeshPhongMaterial({color:0xff00ff})
            var cube = new THREE.Mesh(cubeG,cubeM);
            var x = (64-i)*(20/128) - 5;
            var y = -3;
            var z = 2;
            cube.position.set(x,y,z);
            group.add(cube);
        }
        var transparentCubeG = new THREE.BoxGeometry(20,10,0.2);
        var transparentCubeM = new THREE.MeshBasicMaterial({
            color:0xffffff,
            transparent:true,
            opacity:1,
        })
        var transparentCube = new THREE.Mesh(transparentCubeG,transparentCubeM);
        transparentCube.position.set(0,-8,2);
        //group.add(transparentCube);
        //scene.add(group);
        return group;
    }
    function initCat(canvas){
        canvas = canvas || document.getElementById('cat');
        if(canvas){
            var spriteMaterial = new THREE.SpriteMaterial({
                map:new THREE.CanvasTexture(canvas),
            });
            return new THREE.Sprite(spriteMaterial);
        }else{
            console.log('nothing will init')
        }
    }
    _global = (function(){return this || (0,eval)('this')}());
    if(typeof module !== 'undefined' && module.exports){
        module.exports = show;
    }else if(typeof define === 'function' && define.amd){
        define(function(){return show});
    }else{
        !('plugin' in _global) && (_global.show = show);
    }
}());
show.init();
var cats = {
    v:getCatsImgs('nyan'),
    original:getCatsImgs('original'),
    technyan:getCatsImgs('technyancolor')
}

function getCatsImgs(name){
    var technyancolor00;
    var arr = [];
    for(var x = 0 ;x < 12 ; x++){
        var str = 'imgs/nyan/'+name+'0'+x+'.png';
        if(x>=10){str = 'imgs/nyan/'+name+x+'.png'};
        arr.push(str);
    }
    return arr;
}

var delta = new Date() - 0;
var cat = new Cat('v2',1/12);

show.LoadAllImgs(cats.v,
    cat.imgPack);

var bg = new Background('BG',1);
console.log(bg.points);

var mv = new Musicvisualizer({
    size:128,
    draw:function(){
    }
})
mv.play('https://towrabbit.oss-cn-beijing.aliyuncs.com/three/media/vday.ogg');

function loop(){
    var now = new Date() - 0;
    var d = (now - delta)/(1000/60);
    delta = now;
    update(d);//数据层更新
    render();
    //将渲染层的更新放在这
    requestAnimationFrame(loop);
}
function render(){
    show.renderer.render(show.scene,show.camera);
    //requestAnimationFrame(render);
}
function update(deltaTime){
    var arr = mv.getFrequencyArr();
    var max = 1;
    for(var i = 15 ; i < show.musicShape.children.length; i++){
        var currentValue = arr[i];
        if(currentValue > max){max = currentValue};
        //var percent = currentValue/256;
        //var y = percent*10+1;
        //show.musicShape.children[i-15].scale.y = y;
        //show.musicShape.children[i-15].position.y = y-5;
    }
    var p = max/256;
    cat.rainbow.scale.y = p*0.5+1;
    show.cat.scale.x = p*5+11;
    show.cat.scale.y = p*5+11;
    bg.points.position.x -= 0.16*deltaTime*bg.speed;
    if(bg.points.position.x<=-400){
        bg.points.position.x +=700;
    }
    cat.animate();
    show.cat.material.map.needsUpdate = true;
    //此处deltaTime真实事件片段 在60帧的时候接近13.3ms
}
window.onload = function(){
    addControler();
    console.log(cat.imgPack);
    //cat._drawImg(cat.imgPack[0]);
    document.getElementById('stage').addEventListener('mousedown',function(){
        console.log('yes?')
        //playmusic();
    });
    show.scene.add(bg.points);
    show.scene.add(cat.rainbow);
    loop();
};
function addControler(){
    var controls;
    controls = new THREE.OrbitControls( show.camera, show.renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2;
}
function IsPC(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}
function playmusic(){
    var media = document.getElementById('music');
    console.log('mousedown'+media.paused);
    if(media && media.paused){
        media.play();
        console.log('play');
    }
}
var catType = 0;
function changeCat(){
    catType = catType+=1;
    if(catType >= 3){
        catType = 0;
    }
    var catname = '';
    switch(catType){
        case 0:
            catname = 'v';
            show.cat.scale.set(11,11,1);
            mv.play('http://towrabbit.oss-cn-beijing.aliyuncs.com/three/media/vday.ogg');
            cat.speed = 1/12;
            bg.speed = 1;
            break;
        case 1:
            catname = 'original';
            show.cat.scale.set(11,11,1);
            mv.play('http://towrabbit.oss-cn-beijing.aliyuncs.com/three/media/original.ogg')
            cat.speed = 1/14;
            bg.speed = 14/12;
            break;
        case 2:
            catname = 'technyan';
            show.cat.scale.set(12,12,1);
            mv.play('http://towrabbit.oss-cn-beijing.aliyuncs.com/three/media/technyancolor.mp3')
            cat.speed = 1/18;
            bg.speed = 18/12;
            break;
    }
    show.LoadAllImgs(cats[catname],cat.imgPack);
}