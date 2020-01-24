// Originally written by Daniel Shiffman for https://youtu.be/BjoM9oKOAKY

function Particle(cellWidth = 400, cellHeight = 400, getSpeed = () => 2) {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    
    this.prevPos = this.pos.copy();

    this.update = function () {
        this.maxspeed = getSpeed();
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };

    this.follow = function (vectors) {
        var x = floor(this.pos.x / cellWidth);
        var y = floor(this.pos.y / cellHeight);
        var index = x + y * ncol;        
        var force = vectors[index];        
        this.applyForce(force);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    };

    this.getColor = function() {
        let c = get(this.pos.x, this.pos.y).map(d => d / 255 * 100);                
        if(c[3] !== 0) c[3] = opacitySlider.value();
        return(c);
    }

    this.color = this.getColor(); // only color at start of image....(?)

    this.show = function () {        
        stroke(this.color);        
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    };

    this.updatePrev = function () {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    };

    this.edges = function () {
        if (this.pos.x > width | this.pos.x < 0 | this.pos.y > height | this.pos.y < 0) {
            this.pos = createVector(random(width), random(height));
            this.updatePrev();
        }
    };
}