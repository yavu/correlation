
let points = []
let ruler = 0;
let grid = 0;
const canvas_size = 800;
const pointRadius = 8;

function draw()
{
    /** @type { HTMLCanvasElement } */
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#edf3f7";
    ctx.fillRect(0,0,canvas_size,canvas_size);

    canvas.addEventListener
    (
        "click",
        function mouse({offsetX:x,offsetY:y})
        {
            const erase_index = points.findIndex(elem => Math.sqrt(((x - elem.x) ** 2) + ((y - elem.y) ** 2)) <= pointRadius + (pointRadius / 3));
            const place = points.some(elem => Math.sqrt(((x - elem.x) ** 2) + ((y - elem.y) ** 2)) <= (pointRadius * 2) + 0.5);
            if (!place && x >= pointRadius && x <= canvas_size - pointRadius && y >= pointRadius && y <= canvas_size - pointRadius)
            {
                ctx.beginPath();
                ctx.fillStyle = "#063152";
                ctx.lineWidth = 1;
                ctx.arc(x,y,pointRadius,0,toRadians(360));
                ctx.fill();
                points.push({x:x,y:y});

                console.log("===============");
                console.log("add",points);
            }
            else if (erase_index !== -1)
            {
                const [erase] = points.splice(erase_index,1);
                ctx.beginPath();
                ctx.fillStyle = "#edf3f7";
                ctx.lineWidth = 1;
                ctx.arc(erase.x,erase.y,pointRadius + 0.5,0,toRadians(360));
                ctx.fill();
                if (points.length <= 1) {document.getElementById("result").textContent = "r = ";}
                all_redraw();
                console.log("===============");
                console.log("erase",erase);

            }
            //相関係数を出す
            if (points.length >= 2)
            {
                //和
                const points_sum = points.reduce
                (
                    function ({x:acc_x, y:acc_y},{x:cur_x,y:cur_y})
                    {
                        return {x:acc_x + cur_x,y:acc_y + cur_y};
                    }
                );

                //平均
                const points_avg = {x:points_sum.x / points.length,y:points_sum.y / points.length};
                //console.log("average ",points_avg);

                //偏差
                const points_dev = points.map
                (
                    function ({x:dev_x,y:dev_y})
                    {
                        return {x:dev_x - points_avg.x,y:dev_y - points_avg.y}
                    }
                );
                //console.log("deviation",points_dev);
                
                //偏差の自乗
                const points_dev_sq = points_dev.map
                (
                    function ({x:dev_x,y:dev_y})
                    {
                        return {x:dev_x ** 2,y:dev_y ** 2}
                    }
                )
                //console.log("dev_sum",points_dev_sq);

                //偏差の自乗の和
                const points_dev_sq_sum = points_dev_sq.reduce
                (
                    function ({x:acc_x, y:acc_y},{x:cur_x,y:cur_y})
                    {
                        return {x:acc_x + cur_x,y:acc_y + cur_y};
                    }
                );
                //console.log("dev_sum",points_dev_sq_sum);

                //分散
                const points_distr = {x:points_dev_sq_sum.x /points.length,y:points_dev_sq_sum.y /points.length};
                //console.log("Distributed",points_distr);

                //偏差の積
                const points_dev_prod = points_dev.map
                (
                    function ({x:dev_x,y:dev_y})
                    {
                        return (dev_x * dev_y)
                    }
                )
                //console.log("dev_prod",points_dev_prod);

                //偏差の積の和
                const points_dev_prod_sum = points_dev_prod.reduce
                (
                    function (acc,cur)
                    {
                        return acc + cur;
                    }
                );
                //console.log("dev_prod_sum",points_dev_prod_sum);

                //共分散
                const points_cov = points_dev_prod_sum / points.length
                //console.log("Covariance",points_cov);

                //相関係数
                const points_correl = -((Math.floor((points_cov / (Math.sqrt(points_distr.x) * Math.sqrt(points_distr.y))) * 10000)) / 10000);
                //const points_correl = -points_cov / (Math.sqrt(points_distr.x) * Math.sqrt(points_distr.y));
                console.log("Correlation",points_correl);
                document.getElementById("result").textContent = "r = " + points_correl;
            }
        }
    )
}

function clear()
{
    points = [];
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    
    document.getElementById("result").textContent = "r = ";
    ctx.fillStyle = "#edf3f7";
    ctx.fillRect(0,0,canvas_size,canvas_size);

    all_redraw();

    console.log("clear",points);
}

function points_redraw()
{
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    for (const draw_point of points)
    {
        ctx.beginPath();
        ctx.fillStyle = "#063152";
        ctx.arc(draw_point.x,draw_point.y,pointRadius,0,toRadians(360));
        ctx.fill();
    }
}

function ruler_clear()
{
    ruler = 0;
    all_redraw();
}

function ruler_45()
{
    ruler = 1;
    all_redraw();
}

function ruler_135()
{
    ruler = 2;
    all_redraw();
}

function grid_on()
{
    grid = 1;
    all_redraw();
}

function grid_clear()
{
    grid = 0;
    all_redraw();
}

function all_redraw()
{
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    //キャンバスリセット
    ctx.fillStyle = "#edf3f7";
    ctx.fillRect(0,0,canvas_size,canvas_size);

    //グリッド
    if (grid === 1)
    {
        //線
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#dae1e6';
        for (let draw_grid_x = 1; draw_grid_x < 10; draw_grid_x++)
        {
            ctx.moveTo(draw_grid_x * (canvas_size / 10) + 0.5, 0);
            ctx.lineTo(draw_grid_x * (canvas_size / 10) + 0.5, canvas_size);
        }
        for (let draw_grid_y = 1; draw_grid_y < 10; draw_grid_y++)
        {
            ctx.moveTo(0, draw_grid_y * (canvas_size / 10) + 0.5);
            ctx.lineTo(canvas_size, draw_grid_y * (canvas_size / 10) + 0.5);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#dae1e6';
        ctx.moveTo((canvas_size / 2), 0);
        ctx.lineTo((canvas_size / 2), canvas_size);
        ctx.moveTo(0, (canvas_size / 2));
        ctx.lineTo(canvas_size, (canvas_size / 2));
        ctx.stroke();
    }

    //定規
    if (ruler === 1)
    {
        //線
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#a8b4bd';
        ctx.moveTo(canvas_size, 0);
        ctx.lineTo(0, canvas_size);
        ctx.stroke();
    }
    else if (ruler === 2)
    {
        //線
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#a8b4bd';
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas_size, canvas_size);
        ctx.stroke();
    }

    //点再描画
    if (points.length >= 1) {points_redraw();}
}
