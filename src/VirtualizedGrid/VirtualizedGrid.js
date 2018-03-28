import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ScrollView, View } from 'react-native';
import { VirtualizedItem } from '../common';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

class VirtualizedGrid extends PureComponent {
    state = {
        itemWidth: 0,
        viewport: {
            originX: screenWidth / 2,
            originY: screenHeight / 2,
            radius: screenWidth / 2,
            left: 0,
            top: 0,
            right: screenWidth,
            bottom: screenHeight,
        },
    };
    _onGridLayout = ({ nativeEvent }) => {
        const { x, y, width, height }  = nativeEvent.layout;
        const { numColumns, useShortRadius } = this.props;

        const numCols = numColumns || 1;
        const itemWidth = width / numCols;
        const originX = x + width / 2;
        const originY = y + height / 2;

        const longest = height <= width ? width : height;
        const shortest = height <= width ? height : width;

        const radius = (useShortRadius ? shortest : longest) / 2;

        this.setState({
            itemWidth,
            viewport: {
                originX,
                originY,
                radius,
                left: x,
                top: y,
                right: x + width,
                bottom: y + height,
            },
        });
    }
    _onScroll = ({ nativeEvent }) => {
        const { viewport } = this.state;
        const { contentOffset, layoutMeasurement } = nativeEvent;
        const { x, y } = contentOffset;
        const { width, height } = layoutMeasurement;

        const originX = x + width / 2;
        const originY = y + height / 2;

        const adjustedViewport = {
            ...viewport,
            originX,
            originY,
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
        };

        this.setState({
            viewport: adjustedViewport,
        });
    }
    _extractKey = data => {
        const { keyExtractor } = this.props;
        const key = keyExtractor(data);

        return `${key}`;
    }
    _determineLayout = index => {
        const { numColumns } = this.props;

        const columnCount = numColumns || 1;

        const column = index % columnCount;
        const row = Math.floor(index / columnCount);

        return {
            row,
            column,
        };
    }
    _determineIndex = location => {
        const { numColumns } = this.props;
        const { row, column } = location;

        const columnCount = numColumns || 1;

        const index = columnCount * row + column;

        return index;
    }
    _renderItem = (data, index) => {
        const { useShortRadius } = this.props;
        const { itemWidth, viewport } = this.state;
        const key = this._extractKey(data);
        const { row, column } = this._determineLayout(index);

        const itemStyle = {
            width: itemWidth,
            minWidth: itemWidth,
            maxWidth: itemWidth,
        };

        return (
            <VirtualizedItem
                key={key}
                gridIndex={index}
                gridRow={row}
                gridColumn={column}
                style={itemStyle}
                bounds={viewport}
                collisionDetection={this.props.collisionDetection}
                useShortRadius={useShortRadius}
            >
            {
                this.props.renderItem(data, index)
            }
            </VirtualizedItem>
        );
    }
    _renderItems = () => {
        const { dataArray } = this.props;

        const itemComponents = dataArray.map(this._renderItem);

        return itemComponents;
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    onLayout={this._onGridLayout}
                    onScroll={this._onScroll}
                    removeClippedSubviews
                >
                {
                    this._renderItems()
                }
                </ScrollView>
            </View>
        );
    }
}

VirtualizedGrid.propTypes = {
    dataArray: PropTypes.array,
    numColumns: PropTypes.number,
    renderItem: PropTypes.func,
    useShortRadius: PropTypes.bool,
    keyExtractor: PropTypes.func,
    collisionDetection: PropTypes.func,
};

export { VirtualizedGrid };
