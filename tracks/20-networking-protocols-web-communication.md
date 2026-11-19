# Computer Networking, Web Protocols & Real-Time Communication Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade technical interview questions and architectural deep-dives covering TCP/IP, UDP, HTTP/1.1, HTTP/2, HTTP/3 (QUIC), DNS Resolution, TLS 1.3, WebSockets, Server-Sent Events (SSE), WebRTC, and Edge Proxies.

---

## Part 1: TCP/IP, UDP & Transport Layer (1 - 15)

### 1. Explain the TCP 3-Way Handshake (SYN, SYN-ACK, ACK) and 4-Way Connection Termination (FIN, ACK, FIN, ACK).
**In Simple Words:**
**Connection Establishment (3-Way Handshake)**:
1. **Client -> Server (SYN)**: Client chooses an Initial Sequence Number (ISN_c) and sends `SYN`.
2. **Server -> Client (SYN-ACK)**: Server acknowledges with `ACK = ISN_c + 1` and sends its own sequence number `SYN = ISN_s`.
3. **Client -> Server (ACK)**: Client acknowledges with `ACK = ISN_s + 1`. Connection is now `ESTABLISHED`.

**Connection Termination (4-Way Handshake)**:
Because TCP is full-duplex, each direction closes independently:
1. Client sends `FIN` (Client enters `FIN_WAIT_1`).
2. Server sends `ACK` (Client enters `FIN_WAIT_2`, Server enters `CLOSE_WAIT`).
3. Server finishes sending remaining data and sends its own `FIN` (Server enters `LAST_ACK`).
4. Client sends `ACK` and enters **`TIME_WAIT`** state (typically 2 MSL = 60–120 seconds) to ensure the server received the final ACK and to drain lingering packets from the network before recycling the port tuple.

### 2. TCP vs. UDP: Architectural Trade-Offs, Header Overheads, and Use Cases.
**In Simple Words:**
- **TCP (Transmission Control Protocol)**: Connection-oriented, guaranteed in-order delivery, retransmissions, flow control (sliding window), and congestion control. Header size is **20–60 bytes**. Best for HTTP, REST APIs, databases, file transfers, and SSH.
- **UDP (User Datagram Protocol)**: Connectionless, unreliable, no ordering guarantees, no retransmissions, zero congestion backoff. Minimal **8-byte header**. Best for live video streaming (WebRTC), DNS queries, VoIP, online gaming, and metrics collection (StatsD).

### 3. How does TCP Congestion Control work (Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery)?
**In Simple Words:**
TCP avoids saturating the network pipe using dynamic Congestion Window (`cwnd`) algorithms:
1. **Slow Start**: Begins with a small `cwnd` (e.g. 10 segments). Doubles exponentially ($2^n$) every Round-Trip Time (RTT) until reaching the Slow-Start Threshold (`ssthresh`).
2. **Congestion Avoidance**: Once past `ssthresh`, growth switches from exponential to linear (additive increase: $+1$ segment per RTT).
3. **Packet Loss Detection**:
   - **3 Duplicate ACKs**: Fast Retransmit triggers immediately without waiting for a retransmission timeout (RTO).
   - **Timeout (RTO)**: Severe congestion signal; `ssthresh` is halved and `cwnd` resets back to 1 MSS.
4. **Modern Algorithms**: BBR (Bottleneck Bandwidth and RTT - developed by Google) measures pacing and max delivery rate instead of relying on packet loss triggers.

### 4. What is TCP Head-of-Line (HoL) Blocking, and how does it degrade performance?
**In Simple Words:**
Because TCP guarantees strict in-order packet delivery, if packet #2 is dropped in transit while packets #3, #4, and #5 arrive safely at the receiver, the OS kernel buffer holds #3, #4, and #5 in memory and refuses to pass them to the application layer until packet #2 is successfully retransmitted.
This delay is **TCP Head-of-Line Blocking**, causing latency spikes that motivated the creation of HTTP/3 (QUIC over UDP).

### 5. What are SYN Flood Attacks, and how do SYN Cookies mitigate them?
**In Simple Words:**
An attacker floods a server with thousands of `SYN` packets from spoofed IPs and never sends the concluding `ACK`. The server allocates memory in its connection backlog table for each half-open connection until memory is exhausted (Denial of Service).

**SYN Cookies Mitigation**:
The server disables allocating backlog state memory entirely. Instead, it encodes client connection parameters and a cryptographic timestamp into the 32-bit Initial Sequence Number (`ISN`) sent in the `SYN-ACK`. When the legitimate client sends `ACK`, the server recalculates the cookie. If valid, the connection is created on demand.

### 6. Explain the OSI 7-Layer Model vs. TCP/IP 4-Layer Model.
**In Simple Words:**
| OSI Layer | TCP/IP Layer | Primary Protocols | Data Unit |
| :--- | :--- | :--- | :--- |
| **7. Application / 6. Presentation / 5. Session** | **Application** | HTTP/2, HTTP/3, DNS, SSH, gRPC, TLS | Data / Message |
| **4. Transport** | **Transport** | TCP, UDP, QUIC | Segment (TCP) / Datagram (UDP) |
| **3. Network** | **Internet** | IPv4, IPv6, ICMP, BGP, OSPF | Packet |
| **2. Data Link / 1. Physical** | **Network Access** | Ethernet, Wi-Fi, MAC, ARP | Frame (L2) / Bits (L1) |

### 7. How does Maximum Transmission Unit (MTU) relate to Maximum Segment Size (MSS) and IP Fragmentation?
**In Simple Words:**
- **MTU (Maximum Transmission Unit)**: Maximum physical frame size that can pass through a network link (standard Ethernet is **1500 bytes**).
- **MSS (Maximum Segment Size)**: The maximum payload a TCP segment can carry without fragmentation:
  `MSS = MTU - (20-byte IP header + 20-byte TCP header) = 1500 - 40 = 1460 bytes`.
- **IP Fragmentation**: Occurs when a packet exceeds an intermediate router's MTU. The router fragments the packet into pieces. If any fragment is dropped, the entire packet must be resent. Modern networks use **Path MTU Discovery (PMTUD)** with the `DF` (Don't Fragment) bit set to determine the minimum MTU along the entire route.

### 8. What is the Ephemeral Port Range, and how does Port Exhaustion occur in high-concurrency reverse proxies?
**In Simple Words:**
Outgoing TCP client connections require an ephemeral port (typically 32768–60999 = ~28,232 ports on Linux).
A connection is uniquely identified by the 4-tuple: `(Source IP, Source Port, Destination IP, Destination Port)`.

If a reverse proxy (e.g. Nginx) opens 30,000 requests per minute to a single backend IP:port without connection keep-alives, closed connections remain in `TIME_WAIT` for 60 seconds. The proxy exhausts all available ephemeral ports and fails new connections with `bind: address already in use`.
*Fix*: Enable HTTP Keep-Alive connection pools to upstream backends and tune `net.ipv4.ip_local_port_range`.

### 9. Explain Nagle's Algorithm vs. `TCP_NODELAY`.
**In Simple Words:**
- **Nagle's Algorithm**: Buffers tiny outgoing data chunks and waits until either a full MSS packet accumulates or an ACK for previous data is received. Prevents sending 41-byte packets (40-byte headers + 1-byte data) across WANs.
- **Problem**: When combined with TCP Delayed ACK (receiver waits 200ms before acking), latency spikes to 200ms!
- **`TCP_NODELAY`**: Disables Nagle's algorithm. Instructs the socket to transmit bytes immediately without buffering. Essential for low-latency web services, gaming, and real-time APIs.

### 10. How does Flow Control work using the TCP Sliding Window?
**In Simple Words:**
Flow control prevents a fast sender from overwhelming a slow receiver's memory buffer.
The receiver advertises its available buffer space via the **Receive Window (`rwnd`)** field in every TCP header. The sender can only transmit unacknowledged bytes up to `min(cwnd, rwnd)`. If `rwnd = 0`, the sender pauses and periodically transmits 1-byte probe packets until the receiver reopens its window.

---

## Part 2: HTTP Protocols (HTTP/1.1, HTTP/2 & HTTP/3 QUIC) (11 - 25)

### 11. Compare HTTP/1.1, HTTP/2, and HTTP/3: Architectural Deep-Dive.
**In Simple Words:**
- **HTTP/1.1**: Text-based protocol. Supports persistent TCP connections (`Keep-Alive`), but suffers from HTTP Head-of-Line blocking: only one request/response can travel through a TCP connection at a time.
- **HTTP/2**: Binary framing layer. Multiplexes hundreds of concurrent requests/responses as independent streams over a **single TCP connection**. Includes HPACK header compression and Server Push. *Flaw*: A single dropped packet stalls ALL streams due to TCP HoL blocking.
- **HTTP/3**: Replaces TCP with **QUIC over UDP**. Multiplexes streams independently: packet loss on Stream A does NOT block Stream B! Includes built-in TLS 1.3 encryption and Connection Migration (seamless handover from Wi-Fi to 5G via Connection IDs).

### 12. How does HTTP/2 Multiplexing work (Frames, Messages, and Streams)?
**In Simple Words:**
In HTTP/2:
1. **Stream**: A bidirectional virtual channel within a TCP connection carrying a unique stream ID.
2. **Message**: A complete logical HTTP request or response composed of multiple frames.
3. **Frame**: The smallest atomic unit (e.g. `HEADERS` frame, `DATA` frame).

Frames from multiple independent streams interleave over a single TCP socket. The client and server reassemble frames into complete messages using their stream IDs, eliminating the need for domain sharding or multiple parallel connections.

### 13. What is HPACK Header Compression in HTTP/2?
**In Simple Words:**
In HTTP/1.1, identical headers (`User-Agent`, `Cookie`, `Authorization`) are resent in plaintext with every single request, wasting 500B–2KB per request.

**HPACK**:
- Maintains a **Static Table** of 61 common headers (e.g. index 2 = `method: GET`, index 7 = `scheme: https`).
- Maintains a stateful **Dynamic Table** shared between client and server. Subsequent requests only transmit the integer index of previously declared headers.
- Encodes variable strings using **Huffman Coding**, reducing header overhead by over 80%.

### 14. How does HTTP/3 QUIC solve Connection Migration during Network Handover?
**In Simple Words:**
In TCP, a connection is bound to a 4-tuple: `(Client IP, Client Port, Server IP, Server Port)`. When a smartphone switches from home Wi-Fi to cellular 5G, the Client IP changes, instantly breaking the TCP socket and requiring a new 3-way handshake and TLS negotiation.

In **QUIC (HTTP/3)**:
Connections are identified by an opaque 64-bit **Connection ID (CID)** independent of IP addresses. When switching networks, the client sends packets with the same CID from its new 5G IP address. The server seamlessly continues streaming without interruption or re-handshake!

### 15. What are HTTP Methods: Idempotency vs. Safety?
**In Simple Words:**
- **Safe Methods**: Read-only operations that do not modify server state (`GET`, `HEAD`, `OPTIONS`, `TRACE`). Safe to cache and prefetch.
- **Idempotent Methods**: Making the same request $N$ times produces the exact same server state as making it once (`GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`).
- **Non-Idempotent Methods**: Executing multiple times creates duplicate records or cumulative side-effects (`POST`, `PATCH` when performing relative mutations like `balance += 10`).

---

## Part 3: DNS, TLS 1.3 & Web Security Protocols (26 - 38)

### 16. Walk through the complete DNS Resolution Lifecycle from Browser to Authoritative Nameserver.
**In Simple Words:**
When typing `https://api.example.com`:
1. **Browser Cache**: Checks local browser DNS cache (e.g. Chrome DNS cache for 60s).
2. **OS Cache & `hosts` file**: Checks local operating system cache (`gethostbyname`).
3. **Recursive Resolver (ISP / 1.1.1.1 / 8.8.8.8)**: Queries local recursive DNS server.
4. **Root Nameserver (`.`)**: Directs the resolver to the **TLD Nameserver** (`.com`).
5. **TLD Nameserver (`.com`)**: Directs the resolver to the **Authoritative Nameserver** for `example.com` (e.g. AWS Route 53, Cloudflare).
6. **Authoritative Nameserver**: Returns the actual IP address record (`A` for IPv4, `AAAA` for IPv6) along with the **TTL (Time to Live)**.
7. Resolver caches the IP and returns it to the client.

### 17. Explain Common DNS Record Types: A, AAAA, CNAME, ALIAS, MX, TXT, and PTR.
**In Simple Words:**
- **`A`**: Maps a hostname to an IPv4 address (`93.184.216.34`).
- **`AAAA`**: Maps a hostname to an IPv6 address.
- **`CNAME` (Canonical Name)**: An alias mapping one domain to another domain (`blog.example.com` -> `cdn.hashnode.com`). Cannot exist at the zone apex (`example.com`).
- **`ALIAS / ANAME`**: Virtual record provided by DNS vendors (Route 53, Cloudflare) that flattens a CNAME at the root zone apex.
- **`MX` (Mail Exchange)**: Specifies mail servers with priority weights.
- **`TXT`**: Stores arbitrary text; used for domain ownership verification, **SPF**, and **DKIM** email security.
- **`PTR` (Pointer)**: Reverse DNS mapping an IP address back to a hostname.

### 18. How does the TLS 1.3 Handshake work, and how does it achieve 1-RTT (and 0-RTT Resumption)?
**In Simple Words:**
TLS 1.2 required **2 round-trips (2-RTT)** before encrypted application data could be sent.

**TLS 1.3 (1-RTT)**:
1. **ClientHello**: Client sends supported cipher suites AND immediately guesses the key exchange algorithm by sending its **Diffie-Hellman Key Share**.
2. **ServerHello**: Server picks the cipher suite, sends its key share, server certificate, and finishes authentication.
3. Both sides calculate the shared symmetric session key immediately. **Round trips cut in half!**

**0-RTT Early Data**:
If a client has previously connected to the server, it can encrypt application payload immediately in the first `ClientHello` using a Pre-Shared Key (PSK). *Security caution*: 0-RTT is vulnerable to replay attacks; never send non-idempotent `POST` mutations in 0-RTT data!

### 19. Public Key Infrastructure (PKI): How do Certificate Authorities (CA) and Certificate Chains validate SSL certificates?
**In Simple Words:**
When a server presents an SSL certificate:
1. The browser inspects the certificate's **Digital Signature**, signed by an Intermediate CA.
2. The browser validates the Intermediate CA's signature, signed by a **Root CA**.
3. The browser checks if the Root CA exists in its pre-installed, trusted operating system/browser **Trust Store**.
4. Checks domain validity (Subject Alternative Name / SAN matches requested URL) and expiration date.
5. Checks revocation status via **OCSP (Online Certificate Status Protocol) Stapling** or CRL.

### 20. What is Server Name Indication (SNI), and why is it needed for virtual hosting over TLS?
**In Simple Words:**
In traditional HTTPS, the TLS handshake happens before the HTTP request is decrypted. If a single IP address hosts 100 different domains, the server doesn't know which domain's SSL certificate to present!

**SNI**:
The client includes the target domain name in plaintext inside the initial `ClientHello` packet. This allows the server to look up and present the correct certificate for that specific virtual host before encryption begins. (Encrypted Client Hello / ECH is evolving to encrypt this field).

---

## Part 4: Real-Time Protocols (WebSockets, SSE & WebRTC) (39 - 50)

### 21. How does the WebSocket Handshake work (HTTP 101 Switching Protocols)?
**In Simple Words:**
A WebSocket starts as a standard HTTP/1.1 request that upgrades into a persistent, bidirectional TCP connection:
1. Client sends an HTTP GET with upgrade headers:
   `Upgrade: websocket`
   `Connection: Upgrade`
   `Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==`
2. Server responds with HTTP status **`101 Switching Protocols`** and `Sec-WebSocket-Accept`.
3. The underlying TCP socket remains open; both client and server can now stream binary/text **frames** bidirectionally with only 2–10 bytes of framing overhead.

### 22. WebSockets vs. Server-Sent Events (SSE) vs. Long Polling: Architectural Decision Matrix.
**In Simple Words:**
| Feature | WebSockets | Server-Sent Events (SSE) | Long Polling |
| :--- | :--- | :--- | :--- |
| **Direction** | Full-duplex (Bidirectional) | Unidirectional (Server -> Client) | Half-duplex (Simulated push) |
| **Protocol** | Custom `ws://` framing over TCP | Pure standard HTTP/1.1 or HTTP/2 | Standard HTTP/1.1 |
| **Reconnection** | Must implement manually | Native automatic reconnection in browser | Manual loop |
| **Firewall / Proxy** | Can be blocked by corporate proxies | Passes through firewalls seamlessly | High HTTP header overhead |
| **Sweet Spot** | Real-time chat, multiplayer games, collaborative tools | AI LLM token streaming, live dashboards, stock tickers | Legacy fallback when websockets fail |

### 23. How does WebRTC achieve Peer-to-Peer Real-Time Audio/Video (ICE, STUN, TURN, and SDP)?
**In Simple Words:**
WebRTC allows browsers to stream audio, video, and data directly to each other without routing media through a central web server:
1. **SDP (Session Description Protocol)**: Describes media capabilities (codecs, resolutions, encryption keys). Exchanged between peers via a lightweight signaling server (WebSocket/HTTP).
2. **NAT Traversal with ICE (Interactive Connectivity Establishment)**:
   - **STUN (Session Traversal Utilities for NAT)**: A public server tells each peer their real external public IP and port.
   - **TURN (Traversal Using Relays around NAT)**: Fallback relay server used when symmetric NATs or restrictive enterprise firewalls prevent direct peer-to-peer connections (~10–15% of calls).

### 24. What are Webhook Replay Attacks, and how do HMAC Signatures prevent them?
**In Simple Words:**
A webhook replay attack occurs when an attacker intercepts a legitimate webhook payload (e.g. `stripe.payment_succeeded`) and resends it repeatedly to trigger duplicate credits.

**Mitigation**:
1. **Timestamp**: Include a UNIX timestamp in the header (`X-Webhook-Timestamp`). Receiver rejects requests older than 5 minutes.
2. **HMAC Signature**: Provider calculates `HMAC-SHA256(secret, timestamp + "." + payload)` and sends it in `X-Signature`. Receiver recalculates the signature; any alteration to the payload or timestamp invalidates the signature.
3. **Idempotency Key**: Store event IDs in a database to ensure deduplication.

### 25. Senior Architect Conclusion: Summary of Modern Network Engineering Principles.
**In Simple Words:**
1. Minimize Round-Trip Times (RTT) by terminating TLS at the network Edge (Cloudflare, CloudFront).
2. Use **HTTP/3 (QUIC)** for lossy mobile networks to prevent head-of-line blocking.
3. Choose the simplest protocol that satisfies communication needs: use **SSE** for server streaming (AI generation, live counters) before jumping to heavy bidirectional **WebSockets**.
4. Always enforce end-to-end security with TLS 1.3, strict CORS, and HMAC webhook verification.
