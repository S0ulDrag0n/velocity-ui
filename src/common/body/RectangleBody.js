import { CircleBody } from './CircleBody';

class RectangleBody {
    constructor({ x, y, width, height }) {
        this.width = width || 0;
        this.height = height || 0;

        this.top = x || 0;
        this.left = y || 0;
        this.bottom = this.top + this.height;
        this.right = this.left + this.width;
    }
    translate = (dx, dy) => {
        this.top += dy;
        this.left += dx;
        this.bottom += dy;
        this.right += dx;

        return this;
    }
    scale = factor => {
        const prevWidth = this.width;
        const prevHeight = this.height;

        this.width *= factor;
        this.height *= factor;

        const widthDifference = (this.width - prevWidth) / 2;
        const heightDifference = (this.height - prevHeight) / 2;

        this.top -= heightDifference;
        this.left -= widthDifference;
        this.bottom += heightDifference;
        this.right += widthDifference;

        return this;
    }
    hasCollidedWith = ({ rect }) => {
        if (rect) {
            const bottomTop = this.bottom < rect.top;
            const topBottom = this.top > rect.bottom;
            const leftRight = this.left > rect.right;
            const rightLeft = this.right < rect.left;

            const collision = !(leftRight || rightLeft || bottomTop || topBottom);

            return collision;
        }
        else {
            // TODO: Want to use polygon collision detection.
            return null;
        }
    }
    getState = () => {
        const {
            width,
            height,
            left,
            top,
            bottom,
            right,
        } = this;

        return {
            width,
            height,
            top,
            left,
            bottom,
            right,
        };
    }
    toCircle = (useLongest = true) => {
        let length;
        if (useLongest) {
            length = this.width >= this.height ? this.width : this.height;
        }
        else {
            length = this.width <= this.height ? this.width : this.height;
        }
        const radius = length / 2;

        const circle = new CircleBody({
            x: this.top,
            y: this.left,
            radius,
        });

        return circle;
    }
}

export { RectangleBody };
