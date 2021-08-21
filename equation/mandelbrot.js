function fractal_render(
		start = new Complex(0,0),
		constant = new Complex(0,0)
	){
	let z = new Complex(start.x,start.y);
	for(let i=0;i<1000;i++){
		z = Complex.add(Complex.mul(z,z),constant);
		if(z.length2() >= 4){
			break;
		}
	}
	return z;
}