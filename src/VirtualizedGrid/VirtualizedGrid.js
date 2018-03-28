import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ScrollView, View } from 'react-native';
import { VirtualizedItem } from '../common';

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
            left: 0,
            top: 0,
            right: Dimensions.get('window').width,
            bottom: Dimensions.get('window').height,
        },
    };
    _onGridLayout = ({ nativeEvent }) => {
        const { x, y, width, height }  = nativeEvent.layout;
        const { numColumns } = this.props;

        const numCols = numColumns || 1;

        const itemWidth = width / numCols;

        this.setState({
            itemWidth,
            viewport: {
                left: x,
                top: y,
                right: x + width,
                bottom: y + height,
            },
        });
    }
    _onScroll = ({ nativeEvent }) => {
        const { contentOffset, layoutMeasurement } = nativeEvent;
        const { x, y } = contentOffset;
        const { width, height } = layoutMeasurement;

        const viewport = {
            left: x,
            top: y,
            right: x + width,
            bottom: y + height,
        };

        this.setState({
            viewport,
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
    keyExtractor: PropTypes.func,
};

export { VirtualizedGrid };
