class Engine
{
    constructor(width, height){
        this.canvas = document.getElementById('main');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }

    drawOnTick(){
        this.getPlayersPosition();

        this.drawBase();
        this.drawPlayers();
    }

    drawBase(){
        this.context.fillStyle = 'green';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    drawPlayers(){
        var ctx = this.context;
        ctx.fillStyle = 'red';
        
        this.playerPos.forEach(function(item){
            var circle  = new Path2D();
            circle.arc(item.x, item.y, 30, 0, 2 * Math.PI);
            ctx.fill(circle);
        })
    }

    getPlayersPosition(){
        this.playerPos = [
            {
                x : 100,
                y : 100
            },
            {
                x : 181,
                y : 230
            },
            {
                x : 430,
                y : 390
            },
        ];
    }
}