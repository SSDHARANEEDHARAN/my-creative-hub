import type { Project } from "@/data/projectsData";
import type { ArticleContent } from "@/data/articleContent";
import photo1 from "@/assets/projects/axis-mms/photo-02.jpg.asset.json";
import photo2 from "@/assets/projects/axis-mms/photo-03.jpg.asset.json";
import photo3 from "@/assets/projects/axis-mms/photo-04.jpg.asset.json";
import photo4 from "@/assets/projects/axis-mms/photo-05.jpg.asset.json";
import video1 from "@/assets/projects/axis-mms/video-01.mp4.asset.json";
import video2 from "@/assets/projects/axis-mms/video-06.mp4.asset.json";

export const axisMmsProject: Project = {
  "id": 133,
  "title": "AXIS GLOBAL – 4-Station MMS Combination System",
  "description": "An integrated four-station Modular Manufacturing System combining HMI-controlled feeding and buffering, drilling verification with an external vision camera, and three-path sorting for aluminium, Delrin and inspection rejects.",
  images: [photo1.url, photo2.url, photo3.url, photo4.url],
  videoUrls: [video1.url, video2.url],
  "tags": [
    "Modular Manufacturing",
    "HMI",
    "Vision Inspection",
    "Industrial Automation",
    "Material Sorting",
    "Quality Control"
  ],
  "articleUrl": "/projects/article/axis-global-four-station-mms",
  "featured": true,
  "category": "industrial"
};

export const axisMmsArticle: ArticleContent = {
  "id": 133,
  "slug": "axis-global-four-station-mms",
  "title": "AXIS GLOBAL – 4-Station MMS Combination System",
  "subtitle": "Automated feeding, buffering, vision inspection and quality-based sorting",
  "duration": "Not specified",
  "client": "AXIS GLOBAL",
  "role": "Mechatronics Design Engineer",
  "industry": "Industrial Automation / Modular Manufacturing",
  "overview": "The **AXIS GLOBAL 4-Station Modular Manufacturing System (MMS)** is an integrated industrial automation system designed to demonstrate automated workpiece feeding, controlled buffering, drilling-process inspection, material identification, and automatic sorting. The system consists of four interconnected stations, each equipped with a dedicated Human–Machine Interface (HMI) for local operation, monitoring, and control.\n\nThe primary objective of the system is to automate the movement of workpieces through a defined manufacturing sequence and perform quality-based classification using industrial sensors and vision inspection technology.",
  "challenge": "Coordinate four interconnected manufacturing stations while maintaining controlled workpiece flow and ensuring that failed vision inspections take precedence over material-based acceptance.",
  "solution": "Combine dedicated station HMIs with sequential feeding and buffering, external-camera drilling verification, inductive aluminium detection, colour-based Delrin identification and three output slides. Rejection logic must override material classification for workpieces that fail inspection.",
  "process": [
    {
      "title": "Feeder Station with HMI",
      "content": "The feeder station is responsible for supplying workpieces into the manufacturing system. It separates and feeds the workpieces individually, ensuring a controlled and consistent supply to the subsequent station.\n\nThe HMI provides the operator with access to station status, operating controls, and relevant process information. The feeder station establishes the starting point of the automated production sequence."
    },
    {
      "title": "Buffer Station with HMI",
      "content": "The buffer station temporarily holds workpieces and regulates their movement through the manufacturing process. It manages the flow of components and releases them one at a time according to downstream process requirements.\n\nThe HMI enables operators to monitor buffer conditions, workpiece availability, and station operation. This arrangement helps maintain a controlled production sequence and minimizes interruptions caused by variations in workpiece flow."
    },
    {
      "title": "Process Station with External Camera and HMI",
      "content": "The process station performs the designated drilling operation and uses an external vision camera to inspect the workpiece after processing.\n\nThe vision inspection system determines whether the required drilling operation has been completed. The inspection result is then used to classify the workpiece as correctly processed or not correctly processed.\n\nThe HMI provides local operating controls, process-status information, and inspection-related monitoring. The inspection result is made available to the sorting station so that the workpiece can be routed to the appropriate output."
    },
    {
      "title": "Sorting Station with HMI",
      "content": "The sorting station is responsible for automatically segregating workpieces into three output paths based on material identification and the inspection result received from the process station.\n\nThe station uses sensor-based identification and sorting mechanisms to direct each workpiece to its designated slide.\n\n**Sorting Path 1 – Aluminium Workpiece**\n\nAluminium workpieces are identified using an inductive sensor. Based on the sensor output and the configured sorting logic, the workpiece is directed to the first sorting slide.\n\n**Sorting Path 2 – Delrin Workpiece**\n\nDelrin workpieces are identified using a colour sensor. The sensor output is evaluated by the control system, and the workpiece is routed to the second sorting slide according to the configured classification logic.\n\n**Sorting Path 3 – Vision-Inspection Rejection**\n\nWorkpieces identified by the process-station vision system as incorrectly drilled or otherwise failing the defined inspection criteria are routed to the designated rejection slide. This path separates rejected components from workpieces that meet the specified processing requirements.\n\nThe HMI enables operators to monitor sorting operations, view station status, and access the available operating controls."
    },
    {
      "title": "Overall System Working Sequence",
      "content": "The system operates through the following sequence:\n\n1. The feeder station supplies workpieces individually.\n2. The buffer station temporarily stores the workpieces and releases them one at a time.\n3. The process station performs the drilling operation.\n4. An external vision camera inspects the workpiece to verify whether the drilling operation has been completed correctly.\n5. The workpiece is transferred to the sorting station.\n6. The sorting station identifies the material using the inductive sensor or colour sensor and considers the inspection result from the process station.\n7. The workpiece is routed to the appropriate output slide according to the configured sorting logic.\n\nThe control logic must prioritize rejection of workpieces that fail vision inspection, regardless of their material classification, to prevent incorrectly processed components from entering the accepted output paths."
    }
  ],
  "results": [
    "Four integrated stations with individual HMI operation and monitoring.",
    "Controlled workpiece feeding, buffering and sequential release.",
    "External-camera verification of the drilling process.",
    "Inductive aluminium and colour-based Delrin identification.",
    "Dedicated rejection slide for workpieces failing vision inspection."
  ],
  "technologies": [
    "HMI",
    "External Vision Camera",
    "Inductive Sensor",
    "Colour Sensor",
    "Automated Feeding",
    "Sequential Buffering",
    "Drilling Inspection",
    "Three-Path Sorting"
  ],
  "lessons": [
    "Prioritize vision-inspection rejection regardless of workpiece material.",
    "Synchronize buffer release with downstream station availability.",
    "Maintain inspection-result association with each workpiece through sorting."
  ],
  "toolsUsed": [
    "Station HMIs",
    "Vision Inspection",
    "Industrial Sensors"
  ],
  "keyMetrics": [
    {
      "value": "4",
      "label": "Interconnected stations"
    },
    {
      "value": "4",
      "label": "Dedicated HMIs"
    },
    {
      "value": "3",
      "label": "Sorting output paths"
    }
  ]
};
