//export * from 'path-data-polyfill';

export function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
export function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}

// rest of the code doesn't care about point format

// basic distance-based simplification
export function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

export function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
export function simplifyDouglasPeucker(points, sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
}

// both algorithms combined for awesome performance
export function simplify(points, tolerance, highestQuality) {
    if (points.length <= 2) return points;
    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);
    return points;
}

export function findIntersection(a1, a2, b1, b2) {
    const uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]),
        ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]),
        uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if (uB !== 0) {
        const ua = uaT / uB,
            ub = ubT / uB;
        if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
            return [a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])];
        }
    }
}

export function distanceBetween(a, b) {
    const dx = a[0] - b[0],
        dy = a[1] - b[1];

    return Math.sqrt(dx * dx + dy * dy);
}

function splitPathCommands(path) {
    let res = [];
    const regex = /([a-zA-Z])([^a-zA-Z]*)/g;
    let match;
    while ((match = regex.exec(path))) {
        const coordsStr = match[2];
        res.push({
            type: match[1],
            values: coordsStr.split(","),
            valuesStr: coordsStr
        })
    }
    return res;
}

export function sortPathByX(path) {
    //This should
    //let commands = path.getPathData()
    console.log("Starting path", path);
    let commands = splitPathCommands(path);
    if (commands[0].values[0] > commands.at(-1).values[0]) {
        commands.reverse();
    }
    let string = "";
    commands.forEach(function (command) {
        string += `${command.type}${command.valuesStr}`
    });
    console.log("Ending path", string);
    return string;
}