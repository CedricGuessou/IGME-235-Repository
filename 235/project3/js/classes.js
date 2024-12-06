class Knight extends PIXI.AnimatedSprite{
    health = 100;

    constructor(texture, x = sceneWidth / 2, y = sceneHeight / 2) {
        super(texture);
        this.anchor.set(0.5, 0.5); // Position, scaling, rotating etc are now from center of the sprite
        this.scale.set(2);
        this.x = x;
        this.y = y;
        this.play();
    }    

    movement(keys) {
        if (keys["87"]) {
            this.y -= 3;
            // Box will spawn above
            attackBox.x = this.x;
            attackBox.y = this.y - this.height;
            attackBox.rotation = 0;
        }
    
        if (keys["65"]) {
            this.x -= 3;

            // Box will spawn to the left
            attackBox.x = this.x - this.width;
            attackBox.y = this.y;
            attackBox.rotation = Math.PI * 3 / 2;
        }
    
        if (keys["83"]) {
            this.y += 3;

            // Box will spawn under
            attackBox.x = this.x;
            attackBox.y = this.y + this.height;
            attackBox.rotation = Math.PI;
        }
    
        if (keys["68"]) {
            this.x += 3;

            // Box will spawn to the right
            attackBox.x = this.x + this.width;
            attackBox.y = this.y;
            attackBox.rotation = Math.PI / 2;
        }
        
    }
    
}

class Enemy extends PIXI.Graphics{
    constructor(size = 80, color = 0x808080){
        super();
        this.rect(0, 0, size, size);
        this.fill(color);
        this.health = 30;
        this.isAlive = true;
    }

    set shealth(newHealth){
        this.health = newHealth;
    }

    get ghealth(){
        return this.health;
    }

    follow(knight){
        let distance = new PIXI.Point();
        
        distance.x = knight.x - this.x;
        distance.y = knight.y - this.y;

        if(magnitude(distance) < 450){
            this.x += (distance.x) / 1000;
            this.y += (distance.y) / 1000;
        }
    }

    
}