class Complex{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	get real(){return this.x;}
	set real(x){this.x = x;}
	get imag(){return this.y;}
	set imag(x){this.y = x;}
	
	static add(a,b){
		return new Complex(a.x+b.x,a.y+b.y);
	}
	static sub(a,b){
		return new Complex(a.x-b.x,a.y-b.y);
	}
	static mul(a,b){
		return new Complex(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);
	}
	static dot(a,b){
		return a.x * b.x + a.y * b.y;
	}
	length2(){
		return Complex.dot(this,this);
	}
	length(){
		return Math.sqrt(this.length2());
	}
	normalize(){
		return Complex.mul(this,new Complex(1/this.length(),0));
	}
}