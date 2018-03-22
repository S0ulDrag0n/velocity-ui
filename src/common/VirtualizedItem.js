import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

export default class VirtualizedItem extends PureComponent {
    _onLayout = ({ nativeEvent }) => {
        const { gridIndex } = this.props;

        if (this.props.onLayout) {
            this.props.onLayout(nativeEvent, gridIndex);
        }
    }
    render() {
        const { hidden, style, children } = this.props;

        if (hidden) {
            return <View {...style} onLayout={this._onLayout} />;
        }

        return (
            <View {...style} onLayout={this._onLayout}>{children}</View>
        );
    }
}

VirtualizedItem.propTypes = {
    gridIndex: PropTypes.number,
    style: PropTypes.any,
    children: PropTypes.any,
    hidden: PropTypes.bool,
    onLayout: PropTypes.func,
};
