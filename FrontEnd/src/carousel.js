
/**
 * Title: carousel.js
 * Description: subclass of ThreeJS's Object3D used to view the 3D image carousel/gallery.
 * 
 * Author: Filipe Pires
 * Date: 04/07/2021
 */

(function(window) {

    // local references
    var THREE = window.THREE, TWEEN = window.TWEEN;
    
    var self = function(radius, imagesList, width, height) {
        
        // call super
        THREE.Object3D.call(this);
        
        var scope=this;
        
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.reflectionOpacity = 0.2;
        this.reflectionHeightPer = 0.4;
        
        this.images = imagesList;
        this.howMany = 0;
        
        var l = this.images.length;
        this.anglePer = (l>0) ? 2*Math.PI/l : 0;
        
        for (var i=0; i<l; i++) {
            this.images[i].image = new Image();
            this.images[i].image.onload = function(i){ return function(){buildCarousel(scope, i);} }(i);
            this.images[i].image.src = this.images[i].url;
            // console.log(this.images[i].image.src);
        }
    };
    
    // self is subclass of Object3D
    self.prototype = Object.create(THREE.Object3D.prototype);
    
    self.prototype.constructor = self;
    
    // bring an item to front
    self.prototype.rotateToItem = function(item, callback) {
        var angle, b, ang, thiss = this;
        
        // find shortest rotation angle (modulo)
        angle = (item.carouselAngle-Math.PI/2)%(2*Math.PI);
        b = this.rotation.y%(2*Math.PI);
        
        if (b>0) {
            b = -2*Math.PI+b;
        }
        
        this.rotation.y = b;
        
        if (angle<b) {
            angle += 2*Math.PI;
        }
        
        if ((angle-b)>2*Math.PI-(angle-b)) {
            ang = b+(-(2*Math.PI-(angle-b)));
        } else {
            ang = b+(angle-b);
        }
            
        // tween it
        new TWEEN.Tween(this.rotation)
            .to({y:ang},800)
            .easing(TWEEN.Easing.Exponential.EaseInOut)
            .onComplete(function(){
                if (callback) {
                    callback.call(thiss);
                } 
            })
            .start();
    };

    // build the carousel when everything is loaded
    function buildCarousel(scope, i) {
        var img = scope.images[i];
        var size, height, text3d, textMaterial, text, textcontainer,
            texture, plane, canvas, cntx, gradient, texture2, material, reflectionPlane, 
            w = scope.width, h = scope.height, reflectH = scope.reflectionHeightPer*h, r = scope.radius, anglePer = scope.anglePer, aa;
        
        // text caption
        if (img.caption) {
            size = (0.4)*(w/img.caption.length);
            height = 2;
            text3d = new THREE.TextGeometry(img.caption,{size: size, height: height, curveSegments: 2, font:'helvetiker'});
            textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, overdraw: true });
            text = new THREE.Mesh(text3d, textMaterial);
            text.doubleSided = false;
            textcontainer = new THREE.Object3D();
            textcontainer.add(text);
        }
        
        // image plane
        texture = new THREE.Texture(img.image); 
        texture.needsUpdate = true;
        material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, overdraw: true });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 3, 3), material);
        aa = i*anglePer;
        plane.rotation.y = -aa-Math.PI/2;
        plane.position = new THREE.Vector3(r*Math.cos(aa), 0, r*Math.sin(aa));
        plane.doubleSided = true;
        plane.carouselAngle = aa;//plane.rotation.y;
        plane.scale.x = -1;
        
        if (img.caption) {
            // position text caption, relative to image plane
            textcontainer.position.x = plane.position.x;
            textcontainer.position.y = plane.position.y-size-0.5*h-5;
            textcontainer.position.z = plane.position.z;
            textcontainer.rotation.y = plane.rotation.y;
            text.scale.x = plane.scale.x;
            text.position.x = w*0.5;
        }
        
        // reflection
        
        canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = reflectH;

        cntx = canvas.getContext('2d');
        cntx.save();
        cntx.globalAlpha=scope.reflectionOpacity;
        cntx.translate(0, h-1);
        cntx.scale(1, -1);				
        cntx.drawImage(img.image, 0, 0, w, h /*,0,0,scope.w, scope.reflectionHeightPer*scope.h*/);				
        cntx.restore();
        cntx.globalCompositeOperation = "destination-out";
        
        gradient = cntx.createLinearGradient(0, 0, 0, reflectH);
        //gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
        //gradient.addColorStop(0, "rgba(255, 255, 255, " + (scope.reflectionOpacity) + ")");
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.0)");
        cntx.fillStyle = gradient;
        cntx.fillRect(0, 0, w, 2*reflectH);				
        
        texture2 = new THREE.Texture(canvas);
        texture2.needsUpdate = true;
        material = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide, transparent: true });
        reflectionplane = new THREE.Mesh(new THREE.PlaneGeometry(w,  reflectH, 3, 3), material);
        reflectionplane.rotation.y = -aa-Math.PI/2;
        reflectionplane.position = new THREE.Vector3(r*Math.cos(aa), 0, r*Math.sin(aa));
        reflectionplane.doubleSided = true;
        reflectionplane.carouselAngle = aa;
        reflectionplane.scale.x = -1;
        reflectionplane.position.y = textcontainer.position.y-10-3*size;
        
        // add them to the carousel
        scope.add(plane);
        scope.add(reflectionplane);
        if (scope.images[i].caption) {
            scope.add(textcontainer);
        }
    };
    
    // export it
    window.Carousel=self;
    
})(window);
