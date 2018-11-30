function Musicvisualizer(obj){
    this.source = null;
    this.count = 0 ;

    this.analyser = Musicvisualizer.ac.createAnalyser();
    console.log(this.analyser);
    this.size = obj.size;
    this.analyser.fftSize = this.size * 2;

    this.gainNode = Musicvisualizer.ac[Musicvisualizer.ac.createGain?"createGain":"createGainNode"]();
    this.gainNode.connect(Musicvisualizer.ac.destination);

    this.analyser.connect(this.gainNode);

    this.xhr = new XMLHttpRequest();
    this.draw = obj.draw;
    this.tempMusicList = [];
    this.singleArrayBuffer = new ArrayBuffer()
    //this.visualize();

}
Musicvisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();

// 解决 Chrome 66之后高版本中AudioContext被强行suspend的问题
if(typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined'){
    var resumeAudio = function(){
        if(typeof Musicvisualizer.ac === 'undefined' || Musicvisualizer.ac == null)return;
        if(Musicvisualizer.ac.state === 'suspended')Musicvisualizer.ac.resume();
        document.removeEventListener('click',resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
}
var u8arr;
//异步获取  将得到的的ir内容传给回调函数作为其中一个参数
Musicvisualizer.prototype.load = function(url,fun){
    console.log('开始加载音乐');
    this.xhr.abort();
    this.xhr.open('GET',url);
    this.xhr.responseType = 'arraybuffer';
    var self = this;
    //arraybuffer无法用普通的方式存储-。- 转字符串卡
    this.xhr.onload = function(){
        console.log('finishedLoading+'+url);
        fun(self.xhr.response,url);
        console.log('finished loading music');
    }
    var index = checkHas(url,this.tempMusicList);
    console.log(index);
    if(index || index === 0){
        console.log('启用缓存'+index);
        var arrayBuffer = self.tempMusicList[index].bufferSource.buffer;
        console.log(arrayBuffer);
        fun(arrayBuffer);
    }else{
        console.log('发送ajax');
        this.xhr.send();
    }
    function checkHas(url,arr){
        for(var i = 0 ; i < arr.length; i++){
            if(arr[i].url === url){
                return i;
            }
        }
        return false;
    }
    function ab2str(buf) {
        // 注意，如果是大型二进制数组，为了避免溢出，
        // 必须一个一个字符地转
        if (buf && buf.byteLength < 1024) {
            return String.fromCharCode.apply(null, new Uint8Array(buf));
        }
        const bufView = new Uint8Array(buf);
        const len =  bufView.length;
        const bstr = new Array(len);
        for (let i = 0; i < len; i++) {
            bstr[i] = String.fromCharCode.call(null, bufView[i]);
        }
        return bstr.join('');
    }

    function str2ab(str) {
        const buf = new ArrayBuffer(str.length * 2);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}

Musicvisualizer.prototype.decode = function(arraybuffer,fun){
    Musicvisualizer.ac.decodeAudioData(arraybuffer,function(buffer){
        fun(buffer);
    },function(err){
        console.log(err);
    });
}

Musicvisualizer.prototype.play = function(path){
    var n = ++this.count;
    var self = this;
    self.source && self.source[self.source.stop ? 'stop':'noteOff']();
    if(path instanceof ArrayBuffer){
        self.decode(path,function(buffer){
            if(n!=self.count)return;
            var bufferSource = Musicvisualizer.ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.loop = true;
            bufferSource.connect(self.analyser);
            bufferSource[bufferSource.start?'start':'noteOn'](0);
            self.source = bufferSource;
        })
    }
    else{
        self.load(path,function(arraybuffer,url){
            if(n!=self.count)return;
            var index =  checkHas(path,self.tempMusicList);
            console.log(index);
            if(index || index === 0){
                console.log('启用缓存');
                var bufferSource = Musicvisualizer.ac.createBufferSource();
                bufferSource.buffer = self.tempMusicList[index].bufferSource.buffer;
                bufferSource.loop = true;
                self.source = bufferSource;
                bufferSource.connect(self.analyser);

                bufferSource[bufferSource.start?'start':'noteOn'](0);
            }else{
                self.decode(arraybuffer,function(buffer){
                    if(n!=self.count)return;
                    var bufferSource = Musicvisualizer.ac.createBufferSource();
                    bufferSource.buffer = buffer;
                    bufferSource.loop = true;
                    bufferSource.connect(self.analyser);
                    bufferSource[bufferSource.start?'start':'noteOn'](0);
                    self.source = bufferSource;
                    console.log('push,'+url);
                    self.tempMusicList.push({
                        url:url,
                        bufferSource:bufferSource
                    });
                });
            }
        });
    }


}
function checkHas(url,arr){
    for(var i = 0 ; i < arr.length; i++){
        if(arr[i].url === url){
            return i;
        }
    }
    return false;
}
Musicvisualizer.prototype.changeVolumn = function(percent){
    this.gainNode.gain.value = percent * percent;
}

Musicvisualizer.prototype.visualize = function(){
    var self = this;
    var arr = new Uint8Array(self.analyser.frequencyBinCount);
    requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitrequestAnimationFrame ||
        window.mozrequestAnimatioFrame;
    function animate(){
        self.analyser.getByteFrequencyData(arr);
        self.draw(arr);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
//
Musicvisualizer.prototype.getFrequencyArr = function(){
    var self = this;
    var arr = new Uint8Array(self.analyser.frequencyBinCount);
    self.analyser.getByteFrequencyData(arr);
    return arr;
}