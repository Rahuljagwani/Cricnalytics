const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const { application } = require("express");

const db = mysql.createPool({
    host: "localhost",
    user: "rahul",
    password: "Pass1869#",
    database: "cricnalytics"

});

var n=0;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



/*MaxRuns*/
var m = 0;
app.post("/api/maxruns", (req, res) => {
    m = req.body.Numberofscorers;
    const maxruns = `select i.img,ba.batterid,p.name,sum(b.runsperball) as Runs,p.age,p.country from
    (balls b
    inner join batters ba
    on ba.batterid=b.batterid
    inner join players p
    on p.pid=ba.pid
    inner join image i
    on i.pid=p.pid)
    group by p.name
    order by sum(b.runsperball) desc limit ${m}`;
    db.query(maxruns, (err, result) => {
        res.send(result);
    })
});

app.get("/api/maxruns", (req, res) => {
    const mruns = `select i.img,ba.batterid,p.name,sum(b.runsperball) as Runs,p.age,p.country from
    (balls b
    inner join batters ba
    on ba.batterid=b.batterid
    inner join players p
    on p.pid=ba.pid
    inner join image i
    on i.pid=p.pid)
    group by p.name
    order by sum(b.runsperball) desc limit ${m}`;
    db.query(mruns, (err, result) => {
        if(err == null)
        {
            res.send(result);
        } else {
            console.log(err);
        }
    })
});



/*MaxWickets*/
var n1=0;
app.post("/api/maxWickets", (req, res) => {
   n1=req.body.NumberofMaxWicketTakers;
    const maxWickets = `select i.img, t.tname,bo.bowlerid,p.name,sum(b.isWicket) as wickets,p.age,p.country from
    (balls b
    inner join bowlers bo
    on bo.bowlerid=b.bowlerid
    inner join players p
    on p.pid=bo.pid
    inner join teams t
    on t.tid=p.tid
    inner join image i
    on i.pid=p.pid)
    where isWicket=1
    group by p.name
    order by sum(b.isWicket) desc limit ${n1} `;
    db.query(maxWickets, (err, result) => {
        res.send(result);
        
    })
});

app.get("/api/maxWickets", (req, res) => {
    const maxWickets = `select i.img, t.tname,bo.bowlerid,p.name,sum(b.isWicket) as wickets,p.age,p.country from
    (balls b
    inner join bowlers bo
    on bo.bowlerid=b.bowlerid
    inner join players p
    on p.pid=bo.pid
    inner join teams t
    on t.tid=p.tid
    inner join image i
    on i.pid=p.pid)
    where isWicket=1
    group by p.name
    order by sum(b.isWicket) desc limit ${n1} `;
    db.query(maxWickets, (err, result) => {
        res.send(result);

    })
});

/*Wickets by batsman*/
let bname="";
var n=0;
app.post("/api/wicketbybatsman", (req, res) => {
    n = req.body.NumberofwicketTakers;
    bname = req.body.Batsman;
    const maxWicketBybatsman = `select i.img,bw.bowlerid,t.tname, pl2.name,pl2.age ,count(b.isWicket) as Wickets
    from 
    ( balls b
    inner join batters bm
    on b.batterid=bm.batterid
    inner join bowlers bw
    on b.bowlerid=bw.bowlerid
    inner join players pl1
    on bm.pid=pl1.pid
    inner join players pl2
    on bw.pid=pl2.pid 
    inner join teams t
    on t.tid=pl2.tid
    inner join image i
    on i.pid=pl2.pid)
    where b.isWicket=1 and pl1.name='${bname}'
    group by pl2.name
    order by count(b.isWicket) desc limit ${n}`;
    db.query(maxWicketBybatsman , (err, result) => {
        res.send(result);
       
    })
});

app.get("/api/wicketbybatsman", (req, res) => {
    const maxWicketBybatsman = `select i.img,bw.bowlerid, t.tname, pl2.name,pl2.age, count(b.isWicket) as Wickets
    from 
    ( balls b
    inner join batters bm
    on b.batterid=bm.batterid
    inner join bowlers bw
    on b.bowlerid=bw.bowlerid
    inner join players pl1
    on bm.pid=pl1.pid
    inner join players pl2
    on bw.pid=pl2.pid 
    inner join teams t
    on t.tid=pl2.tid
    inner join image i
    on i.pid=pl2.pid)
    where b.isWicket=1 and pl1.name='${bname}'
    group by pl2.name
    order by count(b.isWicket) desc limit ${n}`;
    db.query(maxWicketBybatsman , (err, result) => {
        res.send(result);
        

    })
});


/*Runs by bowler*/
let boname="";
var n2=0;
app.post("/api/runsbyBowler", (req, res) => {
    n2= req.body.NumberofrunScorers;
    boname= req.body.Bowler;
    const maxRunsbybowler = `select i.img,bm.batterid,t.tname,pl1.age,pl1.name,sum(b.runsperball) as runs
    from 
    ( balls b
    inner join batters bm
    on b.batterid=bm.batterid
    inner join bowlers bw
    on b.bowlerid=bw.bowlerid
    inner join players pl1
    on bm.pid=pl1.pid
    inner join players pl2
    on bw.pid=pl2.pid
    inner join teams t
    on t.tid=pl1.tid 
    inner join image i
    on i.pid=pl1.pid)
    where pl2.name='${boname}'
    group by pl1.name
    order by sum(b.runsperball) desc
    limit ${n2};`;
    db.query(maxRunsbybowler, (err, result) => {
        res.send(result);
        console.log(err);
    })
});

app.get("/api/runsbyBowler", (req, res) => {
    const maxRunsbybowler = `select i.img,bm.batterid,t.tname,pl1.age,pl1.name,sum(b.runsperball) as runs
    from 
    ( balls b
    inner join batters bm
    on b.batterid=bm.batterid
    inner join bowlers bw
    on b.bowlerid=bw.bowlerid
    inner join players pl1
    on bm.pid=pl1.pid
    inner join players pl2
    on bw.pid=pl2.pid
    inner join teams t
    on t.tid=pl1.tid 
    inner join image i
    on i.pid=pl1.pid)
    where pl2.name='${boname}'
    group by pl1.name
    order by sum(b.runsperball) desc
    limit ${n2};`;
    db.query(maxRunsbybowler , (err, result) => {
        res.send(result);
        console.log(err);

    })
});


/*For insertion values*/
let tname = "batters";
let batterid = 163;
let playerid = 238;
let matchesplayed = 0;
let runs = 0;
let teamid = 1;
let battingSR = 0;
let battingAVG = 0;
let sixes = 0;
let fours = 0;
let hundreds = 0;
let fifties = 0;
let bowlerid = 521;
let type = "";
let wickets = 8;
let overs = 5;
let runsgiven = 40;
let bowlingAVG = 10;
let bowlingEconomy = 14;
let name = "";
let role = "";
let country = "";
let age = 20;
let position = 2;
let teamname = "";
let matcheswon = 5;
let matcheslost = 9;
let matchesdraw = 0;
let nrr = 50;
let points = 14;
let ballid = 12000;
let runsperball = 5;
let isWide = 1;
let isNoball = 1;
let isWicket = 0;
let attribute="";
let attribute1="";
let value="";
let value1="";
let operator=">";
app.post("/api/insert", (req, res) => {
    tname = req.body.tableName;
    batterid = req.body.batterid;
    playerid = req.body.playerid;
    matchesplayed = req.body.matchesplayed;
    runs = req.body.runs;
    teamid = req.body.teamid;
    battingSR = req.body.battingSR;
    battingAVG = req.body.battingAVG;
    sixes = req.body.sixes;
    fours = req.body.fours;
    hundreds = req.body.hundreds;
    fifties = req.body.fifties;

    bowlerid = req.body.bowlerid;
    type = req.body.type;
    wickets = req.body.wickets;
    overs = req.body.overs;
    runsgiven = req.body.runsgiven;
    bowlingAVG = req.body.bowlingAVG;
    bowlingEconomy = req.body.bowlingEconomy;
    name = req.body.name;
    role = req.body.role;
    country = req.body.country;
    age = req.body.age;
    position = req.body.position;
    teamname = req.body.teamname;
    matcheswon = req.body.matcheswon;
    matcheslost = req.body.matcheslost;
    matchesdraw = req.body.matchesdraw;
    nrr = req.body.nrr;
    points = req.body.points;
    ballid = req.body.ballid;
    runsperball = req.body.runsperball;
    isWide = req.body.isWide;
    isNoball = req.body.isNoball;
    isWicket = req.body.isWicket;









    let insert = `Insert into ${tname} values(${batterid},${playerid},${matchesplayed},${runs},${teamid},${battingSR},${battingAVG},${sixes},${fours},${hundreds},${fifties})`;
    switch (tname) {
        case "Batters": insert = `Insert into ${tname} values(${batterid},${playerid},${matchesplayed},${runs},${teamid},${battingSR},${battingAVG},${sixes},${fours},${hundreds},${fifties})`;
            break;
        case "Bowlers": insert = `Insert into ${tname} values(${bowlerid},${teamid},${playerid},${matchesplayed},"${type}",${wickets},${overs},${runsgiven},${bowlingAVG},${bowlingEconomy})`;
            break;
        case "Players": insert = `Insert into ${tname} values("${name}",${playerid},${teamid},"${role}","${country}",${age})`;
            break;
        case "Teams": insert = `Insert into ${tname} values( ${position} ,${teamid},"${teamname}",${matchesplayed},${matcheswon},${matcheslost},${matchesdraw},${nrr},${points})`;
            break;
        case "Balls": insert = `Insert into ${tname} values(${ballid},${runsperball},${isWide},${isNoball},${isWicket},${batterid},${bowlerid},${teamid})`;
            break;
    }
    db.query(insert, (err, result) => {
        if (err == null)
            res.send("Success");
        else
            res.send(err.sqlMessage);
            console.log(err);
    })


});



/*Delete value*/
app.post("/api/delete", (req, res) => {
    tname=req.body.tableName;
    attribute=req.body.attribute;
    value=req.body.value;
    operator=req.body.operator;

    let delete1 =`delete from ${tname} where ${attribute} ${operator} "${value}"`;
    db.query(delete1, (err, result) => {
        if (err == null)
        res.send("Success");
    else
        res.send(err.sqlMessage);
        console.log(err);
    });



}
);



/*Update Values*/
app.post("/api/update", (req, res) => {
    tname=req.body.tableName;
    attribute=req.body.attribute;
    attribute1=req.body.attribute1;
    value=req.body.value;
    value1=req.body.value1;
    operator=req.body.operator;


    let update =`update ${tname} set ${attribute1} = "${value1}" where ${attribute} ${operator} "${value}"`;
    db.query(update, (err, result) => {
        if (err == null)
        res.send("Success");
    else
        res.send(err.sqlMessage);
        console.log(err);
    });



});


app.listen(3001, () => {
    console.log("running on port 3001");
})