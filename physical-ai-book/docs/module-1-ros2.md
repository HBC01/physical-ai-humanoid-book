# Module 1: ROS 2 - The Robotic Nervous System

Welcome to the foundation of modern robotics. This module covers the Robot Operating System 2 (ROS 2), which acts as the "nervous system" for humanoid robots, managing communication between sensors (eyes) and actuators (muscles).

## 1.1 Discovery Phase: Communication Patterns
In humanoid robotics, precision and timing are everything. ROS 2 utilizes **DDS (Data Distribution Service)** as its middleware, enabling high-performance, real-time messaging.

### Nodes, Topics, and Messages
- **Nodes**: Independent execution units. For a humanoid, you might have one node for `left_hand_controller` and another for `lidar_sensor`.
- **Topics**: The "veins" through which data flows. Sensors publish data to topics, and controllers subscribe to them.
- **Messages**: The predefined structures of data (e.g., `sensor_msgs/JointState`).

## 1.2 Python Integration: rclpy API
Python is the preferred language for high-level AI logic in robotics. We use the `rclpy` library to interact with the ROS 2 graph.

### Practical Example: Joint State Publisher
This script simulates a node publishing the position of a humanoid's knee joint.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64

class HumanoidJointPublisher(Node):
    def __init__(self):
        super().__init__('humanoid_joint_pub')
        self.publisher_ = self.create_publisher(Float64, '/joint_states/knee_position', 10)
        timer_period = 0.1  # 10Hz
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.angle = 0.0

    def timer_callback(self):
        msg = Float64()
        msg.data = self.angle
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing Knee Angle: {msg.data:.2f} rad')
        self.angle += 0.05 # Increment angle

def main(args=None):
    rclpy.init(args=args)
    pub = HumanoidJointPublisher()
    try:
        rclpy.spin(pub)
    except KeyboardInterrupt:
        pass
    pub.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 1.3 Service vs. Action
Humanoids often require long-running tasks like "Walk to the kitchen."
- **Services**: Synchronous request/response. Best for quick status checks.
- **Actions**: Asynchronous, preemptable tasks with feedback. Best for movement planning where you want to know progress (e.g., "50% of the way to the goal").

## Summary Checklist
- [ ] Install local ROS 2 (Humble or Iron).
- [ ] Create a workspace (`colcon build`).
- [ ] Implement your first Python publisher Node.
