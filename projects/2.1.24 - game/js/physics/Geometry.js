export class Rect {
    constructor(height, width, origin) {
        this.height = height;
        this.width = width;
        this.origin = origin;
    }

    calculatePerimeterPoint(angleRadians) {
        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;
      
        var slope = Math.tan(angleInRadians);
        if (Math.abs(slope) <= halfHeight / halfWidth) {
          var intersectionX = halfWidth * Math.sign(Math.cos(angleRadians));
          var intersectionY = intersectionX * slope;
        } else {
          var intersectionY = halfHeight * Math.sign(Math.sin(angleRadians));
          var intersectionX = intersectionY / slope;
        }
      
        return { x: intersectionX, y: intersectionY };
    }
}

export class Circle {
    constructor(radius) {
        this.radius = radius;
        this.origin = origin;
    }

    calculatePerimeterPoint(angleRadians) {
        var intersectionX = this.radius * Math.cos(angleRadians);
        var intersectionY = this.radius * Math.sin(angleRadians);

        return { x: intersectionX, y: intersectionY };
    }
}

export function calculateLineAngleRad(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

export function rotatePoint(x, y, angleRadians) {
    var newX = x * Math.cos(angleRadians) - y * Math.sin(angleRadians);
    var newY = x * Math.sin(angleRadians) + y * Math.cos(angleRadians);

    return { x: newX, y: newY };
}

export function calculateDistance(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    return distance;
}