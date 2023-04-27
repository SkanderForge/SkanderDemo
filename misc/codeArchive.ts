import * as d3 from "d3";

export function getNestedValue(obj: object, ...args: any[]) {
    return args.reduce((obj, level) => obj && obj[level], obj)
}

function getCurvedLabelPath(path: any, width: any, height: any) {
    // Get the total length of the path

    path = path.node();
    if (path.__data__.coordinates.length < 1) return {length: 0, points: [0, 0, 0, 0]}

    let totalLength = path.getTotalLength();

    // Create a function to find the point on the path for a given position
    const point = function (pos: any) {
        let p = path.getPointAtLength(pos);
        return [p.x, p.y];
    };

    // Calculate the position of the text along the path
    const textPositions = [];
    let pos = 0;
    while (pos < totalLength) {
        textPositions.push(pos);
        pos += height;
    }
    // Create a new path for the text
    const textPath = d3.path();

    // Move to the start of the path
    const p0 = point(totalLength);
    textPath.moveTo(p0[0], p0[1]);
    // Add a curve for each text position
    textPositions.reverse().forEach(function (pos) {
        const p1 = point(pos);
        const p2 = point(Math.min(pos + height / 2, totalLength));
        textPath.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
    });
    // Return the new path

    let [startingDefinition, ...commands] = textPath.toString().split("Q");
    let startingPoint = startingDefinition.split("M")[1].split(",");

    let startingX = parseFloat(startingPoint[0]);
    let startingY = parseFloat(startingPoint[1]);

    let maxCurve = {length: 0, points: [0, 0, 0, 0]};
    for (let qCommand of commands) {
        let [x0, y0, x1, y1] = qCommand.split(",").map(parseFloat);
        let length = Math.sqrt(Math.abs((x1 - startingX) * (x1 - startingX)) + Math.abs((y1 - startingY) * (y1 - startingY)));
        if (length > maxCurve.length) {
            maxCurve = {length: length, points: [x1, y1, x0, y0, startingX, startingY]};
        }
    }
    /*
    let [x0, y0, dx, dy, x1, y1] = maxCurve.points;
    let slopeAB = (y1 - y0) / (x1 - x0);
    let interceptAB = y0 - slopeAB * x0;

// calculate the perpendicular line passing through C
    let slopePC = -1 / slopeAB; // perpendicular slopes are negative reciprocals
    let interceptPC = dy - slopePC * dx;

// find the point of intersection of the two lines
    let x3 = (interceptPC - interceptAB) / (slopeAB - slopePC);
    let y3 = slopeAB * x3 + interceptAB;

// calculate the reflection of C with respect to the point of intersection
    let x4 = 2 * x3 - dx;
    let y4 = 2 * y3 - dy;

    maxCurve.points[2] = x4;
    maxCurve.points[3] = y4;
*/
    return maxCurve;
}


svg.select("#province_shapes")
    .append("text")
    .attr("dominant-baseline", "middle")
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("text-anchor", "middle")
    .attr("id", `${tagName}_label_textPath`)
    .text(languageData[tagName]);
svg.select(`#${tagName}_label_textPath`).attr("xlink:href", `#SHAPE_${tagName}`);
