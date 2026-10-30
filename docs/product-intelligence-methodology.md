# Product intelligence and research methodology

## Evidence-to-product pipeline

1. Collect provider records into `evidence_sources` and `evidence_observations`.
2. Extract product entities only from observations supplied to the extraction job.
3. Require each saved product to cite at least one observation ID. Attribute values must cite their own supporting observations.
4. Persist product-to-evidence relationships in `product_evidence_links` and attribute-level provenance in `product_attribute_values`.
5. Keep newly extracted attribute values in `unverified` state. Re-extraction must not downgrade a manually verified value.
6. Deduplicate entities in this order: GTIN, brand + MPN, brand + model number, then normalized product name. Name-only matches have the weakest identity confidence and require review.

## Attribute normalization

The Worker currently normalizes common units where the source explicitly provides a unit:

- Charging power: W (kW converted to W)
- Data rate: Mbps (Gbps/Tbps/Kbps converted to Mbps)
- Cable length: mm (m/cm/inches converted to mm)
- Review count: integer count
- Rating: numeric value
- E-marker: boolean text when the source explicitly states yes/no or true/false

The original extracted value and unit are retained in `normalized_value`. Currency is not inferred from a bare dollar symbol; price values without an unambiguous currency remain display values rather than converted monetary values.

## Evidence rules

- An observation is not automatically a verified fact. The original source, date, geography, language, extraction method and confidence remain relevant.
- Search position, listing count, views, likes, review count and rating are platform-specific proxies. They are not sales.
- Asking price is not transaction price.
- Missing values are not zero and are not false.
- Contradictory sources must be retained and investigated; do not silently average conflicting specifications.
- AI confidence is a model assessment, not a statistical confidence interval.
- Product sample size and attribute coverage must be shown alongside any descriptive analysis.
- Market size, market share and growth rate must not be inferred from a small search-result sample.

## Research reports

Reports are generated from product records, attribute observations and linked source observations. Every persisted finding must cite one or more observation IDs from the supplied project evidence. Invalid or unknown IDs are discarded by the Worker. The report stores a snapshot of source names, URLs and observed values so that citations remain reviewable even if later collections change.

A report is decision support, not an independent audit. Human review and additional authoritative evidence are required before using findings for product specifications, compliance claims, pricing commitments or investment decisions.

## Current scope and known gaps

The current implementation supports evidence-backed product extraction, normalized attribute storage, sample coverage analysis and cited report generation. It does not yet provide a representative sampling design, transaction-level sales data, a validated market-size estimator, a full contradiction-resolution workflow, or a production queue consumer. Those capabilities must be implemented and validated before treating the system as a complete market-intelligence platform.
