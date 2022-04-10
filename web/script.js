///////////////////////////////////////////////////////////////////////////////////////
//                                      Preload part

const img = document.getElementById('mapImage');
const canvas = document.querySelector('#static');
const ctx = canvas.getContext('2d');

const canvasData = document.querySelector('#data');
const ctxData = canvasData.getContext('2d');

const w = canvas.width = canvasData.width = window.innerWidth;
const h = canvas.height = canvasData.height = window.innerHeight;

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
    width       : 1280,
    height      : 720,
}

function loadMap() {
    const img = new Image();
    img.src = `${mapProp.mainURL}${mapProp.style}/static/${mapProp.lon},${mapProp.lat},${mapProp.zoom},${mapProp.bearing},${mapProp.pitch}/${mapProp.width}x${mapProp.height}?access_token=${mapProp.token}`
    img.onload = () => { ctx.drawImage(img, (w - mapProp.width) / 2, (h - mapProp.height) / 2); }
}

function colorBar() {
    const gradStartX = (w + mapProp.width) / 2 + 100;
    const gradStartY = (h + mapProp.height) / 2;
    const gradEndX = gradStartX + 50;
    const gradEndY = (h - mapProp.height) / 2;
    const gradient = ctx.createLinearGradient(gradStartX, gradStartY, gradEndX, gradEndY);
    ctx.font = '24px sans-serif';
    ctx.beginPath();

    for (let i = 0; i <= 10; i++) {
        const step = gradStartY - i * (mapProp.height / 10);

        gradient.addColorStop(i / 10, `hsl(${90 - (i * 90) / 10}, 100%, 50%, 1)`);

        // measure lines
        ctx.moveTo(gradEndX, step);
        ctx.lineTo(gradEndX + 20, step)
        ctx.stroke();

        // bar values
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${i / 10}`, gradEndX + 30, step);
    }
    
    // filling rectangle with a gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(gradStartX, gradStartY, 50, -mapProp.height);

    // rectangle border
    ctx.strokeStyle = 'white';
    ctx.rect(gradStartX, gradStartY, 50, -mapProp.height);
    ctx.stroke();
    ctx.closePath();
}

loadMap();
colorBar();

///////////////////////////////////////////////////////////////////////////////////////
//                                  Calculus part

// data visualization
function dataHandler(msg) {
    const data = msg;
    data.shift();
    
    const cx = mercX(0);
    const cy = mercY(0);

    const offsetX = mapProp.width / 2 + (w - mapProp.width) / 2;
    const offsetY = mapProp.height / 2 + (h - mapProp.height) / 2;

    // mapping data
    data.forEach(eq => {
        const lon = eq[2];
        const lat = eq[1];
        const mag = eq[4];

        const x = mercX(lon) - cx + offsetX;
        const y = mercY(lat) - cy + offsetY;
        const colorAngle = 90 - ((mag * 90) / 10); 

        ctxData.fillStyle = `hsla(${colorAngle}, 100%, 50%, 1)`;
        ctxData.beginPath();
        ctxData.arc(x, y, 1, 0, Math.PI * 2);
        ctxData.fill();
        ctxData.closePath();
    });
     
    img.src = canvasData.toDataURL('image/png');
    ctxData.clearRect(0, 0, w, h);
    img.onload = () => { img.style.opacity = 1; }
}

// converting degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// world 'x' coordinate
function mercX(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((mapProp.tilesize / 2) / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = (numRad + Math.PI);

    return part1 * part2;
}

// world 'y' coordinate
function mercY(numDeg) { 
    numRad = toRadians(numDeg);
    const part1 = ((mapProp.tilesize / 2) / Math.PI) * Math.pow(2, mapProp.zoom);
    const part2 = Math.PI - Math.log(Math.tan(Math.PI / 4 + numRad / 2));

    return part1 * part2;
}

///////////////////////////////////////////////////////////////////////////////////////
//                                   Buttons

let activeButton;

// button 'onclick' listener
function loadData(btnType) {
    if (btnType == activeButton) return;
    img.style.opacity = 0;

    activeButton = btnType;
    callPython(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${btnType}.csv`)
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
