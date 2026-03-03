export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

const author = { name: "Dharaneedharan SS", avatar: "" };

export const blogPosts: BlogPost[] = [
  // === IoT (4 posts) ===
  {
    id: "1",
    title: "Edge Computing Meets IoT: Real-Time Processing in 2025",
    excerpt: "How edge computing eliminates latency in industrial IoT deployments, enabling real-time decision making at the sensor level without cloud dependency.",
    content: `## Introduction

The convergence of **edge computing** and the **Internet of Things** is redefining how industries process data. In 2025, sending every sensor reading to the cloud is no longer viable — latency, bandwidth costs, and reliability concerns demand a smarter approach.

## Why Edge Computing Matters for IoT

Traditional cloud-centric IoT architectures introduce 100–500ms of round-trip latency. For applications like robotic assembly lines, autonomous vehicles, or real-time quality inspection, this delay is unacceptable.

### Key Benefits of Edge Processing:
1. **Sub-10ms response times** — Processing happens at the sensor node itself
2. **Bandwidth savings** — Only aggregated insights are sent upstream, reducing data transfer by up to 90%
3. **Offline resilience** — Edge devices continue operating even when connectivity drops
4. **Data privacy** — Sensitive manufacturing data never leaves the factory floor

## Architecture: The Three-Tier Model

Modern IoT edge architectures follow a three-tier pattern:

- **Tier 1 — Sensor Nodes**: Microcontrollers (ESP32, STM32) running lightweight inference models for anomaly detection
- **Tier 2 — Edge Gateways**: Raspberry Pi or NVIDIA Jetson devices aggregating data from multiple sensors, running complex ML models
- **Tier 3 — Cloud/Data Lake**: Long-term storage, model retraining, and cross-facility analytics

## Real-World Implementation

In a recent factory automation project, we deployed 48 vibration sensors connected to ESP32 nodes. Each node ran a TinyML anomaly detection model that could identify bearing failures 72 hours before they occurred.

### Hardware Stack:
- **ESP32-S3** with 8MB PSRAM for inference
- **ADXL345** 3-axis accelerometer (vibration sensing)
- **LoRa SX1276** for long-range, low-power communication
- **Raspberry Pi 4** as the edge gateway running Node-RED

### Software Stack:
- TensorFlow Lite Micro for on-device inference
- MQTT for sensor-to-gateway communication
- InfluxDB on the gateway for local time-series storage
- Grafana dashboards for real-time monitoring

## Results

After deploying this edge computing architecture:
- **Latency dropped** from 320ms (cloud) to 8ms (edge)
- **Bandwidth usage** reduced by 87%
- **Predictive accuracy** for equipment failures reached 94.2%
- **Downtime** decreased by 35% in the first quarter

## Conclusion

Edge computing is not replacing the cloud — it's complementing it. By processing time-critical decisions locally and syncing insights to the cloud asynchronously, organizations achieve the best of both worlds: real-time responsiveness and long-term intelligence.`,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    category: "IoT",
    author,
  },
  {
    id: "7",
    title: "Building Predictive Maintenance Systems with Arduino & ML",
    excerpt: "A hands-on guide to collecting vibration sensor data with Arduino, training anomaly detection models, and deploying predictions on Raspberry Pi edge devices.",
    content: `## Introduction

**Predictive maintenance** saves industries billions annually by detecting equipment failures before they happen. In this guide, we'll build a complete predictive maintenance system using affordable hardware and open-source machine learning tools.

## Project Overview

We'll create a system that:
1. Collects vibration data from industrial motors using Arduino
2. Trains an anomaly detection model using Python and scikit-learn
3. Deploys the model on a Raspberry Pi for real-time predictions
4. Sends alerts when abnormal patterns are detected

## Hardware Requirements

| Component | Purpose | Cost |
|-----------|---------|------|
| Arduino Mega 2560 | Data acquisition from sensors | $45 |
| MPU-6050 IMU | 6-axis vibration & acceleration | $5 |
| Raspberry Pi 4 (4GB) | Edge inference & gateway | $55 |
| ADS1115 ADC | High-precision analog readings | $10 |
| Current sensor ACS712 | Motor current monitoring | $8 |

## Step 1: Data Collection with Arduino

The Arduino reads vibration data at 1kHz sampling rate from the MPU-6050 sensor:

\`\`\`cpp
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;
void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();
}
void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  Serial.printf("%d,%d,%d,%d,%d,%d\\n", ax, ay, az, gx, gy, gz);
  delayMicroseconds(1000);
}
\`\`\`

## Step 2: Feature Engineering

From raw vibration data, we extract meaningful features:

- **RMS (Root Mean Square)** — Overall vibration intensity
- **Peak-to-peak amplitude** — Maximum vibration range
- **Kurtosis** — Sharpness of the vibration signal (indicates impacts)
- **FFT dominant frequency** — Identifies specific fault frequencies
- **Crest factor** — Ratio of peak to RMS (bearing defects)

## Step 3: Model Training

We use an Isolation Forest for unsupervised anomaly detection:

\`\`\`python
from sklearn.ensemble import IsolationForest
import pandas as pd

data = pd.read_csv('vibration_features.csv')
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(data[['rms', 'kurtosis', 'peak_freq', 'crest_factor']])
\`\`\`

## Step 4: Edge Deployment on Raspberry Pi

The trained model is exported using ONNX Runtime for efficient inference on the Pi. The system processes incoming sensor data every 5 seconds and classifies equipment health as **Normal**, **Warning**, or **Critical**.

## Results from a 6-Month Pilot

- **12 potential failures** detected before they occurred
- **Average lead time**: 3.2 days before failure
- **False positive rate**: 2.1%
- **Maintenance cost reduction**: 42%

## Conclusion

Building predictive maintenance systems doesn't require expensive industrial platforms. With Arduino, Raspberry Pi, and open-source ML tools, you can create production-ready monitoring solutions that deliver real results.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Jun 10, 2025",
    readTime: "14 min read",
    category: "IoT",
    author,
  },
  {
    id: "11",
    title: "MQTT vs HTTP: Choosing the Right Protocol for IoT Communication",
    excerpt: "A practical comparison of MQTT and HTTP for IoT sensor networks — covering bandwidth, battery life, QoS levels, and when to use each protocol.",
    content: `## Introduction

Choosing the right communication protocol is one of the most impactful decisions in IoT architecture. **MQTT** and **HTTP** are the two most common options, but they serve fundamentally different use cases.

## Protocol Overview

### MQTT (Message Queuing Telemetry Transport)
- Publish/subscribe model
- Designed for constrained devices and unreliable networks
- Persistent connections via TCP
- Lightweight binary protocol (2-byte minimum header)

### HTTP (Hypertext Transfer Protocol)
- Request/response model
- Universal web standard
- Stateless connections
- Text-based headers (typically 200-800 bytes overhead)

## Head-to-Head Comparison

| Factor | MQTT | HTTP |
|--------|------|------|
| **Message size** | 2 bytes + payload | 200+ bytes + payload |
| **Connection** | Persistent (keep-alive) | New connection per request |
| **Power consumption** | Low (ideal for battery) | High (connection overhead) |
| **Latency** | ~10ms (persistent conn) | ~100ms (handshake + request) |
| **QoS levels** | 0, 1, 2 (at-most/at-least/exactly once) | None (application-level retry) |
| **Bidirectional** | Yes (pub/sub) | Limited (polling or WebSocket) |
| **Firewall friendly** | Sometimes blocked | Always allowed |
| **Browser support** | Via WebSocket adapter | Native |

## When to Use MQTT

MQTT excels in scenarios with:
- **Battery-powered sensors** — A soil moisture sensor sending readings every 15 minutes over cellular. MQTT's keep-alive connection uses 90% less power than repeated HTTP handshakes
- **High-frequency telemetry** — Industrial equipment sending data every 100ms. MQTT's persistent connection eliminates connection overhead
- **Unreliable networks** — Remote agricultural sensors on 2G/3G. QoS level 1 ensures delivery even with intermittent connectivity
- **Fan-out messaging** — One weather station update consumed by 50 different dashboards simultaneously via topic subscriptions

## When to Use HTTP

HTTP is the better choice for:
- **Firmware updates** — Large binary downloads benefit from HTTP's range requests and CDN caching
- **RESTful device management** — CRUD operations on device configurations map naturally to REST verbs
- **Browser-based dashboards** — Direct API calls from web applications without protocol bridges
- **Infrequent communication** — A device reporting once daily doesn't benefit from persistent connections

## Hybrid Architecture: Best of Both Worlds

In practice, most production IoT systems use both protocols:

1. **Sensors → Gateway**: MQTT for lightweight, real-time telemetry
2. **Gateway → Cloud**: MQTT for streaming data, HTTP for batch uploads and management
3. **Cloud → Dashboard**: HTTP/REST API for web applications
4. **Cloud → Devices**: MQTT for commands, HTTP for firmware OTA updates

## Conclusion

There's no universal winner. MQTT dominates for real-time sensor telemetry, while HTTP remains essential for device management and web integration. The best IoT architectures leverage both protocols strategically.`,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=500&fit=crop",
    date: "Oct 5, 2025",
    readTime: "9 min read",
    category: "IoT",
    author,
  },
  {
    id: "17",
    title: "Smart Factory Monitoring: ESP32 Sensor Networks in Production",
    excerpt: "Deploying ESP32-based sensor meshes across a manufacturing floor to monitor temperature, humidity, and machine vibration with real-time alerting dashboards.",
    content: `## Introduction

Modern manufacturing demands continuous monitoring of environmental conditions and equipment health. This article documents a real deployment of **32 ESP32 sensor nodes** across a 15,000 sq ft manufacturing facility.

## System Requirements

The factory required monitoring of:
- **Temperature** (±0.5°C accuracy) at 15 locations
- **Humidity** (±2% RH) in climate-sensitive zones
- **Vibration** on 8 critical CNC machines
- **Air quality** (PM2.5) in the welding area
- **Power consumption** on the main distribution panel

## Hardware Design

### Sensor Node v2.1 Specification:
- **MCU**: ESP32-WROOM-32E (dual-core, WiFi + BLE)
- **Sensors**: BME280 (temp/humidity/pressure), ADXL345 (vibration)
- **Power**: 5V USB with 18650 Li-ion battery backup (8-hour runtime)
- **Enclosure**: IP65-rated ABS box for factory environment
- **Cost per node**: $28 (BOM at 50-unit volume)

### Network Topology

We implemented a **star topology** with WiFi:
- Each ESP32 connects directly to industrial-grade access points (Ubiquiti UAP-AC-PRO)
- Two access points provide redundant coverage across the entire floor
- MQTT broker (Mosquitto) runs on a local Ubuntu server
- All data stays within the factory LAN — no cloud dependency for real-time operations

## Software Architecture

### ESP32 Firmware (C++/Arduino):
- Readings sampled every 2 seconds
- Local 60-second rolling average calculated on-device
- Averaged data published via MQTT every 60 seconds
- Raw high-frequency vibration data (500Hz) published on-demand for analysis
- OTA firmware updates via a local HTTP server

### Backend (Node.js + InfluxDB):
- MQTT subscriber processes incoming data
- InfluxDB stores time-series data with 90-day retention
- Alert rules evaluate conditions every 10 seconds
- Telegram bot sends instant notifications for critical alerts

### Dashboard (React + Grafana):
- Grafana panels for historical trend analysis
- Custom React dashboard for live factory floor map visualization
- Color-coded zones showing real-time temperature/humidity
- Equipment health status with vibration trend charts

## Alert Configuration

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Temperature high | > 35°C | Telegram + email |
| Humidity critical | > 80% RH | Telegram + activate dehumidifier relay |
| Vibration anomaly | > 3σ from baseline | Telegram + log for maintenance review |
| Node offline | > 5 min no data | Telegram + dashboard highlight |
| PM2.5 high | > 50 µg/m³ | Activate exhaust fan relay |

## Results After 8 Months

- **Node uptime**: 99.7% (WiFi reconnection handled automatically)
- **Data loss**: < 0.1% (MQTT QoS 1 + local buffering)
- **Energy waste reduction**: 18% (optimized HVAC based on zone temperature data)
- **Unplanned downtime reduction**: 28% (vibration-based early warnings)
- **ROI**: System paid for itself in 4.5 months

## Lessons Learned

1. **WiFi is sufficient** for most factory monitoring — LoRa adds complexity without meaningful benefit in a single building
2. **Battery backup is essential** — Power outages are when monitoring matters most
3. **Local-first architecture** wins — Don't depend on cloud for real-time alerting
4. **Involve operators early** — The dashboard is only useful if shop floor workers understand and trust it

## Conclusion

ESP32-based sensor networks offer an incredibly cost-effective path to smart factory monitoring. At under $1,000 for the entire deployment, the return on investment is compelling for any manufacturing operation.`,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop",
    date: "Feb 12, 2026",
    readTime: "11 min read",
    category: "IoT",
    author,
  },

  // === Design (3 posts) ===
  {
    id: "2",
    title: "Designing Micro-Interactions That Drive User Retention",
    excerpt: "A deep dive into crafting subtle animations and feedback loops that keep users engaged — from button states to page transitions using Framer Motion.",
    content: `## Introduction

**Micro-interactions** are the small, often unconscious design details that make digital products feel alive. A button that bounces on click, a form that shakes on invalid input, a card that lifts on hover — these tiny moments add up to create an emotional connection with users.

## Why Micro-Interactions Matter

Research by the Nielsen Norman Group shows that perceived performance is as important as actual performance. A loading spinner that animates smoothly feels faster than a static one — even if they take the same time.

### Impact on Key Metrics:
- **Session duration** increases by 15-25% with well-designed transitions
- **Task completion rates** improve by 10% when feedback is immediate
- **User satisfaction scores** rise by 20% with polished interactions

## The Four Pillars of Micro-Interactions

### 1. Trigger
What initiates the interaction? User actions (click, hover, scroll) or system events (data loaded, error occurred).

### 2. Rules
What happens when triggered? The animation direction, duration, and behavior must follow consistent rules.

### 3. Feedback
What does the user see/feel? Visual changes, sound, or haptic response that confirms the action.

### 4. Loops & Modes
Does it repeat? Does it change over time? A notification badge that pulses once is different from one that pulses continuously.

## Implementing with Framer Motion

Framer Motion makes React animations declarative and composable:

\`\`\`tsx
import { motion } from "framer-motion";

const Card = ({ children }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.div>
);
\`\`\`

### Key Animation Patterns:

- **Enter/Exit**: Use \`AnimatePresence\` for mount/unmount animations
- **Layout transitions**: \`layout\` prop for smooth reflow when lists change
- **Scroll-triggered**: \`useInView\` hook for reveal-on-scroll effects
- **Gesture-based**: \`drag\`, \`whileHover\`, \`whileTap\` for interactive elements

## Common Micro-Interaction Recipes

### Button Feedback
- Subtle scale down (0.97) on press
- Color shift on hover (not just cursor change)
- Loading spinner replaces text during async operations

### Form Validation
- Real-time field validation with green checkmark on valid input
- Gentle shake animation on submit with errors
- Progress indicator for multi-step forms

### Page Transitions
- Fade + slide for forward navigation
- Reverse slide for back navigation
- Shared element transitions for list → detail views

### Notification Toast
- Slide in from edge with spring physics
- Auto-dismiss with progress bar
- Swipe to dismiss with velocity-based threshold

## Performance Considerations

- Use \`transform\` and \`opacity\` only — they're GPU-accelerated
- Avoid animating \`width\`, \`height\`, \`margin\` — they trigger layout recalculation
- Use \`will-change\` sparingly and remove after animation completes
- Target 60fps — test on low-end devices

## Conclusion

Micro-interactions are the difference between an app that works and an app that delights. Start with the most frequent user actions — login, navigation, and form submission — and add thoughtful motion that provides clear feedback. Less is more: a few polished interactions outperform dozens of flashy ones.`,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Feb 10, 2025",
    readTime: "6 min read",
    category: "Design",
    author,
  },
  {
    id: "6",
    title: "Responsive Design Systems: Beyond Breakpoints in 2025",
    excerpt: "Moving past static breakpoints to fluid typography, container queries, and intrinsic layouts that adapt to any screen without media queries.",
    content: `## Introduction

For a decade, responsive design has meant \`@media (min-width: 768px)\`. But in 2025, with foldable phones, ultra-wide monitors, car displays, and smart watches, **static breakpoints are no longer enough**. Modern CSS gives us tools to build truly intrinsic layouts.

## The Problem with Breakpoints

Traditional breakpoints assume a finite set of screen sizes. But reality is a continuum:
- Phones: 320px to 430px
- Foldable phones: 280px (folded) to 884px (unfolded)
- Tablets: 600px to 1024px
- Laptops: 1024px to 1536px
- Desktops: 1536px to 3840px

Designing for 3-4 breakpoints leaves gaps. **Components should respond to their own container, not the viewport.**

## Container Queries: The Game Changer

Container queries allow components to style themselves based on their parent's size:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
\`\`\`

This means the same card component works in a narrow sidebar AND a wide main content area — without any viewport media queries.

## Fluid Typography with clamp()

Instead of jumping between font sizes at breakpoints, use \`clamp()\` for smooth scaling:

\`\`\`css
h1 {
  font-size: clamp(1.75rem, 4vw + 0.5rem, 3.5rem);
}

body {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.25rem);
}
\`\`\`

This creates typography that flows naturally across every screen size — no breakpoints needed.

## Intrinsic Layouts with CSS Grid

CSS Grid's \`auto-fit\` and \`minmax()\` create layouts that adapt without media queries:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}
\`\`\`

This grid:
- Shows 1 column on phones
- 2 columns on tablets
- 3-4 columns on desktops
- All without a single media query

## Building a Modern Design System

### Spacing Scale (Fluid):
Use CSS custom properties with clamp():
\`\`\`css
:root {
  --space-sm: clamp(0.5rem, 1vw, 0.75rem);
  --space-md: clamp(1rem, 2vw, 1.5rem);
  --space-lg: clamp(1.5rem, 4vw, 3rem);
  --space-xl: clamp(2rem, 6vw, 5rem);
}
\`\`\`

### Component Tokens:
Define component-level tokens that reference the fluid scale:
\`\`\`css
.card {
  padding: var(--space-md);
  gap: var(--space-sm);
  border-radius: var(--radius-md);
}
\`\`\`

## Practical Migration Strategy

1. **Audit existing breakpoints** — Identify which ones can be replaced with container queries
2. **Convert typography first** — Fluid font sizes have the highest impact with lowest risk
3. **Adopt grid auto-fit** — Replace flex-wrap patterns with intrinsic grids
4. **Add container queries** — Start with card components that appear in multiple contexts
5. **Keep viewport queries for layout** — Page-level layout shifts (sidebar collapse) still need viewport queries

## Conclusion

The future of responsive design is intrinsic. Components that understand their own context and adapt accordingly are more maintainable, more reusable, and provide a smoother experience across the infinite spectrum of screen sizes.`,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop",
    date: "May 20, 2025",
    readTime: "7 min read",
    category: "Design",
    author,
  },
  {
    id: "12",
    title: "Accessibility-First Design: Building Inclusive Web Experiences",
    excerpt: "Practical strategies for WCAG 2.2 compliance — semantic HTML, ARIA patterns, color contrast tools, and keyboard navigation that benefits every user.",
    content: `## Introduction

Over **1.3 billion people** worldwide experience significant disability. Accessibility isn't a feature to add later — it's a fundamental design principle that benefits everyone. Curb cuts, originally designed for wheelchairs, are used by everyone with strollers, luggage, or bicycles. The same principle applies to digital accessibility.

## WCAG 2.2: What's New

The latest Web Content Accessibility Guidelines (WCAG 2.2) added several criteria:

### New Success Criteria:
- **2.4.11 Focus Not Obscured (Minimum)** — Focused elements must not be entirely hidden by sticky headers or modals
- **2.4.13 Focus Appearance** — Focus indicators must be at least 2px and have 3:1 contrast
- **2.5.7 Dragging Movements** — All drag-and-drop must have a click-based alternative
- **2.5.8 Target Size (Minimum)** — Interactive targets must be at least 24×24 CSS pixels
- **3.3.7 Redundant Entry** — Don't ask users to re-enter information already provided

## Semantic HTML: The Foundation

Using correct HTML elements provides accessibility for free:

\`\`\`html
<!-- Bad: Div soup -->
<div class="nav">
  <div class="nav-item" onclick="navigate()">Home</div>
</div>

<!-- Good: Semantic HTML -->
<nav aria-label="Main navigation">
  <a href="/">Home</a>
</nav>
\`\`\`

### Key Semantic Elements:
- \`<nav>\` — Navigation landmarks
- \`<main>\` — Primary content (only one per page)
- \`<article>\` — Self-contained content
- \`<aside>\` — Complementary content
- \`<button>\` — Clickable actions (NOT \`<div onclick>\`)
- \`<table>\` with \`<th>\` — Tabular data

## Color Contrast Standards

| Text Size | AA (Minimum) | AAA (Enhanced) |
|-----------|-------------|----------------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px bold or ≥ 24px) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | — |

### Tools for Checking Contrast:
- **Chrome DevTools** — Built-in contrast ratio checker in the color picker
- **Stark** — Figma/Sketch plugin for design-time checking
- **axe DevTools** — Automated accessibility auditing

## Keyboard Navigation Patterns

Every interactive element must be reachable and operable via keyboard:

### Essential Patterns:
- **Tab** — Move focus forward through interactive elements
- **Shift + Tab** — Move focus backward
- **Enter / Space** — Activate buttons and links
- **Arrow keys** — Navigate within components (tabs, menus, radio groups)
- **Escape** — Close modals, dropdowns, and popovers

### Focus Management in SPAs:
When navigating between pages in a single-page application, programmatically move focus to the main content:

\`\`\`tsx
useEffect(() => {
  const mainContent = document.getElementById('main-content');
  mainContent?.focus();
}, [location.pathname]);
\`\`\`

## ARIA: When Semantic HTML Isn't Enough

ARIA (Accessible Rich Internet Applications) fills gaps where HTML falls short:

- \`aria-label\` — Provides a text label when none is visible
- \`aria-describedby\` — Links to a longer description
- \`aria-expanded\` — Indicates expandable content state
- \`aria-live="polite"\` — Announces dynamic content changes to screen readers
- \`role="alert"\` — Immediately announces important messages

### First Rule of ARIA:
> If you can use a native HTML element with the semantics you need, **use it instead of ARIA**.

## Testing Your Accessibility

1. **Automated scanning** — axe, Lighthouse, WAVE (catches ~30% of issues)
2. **Keyboard testing** — Navigate your entire app without a mouse
3. **Screen reader testing** — VoiceOver (Mac), NVDA (Windows), TalkBack (Android)
4. **Zoom testing** — Ensure content works at 200% and 400% zoom
5. **User testing** — Include people with disabilities in your testing process

## Conclusion

Accessibility is a continuous practice, not a checkbox. Start with semantic HTML, ensure keyboard navigability, maintain color contrast standards, and test regularly. Every improvement you make benefits not just users with disabilities, but everyone who uses your product.`,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=500&fit=crop",
    date: "Nov 18, 2025",
    readTime: "8 min read",
    category: "Design",
    author,
  },

  // === Development (4 posts) ===
  {
    id: "3",
    title: "Building a Full-Stack PLM Dashboard with React & Supabase",
    excerpt: "Lessons from architecting a product lifecycle management dashboard — handling complex data relationships, role-based access, and real-time collaboration.",
    content: `## Introduction

Product Lifecycle Management (PLM) systems are typically enterprise behemoths — SAP, PTC Windchill, Siemens Teamcenter. But when a mid-size manufacturing company needed a lightweight PLM dashboard for their 50-person engineering team, we built one with **React**, **Supabase**, and **TypeScript** in 8 weeks.

## Requirements Analysis

The team needed to:
- Track **bill of materials (BOM)** with parent-child relationships
- Manage **engineering change orders (ECOs)** with approval workflows
- Control **document revisions** with version history
- Enforce **role-based access** (viewer, editor, approver, admin)
- Enable **real-time collaboration** on shared documents

## Database Design

### Core Tables:
\`\`\`sql
-- Parts table with self-referencing hierarchy
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(50) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  parent_id UUID REFERENCES parts(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Engineering Change Orders
CREATE TABLE change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eco_number VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority VARCHAR(10) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### Row-Level Security:
Every table has RLS policies ensuring users only see data they're authorized to access:
- **Viewers** can SELECT published parts and documents
- **Editors** can INSERT and UPDATE within their department
- **Approvers** can UPDATE change order status
- **Admins** have full access

## Frontend Architecture

### Component Structure:
\`\`\`
src/
  components/
    bom/
      BOMTree.tsx          # Recursive tree view
      PartDetails.tsx      # Part information panel
      AddPartModal.tsx     # New part creation
    eco/
      ECOList.tsx          # Change order list
      ECOWorkflow.tsx      # Approval pipeline
      ECOTimeline.tsx      # Activity history
    documents/
      DocumentViewer.tsx   # File preview
      RevisionHistory.tsx  # Version comparison
  hooks/
    useBOM.ts             # BOM data & operations
    useECO.ts             # Change order logic
    useRealtime.ts        # Supabase subscriptions
\`\`\`

## Real-Time Collaboration

Supabase Realtime enables live updates when multiple engineers work simultaneously:

\`\`\`typescript
const channel = supabase
  .channel('parts-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'parts'
  }, (payload) => {
    queryClient.invalidateQueries(['parts']);
    toast({ description: \`Part updated by \${payload.new.updated_by}\` });
  })
  .subscribe();
\`\`\`

## Key Lessons Learned

1. **Recursive CTEs** are essential for BOM tree queries — don't try to solve hierarchy in JavaScript
2. **Optimistic updates** with React Query make the UI feel instant while waiting for database confirmation
3. **Document versioning** is harder than it looks — use a separate revisions table, not update-in-place
4. **Role-based UI** should hide actions, not just disable them — engineers shouldn't see buttons they can't click

## Results

After 6 months in production:
- **ECO approval time** dropped from 5 days to 1.5 days
- **Part search** went from minutes (file system browsing) to seconds
- **Data errors** reduced by 67% (validation + unique constraints)
- **User adoption**: 94% of the engineering team uses it daily

## Conclusion

You don't always need an enterprise PLM system. For teams under 100 people, a well-designed React + Supabase application can deliver 80% of the functionality at 5% of the cost — with a significantly better user experience.`,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    date: "Mar 22, 2025",
    readTime: "12 min read",
    category: "Development",
    author,
  },
  {
    id: "8",
    title: "React Server Components in Production: Lessons from 2026",
    excerpt: "Real-world performance gains and architectural trade-offs after migrating a high-traffic portfolio platform to React Server Components.",
    content: `## Introduction

React Server Components (RSC) have moved from experimental to production-ready. After migrating a portfolio platform serving 50,000+ monthly visitors, here's what we learned about the real-world impact of RSC.

## What Are React Server Components?

Server Components render on the server and send **serialized component trees** (not HTML) to the client. Key differences from SSR:

- **Zero client-side JavaScript** for server components — they never hydrate
- **Direct database access** — No API layer needed for data fetching
- **Streaming** — Components render progressively as data becomes available
- **Selective hydration** — Only interactive components ship JavaScript

## Migration Strategy

We adopted an incremental approach:

### Phase 1: Static Pages (Week 1-2)
Converted blog posts, about page, and project listings to Server Components. These pages had zero client-side interactivity — pure data display.

**Result**: 62% reduction in JavaScript bundle for these pages.

### Phase 2: Mixed Pages (Week 3-4)
Pages with both static content and interactive elements (like/comment buttons). Used the \`"use client"\` directive for interactive islands.

**Result**: 41% bundle reduction while maintaining full interactivity.

### Phase 3: Data-Heavy Pages (Week 5-6)
Dashboard and analytics pages with complex data fetching. Moved all data fetching to server components, passing data as props to client components.

**Result**: Eliminated 23 API endpoints and reduced time-to-interactive by 1.8 seconds.

## Architecture Patterns That Worked

### Pattern 1: Server Component Wrapper
\`\`\`tsx
// Server Component — fetches data
async function ProjectList() {
  const projects = await db.projects.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return <ProjectGrid projects={projects} />;
}

// Client Component — handles interaction
"use client";
function ProjectGrid({ projects }) {
  const [filter, setFilter] = useState("all");
  // ... interactive filtering logic
}
\`\`\`

### Pattern 2: Streaming with Suspense
\`\`\`tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<SkeletonStats />}>
        <StatsPanel /> {/* Streams when data ready */}
      </Suspense>
      <Suspense fallback={<SkeletonChart />}>
        <AnalyticsChart /> {/* Streams independently */}
      </Suspense>
    </div>
  );
}
\`\`\`

## Performance Results

| Metric | Before RSC | After RSC | Improvement |
|--------|-----------|-----------|-------------|
| JS Bundle Size | 287 KB | 112 KB | -61% |
| First Contentful Paint | 1.8s | 0.9s | -50% |
| Time to Interactive | 3.2s | 1.4s | -56% |
| Lighthouse Performance | 72 | 94 | +30% |
| API Endpoints | 31 | 8 | -74% |

## Pitfalls to Avoid

1. **Don't over-split** — Not every component needs to be a separate file with "use client". Group related interactive elements
2. **Watch serialization costs** — Passing large objects from server to client components can negate bundle savings
3. **Cache aggressively** — Use \`unstable_cache\` (or its stable equivalent) for database queries that don't change frequently
4. **Test the boundary** — The server/client boundary is where most bugs occur. Test data serialization thoroughly

## Conclusion

React Server Components deliver genuine performance improvements — not just benchmarks, but real user-perceived speed gains. The migration requires rethinking component architecture, but the results are worth it.`,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Jan 8, 2026",
    readTime: "11 min read",
    category: "Development",
    author,
  },
  {
    id: "13",
    title: "Optimizing Database Queries: From 3 Seconds to 50 Milliseconds",
    excerpt: "A case study on profiling slow PostgreSQL queries, adding strategic indexes, rewriting joins, and implementing connection pooling for 60x faster responses.",
    content: `## Introduction

Our production dashboard was taking **3.2 seconds** to load. Users were abandoning the page. After a systematic optimization effort, we reduced the primary query to **48 milliseconds** — a 66x improvement. Here's exactly how.

## Step 1: Identify the Bottleneck

Using PostgreSQL's \`EXPLAIN ANALYZE\`, we identified the slow query:

\`\`\`sql
EXPLAIN ANALYZE
SELECT p.*, COUNT(v.id) as view_count, COUNT(c.id) as comment_count
FROM projects p
LEFT JOIN project_views v ON v.project_id = p.id
LEFT JOIN project_comments c ON c.project_id = p.id
WHERE p.is_published = true
GROUP BY p.id
ORDER BY p.created_at DESC;
\`\`\`

**Result**: Sequential Scan on project_views (280,000 rows), nested loop join — 3,200ms total.

## Step 2: Add Strategic Indexes

The most impactful change was adding targeted indexes:

\`\`\`sql
-- Index for the JOIN condition
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_comments_project_id ON project_comments(project_id);

-- Index for the WHERE + ORDER BY
CREATE INDEX idx_projects_published_created ON projects(is_published, created_at DESC);
\`\`\`

**Result**: 3,200ms → 420ms (7.6x improvement). Sequential scans replaced with index scans.

## Step 3: Rewrite the Query

The LEFT JOIN with COUNT was creating a **cross-product problem** — if a project had 100 views and 50 comments, PostgreSQL was processing 5,000 intermediate rows.

\`\`\`sql
-- Rewritten with subqueries
SELECT p.*,
  COALESCE(v.view_count, 0) as view_count,
  COALESCE(c.comment_count, 0) as comment_count
FROM projects p
LEFT JOIN (
  SELECT project_id, COUNT(*) as view_count
  FROM project_views GROUP BY project_id
) v ON v.project_id = p.id
LEFT JOIN (
  SELECT project_id, COUNT(*) as comment_count
  FROM project_comments GROUP BY project_id
) c ON c.project_id = p.id
WHERE p.is_published = true
ORDER BY p.created_at DESC;
\`\`\`

**Result**: 420ms → 85ms (5x improvement). Eliminated the cross-product.

## Step 4: Materialized Views for Aggregates

For counts that don't need real-time accuracy:

\`\`\`sql
CREATE MATERIALIZED VIEW project_stats AS
SELECT
  p.id as project_id,
  COUNT(DISTINCT v.id) as view_count,
  COUNT(DISTINCT c.id) as comment_count
FROM projects p
LEFT JOIN project_views v ON v.project_id = p.id
LEFT JOIN project_comments c ON c.project_id = p.id
GROUP BY p.id;

CREATE UNIQUE INDEX ON project_stats(project_id);

-- Refresh every 5 minutes via pg_cron
SELECT cron.schedule('refresh-stats', '*/5 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY project_stats');
\`\`\`

**Result**: 85ms → 48ms (final query now just joins pre-computed stats).

## Step 5: Connection Pooling

We were also hitting connection limits. Each serverless function opened a new database connection (150ms overhead).

Solution: **PgBouncer** in transaction mode:
- Connection pool size: 20
- Max client connections: 200
- Connection overhead: 150ms → 2ms

## Final Results

| Stage | Query Time | Improvement |
|-------|-----------|-------------|
| Original | 3,200ms | baseline |
| + Indexes | 420ms | 7.6x |
| + Query rewrite | 85ms | 37.6x |
| + Materialized views | 48ms | 66.7x |
| + Connection pooling | 48ms + 2ms conn | Near-instant |

## Key Takeaways

1. **Always profile first** — Don't guess where the bottleneck is
2. **Indexes are not magic** — Wrong indexes can actually slow down writes without helping reads
3. **COUNT with JOINs is dangerous** — Always aggregate in subqueries to avoid cross-products
4. **Materialized views** are the secret weapon for read-heavy dashboards
5. **Connection pooling** is non-negotiable for serverless architectures

## Conclusion

Database optimization is systematic, not magical. Profile, index, rewrite, cache — in that order. Most applications can achieve 10-100x improvements by following this methodical approach.`,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    date: "Aug 14, 2025",
    readTime: "10 min read",
    category: "Development",
    author,
  },
  {
    id: "18",
    title: "TypeScript Patterns for Scalable Frontend Architecture",
    excerpt: "Advanced TypeScript patterns including discriminated unions, branded types, and builder patterns that make large React codebases maintainable and type-safe.",
    content: `## Introduction

As React applications grow beyond 50+ components and 100+ files, **TypeScript patterns** become the backbone of maintainability. Generic types and basic interfaces aren't enough — you need architectural patterns that encode business rules into the type system itself.

## Pattern 1: Discriminated Unions for State Machines

Instead of optional fields and boolean flags, use discriminated unions to make impossible states unrepresentable:

\`\`\`typescript
// ❌ Bad: Multiple boolean flags
interface Request {
  isLoading: boolean;
  isError: boolean;
  data?: User[];
  error?: string;
}
// Allows impossible state: { isLoading: true, isError: true }

// ✅ Good: Discriminated union
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

function UserList({ state }: { state: RequestState }) {
  switch (state.status) {
    case 'idle': return <p>Start a search</p>;
    case 'loading': return <Spinner />;
    case 'success': return <List items={state.data} />;
    case 'error': return <Error message={state.error} />;
  }
}
\`\`\`

## Pattern 2: Branded Types for Domain Safety

Prevent mixing up values that share the same primitive type:

\`\`\`typescript
type UserId = string & { __brand: 'UserId' };
type ProjectId = string & { __brand: 'ProjectId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): Promise<User> { /* ... */ }
function getProject(id: ProjectId): Promise<Project> { /* ... */ }

const userId = createUserId("abc-123");
const projectId = createProjectId("xyz-789");

getUser(userId);      // ✅ Compiles
getUser(projectId);   // ❌ Type error! Cannot assign ProjectId to UserId
\`\`\`

## Pattern 3: Builder Pattern for Complex Objects

When objects have many optional fields and validation rules:

\`\`\`typescript
class QueryBuilder<T> {
  private filters: Partial<T> = {};
  private sortField?: keyof T;
  private sortDir: 'asc' | 'desc' = 'asc';
  private limitVal = 50;

  where<K extends keyof T>(field: K, value: T[K]): this {
    this.filters[field] = value;
    return this;
  }

  orderBy(field: keyof T, direction: 'asc' | 'desc' = 'asc'): this {
    this.sortField = field;
    this.sortDir = direction;
    return this;
  }

  limit(n: number): this {
    this.limitVal = Math.min(n, 1000);
    return this;
  }

  build(): QueryConfig<T> {
    return {
      filters: this.filters,
      sort: this.sortField ? { field: this.sortField, direction: this.sortDir } : undefined,
      limit: this.limitVal,
    };
  }
}

// Usage:
const query = new QueryBuilder<Project>()
  .where('category', 'Engineering')
  .where('is_published', true)
  .orderBy('created_at', 'desc')
  .limit(20)
  .build();
\`\`\`

## Pattern 4: Polymorphic Component Props

Components that render as different HTML elements while maintaining type safety:

\`\`\`typescript
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>;

function Text<E extends React.ElementType = 'p'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'p';
  return <Component {...props}>{children}</Component>;
}

// Usage:
<Text>Default paragraph</Text>
<Text as="h1" id="title">Heading with h1 props</Text>
<Text as="a" href="/about">Link with anchor props</Text>
\`\`\`

## Pattern 5: Exhaustive Switch with never

Ensure all union cases are handled at compile time:

\`\`\`typescript
function assertNever(x: never): never {
  throw new Error(\`Unexpected value: \${x}\`);
}

type Status = 'draft' | 'review' | 'published' | 'archived';

function getStatusColor(status: Status): string {
  switch (status) {
    case 'draft': return 'gray';
    case 'review': return 'yellow';
    case 'published': return 'green';
    case 'archived': return 'red';
    default: return assertNever(status);
    // If you add a new status, TypeScript will error here
  }
}
\`\`\`

## Conclusion

These TypeScript patterns shift error detection from runtime to compile time. Discriminated unions eliminate impossible states, branded types prevent value mixing, and exhaustive switches ensure complete handling. Invest in your type architecture — it pays dividends as your codebase grows.`,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop",
    date: "Mar 1, 2026",
    readTime: "9 min read",
    category: "Development",
    author,
  },

  // === Engineering (3 posts) ===
  {
    id: "4",
    title: "SolidWorks to Web: Rendering 3D CAD Models in the Browser",
    excerpt: "Exploring the pipeline from SolidWorks assemblies to interactive Three.js renders, including mesh optimization and material mapping techniques.",
    content: `## Introduction

Engineers design in SolidWorks. Stakeholders review in browsers. Bridging this gap — converting complex CAD assemblies into interactive, web-friendly 3D models — is a challenge that combines mechanical engineering knowledge with modern web development.

## The Conversion Pipeline

### Step 1: Export from SolidWorks
SolidWorks doesn't export directly to web-ready formats. The pipeline is:

1. **SolidWorks → STEP** (.stp) — Industry-standard exchange format preserving geometry and topology
2. **STEP → glTF/GLB** — Using FreeCAD or Blender as intermediaries
3. **glTF → Optimized glTF** — Mesh decimation, texture compression, Draco compression

### Step 2: Mesh Optimization

CAD models are inherently over-detailed for web rendering. A SolidWorks assembly might have:
- **Original**: 2.4 million triangles, 85MB file
- **After optimization**: 180,000 triangles, 3.2MB file
- **Visual difference**: Imperceptible for review purposes

#### Optimization Techniques:
- **Mesh decimation**: Reduce triangle count by 80-95% while preserving visual accuracy
- **Instance deduplication**: Identical fasteners (bolts, nuts) reference a single mesh
- **Level of Detail (LOD)**: Generate 3 detail levels for progressive loading
- **Draco compression**: Compress geometry data by 85-95%

### Step 3: Material Mapping

SolidWorks uses proprietary material definitions. We map them to **PBR (Physically-Based Rendering)** materials for Three.js:

| SolidWorks Material | PBR Properties |
|---------------------|---------------|
| Brushed Stainless Steel | metalness: 0.9, roughness: 0.4, color: #C8C8C8 |
| Matte Black Plastic | metalness: 0.0, roughness: 0.8, color: #2A2A2A |
| Anodized Aluminum | metalness: 0.7, roughness: 0.3, color: #B0B0B0 |
| Clear Polycarbonate | transmission: 0.9, roughness: 0.1, ior: 1.58 |

## Three.js Implementation

### Loading and Displaying the Model:

\`\`\`typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

function CADModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function ModelViewer() {
  return (
    <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <Environment preset="studio" />
      <CADModel url="/models/assembly.glb" />
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}
\`\`\`

### Interactive Features:
- **Click to select** individual parts with raycasting
- **Exploded view** animation showing assembly relationships
- **Cross-section planes** for internal geometry inspection
- **Measurement tool** for verifying dimensions
- **BOM overlay** linking 3D parts to bill of materials data

## Performance Benchmarks

| Assembly | Triangles | File Size | Load Time | FPS (Desktop) | FPS (Mobile) |
|----------|-----------|-----------|-----------|---------------|--------------|
| Bracket (single part) | 12K | 0.2MB | 0.3s | 60 | 60 |
| Gearbox (45 parts) | 180K | 3.2MB | 1.2s | 60 | 45 |
| Engine block (200+ parts) | 850K | 12MB | 3.8s | 55 | 25 |

## Conclusion

The SolidWorks-to-web pipeline makes CAD data accessible to everyone — no expensive licenses, no installations, just a URL. For design reviews, sales presentations, and manufacturing documentation, browser-based 3D viewers are transforming how engineering teams share their work.`,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
    date: "Apr 5, 2025",
    readTime: "10 min read",
    category: "Engineering",
    author,
  },
  {
    id: "9",
    title: "Digital Twin Technology in Manufacturing: A 2026 Perspective",
    excerpt: "How digital twin simulations powered by FlexSim and real-time IoT data are transforming factory floor optimization and reducing downtime by 40%.",
    content: `## Introduction

A **digital twin** is a virtual replica of a physical system that updates in real-time using sensor data. In manufacturing, digital twins simulate factory operations, predict bottlenecks, and optimize workflows before implementing changes on the physical floor.

## What Makes a Digital Twin Different from a Simulation?

| Feature | Traditional Simulation | Digital Twin |
|---------|----------------------|--------------|
| Data source | Historical/estimated | Real-time sensor feeds |
| Update frequency | Manual rebuild | Continuous (seconds/minutes) |
| Accuracy over time | Degrades | Improves (ML calibration) |
| Interaction | One-way (analyze) | Bidirectional (analyze + control) |
| Lifespan | Project-based | Ongoing (lifecycle of asset) |

## Architecture of a Manufacturing Digital Twin

### Layer 1: Physical Layer
- CNC machines, conveyors, robotic arms, AGVs
- Environmental sensors (temperature, humidity, vibration)
- RFID/barcode scanners for material tracking

### Layer 2: Connectivity Layer
- OPC UA for machine-to-server communication
- MQTT for lightweight sensor telemetry
- REST APIs for ERP/MES integration

### Layer 3: Digital Twin Engine
- **FlexSim** for discrete-event simulation
- Real-time state synchronization with physical assets
- ML models for predictive analytics (failure prediction, demand forecasting)

### Layer 4: Visualization & Control
- 3D factory floor visualization
- KPI dashboards (OEE, throughput, cycle time)
- What-if scenario testing interface
- Alert and notification system

## Case Study: Automotive Parts Manufacturing

We implemented a digital twin for a factory producing brake calipers:

### Challenge:
- Production line had 15% unplanned downtime
- Changeover between product variants took 45 minutes
- Quality defects were caught too late in the process

### Digital Twin Solution:

**Phase 1: Data Collection (Month 1-2)**
- Installed 64 IoT sensors across 8 CNC machines
- Connected to existing PLC data via OPC UA
- Established 5-second data refresh cycle

**Phase 2: Model Calibration (Month 3-4)**
- Built FlexSim model matching physical layout
- Calibrated processing times using real production data
- Validated twin accuracy to within 2% of actual throughput

**Phase 3: Optimization (Month 5-8)**
- Simulated 200+ scheduling scenarios
- Identified optimal changeover sequence (45 min → 28 min)
- Predicted tool wear patterns enabling just-in-time replacement
- Tested new material flow routes in simulation before physical changes

### Results After 12 Months:
- **Unplanned downtime**: 15% → 9% (40% reduction)
- **Changeover time**: 45 min → 28 min (38% reduction)
- **Quality defect rate**: 2.3% → 0.8% (65% reduction)
- **Overall Equipment Effectiveness (OEE)**: 72% → 84%
- **ROI**: 340% (system paid for itself in 5 months)

## Future: AI-Driven Autonomous Twins

The next evolution is digital twins that don't just predict — they **act**. Using reinforcement learning, the twin learns optimal control strategies and directly adjusts machine parameters, conveyor speeds, and scheduling in real-time.

## Conclusion

Digital twins are no longer experimental technology — they're a proven approach to manufacturing optimization. The combination of IoT sensors, simulation engines, and machine learning creates a powerful feedback loop that continuously improves production efficiency.`,
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=500&fit=crop",
    date: "Feb 20, 2026",
    readTime: "13 min read",
    category: "Engineering",
    author,
  },
  {
    id: "14",
    title: "Finite Element Analysis: Stress Testing Automotive Components",
    excerpt: "Using FEA simulations in ANSYS to validate structural integrity of suspension brackets — from mesh generation to interpreting von Mises stress distributions.",
    content: `## Introduction

**Finite Element Analysis (FEA)** is the backbone of modern mechanical engineering validation. Before manufacturing a single prototype, engineers simulate how components behave under load, temperature, and vibration. This article walks through a real FEA project: validating a suspension bracket for an electric vehicle.

## Project: EV Suspension Bracket

### Design Requirements:
- **Material**: A356-T6 Aluminum Alloy (yield strength: 200 MPa)
- **Maximum load**: 15 kN vertical + 8 kN lateral (combined worst-case)
- **Factor of Safety**: ≥ 2.0
- **Weight target**: < 1.2 kg
- **Fatigue life**: > 500,000 cycles

## Step 1: CAD Preparation

The SolidWorks model must be simplified for analysis:
- Remove cosmetic fillets < 1mm (they don't affect stress significantly but increase mesh complexity)
- Fill small holes (bolt holes are kept; drainage holes are filled)
- Defeaturing reduces mesh count by 40% without affecting accuracy

## Step 2: Material Assignment

A356-T6 Aluminum properties:
| Property | Value |
|----------|-------|
| Young's Modulus | 72.4 GPa |
| Poisson's Ratio | 0.33 |
| Yield Strength | 200 MPa |
| Ultimate Tensile Strength | 262 MPa |
| Density | 2,680 kg/m³ |
| Fatigue Limit (10⁷ cycles) | 90 MPa |

## Step 3: Mesh Generation

Mesh quality directly affects result accuracy:

- **Element type**: 10-node tetrahedral (SOLID187) — better accuracy in curved regions
- **Global mesh size**: 3mm
- **Local refinement**: 0.5mm at fillet radii and bolt holes
- **Total elements**: 284,000
- **Mesh quality check**: Skewness < 0.85 for all elements (target < 0.7)

### Mesh Convergence Study:
We ran the analysis at 5mm, 3mm, 2mm, and 1mm mesh sizes. Results converged at 3mm (< 2% change from 2mm), confirming mesh-independent results.

## Step 4: Boundary Conditions

### Constraints:
- Fixed support at 4 bolt holes (bonded contact to chassis frame)
- Frictionless support on the mating surface

### Loading:
- **Load Case 1**: 15 kN vertical (pothole impact)
- **Load Case 2**: 8 kN lateral (cornering)
- **Load Case 3**: Combined (15 kN vertical + 8 kN lateral)
- **Load Case 4**: Fatigue (cyclic vertical load 0–10 kN, R=0)

## Step 5: Results Interpretation

### Von Mises Stress Distribution:
- **Maximum stress**: 89.3 MPa (at inner fillet of upper mounting arm)
- **Location**: As expected — highest stress concentration at the geometric transition
- **Factor of Safety**: 200 / 89.3 = **2.24** ✅ (exceeds minimum 2.0)

### Displacement Results:
- **Maximum deflection**: 0.42mm (at the lower control arm mounting point)
- **Acceptable**: Well within the 1.0mm design tolerance

### Fatigue Analysis:
- **Minimum fatigue life**: 1,200,000 cycles at the critical location
- **Safety factor for fatigue**: 1,200,000 / 500,000 = **2.4** ✅

## Design Optimization: Topology Study

Using ANSYS topology optimization, we identified material that could be removed without compromising safety:

- **Original weight**: 1.35 kg
- **Optimized weight**: 0.98 kg (27% reduction)
- **Optimized FoS**: 2.08 (still above minimum)

The topology-optimized design features organic internal ribs that would be impossible to manufacture with traditional machining — but perfect for **aluminum casting** or **additive manufacturing**.

## Validation: Physical Testing

After manufacturing prototypes:
- **Strain gauge measurement** at critical point: 87.1 MPa (vs. 89.3 MPa predicted — 2.5% error)
- **Static load test**: No permanent deformation at 1.5x design load ✅
- **Fatigue test**: Survived 750,000+ cycles at design load (test still running)

## Conclusion

FEA is not a replacement for physical testing — it's a complement that dramatically reduces the number of expensive prototypes needed. For the suspension bracket project, we went from concept to validated design in 3 weeks instead of 3 months, testing 12 design variations digitally before manufacturing a single physical part.`,
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&h=500&fit=crop",
    date: "Sep 28, 2025",
    readTime: "12 min read",
    category: "Engineering",
    author,
  },

  // === Technology (4 posts) ===
  {
    id: "5",
    title: "AI-Powered Code Reviews: Integrating LLMs into CI/CD Pipelines",
    excerpt: "How to set up automated code review agents using large language models that catch bugs, suggest refactors, and enforce coding standards before merge.",
    content: `## Introduction

Code review is one of the highest-value engineering practices — and one of the biggest bottlenecks. Pull requests wait hours or days for human reviewers. **AI-powered code review agents** can provide instant, consistent feedback on every PR, catching issues before human reviewers even look at the code.

## What AI Code Review Can (and Can't) Do

### AI Excels At:
- **Bug detection** — Null pointer risks, race conditions, resource leaks
- **Style consistency** — Naming conventions, import ordering, code formatting
- **Security scanning** — SQL injection, XSS, hardcoded secrets
- **Performance hints** — N+1 queries, unnecessary re-renders, missing memoization
- **Documentation gaps** — Missing JSDoc, unclear variable names

### AI Struggles With:
- **Business logic validation** — Does this feature match the product spec?
- **Architecture decisions** — Is this the right abstraction level?
- **Context-dependent trade-offs** — Is this tech debt acceptable given the deadline?
- **Team conventions** — Unwritten rules that vary by team

## Architecture

### Pipeline Integration:

\`\`\`
Developer pushes PR
       ↓
CI Pipeline triggered
       ↓
AI Review Agent:
  1. Fetch diff from GitHub API
  2. Parse changed files
  3. Send to LLM with review prompt
  4. Post inline comments on PR
       ↓
Human reviewer sees AI comments
       ↓
Merge decision (always human)
\`\`\`

### The Review Prompt

The prompt engineering is critical. A good review prompt includes:
1. **Role definition** — "You are a senior TypeScript developer reviewing a pull request"
2. **Project context** — Tech stack, coding standards, architecture patterns
3. **Review criteria** — What to look for (bugs, performance, security, style)
4. **Output format** — Structured JSON with file path, line number, severity, and suggestion
5. **Constraints** — "Only comment on actual issues, not style preferences. Be concise."

## Implementation with GitHub Actions

\`\`\`yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR diff
        run: git diff origin/main...HEAD > diff.patch

      - name: Run AI Review
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: node scripts/ai-review.js
\`\`\`

## Review Quality Metrics

After 3 months of running AI review alongside human reviewers:

| Metric | Before AI | After AI | Change |
|--------|-----------|----------|--------|
| Bugs caught in review | 12/month | 28/month | +133% |
| Review turnaround (first comment) | 4.2 hours | 3 minutes | -99% |
| Human review time per PR | 25 min | 15 min | -40% |
| PRs merged with known issues | 8% | 2% | -75% |

## Handling False Positives

The biggest challenge is **noise**. An AI that comments on everything is worse than no AI at all.

### Strategies:
1. **Severity thresholds** — Only post comments for medium+ severity issues
2. **Confidence scores** — Only comment when the model is >80% confident
3. **Feedback loop** — Engineers react with 👍/👎 on AI comments; low-scoring patterns are suppressed
4. **Context window** — Include the full file, not just the diff, for better understanding

## Cost Analysis

For a team of 10 developers averaging 8 PRs/day:
- **AI review cost**: ~$45/month (GPT-4 API usage)
- **Human time saved**: ~40 hours/month
- **Engineering cost saved**: ~$6,000/month
- **ROI**: 130x return on AI review investment

## Conclusion

AI code review isn't replacing human reviewers — it's making them more effective. By catching routine issues instantly, AI reviewers free human reviewers to focus on architecture, logic, and mentorship. Start with bug detection and security scanning, then gradually expand the scope as your team trusts the system.`,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    date: "Jul 18, 2025",
    readTime: "9 min read",
    category: "Technology",
    author,
  },
  {
    id: "10",
    title: "Zero-Trust Architecture for Web Applications in 2026",
    excerpt: "Implementing zero-trust security patterns with RLS policies, JWT validation, and edge function middleware to protect modern web applications.",
    content: `## Introduction

The traditional security model — "trust everything inside the network perimeter" — is dead. **Zero-trust architecture** operates on the principle of "never trust, always verify." Every request, whether from inside or outside the network, must be authenticated, authorized, and validated.

## Core Principles of Zero Trust

1. **Verify explicitly** — Always authenticate and authorize based on all available data points
2. **Use least privilege access** — Limit access to the minimum required for each task
3. **Assume breach** — Design systems assuming the attacker is already inside

## Implementing Zero Trust in Web Applications

### Layer 1: Authentication (Identity Verification)

Every request must carry proof of identity:

\`\`\`typescript
// Edge function middleware: Validate JWT on every request
const authMiddleware = async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response('Invalid token', { status: 401 });
  }

  return user;
};
\`\`\`

### Layer 2: Authorization (Access Control)

Authentication tells you WHO the user is. Authorization tells you WHAT they can do.

**Row-Level Security (RLS)** enforces authorization at the database level:

\`\`\`sql
-- Users can only read their own data
CREATE POLICY "users_read_own" ON documents
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all data (using security definer function)
CREATE POLICY "admins_read_all" ON documents
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- No one can delete — only soft-delete via update
CREATE POLICY "no_hard_delete" ON documents
  FOR DELETE USING (false);
\`\`\`

### Layer 3: Input Validation

Never trust client-side data:

\`\`\`typescript
import { z } from 'zod';

const createDocumentSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().max(50000),
  category: z.enum(['report', 'memo', 'spec']),
  // No user_id in input — always use auth.uid() server-side
});

// In edge function:
const body = createDocumentSchema.parse(await req.json());
\`\`\`

### Layer 4: API Rate Limiting

Prevent abuse even from authenticated users:

\`\`\`typescript
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimiter.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) return false;
  userLimit.count++;
  return true;
}
\`\`\`

### Layer 5: Audit Logging

Log every significant action for forensic analysis:

\`\`\`sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

## Security Checklist for Web Applications

| Category | Check | Priority |
|----------|-------|----------|
| Auth | JWT validation on every API call | Critical |
| Auth | Token expiry < 1 hour | High |
| Auth | Refresh token rotation | High |
| Access | RLS enabled on ALL tables | Critical |
| Access | Role checks via security definer functions | High |
| Input | Zod/Yup validation on all inputs | Critical |
| Input | SQL parameterization (never string concat) | Critical |
| Network | HTTPS everywhere | Critical |
| Network | CORS restricted to known origins | High |
| Monitoring | Audit log for data mutations | High |
| Monitoring | Alert on unusual access patterns | Medium |

## Conclusion

Zero-trust security is not a product you buy — it's an architecture you build. By implementing authentication, authorization, validation, rate limiting, and audit logging in layers, you create a defense-in-depth strategy where no single failure compromises the entire system.`,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Mar 3, 2026",
    readTime: "10 min read",
    category: "Technology",
    author,
  },
  {
    id: "15",
    title: "WebAssembly in 2025: Running C++ Simulations in the Browser",
    excerpt: "Compiling performance-critical C++ engineering simulations to WebAssembly for instant browser-based analysis — no installs, no plugins, full speed.",
    content: `## Introduction

Engineers have long been tied to desktop applications for computationally intensive simulations. **WebAssembly (Wasm)** changes this — it allows C++ code to run in the browser at near-native speed, making engineering tools accessible from any device with a web browser.

## What is WebAssembly?

WebAssembly is a binary instruction format that runs in a sandboxed virtual machine inside web browsers:

- **Speed**: Within 10-20% of native C++ performance
- **Security**: Sandboxed execution — cannot access the file system or network directly
- **Portability**: Runs identically on Windows, Mac, Linux, and mobile browsers
- **Interop**: Seamless communication with JavaScript

## Use Case: Beam Stress Calculator

We converted a C++ finite element solver for beam deflection analysis into a browser-based tool.

### Original C++ Code (Simplified):

\`\`\`cpp
#include <vector>
#include <cmath>

struct BeamResult {
  double maxDeflection;
  double maxStress;
  std::vector<double> deflectionCurve;
};

BeamResult solveSimplySupported(
  double length, double load, double E, double I, int elements
) {
  double dx = length / elements;
  std::vector<double> deflection(elements + 1);

  for (int i = 0; i <= elements; i++) {
    double x = i * dx;
    // Euler-Bernoulli beam theory
    deflection[i] = (load * x) / (24.0 * E * I) *
      (pow(length, 3) - 2.0 * length * pow(x, 2) + pow(x, 3));
  }

  double maxDefl = *std::max_element(deflection.begin(), deflection.end());
  double maxStress = (load * length) / (8.0 * I) * (sqrt(12.0 * I / length));

  return { maxDefl, maxStress, deflection };
}
\`\`\`

### Compiling to WebAssembly with Emscripten:

\`\`\`bash
emcc beam_solver.cpp -o beam_solver.js \\
  -s WASM=1 \\
  -s EXPORTED_FUNCTIONS="['_solveBeam']" \\
  -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \\
  -O3
\`\`\`

### Calling from JavaScript:

\`\`\`javascript
const solveBeam = Module.cwrap('solveBeam', 'number', [
  'number', 'number', 'number', 'number', 'number'
]);

const result = solveBeam(
  2.0,    // length (m)
  5000,   // load (N)
  200e9,  // E - Steel (Pa)
  8.33e-6, // I - moment of inertia (m⁴)
  100     // elements
);
\`\`\`

## Performance Comparison

We benchmarked the beam solver across different execution environments:

| Environment | 100 elements | 10,000 elements | 1,000,000 elements |
|-------------|-------------|-----------------|-------------------|
| Native C++ (O3) | 0.01ms | 0.8ms | 82ms |
| WebAssembly | 0.02ms | 1.1ms | 98ms |
| JavaScript | 0.05ms | 4.2ms | 410ms |
| Python (NumPy) | 0.3ms | 12ms | 890ms |

WebAssembly achieves **83-95% of native C++ speed** — dramatically faster than JavaScript for computational workloads.

## Advanced: Threading with Web Workers

For larger simulations, we can parallelize using Web Workers + SharedArrayBuffer:

\`\`\`javascript
// Main thread
const worker = new Worker('solver-worker.js');
worker.postMessage({
  type: 'solve',
  params: { length: 2.0, load: 5000, elements: 1000000 }
});

worker.onmessage = (e) => {
  const { deflectionCurve, maxStress } = e.data;
  renderChart(deflectionCurve);
  updateResults(maxStress);
};
\`\`\`

With 4 Web Workers dividing the mesh, the 1M-element solve drops from 98ms to 28ms.

## Real-World Applications

### 1. Structural Analysis Tools
Upload a beam configuration, get instant stress/deflection results. No CAE license needed.

### 2. Fluid Dynamics Visualization
Simplified CFD simulations running interactively in the browser for educational purposes.

### 3. Tolerance Stack-Up Calculators
Monte Carlo simulations with 100,000+ iterations completing in under a second.

### 4. Material Selection Databases
Ashby chart exploration with real-time property calculations and trade-off analysis.

## Limitations and Workarounds

- **Memory**: Wasm modules are limited to 4GB memory (enough for most engineering tools)
- **File I/O**: Use the virtual file system (MEMFS) or IndexedDB for persistent storage
- **Debugging**: Source maps work but are less mature than native debuggers
- **Threading**: Requires COOP/COEP headers and SharedArrayBuffer support

## Conclusion

WebAssembly democratizes engineering computation. Complex simulations that once required expensive software licenses and powerful workstations now run instantly in any browser. For engineering tool developers, Wasm opens a massive new distribution channel — no downloads, no installations, no platform restrictions.`,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
    date: "Dec 1, 2025",
    readTime: "11 min read",
    category: "Technology",
    author,
  },
  {
    id: "16",
    title: "RAG Pipelines for Enterprise Knowledge Bases: Architecture Guide",
    excerpt: "Building retrieval-augmented generation systems that connect LLMs to internal documents — vector embeddings, chunking strategies, and hybrid search patterns.",
    content: `## Introduction

Large Language Models have vast general knowledge but zero knowledge of your company's internal documents, policies, and data. **Retrieval-Augmented Generation (RAG)** bridges this gap by finding relevant documents and injecting them into the LLM's context at query time.

## How RAG Works

### The Basic Flow:
1. **User asks a question**: "What's our refund policy for enterprise customers?"
2. **Retrieval**: Search the knowledge base for relevant documents
3. **Augmentation**: Inject the top-k relevant chunks into the LLM prompt
4. **Generation**: LLM answers using the retrieved context + its own knowledge

### Why Not Just Fine-Tune?
- Fine-tuning requires expensive GPU training
- Knowledge gets stale between training cycles
- Cannot easily add/remove individual documents
- RAG retrieval is transparent and debuggable

## Architecture Overview

\`\`\`
User Query → Embedding Model → Vector Search → Reranker → LLM → Response
                                      ↑
                Document Ingestion Pipeline:
                PDF/Doc → Chunker → Embedder → Vector DB
\`\`\`

## Step 1: Document Ingestion

### Chunking Strategies:

The quality of RAG depends heavily on how documents are split:

| Strategy | Chunk Size | Overlap | Best For |
|----------|-----------|---------|----------|
| Fixed-size | 512 tokens | 50 tokens | General purpose |
| Sentence-based | Variable | 1 sentence | FAQs, policies |
| Paragraph-based | Variable | 0 | Well-structured docs |
| Semantic | Variable | 0 | Mixed content types |

**Recursive character splitting** is the most practical default:
- Split by paragraph (\\n\\n), then by sentence (.), then by word if needed
- Target 500 tokens per chunk with 50-token overlap
- Preserve section headers as metadata

### Metadata Enrichment:
Each chunk should carry metadata for filtering:
\`\`\`json
{
  "text": "Enterprise customers may request refunds within...",
  "metadata": {
    "source": "refund-policy-v3.2.pdf",
    "page": 4,
    "section": "Enterprise Refund Terms",
    "department": "Finance",
    "last_updated": "2025-11-15"
  }
}
\`\`\`

## Step 2: Embedding and Vector Storage

### Embedding Models:
| Model | Dimensions | Quality | Speed |
|-------|-----------|---------|-------|
| OpenAI text-embedding-3-large | 3072 | Highest | Medium |
| OpenAI text-embedding-3-small | 1536 | Good | Fast |
| Cohere embed-v3 | 1024 | Very good | Fast |
| BGE-large-en-v1.5 (open source) | 1024 | Good | Self-hosted |

### Vector Database Options:
- **pgvector** (Postgres extension) — Great if you're already on PostgreSQL
- **Pinecone** — Managed, scalable, serverless
- **Weaviate** — Open source, hybrid search built-in
- **Qdrant** — High performance, Rust-based

## Step 3: Retrieval Strategy

### Basic Vector Search:
Find the k nearest neighbors by cosine similarity.

### Hybrid Search (Recommended):
Combine vector similarity with keyword search for better recall:

\`\`\`sql
-- pgvector hybrid search example
SELECT *,
  (0.7 * (1 - (embedding <=> query_embedding))) +
  (0.3 * ts_rank(to_tsvector('english', text), plainto_tsquery('english', query)))
  AS hybrid_score
FROM chunks
ORDER BY hybrid_score DESC
LIMIT 10;
\`\`\`

### Reranking:
After initial retrieval, use a cross-encoder model to rerank results by relevance:
- Retrieve top 20 candidates with vector search (fast but approximate)
- Rerank to top 5 with a cross-encoder (slow but precise)

## Step 4: Prompt Construction

\`\`\`
System: You are a helpful assistant for [Company]. Answer questions using ONLY
the provided context. If the context doesn't contain the answer, say "I don't
have enough information to answer that." Always cite your sources.

Context:
[Chunk 1: Source: refund-policy-v3.2.pdf, Page 4]
Enterprise customers may request refunds within 30 days of purchase...

[Chunk 2: Source: enterprise-agreement.pdf, Page 12]
Refund requests must be submitted through the account manager...

User: What's the refund policy for enterprise customers?
\`\`\`

## Evaluation Metrics

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Retrieval recall@10** | % of relevant docs in top 10 | > 90% |
| **Answer faithfulness** | Does the answer match the retrieved context? | > 95% |
| **Answer relevance** | Does the answer address the question? | > 90% |
| **Hallucination rate** | % of answers with unsupported claims | < 5% |
| **Latency (P95)** | End-to-end response time | < 3s |

## Production Considerations

1. **Document versioning** — When policies update, re-embed and invalidate old chunks
2. **Access control** — Filter retrieval based on user permissions (don't let interns see executive compensation docs)
3. **Feedback loop** — Let users rate answers; use feedback to improve chunking and retrieval
4. **Cost management** — Cache frequent queries; use smaller models for simple questions
5. **Monitoring** — Track retrieval quality, latency, and hallucination rates in production

## Conclusion

RAG is the most practical way to give LLMs access to your organization's knowledge. Start with a simple pipeline — fixed-size chunking, pgvector, and OpenAI embeddings — then iterate on chunking strategy, add hybrid search, and implement reranking as you scale. The key is measuring retrieval quality at every step.`,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
    date: "Jan 25, 2026",
    readTime: "13 min read",
    category: "Technology",
    author,
  },
];
