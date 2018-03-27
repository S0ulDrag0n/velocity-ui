export const boundingCircle = (circle1, circle2) => {
    const minimumDistance = circle1.radius + circle2.radius;

    const x = circle2.originX - circle1.originX;
    const y = circle2.originY - circle1.originY;

    const distance = Math.sqrt(x * x + y * y);

    const collision = distance <= minimumDistance;

    return collision;
};

export const boundingBox = (rect1, rect2) => {
    const bottomTop = rect1.bottom < rect2.top;
    const topBottom = rect1.top > rect2.bottom;
    const leftRight = rect1.left > rect2.right;
    const rightLeft = rect1.right < rect2.left;

    const collision = !(leftRight || rightLeft || bottomTop || topBottom);

    return collision;
};
