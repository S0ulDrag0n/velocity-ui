import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

class VirtualizedItem extends PureComponent {
    state = {
        visible: true,
        body: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        height: null,
    };
    componentWillReceiveProps(nextProps) {
        const { body } = this.state;
        const { bounds } = nextProps;

        const visible = this._hasCollided(bounds, body);

        if (visible === this.state.visible) {
            return;
        }

        this.setState({
            visible,
        });
    }
    _onLayout = event => {
        const { bounds } = this.props;
        const { x, y, width, height } = event.nativeEvent.layout;

        const body = {
            left: x,
            top : y,
            right: x + width,
            bottom: y + height,
        };

        const visible = this._hasCollided(bounds, body);

        this.setState({
            visible,
            body,
            height,
        });

        if (this.props.onLayout) {
            this.props.onLayout(event);
        }
    }
    _hasCollided = (rect1, rect2) => {
        const bottomTop = rect1.bottom < rect2.top;
        const topBottom = rect1.top > rect2.bottom;
        const leftRight = rect1.left > rect2.right;
        const rightLeft = rect1.right < rect2.left;

        const collision = !(leftRight || rightLeft || bottomTop || topBottom);

        return collision;
    }
    render() {
        const { style, children } = this.props;
        const { visible, height } = this.state;

        if (!visible) {
            return <View style={[style, { minHeight: height, maxHeight: height }]} onLayout={this._onLayout} />;
        }

        return (
            <View {...style} onLayout={this._onLayout}>{children}</View>
        );
    }
}

VirtualizedItem.propTypes = {
    bounds: PropTypes.object,
    style: PropTypes.any,
    children: PropTypes.any,
    onLayout: PropTypes.func,
};

export { VirtualizedItem };
