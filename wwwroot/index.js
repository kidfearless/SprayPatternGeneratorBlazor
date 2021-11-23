/**
 *
 *
 * @param {number} seed
 * @return {number} 
 */
async function createGenerator(seed)
{
	return await DotNet.invokeMethodAsync("SprayPatternGeneratorBlazor", "CreateGenerator", seed);
}

/**
 * 
 * 
 * @param {number} seed
 * 
 * @return {number}
 */
async function getRandomDouble(id)
{
	return await DotNet.invokeMethodAsync("SprayPatternGeneratorBlazor", "GetRandomDouble", id);
}

/**
 * 
 * 
 * @param {number} seed
 * @param {number} length
 * 
 * @return {number[]}
 */
async function getRandomDoubleArray(id, length)
{
	return await DotNet.invokeMethodAsync("SprayPatternGeneratorBlazor", "GetRandomDoubleArray", id, length);
}
/**
 *
 *
 * @param {number} seed
 */
function dispose(id)
{
	DotNet.invokeMethodAsync("SprayPatternGeneratorBlazor", "Dispose", id);
}


const CONE_ANGLE = 270.0;
const ITERATIONS = 1000;
const ARR_LENGTH = 30;
const SEED_START = 0;
let rootElement;

globalThis.Init = async function Init()
{
	clearDom();
	createDom();

	for (let i = SEED_START; i < SEED_START + ITERATIONS; i++)
	{
		createGenerator(i).then((val) => generateSprayPattern(val, i));
	}
	console.log(rand);
};

function clearDom()
{
	// #app
	document.body.firstElementChild.remove();
	// #blazor-error-ui
	document.body.firstElementChild.remove();
}

function createDom()
{
	rootElement = document.createElement("div");
	document.body.appendChild(rootElement);
}

/**
 * 
 * @param {number} id 
 */
function generateSprayPattern(id, seed)
{
	getRandomDoubleArray(id, ARR_LENGTH).then((val) => buildElements(val, seed));
}

/**
 *
 *
 * @param {Array<number>} arr
 */
function buildElements(arr, seed)
{
	let span = document.createElement("span");
	let canvas = document.createElement("canvas");
	let width = canvas.width = 512;
	let height = canvas.height = 512;

	rootElement.appendChild(span);
	span.innerText = seed.toString();
	span.appendChild(canvas);
	
	let ctx = canvas.getContext("2d");
	let x = width / 2;
	let y = height / 2;
	
	// set the fill style to be red in hexadecimal
	let magnitude = 8;

	let lastAngle = 0;
	for (let i = 0; i < arr.length; i++)
	{
		ctx.beginPath();
		ctx.moveTo(x, y);
		if(i == 0)
		{
			ctx.strokeStyle = "#ff0000";
		}
		else if (i == arr.length - 1)
		{
			ctx.strokeStyle = "#00ff00";
		}
		else
		{
			ctx.strokeStyle = "#000000";
		}


		let angle = arr[i];

		if (i > 0)
		{
			let pathangle = lastAngle;

			let min = pathangle - (120 * Math.PI / 180);
			let max = pathangle + (120 * Math.PI / 180);

			angle = scale(angle, min, max);
			angle = angle % (Math.PI * 2);

			if(angle >= Math.PI * 1.5 && angle < Math.PI * 1.8)
			{
				angle = Math.PI * 1.8;
			}
			else if( angle > Math.PI * 1.2 && angle <= Math.PI * 1.5)
			{
				angle = Math.PI * 1.2;
			}


			angle = lerp(angle, lastAngle, 0.5);


			// console.log(`angle ${toDegrees(angle)} pathangle: ${toDegrees(pathangle)} min ${toDegrees(min)} max ${toDegrees(max)}`);
		}
		else
		{
			angle = angle * Math.PI;
		}

		lastAngle = angle;
		let yshift = -Math.sin(angle) * magnitude;
		let xshift = Math.cos(angle) * magnitude;

		// console.log(`${i} ${toDegrees(angle)} ${xshift} ${yshift}`);
		ctx.lineTo(x + xshift, y + yshift);
		ctx.stroke();
		ctx.closePath();

		x += xshift;
		y += yshift;
	}
}

function scale(value, min, max)
{
	return (value * (max - min) + min);
}
/**
 *
 *
 * @param {number} first
 * @param {number} second
 * @param {number} ratio
 * @return {number} 
 */
function lerp(first, second, ratio)
{
	return first * (1 - ratio) + second * ratio;
}

function toDegrees(angle)
{
	return angle * (180 / Math.PI);
}