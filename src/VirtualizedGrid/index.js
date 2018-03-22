import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ScrollView, View } from 'react-native';
import VirtualizedItem from '../common/VirtualizedItem';

const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

class VirtualizedGrid extends PureComponent {
    state = {
        itemWidth: 0,
        itemLayouts: [],
        viewportMinY: 0,
        viewportMaxY: Dimensions.get('window').height,
    };
    _onLayout = ({ nativeEvent }) => {
        const { width, height }  = nativeEvent.layout;
        const { dataArray, numColumns } = this.props;

        const numCols = numColumns || 1;

        const itemWidth = width / numCols;
        const numRows = Math.ceil(dataArray.length / numCols);

        const itemLayouts = [];

        for (let i = 0; i < numRows; i++) {
            itemLayouts.push([]);
        }

        this.setState({
            itemWidth,
            itemLayouts,
            viewportMaxY: height,
        });
    }
    _onItemLayout = (nativeEvent, index) => {
        const { itemLayouts, viewportMinY, viewportMaxY } = this.state;
        const { layout } = nativeEvent;
        const { y, height } = layout;

        const viewport = {
            viewportMinY,
            viewportMaxY,
        };

        const { row, column } = this._determineLayout(index);

        const layouts = [...itemLayouts];

        const size = {
            minY: y,
            maxY: y + height,
        };

        const isVisible = this._isInViewport(size, viewport);

        layouts[row][column] = { ...layout, isVisible };

        this.setState({
            itemLayouts: layouts,
        });
    }
    _onScroll = ({ nativeEvent }) => {
        const { dataArray } = this.props;
        const { itemLayouts } = this.state;
        const { contentOffset, layoutMeasurement }  = nativeEvent;

        const viewportMinY = contentOffset.y;
        const viewportMaxY = contentOffset.y + layoutMeasurement.height;

        const viewport = {
            viewportMinY,
            viewportMaxY,
        };

        const layouts = [...itemLayouts];

        for (let i = 0; i < dataArray.length; i++) {
            const { row, column } = this._determineLayout(i);
            const layout = layouts[row][column];
            const { y, height } = layout;

            const size = {
                minY: y,
                maxY: y + height,
            };

            if (layout) {
                layout.isVisible = this._isInViewport(size, viewport);
            }
        }

        this.setState({
            itemLayouts: layouts,
            viewportMinY,
            viewportMaxY,
        });
    }
    _extractKey = data => {
        const { keyExtractor } = this.props;
        const key = keyExtractor(data);

        return `${key}`;
    }
    _isInViewport = (size, viewport) => {
        const { minY, maxY } = size;
        const { viewportMinY, viewportMaxY } = viewport;

        const isVisible = (minY >= viewportMinY && minY <= viewportMaxY) || (maxY >= viewportMinY && maxY <= viewportMaxY);

        return isVisible;
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
        const { itemWidth, itemLayouts } = this.state;
        const { row, column } = this._determineLayout(index);

        let isVisible = true;
        let itemStyle = {
            width: itemWidth,
            minWidth: itemWidth,
            maxWidth: itemWidth,
        };

        if (itemLayouts[row] && itemLayouts[row][column]) {
            const layout = itemLayouts[row][column];

            isVisible = layout.isVisible;

            if (!isVisible) {
                itemStyle = { ...itemStyle, minHeight: layout.height, maxHeight: layout.height };
            }
        }

        return (
            <VirtualizedItem
                key={this._extractKey(data)}
                gridIndex={index}
                style={itemStyle}
                onLayout={this._onItemLayout}
                hidden={!isVisible}
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
                    onLayout={this._onLayout}
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
    keyExtractor: PropTypes.func,
};

export { VirtualizedGrid };
