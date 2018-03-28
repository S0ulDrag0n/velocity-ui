import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { detectBoxCollision } from '../utils/CollisionDetection';

class VirtualizedItem extends PureComponent {
    state = {
        visible: true,
        body: {
            originX: 0,
            originY: 0,
            radius: 0,
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
        const { bounds, useShortRadius } = this.props;
        const { x, y, width, height } = event.nativeEvent.layout;

        const originX = x + width / 2;
        const originY = y + height / 2;

        const longest = height <= width ? width : height;
        const shortest = height <= width ? height : width;

        const radius = (useShortRadius ? shortest : longest) / 2;

        const body = {
            originX,
            originY,
            radius,
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
    _hasCollided = (body1, body2) => {
        const detectionMethod = this.props.collisionDetection || detectBoxCollision;

        const collision = detectionMethod(body1, body2);

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
    useShortRadius: PropTypes.bool,
    style: PropTypes.any,
    children: PropTypes.any,
    onLayout: PropTypes.func,
    collisionDetection: PropTypes.func,
};

export { VirtualizedItem };
