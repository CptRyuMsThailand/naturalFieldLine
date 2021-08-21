let frameBuffer;
let fboRunning = true;


let colorLog_density = 50;
let colorLog_offset = 0;

let color_r_param = [0.5,0.5,1.0,0.00];
let color_g_param = [0.5,0.5,1.0,0.10];
let color_b_param = [0.5,0.5,1.0,0.20];
async function mainRender(ctx,x,y,w,h,bbox){
	
	let epsilon = new Complex(1e-2,0);
	let startPoint = new Complex(x,y);
	let constantPoint = new Complex(0,0);
	for(let i=0;i<100;i++){
		let itePoint = fractal_render(constantPoint,startPoint);
		let diffLine = Complex.sub(itePoint,startPoint);
		let newPoint = Complex.add(startPoint,Complex.mul(diffLine.normalize(),epsilon));
		
		lineDrawing(
			Math.round(map(startPoint.y,bbox.left,bbox.right,0,w-1)),
			Math.round(map(startPoint.x,bbox.top,bbox.bottom,0,h-1)),
			Math.round(map(newPoint.y,bbox.left,bbox.right,0,w-1)),
			Math.round(map(newPoint.x,bbox.top,bbox.bottom,0,h-1)),
			w,h
			);
		/*ctx.beginPath();
		ctx.moveTo(
			map(startPoint.y,bbox.left,bbox.right,0,w),
			map(startPoint.x,bbox.top,bbox.bottom,0,h)
		);
		ctx.lineTo(
			map(newPoint.y,bbox.left,bbox.right,0,w),
			map(newPoint.x,bbox.top,bbox.bottom,0,h)
		);
		ctx.strokeStyle = `rgb(
			255,
			${Math.round(map(i,0,1000,0,255))},
			0
		)`;
		ctx.stroke();*/
		startPoint = newPoint;
		if(i % 20 == 0)await wait16();
	}
	return;
}
function lineDrawing(x0,y0,x1,y1,w,h){
	if(x0 - x1 == 0 && y0 - y1 == 0)return;
	function plotLineLow(x0,y0,x1,y1){
		let dx = x1 - x0;
		let dy = y1 - y0;
		yi = 1;
		if(dy < 0){
			yi = -1;
			dy = -dy;
		}
		let D = (2 * dy)- dx;
		let y = y0;
		for(let x=x0;x<=x1;x++){
			if(x >= 0 && x < w && y >= 0 && y < h)plot(x,y,w);
			if(D > 0){
				y += yi;
				D += 2 * (dy - dx);
			}else{
				D += 2 * dy;
			}
		}
	}
	function plotLineHigh(x0,y0,x1,y1){
		let dx = x1 - x0;
		let dy = y1 - y0;
		xi = 1;
		if(dx < 0){
			xi = -1;
			dx = -dx;
		}
		let D = (2 * dx)- dy;
		let x = x0;
		for(let y=y0;y<=y1;y++){
			if(x >= 0 && x < w && y >= 0 && y < h)plot(x,y,w);
			if(D > 0){
				x += xi;
				D += 2 * (dx - dy);
			}else{
				D += 2 * dx;
			}
		}
	}
	if(Math.abs(y1 - y0) < Math.abs(x1 - x0)){
		if(x0 > x1) {
			plotLineLow(x1,y1,x0,y0);
		}
		else {
			plotLineLow(x0,y0,x1,y1);
		}
	}else{
		if(y0 > y1) {
			plotLineHigh(x1,y1,x0,y0);
		}
		else {
			plotLineHigh(x0,y0,x1,y1);
		}
	}
}
function plot(x,y,w){
	frameBuffer[x+y*w]++;
}


async function fboLoop(){
	fboRunning = true;
	frameBuffer = new Uint32Array(W*H);
	let canvasScanline = ctx.createImageData(W,1);
	let counter = 50;
	while(fboRunning){
		for(let y=0;y<H;y++){
			for(let x=0;x<W;x++){
				let [r,g,b] = colorFunction(frameBuffer[x+y*W]);
				canvasScanline.data[x*4+0] = r;
				canvasScanline.data[x*4+1] = g;
				canvasScanline.data[x*4+2] = b;
				canvasScanline.data[x*4+3] = 255;
				if(--counter == 0){
					counter = 65535;
					await wait16();
				}
			}
			ctx.putImageData(canvasScanline,0,y);
			

		}
		
	}
}
function submittedColor(e,formObj){
	e?.preventDefault();
	let elem = formObj.elements;
	colorLog_density = Number(elem["colorLog"].value);
	colorLog_offset = Number(elem["colorOffset"].value);
	return false;
}
function submittedPalette(e,formObj){
	e?.preventDefault();
	let elem = formObj.elements;
	for(let i=0;i<4;i++){
		color_r_param[i] = Number(elem["color_r_"+i].value);
		color_g_param[i] = Number(elem["color_g_"+i].value);
		color_b_param[i] = Number(elem["color_b_"+i].value);
		
	}
	return false;
}
function colorFunction(x){
	let v = Math.log(x / colorLog_density + 1) + colorLog_offset;
	return [
	colorSine(v,...color_r_param)*255,
	colorSine(v,...color_g_param)*255,
	colorSine(v,...color_b_param)*255
	];
}
function colorSine(x,a,b,c,d){
	return a + b * Math.cos(2 * Math.PI * (c*x+d));
}
function map(x,y,z,u,v){
	let t = (x-y)/(z-y);
	return (1-t)*u+t*v;
}
function clamp(x,y,z){
	if(x < y)return y;
	if(x > z)return z;
	return x;
}
function wait16(){
	return new Promise(
		r =>{requestAnimationFrame(r);}
		);
}
