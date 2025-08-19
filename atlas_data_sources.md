# Shipping indices and measures for VERO Atlas

Atlas is intended to provide daily insights into the maritime freight market across multiple segments.  Below is a curated list of key indices and metrics for the main shipping sectors—dry bulk, tanker, vehicle carriers (RoRo) and container shipping—along with guidance on how to integrate them.

## Dry bulk segment

* **Baltic Dry Index (BDI)** – The Baltic Exchange’s dry bulk sea‑freight index tracks rates for vessels transporting dry commodities and is a standard gauge of the dry‑bulk market.  On 18 August 2025 the index was 2 022 points【451110658489139†L142-L149】.  The index combines the three main vessel classes—Capesize, Panamax and Supramax—and is widely used in market commentary.
* **Capesize, Panamax and Supramax sub‑indices** – These sub‑indices provide more granular insight.  On the same date the capesize index stood at 3 212 points, while the panamax and supramax indices were 1 630 and 1 361 points respectively【451110658489139†L142-L149】.

## Tanker segment (VLCC & product tankers)

* **Baltic Dirty Tanker Index (BDTI)** – Measures the transportation cost of unrefined crude oil and fuel oil by so‑called “dirty” tankers【972888293092579†L129-L133】.  It is the benchmark for VLCC and other crude tanker markets.
* **Baltic Clean Tanker Index (BCTI)** – Tracks the transportation cost of refined oil products such as gasoline and diesel by clean tankers【972888293092579†L129-L133】.
* **Route‑specific Worldscale assessments** – For a more detailed view, monitor Worldscale (WS) time‑charter assessments on routes like TD3C (270k mt Middle†East†Gulf–China) and TD3 (MEG–Japan).  These route indices reflect spot earnings per day and complement the aggregated BDTI.

## Vehicle carriers and RoRo

* **VesselsValue (VV) 1‑Year 6 500 CEU Car‑carrier Time‑Charter Index** – Gauges time‑charter rates for large pure car and truck carriers (PCTC).  In the first half of 2023 this index averaged US$ 105 000 per day, up 110 % on the 1H 2022 average【137262786397321†L34-L37】.
* **VesselsValue 1‑Year 3 500 LM RoRo Time‑Charter Index** – Represents short‑sea RoRo charter rates.  It firmed 8 % to € 22 974 per day in mid‑2023, indicating tightness in the European RoRo market【137262786397321†L136-L137】.
* **Route‑specific rates** – When available, include contract freight rates on key car‑carrier routes (e.g., China–Northern Europe, which reached US$ 81 per cubic metre in late 2023)【866229048930149†L70-L101】.

## Container shipping and supply chain

* **China Export Containerized Freight Index (CCFI) & Shanghai Containerized Freight Index (SCFI)** – Launched in 1998 by the Shanghai Shipping Exchange, these indices are based on freight rates and shipped volumes on twelve global trade routes.  They are updated weekly and reflect trends in outbound container shipping from China; Shanghai’s SCFI is especially important as the port is a maritime hub【380406299789218†L133-L154】.
* **Drewry World Container Index (WCI)** – Developed by Drewry; tracks freight rates for 40‑foot containers on eight major routes (Shanghai–Rotterdam, Rotterdam–Shanghai, Shanghai–Genoa, Shanghai–Los†Angeles, Los†Angeles–Shanghai, Shanghai–New†York, New†York–Rotterdam and Rotterdam–New†York).  The WCI incorporates both spot and short‑term contract rates and provides a more comprehensive picture of freight fluctuations across Europe‑Asia, Transatlantic and Transpacific routes【515225098559660†L133-L142】.  Data is released weekly, usually on Mondays【515225098559660†L133-L142】.
* **Global Supply Chain Pressure Index (GSCPI)** – Developed by the New York Fed, this composite index uses components of the Purchasing Managers’ Index (PMI) along with freight and airfreight prices to measure supply‑side conditions in global logistics.  Higher values indicate increasing supply‑chain tightness, while lower values suggest easing pressure【436571206333502†L133-L153】.

## Additional metrics

* **Bunker fuel prices** – Prices for very low sulphur fuel oil (VLSFO) and high sulphur fuel oil (HSFO) drive voyage costs across all vessel classes.
* **Port congestion and throughput metrics** – Indices such as the RWI/ISL Container Throughput Index or port call volumes provide insight into congestion and trade flows.
* **Vessel asset values and newbuilding prices** – Tracking newbuild and second‑hand vessel prices helps anticipate fleet growth and supply‑demand imbalances.
* **Commodity and macro drivers** – Iron‑ore, coal and grain prices for dry bulk; crude oil prices for tankers; and macro indicators (e.g., manufacturing PMI, global trade volume) should be monitored alongside freight indices.

## Implementation guidelines

1. **Identify data sources** – Many indices are published by the Baltic Exchange, Shanghai Shipping Exchange, Drewry, VesselsValue and central banks.  Some data is accessible via free APIs (e.g., Trading Economics or MacroMicro), while others require subscriptions.  Document the source, access method and update frequency for each index.
2. **Automate data ingestion** – Create a script (e.g., `update_shipping_indices.py`) that runs daily.  The script should fetch the latest values for each index via HTTP requests or API calls, normalise the data (date, index name, value) and store it in Atlas’s database.  Use placeholders or environment variables for any API keys.
3. **Map to Atlas schema** – Ensure each index is stored with metadata (source, description, segment, frequency).  This will allow the front‑end to filter and display data by segment (dry bulk, tanker, RoRo, container) or by index type.
4. **Handle missing or weekly data** – For indices that update weekly (e.g., WCI, CCFI/SCFI, GSCPI), carry forward the latest value when no new data is published.  Maintain a flag indicating when the last update occurred.
5. **Alert on anomalies** – Implement simple checks (e.g., percent change thresholds) to highlight unusual movements.  Atlas can then flag these to analysts via dashboards or notifications.

This document serves as a roadmap for selecting freight indices and integrating them into Atlas.  Once data sources and access methods are confirmed, the development team can proceed to build the ingestion pipeline and dashboard components.
