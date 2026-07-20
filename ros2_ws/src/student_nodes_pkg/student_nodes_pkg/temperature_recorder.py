import csv
import os
from datetime import datetime

import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32


class TemperatureRecorder(Node):

    def __init__(self):
        super().__init__("temperature_recorder")

        self.subscription = self.create_subscription(
            Float32,
            "/sensor/temperature",
            self.callback,
            10,
        )

        self.filename = "temperature_log.csv"

        if not os.path.exists(self.filename):
            with open(self.filename, "w", newline="") as file:
                writer = csv.writer(file)
                writer.writerow(["Timestamp", "Temperature"])

        self.get_logger().info("Temperature Recorder Started")

    def callback(self, msg):

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with open(self.filename, "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([timestamp, msg.data])

        self.get_logger().info(
            f"Recorded {msg.data:.2f} °C"
        )


def main(args=None):
    rclpy.init(args=args)

    node = TemperatureRecorder()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass

    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
