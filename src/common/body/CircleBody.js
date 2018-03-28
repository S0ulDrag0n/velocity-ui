import { RectangleBody } from './RectangleBody';

class CircleBody {
    constructor({ x, y, originX, originY, radius }) {
        this.radius = radius || 0;

        this.originX = originX ? originX : (x || 0) + this.radius;
        this.originY = originY ? originY : (y || 0) + this.radius;

        this.top = x || 0;
        this.left = y || 0;
        this.bottom = this.top + this.radius;
        this.right = this.left + this.radius;
    }
    hasCollidedWith = ({ circle }) => {
        if (circle) {
            const minimumDistance = this.radius + circle.radius;

            const x = circle.originX - this.originX;
            const y = circle.originY - this.originY;

            const distance = Math.sqrt(x * x + y * y);

            const collision = distance <= minimumDistance;

            return collision;
        }
        else {
            // TODO: Want to use polygon collision detection.
            return null;
        }
    }
    translate = (dx, dy) => {
        this.originX += dx;
        this.originY += dy;

        this.top += dy;
        this.left += dx;
        this.bottom += dy;
        this.right += dx;
    }
    scale = factor => {
        this.radius *= factor;

        this.top = this.originY - this.radius;
        this.left = this.originX - this.radius;
        this.bottom = this.originY + this.radius;
        this.right = this.originX + this.radius;
    }
    getState = () => {
        const {
            radius,
            originX,
            originY,
            left,
            top,
            bottom,
            right,
        } = this;

        return {
            radius,
            originX,
            originY,
            top,
            left,
            bottom,
            right,
        };
    }
    toRectangle = () => {
        const length = this.radius * 2;
        
        const rect = new RectangleBody({
            x: this.top,
            y: this.left,
            width: length,
            height: length,
        });

        return rect;
    }
}

export { CircleBody };
