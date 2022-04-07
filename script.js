///////////////////////////////////////////////////////////////////////////////////////
//                                      Preload part

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;


// 31.2304° N, 121.4737° E
const lat = 31.2304;
const lon = 121.4737;
const img = new Image();

const mapProp = {
    url         : 'https://api.mapbox.com/styles/v1/mapbox/',
    style       : 'dark-v10',
    tilesize    : 512,
    token       : token,
    lon         : 0,
    lat         : 0,
    zoom        : 1,
    bearing     : 0,
    pitch       : 0,
    width       : 1280,
    height      : 720
}

const scaleW = mapProp.width / 512 / 2;
const scaleH = mapProp.height / 512 / 2;

const c_lon = 0;
const c_lat = 0;

function main() {
    update_src();

    let cx = mercX(c_lon) + (w - mapProp.width) / 2;
    let cy = mercY(c_lat) + (h - mapProp.height) / 2;

    let x = mercX(lon) - cx;
    let y = mercY(lat) - cy;

    console.log(x);

    // ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2);
    ctx.fillStyle = 'hsla(255, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'hsla(210, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();


    // grid
    ctx.strokeStyle = 'hsla(0, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = 'hsla(0, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = 'hsla(0, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.moveTo((w - mapProp.width) / 2, 0);
    ctx.lineTo((w - mapProp.width) / 2, h);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = 'hsla(0, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.moveTo((w + mapProp.width) / 2, 0);
    ctx.lineTo((w + mapProp.width) / 2, h);
    ctx.stroke();
    ctx.closePath();
}

// when window resizing
window.onresize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, w, h);
    update_src();
    ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2);
}

// loading map

// updating map
function update_src() {
    img.src = `${mapProp.url}${mapProp.style}/static/${mapProp.lon},${mapProp.lat},${mapProp.zoom},${mapProp.bearing},${mapProp.pitch}/${mapProp.width}x${mapProp.height}?access_token=${mapProp.token}`
}

///////////////////////////////////////////////////////////////////////////////////////

// converting degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// world 'x' coordinate
function mercX(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((mapProp.tilesize * scaleW) / (2 * Math.PI)) * Math.pow(2, mapProp.zoom);
    const part2 = (numRad + Math.PI);

    return part1 * part2;
}

// world 'y' coordinate
function mercY(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((mapProp.tilesize * scaleH) / (2 * Math.PI)) * Math.pow(2, mapProp.zoom);
    const part2 = Math.PI - Math.log(Math.tan(Math.PI / 4 + numRad / 2));

    return part1 * part2;
}

main();
