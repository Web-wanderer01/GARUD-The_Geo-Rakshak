# GARUD - THE GEO RAKSHAK for NER

An AI-based GARUD - THE GEO RAKSHAK designed specifically for India's North Eastern Region (NER). This dashboard serves as a central monitoring and early warning system, pulling together geotechnical sensor data, meteorological forecasts, and citizen reports to provide real-time risk assessments to district authorities.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## What is Real vs. Simulated

This application currently serves as an interactive prototype to demonstrate the UI/UX and system capabilities.

**Interactive (Real Code/Functionality):**
- Map navigation and layers
- Form submissions (Field Reports)
- Chart interactions and filtering
- Offline detection (try turning off your network)
- Tab routing and responsive layout

**Simulated (Mock Data):**
- All sensor data (Soil moisture, slope angle, etc.)
- Weather data (Rainfall forecasts)
- Risk scores (Calculated via a rule-based formula rather than a real ML model)
- Alerts and SMS notifications
- Road status
- Historical landslide events
- Translations (Sample translations provided)

## Production Readiness Roadmap

To take this system to a live production environment, the following infrastructure must be implemented:

- **Backend:** Node.js/Express or Python/FastAPI with a PostgreSQL/PostGIS spatial database.
- **Real APIs:** Integration with IMD (India Meteorological Department) for weather APIs, ISRO for satellite feeds, and the GSI (Geological Survey of India) landslide database.
- **IoT Sensors:** Connecting physical field sensors including soil moisture sensors, tiltmeters/inclinometers, rain gauges, and piezometers.
- **ML Model:** Training a machine learning model (e.g., Random Forest, XGBoost, or Neural Networks) on historical NER landslide data to replace the rule-based risk scoring engine.
- **SMS Gateway:** Integration with MSG91, Twilio, or government gateways for automated alert dissemination.
- **Authentication:** Role-based access control (RBAC) separating public/citizen views from official/district authority views.
- **Cloud Infrastructure:** Deployment on GCP or AWS with CDN, load balancing, and auto-scaling to handle traffic spikes during extreme weather events.
- **Offline Capabilities:** Enhancing the current offline features using Service Workers, IndexedDB, and Background Sync for robust field reporting without internet access.
- **Translations:** Professional translation services to ensure accurate alerts in all relevant NER languages (Assamese, Bengali, Manipuri, Mizo, etc.).

## Architecture

This frontend is built with React 18 and Tailwind CSS, utilizing `react-leaflet` for mapping and `recharts` for data visualization. 

The application architecture maintains a clean separation of concerns:
- **Data Layer:** Located in `src/data/`. All mock data and simulated functions are isolated here.
- **Components Layer:** Reusable UI elements, modularized by domain (`operations/`, `reporting/`, `common/`).
- **Pages Layer:** Top-level view composition (`OperationsPage`, `ReportingPage`).

This structure ensures that the `src/data/` layer can be seamlessly swapped out for real API fetch calls (`axios` or `fetch`) without requiring significant refactoring of the UI components.
