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
    mainURL     : 'https://api.mapbox.com/styles/v1/mapbox/',
    style       : 'dark-v10',
    tilesize    : 512,
    token       : token,
    lon         : 0,
    lat         : 0,
    zoom        : 1,
    bearing     : 0,
    pitch       : 0,
    width       : 1024,
    height      : 512,
}

const tileWidth = mapProp.width / Math.floor(mapProp.width / mapProp.tilesize);
const tileHeight = mapProp.height / Math.floor(mapProp.height / mapProp.tilesize);

const c_lon = 0;
const c_lat = 0;
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv';

function main() {
    updateURL();
    const cx = mercX(c_lon);
    const cy = mercY(c_lat);

    const x = mercX(lon) - cx + mapProp.width / 2 + (w - mapProp.width) / 2;
    const y = mercY(lat) - cy + mapProp.height / 2 + (h - mapProp.height) / 2;

    ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2);
    ctx.fillStyle = 'hsla(210, 100%, 50%, 1)';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    callPython(url);
}

function dataHandler() {
    let data = msg;
    let header = data.shift();
    console.log(header);
}


// when window resizing
window.onresize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, w, h);
    updateURL();
    ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2);
}

// updating map
function updateURL() {
    img.src = `${mapProp.mainURL}${mapProp.style}/static/${mapProp.lon},${mapProp.lat},${mapProp.zoom},${mapProp.bearing},${mapProp.pitch}/${mapProp.width}x${mapProp.height}?access_token=${mapProp.token}`
}

///////////////////////////////////////////////////////////////////////////////////////
//                                          Calculus part

// converting degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// world 'x' coordinate
function mercX(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((tileWidth / 2) / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = (numRad + Math.PI);

    return part1 * part2;
}

// world 'y' coordinate
function mercY(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((tileHeight / 2) / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = Math.PI - Math.log(Math.tan(Math.PI / 4 + numRad / 2));

    return part1 * part2;
}

///////////////////////////////////////////////////////////////////////////////////////
//                                  Python call

// Sending the url to the Python
async function callPython(url) {
    await eel.fromJS(url);
}

// Receiving a message from the Python
eel.expose(toJS)
function toJS(msg) {
    dataHandler(msg);
}

///////////////////////////////////////////////////////////////////////////////////////

main();
