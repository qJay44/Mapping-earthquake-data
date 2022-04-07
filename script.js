///////////////////////////////////////////////////////////////////////////////////////
//                                      Preload part

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;


// 48.1081466, 19.4905364
const lon = 48.1081466;
const lat = 11.4905364;
const img = new Image();

const mapProp = {
    url         : 'https://api.mapbox.com/styles/v1/mapbox/',
    style       : 'dark-v10',
    token       : token,
    lon         : 0,
    lat         : 0,
    zoom        : 1,
    bearing     : 0,
    pitch       : 0,
    width       : 1280,
    height      : 720
}

const c_lon = 0;
const c_lat = 0;

function main() {
    update_src();

    let cx = mercX(c_lon);
    let cy = mercY(c_lat);

    let x = mercX(lon) - cx;
    let y = mercY(lat) - cy;

    ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2);
    ctx.fillStyle = 'hsla(255, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
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
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// world 'x' coordinate
function mercX(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = (256 / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = (numRad + Math.PI);

    return part1 * part2;
}

// world 'y' coordinate
function mercY(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = (256 / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = Math.PI - Math.log(Math.tan(Math.PI / 4 + numRad / 2));

    return part1 * part2;
}

main();