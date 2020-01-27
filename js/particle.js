
function Particle(xpos = 400, ypos = 400, cellWidth, cellHeight, imageSampleP5) {
    this.pos = createVector(xpos, ypos);

    this.getColor = function() {        
        // transform from drawing size to preview size to get color
        let x = floor(imageSampleP5.width/width * this.pos.x);
        let y = floor(imageSampleP5.height/height * this.pos.y);
        let c = imageSampleP5.get(x ,y).map(d => d / 255 * 100);                
        if(c[3] !== 0) c[3] = opacitySlider.value();
        // console.log(x, y , c)
        return(c);
    }

    this.show = function () {
        // only draw the selected color
        // let color = [0, 0, 0, opacitySlider.value()];
        // color[xSelect.value()] = this.getColor()[xSelect.value()]
        // let color = [0, 0, 0, opacitySlider.value()];
        // color[xSelect.value()] = this.getColor()[xSelect.value()]
        let color = this.getColor();
        let xChange = color[xSelect.value()] / 100 * cellWidth
        let yChange = color[ySelect.value()] / 100 * height
        stroke(color);        
        line(this.pos.x, this.pos.y, this.pos.x + xChange, this.pos.y + yChange);
        // this.updatePrev();
    };
}