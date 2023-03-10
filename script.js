const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);



(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;

function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || "#191D4C";
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;
    
    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

var entities = [];

// init the stars
for (var i = 0; i < height; i++) {
    entities.push(new Star({
        x: Math.random() * width,
        y: Math.random() * height
    }));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({mHeight : (height/2)-120}));
entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : "rgb(17,20,40)", mHeight : (height/2)-60}));
entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : "rgb(10,10,5)", mHeight : height/2}));

//animate background
function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}
animate();



//MUSIC

// khai b??o h???ng, m???ng mp3
const audio = $('#audio')
const back = $("#back-btn")
const play = $('#play-btn')
const pause = $('#pause-btn')
const next = $("#next-btn")
const nameSong = $$(".name-music")
const nameHead = $(".head")
const nameSinger = $(".singer-name")
const photo = $("#img")
const playList = [
    {
        src:"./mp3/EmDenTuDau.mp3",
        nameSong:"Em ?????n T??? ????u",
        singer:"C?? N??u",
        img: "https://i.ytimg.com/vi/XljPb9Wmw6c/maxresdefault.jpg"
    },
    {
        src:"./mp3/YeuTuDauMaRa.mp3",
        nameSong:"Y??u T??? ????u M?? Ra ",
        singer: "Lil Zpoet",
        img: "https://i.ytimg.com/vi/EUGjrBnrheM/maxresdefault.jpg"
    },
    {
        src:"./mp3/CuNoiYeuLanNay.mp3",
        nameSong:" C??? N??i Y??u L???n N??y ",
        singer: "Lil Zpoet",
        img: "https://i.ytimg.com/vi/faK_x9Xc3gs/maxresdefault.jpg"
    },
    {
        src:"./mp3/FIRSTDATE.mp3",
        nameSong:"FIRTSDATE",
        singer: "DPee x Zuz",
        img: "https://i.ytimg.com/vi/ixBPvyV-UCk/maxresdefault.jpg"
    },
    {
        src:"./mp3/MotNguoiViEm.mp3",
        nameSong: "Mot Nguoi Vi Em ",
        singer: "WEAN",
        img: "https://i.ytimg.com/vi/vS85YUO2dX4/hq720.jpg"
    },
    {
        src:"./mp3/YeuVaYeu.mp3",
        nameSong:"Y??u V?? Y??u",
        singer: "PZ.AKA.PZBOI",
        img: "https://i.ytimg.com/vi/Qes1ctquHIY/hq720.jpg"

    },
    {
        src:"./mp3/CherryLove.mp3",
        nameSong: "Cherry Love",
        singer: "H??u",
        img: "https://i.ytimg.com/vi/Zl6zJyTzU6A/maxresdefault.jpg"
    },
    {
        src:"./mp3/Matchanah.mp3",
        nameSong:" Matchanah ",
        singer: "H??u x B??u",
        img: "https://i.ytimg.com/vi/WJZcNMGIbiE/maxresdefault.jpg"
    },
    {
        src:"./mp3/ChoAnhMotChutHyVong.mp3",
        nameSong: "Cho Anh M???t Ch??t Hy V???ng",
        singer: "Haukong ft. Flymingo x AnhVu", 
        img: "https://i.ytimg.com/vi/Ldd-f7u1nhU/maxresdefault.jpg"
    },
    {
        src:"./mp3/ChacLaSayOi.mp3",
        nameSong: "Ch???c L?? Say ??i",
        singer: "RIGHT",
        img: "https://i.ytimg.com/vi/-wf6-VmjNR8/maxresdefault.jpg"
    },
    {
        src:"./mp3/TaiViSao.mp3",
        nameSong: "T???i V?? Sao",
        singer: "MCK",
        img: "https://i.ytimg.com/vi/U0Vr1zotKIo/maxresdefault.jpg"
    },
    {
        src:"./mp3/SaoEmKhongRep.mp3",
        nameSong:" Sao Em Kh??ng Rep",
        singer: "DADUC X DAGIAM",
        img: "https://i.ytimg.com/vi/aiPs07XT0wU/maxresdefault.jpg"

    },
    {
        src:"./mp3/SARANGHAEYO.mp3",
        nameSong:"Saranghaeyo",
        singer: "BIGP x CH??C H???",
        img: "https://i.ytimg.com/vi/Eh1lZ-iEMSQ/maxresdefault.jpg"

    },
    {
        src:"./mp3/EmKhongMuonVeNha.mp3",
        nameSong:" Em Kh??ng Mu???n V??? Nh??",
        singer: "D??A H???U",
        img: "https://i.ytimg.com/vi/D6AGIFRp5S8/maxresdefault.jpg"

    },
    {
        src:"./mp3/TinhKaNgotNgao.mp3",
        nameSong:"T??nh Ka Ng???t Ng??o",
        singer: "L???P NGUY??N x Y???N N???I C??M ??I???N",
        img: "https://i.ytimg.com/vi/Yr7FIIshNxo/maxresdefault.jpg"

    },
    {
        src:"./mp3/EmDaoNay.mp3",
        nameSong: " Em D???o N??y",
        singer: "Ng???t",
        img: "https://i.ytimg.com/vi/0o5MiQ9W6M8/maxresdefault.jpg"
    },
    {
        src:"./mp3/YeuNhuTreCon.mp3",
        nameSong:"Y??u Nh?? Tr??? Con",
        singer: "Bray",
        img: "https://i.ytimg.com/vi/OtnQyqb6-nM/maxresdefault.jpg"
    },
    {
        src:"./mp3/OngBaAnh.mp3",
        nameSong:"??ng B?? Anh",
        singer: "L?? Thi???n Hi???u",
        img: "https://i.ytimg.com/vi/kcFAMZyq07E/maxresdefault.jpg"
    },
    {
        src:"./mp3/ChungTaCuaSauNay.mp3",
        nameSong:" Ch??ng Ta C???a Sau N??y",
        singer: "T.R.I",
        img: "https://avatar-ex-swe.nixcdn.com/song/share/2021/01/27/f/1/e/c/1611738359456.jpg"
    },
    {
        src:"./mp3/GoiChoAnhDiBae.mp3",
        nameSong:"G???i Cho Anh ??i Bae",
        singer: "KHOA Ft. Freakyt",
        img: "https://i.ytimg.com/vi/qqpND_WB7Q8/maxresdefault.jpg"
    },
    
    
]

const textclip = $(".text-box")

function audioPlay(){
    audio.play();
    play.style.display = 'none'
    pause.style.display = 'block'
    textclip.classList.add("move")
    nameHead.textContent = playList[i].nameSong
}


function audioPause(){
    audio.pause();
    pause.style.display = 'none'
    play.style.display = 'block'
    textclip.classList.remove("move")
}

function audioNext(){
    i++;
    if( i >= playList.length ){
        i = 0;
    } 
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    nameHead.textContent = playList[i].nameSong
    textclip.classList.add("move")
    audioPlay();
}

function audioBack(){
    i--;
    if( i < 0 ){
        i = playList.length -1 ;
    }
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img
    nameHead.textContent = playList[i].nameSong
    textclip.classList.add("move")
    audioPlay();
}



play.addEventListener("click", audioPlay);// click play
pause.addEventListener("click", audioPause); //click pause

// x??? l?? next / back mp3
var i = 0;
    audio.src = playList[i].src
    nameSinger.textContent = playList[i].singer
    for( let j = 0 ; j < nameSong.length; j++){
        nameSong[j].textContent = playList[i].nameSong
    }
    photo.src = playList[i].img


    // x??? l?? ???n ph??m Space, Left, Right ( Play/Pause, Back, Next)
    function keydownHandler(evt) {
        if( audio.paused && evt.keyCode == 32){
            audioPlay();
        }
        else if(audio.play && evt.keyCode == 32){
            audioPause();
        };
        if (evt.keyCode == 39){
            audioNext();
        }
        else if (evt.keyCode == 37){
            audioBack();
        }
    }


    next.addEventListener("click", audioNext);// click next
    back.addEventListener("click", audioBack); // click back

    // next khi k???t th??c  mp3
    audio.onended = function(){
        next.click();
    }


 
    // random link mp3
    // function random() {
    
    // var ran = Math.floor(Math.random() * 3);
    // var src = playList[ran]
    // console.log(src)
    // audio.src= src;
    // }
   