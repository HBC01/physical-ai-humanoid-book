import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Curriculum sidebar for the 7 core modules
  curriculumSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Module 1: Foundations of Physical AI',
      collapsed: false,
      items: [
        'modules/foundations/index',
        'modules/foundations/chapter-01-intro',
        'modules/foundations/chapter-02-embodied-intelligence',
        'modules/foundations/chapter-03-physical-systems',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: ROS 2 - Robotic Nervous System',
      collapsed: true,
      items: [
        'modules/ros2/index',
        'modules/ros2/chapter-01-ros2-intro',
        'modules/ros2/chapter-02-nodes-topics',
        'modules/ros2/chapter-03-services-actions',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Gazebo & Unity - Digital Twin',
      collapsed: true,
      items: [
        'modules/simulation/index',
        'modules/simulation/chapter-01-gazebo-intro',
        'modules/simulation/chapter-02-unity-robotics',
        'modules/simulation/chapter-03-digital-twins',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: NVIDIA Isaac Sim & Isaac ROS',
      collapsed: true,
      items: [
        'modules/isaac/index',
        'modules/isaac/chapter-01-isaac-sim-intro',
        'modules/isaac/chapter-02-isaac-ros',
        'modules/isaac/chapter-03-simulation-workflows',
      ],
    },
    {
      type: 'category',
      label: 'Module 5: Vision-Language-Action',
      collapsed: true,
      items: [
        'modules/vla/index',
        'modules/vla/chapter-01-vla-intro',
        'modules/vla/chapter-02-vision-systems',
        'modules/vla/chapter-03-language-grounding',
      ],
    },
    {
      type: 'category',
      label: 'Module 6: Conversational Robotics',
      collapsed: true,
      items: [
        'modules/conversational/index',
        'modules/conversational/chapter-01-dialog-systems',
        'modules/conversational/chapter-02-speech-recognition',
        'modules/conversational/chapter-03-natural-interaction',
      ],
    },
    {
      type: 'category',
      label: 'Module 7: Capstone - Autonomous Humanoid Robot',
      collapsed: true,
      items: [
        'modules/capstone/index',
        'modules/capstone/chapter-01-project-overview',
        'modules/capstone/chapter-02-implementation-guide',
        'modules/capstone/chapter-03-deployment',
      ],
    },
  ],
};

export default sidebars;
