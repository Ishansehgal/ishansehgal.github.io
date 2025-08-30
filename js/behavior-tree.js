class BehaviorTreeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.isRunning = false;
        
        this.careerTree = {
            type: 'sequence',
            name: 'Robotics Career Journey',
            children: [
                {
                    type: 'sequence',
                    name: 'Foundation Learning',
                    children: [
                        { type: 'action', name: 'Complete BTech ECE', status: 'success' },
                        { type: 'action', name: 'Learn Arduino Basics', status: 'success' },
                        { type: 'action', name: 'Build Obstacle Avoidance Car', status: 'success' }
                    ]
                },
                {
                    type: 'sequence',
                    name: 'ROS Mastery',
                    children: [
                        { type: 'action', name: 'ROS Mentorship (Rigbetech)', status: 'success' },
                        { type: 'action', name: 'Learn URDF & Gazebo', status: 'success' },
                        { type: 'action', name: 'Navigation Stack Implementation', status: 'success' }
                    ]
                },
                {
                    type: 'selector',
                    name: 'Competition & Projects',
                    children: [
                        {
                            type: 'sequence',
                            name: 'eYantra Competition',
                            children: [
                                { type: 'action', name: 'Stage 1 - Simulation', status: 'success' },
                                { type: 'action', name: 'Stage 2 - Real Robot', status: 'success' },
                                { type: 'action', name: 'Achieve AIR 13', status: 'success' }
                            ]
                        },
                        {
                            type: 'sequence',
                            name: 'DIY Robot Development',
                            children: [
                                { type: 'action', name: 'Design Differential Drive', status: 'success' },
                                { type: 'action', name: 'Implement ROS2 Navigation', status: 'success' },
                                { type: 'action', name: 'Real-world Testing', status: 'success' }
                            ]
                        }
                    ]
                },
                {
                    type: 'sequence',
                    name: 'Professional Experience',
                    children: [
                        {
                            type: 'sequence',
                            name: 'IIT Bombay Internship',
                            children: [
                                { type: 'action', name: 'Autonomous Docking', status: 'success' },
                                { type: 'action', name: 'ArUco Marker Integration', status: 'success' },
                                { type: 'action', name: 'Behavior Trees Learning', status: 'success' }
                            ]
                        },
                        {
                            type: 'sequence',
                            name: 'Rigbetech Labs Journey',
                            children: [
                                { type: 'action', name: 'Remote Internship', status: 'success' },
                                { type: 'action', name: 'Nav2 & BT Expertise', status: 'success' },
                                { type: 'action', name: 'Full-time Role', status: 'running' }
                            ]
                        }
                    ]
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.render();
        this.startExecution();
    }

    render() {
        this.container.innerHTML = '';
        const treeElement = this.createTreeElement(this.careerTree, 0);
        this.container.appendChild(treeElement);
    }

    createTreeElement(node, depth) {
        const div = document.createElement('div');
        div.className = 'bt-node-container';
        div.style.marginLeft = `${depth * 20}px`;
        
        const nodeElement = document.createElement('div');
        nodeElement.className = `bt-tree-node ${node.type} ${node.status || ''}`;
        
        const icon = this.getNodeIcon(node.type);
        const statusIcon = this.getStatusIcon(node.status);
        
        nodeElement.innerHTML = `
            <span class="bt-node-icon">${icon}</span>
            <span class="bt-node-name">${node.name}</span>
            <span class="bt-node-status">${statusIcon}</span>
        `;
        
        div.appendChild(nodeElement);
        
        if (node.children) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'bt-children';
            
            node.children.forEach(child => {
                childrenContainer.appendChild(this.createTreeElement(child, depth + 1));
            });
            
            div.appendChild(childrenContainer);
        }
        
        return div;
    }

    getNodeIcon(type) {
        const icons = {
            'sequence': '→',
            'selector': '?',
            'action': '●'
        };
        return icons[type] || '●';
    }

    getStatusIcon(status) {
        const icons = {
            'success': '✓',
            'running': '⟳',
            'failure': '✗',
            undefined: '○'
        };
        return icons[status] || '○';
    }

    startExecution() {
        // Simulate behavior tree execution for demonstration
        this.isRunning = true;
        this.simulateExecution();
    }

    simulateExecution() {
        if (!this.isRunning) return;
        
        // This would simulate the behavior tree execution
        // In a real scenario, this would be driven by actual robot state
        setTimeout(() => {
            this.render();
            this.simulateExecution();
        }, 2000);
    }

    update() {
        // Called from main update loop
        // Can be used to update tree state based on robot status
    }

    setNodeStatus(nodePath, status) {
        // Helper function to update specific node status
        // nodePath would be an array indicating the path to the node
        this.render();
    }
}

// Add CSS for behavior tree styling
const btStyles = `
.bt-node-container {
    margin: 5px 0;
}

.bt-tree-node {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    margin: 2px 0;
    transition: all 0.3s ease;
    cursor: pointer;
}

.bt-tree-node:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
}

.bt-tree-node.sequence {
    border-left: 3px solid #4ecdc4;
}

.bt-tree-node.selector {
    border-left: 3px solid #ff6b6b;
}

.bt-tree-node.action {
    border-left: 3px solid #ffe66d;
}

.bt-tree-node.running {
    animation: btNodePulse 1s infinite;
    background: rgba(255, 255, 255, 0.2);
}

.bt-tree-node.success {
    background: rgba(76, 175, 80, 0.2);
}

.bt-tree-node.failure {
    background: rgba(244, 67, 54, 0.2);
}

@keyframes btNodePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.bt-node-icon {
    margin-right: 10px;
    font-weight: bold;
    color: #4ecdc4;
}

.bt-node-name {
    flex: 1;
    font-size: 0.8rem;
}

.bt-node-status {
    margin-left: 10px;
    font-weight: bold;
}

.bt-children {
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    margin-left: 10px;
    padding-left: 10px;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = btStyles;
document.head.appendChild(styleSheet);
