// Creates canvas 320 × 200 at 10, 50
var paper = Raphael(0, 0, "100%", "100%");
var circles = [];
var lines = [];
var _circlesID = 1;
var _linesID = 5001;

paper.canvas.style.backgroundColor = '#eee';

function addCircle(x, y, radius, connectID) {

    var circle = paper.circle(x, y, radius);
    circle.attr("fill", "#f00");
    circle.attr("stroke", "#fff");

    circle.id = _circlesID;
    circle.connectIDs = [];

    circles.push({
        id: circle.id,
        connectID: circle.connectID
    });

    paper.add(circle);

    if (connectID) {

        circle.connectIDs.push(connectID);
        addLine(circle.id, connectID);
    }

    paper.set(circle).drag(onCircleMove, onCircleMoveStart, onCircleMoveEnd);

    _circlesID++;
}

function addLine(circle1ID, circle2ID) {

    var circle1 = paper.getById(circle1ID);
    var circle2 = paper.getById(circle2ID);

    // Just making sure both objects are aware of their connecting line
    if (circle1.connectIDs.indexOf(circle2ID) < 0) {
        circle1.connectIDs.push(circle2ID);
    }

    if (circle2.connectIDs.indexOf(circle1ID) < 0) {
        circle2.connectIDs.push(circle1ID);
    }

    var line = paper.path( [
        "M",
        circle1.attr('cx'),
        circle1.attr('cy'),
        "L",
        circle2.attr('cx'),
        circle2.attr('cy')
    ]);

    line.id = _linesID;
    line.start = circle1.id;
    line.end = circle2.id;

    lines.push(line);

    paper.add(line);

    _linesID++;
}

function onCircleMove(dx, dy) {

    var x = this.startingX + dx;
    var y = this.startingY + dy;
    this.attr({cx: x, cy: y});

    // Update any lines connected to the circle
    for (var i = 0; i < this.connectIDs.length; i++) {

        var id = this.connectIDs[i];

        for (var i2 = 0; i2 < lines.length; i++) {

            if (lines[i2].start === id) {
                moveLine(x, y, false, paper.getById(lines[i2].id));
                break;
            }

            if (lines[i2].end === id) {
                moveLine(x, y, true, paper.getById(lines[i2].id));
                break;
            }
        }
    }
}

function onCircleMoveStart(x, y, e) {
    this.startingX = this.attr('cx');
    this.startingY = this.attr('cy');
    this.animate({r: 50}, 250, ">");
}

function onCircleMoveEnd(e) {
    console.log(e);
    this.animate({r: 30}, 250, ">");
}

function moveLine(x, y, moveAtEnd, line) {

    var path = line.attr('path');

    if (moveAtEnd) {

        var m = path[0];

        m[1] = x;
        m[2] = y;

    } else {

        var l = path[1];

        l[1] = x;
        l[2] = y;
    }

    line.animate({path:path},0);

}

addCircle(50, 40, 30, null);
addCircle(200, 90, 30, circles[0].id);