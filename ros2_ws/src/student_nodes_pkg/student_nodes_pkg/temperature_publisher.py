#!/usr/bin/env python3

import random

import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32


class TemperaturePublisher(Node):

    def __init__(self):
        super().__init__('temperature_publisher')

        self.publisher = self.create_publisher(
            Float32,
            '/sensor/temperature',
            10
        )

        self.timer = self.create_timer(
            1.0,
            self.publish_temperature
        )

        self.get_logger().info(
            "Temperature Publisher Started"
        )

    def publish_temperature(self):
        msg = Float32()

        msg.data = round(random.uniform(20.0, 35.0), 2)

        self.publisher.publish(msg)

        self.get_logger().info(
            f"Temperature: {msg.data} °C"
        )


def main(args=None):
    rclpy.init(args=args)

    node = TemperaturePublisher()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass

    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()