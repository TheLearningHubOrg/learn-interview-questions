# Microsoft Azure Enterprise Cloud Master Interview Bank (1 - 7)

> Azure Kubernetes Service (AKS), Azure Container Apps, Cosmos DB multi-model consistency, Azure SQL, Microsoft Entra ID (Azure AD), VNet peering, and Azure Landing Zones.

---

### 1. Microsoft Entra ID (formerly Azure Active Directory) vs. Traditional On-Premise Active Directory.
**In Simple Words:**
- **On-Prem Active Directory (AD)**: Built on Kerberos, NTLM, and LDAP protocols. Flat hierarchy designed for corporate LAN domains.
- **Microsoft Entra ID**: Cloud identity and access management solution built on modern internet web protocols (**OAuth 2.0, OpenID Connect, SAML 2.0, and SCIM**). Provides Single Sign-On (SSO), Multi-Factor Authentication (MFA), and Conditional Access Policies across thousands of cloud SaaS apps.

### 2. Azure Cosmos DB: Multi-Model Architecture and the 5 Consistency Levels.
**In Simple Words:**
Cosmos DB is Microsoft's globally distributed, multi-model NoSQL database. Rather than forcing a binary choice between Strong and Eventual consistency, Cosmos DB offers **5 distinct consistency levels**:
1. **Strong**: Lineari

### 3. Multi-Cloud Architecture: When is Multi-Cloud an Anti-Pattern vs. a Business Necessity?
**In Simple Words:**
- **When it's an Anti-Pattern**: Trying to make code 100% portable across AWS, GCP, and A

### 4. Azure Kubernetes Service (AKS): Virtual Nodes, CNI vs. Kubenet.
**In Simple Words:**
- **Kubenet**: Pods receive private IP addresses from a NAT network overlay. Limited scalability.
- **Azure CNI**: Every Pod receives a real, routable IP address from the Azure Virtual Network (VNet). Allows direct pod-to-pod communication across on-premises ExpressRoute.
- **Virtual Nodes**: Leverages Azure Container Instances (ACI) to burst pods instantly into serverless compute without provisioning additional VM nodes.

### 5. Azure Cosmos DB Consistency Levels (Strong, Bounded Staleness, Session, Consistent Prefix, Eventual).
**In Simple Words:**
Cosmos DB provides 5 tunable consistency models along the PACELC spectrum:
1. **Strong**: Linearizable. Reads always see latest committed write. Highest latency.
2. **Bounded Staleness**: Reads lag behind writes by at most $K$ versions or $T$ time.
3. **Session (Default)**: Consistent prefix and monotonic reads within a client session token.
4. **Consistent Prefix**: Updates are never seen out of order.
5. **Eventual**: Lowest latency, highest availability. Out-of-order reads possible until convergence.

### 6. Microsoft Entra ID (Azure AD): Managed Identities for Azure Resources.
**In Simple Words:**
Managed Identities eliminate hardcoded credentials and connection strings in source code or environment variables:
- **System-Assigned**: Tied directly to the lifecycle of an Azure resource (e.g. App Service or AKS pod).
- The resource automatically obtains short-lived OAuth 2.0 access tokens from Entra ID via a local metadata endpoint (`http://169.254.169.254`) to authenticate securely with Azure Key Vault, Azure SQL, or Cosmos DB.

### 7. Azure Landing Zones and Enterprise Hub-and-Spoke Network Architecture.
**In Simple Words:**
- **Hub VNet**: Houses central shared services: Azure Firewall, VPN/ExpressRoute Gateway, Bastion, and centralized DNS.
- **Spoke VNets**: Isolated workload virtual networks peering directly to the Hub. All egress traffic routes through the central firewall, enforcing zero-trust segmentation and corporate compliance.

