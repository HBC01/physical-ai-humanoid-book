# Exercise Troubleshooting Guide

Common issues and solutions for simulation exercises.

## General Issues

### ROS 2 Installation

**Problem:** `ros2: command not found`

**Solution:**
```bash
source /opt/ros/humble/setup.bash
# Add to ~/.bashrc to make permanent
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
```

### Package Build Errors

**Problem:** `Package not found after build`

**Solution:**
```bash
# Source the workspace
source ~/ros2_ws/install/setup.bash

# Rebuild if needed
colcon build --packages-select your_package --symlink-install
```

## Gazebo Issues

### Gazebo Won't Launch

**Problem:** Black screen or crash on launch

**Solution (CPU mode):**
```bash
# Use CPU rendering
export LIBGL_ALWAYS_SOFTWARE=1
ros2 launch gazebo_ros gazebo.launch.py
```

### Robot Not Spawning

**Problem:** No robot appears in simulation

**Solution:**
1. Check URDF syntax: `check_urdf robot.urdf`
2. Verify file path is absolute
3. Check Gazebo console for errors (View → Console)

## PyBullet Issues

### Import Error

**Problem:** `ModuleNotFoundError: No module named 'pybullet'`

**Solution:**
```bash
pip install pybullet
# Or with conda
conda install -c conda-forge pybullet
```

### Slow Performance

**Problem:** PyBullet running slowly

**Solution:**
- Reduce number of simulation steps
- Use `p.DIRECT` instead of `p.GUI` for headless mode
- Simplify robot URDF (fewer collision meshes)

## Isaac Sim Issues

### Isaac Sim Won't Start

**Problem:** `Isaac Sim requires NVIDIA GPU`

**Solution:**
- Isaac Sim can run on CPU (slower, ~10-20 FPS)
- Enable CPU mode in settings
- Reduce render quality for better performance

### ROS 2 Bridge Not Working

**Problem:** No topics appearing

**Solution:**
```bash
# Verify ROS 2 bridge extension is loaded
# In Isaac Sim: Window → Extensions → omni.isaac.ros2_bridge (enable)

# Check ROS 2 environment
echo $ROS_DOMAIN_ID
ros2 topic list
```

## Vision/VLA Issues

### Camera Not Found

**Problem:** `No camera available at index 0`

**Solution:**
```python
# Try different camera indices
cap = cv2.VideoCapture(0)  # or 1, 2, etc.

# List available cameras
import cv2
for i in range(5):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"Camera {i} available")
        cap.release()
```

### Model Download Errors

**Problem:** `Failed to download model weights`

**Solution:**
```bash
# Pre-download models
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

# Use local cache
export TRANSFORMERS_CACHE=/path/to/cache
```

## Speech Recognition Issues

### Microphone Not Working

**Problem:** `No audio input detected`

**Solution:**
```bash
# List audio devices
python -m speech_recognition
# Or
arecord -l

# Test microphone
arecord -d 5 test.wav && aplay test.wav
```

### Google Speech API Errors

**Problem:** `Request quota exceeded`

**Solution:**
- Use offline recognition: `recognizer.recognize_sphinx(audio)`
- Switch to Whisper: `pip install openai-whisper`

## Network/Communication Issues

### Topics Not Connecting

**Problem:** Publisher and subscriber not communicating

**Solution:**
```bash
# Check topic list
ros2 topic list

# Verify QoS compatibility
ros2 topic info /topic_name --verbose

# Echo topic to verify data
ros2 topic echo /topic_name
```

### Multi-Machine Setup

**Problem:** ROS 2 nodes can't discover each other across machines

**Solution:**
```bash
# Set ROS_DOMAIN_ID (0-101) on all machines
export ROS_DOMAIN_ID=42

# Verify network connectivity
ping <other-machine-ip>

# Check firewall (allow UDP ports 7400-7500)
sudo ufw allow 7400:7500/udp
```

## Getting Help

If you're still stuck:

1. **Check logs:**
   ```bash
   ros2 run your_pkg your_node --ros-args --log-level DEBUG
   ```

2. **Search ROS Answers:** https://answers.ros.org/

3. **GitHub Issues:** Check package repositories

4. **Community Discord/Forums:**
   - ROS Discourse: https://discourse.ros.org/
   - Gazebo Community: https://community.gazebosim.org/

5. **Documentation:**
   - [ROS 2 Humble Docs](https://docs.ros.org/en/humble/)
   - [Gazebo Tutorials](https://gazebosim.org/docs)
   - [PyBullet Quickstart](https://pybullet.org/wordpress/)

## Reporting Bugs

When reporting issues, include:
- ROS 2 version: `ros2 --version`
- OS version: `lsb_release -a`
- Python version: `python3 --version`
- Exact error message
- Steps to reproduce
