# dbt (Data Build Tool) & Modern Analytics Engineering Master Interview Bank (1 - 35)

> dbt Core & dbt Cloud, DAG compilation, `ref()` and `source()`, incremental models (`merge`, `insert_overwrite`), snapshots (SCD Type 2), Jinja macros, model contracts, Slim CI, and dbt Mesh.

---

## Part 1: dbt Core Concepts & Fundamentals (Junior / Entry-Level)

### 1. What is dbt and what problem does it solve in modern data engineering?
**In Simple Words:**
**dbt (data build tool)** is an open-source command-line tool that enables data analysts and data engineers to transform data in their cloud data warehouse (Snowflake, BigQuery, Databricks, Redshift, Postgres) simply by writing modular SQL `SELECT` statements.
- **The "T" in ELT**: dbt does not extract or load data; it strictly handles the **Transformation** layer *after* raw data lands in the warehouse.
- **Brings Software Engineering to Analytics**: dbt introduces version control (Git), automated testing, continuous integration (CI), modularity, environment branching (dev/staging/prod), and automated documentation to data pipelines.

---

### 2. Explain the standard anatomy of a dbt project.
**In Simple Words:**
A dbt project is a directory of SQL, YAML, and Jinja files governed by `dbt_project.yml`:
- `dbt_project.yml`: The central configuration file specifying project name, version, materializations, and model configurations.
- `models/`: The core directory containing SQL transformation models (often organized into `staging/`, `intermediate/`, and `marts/`).
- `seeds/`: CSV files containing static lookup data (e.g. country codes, tax brackets) loaded with `dbt seed`.
- `snapshots/`: SQL files defining Slowly Changing Dimensions (SCD Type 2) history tracking.
- `tests/`: Custom SQL queries verifying data integrity rules.
- `macros/`: Reusable Jinja functions (like custom functions in code).
- `analyses/`: Ad-hoc SQL queries that dbt compiles but does not materialize in the warehouse.

---

### 3. What is the `ref()` function and why is it revolutionary?
**In Simple Words:**
In traditional SQL pipelines, queries hardcode physical table names (`SELECT * FROM analytics_prod.dim_customers`). If you switch to a development schema, your queries break or accidentally overwrite production!
`ref('model_name')` is dbt's dependency resolution function:
1. **Builds the DAG (Directed Acyclic Graph)**: dbt reads all `ref()` calls and automatically determines the exact order in which models must be built.
2. **Environment Agnostic**: In development, `ref('stg_orders')` compiles to `dev_manth.stg_orders`. In production, it compiles to `analytics.stg_orders` without changing a single line of SQL!

```sql
-- models/marts/fct_orders.sql
SELECT 
  o.order_id,
  o.customer_id,
  c.customer_name,
  o.order_total
FROM {{ ref('stg_orders') }} o
JOIN {{ ref('dim_customers') }} c ON o.customer_id = c.customer_id
```

---

### 4. What is the `source()` function and how does Source Freshness work?
**In Simple Words:**
While `ref()` references other dbt models, `source('source_name', 'table_name')` references raw, untransformed tables loaded into the warehouse by ingestion tools (Fivetran, Airbyte, Kafka).

#### Source Definition & Freshness Checks:
```yaml
# models/staging/src_stripe.yml
version: 2
sources:
  - name: stripe
    database: raw_data
    schema: stripe_payments
    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _loaded_at
    tables:
      - name: charges
```
Running `dbt source freshness` inspects `_loaded_at` and fails if ingestion pipelines have stalled.

---

### 5. What are Materializations in dbt?
**In Simple Words:**
Materializations determine how the SQL query in a model is physically created inside the warehouse:
- **`view`**: Creates a standard SQL View (`CREATE VIEW ...`). Recomputed on every query; zero storage cost.
- **`table`**: Creates a physical table (`CREATE TABLE ... AS SELECT`). Slower to build, but provides fast querying for downstream BI dashboards.
- **`incremental`**: Appends or merges only new/modified rows since the last run. Crucial for tables with billions of rows.
- **`ephemeral`**: Does not create any physical object in the database! Instead, dbt interpolates it as a Common Table Expression (CTE) directly inside downstream models.

```sql
-- Configured at top of model:
{{ config(materialized='table') }}
SELECT * FROM ...
```

---

### 6. What are Seeds in dbt and when should they NOT be used?
**In Simple Words:**
**Seeds** are static CSV files placed in the `seeds/` folder and loaded into database tables using the `dbt seed` command.
- **Appropriate Use**: Static lookup tables that change rarely (country code mappings, zip codes, marketing campaign metadata, employee ID mappings).
- **Misuse**: Loading large, dynamic, or sensitive datasets (customer PII, high-frequency transactional data). Large CSVs slow down Git repos and dbt compilation.

---

### 7. What are the 4 Out-of-the-Box Generic Tests in dbt?
**In Simple Words:**
dbt provides 4 built-in schema tests declared in YAML:
1. **`unique`**: Asserts that no two rows have the same value in the specified column (verifies primary key integrity).
2. **`not_null`**: Asserts that every row in the column contains a non-null value.
3. **`accepted_values`**: Asserts that column values match a predefined list of allowed strings (e.g. `['placed', 'shipped', 'delivered', 'returned']`).
4. **`relationships`**: Asserts referential integrity (foreign key in fact table must exist in dimension table primary key).

```yaml
version: 2
models:
  - name: fct_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['pending', 'completed', 'cancelled']
      - name: customer_id
        tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
```

---

### 8. What is the difference between Generic Tests and Singular Tests?
**In Simple Words:**
- **Generic Tests**: Reusable validation rules defined in YAML on columns (like `unique`, `not_null`, or custom generic test macros).
- **Singular Tests**: One-off SQL queries saved as `.sql` files inside the `tests/` directory. If the query returns **zero rows**, the test passes. If it returns **one or more rows**, the test fails!

```sql
-- tests/assert_total_discount_is_positive.sql
-- Fails if any order has a negative discount
SELECT order_id, discount_amount
FROM {{ ref('fct_orders') }}
WHERE discount_amount < 0
```

---

### 9. How do automated Documentation and Lineage work in dbt?
**In Simple Words:**
Running `dbt docs generate` inspects your project SQL, YAML descriptions, and metadata, generating a static web catalog:
- Displays table column types, descriptions, tests, and source system tags.
- Renders an interactive **Lineage Graph (DAG)** showing every upstream raw source and downstream mart connected to each model.
- `dbt docs serve` starts a local web server to browse the documentation.

---

### 10. Explain core dbt CLI execution commands and Node Selection syntax.
**In Simple Words:**
- `dbt run`: Executes and builds models in the warehouse.
- `dbt test`: Runs all generic and singular tests.
- `dbt build`: The modern unified command that runs models, tests, snapshots, and seeds in DAG dependency order (stops downstream models if an upstream test fails).
- `dbt compile`: Compiles Jinja templates into raw SQL in the `target/compiled` directory without running them against the warehouse.

#### Node Selection Syntax (`--select` / `-s`):
- `dbt run -s fct_orders`: Runs only `fct_orders`.
- `dbt run -s +fct_orders`: Runs `fct_orders` and **all its upstream parents**.
- `dbt run -s fct_orders+`: Runs `fct_orders` and **all its downstream children**.
- `dbt run -s tag:finance`: Runs all models labeled with the `finance` tag.

---

### 11. How does Jinja Templating work in dbt?
**In Simple Words:**
dbt combines SQL with the **Jinja2** templating language:
- `{{ ... }}`: Expressions that output text (e.g. `{{ ref('model') }}` or `{{ var('my_var') }}`).
- `{% ... %}`: Control structures (loops, conditionals):

```sql
-- Dynamically pivot columns without writing 20 CASE statements
{% set payment_methods = ['credit_card', 'paypal', 'bank_transfer', 'crypto'] %}

SELECT
  order_id,
  {% for method in payment_methods %}
    SUM(CASE WHEN payment_method = '{{ method }}' THEN amount ELSE 0 END) AS {{ method }}_amount
    {% if not loop.last %},{% endif %}
  {% endfor %}
FROM {{ ref('stg_payments') }}
GROUP BY 1
```

---

### 12. What is the recommended Medallion Architecture structure in dbt?
**In Simple Words:**
Organizing models into three distinct layers ensures modular, maintainable pipelines:
1. **Staging Layer (`models/staging/`) (Bronze)**: 1-to-1 view/table on top of raw sources. Performs column renaming, casting data types, and basic cleaning. Zero business logic or joins!
2. **Intermediate Layer (`models/intermediate/`) (Silver)**: Joins multiple staging models, aggregates intermediate metrics, and applies complex business calculations.
3. **Marts Layer (`models/marts/`) (Gold)**: Final business-ready dimensional models (`dim_` and `fct_`) consumed directly by BI dashboards, executive reporting, and ML algorithms.

---

## Part 2: Advanced Modeling, Incremental Builds & Macros (Mid-Level)

### 13. How do Incremental Models work in dbt and what are the strategies?
**In Simple Words:**
Rebuilding a 2-billion-row fact table from scratch every hour wastes compute and time.
An **Incremental Model** builds as a full table on the first run, but on subsequent runs processes only new or updated rows using the `is_incremental()` macro.

```sql
{{ config(
    materialized = 'incremental',
    unique_key = 'order_id',
    incremental_strategy = 'merge'
) }}

SELECT *
FROM {{ ref('stg_orders') }}
{% if is_incremental() %}
  -- Only look at events newer than the max timestamp in the existing table
  WHERE order_updated_at > (SELECT MAX(order_updated_at) FROM {{ this }})
{% endif %}
```

#### Incremental Strategies:
- `merge` (Snowflake, BigQuery, Postgres): Executes an atomic SQL `MERGE` using `unique_key`. Updates existing rows and inserts new rows.
- `delete+insert`: Deletes matching keys from the target table and inserts the new rows.
- `append`: Appends rows without checking keys (ideal for immutable logs).
- `insert_overwrite` (BigQuery/Databricks): Replaces entire partitions (e.g. today's partition) without scanning the rest of the table.

---

### 14. What are dbt Snapshots and how do they implement SCD Type 2?
**In Simple Words:**
Source databases often overwrite records (SCD Type 1). dbt **Snapshots** record historical mutations over time to maintain an immutable audit trail (SCD Type 2).
- **`timestamp` Strategy**: Compares an `updated_at` column to detect mutations.
- **`check` Strategy**: Calculates a checksum over specified columns to detect edits when no timestamp column exists.

```sql
-- snapshots/snap_customers.sql
{% snapshot snap_customers %}

{{ config(
    target_database='analytics',
    target_schema='snapshots',
    unique_key='customer_id',
    strategy='timestamp',
    updated_at='updated_at'
) }}

SELECT * FROM {{ source('crm', 'customers') }}

{% endsnapshot %}
```
dbt automatically appends columns: `dbt_valid_from`, `dbt_valid_to`, and `dbt_updated_at`.

---

### 15. How do you create Custom Jinja Macros?
**In Simple Words:**
Macros are reusable SQL functions stored in `macros/`:

```sql
-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name, scale=2) %}
    ROUND(CAST({{ column_name }} AS NUMERIC) / 100.0, {{ scale }})
{% endmacro %}
```
Usage in models:
```sql
SELECT 
  order_id,
  {{ cents_to_dollars('amount_in_cents') }} AS total_amount_dollars
FROM {{ ref('stg_orders') }}
```

---

### 16. What are dbt Packages and how do you install them?
**In Simple Words:**
Packages are external open-source libraries containing pre-built macros, tests, and models.
Declared in `packages.yml` and installed via `dbt deps`:
- **`dbt-labs/dbt_utils`**: Essential macros like `surrogate_key()`, `generate_series()`, `pivot()`.
- **`calogica/dbt_expectations`**: Great Expectations test suite inside dbt.
- **`dbt-labs/codegen`**: Automatically scaffolds YAML files and staging models.

```yaml
# packages.yml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1
```

---

### 17. What are Model Contracts and why are they vital for Data Contracts?
**In Simple Words:**
Historically, if upstream SQL changed a column from `INT` to `STRING`, downstream BI dashboards crashed silently.
**Model Contracts** (`contract: { enforced: true }`) enforce strict schema rules on model output:
If the compiled SQL produces unexpected column names, missing columns, or mismatched data types, dbt **aborts compilation before writing to the database**!

```yaml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: integer
        constraints:
          - type: not_null
      - name: email
        data_type: string
```

---

### 18. What is the dbt Semantic Layer and MetricFlow?
**In Simple Words:**
In organizations, marketing might calculate "Active Users" as logged in within 30 days, while finance calculates it as 7 days.
The **dbt Semantic Layer** (powered by MetricFlow) allows data teams to define metrics declaratively in YAML once:
- Upstream tools (Tableau, Looker, Hex, Google Sheets) query the semantic layer via GraphQL/JDBC instead of writing raw SQL.
- Guarantees unified, certified definitions across the entire enterprise.

---

### 19. How do Python Models work in dbt?
**In Simple Words:**
Starting in dbt 1.3+, models can be written in **Python (`.py`)** instead of SQL on platforms with native Python compute (Snowflake Snowpark, Databricks, BigQuery, PySpark).
- Ideal for data science, training ML models, text sentiment analysis, or complex statistical operations that are painful in SQL.

```python
# models/marts/predict_churn.py
import pandas as pd

def model(dbt, session):
    dbt.config(materialized="table")
    
    # Read upstream dbt models as DataFrames
    customers_df = dbt.ref("dim_customers").to_pandas()
    
    # Apply ML / transformations
    customers_df["risk_score"] = customers_df["total_spent"] / customers_df["days_active"]
    
    return customers_df
```

---

### 20. How do dbt Profiles and Target Environments work?
**In Simple Words:**
Credentials are kept separate from code. Your Git repository stores project logic, while database passwords reside in `~/.dbt/profiles.yml`:
- Developers use `target: dev` (writes to personal scratch schema `dbt_jdoe`).
- CI/CD runners use `target: prod` (writes to production schemas).

```yaml
# ~/.dbt/profiles.yml
enterprise_dw:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: xy12345.us-east-1
      user: jdoe
      schema: dbt_jdoe
      warehouse: dev_wh
    prod:
      type: snowflake
      account: xy12345.us-east-1
      user: cicd_service_account
      password: "{{ env_var('DBT_PROD_PASSWORD') }}"
      schema: analytics
      warehouse: prod_wh
```

---

### 21. What are Pre-Hooks and Post-Hooks in dbt?
**In Simple Words:**
SQL statements executed before or after a model or project run:
- **`pre-hook`**: Useful for session settings or temporary table prep (`ALTER SESSION SET ...`).
- **`post-hook`**: Useful for granting permissions to BI reporting roles (`GRANT SELECT ON {{ this }} TO ROLE bi_reporting;`).

---

### 22. What are Exposures in dbt?
**In Simple Words:**
**Exposures** map downstream consumers of your data (e.g. Looker Dashboards, Executive Metabase boards, critical ML pipelines) in your project YAML.
They show up in the dbt documentation lineage graph. When a data engineer modifies `stg_orders`, they can instantly see which executive dashboards will be impacted!

---

### 23. Compare dbt Core vs dbt Cloud.
**In Simple Words:**
| Dimension | dbt Core | dbt Cloud |
| :--- | :--- | :--- |
| **Licensing** | Open-source (CLI / Python package) | Hosted SaaS by dbt Labs |
| **Execution** | Run locally via terminal or orchestrators (Airflow/Dagster) | Managed web-based scheduler with built-in cron |
| **Interface** | Local IDE (VS Code, Cursor) | In-browser cloud IDE with point-and-click runs |
| **CI/CD** | Custom GitHub Actions implementation | Built-in native Slim CI with automatic PR staging schemas |
| **Semantic Layer** | Requires manual hosting | Fully managed high-performance Semantic Layer engine |

---

### 24. How do you create Custom Generic Test Macros?
**In Simple Words:**
Create a macro in `macros/` with the prefix `test_`. The test must return failing rows:

```sql
-- macros/test_is_even.sql
{% test is_even(model, column_name) %}
SELECT {{ column_name }}
FROM {{ model }}
WHERE ({{ column_name }} % 2) != 0
{% endtest %}
```
Use it in YAML:
```yaml
columns:
  - name: batch_quantity
    tests:
      - is_even
```

---

## Part 3: Enterprise Scale, Performance & CI/CD Pipelines (Senior / Staff)

### 25. What is Slim CI in dbt and how does it reduce PR build times?
**In Simple Words:**
In a 1,000-model project, running `dbt build` on every developer pull request takes hours and racks up thousands of warehouse credits.
**Slim CI** compares the current Git branch against production artifacts (`manifest.json`):
Using `dbt build --select state:modified+ --defer --state path/to/prod/artifacts`:
1. dbt identifies **only the models that were modified** in the PR plus their direct downstream children.
2. For un-modified upstream models, it **defers** to the existing production tables instead of rebuilding them!
3. Reduces CI build times from 90 minutes to under 3 minutes.

---

### 26. How do you handle Late-Arriving Data in Incremental Models?
**In Simple Words:**
If an order placed on Monday is held up by payment processing and arrives on Thursday, a naive incremental filter (`WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})`) will **completely miss the Monday record**!

#### The Lookback Window Solution:
Subtract a safety window (e.g., 3 days) from the incremental filter to capture late-arriving dimensions:

```sql
{% if is_incremental() %}
  WHERE order_updated_at > (
    SELECT DATEADD('day', -3, MAX(order_updated_at)) FROM {{ this }}
  )
{% endif %}
```

---

### 27. How does Native Unit Testing work in dbt 1.8+?
**In Simple Words:**
Before dbt 1.8, tests ran only against live database tables.
**Unit Tests** mock static input rows directly in YAML and assert expected output rows **without touching production data**:

```yaml
unit_tests:
  - name: test_order_discount_calculation
    model: fct_orders
    given:
      - input: ref('stg_orders')
        rows:
          - {order_id: 1, base_price: 100, discount_pct: 0.20}
    expect:
      rows:
        - {order_id: 1, final_price: 80.00}
```

---

### 28. How do you tune performance for massive dbt DAGs?
**In Simple Words:**
1. **Parallel Threads (`--threads 16`)**: Increase thread concurrency so independent branches of the DAG execute concurrently.
2. **Optimize Materializations**: Demote rarely queried tables to `ephemeral` or `view` to eliminate warehouse write I/O.
3. **Partition & Cluster Pruning**: Configure warehouse-specific cluster keys directly inside model configs (`cluster_by=['customer_id']`).

---

### 29. How do you implement Zero-Downtime Blue/Green Deployments with dbt?
**In Simple Words:**
1. In production CI/CD, build all models into a temporary "Green" schema (`prod_green`).
2. Run all data quality tests on `prod_green`.
3. If all tests pass, execute an atomic metadata schema swap (`ALTER SCHEMA prod SWAP WITH prod_green;`).
4. Downstream BI queries never experience intermediate drop or table rebuild errors!

---

### 30. How do you orchestrate dbt with Apache Airflow using Astronomer Cosmos?
**In Simple Words:**
Running `BashOperator(bash_command='dbt run')` treats dbt as a black box—if one model fails, the entire Airflow task fails without showing which model broke.
**Cosmos** parses your dbt `manifest.json` and dynamically translates every individual dbt model into a native **Airflow Task**:
- Full visual task graph in Airflow UI.
- Retry only the single failed model without restarting the entire pipeline.

---

### 31. What is dbt Mesh and Multi-Project Architecture?
**In Simple Words:**
When enterprise data teams grow to 100+ analysts, a single monolithic dbt repository becomes chaotic with PR merge conflicts.
**dbt Mesh** splits the monolithic repo into domain-driven repositories (e.g., `core_finance`, `core_marketing`, `core_product`):
- Models specify `access: public` or `private`.
- A downstream marketing dbt project can reference `ref('core_finance', 'dim_revenue')` across Git repositories!

---

### 32. How do you track and audit query costs generated by dbt?
**In Simple Words:**
Use packages like **`dbt-artifacts`**:
- On `on-run-end`, dbt automatically writes execution metadata (compilation time, execution duration, rows affected, query ID) into a dedicated auditing table in your warehouse.
- Join this table with Snowflake's `QUERY_HISTORY` to accurately attribute cloud compute costs to specific data models and teams.

---

### 33. How do you refactor legacy stored procedures into modern dbt models?
**In Simple Words:**
1. Break down 2,000-line monolithic stored procedures into CTEs.
2. Separate business logic from ingestion: extract raw loading into staging models.
3. Replace temporary tables (`#temp_table`) with modular intermediate models.
4. Replace procedural loops (`WHILE / CURSOR`) with set-based SQL joins and Jinja macros.
5. Add automated generic tests to ensure parity between old and new outputs.

---

### 34. How do you secure CI/CD runners executing dbt in production?
**In Simple Words:**
- Never hardcode warehouse passwords in Git.
- Use Cloud Service Accounts with OpenID Connect (OIDC) or RSA Key-Pair authentication.
- Restrict CI/CD database roles with the principle of least privilege (only write access to target schemas, zero admin or user-management privileges).

---

### 35. What is the future of Analytics Engineering and Streaming dbt?
**In Simple Words:**
1. **Streaming Transformations**: Integrating dbt with streaming engines like Materialize or Apache Flink for real-time sub-second materialized views.
2. **AI & Agentic Modeling**: Autonomous agents reading business requirements and generating validated dbt models with unit tests and contracts.
3. **Open Table Formats**: dbt compiling models directly into Apache Iceberg and Delta Lake formats across multi-engine lakehouses.

