# Velocity-UI
Minimalistic &amp; simple UI.

A library containing React Native components that do what it should do in a performant manner. A compilation of components based on other components that I have worked with but did something strange that I did not expect. This library aims to do them justice while trying to retrofit them with any design without much negative impact.

## 1. Components
### 1.1 Virtualized Grid
The virtualized grid only renders items as it comes into view to maintain a level of usability when rendering and scrolling. Out of view components are replaced with blank View components the same size as the original.
#### 1.1.1 Props
Prop | Default | Type | Description
-----|---------|------|------------
dataArray | - | array | Array of items to be rendered.
numColumns | 1 | number | Number of columns to divide the items into.
renderItem | - | function | Function to render each data item as a component.
horizontal | false | bool | Use the grid horizontally. (Optional)
useShortRadius | false | bool | When determining an item's collision radius, use the shortest dimension instead. (Optional)
keyExtractor | - | function | Function to pull out the key for each child component rendered.
collisionDetection | boundingBox | function | Function that calculates whether an item has entered the screen. See [Utility](#Utility).

## Utility
### Collision Detection
The library currently provides two types of bodies for collision detection by default: bounding box and bounding circle.

Bounding box collision detection uses the standard 2D rectangular collision detection. The algorithm checks whether an edge of a rectangular body has touched or crossed the opposite edge of the other rectangular body. For example, if rectangle A's right edge has touched or crossed the left edge of rectangle B, then there is a collision. This algorithm will tend to detect the collision just in time due to the hard edges of a rectangle.

Bounding circle collision detection uses circular bodies to represent a component. By default, rectangular components will use the longest edge as the radius for its collision body. The algorithms measures the distance between the origins of two circle bodies. A collision has occurred if the distance is equal to or less than the combined radius of the two bodies.

It is also possible to use custom collision detection algorithms as components simply take a function as props. However, the limitation right now is that they will only provide rectangular or circlar collision body info.